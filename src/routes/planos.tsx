import { createFileRoute } from "@tanstack/react-router";
import { Check, Diamond, Shield, Zap } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, Panel, PrimaryButton } from "@/components/AppShell";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos | Cloakfy" },
      { name: "description", content: "Conheça os planos do Cloakfy e escale suas campanhas com proteção total." },
      { property: "og:title", content: "Planos | Cloakfy" },
      { property: "og:description", content: "Conheça os planos do Cloakfy e escale suas campanhas com proteção total." },
    ],
  }),
  component: PlansPage,
});

function PlansPage() {
  const plans = [
    {
      name: "Grátis",
      price: "R$ 0",
      desc: "Ideal para começar e testar suas primeiras campanhas.",
      current: true,
      features: [
        "1.000 cliques humanos / mês",
        "Camuflador de Vídeo (WebM)",
        "Camuflador de Imagem & Metadados",
        "Páginas Safe automáticas",
        "Suporte pela comunidade",
      ],
    },
    {
      name: "Starter",
      price: "R$ 97",
      period: "/mês",
      desc: "Para anunciantes individuais que buscam escala sem bloqueios.",
      highlight: true,
      features: [
        "25.000 cliques humanos / mês",
        "Domínios personalizados ilimitados",
        "Integrações Meta, Google e TikTok",
        "Proteção avançada Anti-Spy (Adspy, Dropispy)",
        "Filtro por ASN residencial e 4G/5G",
        "Suporte prioritário via WhatsApp",
      ],
    },
    {
      name: "Pro / Agency",
      price: "R$ 197",
      period: "/mês",
      desc: "Para agências e grandes operações de tráfego direto.",
      features: [
        "150.000 cliques humanos / mês",
        "Tudo do plano Starter",
        "Multi-usuários e times",
        "Webhooks em tempo real",
        "Exportação de vídeos em MP4 nativo",
        "Gerente de conta dedicado",
      ],
    },
  ];

  return (
    <AppShell title="Planos">
      <PageHeader
        title="Planos e Assinaturas"
        subtitle="Escolha a proteção ideal para o volume de tráfego da sua operação."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <Panel
            key={p.name}
            className={`p-6 flex flex-col bg-[#14171a] border-border relative ${
              p.highlight ? "ring-2 ring-primary border-primary/50" : ""
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold text-primary-foreground uppercase tracking-widest">
                Mais Escolhido
              </span>
            )}
            <div>
              <p className="text-base font-bold text-white">{p.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">{p.price}</span>
                {p.period && <span className="text-xs text-muted-foreground">{p.period}</span>}
              </div>
            </div>

            <div className="my-6 border-t border-border pt-4 flex-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Recursos inclusos:
              </p>
              <ul className="space-y-2.5 text-xs text-white/90">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="size-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                if (p.current) {
                  toast.info("Você já está no plano Grátis.");
                } else {
                  toast.success(`Redirecionando para o checkout do plano ${p.name}...`);
                }
              }}
              className={`w-full rounded-xl py-3 text-xs font-bold transition-all ${
                p.current
                  ? "bg-secondary text-white cursor-default"
                  : p.highlight
                  ? "bg-primary text-primary-foreground hover:brightness-110 shadow-lg"
                  : "border border-border bg-card hover:bg-accent text-white"
              }`}
            >
              {p.current ? "Plano Atual" : `Assinar ${p.name}`}
            </button>
          </Panel>
        ))}
      </div>
    </AppShell>
  );
}
