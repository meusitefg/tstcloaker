import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Globe, Plus, Trash2, CheckCircle2, Copy, ExternalLink, Shield, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { AppShell, Panel, PageHeader, PrimaryButton } from "@/components/AppShell";

export const Route = createFileRoute("/dominios")({
  head: () => ({
    meta: [
      { title: "Meus Domínios | Cloakfy" },
      { name: "description", content: "Conecte um subdomínio próprio aos links dos seus cloakers." },
      { property: "og:title", content: "Meus Domínios | Cloakfy" },
    ],
  }),
  component: DominiosPage,
});

interface Domain {
  id: string;
  domain: string;
  status: "pending" | "active" | "error";
  cname: string;
  createdAt: string;
}

const STORAGE_KEY = "cloakfy-domains";

function readDomains(): Domain[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDomains(domains: Domain[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(domains));
}

function DominiosPage() {
  const [domains, setDomains] = useState<Domain[]>(() => readDomains());
  const [adding, setAdding] = useState(false);
  const [inputDomain, setInputDomain] = useState("");
  const [inputError, setInputError] = useState("");

  function handleAdd() {
    setInputError("");
    const val = inputDomain.trim().toLowerCase().replace(/^https?:\/\//, "");
    if (!val || !val.includes(".") || val.length < 4) {
      setInputError("Informe um domínio válido, ex: links.meusite.com");
      return;
    }
    if (domains.find((d) => d.domain === val)) {
      setInputError("Este domínio já foi adicionado.");
      return;
    }
    const newDomain: Domain = {
      id: Math.random().toString(36).slice(2, 9),
      domain: val,
      status: "pending",
      cname: "cloakfy.app",
      createdAt: new Date().toISOString(),
    };
    const updated = [newDomain, ...domains];
    setDomains(updated);
    saveDomains(updated);
    setInputDomain("");
    setAdding(false);
    toast.success(`Domínio ${val} adicionado! Configure o CNAME conforme abaixo.`);
  }

  function handleRemove(id: string) {
    if (!confirm("Remover este domínio do Cloakfy?")) return;
    const updated = domains.filter((d) => d.id !== id);
    setDomains(updated);
    saveDomains(updated);
    toast.success("Domínio removido.");
  }

  function handleVerify(id: string) {
    // Simulate verification
    const updated = domains.map((d) =>
      d.id === id ? { ...d, status: "active" as const } : d
    );
    setDomains(updated);
    saveDomains(updated);
    toast.success("Domínio verificado e ativo!");
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copiado!`));
  }

  return (
    <AppShell title="Domínios">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Meus Domínios</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Conecte seu próprio domínio pra rodar os cloakers e proteger sua marca.
          </p>
        </div>
        <PrimaryButton onClick={() => setAdding(true)} className="text-sm">
          <Plus className="size-4 stroke-[3]" />
          Adicionar domínio
        </PrimaryButton>
      </div>

      {/* Add Domain Form */}
      {adding && (
        <Panel className="mb-6 p-5 bg-[#14171a] border-primary/30">
          <h2 className="text-sm font-semibold text-white mb-3">Novo domínio personalizado</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
            <div className="flex-1">
              <input
                type="text"
                value={inputDomain}
                onChange={(e) => setInputDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="links.meusite.com.br"
                className="w-full rounded-xl border border-border bg-[#0d0f10] px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-muted-foreground/60 focus:border-primary transition-all"
                autoFocus
              />
              {inputError && (
                <p className="mt-1.5 text-xs text-destructive">{inputError}</p>
              )}
              <p className="mt-1.5 text-xs text-muted-foreground">
                Use um subdomínio (ex: links.seusite.com). Você precisará configurar um CNAME.
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <PrimaryButton onClick={handleAdd} className="text-xs">
                Adicionar
              </PrimaryButton>
              <button
                onClick={() => { setAdding(false); setInputDomain(""); setInputError(""); }}
                className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs text-muted-foreground hover:text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Panel>
      )}

      {/* DNS Instructions */}
      <Panel className="mb-6 p-5 bg-[#14171a] border-border">
        <div className="flex items-start gap-3">
          <Info className="size-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white mb-2">Como configurar seu domínio</p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-muted-foreground leading-relaxed">
              <li>Adicione o subdomínio acima (ex: <span className="font-mono text-white">links.seusite.com</span>)</li>
              <li>
                No painel DNS do seu domínio, crie um registro{" "}
                <span className="font-mono text-white">CNAME</span> apontando para{" "}
                <button
                  onClick={() => copyToClipboard("cloakfy.app", "CNAME")}
                  className="font-mono text-primary hover:underline"
                >
                  cloakfy.app
                </button>
              </li>
              <li>Aguarde até 48h para propagação DNS (geralmente menos de 5 min)</li>
              <li>Clique em "Verificar" para confirmar a configuração</li>
            </ol>
          </div>
        </div>
      </Panel>

      {/* Domains List */}
      {domains.length === 0 ? (
        <Panel className="flex flex-col items-center px-6 py-16 text-center bg-[#14171a] border-border">
          <span className="grid size-12 place-items-center rounded-xl border border-border bg-secondary/80">
            <Globe className="size-5 text-muted-foreground" />
          </span>
          <p className="mt-5 text-base font-semibold text-white">Nenhum domínio configurado</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Adicione seu domínio personalizado para usar nos links dos cloakers.
          </p>
          <PrimaryButton onClick={() => setAdding(true)} className="mt-6 text-sm">
            <Plus className="size-4 stroke-[3]" />
            Adicionar primeiro domínio
          </PrimaryButton>
        </Panel>
      ) : (
        <Panel className="divide-y divide-border bg-[#14171a]">
          {domains.map((d) => (
            <div key={d.id} className="flex flex-wrap items-center gap-4 px-6 py-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Globe className="size-4 text-primary shrink-0" />
                  <p className="font-semibold text-white">{d.domain}</p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      d.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : d.status === "error"
                        ? "bg-destructive/10 text-destructive border border-destructive/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {d.status === "active" ? "✓ Ativo" : d.status === "error" ? "✗ Erro DNS" : "⏳ Pendente"}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>
                    CNAME →{" "}
                    <span className="font-mono text-white">{d.cname}</span>
                  </span>
                  {d.status === "active" && (
                    <span className="font-mono text-primary">
                      https://{d.domain}/r/[id-do-cloaker]
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {d.status !== "active" && (
                  <button
                    onClick={() => handleVerify(d.id)}
                    className="rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-white hover:bg-accent transition-colors"
                  >
                    Verificar
                  </button>
                )}
                {d.status === "active" && (
                  <button
                    onClick={() => copyToClipboard(`https://${d.domain}`, "URL do domínio")}
                    className="grid size-8 place-items-center rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-white transition-colors"
                    title="Copiar URL"
                  >
                    <Copy className="size-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleRemove(d.id)}
                  className="grid size-8 place-items-center rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-destructive transition-colors"
                  title="Remover domínio"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </Panel>
      )}
    </AppShell>
  );
}
