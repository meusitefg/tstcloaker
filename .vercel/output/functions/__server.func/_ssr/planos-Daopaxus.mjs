import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { $ as Check } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as PageHeader, o as Panel, t as AppShell } from "./AppShell-DpUAxH45.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/planos-Daopaxus.js
var import_jsx_runtime = require_jsx_runtime();
function PlansPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Planos",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Planos e Assinaturas",
			subtitle: "Escolha a proteção ideal para o volume de tráfego da sua operação."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-6 md:grid-cols-3",
			children: [
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
						"Suporte pela comunidade"
					]
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
						"Suporte prioritário via WhatsApp"
					]
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
						"Gerente de conta dedicado"
					]
				}
			].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: `p-6 flex flex-col bg-[#14171a] border-border relative ${p.highlight ? "ring-2 ring-primary border-primary/50" : ""}`,
				children: [
					p.highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold text-primary-foreground uppercase tracking-widest",
						children: "Mais Escolhido"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base font-bold text-white",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: p.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-baseline gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-3xl font-extrabold text-white",
								children: p.price
							}), p.period && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: p.period
							})]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-6 border-t border-border pt-4 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3",
							children: "Recursos inclusos:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2.5 text-xs text-white/90",
							children: p.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f })]
							}, f))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (p.current) toast.info("Você já está no plano Grátis.");
							else toast.success(`Redirecionando para o checkout do plano ${p.name}...`);
						},
						className: `w-full rounded-xl py-3 text-xs font-bold transition-all ${p.current ? "bg-secondary text-white cursor-default" : p.highlight ? "bg-primary text-primary-foreground hover:brightness-110 shadow-lg" : "border border-border bg-card hover:bg-accent text-white"}`,
						children: p.current ? "Plano Atual" : `Assinar ${p.name}`
					})
				]
			}, p.name))
		})]
	});
}
//#endregion
export { PlansPage as component };
