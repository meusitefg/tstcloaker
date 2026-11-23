import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { B as FileCode, H as ExternalLink, K as Copy, L as Folder, V as Eye, _ as Plus, n as X, u as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as PageHeader, o as Panel, s as PrimaryButton, t as AppShell } from "./AppShell-DpUAxH45.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/paginas-C8b0tIqg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var pageTemplates = [
	{
		id: "bella",
		name: "Studio Bella — Salão & Estética",
		brand: "Studio Bella",
		category: "Beleza",
		headline: "Realce sua beleza natural",
		text: "Cabelo, unhas, estética facial e massagem com profissionais experientes.",
		cta: "Agendar horário",
		color: "#e84c8b",
		bg: "#fdf2f7"
	},
	{
		id: "derma",
		name: "DermaCare — Clínica Dermatológica",
		brand: "DermaCare",
		category: "Saúde",
		headline: "Pele saudável, você mais confiante",
		text: "Tratamentos dermatológicos com tecnologia de ponta e equipe especializada.",
		cta: "Marcar avaliação",
		color: "#0e8fb5",
		bg: "#ecf8fc"
	},
	{
		id: "stratego",
		name: "Stratego Consultoria Empresarial",
		brand: "Stratego",
		category: "Consultoria",
		headline: "Resultados mensuráveis para sua empresa",
		text: "Diagnóstico, planejamento e execução para levar seu negócio ao próximo nível.",
		cta: "Agendar diagnóstico",
		color: "#0f6b5c",
		bg: "#e8f4f1"
	},
	{
		id: "techstore",
		name: "TechStore — Eletrônicos",
		brand: "TechStore",
		category: "E-commerce",
		headline: "Tecnologia com o melhor preço",
		text: "Smartphones, notebooks e acessórios com entrega rápida para todo o Brasil.",
		cta: "Ver ofertas",
		color: "#2563eb",
		bg: "#eef3ff"
	},
	{
		id: "aprenda",
		name: "Aprenda+ — Cursos Online",
		brand: "Aprenda+",
		category: "Educação",
		headline: "Aprenda no seu ritmo",
		text: "Cursos práticos com certificado e acesso vitalício.",
		cta: "Começar agora",
		color: "#d97706",
		bg: "#fff7e8"
	},
	{
		id: "invest",
		name: "Invest Claro — Planejamento",
		brand: "Invest Claro",
		category: "Finanças",
		headline: "Seu dinheiro organizado",
		text: "Planejamento financeiro simples para você e sua família.",
		cta: "Falar com especialista",
		color: "#15803d",
		bg: "#eefaf1"
	}
];
var esc = (s) => s.replace(/[&<>"]/g, (c) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;"
})[c]);
function renderTemplate(t) {
	return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(t.brand)}</title>
<style>body{margin:0;font-family:Georgia,serif;color:#1d1d1f;background:${t.bg}}header{display:flex;justify-content:space-between;align-items:center;padding:16px 28px;background:#fff}
.logo{display:flex;gap:8px;align-items:center;font-weight:700}.logo i{width:16px;height:16px;border-radius:4px;background:${t.color}}
a.btn{background:${t.color};color:#fff;padding:10px 20px;border-radius:999px;text-decoration:none;font-family:sans-serif;font-size:14px}
main{padding:56px 28px}small{letter-spacing:.3em;color:${t.color};font-family:sans-serif;font-size:11px;text-transform:uppercase}h1{font-size:40px;margin:12px 0}p{max-width:520px;line-height:1.6}</style></head>
<body><header><span class="logo"><i></i>${esc(t.brand)}</span><a class="btn" href="#">${esc(t.cta)}</a></header>
<main><small>${esc(t.category)}</small><h1>${esc(t.headline)}</h1><p>${esc(t.text)}</p><a class="btn" href="#">${esc(t.cta)}</a></main></body></html>`;
}
var cats = [
	"Todos",
	"Beleza",
	"Consultoria",
	"E-commerce",
	"Educação",
	"Finanças",
	"Saúde",
	"Tecnologia"
];
function SafePages() {
	const [cat, setCat] = (0, import_react.useState)("Todos");
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [custom, setCustom] = (0, import_react.useState)(false);
	const list = pageTemplates.filter((t) => cat === "Todos" || t.category === cat);
	const copy = async (t) => {
		await navigator.clipboard.writeText(renderTemplate(t));
		toast.success("Código HTML da Página Safe copiado!");
	};
	const openInTab = (t) => {
		const html = renderTemplate(t);
		const blob = new Blob([html], { type: "text/html" });
		const url = URL.createObjectURL(blob);
		window.open(url, "_blank", "noopener");
		toast.success(`Página "${t.name}" aberta em nova aba!`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Páginas Safe",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Páginas Safe",
				subtitle: "Templates prontos para usar como página segura (white) nos seus cloakers."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold text-white",
				children: "Minha página (HTML próprio)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Cole seu próprio HTML — servido transparente no seu domínio, sem expor a Cloakfy."
			}),
			custom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomHtml, { onClose: () => setCustom(false) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-4 flex flex-col items-center px-6 py-12 text-center bg-[#14171a] border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-12 place-items-center rounded-xl bg-secondary text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCode, { className: "size-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-semibold text-white",
						children: "Nenhuma página própria ainda"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Crie uma com o seu HTML para usar como página safe."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
							onClick: () => setCustom(true),
							className: "text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 stroke-[3]" }), "Criar HTML"]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 flex gap-6 overflow-x-auto border-b border-border text-xs font-medium",
				children: cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setCat(c),
					className: `whitespace-nowrap border-b-2 pb-3 transition-colors ${cat === c ? "border-primary font-bold text-white" : "border-transparent text-muted-foreground hover:text-white"}`,
					children: c
				}, c))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3",
				children: list.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "bg-[#14171a] border-border overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none h-48 overflow-hidden border-b border-border bg-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							title: t.name,
							srcDoc: renderTemplate(t),
							className: "h-[600px] w-[200%] origin-top-left scale-50",
							tabIndex: -1
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-sm text-white truncate",
								children: t.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 flex items-center gap-1.5 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "size-3 text-primary" }), t.category]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setPreview(t),
									className: "flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card/60 py-2 text-xs font-medium text-white hover:bg-accent transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), "Preview"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => openInTab(t),
									className: "flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), "Usar"]
								})]
							})
						]
					})]
				}, t.id))
			}),
			preview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex flex-col bg-black/90 p-6 backdrop-blur-md",
				onClick: () => setPreview(null),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-white text-sm",
							children: preview.name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
								onClick: () => copy(preview),
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Copiar HTML"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => openInTab(preview),
								className: "inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs font-medium text-white hover:bg-accent transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" }), "Abrir"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Fechar",
								onClick: () => setPreview(null),
								className: "grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:text-white",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					title: "Prévia",
					srcDoc: renderTemplate(preview),
					className: "flex-1 rounded-xl border border-border bg-white shadow-2xl",
					onClick: (e) => e.stopPropagation()
				})]
			})
		]
	});
}
function CustomHtml({ onClose }) {
	const [html, setHtml] = (0, import_react.useState)(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Minha Página Segura</title><style>body{font-family:sans-serif;margin:40px;text-align:center;color:#333;}</style></head><body><h1>Bem-vindo à nossa página</h1><p>Conteúdo em conformidade com as diretrizes.</p></body></html>`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mt-4 grid md:grid-cols-2 bg-[#14171a] border-border overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-4 border-b border-border md:border-r md:border-b-0 flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs font-semibold text-muted-foreground mb-2",
				children: "Editor HTML"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: html,
				onChange: (e) => setHtml(e.target.value),
				className: "min-h-72 w-full flex-1 resize-none rounded-lg border border-border bg-[#0d0f10] p-3 font-mono text-xs text-white outline-none focus:border-primary"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs font-semibold text-muted-foreground p-4 pb-0",
					children: "Prévia em tempo real"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
					title: "Prévia do HTML",
					sandbox: "",
					srcDoc: html,
					className: "min-h-60 flex-1 m-4 rounded-lg border border-border bg-white"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-2 border-t border-border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-white",
						children: "Fechar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
						onClick: async () => {
							await navigator.clipboard.writeText(html);
							toast.success("HTML copiado!");
						},
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), "Salvar & Copiar"]
					})]
				})
			]
		})]
	});
}
//#endregion
export { SafePages as component };
