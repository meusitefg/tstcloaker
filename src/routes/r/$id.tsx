import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { registerVisit } from "@/lib/links";
import { pageTemplates, renderTemplate, type PageTemplate } from "@/lib/page-templates";

export const Route = createFileRoute("/r/$id")({
  component: RedirectPage,
});

function RedirectPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [safeTemplate, setSafeTemplate] = useState<PageTemplate | null>(null);
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check query params: ?bot=1 or ?preview=safe forces safe page simulation
    const searchParams = new URLSearchParams(window.location.search);
    const forceSafe = searchParams.get("bot") === "1" || searchParams.get("preview") === "safe";

    const destination = registerVisit(id, forceSafe ? true : undefined);

    if (!destination) {
      navigate({ to: "/", replace: true });
      return;
    }

    // Determine if it was routed to safe page
    const isBot = forceSafe || destination.includes("/safe/") || isLocalSafePage(destination);

    if (isBot) {
      const templateId = extractTemplateId(destination) || "bella";
      const template = pageTemplates.find((t) => t.id === templateId) || pageTemplates[0]!;
      setSafeTemplate(template);
      setRedirecting(false);
    } else {
      // Normal human: redirect to real offer
      window.location.href = destination;
    }
  }, [id, navigate]);

  if (safeTemplate) {
    const html = renderTemplate(safeTemplate);
    return (
      <div className="fixed inset-0 h-screen w-screen bg-white">
        <iframe
          srcDoc={html}
          title={safeTemplate.name}
          className="h-full w-full border-none"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d0f10] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="size-10 animate-spin rounded-full border-4 border-[#00E676] border-t-transparent" />
        <p className="text-sm text-gray-400">Verificando e redirecionando...</p>
      </div>
    </div>
  );
}

function isLocalSafePage(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === window.location.hostname;
  } catch {
    return false;
  }
}

function extractTemplateId(url: string): string | null {
  const match = url.match(/\/safe\/([^/?#]+)/);
  return match?.[1] ?? null;
}
