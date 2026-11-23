import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Shield, Video, Zap, Check } from "lucide-react";
import { AppShell, NewCloakerButton, Panel, useNewCloaker } from "@/components/AppShell";
import { useLinks } from "@/lib/links";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | Cloakfy" },
      { name: "description", content: "Visão geral das suas campanhas, cloakers e acessos no Cloakfy." },
      { property: "og:title", content: "Dashboard | Cloakfy" },
      { property: "og:description", content: "Visão geral das suas campanhas, cloakers e acessos no Cloakfy." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const cloakers = useLinks();
  const open = useNewCloaker();
  const visits = cloakers.reduce((n, l) => n + l.visits, 0);

  const steps = [
    {
      t: "Crie seu primeiro cloaker",
      d: "Defina campanha, páginas e filtros.",
      done: cloakers.length > 0,
      to: "/links",
    },
    {
      t: "Coloque a proteção no ar",
      d: "Ative o cloaker e use o link público no anúncio.",
      done: cloakers.some((l) => l.active),
      to: "/links",
    },
    {
      t: "Confirme o primeiro acesso",
      d: "Acompanhe a decisão em tempo real.",
      done: visits > 0,
      to: "/acessos",
    },
  ] as const;

  const completedStepsCount = steps.filter((s) => s.done).length;

  return (
    <AppShell title="Dashboard">
      {/* Top Welcome Header - Matching Screenshot 6 */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Olá, Kertulli</h1>
          <p className="mt-1 text-sm text-muted-foreground">A qualidade do seu tráfego, em tempo real.</p>
        </div>
        <NewCloakerButton />
      </div>

      {/* Guide Banner - Matching Screenshot 6 */}
      <div className="mt-8">
        <p className="text-xs font-mono text-muted-foreground">/primeiro-acesso</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
          Bem-vindo, Kertulli. O que você quer fazer primeiro?
        </h2>
        <p className="mt-1.5 max-w-xl text-sm text-muted-foreground leading-relaxed">
          Escolha um caminho. Leva uns 2 minutos e você já sai com algo funcionando de verdade.
        </p>
      </div>

      {/* Action Cards Panel - Matching Screenshot 6 */}
      <Panel className="mt-5 border-border bg-[#14171a]">
        <div className="grid md:grid-cols-2">
          {/* Card 1: Proteger uma página */}
          <div className="border-b border-border p-6 md:border-r md:border-b-0">
            <div className="grid size-9 place-items-center rounded-xl bg-secondary text-primary">
              <Shield className="size-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">Proteger uma página</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Bots e moderadores veem a página segura. Seus leads veem a oferta real. Você só cola o link no anúncio.
            </p>
            <button
              onClick={() => open()}
              className="mt-5 flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              <Zap className="size-4" />
              Criar em 30 segundos
              <ArrowRight className="size-4" />
            </button>
            <p className="mt-2 text-xs text-muted-foreground/80">Uma pergunta só — a página segura já vem pronta</p>
          </div>

          {/* Card 2: Camuflar um criativo */}
          <div className="p-6">
            <div className="grid size-9 place-items-center rounded-xl bg-secondary text-primary">
              <Video className="size-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">Camuflar um criativo</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Muda hash e metadados de vídeo, imagem ou áudio pra não cair como duplicado. Roda no seu navegador, nada sai do seu PC.
            </p>
            <Link
              to="/video"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              Camuflar agora
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* 3 Step Explanation Bar */}
        <div className="grid gap-4 border-t border-border p-6 text-xs text-muted-foreground md:grid-cols-3">
          <p className="flex gap-3 items-start">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary font-semibold text-white">
              1
            </span>
            <span>Você cria o cloaker com 2 links: a página segura e a sua oferta real.</span>
          </p>
          <p className="flex gap-3 items-start">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary font-semibold text-white">
              2
            </span>
            <span>Cola o link do cloaker no anúncio em vez do link da oferta.</span>
          </p>
          <p className="flex gap-3 items-start">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary font-semibold text-white">
              3
            </span>
            <span>A gente decide quem vê o quê e você acompanha cada decisão nos Logs.</span>
          </p>
        </div>
      </Panel>

      {/* Progress Checklist - Matching Screenshot 6 */}
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Seu caminho até o primeiro acesso real</h2>
        <span className="text-xs text-muted-foreground">{completedStepsCount} de 3 concluídos</span>
      </div>

      <Panel className="mt-4 divide-y divide-border bg-[#14171a]">
        {steps.map((s, i) => (
          <Link
            key={s.t}
            to={s.to}
            className="flex items-center gap-4 px-6 py-4.5 hover:bg-secondary/40 transition-colors"
          >
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                s.done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {s.done ? <Check className="size-4 stroke-[3]" /> : i + 1}
            </span>
            <div className="min-w-0">
              <span className="block text-sm font-medium text-white">{s.t}</span>
              <span className="text-xs text-muted-foreground">{s.d}</span>
            </div>
            <ChevronRight className="ml-auto size-4 text-muted-foreground" />
          </Link>
        ))}
      </Panel>
    </AppShell>
  );
}
