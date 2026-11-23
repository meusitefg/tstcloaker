import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { $ as Check, K as Copy, r as WandSparkles } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Panel, t as AppShell } from "./AppShell-DpUAxH45.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/camuflar-texto-C3O0bFqU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HOMOGLYPHS = {
	a: "а",
	c: "с",
	d: "ԁ",
	e: "е",
	g: "ɡ",
	h: "һ",
	i: "і",
	j: "ј",
	k: "к",
	o: "о",
	p: "р",
	s: "ѕ",
	w: "ԝ",
	x: "х",
	y: "у",
	A: "А",
	B: "В",
	C: "С",
	E: "Е",
	H: "Н",
	I: "І",
	J: "Ј",
	K: "К",
	M: "М",
	N: "Ν",
	O: "О",
	P: "Р",
	S: "Ѕ",
	T: "Т",
	X: "Х",
	Y: "Υ",
	Z: "Ζ"
};
var SEPARATORS = [
	"⁠",
	"‌",
	"⁣",
	"⁢"
];
var MODES = [
	{
		mode: "anuncios",
		label: "Anúncios (Máxima)",
		desc: "Substituição completa por homóglifos + separadores invisíveis de micro-bytes entre caracteres."
	},
	{
		mode: "email",
		label: "E-mail (Leve)",
		desc: "Substitui apenas a primeira ocorrência sensível de cada palavra. Ideal para deliverability."
	},
	{
		mode: "sms",
		label: "SMS (Equilibrada)",
		desc: "Substitui caracteres de forma intercalada (50%). Excelente para SMS e WhatsApp."
	}
];
function applyHomoglyphs(word, mode) {
	const chars = [...word];
	let replacedCount = 0;
	const transformed = chars.map((char) => {
		const replacement = HOMOGLYPHS[char];
		if (!replacement) return char;
		const count = replacedCount++;
		if (mode === "email") return count === 0 ? replacement : char;
		if (mode === "sms") return count % 2 === 0 ? replacement : char;
		return replacement;
	});
	if (mode !== "anuncios") return transformed.join("");
	let result = "";
	transformed.forEach((char, index) => {
		result += char;
		if (index < transformed.length - 1) result += SEPARATORS[index % SEPARATORS.length];
	});
	return result;
}
function cloakText(text, mode) {
	return text.split(/(\s+)/).map((chunk) => /^\s+$/.test(chunk) || chunk === "" ? chunk : applyHomoglyphs(chunk, mode)).join("");
}
function CamuflarTextoPage() {
	const [input, setInput] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("anuncios");
	const [result, setResult] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	function handleProcess() {
		if (!input.trim()) {
			toast.error("Digite ou cole um texto para camuflar.");
			return;
		}
		setLoading(true);
		setTimeout(() => {
			const modeObj = MODES.find((m) => m.mode === mode);
			const camouflaged = cloakText(input.trim(), mode);
			setResult({
				text: camouflaged,
				modeLabel: modeObj.label
			});
			setLoading(false);
			toast.success("Texto camuflado com sucesso!");
		}, 200);
	}
	function handleCopy() {
		if (!result) return;
		navigator.clipboard.writeText(result.text);
		setCopied(true);
		toast.success("Texto camuflado copiado!");
		setTimeout(() => setCopied(false), 2e3);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Camuflagem de Texto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
						children: "/camuflar-texto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-3xl font-bold tracking-tight text-white",
						children: "Camuflagem de Texto"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-xs text-muted-foreground leading-relaxed",
						children: "Camufle suas copies, termos proibidos e palavras sensíveis usando caracteres homóglifos e separadores invisíveis indetectáveis para robôs de compliance."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "p-5 bg-[#14171a] border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "text-input",
							className: "text-sm font-semibold text-white",
							children: "Texto para camuflar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-mono text-muted-foreground",
							children: [input.length, " caracteres"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						id: "text-input",
						rows: 8,
						value: input,
						onChange: (e) => setInput(e.target.value),
						placeholder: "Cole aqui o texto da sua copy, anúncio ou mensagem...",
						className: "w-full resize-none rounded-xl border border-border bg-[#0d0f10] p-4 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-all font-sans"
					})]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "bg-[#14171a] border-border divide-y divide-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold text-white",
								children: "Nível de Camuflagem"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Escolha o algoritmo de proteção:"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3 space-y-2",
							children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								onClick: () => setMode(m.mode),
								className: `flex cursor-pointer gap-3 p-3 rounded-xl transition-all ${mode === m.mode ? "bg-secondary/60 ring-1 ring-primary/40" : "hover:bg-secondary/20"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "radio",
									name: "textMode",
									checked: mode === m.mode,
									onChange: () => setMode(m.mode),
									className: "mt-1 accent-primary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs font-bold text-white",
									children: m.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block text-[11px] text-muted-foreground leading-relaxed",
									children: m.desc
								})] })]
							}, m.mode))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleProcess,
								disabled: loading || !input.trim(),
								className: "flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4" }), loading ? "Processando..." : "Camuflar Texto Agora"]
							})
						})
					]
				}) })]
			}),
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-6 p-6 bg-[#14171a] border-primary/40 ring-1 ring-primary/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold text-primary uppercase tracking-wider",
						children: "Resultado Camuflado"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-2 text-xs text-muted-foreground",
						children: ["· Nível: ", result.modeLabel]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleCopy,
						className: "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-card transition-all",
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copied ? "Copiado!" : "Copiar"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-[#0d0f10] p-4 font-sans text-sm text-white/95 leading-relaxed whitespace-pre-wrap selection:bg-primary/30",
					children: result.text
				})]
			})
		]
	});
}
//#endregion
export { CamuflarTextoPage as component };
