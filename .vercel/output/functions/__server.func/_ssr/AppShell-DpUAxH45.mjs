import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { m as useRouterState, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as normalizeUrl, t as addCloaker } from "./links-CzH6hoh2.mjs";
import { A as Instagram, B as FileCode, C as Music, D as LogOut, F as Globe, I as Gift, J as CircleQuestionMark, M as Image, O as LayoutGrid, P as Heart, Q as ChevronDown, R as Flame, T as MessageSquarePlus, W as Diamond, _ as Plus, a as Video, g as Radio, k as Layers, l as Shield, n as X, p as SearchCheck, u as ShieldCheck, v as Plug, w as MessageSquare, z as FileText } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-DpUAxH45.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewLinkDialog({ open, onClose, preset }) {
	const [error, setError] = (0, import_react.useState)("");
	const [showAdvanced, setShowAdvanced] = (0, import_react.useState)(false);
	const [safeTemplate, setSafeTemplate] = (0, import_react.useState)(preset?.safeTemplateId || "bella");
	const [mode, setMode] = (0, import_react.useState)("normal");
	if (!open) return null;
	function submit(e) {
		e.preventDefault();
		const f = new FormData(e.currentTarget);
		const destinationInput = String(f.get("destination") || "").trim();
		const destination = normalizeUrl(destinationInput);
		if (!destination) {
			setError("Informe um endereço válido da sua oferta (ex: minhaoferta.com/vendas).");
			return;
		}
		const name = String(f.get("name") || "").trim() || new URL(destination).hostname;
		const source = String(f.get("source") || "").trim();
		const medium = String(f.get("medium") || "").trim();
		const campaign = String(f.get("campaign") || "").trim();
		addCloaker({
			destination,
			name,
			safePage: `https://cloakfy.app/safe/${safeTemplate}`,
			safeTemplateId: safeTemplate,
			source,
			medium,
			campaign,
			mode
		});
		toast.success("Cloaker criado com proteção ativa!");
		setError("");
		onClose();
	}
	function useExample() {
		addCloaker({
			name: "Oferta Exemplo (VSL)",
			destination: "https://minhaoferta.com/vsl-secreta",
			safePage: "https://cloakfy.app/safe/bella",
			safeTemplateId: "bella",
			source: "facebook",
			medium: "cpc",
			campaign: "vsl-black",
			mode: "normal"
		});
		toast.success("Cloaker de exemplo criado!");
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			onClick: (e) => e.stopPropagation(),
			className: "w-full max-w-lg rounded-2xl border border-border bg-[#14171a] p-6 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 place-items-center rounded-xl border border-border/80 bg-secondary text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold text-white",
							children: "Seu primeiro cloaker"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onClose,
							"aria-label": "Fechar",
							className: "ml-auto text-muted-foreground hover:text-white transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs leading-relaxed text-muted-foreground",
					children: "Uma pergunta só. A página segura que o bot vai ver já vem pronta — você troca depois se quiser."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs font-semibold text-white",
						children: ["Link da sua oferta", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "destination",
							type: "text",
							placeholder: "minhaoferta.com/vendas",
							autoFocus: true,
							required: true,
							className: "mt-2 w-full rounded-xl border border-border bg-[#0d0f10] px-3.5 py-3 text-sm text-white outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1.5 block text-[11px] text-muted-foreground",
						children: "É pra onde seu lead vai. Pode trocar depois."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 border-t border-border/60 pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setShowAdvanced(!showAdvanced),
						className: "flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-white",
						children: ["Opções avançadas (Página safe, UTMs e filtros)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `size-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}` })]
					}), showAdvanced && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-3.5 pt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-medium text-muted-foreground",
								children: "Nome da campanha"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "name",
								type: "text",
								placeholder: "Ex: Escala Facebook Ads #1",
								defaultValue: preset?.name,
								className: "mt-1.5 w-full rounded-lg border border-border bg-[#0d0f10] px-3 py-2 text-xs text-white outline-none focus:border-primary"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-medium text-muted-foreground",
								children: "Template da Página Safe (White Page)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: safeTemplate,
								onChange: (e) => setSafeTemplate(e.target.value),
								className: "mt-1.5 w-full rounded-lg border border-border bg-[#0d0f10] px-3 py-2 text-xs text-white outline-none focus:border-primary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "bella",
										children: "Studio Bella — Salão & Estética (Beleza)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "derma",
										children: "DermaCare — Clínica Dermatológica (Saúde)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "stratego",
										children: "Stratego Consultoria Empresarial (Consultoria)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "techstore",
										children: "TechStore — Eletrônicos (E-commerce)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "aprenda",
										children: "Aprenda+ — Cursos Online (Educação)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "invest",
										children: "Invest Claro — Planejamento (Finanças)"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-medium text-muted-foreground",
								children: "Nível de agressividade do cloaker"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: mode,
								onChange: (e) => setMode(e.target.value),
								className: "mt-1.5 w-full rounded-lg border border-border bg-[#0d0f10] px-3 py-2 text-xs text-white outline-none focus:border-primary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "basica",
										children: "Básica (Bloqueio de bots conhecidos)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "normal",
										children: "Normal (Recomendado: ASN Meta/Google + User-Agent)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "agressiva",
										children: "Agressiva (Bloqueio de VPNs, proxies e emuladores)"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[11px] text-muted-foreground",
										children: "utm_source"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										name: "source",
										placeholder: "facebook",
										defaultValue: preset?.source,
										className: "mt-1 w-full rounded-lg border border-border bg-[#0d0f10] px-2.5 py-1.5 text-xs text-white outline-none focus:border-primary"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[11px] text-muted-foreground",
										children: "utm_medium"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										name: "medium",
										placeholder: "cpc",
										defaultValue: preset?.medium,
										className: "mt-1 w-full rounded-lg border border-border bg-[#0d0f10] px-2.5 py-1.5 text-xs text-white outline-none focus:border-primary"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-[11px] text-muted-foreground",
										children: "utm_campaign"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										name: "campaign",
										placeholder: "escala",
										defaultValue: preset?.campaign,
										className: "mt-1 w-full rounded-lg border border-border bg-[#0d0f10] px-2.5 py-1.5 text-xs text-white outline-none focus:border-primary"
									})] })
								]
							})
						]
					})]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-destructive",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-[0.98]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4" }), "Criar cloaker"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: useExample,
						className: "text-xs font-medium text-muted-foreground hover:text-white transition-colors",
						children: "Não tenho agora, usar exemplo"
					})]
				})
			]
		})
	});
}
var NewCloakerCtx = (0, import_react.createContext)(() => {});
var useNewLink = () => (0, import_react.useContext)(NewCloakerCtx);
var useNewCloaker = useNewLink;
function CloakfyLogo({ className = "size-7" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `relative flex shrink-0 items-center justify-center rounded-full bg-[#0d1b12] ring-1 ring-[#00E676]/40 ${className}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 24 24",
			fill: "none",
			className: "size-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "12",
					cy: "12",
					r: "10",
					fill: "#0d1b12"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.08-1.38-4.48-.73-7.88-4.63-7.88-9.32 0-3.9 2.37-7.24 5.76-8.7C13.88 2.21 12.96 2 12 2z",
					fill: "#00E676"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "15.5",
					cy: "8.5",
					r: "1.5",
					fill: "#00E676"
				})
			]
		})
	});
}
function AppShell({ title, children }) {
	const [dialog, setDialog] = (0, import_react.useState)({ open: false });
	const [feedbackOpen, setFeedbackOpen] = (0, import_react.useState)(false);
	const open = (preset) => setDialog({
		open: true,
		...preset ? { preset } : {}
	});
	const groups = [
		{
			title: "GERAL",
			defaultOpen: true,
			items: [{
				to: "/",
				label: "Dashboard",
				icon: LayoutGrid
			}, {
				to: "/compartilhar",
				label: "Indicações",
				icon: Gift,
				badge: "NOVO"
			}]
		},
		{
			title: "CLOAKER",
			defaultOpen: true,
			items: [
				{
					to: "/links",
					label: "Cloakers",
					icon: Layers
				},
				{
					to: "/modelos",
					label: "Ao Vivo",
					icon: Radio,
					badge: "LIVE"
				},
				{
					to: "/acessos",
					label: "Logs",
					icon: FileText
				},
				{
					to: "/dominios",
					label: "Domínios",
					icon: Globe
				},
				{
					to: "/integracoes",
					label: "Integrações",
					icon: Plug,
					badge: "NOVO"
				},
				{
					to: "/paginas",
					label: "Páginas Safe",
					icon: FileCode
				}
			]
		},
		{
			title: "CRIATIVOS",
			defaultOpen: true,
			items: [
				{
					to: "/video",
					label: "Camuflar Vídeo",
					icon: Video
				},
				{
					to: "/imagem",
					label: "Camuflar Imagem",
					icon: Image
				},
				{
					to: "/camuflar-audio-puro",
					label: "Camuflar Áudio",
					icon: Music
				},
				{
					to: "/camuflar-tiktok",
					label: "Camuflagem TikTok",
					icon: Video
				},
				{
					to: "/auto-variacoes",
					label: "Auto-Variações",
					icon: Flame,
					badge: "NOVO"
				},
				{
					to: "/limpar-metadados",
					label: "Limpar Metadados",
					icon: ShieldCheck
				},
				{
					to: "/analise-anuncio",
					label: "Análise de Anúncio",
					icon: SearchCheck
				},
				{
					to: "/camuflar-texto",
					label: "Camuflagem de Texto",
					icon: MessageSquare
				}
			]
		},
		{
			title: "SUPORTE",
			defaultOpen: false,
			items: [{
				to: "/ajuda",
				label: "Central de ajuda",
				icon: CircleQuestionMark
			}]
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NewCloakerCtx.Provider, {
		value: open,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-screen bg-background text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "sticky top-0 hidden h-screen w-[276px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2.5 px-5 pt-4 text-xl font-bold tracking-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloakfyLogo, { className: "size-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-white font-extrabold tracking-tight",
								children: "Cloakfy"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => open(),
								className: "mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:brightness-110 active:scale-[0.99]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 stroke-[3]" }), "Novo Cloaker"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "mt-4 flex-1 overflow-y-auto px-2.5 space-y-1",
							children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavGroup, { ...g }, g.title))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t border-sidebar-border px-2.5 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, { item: {
								to: "/planos",
								label: "Planos",
								icon: Diamond
							} })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-sidebar-border px-4 py-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm",
									children: "K"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-semibold text-white leading-tight",
											children: "Kertulli Machado"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground leading-tight",
											children: "Plano Grátis"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-[10px] text-muted-foreground/80 leading-tight",
											children: "kertullimachado216@gmail.com"
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex justify-around text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => toast.info("Obrigado pelo apoio ao Cloakfy!"),
									className: "flex items-center gap-1.5 hover:text-white transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-3.5" }), "Apoiar"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => toast.success("Sessão preservada localmente."),
									className: "flex items-center gap-1.5 hover:text-white transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), "Sair"]
								})]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-1 flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-20 flex h-[60px] items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur md:px-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-foreground leading-tight",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground leading-tight",
							children: "Central de operação"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "https://instagram.com",
									target: "_blank",
									rel: "noreferrer",
									className: "grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-pink-500 hover:border-pink-500/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🇧🇷" }),
										" Português ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3 text-muted-foreground" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm",
									children: "K"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "mx-auto w-full max-w-[1280px] flex-1 px-6 py-8 md:px-10",
						children
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setFeedbackOpen(true),
				className: "fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-xl border border-border bg-card/90 px-4 py-2.5 text-xs font-semibold text-foreground shadow-lg backdrop-blur hover:bg-card transition-all",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquarePlus, { className: "size-4 text-primary" }), "Feedback"]
			}),
			feedbackOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm",
				onClick: () => setFeedbackOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquarePlus, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-semibold text-foreground",
									children: "Enviar Feedback"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setFeedbackOpen(false),
								className: "text-muted-foreground hover:text-foreground text-sm",
								children: "✕"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "O que você gostaria de ver melhorado no Cloakfy?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							placeholder: "Descreva sua sugestão ou problema...",
							rows: 4,
							className: "mt-3 w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-primary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setFeedbackOpen(false),
								className: "rounded-lg border border-border px-3 py-2 text-xs",
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									toast.success("Feedback recebido com sucesso!");
									setFeedbackOpen(false);
								},
								className: "rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground",
								children: "Enviar"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewLinkDialog, {
				open: dialog.open,
				preset: dialog.preset,
				onClose: () => setDialog({ open: false })
			}, dialog.open ? "o" : "c")
		]
	});
}
function NavGroup({ title, items, defaultOpen = true }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(defaultOpen || items.some((i) => i.to === path));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen(!open),
			className: "flex w-full items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80 hover:text-muted-foreground",
			children: [title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `size-3 transition-transform duration-200 ${open ? "rotate-180" : ""}` })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 space-y-0.5",
			children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLink, { item: i }, i.label + i.to))
		})]
	});
}
function NavLink({ item }) {
	const Icon = item.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: item.to,
		activeOptions: { exact: true },
		className: "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-foreground data-[status=active]:font-semibold transition-colors",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0 text-muted-foreground group-data-[status=active]:text-primary group-hover:text-primary transition-colors" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate",
				children: item.label
			}),
			item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "ml-auto flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-bold text-primary",
				children: [item.badge === "LIVE" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 animate-pulse rounded-full bg-primary" }), item.badge]
			})
		]
	});
}
function PageHeader({ title, subtitle, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-bold tracking-tight text-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1.5 text-sm text-muted-foreground",
			children: subtitle
		})] }), action]
	});
}
function PrimaryButton({ children, className = "", ...p }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...p,
		className: `inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50 ${className}`,
		children
	});
}
function GhostButton({ children, className = "", ...p }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		...p,
		className: `inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors ${className}`,
		children
	});
}
function NewLinkButton({ label = "+ Novo Cloaker" }) {
	const open = useNewCloaker();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
		onClick: () => open(),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 stroke-[3]" }), label]
	});
}
var NewCloakerButton = NewLinkButton;
function Panel({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${className}`,
		children
	});
}
function Empty({ icon: Icon = Globe, title, text, actionLabel = "Criar primeira", onAction }) {
	const open = useNewCloaker();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "flex flex-col items-center px-6 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-12 place-items-center rounded-xl border border-border bg-secondary/80",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-muted-foreground" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-base font-semibold text-foreground",
				children: title
			}),
			text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-md text-sm text-muted-foreground leading-relaxed",
				children: text
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
					onClick: onAction || (() => open()),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 stroke-[3]" }), actionLabel]
				})
			})
		]
	});
}
//#endregion
export { PageHeader as a, useNewCloaker as c, NewCloakerButton as i, Empty as n, Panel as o, GhostButton as r, PrimaryButton as s, AppShell as t };
