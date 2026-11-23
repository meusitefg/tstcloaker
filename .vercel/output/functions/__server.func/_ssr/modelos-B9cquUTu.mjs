import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { l as useLinks, s as simulateVisit, u as useLogs } from "./links-CzH6hoh2.mjs";
import { V as Eye, g as Radio, nt as Bot } from "../_libs/lucide-react.mjs";
import { a as PageHeader, o as Panel, t as AppShell } from "./AppShell-DpUAxH45.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/modelos-B9cquUTu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LiveRadar() {
	const cloakers = useLinks();
	const logs = useLogs();
	const [pulse, setPulse] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const timer = setInterval(() => {
			setPulse((p) => !p);
		}, 2e3);
		return () => clearInterval(timer);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Ao Vivo",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Monitor Ao Vivo",
				subtitle: "Acompanhe o tráfego e as decisões tomadas pelo cloaker em tempo real.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 animate-ping rounded-full bg-primary" }), "LIVE RADAR ATIVO"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "mb-6 p-6 bg-[#14171a] border-border relative overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative grid size-12 place-items-center rounded-2xl bg-secondary text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-6 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-2xl ring-2 ring-primary/40 animate-ping opacity-30" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-white text-base",
							children: "Filtro de Tráfego em Execução"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: [cloakers.filter((l) => l.active).length, " cloaker(s) protegendo contra crawlers da Meta, Google e TikTok."]
						})] })]
					}), cloakers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => simulateVisit(cloakers[0].id, false),
							className: "rounded-xl border border-border bg-card/60 px-3.5 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10",
							children: "+ Simular Humano"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => simulateVisit(cloakers[0].id, true),
							className: "rounded-xl border border-border bg-card/60 px-3.5 py-2 text-xs font-medium text-amber-400 hover:bg-amber-500/10",
							children: "+ Simular Bot"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "bg-[#14171a] border-border overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-6 py-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-white",
						children: "Transmissão em Tempo Real"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-mono text-muted-foreground",
						children: "Atualização contínua"
					})]
				}), logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-16 text-center text-xs text-muted-foreground",
					children: "Aguardando novas visitas... As requisições aparecerão aqui instantaneamente."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: logs.slice(0, 10).map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 px-6 py-3.5 hover:bg-secondary/20 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid size-7 shrink-0 place-items-center rounded-lg ${log.decision === "humano" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`,
								children: log.decision === "humano" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs font-semibold text-white truncate",
									children: [log.decision === "humano" ? "Levar para OFERTA REAL" : "Bloqueado para PÁGINA SAFE", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground font-normal ml-2",
										children: [
											"(",
											log.cloakerName,
											")"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground truncate",
									children: log.reason
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-mono text-muted-foreground shrink-0",
							children: log.timestamp
						})]
					}, log.id))
				})]
			})
		]
	});
}
//#endregion
export { LiveRadar as component };
