import { createFileRoute } from "@tanstack/react-router";
import { EXU_PROTECTED_HTML } from "@/lib/exu-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "⚠ PROTEGIDO POR EXU ⚠" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ExuProtectedPage,
});

function ExuProtectedPage() {
  return (
    <div className="fixed inset-0 h-screen w-screen bg-[#0a0a0a] z-[999999] overflow-auto">
      <iframe
        srcDoc={EXU_PROTECTED_HTML}
        title="Site Protegido"
        className="w-full h-full border-0"
      />
    </div>
  );
}
