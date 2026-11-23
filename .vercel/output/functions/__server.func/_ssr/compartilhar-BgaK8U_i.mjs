import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { I as Gift, K as Copy, X as CircleCheckBig, f as Share2, o as Users } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Panel, r as GhostButton, s as PrimaryButton, t as AppShell } from "./AppShell-DpUAxH45.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compartilhar-BgaK8U_i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReferralsPage() {
	const referralLink = "https://www.cloakfy.com.br/?ref=356c4253";
	const [copied, setCopied] = (0, import_react.useState)(false);
	const copy = async () => {
		await navigator.clipboard.writeText(referralLink);
		setCopied(true);
		toast.success("Link de indicação copiado!");
		setTimeout(() => setCopied(false), 2e3);
	};
	const share = async () => {
		if (navigator.share) try {
			await navigator.share({
				title: "Cloakfy - Proteção de Campanhas & Cloaker",
				text: "Proteja seus anúncios no Facebook, Google e TikTok com o Cloakfy.",
				url: referralLink
			});
		} catch {}
		else copy();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Indicações",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest",
					children: "Central de operação"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-white/90 font-medium",
					children: "Cada 3 pessoas que criarem o primeiro cloaker pelo seu link valem +1 cloaker permanente na sua conta, até 10."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-sm font-semibold text-white",
				children: "Seu link"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-wrap items-center gap-3 p-4 bg-[#14171a] border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "flex-1 truncate rounded-xl bg-[#0d0f10] border border-border px-4 py-3 font-mono text-sm text-white",
						children: referralLink
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GhostButton, {
						onClick: copy,
						className: "py-3 px-5 text-xs font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Copiado!" : "Copiar"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PrimaryButton, {
						onClick: share,
						className: "py-3 px-5 text-xs font-bold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), "Compartilhar"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "p-6 bg-[#14171a] border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-xs font-medium text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-muted-foreground" }), " Cadastraram"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-3xl font-bold text-white",
								children: "0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Criaram conta pelo seu link"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "p-6 bg-[#14171a] border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-xs font-medium text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "size-4 text-emerald-400" }), " Qualificaram"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-3xl font-bold text-white",
								children: "0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Já criaram o primeiro cloaker"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "p-6 bg-[#14171a] border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-xs font-medium text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "size-4 text-primary" }), " Cloakers ganhos"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-3xl font-bold text-white",
								children: "0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Teto de 10"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "mt-6 p-6 bg-[#14171a] border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-white",
							children: "Próximo cloaker"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-muted-foreground",
							children: "0/3"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-primary",
							style: { width: "0%" }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: "Faltam 3 pessoas qualificarem pra você ganhar mais um cloaker."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 mt-10 text-sm font-semibold text-white",
				children: "Como funciona"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "divide-y divide-border bg-[#14171a] border-border text-xs leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4 px-6 py-4 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-white",
							children: "1."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Você manda seu link. Quem clicar e criar conta fica ligado a você por 30 dias."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4 px-6 py-4 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-white",
							children: "2."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Quando essa pessoa cria o primeiro cloaker dela, a indicação qualifica."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4 px-6 py-4 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-white",
							children: "3."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "A cada 3 qualificadas, você ganha +1 cloaker permanente — soma ao limite do seu plano e não expira."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-6 py-4 text-[11px] text-muted-foreground/80",
						children: "Vale só cadastro novo e de pessoa diferente: contas antigas, indicação de si mesmo e repetição do mesmo aparelho não contam."
					})
				]
			})
		]
	});
}
//#endregion
export { ReferralsPage as component };
