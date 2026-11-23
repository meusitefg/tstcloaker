import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { K as Copy, Y as CircleCheck, c as Sparkles, d as ShieldAlert, p as SearchCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Panel, t as AppShell } from "./AppShell-DpUAxH45.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analise-anuncio-CAfxRDBl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PLATFORMS = [
	{
		key: "meta",
		label: "Meta Ads (Facebook & Instagram)"
	},
	{
		key: "google",
		label: "Google Ads (Search & YouTube)"
	},
	{
		key: "tiktok",
		label: "TikTok Ads"
	}
];
var NICHES = [
	{
		key: "emagrecimento",
		label: "Emagrecimento & Estética"
	},
	{
		key: "financeiro",
		label: "Renda Extra, Finanças & Cripto"
	},
	{
		key: "saude",
		label: "Saúde, Dores & Tratamentos"
	},
	{
		key: "relacionamento",
		label: "Relacionamentos & Reconquista"
	},
	{
		key: "igaming",
		label: "Apostas & iGaming"
	},
	{
		key: "ecommerce",
		label: "E-commerce & Produtos Físicos"
	}
];
function analyzeCopy(title, body, platform, niche) {
	const fullText = (title + " " + body).toLowerCase();
	const issues = [];
	if (fullText.match(/(garantido|certeza|100%|definitivo|infalível|cura)/)) issues.push({
		type: "critical",
		rule: "Promessa Absoluta ou Não Comprovável",
		explanation: "Plataformas banem termos que garantem resultados sem comprovação científica ou probabilidade estatística."
	});
	if (fullText.match(/(você está|sua barriga|seu peso|está falido|sua dívida|seu casamento)/)) issues.push({
		type: "critical",
		rule: "Atributos Pessoais Diretos",
		explanation: "O algoritmo proíbe apontar falhas ou características corporais/financeiras diretas do usuário na copy."
	});
	if (fullText.match(/(\d+\s*(dias|semanas|horas)|em menos de)/)) issues.push({
		type: "warning",
		rule: "Promessa com Prazo Estrito",
		explanation: "Prazos fixos para resultados (ex: 'em 7 dias') ativam alertas de revisão manual nos moderadores."
	});
	if (niche === "emagrecimento" && fullText.match(/(perder peso|queimar gordura|secar)/)) issues.push({
		type: "warning",
		rule: "Sensibilidade de Política de Saúde",
		explanation: "Use termos neutros como 'rotina equilibrada' ou 'método de autocuidado' em vez de emagrecimento explícito."
	});
	if (niche === "financeiro" && fullText.match(/(renda extra|dinheiro rápido|ganhar dinheiro|lucro)/)) issues.push({
		type: "critical",
		rule: "Promessa de Oportunidade Financeira Irreal",
		explanation: "Termos explícitos de ganho de dinheiro levam a bloqueios imediatos da BM no Facebook."
	});
	let score = 100 - issues.filter((i) => i.type === "critical").length * 35 - issues.filter((i) => i.type === "warning").length * 15;
	score = Math.max(15, Math.min(98, score));
	const risk = score >= 80 ? "baixo" : score >= 50 ? "medio" : "critico";
	let safeCopy = body.replace(/emagrecer|perder peso|queimar gordura/gi, "transformar sua rotina de bem-estar").replace(/ganhar dinheiro|renda extra|lucro garantido/gi, "novas estratégias de crescimento").replace(/garantido|100%|certeza/gi, "comprovado por quem aplica o método").replace(/você está/gi, "muitas pessoas estão");
	if (!safeCopy) safeCopy = "Descubra como estruturar sua jornada de forma prática com o método validado por centenas de pessoas.";
	return {
		score,
		risk,
		issues,
		safeCopy
	};
}
function AnaliseAnuncioPage() {
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [platform, setPlatform] = (0, import_react.useState)("meta");
	const [niche, setNiche] = (0, import_react.useState)("emagrecimento");
	const [result, setResult] = (0, import_react.useState)(null);
	const [analyzing, setAnalyzing] = (0, import_react.useState)(false);
	function handleAnalyze() {
		if (!title.trim() && !body.trim()) {
			toast.error("Informe o título ou a copy do anúncio.");
			return;
		}
		setAnalyzing(true);
		setTimeout(() => {
			const res = analyzeCopy(title, body, platform, niche);
			setResult(res);
			setAnalyzing(false);
			toast.success("Análise de conformidade concluída!");
		}, 400);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Análise de Anúncio",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
					children: "/analise-anuncio"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-1 text-3xl font-bold tracking-tight text-white flex items-center gap-2.5",
					children: ["Análise de Anúncio", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchCheck, { className: "size-6 text-primary" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-xs text-muted-foreground leading-relaxed",
					children: "Analise texto, gatilhos mentais e conformidade de compliance do seu anúncio contra as políticas da Meta, Google e TikTok antes de publicar."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[1fr_360px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "p-5 bg-[#14171a] border-border space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-semibold text-white block mb-1.5",
						children: "Título do Anúncio"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Ex: Como Conquistar Sua Liberdade Financeira...",
						className: "w-full rounded-xl border border-border bg-[#0d0f10] p-3 text-xs text-white outline-none focus:border-primary"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs font-semibold text-white block mb-1.5",
						children: "Texto Principal / Copy do Anúncio"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 6,
						value: body,
						onChange: (e) => setBody(e.target.value),
						placeholder: "Cole o texto completo do anúncio aqui...",
						className: "w-full resize-none rounded-xl border border-border bg-[#0d0f10] p-3.5 text-xs text-white outline-none focus:border-primary font-sans leading-relaxed"
					})] })]
				}), result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "p-6 bg-[#14171a] border-border space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground uppercase tracking-wider font-semibold",
								children: "Índice de Aprovação"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-3xl font-extrabold text-white",
									children: [result.score, "%"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `rounded-full px-3 py-1 text-xs font-bold uppercase ${result.risk === "baixo" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : result.risk === "medio" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-rose-500/15 text-rose-400 border border-rose-500/30"}`,
									children: ["Risco ", result.risk]
								})]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Plataforma: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: PLATFORMS.find((p) => p.key === platform)?.label.split(" ")[0] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Nicho: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: NICHES.find((n) => n.key === niche)?.label.split(" ")[0] })] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-xs font-bold text-white uppercase tracking-wider mb-3",
							children: [
								"Diagnóstico de Políticas (",
								result.issues.length,
								" alertas)"
							]
						}), result.issues.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" }), "Nenhuma violação grave encontrada. Copy em alta conformidade!"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2.5",
							children: result.issues.map((issue, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex items-start gap-2.5 rounded-xl border p-3 text-xs ${issue.type === "critical" ? "border-rose-500/30 bg-rose-500/10 text-rose-200" : "border-amber-500/30 bg-amber-500/10 text-amber-200"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold",
									children: issue.rule
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] opacity-80 mt-0.5",
									children: issue.explanation
								})] })]
							}, idx))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-primary flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), "Sugestão de Copy Blindada (Compliance Safe)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => {
										navigator.clipboard.writeText(result.safeCopy);
										toast.success("Copy blindada copiada!");
									},
									className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), " Copiar"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-border bg-[#0d0f10] p-3.5 text-xs text-white/90 leading-relaxed font-sans",
								children: result.safeCopy
							})]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "bg-[#14171a] border-border divide-y divide-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold text-white",
							children: "Parâmetros do Anúncio"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Configuração de auditoria:"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-white block",
							children: "Rede de Anúncios"
						}), PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							onClick: () => setPlatform(p.key),
							className: `flex cursor-pointer gap-2.5 p-2.5 rounded-xl text-xs transition-all ${platform === p.key ? "bg-secondary/60 ring-1 ring-primary/40 font-bold text-white" : "text-muted-foreground hover:bg-secondary/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "platformSelect",
								checked: platform === p.key,
								onChange: () => setPlatform(p.key),
								className: "accent-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.label })]
						}, p.key))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-white block",
							children: "Nicho / Vertical"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: niche,
							onChange: (e) => setNiche(e.target.value),
							className: "w-full rounded-xl border border-border bg-[#0d0f10] p-2.5 text-xs text-white outline-none focus:border-primary",
							children: NICHES.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: n.key,
								children: n.label
							}, n.key))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: analyzing || !title.trim() && !body.trim(),
							onClick: handleAnalyze,
							className: "flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchCheck, { className: "size-4" }), analyzing ? "Auditando Copy..." : "Auditar Anúncio"]
						})
					})
				]
			}) })]
		})]
	});
}
//#endregion
export { AnaliseAnuncioPage as component };
