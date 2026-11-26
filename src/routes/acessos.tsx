import { createFileRoute } from "@tanstack/react-router";
import { Activity, Eye, Bot, Percent, RefreshCw, FileText, Zap, ShieldAlert, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, Empty, GhostButton, PageHeader, Panel, PrimaryButton } from "@/components/AppShell";
import { useLinks, useLogs, simulateVisit, clearLogs } from "@/lib/links";

export const Route = createFileRoute("/acessos")({
  head: () => ({
    meta: [
      { title: "Logs de acesso | Cloakfy" },
      { name: "description", content: "Visão geral de todos os cloakers. Clique numa linha para ver os acessos." },
      { property: "og:title", content: "Logs de acesso | Cloakfy" },
      { property: "og:description", content: "Visão geral de todos os cloakers. Clique numa linha para ver os acessos." },
    ],
  }),
  component: LogsPage,
});

function LogsPage() {
  const cloakers = useLinks();
  const logs = useLogs();

  const totalClicks = cloakers.reduce((n, l) => n + l.visits, 0);
  const totalHumans = cloakers.reduce((n, l) => n + (l.humanVisits ?? l.visits), 0);
  const totalBots = cloakers.reduce((n, l) => n + (l.botVisits ?? 0), 0);
  const humanRate = totalClicks > 0 ? Math.round((totalHumans / totalClicks) * 100) : 0;

  // 4 Metric cards matching Screenshots 3, 9, 11
  const stats = [
    { label: "Cliques totais", value: totalClicks, icon: Activity, color: "text-white" },
    { label: "Humanos", value: totalHumans, icon: Eye, color: "text-emerald-400" },
    { label: "Bots", value: totalBots, icon: Bot, color: "text-amber-400" },
    { label: "% Taxa humanos", value: `${humanRate}%`, icon: Percent, color: "text-white" },
  ];

  return (
    <AppShell title="Logs">
      <PageHeader
        title="Logs de acesso"
        subtitle="Visão geral de todos os cloakers. Clique numa linha para ver os acessos."
        action={
          <div className="flex items-center gap-2">
            {cloakers.length > 0 && (
              <GhostButton
                onClick={() => {
                  simulateVisit(cloakers[0]!.id, false);
                  toast.success("Simulação de clique humano adicionada aos logs!");
                }}
                className="text-xs"
              >
                <Zap className="size-3.5 text-primary" />
                Simular Humano
              </GhostButton>
            )}
            <GhostButton
              onClick={() => {
                location.reload();
                toast.info("Logs atualizados.");
              }}
              className="text-xs"
            >
              <RefreshCw className="size-3.5" />
              Atualizar
            </GhostButton>
          </div>
        }
      />

      {/* 4 Metric Cards Grid */}
      <Panel className="mb-6 grid grid-cols-2 divide-y divide-border bg-[#14171a] sm:divide-y-0 sm:divide-x md:grid-cols-4 border-border">
        {stats.map((s) => (
          <div key={s.label} className="p-4 sm:p-6">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <s.icon className={`size-3.5 sm:size-4 ${s.color}`} />
              <span className="truncate">{s.label}</span>
            </p>
            <p className={`mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </Panel>

      {/* Main Container - Log Table */}
      {logs.length === 0 ? (
        <Empty
          icon={FileText}
          title="Os acessos aparecem aqui assim que você criar um cloaker."
          actionLabel="Criar primeira"
        />
      ) : (
        <Panel className="bg-[#14171a] border-border overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6 sm:py-4">
            <h2 className="text-sm font-semibold text-white">Últimas requisições filtradas</h2>
            <button
              onClick={() => {
                if (confirm("Limpar todos os logs registrados?")) {
                  clearLogs();
                  toast.success("Logs limpos.");
                }
              }}
              className="text-xs text-muted-foreground hover:text-white transition-colors"
            >
              Limpar histórico
            </button>
          </div>
          <div className="w-full overflow-x-auto divide-y divide-border">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-4 py-3 sm:px-6 sm:py-4 hover:bg-secondary/20 transition-colors min-w-[280px]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        log.decision === "humano"
                          ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                          : "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30"
                      }`}
                    >
                      {log.decision === "humano" ? (
                        <>
                          <CheckCircle2 className="size-3" /> OFERTA REAL (HUMANO)
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="size-3" /> PÁGINA SAFE (BOT/MODERADOR)
                        </>
                      )}
                    </span>
                    <span className="font-semibold text-sm text-white truncate">{log.cloakerName}</span>
                    <span className="text-xs text-muted-foreground">· {log.timestamp}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <span className="text-white/80 font-medium">Motivo do filtro:</span> {log.reason}
                  </p>
                  <p className="mt-0.5 text-[11px] font-mono text-muted-foreground/80 break-all">
                    IP: {log.ip} · {log.city} ({log.country}) · {log.device} · {log.browser}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </AppShell>
  );
}
