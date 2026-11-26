import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { EXU_PROTECTED_HTML } from "./lib/exu-page";

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
const serverCustomPages = new Map<string, any>();

const SUPABASE_URL = "https://vlsnxbszmhisromyzczx.supabase.co";
const SUPABASE_KEY = "sb_publishable_SF25OuZLX7xc1MsGltU3lg_EE0nyxH4";

const PERSISTENT_API = "https://api.restful-api.dev/objects/ff808181a09d98f701a20a7990ee2bb2";
let syncInitialized = false;

async function syncFromCloudStore() {
  try {
    const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/links?select=*`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (supaRes.ok) {
      const links: any = await supaRes.json();
      if (Array.isArray(links)) {
        serverCloakers.clear();
        links.forEach((l: any) => {
          serverCloakers.set(l.id, {
            id: l.id,
            name: l.name,
            destination: l.offer_url,
            safePage: l.safe_url,
            safeTemplateId: l.safe_url?.includes("/safe/") ? l.safe_url.split("/safe/")[1] : "bella",
            active: l.status === "active",
            visits: (l.clicks_human || 0) + (l.clicks_bot || 0),
            humanVisits: l.clicks_human || 0,
            botVisits: l.clicks_bot || 0,
          });
        });
        return;
      }
    }
  } catch {}

  try {
    const res = await fetch(PERSISTENT_API);
    if (res.ok) {
      const json: any = await res.json();
      if (json?.data) {
        if (Array.isArray(json.data.cloakers)) {
          serverCloakers.clear();
          json.data.cloakers.forEach((c: any) => {
            if (c?.id) serverCloakers.set(c.id, c);
          });
        }
        if (Array.isArray(json.data.deleted)) {
          json.data.deleted.forEach((id: string) => serverDeletedIds.add(id));
        }
      }
    }
  } catch (err) {
    console.error("Failed to sync from cloud store:", err);
  }
}

async function persistToCloudStore() {
  // Sync to Supabase links table
  try {
    const cloakersList = Array.from(serverCloakers.values());
    for (const c of cloakersList) {
      await fetch(`${SUPABASE_URL}/rest/v1/links`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          id: c.id,
          name: c.name,
          slug: c.id,
          safe_url: c.safePage,
          offer_url: c.destination,
          status: c.active ? "active" : "paused",
          clicks_human: c.humanVisits || 0,
          clicks_bot: c.botVisits || 0,
        }),
      });
    }

    for (const delId of serverDeletedIds) {
      await fetch(`${SUPABASE_URL}/rest/v1/links?id=eq.${delId}`, {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
    }
  } catch {}

  try {
    await fetch(PERSISTENT_API, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "cloakers-sync",
        data: {
          cloakers: Array.from(serverCloakers.values()),
          deleted: Array.from(serverDeletedIds),
        },
      }),
    });
  } catch (err) {
    console.error("Failed to persist to cloud store:", err);
  }
}

function render404Html(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>404 - Página não encontrada</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #0d0f10;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      min-height: 100vh;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 1rem;
      box-sizing: border-box;
    }
    h1 {
      font-size: 6rem;
      font-weight: 900;
      margin: 0;
      letter-spacing: -0.05em;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1;
    }
    p.title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 1rem 0 0.5rem 0;
    }
    p.desc {
      font-size: 0.875rem;
      color: #9ca3af;
      max-width: 24rem;
      margin: 0 0 1.5rem 0;
      line-height: 1.5;
    }
    a.btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.75rem;
      background: #00E676;
      padding: 0.75rem 1.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: #000;
      text-decoration: none;
      box-shadow: 0 10px 15px -3px rgba(0, 230, 118, 0.2);
      transition: filter 0.15s ease;
    }
    a.btn:hover {
      filter: brightness(1.1);
    }
  </style>
</head>
<body>
  <h1>404</h1>
  <p class="title">Página não encontrada</p>
  <p class="desc">A página que você está procurando não existe ou foi movida.</p>
  <a href="/" class="btn">Voltar ao painel</a>
</body>
</html>`;
}

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

    // Root path "/" -> Serve EXU PROTECTED HTML!
    if (url.pathname === "/" || url.pathname === "") {
      return new Response(EXU_PROTECTED_HTML, {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    // Custom Safe Pages sync API
    if (url.pathname === "/api/custom-pages") {
      if (request.method === "GET") {
        return new Response(JSON.stringify(Array.from(serverCustomPages.values())), {
          headers: {
            "content-type": "application/json",
            "cache-control": "no-store",
            "access-control-allow-origin": "*",
          },
        });
      }
      if (request.method === "POST") {
        try {
          const body: any = await request.json();
          if (Array.isArray(body)) {
            body.forEach((p: any) => {
              if (p?.id) serverCustomPages.set(p.id, p);
            });
          } else if (body?.id) {
            serverCustomPages.set(body.id, body);
          }
          return new Response(JSON.stringify({ ok: true }), {
            headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
          });
        } catch {
          return new Response(JSON.stringify({ ok: false }), { status: 400 });
        }
      }
    }

    if (url.pathname.startsWith("/api/custom-pages/delete/")) {
      const id = url.pathname.replace("/api/custom-pages/delete/", "");
      serverCustomPages.delete(id);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
      });
    }

    // Direct serve custom safe page
    if (url.pathname.startsWith("/safe/")) {
      const safeId = (url.pathname.replace("/safe/", "").split("?")[0]) || "";
      const custom = serverCustomPages.get(safeId);
      if (custom?.html) {
        return new Response(custom.html, {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
    }

    // Cross-device sync API: makes cloakers created on PC immediately available on mobile and vice-versa
    if (url.pathname === "/api/cloakers") {
      if (!syncInitialized || serverCloakers.size === 0) {
        await syncFromCloudStore();
        syncInitialized = true;
      }

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
          if (body?.cloakers && Array.isArray(body.cloakers)) {
            serverCloakers.clear();
            body.cloakers.forEach((c: any) => {
              if (c?.id) serverCloakers.set(c.id, c);
            });
            if (Array.isArray(body.deleted)) {
              body.deleted.forEach((id: string) => serverDeletedIds.add(id));
            }
          } else if (Array.isArray(body)) {
            serverCloakers.clear();
            body.forEach((c: any) => {
              if (c?.id) serverCloakers.set(c.id, c);
            });
          } else if (body?.id) {
            serverCloakers.set(body.id, body);
          }

          // Clean up any deleted
          for (const delId of serverDeletedIds) {
            serverCloakers.delete(delId);
          }

          await persistToCloudStore();

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
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/links?id=eq.${id}`, {
          method: "DELETE",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        });
      } catch {}
      await persistToCloudStore();
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
      });
    }

    // Direct 404 check for /r/$id on server (instant edge sync)
    if (url.pathname.startsWith("/r/")) {
      const pathPart = url.pathname.replace("/r/", "").split("?")[0] || "";
      const rawId = pathPart.split("/")[0] || "";

      if (rawId) {
        if (serverDeletedIds.has(rawId)) {
          return new Response(render404Html(), {
            status: 404,
            headers: {
              "content-type": "text/html; charset=utf-8",
              "cache-control": "no-store, no-cache, must-revalidate",
            },
          });
        }

        try {
          const supaRes = await fetch(
            `${SUPABASE_URL}/rest/v1/links?or=(id.eq.${rawId},slug.eq.${rawId})&select=*`,
            {
              headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`,
              },
              cache: "no-store",
            }
          );
          if (supaRes.ok) {
            const links: any = await supaRes.json();
            if (!Array.isArray(links) || links.length === 0) {
              // Deleted from Supabase -> Return 404!
              serverDeletedIds.add(rawId);
              serverCloakers.delete(rawId);
              return new Response(render404Html(), {
                status: 404,
                headers: {
                  "content-type": "text/html; charset=utf-8",
                  "cache-control": "no-store, no-cache, must-revalidate",
                },
              });
            }

            const targetLink = links[0];
            if (targetLink.status === "paused") {
              // Paused in Supabase -> Return 404!
              return new Response(render404Html(), {
                status: 404,
                headers: {
                  "content-type": "text/html; charset=utf-8",
                  "cache-control": "no-store, no-cache, must-revalidate",
                },
              });
            }
          }
        } catch (e) {
          console.error("Supabase edge check error:", e);
        }

        const cloaker = serverCloakers.get(rawId);
        if (cloaker && cloaker.active === false) {
          return new Response(render404Html(), {
            status: 404,
            headers: {
              "content-type": "text/html; charset=utf-8",
              "cache-control": "no-store, no-cache, must-revalidate",
            },
          });
        }
      }
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
