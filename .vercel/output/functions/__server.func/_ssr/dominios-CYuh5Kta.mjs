import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { F as Globe, K as Copy, _ as Plus, j as Info, s as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Panel, s as PrimaryButton, t as AppShell } from "./AppShell-DpUAxH45.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dominios-CYuh5Kta.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "cloakfy-domains";
function readDomains() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function saveDomains(domains) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(domains));
}
function DominiosPage() {
	const [domains, setDomains] = (0, import_react.useState)(() => readDomains());
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [inputDomain, setInputDomain] = (0, import_react.useState)("");
	const [inputError, setInputError] = (0, import_react.useState)("");
	function handleAdd() {
		setInputError("");
		const val = inputDomain.trim().toLowerCase().replace(/^https?:\/\//, "");
		if (!val || !val.includes(".") || val.length < 4) {
			setInputError("Informe um domínio válido, ex: links.meusite.com");
			return;
		}
		if (domains.find((d) => d.domain === val)) {
			setInputError("Este domínio já foi adicionado.");
			return;
		}
		const updated = [{
			id: Math.random().toString(36).slice(2, 9),
			domain: val,
			status: "pending",
			cname: "cloakfy.app",
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}, ...domains];
		setDomains(updated);
		saveDomains(updated);
		setInputDomain("");
		setAdding(false);
		toast.success(`Domínio ${val} adicionado! Configure o CNAME conforme abaixo.`);
	}
	function handleRemove(id) {
		if (!confirm("Remover este domínio do Cloakfy?")) return;
		const updated = domains.filter((d) => d.id !== id);
		setDomains(updated);
		saveDomains(updated);
		toast.success("Domínio removido.");
	}
	function handleVerify(id) {
		const updated = domains.map((d) => d.id === id ? {
			...d,
			status: "active"
		} : d);
		setDomains(updated);
		saveDomains(updated);
		toast.success("Domínio verificado e ativo!");
	}
	function copyToClipboard(text, label) {
		navigator.clipboard.writeText(text).then(() => toast.success(`${label} copiado!`));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Domínios",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold tracking-tight text-white",
					children: "Meus Domínios"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm text-muted-foreground",
					children: "Conecte seu próprio domínio pra rodar os cloakers e proteger sua marca."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
					onClick: () => setAdding(true),
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 stroke-[3]" }), "Adicionar domínio"]
				})]
			}),
			adding && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mb-6 p-5 bg-[#14171a] border-primary/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold text-white mb-3",
					children: "Novo domínio personalizado"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 sm:flex-row sm:items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: inputDomain,
								onChange: (e) => setInputDomain(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && handleAdd(),
								placeholder: "links.meusite.com.br",
								className: "w-full rounded-xl border border-border bg-[#0d0f10] px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-muted-foreground/60 focus:border-primary transition-all",
								autoFocus: true
							}),
							inputError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-xs text-destructive",
								children: inputError
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-xs text-muted-foreground",
								children: "Use um subdomínio (ex: links.seusite.com). Você precisará configurar um CNAME."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryButton, {
							onClick: handleAdd,
							className: "text-xs",
							children: "Adicionar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setAdding(false);
								setInputDomain("");
								setInputError("");
							},
							className: "rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs text-muted-foreground hover:text-white transition-colors",
							children: "Cancelar"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "mb-6 p-5 bg-[#14171a] border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-4 text-primary mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-white mb-2",
						children: "Como configurar seu domínio"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "list-decimal list-inside space-y-1.5 text-xs text-muted-foreground leading-relaxed",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"Adicione o subdomínio acima (ex: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-white",
									children: "links.seusite.com"
								}),
								")"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"No painel DNS do seu domínio, crie um registro",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-white",
									children: "CNAME"
								}),
								" apontando para",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => copyToClipboard("cloakfy.app", "CNAME"),
									className: "font-mono text-primary hover:underline",
									children: "cloakfy.app"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Aguarde até 48h para propagação DNS (geralmente menos de 5 min)" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Clique em \"Verificar\" para confirmar a configuração" })
						]
					})] })]
				})
			}),
			domains.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-col items-center px-6 py-16 text-center bg-[#14171a] border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-12 place-items-center rounded-xl border border-border bg-secondary/80",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "size-5 text-muted-foreground" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-base font-semibold text-white",
						children: "Nenhum domínio configurado"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-md text-sm text-muted-foreground",
						children: "Adicione seu domínio personalizado para usar nos links dos cloakers."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
						onClick: () => setAdding(true),
						className: "mt-6 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 stroke-[3]" }), "Adicionar primeiro domínio"]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "divide-y divide-border bg-[#14171a]",
				children: domains.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-4 px-6 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "size-4 text-primary shrink-0" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-white",
									children: d.domain
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-2.5 py-0.5 text-[10px] font-bold ${d.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : d.status === "error" ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`,
									children: d.status === "active" ? "✓ Ativo" : d.status === "error" ? "✗ Erro DNS" : "⏳ Pendente"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"CNAME →",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-white",
									children: d.cname
								})
							] }), d.status === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-primary",
								children: [
									"https://",
									d.domain,
									"/r/[id-do-cloaker]"
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 shrink-0",
						children: [
							d.status !== "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleVerify(d.id),
								className: "rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-white hover:bg-accent transition-colors",
								children: "Verificar"
							}),
							d.status === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => copyToClipboard(`https://${d.domain}`, "URL do domínio"),
								className: "grid size-8 place-items-center rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-white transition-colors",
								title: "Copiar URL",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleRemove(d.id),
								className: "grid size-8 place-items-center rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-destructive transition-colors",
								title: "Remover domínio",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
							})
						]
					})]
				}, d.id))
			})
		]
	});
}
//#endregion
export { DominiosPage as component };
