import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { K as Copy, c as Sparkles, d as ShieldAlert } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as PageHeader, o as Panel, t as AppShell } from "./AppShell-DpUAxH45.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/texto-BWe4yZGr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var limits = [
	{
		label: "Título do Anúncio",
		max: 40,
		hint: "Espaço visível no cabeçalho dos anúncios"
	},
	{
		label: "Texto Principal / Copy",
		max: 125,
		hint: "Texto exibido antes do botão 'Ver mais'"
	},
	{
		label: "Descrição",
		max: 30,
		hint: "Abaixo do título no feed de notícias"
	}
];
var bannedWords = [
	"emagrecer",
	"emagrecimento",
	"perder peso",
	"cura",
	"garantido",
	"renda extra",
	"ganhar dinheiro",
	"fique rico",
	"antes e depois",
	"milagroso",
	"sem esforço",
	"lucro garantido"
];
function cloakText(text) {
	return text.replace(/a/g, "а").replace(/e/g, "е").replace(/o/g, "о").replace(/p/g, "р");
}
function TextTool() {
	const [values, setValues] = (0, import_react.useState)([
		"",
		"",
		""
	]);
	const [cloakedOutput, setCloakedOutput] = (0, import_react.useState)("");
	const foundBanned = bannedWords.filter((w) => values.some((v) => v.toLowerCase().includes(w)));
	function handleCloak() {
		const fullText = values.filter(Boolean).join("\n\n");
		if (!fullText) return;
		const processed = cloakText(fullText);
		setCloakedOutput(processed);
		toast.success("Texto camuflado com caracteres homóglifos! Robôs não detectarão palavras sensíveis.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Camuflagem de Texto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Camuflagem de Texto",
				subtitle: "Analise sua copy contra palavras sensíveis e camufle termos proibidos com caracteres indetectáveis."
			}),
			foundBanned.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-5 shrink-0 text-amber-400 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-amber-300",
						children: "Atenção: Palavras com alto risco de bloqueio detectadas:"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 flex flex-wrap gap-1.5",
						children: foundBanned.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded bg-amber-500/20 px-2 py-0.5 font-mono text-amber-300",
							children: w
						}, w))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-muted-foreground",
						children: [
							"Utilize o botão ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "\"Camuflar Texto\"" }),
							" abaixo para substituir caracteres sensíveis por homóglifos indetectáveis pelo crawler."
						]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					className: "divide-y divide-border bg-[#14171a] border-border",
					children: limits.map((l, i) => {
						const n = values[i].length;
						const isOver = n > l.max;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-xs font-semibold text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: isOver ? "text-destructive font-bold" : "text-muted-foreground font-mono",
										children: [
											n,
											"/",
											l.max
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: i === 1 ? 4 : 2,
									value: values[i],
									placeholder: `Digite seu ${l.label.toLowerCase()}...`,
									onChange: (e) => setValues(values.map((v, j) => j === i ? e.target.value : v)),
									className: "mt-2.5 w-full resize-none rounded-xl border border-border bg-[#0d0f10] p-3 text-xs text-white outline-none focus:border-primary transition-all"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1.5 block text-[11px] text-muted-foreground",
									children: l.hint
								}),
								isOver && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-1 block text-xs text-destructive",
									children: [
										"Passou ",
										n - l.max,
										" caracteres — corre risco de ser truncado na exibição."
									]
								})
							]
						}, l.label);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "p-5 bg-[#14171a] border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold text-white",
								children: "Camuflar Copy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground leading-relaxed",
								children: "Substitui caracteres visíveis por homóglifos cirílicos idênticos aos olhos humanos, mas com código binário diferente para burlar filtros de bots."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleCloak,
								className: "mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), "Camuflar Texto Agora"]
							})
						]
					}), cloakedOutput && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "p-5 bg-[#14171a] border-primary/40 ring-1 ring-primary/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-primary",
								children: "Texto Camuflado"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: async () => {
									await navigator.clipboard.writeText(cloakedOutput);
									toast.success("Texto copiado para a área de transferência!");
								},
								className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), " Copiar"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl bg-[#0d0f10] p-3 font-mono text-xs text-white/90 whitespace-pre-wrap max-h-48 overflow-y-auto",
							children: cloakedOutput
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { TextTool as component };
