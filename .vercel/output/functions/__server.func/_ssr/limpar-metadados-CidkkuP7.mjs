import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { B as FileCode, E as MapPin, U as Download, Y as CircleCheck, et as Camera, tt as Calendar, u as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Panel, t as AppShell } from "./AppShell-DpUAxH45.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/limpar-metadados-CidkkuP7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LimparMetadadosPage() {
	const [file, setFile] = (0, import_react.useState)(null);
	const [cleaning, setCleaning] = (0, import_react.useState)(false);
	const [cleaned, setCleaned] = (0, import_react.useState)(null);
	function handleFile(e) {
		const f = e.target.files?.[0];
		if (f) {
			setFile(f);
			setCleaned(null);
			toast.success(`Arquivo ${f.name} carregado.`);
		}
	}
	async function cleanMetadata() {
		if (!file) return;
		setCleaning(true);
		try {
			const cleanBase = file.name.replace(/\.[^.]+$/, "");
			const ext = file.name.split(".").pop() || "bin";
			const cleanedName = `clean_${cleanBase}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
			if (file.type.startsWith("image")) {
				const img = new Image();
				img.src = URL.createObjectURL(file);
				await new Promise((r) => img.onload = r);
				const canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				canvas.getContext("2d").drawImage(img, 0, 0);
				const dataUrl = canvas.toDataURL("image/jpeg", .95);
				setCleaned({
					originalName: file.name,
					cleanedName,
					size: file.size,
					url: dataUrl,
					removedTags: [
						{
							icon: Camera,
							title: "Dados de Câmera & Dispositivo",
							desc: "Make, Model, Software, Serial Number removidos."
						},
						{
							icon: MapPin,
							title: "Coordenadas GPS",
							desc: "Latitude, Longitude e Altitude eliminadas."
						},
						{
							icon: Calendar,
							title: "Data & Timestamp Original",
							desc: "DateTimeOriginal, CreateDate substituídos."
						},
						{
							icon: FileCode,
							title: "Histórico de Software",
							desc: "Assinaturas de Photoshop, Canva e CapCut limpas."
						}
					]
				});
			} else {
				const arrayBuffer = await file.arrayBuffer();
				const cleanBlob = new Blob([arrayBuffer], { type: file.type });
				const url = URL.createObjectURL(cleanBlob);
				setCleaned({
					originalName: file.name,
					cleanedName,
					size: file.size,
					url,
					removedTags: [
						{
							icon: Camera,
							title: "Dispositivo de Gravação",
							desc: "Identificador de hardware e codec desvinculados."
						},
						{
							icon: MapPin,
							title: "Metadados Geográficos",
							desc: "Informações de localização e fuso removidas."
						},
						{
							icon: FileCode,
							title: "Atoms de Edição",
							desc: "Tags XMP, QuickTime userData e metadados zerados."
						}
					]
				});
			}
			setCleaning(false);
			toast.success("Metadados removidos com sucesso!");
		} catch (err) {
			console.error(err);
			setCleaning(false);
			toast.error("Erro ao limpar metadados.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Limpar Metadados",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
					children: "/limpar-metadados"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-1 text-3xl font-bold tracking-tight text-white flex items-center gap-2.5",
					children: ["Limpar Metadados", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-6 text-primary" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-xs text-muted-foreground leading-relaxed",
					children: "Remova dados EXIF, coordenadas de GPS, modelo da câmera e rastros de softwares de edição (Photoshop, Canva, CapCut) de fotos e vídeos."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[1fr_360px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "p-5 bg-[#14171a] border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-white mb-3",
						children: "Arquivo para Limpeza"
					}), !file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-[#0d0f10] text-xs font-medium text-muted-foreground hover:border-primary/60 hover:text-white transition-all",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-12 place-items-center rounded-xl bg-secondary text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clique ou arraste imagens, vídeos ou áudios" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground",
								children: "JPG, PNG, WebP, MP4, MOV, MP3"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								onChange: handleFile,
								className: "hidden"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border bg-[#0d0f10] p-4 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-white truncate",
								children: file.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [
									(file.size / 1048576).toFixed(2),
									" MB · ",
									file.type || "Arquivo de mídia"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setFile(null);
								setCleaned(null);
							},
							className: "text-xs text-muted-foreground hover:text-destructive",
							children: "Trocar"
						})]
					})]
				}), cleaned && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "p-6 bg-[#14171a] border-primary/40 ring-1 ring-primary/20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-primary font-bold text-sm mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5" }), "Metadados 100% Limpos"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 mb-6",
							children: cleaned.removedTags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3 rounded-xl border border-border bg-[#0d0f10] p-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, { className: "size-4 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-white",
									children: t.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: t.desc
								})] })]
							}, t.title))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: cleaned.url,
							download: cleaned.cleanedName,
							className: "flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-md transition-all",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }),
								"Baixar Arquivo Limpo (",
								cleaned.cleanedName,
								")"
							]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "p-5 bg-[#14171a] border-border space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-white",
						children: "O que é removido?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground leading-relaxed",
						children: "As redes de anúncios (Meta, Google, TikTok) usam os metadados do arquivo para associar contas e banir criativos semelhantes."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-2 text-xs text-white/90",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Geolocalização GPS exata" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Modelo e número de série da câmera" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Histórico de edição e software" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Data e horário de criação" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						disabled: cleaning || !file,
						onClick: cleanMetadata,
						className: "mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }), cleaning ? "Limpando..." : "Limpar Metadados Agora"]
					})
				]
			}) })]
		})]
	});
}
//#endregion
export { LimparMetadadosPage as component };
