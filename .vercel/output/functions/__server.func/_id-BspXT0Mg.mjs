import { r as __toESM } from "./_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { x as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as Route } from "./_id-BDouCOrt.mjs";
import { i as registerVisit } from "./_ssr/links-CzH6hoh2.mjs";
import { l as Shield, rt as ArrowRight } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-BspXT0Mg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Redirect() {
	const { id } = Route.useParams();
	const [missing, setMissing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const forceBot = searchParams.get("bot") === "1" || searchParams.get("test") === "safe";
		const targetUrl = registerVisit(id, forceBot ? true : void 0);
		if (targetUrl) window.location.replace(targetUrl);
		else setMissing(true);
	}, [id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-[#0d0f10] px-4 text-center text-white",
		children: missing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md rounded-2xl border border-border bg-[#14171a] p-8 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid size-12 place-items-center rounded-xl bg-secondary text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-xl font-bold",
					children: "Cloaker Indisponível"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted-foreground leading-relaxed",
					children: "Este cloaker foi pausado ou ainda não foi configurado neste navegador."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all",
					children: ["Acessar Painel Cloakfy", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground font-mono",
				children: "Verificando segurança..."
			})]
		})
	});
}
//#endregion
export { Redirect as component };
