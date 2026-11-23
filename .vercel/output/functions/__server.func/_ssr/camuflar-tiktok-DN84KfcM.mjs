import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { U as Download, Y as CircleCheck, a as Video, at as Activity, it as Archive, m as Scissors, q as Clock, s as Trash2, t as Zap } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Panel, t as AppShell } from "./AppShell-DpUAxH45.mjs";
import { n as camuflarTikTokVideo } from "./ffmpeg-CTXGQP-u.mjs";
import { t as require_lib } from "../_libs/jszip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/camuflar-tiktok-DN84KfcM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var TIKTOK_MODES = [
	{
		key: "basic",
		title: "Básica, rápida, só metadados",
		desc: "Remove metadados e altera o hash do arquivo. Menor alteração, processamento mais rápido.",
		badge: "Rápido"
	},
	{
		key: "normal",
		title: "Normal, recomendada",
		desc: "Metadados + framerate 29.97 + bitrate variado. Boa proteção sem perda de qualidade visível.",
		badge: "Recomendado"
	},
	{
		key: "aggressive",
		title: "Agressiva, máxima proteção",
		desc: "Tudo acima + micro-crop 1.2% + re-encode completo com ruído imperceptível. Virtualmente indetectável.",
		badge: "Máxima Proteção"
	}
];
var MAX_VIDEOS = 20;
function CamuflarTikTokPage() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [mode, setMode] = (0, import_react.useState)("normal");
	const [processing, setProcessing] = (0, import_react.useState)(false);
	const [currentStatus, setCurrentStatus] = (0, import_react.useState)("");
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const addFiles = (0, import_react.useCallback)((files) => {
		const valid = files.filter((f) => f.type.startsWith("video/") || /\.(mp4|mov|avi|mkv|webm)$/i.test(f.name));
		if (!valid.length) {
			toast.error("Por favor, selecione arquivos de vídeo válidos (MP4, MOV, WebM, AVI).");
			return;
		}
		setItems((prev) => {
			const combined = [...prev, ...valid.map((f) => ({
				id: Math.random().toString(36).substring(2, 9),
				file: f,
				status: "queued"
			}))];
			if (combined.length > MAX_VIDEOS) {
				toast.error(`Máximo de ${MAX_VIDEOS} vídeos permitidos por lote.`);
				return combined.slice(0, MAX_VIDEOS);
			}
			return combined;
		});
		toast.success(`${valid.length} vídeo(s) adicionado(s) à fila.`);
	}, []);
	function handleFilePick(e) {
		if (e.target.files) {
			addFiles(Array.from(e.target.files));
			e.target.value = "";
		}
	}
	function handleDrop(e) {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files));
	}
	function removeVideo(id) {
		setItems((prev) => prev.filter((item) => item.id !== id));
	}
	function clearAll() {
		setItems([]);
	}
	async function handleProcessAll() {
		if (!items.filter((i) => i.status !== "done").length) {
			toast.error("Adicione ao menos um vídeo para camuflar.");
			return;
		}
		setProcessing(true);
		for (let idx = 0; idx < items.length; idx++) {
			const item = items[idx];
			if (!item || item.status === "done") continue;
			setItems((prev) => prev.map((it) => it.id === item.id ? {
				...it,
				status: "processing"
			} : it));
			try {
				const result = await camuflarTikTokVideo(item.file, mode, (msg) => {
					setCurrentStatus(`[${idx + 1}/${items.length}] ${msg}`);
				});
				setItems((prev) => prev.map((it) => it.id === item.id ? {
					...it,
					status: "done",
					blob: result.blob,
					url: result.url,
					outputName: result.outputName,
					size: result.size
				} : it));
			} catch (err) {
				console.error("Erro no processamento TikTok:", err);
				setItems((prev) => prev.map((it) => it.id === item.id ? {
					...it,
					status: "error",
					error: err?.message || "Erro no processamento"
				} : it));
			}
		}
		setProcessing(false);
		setCurrentStatus("");
		toast.success("Processamento para TikTok concluído!");
	}
	async function downloadZip() {
		const readyItems = items.filter((i) => i.blob && i.outputName);
		if (!readyItems.length) return;
		const zip = new import_lib.default();
		readyItems.forEach((item, idx) => {
			zip.file(item.outputName || `tiktok_var_${idx + 1}.mp4`, item.blob);
		});
		const zipBlob = await zip.generateAsync({ type: "blob" });
		const url = URL.createObjectURL(zipBlob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `videos_camuflados_tiktok_${Date.now()}.zip`;
		a.click();
		toast.success("Download do ZIP iniciado!");
	}
	const doneCount = items.filter((i) => i.status === "done").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Camuflagem TikTok",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
						children: "/camuflar-tiktok"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary",
						children: "TIKTOK ADS"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-1 text-3xl font-bold tracking-tight text-white flex items-center gap-2",
					children: ["Camuflagem TikTok", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-6 text-primary fill-primary/20" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-xs text-muted-foreground leading-relaxed",
					children: "Camufle vídeos especificamente contra o sistema de fingerprinting da ByteDance/TikTok Ads, ajustando framerate (29.97 CFR), metadados e micro-crop."
				})
			] }), doneCount > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: downloadZip,
				className: "flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-md transition-all",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "size-4" }),
					"Baixar Todos em ZIP (",
					doneCount,
					")"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[1fr_360px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "p-5 bg-[#14171a] border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-semibold text-white",
								children: [
									"Vídeos para TikTok (",
									items.length,
									"/",
									MAX_VIDEOS,
									")"
								]
							}), items.length > 0 && !processing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: clearAll,
								className: "text-xs text-muted-foreground hover:text-destructive transition-colors",
								children: "Limpar todos"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							role: "button",
							tabIndex: 0,
							onClick: () => fileInputRef.current?.click(),
							onDragOver: (e) => {
								e.preventDefault();
								setIsDragging(true);
							},
							onDragLeave: () => setIsDragging(false),
							onDrop: handleDrop,
							className: `flex h-44 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed transition-all ${isDragging ? "border-primary bg-primary/10 text-primary" : "border-border bg-[#0d0f10] text-muted-foreground hover:border-primary/60 hover:text-white"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-11 place-items-center rounded-xl bg-secondary text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-white",
									children: "Clique ou arraste vídeos para TikTok Ads"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground",
									children: [
										"MP4, MOV, WebM, AVI · Até ",
										MAX_VIDEOS,
										" vídeos por lote"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileInputRef,
									type: "file",
									accept: "video/*,.mp4,.mov,.avi,.mkv,.webm",
									multiple: true,
									onChange: handleFilePick,
									className: "hidden"
								})
							]
						}),
						items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-2 max-h-96 overflow-y-auto pr-1",
							children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 rounded-xl border border-border bg-[#0d0f10] p-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-8 place-items-center rounded-lg bg-secondary text-primary shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-semibold text-white",
											children: item.file.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground font-mono",
											children: [
												(item.file.size / 1048576).toFixed(2),
												" MB",
												item.size && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-foreground font-medium",
													children: [
														" ",
														"→ ",
														(item.size / 1048576).toFixed(2),
														" MB"
													]
												})
											]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 shrink-0",
									children: [
										item.status === "processing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-[11px] font-medium text-primary",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 animate-spin" }), "Processando..."]
										}),
										item.status === "done" && item.url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), "Pronto"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: item.url,
												download: item.outputName || "tiktok_safe.mp4",
												className: "inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Baixar"]
											})]
										}),
										item.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-destructive/10 border border-destructive/20 px-2 py-0.5 text-[10px] font-bold text-destructive",
											children: item.error || "Erro"
										}),
										item.status === "queued" && !processing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => removeVideo(item.id),
											className: "p-1 text-muted-foreground hover:text-destructive transition-colors",
											title: "Remover da fila",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
										})
									]
								})]
							}, item.id))
						})
					]
				}), processing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "p-4 bg-[#14171a] border-primary/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs font-semibold mb-2 text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 text-primary animate-pulse" }), currentStatus || "Processando camuflagem..."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-primary font-mono",
							children: [
								doneCount,
								"/",
								items.length
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 w-full overflow-hidden rounded-full bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-primary transition-all duration-300",
							style: { width: `${Math.round(doneCount / Math.max(1, items.length) * 100)}%` }
						})
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "bg-[#14171a] border-border divide-y divide-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold text-white",
							children: "Modo TikTok"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Configuração de re-encode para TikTok:"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 space-y-2",
						children: TIKTOK_MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							onClick: () => setMode(m.key),
							className: `flex cursor-pointer gap-3 p-3.5 rounded-xl transition-all ${mode === m.key ? "bg-secondary/60 ring-1 ring-primary/40" : "hover:bg-secondary/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "tiktokMode",
								checked: mode === m.key,
								onChange: () => setMode(m.key),
								className: "mt-1 accent-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs font-bold text-white",
									children: m.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-primary/10 px-1.5 py-0.2 text-[9px] font-semibold text-primary",
									children: m.badge
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-[11px] text-muted-foreground leading-relaxed",
								children: m.desc
							})] })]
						}, m.key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							disabled: processing || items.length === 0,
							onClick: handleProcessAll,
							className: "flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "size-4" }), processing ? "Processando vídeos..." : `Camuflar ${items.length > 0 ? `${items.length} vídeo(s)` : "para TikTok"}`]
						})
					})
				]
			}) })]
		})]
	});
}
//#endregion
export { CamuflarTikTokPage as component };
