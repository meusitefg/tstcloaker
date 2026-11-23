import { createFileRoute } from "@tanstack/react-router";
import { Radio, Shield, CheckCircle2, Bot, Eye, Zap, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { AppShell, PageHeader, Panel } from "@/components/AppShell";
import { useLinks, useLogs, simulateVisit } from "@/lib/links";

export const Route = createFileRoute("/modelos")({
  head: () => ({
    meta: [
      { title: "Ao Vivo | Cloakfy" },
      { name: "description", content: "Monitor em tempo real de tráfego, decisões de cloaker e bloqueio de bots." },
      { property: "og:title", content: "Ao Vivo | Cloakfy" },
      { property: "og:description", content: "Monitor em tempo real de tráfego, decisões de cloaker e bloqueio de bots." },
    ],
  }),
  component: LiveRadar,
});

function LiveRadar() {
  const cloakers = useLinks();
  const logs = useLogs();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse((p) => !p);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AppShell title="Ao Vivo">
      <PageHeader
        title="Monitor Ao Vivo"
        subtitle="Acompanhe o tráfego e as decisões tomadas pelo cloaker em tempo real."
        action={
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary">
            <span className="size-2 animate-ping rounded-full bg-primary" />
            LIVE RADAR ATIVO
          </span>
        }
      />

      {/* Radar Status Banner */}
      <Panel className="mb-6 p-6 bg-[#14171a] border-border relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
              <Radio className="size-6 animate-pulse" />
              <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/40 animate-ping opacity-30" />
            </div>
            <div>
              <p className="font-semibold text-white text-base">Filtro de Tráfego em Execução</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {cloakers.filter((l) => l.active).length} cloaker(s) protegendo contra crawlers da Meta, Google e TikTok.
              </p>
            </div>
          </div>

          {cloakers.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => simulateVisit(cloakers[0]!.id, false)}
                className="rounded-xl border border-border bg-card/60 px-3.5 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10"
              >
                + Simular Humano
              </button>
              <button
                onClick={() => simulateVisit(cloakers[0]!.id, true)}
                className="rounded-xl border border-border bg-card/60 px-3.5 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/10"
              >
                + Simular Bot
              </button>
            </div>
          )}
        </div>
      </Panel>

      {/* Live Decisions Feed */}
      <Panel className="bg-[#14171a] border-border overflow-hidden">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Transmissão em Tempo Real</h2>
          <span className="text-xs font-mono text-muted-foreground">Atualização contínua</span>
        </div>

        {logs.length === 0 ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            Aguardando novas visitas... As requisições aparecerão aqui instantaneamente.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {logs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between gap-4 px-6 py-3.5 hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-lg ${
                      log.decision === "humano"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {log.decision === "humano" ? <Eye className="size-4" /> : <Bot className="size-4" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {log.decision === "humano" ? "Levar para OFERTA REAL" : "Bloqueado para PÁGINA SAFE"}
                      <span className="text-muted-foreground font-normal ml-2">({log.cloakerName})</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{log.reason}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground shrink-0">{log.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </AppShell>
  );
}
