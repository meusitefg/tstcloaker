import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Copy,
  Eye,
  FileCode,
  Folder,
  Plus,
  X,
  ShieldCheck,
  ExternalLink,
  Trash2,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, Panel, PrimaryButton, useNewCloaker } from "@/components/AppShell";
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

export const TOPICOS = [
  "Todos",
  "Beleza",
  "Consultoria",
  "E-commerce",
  "Educação",
  "Finanças",
  "Saúde",
  "Tecnologia",
];

type CustomPage = {
  id: string;
  title: string;
  topic: string;
  html: string;
  createdAt: string;
};

const STORAGE_CUSTOM_PAGES = "cloakfy-custom-pages";

function readCustomPages(): CustomPage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_PAGES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCustomPages(pages: CustomPage[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_CUSTOM_PAGES, JSON.stringify(pages));
  }
}

function SafePages() {
  const [cat, setCat] = useState("Todos");
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [filtroTopicoCustom, setFiltroTopicoCustom] = useState("Todos");
  const [preview, setPreview] = useState<{ title: string; html: string } | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const openNewCloaker = useNewCloaker();

  useEffect(() => {
    setCustomPages(readCustomPages());
  }, []);

  const list = pageTemplates.filter((t) => cat === "Todos" || t.category === cat);

  const paginasCustomFiltradas = customPages.filter(
    (p) => filtroTopicoCustom === "Todos" || p.topic === filtroTopicoCustom
  );

  const handleDeleteCustomPage = (id: string) => {
    if (confirm("Deseja realmente excluir esta página personalizada?")) {
      const next = customPages.filter((p) => p.id !== id);
      setCustomPages(next);
      writeCustomPages(next);
      toast.success("Página excluída com sucesso!");
    }
  };

  const handleSaveCustomPage = (page: Omit<CustomPage, "id" | "createdAt">) => {
    const newPage: CustomPage = {
      ...page,
      id: Math.random().toString(36).slice(2, 9),
      createdAt: new Date().toISOString(),
    };
    const next = [newPage, ...customPages];
    setCustomPages(next);
    writeCustomPages(next);
    setShowEditor(false);
    toast.success("Página personalizada salva com sucesso!");
  };

  const copyHtml = async (html: string) => {
    await navigator.clipboard.writeText(html);
    toast.success("Código HTML copiado!");
  };

  const handleUseTemplate = (t: PageTemplate) => {
    openNewCloaker({ safeTemplateId: t.id });
    toast.success(`Template "${t.name}" selecionado para o novo cloaker!`);
  };

  const handleUseCustomPage = (p: CustomPage) => {
    openNewCloaker({ name: p.title });
    toast.success(`Página "${p.title}" pronta para usar como white page!`);
  };

  return (
    <AppShell title="Páginas Safe">
      <PageHeader
        title="Páginas Safe"
        subtitle="Templates prontos para usar como página segura (white) nos seus cloakers."
      />

      {/* Minha página (HTML próprio) Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCode className="size-4 text-primary" />
            Minha página (HTML próprio)
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Cole seu próprio HTML — servido transparente no seu domínio com preview e organização por tópicos.
          </p>
        </div>
        {!showEditor && (
          <button
            onClick={() => setShowEditor(true)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all shadow-sm"
          >
            <Plus className="size-3.5 stroke-[3]" />
            Criar HTML
          </button>
        )}
      </div>

      {/* Editor or List of Custom Pages */}
      {showEditor ? (
        <CustomHtmlEditor
          onSave={handleSaveCustomPage}
          onClose={() => setShowEditor(false)}
        />
      ) : customPages.length === 0 ? (
        <Panel className="mt-3 flex flex-col items-center px-6 py-10 text-center bg-[#14171a] border-border">
          <div className="grid size-12 place-items-center rounded-xl bg-secondary text-muted-foreground">
            <FileCode className="size-6 text-primary" />
          </div>
          <p className="mt-4 font-semibold text-white">Nenhuma página própria criada ainda</p>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            Crie sua primeira página personalizada com o seu HTML para usar como safe page em seus anúncios.
          </p>
          <div className="mt-5">
            <PrimaryButton onClick={() => setShowEditor(true)} className="text-xs">
              <Plus className="size-4 stroke-[3]" />
              Criar primeira página
            </PrimaryButton>
          </div>
        </Panel>
      ) : (
        <div className="mt-4 space-y-4">
          {/* Topic filter for custom pages */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {TOPICOS.map((t) => (
              <button
                key={t}
                onClick={() => setFiltroTopicoCustom(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                  filtroTopicoCustom === t
                    ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
                    : "bg-card/70 border-border text-muted-foreground hover:text-white hover:bg-card"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Custom pages grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginasCustomFiltradas.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-border bg-[#14171a] overflow-hidden flex flex-col hover:border-primary/40 transition-colors shadow-lg"
              >
                <div className="p-3.5 flex items-center justify-between border-b border-border bg-card/40">
                  <div className="min-w-0 flex-1 mr-2">
                    <h4 className="font-semibold text-sm text-white truncate">{p.title}</h4>
                    <span className="inline-block mt-0.5 text-[10px] font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                      {p.topic}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteCustomPage(p.id)}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg px-2 py-1 transition-colors"
                    title="Excluir página"
                  >
                    <Trash2 className="size-3.5" />
                    Excluir
                  </button>
                </div>

                {/* Live Preview Iframe */}
                <div className="h-44 w-full bg-white relative overflow-hidden pointer-events-none">
                  <iframe
                    srcDoc={p.html}
                    title={p.title}
                    sandbox="allow-scripts"
                    className="w-[200%] h-[200%] origin-top-left scale-50 border-0"
                  />
                </div>

                <div className="p-3 flex items-center justify-between gap-2 border-t border-border mt-auto bg-card/20">
                  <button
                    onClick={() => setPreview({ title: p.title, html: p.html })}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card/60 py-2 text-xs font-semibold text-white hover:bg-accent transition-colors"
                  >
                    <Eye className="size-3.5" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleUseCustomPage(p)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all"
                  >
                    <ExternalLink className="size-3.5" />
                    Usar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ready Templates Section */}
      <div className="mt-12">
        <h2 className="text-sm font-bold text-white">Templates Prontos</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Modelos de alta conversão aprovados por bots do Facebook, Google e TikTok Ads.
        </p>

        {/* Category Tabs */}
        <div className="mt-4 flex gap-6 overflow-x-auto border-b border-border text-xs font-medium">
          {TOPICOS.map((c) => (
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

        {/* Templates Grid */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((t) => (
            <Panel key={t.id} className="bg-[#14171a] border-border overflow-hidden">
              {/* Miniature live preview */}
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
                    onClick={() => setPreview({ title: t.name, html: renderTemplate(t) })}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card/60 py-2 text-xs font-medium text-white hover:bg-accent transition-colors"
                  >
                    <Eye className="size-3.5" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleUseTemplate(t)}
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
      </div>

      {/* Full Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4 md:p-6 backdrop-blur-md"
          onClick={() => setPreview(null)}
        >
          <div
            className="mb-3 flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              <p className="font-semibold text-white text-sm">{preview.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyHtml(preview.html)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all"
              >
                <Copy className="size-3.5" />
                Copiar HTML
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
            srcDoc={preview.html}
            className="flex-1 rounded-xl border border-border bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </AppShell>
  );
}

function CustomHtmlEditor({
  onSave,
  onClose,
}: {
  onSave: (data: { title: string; topic: string; html: string }) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("Minha Página Safe");
  const [topic, setTopic] = useState("Beleza");
  const [html, setHtml] = useState(
    `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Studio & Bem-Estar</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 40px 20px; background: #fdfdfd; color: #222; text-align: center; }
    .card { max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    h1 { color: #111; font-size: 28px; margin-bottom: 12px; }
    p { color: #666; font-size: 16px; line-height: 1.6; }
    .btn { display: inline-block; margin-top: 24px; padding: 12px 28px; background: #00E676; color: #000; font-weight: bold; border-radius: 8px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Bem-vindo ao Nosso Espaço</h1>
    <p>Oferecemos serviços dedicados com profissionais qualificados, garantindo excelência e cuidado para você e sua família.</p>
    <a href="#" class="btn">Saiba Mais</a>
  </div>
</body>
</html>`
  );

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Informe um título para a página.");
      return;
    }
    if (!html.trim()) {
      toast.error("Insira o código HTML da página.");
      return;
    }
    onSave({ title: title.trim(), topic, html });
  };

  return (
    <Panel className="mt-4 bg-[#14171a] border-border overflow-hidden p-0 shadow-2xl">
      <div className="p-4 border-b border-border flex items-center justify-between bg-card/30">
        <div className="flex items-center gap-2">
          <FileCode className="size-4 text-primary" />
          <h3 className="text-sm font-bold text-white">Criar Página HTML Própria</h3>
        </div>
        <button
          onClick={onClose}
          className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="p-4 grid gap-4 border-b border-border bg-card/20 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-white block mb-1.5">Título da Página</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex: Consultoria Imobiliária"
            className="w-full rounded-xl border border-border bg-[#0d0f10] px-3.5 py-2.5 text-xs text-white outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-white block mb-1.5">Tópico / Nicho</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-xl border border-border bg-[#0d0f10] px-3.5 py-2.5 text-xs text-white outline-none focus:border-primary"
          >
            {TOPICOS.filter((t) => t !== "Todos").map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        <div className="p-4 flex flex-col">
          <label className="text-xs font-semibold text-muted-foreground mb-2 flex items-center justify-between">
            <span>Editor de Código HTML</span>
            <span className="text-[10px] text-primary font-mono">HTML5 Puro</span>
          </label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={14}
            className="w-full flex-1 resize-none rounded-xl border border-border bg-[#0d0f10] p-3 font-mono text-xs text-white outline-none focus:border-primary"
            placeholder="Cole seu código HTML aqui..."
          />
        </div>

        <div className="flex flex-col p-4 bg-black/20">
          <label className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
            <Eye className="size-3.5 text-primary" />
            Prévia ao vivo
          </label>
          <div className="min-h-64 flex-1 rounded-xl border border-border bg-white overflow-hidden shadow-inner">
            <iframe
              title="Prévia ao vivo"
              srcDoc={html}
              sandbox="allow-scripts"
              className="w-full h-full min-h-[300px] border-0"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border p-4 bg-card/40">
        <button
          onClick={onClose}
          className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-white"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all shadow-md shadow-primary/20"
        >
          <Check className="size-4" />
          Salvar Página
        </button>
      </div>
    </Panel>
  );
}
