import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as removeLink, c as toggleLink, l as useLinks, o as shareUrl, s as simulateVisit } from "./links-CzH6hoh2.mjs";
import { $ as Check, F as Globe, H as ExternalLink, K as Copy, S as Pause, V as Eye, l as Shield, n as X, nt as Bot, s as Trash2, t as Zap, x as Pencil, y as Play } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as PageHeader, i as NewCloakerButton, n as Empty, o as Panel, t as AppShell } from "./AppShell-DpUAxH45.mjs";
import { createRequire } from "node:module";
//#region node_modules/.nitro/vite/services/ssr/assets/links-271DxOd0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __require = /* #__PURE__ */ (() => createRequire(import.meta.url))();
function updateDestination(id, newDestination) {
	const { useSyncExternalStore } = __require("react");
	try {
		const raw = localStorage.getItem("cloakfy-cloakers");
		if (!raw) return;
		const updated = JSON.parse(raw).map((c) => c.id === id ? {
			...c,
			destination: newDestination
		} : c);
		localStorage.setItem("cloakfy-cloakers", JSON.stringify(updated));
		window.dispatchEvent(new StorageEvent("storage", { key: "cloakfy-cloakers" }));
	} catch (err) {
		console.error("Error updating destination:", err);
	}
}
function CloakersPage() {
	const cloakers = useLinks();
	const humanVisits = cloakers.reduce((n, l) => n + (l.humanVisits ?? l.visits), 0);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editValue, setEditValue] = (0, import_react.useState)("");
	function startEdit(cloaker) {
		setEditingId(cloaker.id);
		setEditValue(cloaker.destination);
	}
	function saveEdit() {
		if (!editingId || !editValue.trim()) return;
		let url = editValue.trim();
		if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;
		try {
			new URL(url);
		} catch {
			toast.error("URL inválida. Informe um link completo.");
			return;
		}
		updateDestination(editingId, url);
		toast.success("Link da oferta atualizado!");
		setEditingId(null);
		setEditValue("");
	}
	function cancelEdit() {
		setEditingId(null);
		setEditValue("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Cloakers",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Cloaker de Páginas",
				subtitle: "Crie, acompanhe e ajuste a proteção das suas campanhas.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewCloakerButton, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mb-6 grid md:grid-cols-[260px_1fr] bg-[#14171a] border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border p-6 md:border-r md:border-b-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted-foreground",
							children: "Seu plano:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-2xl font-bold text-white",
							children: "Grátis"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/planos",
							className: "mt-4 inline-block rounded-xl border border-border bg-card/60 px-4 py-2 text-xs font-semibold text-white hover:bg-accent transition-colors",
							children: "Fazer upgrade"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted-foreground",
							children: "Cliques humanos este mês"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-2xl font-bold text-white",
							children: [
								humanVisits,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-normal text-muted-foreground",
									children: "/ 1.000"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 h-1.5 w-full overflow-hidden rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-primary transition-all duration-500",
								style: { width: `${Math.min(100, Math.max(humanVisits > 0 ? 5 : 0, humanVisits / 1e3 * 100))}%` }
							})
						})
					]
				})]
			}),
			cloakers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				icon: Globe,
				title: "Seu primeiro cloaker em 2 minutos",
				text: "Bots e moderadores veem a página segura. Seus leads veem a oferta real. Você só cola o link no anúncio. Você ganha 7 dias grátis.",
				actionLabel: "Criar primeira"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "divide-y divide-border bg-[#14171a]",
				children: cloakers.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-3 px-6 py-5 hover:bg-secondary/10 transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-white truncate",
										children: l.name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
									children: [editingId === l.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 flex-1 min-w-[200px]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-emerald-400 font-mono shrink-0",
												children: "Oferta Real:"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: editValue,
												onChange: (e) => setEditValue(e.target.value),
												onKeyDown: (e) => {
													if (e.key === "Enter") saveEdit();
													if (e.key === "Escape") cancelEdit();
												},
												className: "flex-1 min-w-0 rounded-lg border border-primary bg-[#0d0f10] px-2.5 py-1 text-xs text-white outline-none focus:ring-1 focus:ring-primary font-mono",
												autoFocus: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: saveEdit,
												className: "grid size-6 place-items-center rounded bg-primary/20 text-primary hover:bg-primary/40 transition-colors",
												title: "Salvar",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: cancelEdit,
												className: "grid size-6 place-items-center rounded bg-secondary text-muted-foreground hover:text-white transition-colors",
												title: "Cancelar",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
											})
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5 min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-emerald-400 font-mono shrink-0",
												children: "Oferta Real:"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: l.destination
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => startEdit(l),
												className: "shrink-0 p-0.5 text-muted-foreground hover:text-primary transition-colors",
												title: "Editar link da oferta",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3" })
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "truncate",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-blue-400 font-mono",
												children: "Safe:"
											}),
											" ",
											l.safePage || "Template Automático"
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-3 py-1 text-xs font-semibold ${l.active ? "bg-success-soft text-primary ring-1 ring-primary/20" : "bg-secondary text-muted-foreground"}`,
								children: l.active ? "Ativo" : "Pausado"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-white text-sm",
										children: l.humanVisits ?? l.visits
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-emerald-400 flex items-center gap-1 justify-end",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3" }), " Humanos"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right border-l border-border pl-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-white text-sm",
										children: l.botVisits ?? 0
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-amber-400 flex items-center gap-1 justify-end",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "size-3" }), " Bots"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										title: "Simular clique humano",
										onClick: () => {
											simulateVisit(l.id, false);
											toast.success("Clique humano simulado! Visita registrada.");
										},
										className: "hidden sm:inline-flex items-center gap-1 rounded-lg border border-border bg-card/60 px-2.5 py-1.5 text-[11px] font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3" }), " +Humano"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										title: "Simular bot do Facebook/Google",
										onClick: () => {
											simulateVisit(l.id, true);
											toast.info("Bot simulado! Desviado para página safe.");
										},
										className: "hidden sm:inline-flex items-center gap-1 rounded-lg border border-border bg-card/60 px-2.5 py-1.5 text-[11px] font-medium text-amber-400 hover:bg-amber-500/10 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "size-3" }), " +Bot"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
										label: "Editar link da oferta",
										onClick: () => editingId === l.id ? cancelEdit() : startEdit(l),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
										label: "Copiar link do cloaker",
										onClick: async () => {
											await navigator.clipboard.writeText(shareUrl(l.id));
											toast.success("Link do cloaker copiado!");
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: shareUrl(l.id),
										target: "_blank",
										rel: "noreferrer",
										title: "Testar link público",
										className: "grid size-9 place-items-center rounded-xl border border-border bg-card/60 hover:bg-accent text-muted-foreground hover:text-white transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
										label: l.active ? "Pausar proteção" : "Ativar proteção",
										onClick: () => {
											toggleLink(l.id);
											toast.info(l.active ? "Cloaker pausado." : "Cloaker ativado!");
										},
										children: l.active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
										label: "Excluir cloaker",
										onClick: () => {
											if (confirm("Deseja realmente remover este cloaker?")) {
												removeLink(l.id);
												toast.success("Cloaker removido.");
											}
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
									})
								]
							})
						]
					})
				}, l.id))
			})
		]
	});
}
function IconBtn({ label, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		"aria-label": label,
		title: label,
		onClick,
		className: "grid size-9 place-items-center rounded-xl border border-border bg-card/60 hover:bg-accent text-muted-foreground hover:text-white transition-colors [&_svg]:size-4",
		children
	});
}
//#endregion
export { CloakersPage as component };
