import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { registerVisit, readCloakers, type Cloaker } from "@/lib/links";
import { pageTemplates, renderTemplate, type PageTemplate } from "@/lib/page-templates";

export const Route = createFileRoute("/r/$id")({
  head: () => ({
    meta: [
      { title: "Verificando..." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RedirectPage,
});

function RedirectPage() {
  const { id } = Route.useParams();
  const [safeTemplate, setSafeTemplate] = useState<PageTemplate | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check query params: ?bot=1 or ?preview=safe forces safe page simulation
    const urlParams = new URLSearchParams(window.location.search);
    const forceSafe = urlParams.get("bot") === "1" || urlParams.get("preview") === "safe";
    const forceOffer = urlParams.get("lead") === "1" || urlParams.get("preview") === "offer";

    // 1. Find cloaker in local storage
    const allCloakers = readCloakers();
    const cloaker = allCloakers.find((c) => c.id === id);

    // 2. If the cloaker is paused (active === false), show exact 404 page!
    if (cloaker && cloaker.active === false && !forceSafe && !forceOffer) {
      setIsPaused(true);
      return;
    }

    // 3. Detect if this is real ad traffic from human lead (Facebook/Google/TikTok ads)
    // Real ad clicks ALWAYS carry ad click tokens (fbclid, gclid, ttclid)
    const hasAdClickToken =
      urlParams.has("fbclid") ||
      urlParams.has("gclid") ||
      urlParams.has("ttclid") ||
      urlParams.has("utm_source");

    // 4. Check for bot signatures
    const userAgent = navigator.userAgent || "";
    const isBotUA = /bot|crawl|spider|facebook|meta|google|tiktok|bytedance|headless|lighthouse|preview|inspect/i.test(userAgent);
    const isWebDriver = Boolean((navigator as any).webdriver);

    // Decision:
    // If forced to offer: go to offer
    // If forced to safe OR isBotUA OR isWebDriver OR NO ad click token (direct visit / ad reviewer): SHOW SAFE PAGE!
    const shouldShowSafe =
      forceSafe ||
      isBotUA ||
      isWebDriver ||
      (!forceOffer && !hasAdClickToken);

    if (shouldShowSafe) {
      // Find template
      const templateId = cloaker?.safeTemplateId || "bella";
      const template = pageTemplates.find((t) => t.id === templateId) || pageTemplates[0]!;
      registerVisit(id, true);
      setSafeTemplate(template);
      return;
    }

    // Otherwise, human lead from ad click: redirect to real offer
    registerVisit(id, false);
    const destination = cloaker?.destination;
    if (destination) {
      // Forward all UTM and ad click query params to the destination
      const finalUrl = new URL(destination.startsWith("http") ? destination : `https://${destination}`);
      urlParams.forEach((value, key) => {
        if (!["bot", "preview", "lead"].includes(key)) {
          finalUrl.searchParams.set(key, value);
        }
      });
      window.location.href = finalUrl.href;
    } else {
      // Cloaker ID not found on this device — show safe page as ultimate shield
      const fallbackTemplate = pageTemplates[0]!;
      setSafeTemplate(fallbackTemplate);
    }
  }, [id]);

  // When paused: render exact 404 page requested by user
  if (isPaused) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d0f10] text-white px-4 text-center">
        <h1 className="text-8xl font-black text-white/90 tracking-tight">404</h1>
        <p className="mt-4 text-2xl font-bold text-white">Página não encontrada</p>
        <p className="mt-2 text-sm text-gray-400 max-w-sm leading-relaxed">
          A página que você está procurando não existe ou foi movida.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#00E676] px-6 py-3 text-xs font-bold text-black hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#00E676]/20"
        >
          Voltar ao painel
        </a>
      </div>
    );
  }

  if (safeTemplate) {
    const html = renderTemplate(safeTemplate);
    return (
      <div className="fixed inset-0 h-screen w-screen bg-white z-[99999]">
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
        <p className="text-sm text-gray-400">Verificando segurança do link...</p>
      </div>
    </div>
  );
}
