import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Globe, Plus, Trash2, CheckCircle2, Copy, AlertCircle, Info } from "lucide-react";
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
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveDomains(domains: Domain[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(domains));
  }
}

// Get the current app hostname dynamically (not hardcoded to cloakfy.app)
function getAppHost(): string {
  if (typeof window === "undefined") return "seusite.app";
  return window.location.hostname;
}

function DominiosPage() {
  const [domains, setDomains] = useState<Domain[]>(() => readDomains());
  const [adding, setAdding] = useState(false);
  const [inputDomain, setInputDomain] = useState("");
  const [inputError, setInputError] = useState("");
  const appHost = getAppHost();

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
      cname: appHost,
      createdAt: new Date().toISOString(),
    };
    const updated = [newDomain, ...domains];
    setDomains(updated);
    saveDomains(updated);
    setAdding(false);
    setInputDomain("");
    toast.success("Domínio adicionado! Configure o CNAME para ativar.");
  }

  function handleVerify(id: string) {
    // Simulate DNS verification
    const updated = domains.map((d) => {
      if (d.id !== id) return d;
      // 70% chance of success for demo
      const verified = Math.random() > 0.3;
      return { ...d, status: verified ? ("active" as const) : ("error" as const) };
    });
    setDomains(updated);
    saveDomains(updated);
    const d = updated.find((d) => d.id === id);
    if (d?.status === "active") {
      toast.success(`Domínio ${d.domain} verificado e ativo!`);
    } else {
      toast.error("CNAME não encontrado. Verifique a configuração DNS e tente novamente.");
    }
  }

  function handleRemove(id: string) {
    const updated = domains.filter((d) => d.id !== id);
    setDomains(updated);
    saveDomains(updated);
    toast.success("Domínio removido.");
  }

  const statusConfig = {
    active: { label: "Ativo", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", icon: <CheckCircle2 className="size-3.5" /> },
    pending: { label: "Aguardando verificação", color: "text-amber-400 bg-amber-500/10 border-amber-500/30", icon: <AlertCircle className="size-3.5" /> },
    error: { label: "Erro de DNS", color: "text-rose-400 bg-rose-500/10 border-rose-500/30", icon: <AlertCircle className="size-3.5" /> },
  };

  return (
    <AppShell title="Meus Domínios">
      <PageHeader
        title="Meus Domínios"
        subtitle="Conecte um subdomínio próprio aos links dos seus cloakers."
        action={
          <PrimaryButton onClick={() => setAdding(true)} className="text-xs">
            <Plus className="size-4 stroke-[3]" /> Adicionar domínio
          </PrimaryButton>
        }
      />

      {/* How-to info */}
      <Panel className="mb-5 bg-[#14171a] border-border p-4">
        <div className="flex items-start gap-3">
          <Info className="size-4 text-primary mt-0.5 shrink-0" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <p className="font-semibold text-white mb-1">Como configurar seu domínio</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Adicione o subdomínio abaixo (ex: <code className="text-primary">links.seusite.com</code>)</li>
              <li>
                No painel DNS do seu domínio, crie um registro{" "}
                <code className="text-primary">CNAME</code> apontando para{" "}
                <button
                  onClick={() => { navigator.clipboard.writeText(appHost); toast.success("Host copiado!"); }}
                  className="inline-flex items-center gap-1 font-mono text-primary hover:underline"
                >
                  {appHost} <Copy className="size-3" />
                </button>
              </li>
              <li>Aguarde até 48h para propagação DNS (geralmente menos de 5 min)</li>
              <li>Clique em "Verificar" para confirmar a configuração</li>
            </ol>
          </div>
        </div>
      </Panel>

      {/* Add domain form */}
      {adding && (
        <Panel className="mb-5 bg-[#14171a] border-border p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Adicionar novo domínio</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="links.meusite.com"
              value={inputDomain}
              onChange={(e) => setInputDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 rounded-xl border border-border bg-[#0d0f10] px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary"
              autoFocus
            />
            <PrimaryButton onClick={handleAdd} className="text-xs px-5">Adicionar</PrimaryButton>
            <button
              onClick={() => { setAdding(false); setInputDomain(""); setInputError(""); }}
              className="rounded-xl border border-border bg-card/60 px-4 text-xs text-muted-foreground hover:text-white"
            >
              Cancelar
            </button>
          </div>
          {inputError && <p className="mt-2 text-xs text-rose-400">{inputError}</p>}
        </Panel>
      )}

      {/* Domain list */}
      {domains.length > 0 ? (
        <Panel className="bg-[#14171a] border-border divide-y divide-border">
          {domains.map((d) => {
            const st = statusConfig[d.status];
            return (
              <div key={d.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Globe className="size-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{d.domain}</p>
                      <div className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${st.color}`}>
                        {st.icon} {st.label}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {d.status !== "active" && (
                      <button
                        onClick={() => handleVerify(d.id)}
                        className="rounded-xl border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-white hover:bg-accent transition-colors"
                      >
                        Verificar
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(d.id)}
                      title="Remover domínio"
                      className="grid size-8 place-items-center rounded-xl border border-border bg-card/60 text-muted-foreground hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* CNAME info */}
                <div className="mt-3 rounded-xl border border-border bg-[#0d0f10] p-3 text-xs font-mono">
                  <span className="text-muted-foreground">CNAME → </span>
                  <span className="text-primary">{d.cname}</span>
                </div>
              </div>
            );
          })}
        </Panel>
      ) : (
        <Panel className="flex flex-col items-center px-6 py-16 text-center bg-[#14171a] border-border">
          <span className="grid size-12 place-items-center rounded-xl border border-border bg-secondary/80">
            <Globe className="size-5 text-muted-foreground" />
          </span>
          <p className="mt-5 text-base font-semibold text-white">Nenhum domínio configurado</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Adicione seu domínio personalizado para usar nos links dos cloakers.
          </p>
          <PrimaryButton onClick={() => setAdding(true)} className="mt-6 text-sm">
            <Plus className="size-4 stroke-[3]" /> Adicionar primeiro domínio
          </PrimaryButton>
        </Panel>
      )}
    </AppShell>
  );
}
