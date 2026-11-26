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
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, Panel, PrimaryButton, useNewCloaker } from "@/components/AppShell";
import { pageTemplates, renderTemplate, type PageTemplate } from "@/lib/page-templates";
import {
  readCustomPages,
  useCustomPages,
  saveCustomPage,
  deleteCustomPage,
  readTopics,
  addTopic,
  type CustomPage,
} from "@/lib/custom-pages";

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

function SafePages() {
  const [cat, setCat] = useState("Todos");
  const [topics, setTopics] = useState<string[]>(readTopics());
  const customPages = useCustomPages();
  const [filtroTopicoCustom, setFiltroTopicoCustom] = useState("Todos");
  const [preview, setPreview] = useState<{ title: string; html: string } | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const openNewCloaker = useNewCloaker();

  useEffect(() => {
    setTopics(readTopics());
  }, []);

  const handleAddNewTopic = () => {
    const trimmed = newTopicName.trim();
    if (!trimmed) return;
    const updated = addTopic(trimmed);
    setTopics(updated);
    setFiltroTopicoCustom(trimmed);
    setNewTopicName("");
    setShowAddTopic(false);
    toast.success(`Tópico "${trimmed}" adicionado com sucesso!`);
  };

  const list = pageTemplates.filter((t) => cat === "Todos" || t.category === cat);

  const paginasCustomFiltradas = customPages.filter(
    (p) => filtroTopicoCustom === "Todos" || p.topic === filtroTopicoCustom
  );

  const handleDeleteCustomPage = (id: string) => {
    if (confirm("Deseja realmente excluir esta página personalizada?")) {
      deleteCustomPage(id);
      toast.success("Página excluída com sucesso!");
    }
  };

  const handleSaveCustomPage = (page: Omit<CustomPage, "id" | "createdAt">) => {
    const saved = saveCustomPage(page);
    setShowEditor(false);
    toast.success(`Página "${saved.title}" salva! Agora você já pode selecioná-la como Página Safe nos seus Cloakers.`);
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
    openNewCloaker({ name: p.title, safeTemplateId: p.id });
    toast.success(`Página "${p.title}" selecionada como White Page para o Cloaker!`);
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
            Cole seu próprio HTML sem limites de tamanho — servido transparente e pronto para usar em seus cloakers.
          </p>
        </div>
        {!showEditor && (
          <button
            onClick={() => setShowEditor(true)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all shadow-sm"
          >
            <Plus className="size-3.5 stroke-[3]" />
            Criar HTML Próprio
          </button>
        )}
      </div>

      {/* Editor or List of Custom Pages */}
      {showEditor ? (
        <CustomHtmlEditor
          topics={topics}
          onAddTopic={(name) => {
            const updated = addTopic(name);
            setTopics(updated);
          }}
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
            Crie sua primeira página personalizada com o seu HTML (sem limites de tamanho) para usar como safe page em seus anúncios.
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
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {topics.map((t) => (
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

            {showAddTopic ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Nome do nicho..."
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddNewTopic()}
                  autoFocus
                  className="rounded-full border border-primary bg-[#0d0f10] px-3 py-1 text-xs text-white outline-none w-36"
                />
                <button
                  onClick={handleAddNewTopic}
                  className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold"
                >
                  <Check className="size-3.5" />
                </button>
                <button
                  onClick={() => setShowAddTopic(false)}
                  className="grid size-7 place-items-center rounded-full border border-border text-muted-foreground hover:text-white text-xs"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddTopic(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary transition-all whitespace-nowrap"
              >
                <Plus className="size-3.5" />
                Novo Tópico
              </button>
            )}
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
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all shadow-sm"
                  >
                    <Layers className="size-3.5" />
                    Usar no Cloaker
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ready Templates Section */}
      <div className="mt-10 mb-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          Templates Prontos do Sistema
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Páginas institucionais de alta conversão prontas para rodar de imediato.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {["Todos", "Beleza", "Saúde", "Consultoria", "E-commerce", "Educação", "Finanças"].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
              cat === c
                ? "bg-primary text-primary-foreground border-primary font-bold shadow-sm"
                : "bg-card/70 border-border text-muted-foreground hover:text-white hover:bg-card"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => {
          const previewHtml = renderTemplate(t);
          return (
            <div
              key={t.id}
              className="rounded-2xl border border-border bg-[#14171a] overflow-hidden flex flex-col hover:border-primary/40 transition-colors shadow-lg"
            >
              <div className="p-3.5 flex items-center justify-between border-b border-border bg-card/40">
                <div>
                  <h4 className="font-semibold text-sm text-white">{t.name}</h4>
                  <span className="text-[10px] text-muted-foreground">{t.category}</span>
                </div>
                <span className="size-3 rounded-full" style={{ backgroundColor: t.color }} />
              </div>

              <div className="h-44 w-full bg-white relative overflow-hidden pointer-events-none">
                <iframe
                  srcDoc={previewHtml}
                  title={t.name}
                  sandbox="allow-scripts"
                  className="w-[200%] h-[200%] origin-top-left scale-50 border-0"
                />
              </div>

              <div className="p-3 flex items-center justify-between gap-2 border-t border-border mt-auto bg-card/20">
                <button
                  onClick={() => setPreview({ title: t.name, html: previewHtml })}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card/60 py-2 text-xs font-semibold text-white hover:bg-accent transition-colors"
                >
                  <Eye className="size-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => handleUseTemplate(t)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all shadow-sm"
                >
                  <Layers className="size-3.5" />
                  Usar no Cloaker
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10 px-2">
            <h3 className="text-sm font-bold text-white">{preview.title}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); copyHtml(preview.html); }}
                className="flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent"
              >
                <Copy className="size-3.5" />
                Copiar HTML
              </button>
              <button
                onClick={() => setPreview(null)}
                className="grid size-8 place-items-center rounded-xl border border-white/20 text-white hover:bg-white/10"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
          <iframe
            title={preview.title}
            srcDoc={preview.html}
            sandbox="allow-scripts"
            className="flex-1 w-full mt-3 rounded-2xl bg-white border-0 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </AppShell>
  );
}

function CustomHtmlEditor({
  topics,
  onAddTopic,
  onSave,
  onClose,
}: {
  topics: string[];
  onAddTopic: (name: string) => void;
  onSave: (data: { title: string; topic: string; html: string }) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("Minha Página Safe");
  const [topic, setTopic] = useState(topics.find((t) => t !== "Todos") || "Beleza");
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
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

  const htmlSizeKb = (new Blob([html]).size / 1024).toFixed(1);

  const handleCreateTopic = () => {
    const trimmed = newTopicName.trim();
    if (!trimmed) return;
    onAddTopic(trimmed);
    setTopic(trimmed);
    setNewTopicName("");
    setShowAddTopic(false);
    toast.success(`Tópico "${trimmed}" adicionado!`);
  };

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
          <h3 className="text-sm font-bold text-white">Criar Página HTML Própria (Sem Limites de Tamanho)</h3>
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
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-white">Tópico / Nicho</label>
            <button
              type="button"
              onClick={() => setShowAddTopic(!showAddTopic)}
              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
            >
              <Plus className="size-3" />
              Adicionar Novo Tópico
            </button>
          </div>

          {showAddTopic ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Novo tópico/nicho..."
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateTopic()}
                autoFocus
                className="flex-1 rounded-xl border border-primary bg-[#0d0f10] px-3 py-2 text-xs text-white outline-none"
              />
              <button
                type="button"
                onClick={handleCreateTopic}
                className="rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setShowAddTopic(false)}
                className="rounded-xl border border-border px-2.5 py-2 text-xs text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>
          ) : (
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-xl border border-border bg-[#0d0f10] px-3.5 py-2.5 text-xs text-white outline-none focus:border-primary"
            >
              {topics.filter((t) => t !== "Todos").map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        <div className="p-4 flex flex-col">
          <label className="text-xs font-semibold text-muted-foreground mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-white">
              <FileCode className="size-3.5 text-primary" />
              Editor de Código HTML
            </span>
            <span className="text-[11px] text-primary font-mono bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
              {htmlSizeKb} KB — Sem Limites
            </span>
          </label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={15}
            className="w-full flex-1 resize-none rounded-xl border border-border bg-[#0d0f10] p-3 font-mono text-xs text-white outline-none focus:border-primary"
            placeholder="Cole seu código HTML completo aqui sem limites de linhas ou tamanho..."
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
          className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-white"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-sm transition-all"
        >
          <Check className="size-4" />
          Salvar Página HTML
        </button>
      </div>
    </Panel>
  );
}
