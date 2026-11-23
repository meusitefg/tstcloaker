import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { l as Shield } from "../_libs/lucide-react.mjs";
import { a as PageHeader, o as Panel, t as AppShell } from "./AppShell-DpUAxH45.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ajuda-CoxLCKvR.js
var import_jsx_runtime = require_jsx_runtime();
function HelpPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Central de Ajuda",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Central de Ajuda",
			subtitle: "Entenda como funciona o Cloakfy e maximize o tempo de vida das suas campanhas."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			className: "divide-y divide-border bg-[#14171a] border-border",
			children: [
				{
					q: "O que é um Cloaker e como ele protege minha conta de anúncios?",
					a: "O cloaker é um filtro de requisições inteligente. Quando um robô ou moderador (Facebook, Google, TikTok) clica no link, ele é direcionado para uma 'Página Safe' (white page em total conformidade). Quando um usuário real clica, ele é levado para a sua oferta de vendas."
				},
				{
					q: "Como camuflar vídeos para não cair como criativo duplicado?",
					a: "Vá em 'Camuflar Vídeo', selecione seus arquivos e escolha o modo Normal ou Agressivo. O Cloakfy recodifica o fluxo de frames e insere micro-ruídos nos pixels sem alterar a qualidade visual, alterando o hash MD5/SHA256 para que o algoritmo encare como um criativo 100% inédito."
				},
				{
					q: "Qual link devo colocar na campanha?",
					a: "Você deve copiar o link curto gerado pelo Cloakfy (ex: /r/xyz) ou o seu domínio personalizado e colá-lo na URL de destino do anúncio."
				},
				{
					q: "O que são as Páginas Safe?",
					a: "São modelos de páginas institucionais (Salão de Beleza, Clínica Médica, Consultoria) já aprovadas em compliance pelas plataformas de anúncios."
				}
			].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-sm font-semibold text-white flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-4 text-primary" }), f.q]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs leading-relaxed text-muted-foreground pl-6",
					children: f.a
				})]
			}, f.q))
		})]
	});
}
//#endregion
export { HelpPage as component };
