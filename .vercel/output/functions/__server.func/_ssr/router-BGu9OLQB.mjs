import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { S as useRouter, _ as Outlet, b as createRootRouteWithContext, f as Scripts, g as createRouter, p as HeadContent, v as lazyRouteComponent, x as Link, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$20 } from "../_id-BDouCOrt.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BGu9OLQB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-GZyGVB5b.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Página não encontrada"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "A página que você está procurando não existe ou foi movida."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90",
						children: "Voltar ao painel"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Ops, algo deu errado"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Ocorreu uma falha inesperada. Tente recarregar ou voltar para o início."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90",
						children: "Tentar novamente"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Ir ao Dashboard"
					})]
				})
			]
		})
	});
}
var Route$19 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Cloakfy | Central de Operação" },
			{
				name: "description",
				content: "Proteção de campanhas, cloaker e camuflagem inteligente de criativos em tempo real."
			},
			{
				property: "og:title",
				content: "Cloakfy | Central de Operação"
			},
			{
				property: "og:description",
				content: "Proteção de campanhas, cloaker e camuflagem inteligente de criativos em tempo real."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "theme-color",
				content: "#0d0f10"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary",
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$19.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			theme: "dark",
			position: "top-center"
		})]
	});
}
var $$splitComponentImporter$18 = () => import("./routes-8kKsOV_g.mjs");
var Route$18 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Dashboard | Cloakfy" },
		{
			name: "description",
			content: "Visão geral das suas campanhas, cloakers e acessos no Cloakfy."
		},
		{
			property: "og:title",
			content: "Dashboard | Cloakfy"
		},
		{
			property: "og:description",
			content: "Visão geral das suas campanhas, cloakers e acessos no Cloakfy."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./acessos-iJbNEDzV.mjs");
var Route$17 = createFileRoute("/acessos")({
	head: () => ({ meta: [
		{ title: "Logs de acesso | Cloakfy" },
		{
			name: "description",
			content: "Visão geral de todos os cloakers. Clique numa linha para ver os acessos."
		},
		{
			property: "og:title",
			content: "Logs de acesso | Cloakfy"
		},
		{
			property: "og:description",
			content: "Visão geral de todos os cloakers. Clique numa linha para ver os acessos."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./ajuda-CoxLCKvR.mjs");
var Route$16 = createFileRoute("/ajuda")({
	head: () => ({ meta: [
		{ title: "Central de Ajuda | Cloakfy" },
		{
			name: "description",
			content: "Dúvidas frequentes, guias e boas práticas de proteção de tráfego com Cloakfy."
		},
		{
			property: "og:title",
			content: "Central de Ajuda | Cloakfy"
		},
		{
			property: "og:description",
			content: "Dúvidas frequentes, guias e boas práticas de proteção de tráfego com Cloakfy."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./analise-anuncio-CAfxRDBl.mjs");
var Route$15 = createFileRoute("/analise-anuncio")({
	head: () => ({ meta: [
		{ title: "Análise de Anúncio | Cloakfy" },
		{
			name: "description",
			content: "Analise texto, gatilhos e conformidade de anúncios para evitar bloqueios de conta."
		},
		{
			property: "og:title",
			content: "Análise de Anúncio | Cloakfy"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./auto-variacoes-BusEchIV.mjs");
var Route$14 = createFileRoute("/auto-variacoes")({
	head: () => ({ meta: [
		{ title: "Auto-Variações | Cloakfy" },
		{
			name: "description",
			content: "Gere múltiplas variações 100% únicas do mesmo criativo para testes A/B e escala sem duplicação."
		},
		{
			property: "og:title",
			content: "Auto-Variações | Cloakfy"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./camuflar-audio-puro-DkegtQSD.mjs");
var Route$13 = createFileRoute("/camuflar-audio-puro")({
	head: () => ({ meta: [
		{ title: "Camuflar Áudio | Cloakfy" },
		{
			name: "description",
			content: "Camufle áudios com alteração de pitch, injeção de ruído imperceptível e novo hash para Meta e TikTok."
		},
		{
			property: "og:title",
			content: "Camuflar Áudio | Cloakfy"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./camuflar-texto-C3O0bFqU.mjs");
var Route$12 = createFileRoute("/camuflar-texto")({
	head: () => ({ meta: [
		{ title: "Camuflar Texto | Cloakfy" },
		{
			name: "description",
			content: "Camufle suas copies e textos usando homóglifos e separadores invisíveis para evitar bloqueios."
		},
		{
			property: "og:title",
			content: "Camuflar Texto | Cloakfy"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./camuflar-tiktok-DN84KfcM.mjs");
var Route$11 = createFileRoute("/camuflar-tiktok")({
	head: () => ({ meta: [
		{ title: "Camuflagem TikTok | Cloakfy" },
		{
			name: "description",
			content: "Camufle criativos especificamente para os parâmetros do algoritmo do TikTok Ads."
		},
		{
			property: "og:title",
			content: "Camuflagem TikTok | Cloakfy"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./compartilhar-BgaK8U_i.mjs");
var Route$10 = createFileRoute("/compartilhar")({
	head: () => ({ meta: [
		{ title: "Indicações | Cloakfy" },
		{
			name: "description",
			content: "Ganhe cloakers permanentes indicando outros anunciantes."
		},
		{
			property: "og:title",
			content: "Indicações | Cloakfy"
		},
		{
			property: "og:description",
			content: "Ganhe cloakers permanentes indicando outros anunciantes."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./dominios-CYuh5Kta.mjs");
var Route$9 = createFileRoute("/dominios")({
	head: () => ({ meta: [
		{ title: "Meus Domínios | Cloakfy" },
		{
			name: "description",
			content: "Conecte um subdomínio próprio aos links dos seus cloakers."
		},
		{
			property: "og:title",
			content: "Meus Domínios | Cloakfy"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./imagem-DkOLOAIz.mjs");
var Route$8 = createFileRoute("/imagem")({
	head: () => ({ meta: [
		{ title: "Camuflar Imagem | Cloakfy" },
		{
			name: "description",
			content: "Redimensione, limpe metadados EXIF e altere a impressão digital das suas imagens."
		},
		{
			property: "og:title",
			content: "Camuflar Imagem | Cloakfy"
		},
		{
			property: "og:description",
			content: "Redimensione, limpe metadados EXIF e altere a impressão digital das suas imagens."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./integracoes-DvZM4w4l.mjs");
var Route$7 = createFileRoute("/integracoes")({
	head: () => ({ meta: [
		{ title: "Integrações | Cloakfy" },
		{
			name: "description",
			content: "Conecte Meta, TikTok e Google e envie as vendas dos seus cloakers para cada plataforma."
		},
		{
			property: "og:title",
			content: "Integrações | Cloakfy"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./limpar-metadados-CidkkuP7.mjs");
var Route$6 = createFileRoute("/limpar-metadados")({
	head: () => ({ meta: [
		{ title: "Limpar Metadados | Cloakfy" },
		{
			name: "description",
			content: "Remova metadados EXIF, GPS, câmera e histórico de edição de fotos e vídeos."
		},
		{
			property: "og:title",
			content: "Limpar Metadados | Cloakfy"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./links-271DxOd0.mjs");
var Route$5 = createFileRoute("/links")({
	head: () => ({ meta: [
		{ title: "Cloakers | Cloakfy" },
		{
			name: "description",
			content: "Crie, acompanhe e ajuste a proteção das suas campanhas."
		},
		{
			property: "og:title",
			content: "Cloakers | Cloakfy"
		},
		{
			property: "og:description",
			content: "Crie, acompanhe e ajuste a proteção das suas campanhas."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./modelos-B9cquUTu.mjs");
var Route$4 = createFileRoute("/modelos")({
	head: () => ({ meta: [
		{ title: "Ao Vivo | Cloakfy" },
		{
			name: "description",
			content: "Monitor em tempo real de tráfego, decisões de cloaker e bloqueio de bots."
		},
		{
			property: "og:title",
			content: "Ao Vivo | Cloakfy"
		},
		{
			property: "og:description",
			content: "Monitor em tempo real de tráfego, decisões de cloaker e bloqueio de bots."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./paginas-C8b0tIqg.mjs");
var Route$3 = createFileRoute("/paginas")({
	head: () => ({ meta: [
		{ title: "Páginas Safe | Cloakfy" },
		{
			name: "description",
			content: "Templates prontos para usar como página segura (white) nos seus cloakers."
		},
		{
			property: "og:title",
			content: "Páginas Safe | Cloakfy"
		},
		{
			property: "og:description",
			content: "Templates prontos para usar como página segura (white) nos seus cloakers."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./planos-Daopaxus.mjs");
var Route$2 = createFileRoute("/planos")({
	head: () => ({ meta: [
		{ title: "Planos | Cloakfy" },
		{
			name: "description",
			content: "Conheça os planos do Cloakfy e escale suas campanhas com proteção total."
		},
		{
			property: "og:title",
			content: "Planos | Cloakfy"
		},
		{
			property: "og:description",
			content: "Conheça os planos do Cloakfy e escale suas campanhas com proteção total."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./texto-BWe4yZGr.mjs");
var Route$1 = createFileRoute("/texto")({
	head: () => ({ meta: [
		{ title: "Camuflagem de Texto | Cloakfy" },
		{
			name: "description",
			content: "Camufle termos proibidos e revise copy de anúncios contra bloqueios de conta."
		},
		{
			property: "og:title",
			content: "Camuflagem de Texto | Cloakfy"
		},
		{
			property: "og:description",
			content: "Camufle termos proibidos e revise copy de anúncios contra bloqueios de conta."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./video-2PWGrSaN.mjs");
var Route = createFileRoute("/video")({
	head: () => ({ meta: [
		{ title: "Camuflar Vídeo (FFmpeg MP4) | Cloakfy" },
		{
			name: "description",
			content: "Camufle vídeos limpando metadados, alterando a impressão digital e convertendo para MP4 via FFmpeg."
		},
		{
			property: "og:title",
			content: "Camuflar Vídeo (FFmpeg MP4) | Cloakfy"
		},
		{
			property: "og:description",
			content: "Camufle vídeos limpando metadados, alterando a impressão digital e convertendo para MP4 via FFmpeg."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$18.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$19
	}),
	AcessosRoute: Route$17.update({
		id: "/acessos",
		path: "/acessos",
		getParentRoute: () => Route$19
	}),
	AjudaRoute: Route$16.update({
		id: "/ajuda",
		path: "/ajuda",
		getParentRoute: () => Route$19
	}),
	AnaliseAnuncioRoute: Route$15.update({
		id: "/analise-anuncio",
		path: "/analise-anuncio",
		getParentRoute: () => Route$19
	}),
	AutoVariacoesRoute: Route$14.update({
		id: "/auto-variacoes",
		path: "/auto-variacoes",
		getParentRoute: () => Route$19
	}),
	CamuflarAudioPuroRoute: Route$13.update({
		id: "/camuflar-audio-puro",
		path: "/camuflar-audio-puro",
		getParentRoute: () => Route$19
	}),
	CamuflarTextoRoute: Route$12.update({
		id: "/camuflar-texto",
		path: "/camuflar-texto",
		getParentRoute: () => Route$19
	}),
	CamuflarTiktokRoute: Route$11.update({
		id: "/camuflar-tiktok",
		path: "/camuflar-tiktok",
		getParentRoute: () => Route$19
	}),
	CompartilharRoute: Route$10.update({
		id: "/compartilhar",
		path: "/compartilhar",
		getParentRoute: () => Route$19
	}),
	DominiosRoute: Route$9.update({
		id: "/dominios",
		path: "/dominios",
		getParentRoute: () => Route$19
	}),
	ImagemRoute: Route$8.update({
		id: "/imagem",
		path: "/imagem",
		getParentRoute: () => Route$19
	}),
	IntegracoesRoute: Route$7.update({
		id: "/integracoes",
		path: "/integracoes",
		getParentRoute: () => Route$19
	}),
	LimparMetadadosRoute: Route$6.update({
		id: "/limpar-metadados",
		path: "/limpar-metadados",
		getParentRoute: () => Route$19
	}),
	LinksRoute: Route$5.update({
		id: "/links",
		path: "/links",
		getParentRoute: () => Route$19
	}),
	ModelosRoute: Route$4.update({
		id: "/modelos",
		path: "/modelos",
		getParentRoute: () => Route$19
	}),
	PaginasRoute: Route$3.update({
		id: "/paginas",
		path: "/paginas",
		getParentRoute: () => Route$19
	}),
	PlanosRoute: Route$2.update({
		id: "/planos",
		path: "/planos",
		getParentRoute: () => Route$19
	}),
	TextoRoute: Route$1.update({
		id: "/texto",
		path: "/texto",
		getParentRoute: () => Route$19
	}),
	VideoRoute: Route.update({
		id: "/video",
		path: "/video",
		getParentRoute: () => Route$19
	}),
	RIdRoute: Route$20.update({
		id: "/r/$id",
		path: "/r/$id",
		getParentRoute: () => Route$19
	})
};
var routeTree = Route$19._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
