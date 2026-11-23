import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Eye, FileCode, Folder, Plus, X, ShieldCheck, ExternalLink, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, Panel, PrimaryButton } from "@/components/AppShell";
import { pageTemplates, renderTemplate, type PageTemplate } from "@/lib/page-templates";

export const Route = createFileRoute("/paginas")({
  head: () => ({
    meta: [
      { title: "Páginas Safe | Cloakfy" },
      { name: "description", content: "Templates prontos para usar como página segura (white) nos seus cloakers." },
      { property: "og:title", content: "Páginas Safe | Cloakfy" },
      { property: "og:description", content: "Templates prontos para usar como página segura (white) nos seus cloakers." },
    ],
  }),
  component: SafePages,
});

const cats = ["Todos", "Beleza", "Consultoria", "E-commerce", "Educação", "Finanças", "Saúde", "Tecnologia"];

function SafePages() {
  const [cat, setCat] = useState("Todos");
  const [preview, setPreview] = useState<PageTemplate | null>(null);
  const [custom, setCustom] = useState(false);

  const list = pageTemplates.filter((t) => cat === "Todos" || t.category === cat);

  const copy = async (t: PageTemplate) => {
    await navigator.clipboard.writeText(renderTemplate(t));
    toast.success("Código HTML da Página Safe copiado!");
  };

  const openInTab = (t: PageTemplate) => {
    const html = renderTemplate(t);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener");
    toast.success(`Página "${t.name}" aberta em nova aba!`);
  };

  return (
    <AppShell title="Páginas Safe">
      <PageHeader
        title="Páginas Safe"
        subtitle="Templates prontos para usar como página segura (white) nos seus cloakers."
      />

      {/* Minha página (HTML próprio) - Matching Screenshot 5 */}
      <h2 className="text-sm font-semibold text-white">Minha página (HTML próprio)</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Cole seu próprio HTML — servido transparente no seu domínio, sem expor a Cloakfy.
      </p>

      {custom ? (
        <CustomHtml onClose={() => setCustom(false)} />
      ) : (
        <Panel className="mt-4 flex flex-col items-center px-6 py-12 text-center bg-[#14171a] border-border">
          <div className="grid size-12 place-items-center rounded-xl bg-secondary text-muted-foreground">
            <FileCode className="size-6" />
          </div>
          <p className="mt-4 font-semibold text-white">Nenhuma página própria ainda</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Crie uma com o seu HTML para usar como página safe.
          </p>
          <div className="mt-5">
            <PrimaryButton onClick={() => setCustom(true)} className="text-xs">
              <Plus className="size-4 stroke-[3]" />
              Criar HTML
            </PrimaryButton>
          </div>
        </Panel>
      )}

      {/* Category Tabs - Matching Screenshot 5 */}
      <div className="mt-10 flex gap-6 overflow-x-auto border-b border-border text-xs font-medium">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`whitespace-nowrap border-b-2 pb-3 transition-colors ${
              cat === c
                ? "border-primary font-bold text-white"
                : "border-transparent text-muted-foreground hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Templates Grid - Matching Screenshot 5 */}
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((t) => (
          <Panel key={t.id} className="bg-[#14171a] border-border overflow-hidden">
            {/* Live miniature preview */}
            <div className="pointer-events-none h-48 overflow-hidden border-b border-border bg-white">
              <iframe
                title={t.name}
                srcDoc={renderTemplate(t)}
                className="h-[600px] w-[200%] origin-top-left scale-50"
                tabIndex={-1}
              />
            </div>
            <div className="p-4">
              <p className="font-semibold text-sm text-white truncate">{t.name}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Folder className="size-3 text-primary" />
                {t.category}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPreview(t)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card/60 py-2 text-xs font-medium text-white hover:bg-accent transition-colors"
                >
                  <Eye className="size-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => openInTab(t)}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all"
                >
                  <ExternalLink className="size-3.5" />
                  Usar
                </button>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      {/* Full Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/90 p-6 backdrop-blur-md"
          onClick={() => setPreview(null)}
        >
          <div
            className="mb-3 flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <p className="font-semibold text-white text-sm">{preview.name}</p>
            </div>
            <div className="flex gap-2">
              <PrimaryButton onClick={() => copy(preview)} className="text-xs">
                <Copy className="size-3.5" />
                Copiar HTML
              </PrimaryButton>
              <button
                onClick={() => openInTab(preview)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs font-medium text-white hover:bg-accent transition-colors"
              >
                <ExternalLink className="size-3.5" />
                Abrir
              </button>
              <button
                aria-label="Fechar"
                onClick={() => setPreview(null)}
                className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
          <iframe
            title="Prévia"
            srcDoc={renderTemplate(preview)}
            className="flex-1 rounded-xl border border-border bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </AppShell>
  );
}

function CustomHtml({ onClose }: { onClose: () => void }) {
  const [html, setHtml] = useState(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Minha Página Segura</title><style>body{font-family:sans-serif;margin:40px;text-align:center;color:#333;}</style></head><body><h1>Bem-vindo à nossa página</h1><p>Conteúdo em conformidade com as diretrizes.</p></body></html>`
  );

  return (
    <Panel className="mt-4 grid md:grid-cols-2 bg-[#14171a] border-border overflow-hidden">
      <div className="p-4 border-b border-border md:border-r md:border-b-0 flex flex-col">
        <label className="text-xs font-semibold text-muted-foreground mb-2">Editor HTML</label>
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          className="min-h-72 w-full flex-1 resize-none rounded-lg border border-border bg-[#0d0f10] p-3 font-mono text-xs text-white outline-none focus:border-primary"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-muted-foreground p-4 pb-0">Prévia em tempo real</label>
        <iframe
          title="Prévia do HTML"
          sandbox=""
          srcDoc={html}
          className="min-h-60 flex-1 m-4 rounded-lg border border-border bg-white"
        />
        <div className="flex justify-end gap-2 border-t border-border p-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-white"
          >
            Fechar
          </button>
          <PrimaryButton
            onClick={async () => {
              await navigator.clipboard.writeText(html);
              toast.success("HTML copiado!");
            }}
            className="text-xs"
          >
            <Copy className="size-3.5" />
            Salvar & Copiar
          </PrimaryButton>
        </div>
      </div>
    </Panel>
  );
}
