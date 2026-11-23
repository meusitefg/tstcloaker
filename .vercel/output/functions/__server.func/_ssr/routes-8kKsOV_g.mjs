import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as useLinks } from "./links-CzH6hoh2.mjs";
import { $ as Check, Z as ChevronRight, a as Video, l as Shield, rt as ArrowRight, t as Zap } from "../_libs/lucide-react.mjs";
import { c as useNewCloaker, i as NewCloakerButton, o as Panel, t as AppShell } from "./AppShell-DpUAxH45.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-8kKsOV_g.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const cloakers = useLinks();
	const open = useNewCloaker();
	const visits = cloakers.reduce((n, l) => n + l.visits, 0);
	const steps = [
		{
			t: "Crie seu primeiro cloaker",
			d: "Defina campanha, páginas e filtros.",
			done: cloakers.length > 0,
			to: "/links"
		},
		{
			t: "Coloque a proteção no ar",
			d: "Ative o cloaker e use o link público no anúncio.",
			done: cloakers.some((l) => l.active),
			to: "/links"
		},
		{
			t: "Confirme o primeiro acesso",
			d: "Acompanhe a decisão em tempo real.",
			done: visits > 0,
			to: "/acessos"
		}
	];
	const completedStepsCount = steps.filter((s) => s.done).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Dashboard",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold tracking-tight text-white",
					children: "Olá, Kertulli"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "A qualidade do seu tráfego, em tempo real."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewCloakerButton, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-mono text-muted-foreground",
						children: "/primeiro-acesso"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-2xl font-bold tracking-tight text-white",
						children: "Bem-vindo, Kertulli. O que você quer fazer primeiro?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 max-w-xl text-sm text-muted-foreground leading-relaxed",
						children: "Escolha um caminho. Leva uns 2 minutos e você já sai com algo funcionando de verdade."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-5 border-border bg-[#14171a]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-border p-6 md:border-r md:border-b-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-9 place-items-center rounded-xl bg-secondary text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 text-lg font-semibold text-white",
								children: "Proteger uma página"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: "Bots e moderadores veem a página segura. Seus leads veem a oferta real. Você só cola o link no anúncio."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => open(),
								className: "mt-5 flex items-center gap-2 text-sm font-bold text-primary hover:underline",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-4" }),
									"Criar em 30 segundos",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground/80",
								children: "Uma pergunta só — a página segura já vem pronta"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-9 place-items-center rounded-xl bg-secondary text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 text-lg font-semibold text-white",
								children: "Camuflar um criativo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: "Muda hash e metadados de vídeo, imagem ou áudio pra não cair como duplicado. Roda no seu navegador, nada sai do seu PC."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/video",
								className: "mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors",
								children: ["Camuflar agora", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 border-t border-border p-6 text-xs text-muted-foreground md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex gap-3 items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-6 shrink-0 place-items-center rounded-full bg-secondary font-semibold text-white",
								children: "1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Você cria o cloaker com 2 links: a página segura e a sua oferta real." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex gap-3 items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-6 shrink-0 place-items-center rounded-full bg-secondary font-semibold text-white",
								children: "2"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cola o link do cloaker no anúncio em vez do link da oferta." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex gap-3 items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-6 shrink-0 place-items-center rounded-full bg-secondary font-semibold text-white",
								children: "3"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "A gente decide quem vê o quê e você acompanha cada decisão nos Logs." })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold text-white",
					children: "Seu caminho até o primeiro acesso real"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [completedStepsCount, " de 3 concluídos"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				className: "mt-4 divide-y divide-border bg-[#14171a]",
				children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: s.to,
					className: "flex items-center gap-4 px-6 py-4.5 hover:bg-secondary/40 transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${s.done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`,
							children: s.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 stroke-[3]" }) : i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-medium text-white",
								children: s.t
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: s.d
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto size-4 text-muted-foreground" })
					]
				}, s.t))
			})
		]
	});
}
//#endregion
export { Dashboard as component };
