import { createFileRoute } from "@tanstack/react-router";
import { Copy, Share2, Users, CheckCircle, Gift } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, GhostButton, PageHeader, Panel, PrimaryButton } from "@/components/AppShell";

export const Route = createFileRoute("/compartilhar")({
  head: () => ({
    meta: [
      { title: "Indicações | Cloakfy" },
      { name: "description", content: "Ganhe cloakers permanentes indicando outros anunciantes." },
      { property: "og:title", content: "Indicações | Cloakfy" },
      { property: "og:description", content: "Ganhe cloakers permanentes indicando outros anunciantes." },
    ],
  }),
  component: ReferralsPage,
});

function ReferralsPage() {
  const referralLink = "https://www.cloakfy.com.br/?ref=356c4253";
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link de indicação copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Cloakfy - Proteção de Campanhas & Cloaker",
          text: "Proteja seus anúncios no Facebook, Google e TikTok com o Cloakfy.",
          url: referralLink,
        });
      } catch {}
    } else {
      copy();
    }
  };

  return (
    <AppShell title="Indicações">
      <div className="mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Central de operação</p>
        <p className="mt-2 text-sm text-white/90 font-medium">
          Cada 3 pessoas que criarem o primeiro cloaker pelo seu link valem +1 cloaker permanente na sua conta, até 10.
        </p>
      </div>

      {/* Link de Indicação - Matching Screenshot 10 */}
      <h2 className="mb-2 text-sm font-semibold text-white">Seu link</h2>
      <Panel className="flex flex-wrap items-center gap-3 p-4 bg-[#14171a] border-border">
        <code className="flex-1 truncate rounded-xl bg-[#0d0f10] border border-border px-4 py-3 font-mono text-sm text-white">
          {referralLink}
        </code>
        <GhostButton onClick={copy} className="py-3 px-5 text-xs font-semibold">
          <Copy className="size-4" />
          {copied ? "Copiado!" : "Copiar"}
        </GhostButton>
        <PrimaryButton onClick={share} className="py-3 px-5 text-xs font-bold">
          <Share2 className="size-4" />
          Compartilhar
        </PrimaryButton>
      </Panel>

      {/* 3 KPI Cards - Matching Screenshot 10 */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Panel className="p-6 bg-[#14171a] border-border">
          <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Users className="size-4 text-muted-foreground" /> Cadastraram
          </p>
          <p className="mt-2 text-3xl font-bold text-white">0</p>
          <p className="mt-1 text-xs text-muted-foreground">Criaram conta pelo seu link</p>
        </Panel>

        <Panel className="p-6 bg-[#14171a] border-border">
          <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <CheckCircle className="size-4 text-emerald-400" /> Qualificaram
          </p>
          <p className="mt-2 text-3xl font-bold text-white">0</p>
          <p className="mt-1 text-xs text-muted-foreground">Já criaram o primeiro cloaker</p>
        </Panel>

        <Panel className="p-6 bg-[#14171a] border-border">
          <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Gift className="size-4 text-primary" /> Cloakers ganhos
          </p>
          <p className="mt-2 text-3xl font-bold text-white">0</p>
          <p className="mt-1 text-xs text-muted-foreground">Teto de 10</p>
        </Panel>
      </div>

      {/* Progress Bar - Matching Screenshot 10 */}
      <Panel className="mt-6 p-6 bg-[#14171a] border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-white">Próximo cloaker</span>
          <span className="font-mono text-muted-foreground">0/3</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full bg-primary" style={{ width: "0%" }} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Faltam 3 pessoas qualificarem pra você ganhar mais um cloaker.
        </p>
      </Panel>

      {/* Como Funciona - Matching Screenshot 10 */}
      <h2 className="mb-3 mt-10 text-sm font-semibold text-white">Como funciona</h2>
      <Panel className="divide-y divide-border bg-[#14171a] border-border text-xs leading-relaxed">
        <div className="flex gap-4 px-6 py-4 items-start">
          <span className="font-bold text-white">1.</span>
          <span className="text-muted-foreground">
            Você manda seu link. Quem clicar e criar conta fica ligado a você por 30 dias.
          </span>
        </div>
        <div className="flex gap-4 px-6 py-4 items-start">
          <span className="font-bold text-white">2.</span>
          <span className="text-muted-foreground">
            Quando essa pessoa cria o primeiro cloaker dela, a indicação qualifica.
          </span>
        </div>
        <div className="flex gap-4 px-6 py-4 items-start">
          <span className="font-bold text-white">3.</span>
          <span className="text-muted-foreground">
            A cada 3 qualificadas, você ganha +1 cloaker permanente — soma ao limite do seu plano e não expira.
          </span>
        </div>
        <div className="px-6 py-4 text-[11px] text-muted-foreground/80">
          Vale só cadastro novo e de pessoa diferente: contas antigas, indicação de si mesmo e repetição do mesmo aparelho não contam.
        </div>
      </Panel>
    </AppShell>
  );
}
