import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { H as ExternalLink, Y as CircleCheck, l as Shield } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Panel, t as AppShell } from "./AppShell-DpUAxH45.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/integracoes-DvZM4w4l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "cloakfy-integracoes";
function readConfigs() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}
function saveConfigs(configs) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}
var PLATFORMS = [
	{
		id: "meta",
		name: "Meta (Facebook & Instagram)",
		description: "Envie eventos de conversão do seu cloaker diretamente para o Pixel da Meta via Conversions API.",
		icon: "🟦",
		color: "#1877f2",
		fields: [{
			key: "pixelId",
			label: "Pixel ID",
			placeholder: "Ex: 1234567890123456"
		}, {
			key: "token",
			label: "Access Token da API",
			placeholder: "EAAG..."
		}],
		docsUrl: "https://developers.facebook.com/docs/marketing-api/conversions-api"
	},
	{
		id: "tiktok",
		name: "TikTok Ads",
		description: "Envie eventos de pixel do TikTok para rastrear conversões dos seus anúncios com os cloakers.",
		icon: "⬛",
		color: "#fe2c55",
		fields: [{
			key: "pixelId",
			label: "Pixel ID do TikTok",
			placeholder: "Ex: CXXX..."
		}, {
			key: "token",
			label: "Access Token",
			placeholder: "Token da API..."
		}],
		docsUrl: "https://ads.tiktok.com/marketing_api/docs"
	},
	{
		id: "google",
		name: "Google Ads",
		description: "Integre com o Google Ads para rastrear conversões de cliques e enviar eventos do cloaker.",
		icon: "🔴",
		color: "#ea4335",
		fields: [{
			key: "pixelId",
			label: "ID de Conversão",
			placeholder: "AW-XXXXXXXXX"
		}, {
			key: "token",
			label: "Rótulo de Conversão",
			placeholder: "Ex: AbCdEf..."
		}],
		docsUrl: "https://support.google.com/google-ads/answer/6095821"
	}
];
function IntegracoesPage() {
	const [configs, setConfigs] = (0, import_react.useState)(() => readConfigs());
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	const [forms, setForms] = (0, import_react.useState)({});
	function getForm(id) {
		return forms[id] || {
			pixelId: configs[id]?.pixelId || "",
			token: configs[id]?.token || ""
		};
	}
	function setForm(id, field, value) {
		setForms((prev) => ({
			...prev,
			[id]: {
				...getForm(id),
				[field]: value
			}
		}));
	}
	function handleConnect(platformId) {
		const form = getForm(platformId);
		if (!form.pixelId.trim() || !form.token.trim()) {
			toast.error("Preencha todos os campos para conectar.");
			return;
		}
		const updated = {
			...configs,
			[platformId]: {
				id: platformId,
				connected: true,
				pixelId: form.pixelId.trim(),
				token: form.token.trim()
			}
		};
		setConfigs(updated);
		saveConfigs(updated);
		setExpanded(null);
		toast.success(`${PLATFORMS.find((p) => p.id === platformId)?.name} conectado com sucesso!`);
	}
	function handleDisconnect(platformId) {
		if (!confirm("Desconectar esta integração?")) return;
		const updated = { ...configs };
		delete updated[platformId];
		setConfigs(updated);
		saveConfigs(updated);
		toast.success("Integração desconectada.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Integrações",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight text-white",
				children: "Integrações"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 text-sm text-muted-foreground",
				children: "Conecte Meta, TikTok e Google e envie as vendas dos seus cloakers para cada plataforma."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: PLATFORMS.map((platform) => {
				const cfg = configs[platform.id];
				const isConnected = cfg?.connected;
				const isExpanded = expanded === platform.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "bg-[#14171a] border-border overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-4 px-6 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl",
								children: platform.icon
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-white",
										children: platform.name
									}), isConnected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), "Conectado"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-xs text-muted-foreground leading-relaxed max-w-md",
									children: platform.description
								}),
								isConnected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs font-mono text-primary",
									children: ["Pixel: ", cfg.pixelId]
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: platform.docsUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "grid size-8 place-items-center rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-white transition-colors",
								title: "Ver documentação",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5" })
							}), isConnected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setExpanded(isExpanded ? null : platform.id),
								className: "rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-white transition-colors",
								children: "Editar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleDisconnect(platform.id),
								className: "rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors",
								children: "Desconectar"
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setExpanded(isExpanded ? null : platform.id),
								className: "rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all",
								children: isExpanded ? "Cancelar" : "Conectar"
							})]
						})]
					}), isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border bg-[#0d0f10] px-6 py-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: platform.fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-muted-foreground mb-1.5",
									children: field.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: getForm(platform.id)[field.key],
									onChange: (e) => setForm(platform.id, field.key, e.target.value),
									placeholder: field.placeholder,
									className: "w-full rounded-xl border border-border bg-[#14171a] px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-muted-foreground/60 focus:border-primary transition-all font-mono"
								})] }, field.key))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleConnect(platform.id),
									className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:brightness-110 transition-all",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4" }), isConnected ? "Atualizar integração" : "Conectar agora"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setExpanded(null),
									className: "rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs text-muted-foreground hover:text-white transition-colors",
									children: "Cancelar"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-[11px] text-muted-foreground leading-relaxed",
								children: "Suas credenciais são salvas localmente e nunca enviadas a servidores externos."
							})
						]
					})]
				}, platform.id);
			})
		})]
	});
}
//#endregion
export { IntegracoesPage as component };
