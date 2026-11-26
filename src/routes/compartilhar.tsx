import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Share2, Users, Trophy, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, Panel } from "@/components/AppShell";

export const Route = createFileRoute("/compartilhar")({
  head: () => ({
    meta: [
      { title: "Indicações | Cloakfy" },
      { name: "description", content: "Indique amigos e ganhe cloakers extras permanentes na sua conta." },
      { property: "og:title", content: "Indicações | Cloakfy" },
    ],
  }),
  component: CompartilharPage,
});

const REF_ID = "35bc4253";

function getAppBase(): string {
  if (typeof window === "undefined") return "https://cloakfy.com.br";
  return window.location.origin;
}

function CompartilharPage() {
  const [copied, setCopied] = useState(false);
  const appBase = getAppBase();
  const refUrl = `${appBase}/?ref=${REF_ID}`;

  async function copyLink() {
    await navigator.clipboard.writeText(refUrl);
    setCopied(true);
    toast.success("Link de indicação copiado!");
    setTimeout(() => setCopied(false), 2000);
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({
        title: "Cloakfy — Proteção de Campanhas",
        text: "Use meu link para criar sua conta e proteger seus anúncios:",
        url: refUrl,
      });
    } else {
      copyLink();
    }
  }

  return (
    <AppShell title="Indicações">
      <PageHeader
        title="Indicações"
        subtitle="Cada 3 pessoas que criarem o primeiro cloaker pelo seu link valem +1 cloaker permanente na sua conta, até 10."
      />

      {/* Ref link */}
      <Panel className="mb-6 bg-[#14171a] border-border p-6">
        <p className="text-xs font-semibold text-white mb-3">Seu link</p>
        <div className="flex gap-2">
          <div className="flex-1 overflow-hidden rounded-xl border border-border bg-[#0d0f10] px-4 py-3 font-mono text-sm text-white truncate">
            {refUrl}
          </div>
          <button
            onClick={copyLink}
            className={`flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs font-semibold transition-all ${copied ? "text-emerald-400 border-emerald-500/30" : "text-white hover:bg-accent"}`}
          >
            <Copy className="size-4" /> {copied ? "Copiado!" : "Copiar"}
          </button>
          <button
            onClick={share}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all"
          >
            <Share2 className="size-4" /> Compartilhar
          </button>
        </div>
      </Panel>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <Users className="size-5 text-primary" />, label: "Cadastraram", value: 0, desc: "Criaram conta pelo seu link" },
          { icon: <Trophy className="size-5 text-amber-400" />, label: "Qualificaram", value: 0, desc: "Já criaram o primeiro cloaker" },
          { icon: <Trophy className="size-5 text-emerald-400" />, label: "Cloakers ganhos", value: 0, desc: "Total de 10" },
        ].map((s, i) => (
          <Panel key={i} className="bg-[#14171a] border-border p-5">
            <div className="flex items-center gap-3 mb-3">{s.icon}</div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{s.value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{s.desc}</p>
          </Panel>
        ))}
      </div>

      {/* Next milestone */}
      <Panel className="mb-6 bg-[#14171a] border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Próximo cloaker</p>
          <span className="text-xs text-muted-foreground">0/3</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-0 rounded-full bg-primary" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Faltam 3 pessoas qualificarem pra você ganhar mais um cloaker.
        </p>
      </Panel>

      {/* How it works */}
      <Panel className="bg-[#14171a] border-border p-5">
        <p className="text-sm font-semibold text-white mb-4">Como funciona</p>
        <ol className="space-y-4">
          {[
            "Você manda seu link. Quem clicar e criar conta fica ligado a você por 30 dias.",
            "Quando essa pessoa cria o primeiro cloaker dela, a indicação qualifica.",
            "A cada 3 qualificados, você ganha +1 cloaker permanente — some ao limite do seu plano e não expira.",
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {i + 1}
              </span>
              {text}
            </li>
          ))}
        </ol>
        <div className="mt-5 rounded-xl border border-border bg-[#0d0f10] p-3.5 text-xs text-muted-foreground leading-relaxed">
          Vale ao cadastro com a mesma conta / diferentes contas antigas; indicações de almeacrias e repetição do mesmo aconto não contam.
        </div>
      </Panel>
    </AppShell>
  );
}
