import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Globe, Pause, Play, Trash2, Shield, Eye, Bot, ExternalLink, Zap, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell, Empty, NewCloakerButton, PageHeader, Panel } from "@/components/AppShell";
import { removeLink, shareUrl, toggleLink, useLinks, simulateVisit, addLink } from "@/lib/links";
import type { Cloaker } from "@/lib/links";

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

// Extend links.ts with an updateLink function inline here
function updateDestination(id: string, newDestination: string) {
  const { useSyncExternalStore } = require("react");
  // We'll use localStorage directly since we can't easily re-export private funcs
  try {
    const raw = localStorage.getItem("cloakfy-cloakers");
    if (!raw) return;
    const cloakers: Cloaker[] = JSON.parse(raw);
    const updated = cloakers.map((c) =>
      c.id === id ? { ...c, destination: newDestination } : c
    );
    localStorage.setItem("cloakfy-cloakers", JSON.stringify(updated));
    // Force re-render via storage event
    window.dispatchEvent(new StorageEvent("storage", { key: "cloakfy-cloakers" }));
  } catch (err) {
    console.error("Error updating destination:", err);
  }
}

function CloakersPage() {
  const cloakers = useLinks();
  const humanVisits = cloakers.reduce((n, l) => n + (l.humanVisits ?? l.visits), 0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  function startEdit(cloaker: Cloaker) {
    setEditingId(cloaker.id);
    setEditValue(cloaker.destination);
  }

  function saveEdit() {
    if (!editingId || !editValue.trim()) return;
    let url = editValue.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    try {
      new URL(url); // validate
    } catch {
      toast.error("URL inválida. Informe um link completo.");
      return;
    }
    updateDestination(editingId, url);
    toast.success("Link da oferta atualizado!");
    setEditingId(null);
    setEditValue("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  return (
    <AppShell title="Cloakers">
      <PageHeader
        title="Cloaker de Páginas"
        subtitle="Crie, acompanhe e ajuste a proteção das suas campanhas."
        action={<NewCloakerButton />}
      />

      {/* Plan & Usage KPI Panel */}
      <Panel className="mb-6 grid md:grid-cols-[260px_1fr] bg-[#14171a] border-border">
        <div className="border-b border-border p-6 md:border-r md:border-b-0">
          <p className="text-xs font-medium text-muted-foreground">Seu plano:</p>
          <p className="mt-1 text-2xl font-bold text-white">Grátis</p>
          <a
            href="/planos"
            className="mt-4 inline-block rounded-xl border border-border bg-card/60 px-4 py-2 text-xs font-semibold text-white hover:bg-accent transition-colors"
          >
            Fazer upgrade
          </a>
        </div>
        <div className="p-6">
          <p className="text-xs font-medium text-muted-foreground">Cliques humanos este mês</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {humanVisits} <span className="text-sm font-normal text-muted-foreground">/ 1.000</span>
          </p>
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(humanVisits > 0 ? 5 : 0, (humanVisits / 1000) * 100))}%` }}
            />
          </div>
        </div>
      </Panel>

      {/* Empty State vs List */}
      {cloakers.length === 0 ? (
        <Empty
          icon={Globe}
          title="Seu primeiro cloaker em 2 minutos"
          text="Bots e moderadores veem a página segura. Seus leads veem a oferta real. Você só cola o link no anúncio. Você ganha 7 dias grátis."
          actionLabel="Criar primeira"
        />
      ) : (
        <Panel className="divide-y divide-border bg-[#14171a]">
          {cloakers.map((l) => (
            <div key={l.id} className="flex flex-col gap-3 px-6 py-5 hover:bg-secondary/10 transition-colors">
              {/* Row 1: Info + Badges + Actions */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Cloaker Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Shield className="size-4 text-primary" />
                    <p className="font-semibold text-white truncate">{l.name}</p>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {editingId === l.id ? (
                      /* Inline edit field */
                      <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <span className="text-emerald-400 font-mono shrink-0">Oferta Real:</span>
                        <input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit();
                            if (e.key === "Escape") cancelEdit();
                          }}
                          className="flex-1 min-w-0 rounded-lg border border-primary bg-[#0d0f10] px-2.5 py-1 text-xs text-white outline-none focus:ring-1 focus:ring-primary font-mono"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="grid size-6 place-items-center rounded bg-primary/20 text-primary hover:bg-primary/40 transition-colors"
                          title="Salvar"
                        >
                          <Check className="size-3.5" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="grid size-6 place-items-center rounded bg-secondary text-muted-foreground hover:text-white transition-colors"
                          title="Cancelar"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span className="text-emerald-400 font-mono shrink-0">Oferta Real:</span>
                        <span className="truncate">{l.destination}</span>
                        <button
                          onClick={() => startEdit(l)}
                          className="shrink-0 p-0.5 text-muted-foreground hover:text-primary transition-colors"
                          title="Editar link da oferta"
                        >
                          <Pencil className="size-3" />
                        </button>
                      </span>
                    )}
                    <span className="truncate">
                      <span className="text-blue-400 font-mono">Safe:</span> {l.safePage || "Template Automático"}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    l.active
                      ? "bg-success-soft text-primary ring-1 ring-primary/20"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {l.active ? "Ativo" : "Pausado"}
                </span>

                {/* Stats Counters */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <p className="font-bold text-white text-sm">{l.humanVisits ?? l.visits}</p>
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1 justify-end">
                      <Eye className="size-3" /> Humanos
                    </p>
                  </div>
                  <div className="text-right border-l border-border pl-4">
                    <p className="font-bold text-white text-sm">{l.botVisits ?? 0}</p>
                    <p className="text-[11px] text-amber-400 flex items-center gap-1 justify-end">
                      <Bot className="size-3" /> Bots
                    </p>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    title="Simular clique humano"
                    onClick={() => {
                      simulateVisit(l.id, false);
                      toast.success("Clique humano simulado! Visita registrada.");
                    }}
                    className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-border bg-card/60 px-2.5 py-1.5 text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  >
                    <Zap className="size-3" /> +Humano
                  </button>
                  <button
                    title="Simular bot do Facebook/Google"
                    onClick={() => {
                      simulateVisit(l.id, true);
                      toast.info("Bot simulado! Desviado para página safe.");
                    }}
                    className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-border bg-card/60 px-2.5 py-1.5 text-[11px] font-medium text-amber-400 hover:bg-amber-500/10 transition-colors"
                  >
                    <Bot className="size-3" /> +Bot
                  </button>

                  {/* Edit Destination */}
                  <IconBtn
                    label="Editar link da oferta"
                    onClick={() => editingId === l.id ? cancelEdit() : startEdit(l)}
                  >
                    <Pencil />
                  </IconBtn>

                  {/* Copy link */}
                  <IconBtn
                    label="Copiar link do cloaker"
                    onClick={async () => {
                      await navigator.clipboard.writeText(shareUrl(l.id));
                      toast.success("Link do cloaker copiado!");
                    }}
                  >
                    <Copy />
                  </IconBtn>

                  {/* Open link */}
                  <a
                    href={shareUrl(l.id)}
                    target="_blank"
                    rel="noreferrer"
                    title="Testar link público"
                    className="grid size-9 place-items-center rounded-xl border border-border bg-card/60 hover:bg-accent text-muted-foreground hover:text-white transition-colors"
                  >
                    <ExternalLink className="size-4" />
                  </a>

                  {/* Pause/Resume */}
                  <IconBtn
                    label={l.active ? "Pausar proteção" : "Ativar proteção"}
                    onClick={() => {
                      toggleLink(l.id);
                      toast.info(l.active ? "Cloaker pausado." : "Cloaker ativado!");
                    }}
                  >
                    {l.active ? <Pause /> : <Play />}
                  </IconBtn>

                  {/* Delete */}
                  <IconBtn
                    label="Excluir cloaker"
                    onClick={() => {
                      if (confirm("Deseja realmente remover este cloaker?")) {
                        removeLink(l.id);
                        toast.success("Cloaker removido.");
                      }
                    }}
                  >
                    <Trash2 />
                  </IconBtn>
                </div>
              </div>
            </div>
          ))}
        </Panel>
      )}
    </AppShell>
  );
}

function IconBtn({
  label,
  children,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-xl border border-border bg-card/60 hover:bg-accent text-muted-foreground hover:text-white transition-colors [&_svg]:size-4"
    >
      {children}
    </button>
  );
}
