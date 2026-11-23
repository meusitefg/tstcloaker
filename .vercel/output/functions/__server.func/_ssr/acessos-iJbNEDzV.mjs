import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { l as useLinks, n as clearLogs, s as simulateVisit, u as useLogs } from "./links-CzH6hoh2.mjs";
import { V as Eye, Y as CircleCheck, at as Activity, b as Percent, d as ShieldAlert, h as RefreshCw, nt as Bot, t as Zap, z as FileText } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as PageHeader, n as Empty, o as Panel, r as GhostButton, t as AppShell } from "./AppShell-DpUAxH45.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/acessos-iJbNEDzV.js
var import_jsx_runtime = require_jsx_runtime();
function LogsPage() {
	const cloakers = useLinks();
	const logs = useLogs();
	const totalClicks = cloakers.reduce((n, l) => n + l.visits, 0);
	const totalHumans = cloakers.reduce((n, l) => n + (l.humanVisits ?? l.visits), 0);
	const totalBots = cloakers.reduce((n, l) => n + (l.botVisits ?? 0), 0);
	const humanRate = totalClicks > 0 ? Math.round(totalHumans / totalClicks * 100) : 0;
	const stats = [
		{
			label: "Cliques totais",
			value: totalClicks,
			icon: Activity,
			color: "text-white"
		},
		{
			label: "Humanos",
			value: totalHumans,
			icon: Eye,
			color: "text-emerald-400"
		},
		{
			label: "Bots",
			value: totalBots,
			icon: Bot,
			color: "text-amber-400"
		},
		{
			label: "% Taxa humanos",
			value: `${humanRate}%`,
			icon: Percent,
			color: "text-white"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Logs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Logs de acesso",
				subtitle: "Visão geral de todos os cloakers. Clique numa linha para ver os acessos.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [cloakers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, {
						onClick: () => {
							simulateVisit(cloakers[0].id, false);
							toast.success("Simulação de clique humano adicionada aos logs!");
						},
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3.5 text-primary" }), "Simular Humano"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, {
						onClick: () => {
							location.reload();
							toast.info("Logs atualizados.");
						},
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), "Atualizar"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "mb-6 grid grid-cols-2 divide-border bg-[#14171a] md:grid-cols-4 md:divide-x border-border",
				children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 text-xs font-medium text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: `size-4 ${s.color}` }), s.label]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `mt-2 text-3xl font-bold tracking-tight ${s.color}`,
						children: s.value
					})]
				}, s.label))
			}),
			logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				icon: FileText,
				title: "Os acessos aparecem aqui assim que você criar um cloaker.",
				actionLabel: "Criar primeira"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "bg-[#14171a] border-border overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-white",
						children: "Últimas requisições filtradas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (confirm("Limpar todos os logs registrados?")) {
								clearLogs();
								toast.success("Logs limpos.");
							}
						},
						className: "text-xs text-muted-foreground hover:text-white transition-colors",
						children: "Limpar histórico"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: logs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center justify-between gap-4 px-6 py-4 hover:bg-secondary/20 transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${log.decision === "humano" ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30" : "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30"}`,
											children: log.decision === "humano" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), " OFERTA REAL (HUMANO)"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-3" }), " PÁGINA SAFE (BOT/MODERADOR)"] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-sm text-white",
											children: log.cloakerName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: ["· ", log.timestamp]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white/80 font-medium",
											children: "Motivo do filtro:"
										}),
										" ",
										log.reason
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-[11px] font-mono text-muted-foreground/80 truncate",
									children: [
										"IP: ",
										log.ip,
										" · ",
										log.city,
										" (",
										log.country,
										") · ",
										log.device,
										" · ",
										log.browser
									]
								})
							]
						})
					}, log.id))
				})]
			})
		]
	});
}
//#endregion
export { LogsPage as component };
