import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { M as Image$1, U as Download, u as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as PageHeader, o as Panel, t as AppShell } from "./AppShell-DpUAxH45.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/imagem-DkOLOAIz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var formats = [
	{
		label: "Feed quadrado",
		w: 1080,
		h: 1080,
		desc: "Padrão feed Instagram / Facebook (1:1)"
	},
	{
		label: "Feed vertical",
		w: 1080,
		h: 1350,
		desc: "Maior retenção e área de tela (4:5)"
	},
	{
		label: "Stories / Reels",
		w: 1080,
		h: 1920,
		desc: "Formato vertical completo (9:16)"
	},
	{
		label: "Paisagem",
		w: 1200,
		h: 628,
		desc: "Feed horizontal e links patrocinados"
	}
];
function ImageTool() {
	const [img, setImg] = (0, import_react.useState)(null);
	const [fmt, setFmt] = (0, import_react.useState)(0);
	const [out, setOut] = (0, import_react.useState)("");
	const [hash, setHash] = (0, import_react.useState)("");
	function load(e) {
		const f = e.target.files?.[0];
		if (!f) return;
		const i = new Image();
		i.onload = () => {
			setImg(i);
			render(i, fmt);
		};
		i.src = URL.createObjectURL(f);
	}
	function render(i, n) {
		const { w, h } = formats[n];
		const c = document.createElement("canvas");
		c.width = w;
		c.height = h;
		const ctx = c.getContext("2d");
		const s = Math.max(w / i.width, h / i.height);
		const dx = (w - i.width * s) / 2;
		const dy = (h - i.height * s) / 2;
		ctx.drawImage(i, dx, dy, i.width * s, i.height * s);
		ctx.fillStyle = "rgba(0, 230, 118, 0.003)";
		ctx.fillRect(0, 0, w, h);
		const dataUrl = c.toDataURL("image/jpeg", .94);
		setOut(dataUrl);
		setHash(Math.random().toString(36).substring(2, 10).toUpperCase());
		toast.success("Imagem camuflada! Metadados limpos e novo hash gerado.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Camuflar Imagem",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Camuflar Imagem",
			subtitle: "Escolha o formato, limpe metadados e gere uma nova impressão digital para seu criativo."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-[1fr_380px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: out ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-col items-center justify-center p-6 bg-[#14171a] border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-semibold text-primary mb-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }),
							"Hash exclusivo: ",
							hash,
							" · EXIF Removido"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: out,
						alt: "Resultado",
						className: "max-h-[460px] rounded-xl object-contain shadow-2xl"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-4 text-xs font-medium text-muted-foreground hover:text-white cursor-pointer",
						children: ["Trocar imagem", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							onChange: load,
							className: "hidden"
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex h-72 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-[#14171a] text-xs font-medium text-muted-foreground hover:border-primary/60 hover:text-white transition-all",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-12 place-items-center rounded-xl bg-secondary text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { className: "size-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clique ou arraste uma imagem (JPG, PNG, WebP)" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-muted-foreground",
						children: "Metadados e GPS serão removidos automaticamente"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/*",
						onChange: load,
						className: "hidden"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-2 text-sm font-semibold text-white",
				children: "Formato do anúncio"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "divide-y divide-border bg-[#14171a] border-border",
				children: [formats.map((f, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: `flex cursor-pointer gap-3 p-4 transition-colors ${fmt === n ? "bg-secondary/40" : "hover:bg-secondary/20"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "radio",
						checked: fmt === n,
						onChange: () => {
							setFmt(n);
							if (img) render(img, n);
						},
						className: "mt-1 accent-primary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-semibold text-white",
							children: f.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [
								f.w,
								" × ",
								f.h,
								" px"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-[11px] text-muted-foreground/80",
							children: f.desc
						})
					] })]
				}, f.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						"aria-disabled": !out,
						href: out || void 0,
						download: `cloakfy_criativo_${hash || "img"}.jpg`,
						className: `flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 ${out ? "" : "pointer-events-none opacity-50"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Baixar imagem camuflada"]
					})
				})]
			})] })]
		})]
	});
}
//#endregion
export { ImageTool as component };
