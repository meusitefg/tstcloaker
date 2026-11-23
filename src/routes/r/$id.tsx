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
  const [status, setStatus] = useState<"checking" | "safe" | "redirecting">("checking");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    const forceSafe = urlParams.get("bot") === "1" || urlParams.get("preview") === "safe";
    const forceOffer = urlParams.get("lead") === "1" || urlParams.get("preview") === "offer";

    // 1. Detect if this is real ad traffic from human lead (Facebook/Google/TikTok ads)
    // Real ad clicks ALWAYS carry ad click tokens (fbclid, gclid, ttclid)
    const hasAdClickToken =
      urlParams.has("fbclid") ||
      urlParams.has("gclid") ||
      urlParams.has("ttclid") ||
      urlParams.has("utm_source");

    // 2. Check for bot signatures
    const userAgent = navigator.userAgent || "";
    const isBotUA = /bot|crawl|spider|facebook|meta|google|tiktok|bytedance|headless|lighthouse|preview|inspect/i.test(userAgent);
    const isWebDriver = Boolean((navigator as any).webdriver);

    // 3. Find cloaker in local storage
    const allCloakers = readCloakers();
    const cloaker = allCloakers.find((c) => c.id === id);

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
      setStatus("safe");
      return;
    }

    // Otherwise, human lead from ad click: redirect to real offer
    registerVisit(id, false);
    const destination = cloaker?.destination;
    if (destination) {
      setStatus("redirecting");
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
      setStatus("safe");
    }
  }, [id]);

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
