import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Globe, Pause, Play, Trash2, Shield, Eye, Bot, ExternalLink, Zap, Pencil, Check, X, Settings } from "lucide-react";
import { toast } from "sonner";
import { AppShell, Empty, NewCloakerButton, PageHeader, Panel } from "@/components/AppShell";
import { removeLink, shareUrl, toggleLink, useLinks, simulateVisit, addLink, updateCloaker } from "@/lib/links";
import type { Cloaker } from "@/lib/links";
import { pageTemplates } from "@/lib/page-templates";
import { useCustomPages } from "@/lib/custom-pages";

export const Route = createFileRoute("/links")({
  head: () => ({
    meta: [
      { title: "Cloakers | Cloakfy" },
      { name: "description", content: "Crie, acompanhe e ajuste a proteção das suas campanhas." },
      { property: "og:title", content: "Cloakers | Cloakfy" },
      { property: "og:description", content: "Crie, acompanhe e ajuste a proteção das suas campanhas." },
    ],
  }),
  component: CloakersPage,
});

type EditMode = "destination" | "full" | null;

function extractTemplateId(url?: string): string {
  if (!url) return "bella";
  const match = url.match(/\/safe\/([^/?#]+)/);
  return match?.[1] ?? "bella";
}

function CloakersPage() {
  const cloakers = useLinks();
  const customPages = useCustomPages();
  const humanVisits = cloakers.reduce((n, l) => n + (l.humanVisits ?? l.visits), 0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [editValue, setEditValue] = useState("");
  // Full edit modal fields
  const [editName, setEditName] = useState("");
  const [editDest, setEditDest] = useState("");
  const [editSafe, setEditSafe] = useState("");
  const [editSafeTemplate, setEditSafeTemplate] = useState("bella");
  const [editCampaign, setEditCampaign] = useState("");
  const [editMode2, setEditMode2] = useState<"basica" | "normal" | "agressiva">("normal");

  function startQuickEdit(cloaker: Cloaker) {
    setEditingId(cloaker.id);
    setEditMode("destination");
    setEditValue(cloaker.destination);
  }

  function startFullEdit(cloaker: Cloaker) {
    setEditingId(cloaker.id);
    setEditMode("full");
    setEditName(cloaker.name);
    setEditDest(cloaker.destination);
    setEditSafe(cloaker.safePage || "");
    const templateId = cloaker.safeTemplateId || extractTemplateId(cloaker.safePage);
    setEditSafeTemplate(templateId);
    setEditCampaign(cloaker.campaign || "");
    setEditMode2(cloaker.mode || "normal");
  }

  function saveQuickEdit() {
    if (!editingId || !editValue.trim()) return;
    let url = editValue.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
    try { new URL(url); } catch { toast.error("URL inválida."); return; }
    updateCloaker(editingId, { destination: url });
    toast.success("Link da oferta atualizado!");
    setEditingId(null); setEditMode(null); setEditValue("");
  }

  function saveFullEdit() {
    if (!editingId) return;
    let url = editDest.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
    try { new URL(url); } catch { toast.error("URL de destino inválida."); return; }
    const templateChosen = editSafeTemplate || "bella";
    const appOrigin = typeof window !== "undefined" ? window.location.origin : "";
    const safePageResolved = `${appOrigin}/safe/${templateChosen}`;
    const updates: Partial<Cloaker> = {
      name: editName.trim() || editName,
      destination: url,
      safePage: safePageResolved,
      safeTemplateId: templateChosen,
      campaign: editCampaign.trim(),
      mode: editMode2,
    };
    updateCloaker(editingId, updates);
    toast.success("Cloaker e Página Safe atualizados!");
    setEditingId(null); setEditMode(null);
  }

  function cancelEdit() {
    setEditingId(null); setEditMode(null); setEditValue("");
  }

  return (
    <AppShell title="Cloakers">
      <PageHeader
        title="Cloaker de Páginas"
        subtitle="Crie, acompanhe e ajuste a proteção das suas campanhas."
        action={<NewCloakerButton />}
      />

      {/* Plan & Usage */}
      <Panel className="mb-6 grid md:grid-cols-[260px_1fr] bg-[#14171a] border-border">
        <div className="border-b border-border p-5 md:p-6 md:border-r md:border-b-0">
          <p className="text-xs font-medium text-muted-foreground">Seu plano:</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <p className="text-2xl font-bold text-primary">Ilimitado</p>
          </div>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-[11px] font-semibold text-primary">
            ✓ Proteção ativa sem limites
          </span>
        </div>
        <div className="p-5 md:p-6">
          <p className="text-xs font-medium text-muted-foreground">Cliques humanos este mês</p>
          <p className="mt-1 text-2xl font-bold text-white flex items-baseline gap-2">
            {humanVisits} <span className="text-sm font-semibold text-primary">(Ilimitado)</span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Sem restrições de volume de tráfego, limites de links ou bloqueio por cliques.
          </p>
        </div>
      </Panel>

      {/* Full Edit Modal */}
      {editMode === "full" && editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <Panel className="w-full max-w-lg bg-[#14171a] border-border p-0 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-primary" />
                <h2 className="text-sm font-bold text-white">Editar Cloaker</h2>
              </div>
              <button onClick={cancelEdit} className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-white block mb-1.5">Nome do cloaker</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-[#0d0f10] px-3.5 py-2.5 text-sm text-white outline-none focus:border-primary" />
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-1.5">Link da oferta (black page)</label>
                <input type="url" value={editDest} onChange={(e) => setEditDest(e.target.value)}
                  placeholder="https://minhaoferta.com/vendas"
                  className="w-full rounded-xl border border-border bg-[#0d0f10] px-3.5 py-2.5 text-sm text-white outline-none focus:border-primary" />
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-1.5">Página Safe (white page)</label>
                <select
                  value={editSafeTemplate}
                  onChange={(e) => setEditSafeTemplate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-[#0d0f10] px-3.5 py-2.5 text-sm text-white outline-none focus:border-primary"
                >
                  {customPages.length > 0 && (
                    <optgroup label="Minhas Páginas Salvas (HTML Próprio)">
                      {customPages.map((cp) => (
                        <option key={cp.id} value={cp.id}>
                          ★ {cp.title} ({cp.topic})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="Templates Prontos">
                    {pageTemplates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
                    ))}
                  </optgroup>
                </select>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  A página safe selecionada será exibida automaticamente para moderadores e bots.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-1.5">Campanha (UTM)</label>
                <input type="text" value={editCampaign} onChange={(e) => setEditCampaign(e.target.value)}
                  placeholder="ex: black-friday-nov24"
                  className="w-full rounded-xl border border-border bg-[#0d0f10] px-3.5 py-2.5 text-sm text-white outline-none focus:border-primary" />
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-2">Modo de proteção</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["basica", "normal", "agressiva"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setEditMode2(m)}
                      className={`rounded-xl border py-2 text-xs font-semibold capitalize transition-all ${
                        editMode2 === m
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card/60 text-muted-foreground hover:text-white"
                      }`}
                    >
                      {m === "basica" ? "Básica" : m === "normal" ? "Normal" : "Agressiva"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end p-5 border-t border-border">
              <button onClick={cancelEdit} className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs text-muted-foreground hover:text-white">
                Cancelar
              </button>
              <button
                onClick={saveFullEdit}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all"
              >
                <Check className="size-4" /> Alterar
              </button>
            </div>
          </Panel>
        </div>
      )}

      {/* Cloakers List */}
      {cloakers.length === 0 ? (
        <Empty
          title="Seu primeiro cloaker em 2 minutos"
          text="Bots e moderadores veem a página segura. Seus leads veem a oferta real. Você só cola o link no anúncio, você ganha 7 dias grátis."
          actionLabel="+ Criar primeira"
        />
      ) : (
        <Panel className="bg-[#14171a] border-border divide-y divide-border">
          {cloakers.map((l) => (
            <div key={l.id} className="p-4 sm:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Shield className="size-4 text-primary shrink-0" />
                    <p className="font-semibold text-white truncate">{l.name}</p>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                      l.active
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-secondary text-muted-foreground border-border"
                    }`}>
                      {l.active ? "Ativo" : "Pausado"}
                    </span>
                    <span className="rounded-full border border-border bg-secondary/40 px-2 py-0.5 text-[11px] text-muted-foreground capitalize">
                      {l.mode || "normal"}
                    </span>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] text-primary truncate max-w-[200px]">
                      Safe: {customPages.find((cp) => cp.id === l.safeTemplateId || l.safePage?.includes(cp.id))?.title || l.safeTemplateId || extractTemplateId(l.safePage)}
                    </span>
                  </div>

                  <div className="mt-1.5 text-xs text-muted-foreground break-all">
                    <span className="font-mono text-white/90">{shareUrl(l.id)}</span>
                  </div>

                  {/* Quick destination edit */}
                  {editMode === "destination" && editingId === l.id ? (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="url"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveQuickEdit()}
                        autoFocus
                        className="flex-1 rounded-xl border border-primary bg-[#0d0f10] px-3 py-1.5 text-xs text-white outline-none"
                        placeholder="https://novaoferta.com/vendas"
                      />
                      <button onClick={saveQuickEdit} className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground hover:brightness-110">
                        <Check className="size-3.5" />
                      </button>
                      <button onClick={cancelEdit} className="grid size-7 place-items-center rounded-lg border border-border text-muted-foreground hover:text-white">
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground/70 truncate max-w-md">
                      → {l.destination}
                    </p>
                  )}
                </div>

                {/* Stats & Actions Row */}
                <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 sm:gap-4 border-t lg:border-t-0 border-border/60 pt-3 lg:pt-0">
                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-white text-sm">{l.humanVisits ?? l.visits}</p>
                      <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <Eye className="size-3" /> Humanos
                      </p>
                    </div>
                    <div className="text-left sm:text-right border-l border-border pl-3">
                      <p className="font-bold text-white text-sm">{l.botVisits ?? 0}</p>
                      <p className="text-[11px] text-amber-400 flex items-center gap-1">
                        <Bot className="size-3" /> Bots
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      title="Simular clique humano"
                      onClick={() => { simulateVisit(l.id, false); toast.success("Clique humano simulado!"); }}
                      className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-border bg-card/60 px-2.5 py-1.5 text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    >
                      <Zap className="size-3" /> +Humano
                    </button>
                    <button
                      title="Simular bot"
                      onClick={() => { simulateVisit(l.id, true); toast.info("Bot simulado! Desviado para página safe."); }}
                      className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-border bg-card/60 px-2.5 py-1.5 text-[11px] font-medium text-amber-400 hover:bg-amber-500/10 transition-colors"
                    >
                      <Bot className="size-3" /> +Bot
                    </button>

                    {/* Full edit button — green "Alterar" */}
                    <button
                      title="Editar cloaker completo"
                      onClick={() => startFullEdit(l)}
                      className="flex items-center gap-1 rounded-xl border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Settings className="size-3.5" /> Alterar
                    </button>

                    {/* Quick edit destination */}
                    <IconBtn label="Editar link da oferta rapidamente" onClick={() => editMode === "destination" && editingId === l.id ? cancelEdit() : startQuickEdit(l)}>
                      <Pencil />
                    </IconBtn>

                    {/* Copy */}
                    <IconBtn label="Copiar link do cloaker" onClick={async () => { await navigator.clipboard.writeText(shareUrl(l.id)); toast.success("Link do cloaker copiado!"); }}>
                      <Copy />
                    </IconBtn>

                    {/* Open */}
                    <a href={shareUrl(l.id)} target="_blank" rel="noreferrer" title="Testar link público"
                      className="grid size-9 place-items-center rounded-xl border border-border bg-card/60 hover:bg-accent text-muted-foreground hover:text-white transition-colors">
                      <ExternalLink className="size-4" />
                    </a>

                    {/* Pause/Resume */}
                    <IconBtn label={l.active ? "Pausar proteção" : "Ativar proteção"} onClick={() => { toggleLink(l.id); toast.info(l.active ? "Cloaker pausado." : "Cloaker ativado!"); }}>
                      {l.active ? <Pause /> : <Play />}
                    </IconBtn>

                    {/* Delete */}
                    <IconBtn label="Excluir cloaker" onClick={() => { if (confirm("Deseja realmente remover este cloaker?")) { removeLink(l.id); toast.success("Cloaker removido."); } }}>
                      <Trash2 />
                    </IconBtn>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Panel>
      )}
    </AppShell>
  );
}

function IconBtn({ label, children, onClick }: { label: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      aria-label={label} title={label} onClick={onClick}
      className="grid size-9 place-items-center rounded-xl border border-border bg-card/60 hover:bg-accent text-muted-foreground hover:text-white transition-colors [&_svg]:size-4"
    >
      {children}
    </button>
  );
}
