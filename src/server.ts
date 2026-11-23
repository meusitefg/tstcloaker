import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// In-memory global store in the worker to sync cloakers between PC, mobile, and ad crawlers
const serverCloakers = new Map<string, any>();
const serverDeletedIds = new Set<string>();

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    // Cross-device sync API: makes cloakers created on PC immediately available on mobile and vice-versa
    if (url.pathname === "/api/cloakers") {
      if (request.method === "GET") {
        return new Response(
          JSON.stringify({
            cloakers: Array.from(serverCloakers.values()),
            deleted: Array.from(serverDeletedIds),
          }),
          {
            headers: {
              "content-type": "application/json",
              "cache-control": "no-store",
              "access-control-allow-origin": "*",
            },
          }
        );
      }
      if (request.method === "POST") {
        try {
          const body: any = await request.json();
          if (Array.isArray(body)) {
            body.forEach((c: any) => {
              if (c?.id) serverCloakers.set(c.id, c);
            });
          } else if (body?.id) {
            serverCloakers.set(body.id, body);
          }
          return new Response(JSON.stringify({ ok: true }), {
            headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
          });
        } catch {
          return new Response(JSON.stringify({ ok: false }), { status: 400 });
        }
      }
    }

    if (url.pathname.startsWith("/api/cloakers/delete/")) {
      const id = url.pathname.replace("/api/cloakers/delete/", "");
      serverCloakers.delete(id);
      serverDeletedIds.add(id);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
      });
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
