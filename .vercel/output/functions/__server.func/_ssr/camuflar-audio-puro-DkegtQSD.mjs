import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { C as Music, U as Download, Y as CircleCheck, at as Activity, c as Sparkles, i as Volume2, it as Archive, q as Clock, s as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Panel, t as AppShell } from "./AppShell-DpUAxH45.mjs";
import { t as camuflarAudioPuro } from "./ffmpeg-CTXGQP-u.mjs";
import { t as require_lib } from "../_libs/jszip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/camuflar-audio-puro-DkegtQSD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var MODES = [{
	key: "basic",
	label: "Básico",
	desc: "Recodificação leve do áudio com alteração de bitrate e metadados. Rápido e eficaz para a maioria dos casos."
}, {
	key: "aggressive",
	label: "Agressivo",
	desc: "Máxima camuflagem: alteração de pitch, ruído de fundo imperceptível (-50dB), inversão de fase parcial e recodificação completa."
}];
var MAX_FILES = 20;
function CamuflarAudioPage() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [mode, setMode] = (0, import_react.useState)("basic");
	const [processing, setProcessing] = (0, import_react.useState)(false);
	const [statusText, setStatusText] = (0, import_react.useState)("");
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const addFiles = (0, import_react.useCallback)((files) => {
		const valid = files.filter((f) => f.type.startsWith("audio/") || f.type.startsWith("video/") || /\.(mp3|wav|ogg|m4a|aac|mp4|mov|webm)$/i.test(f.name));
		if (!valid.length) {
			toast.error("Por favor, selecione arquivos de áudio válidos (MP3, WAV, AAC, M4A, OGG) ou vídeos.");
			return;
		}
		setItems((prev) => {
			const combined = [...prev, ...valid.map((f) => ({
				id: Math.random().toString(36).substring(2, 9),
				file: f,
				status: "queued"
			}))];
			if (combined.length > MAX_FILES) {
				toast.error(`Máximo de ${MAX_FILES} arquivos permitidos por lote.`);
				return combined.slice(0, MAX_FILES);
			}
			return combined;
		});
		toast.success(`${valid.length} arquivo(s) adicionado(s) à fila.`);
	}, []);
	function handleFileChange(e) {
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
	function removeItem(id) {
		setItems((prev) => prev.filter((it) => it.id !== id));
	}
	function clearAll() {
		setItems([]);
	}
	async function handleCamouflage() {
		if (!items.filter((it) => it.status !== "done").length) {
			toast.error("Adicione ao menos um arquivo de áudio.");
			return;
		}
		setProcessing(true);
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (!item || item.status === "done") continue;
			setItems((prev) => prev.map((it) => it.id === item.id ? {
				...it,
				status: "processing"
			} : it));
			setStatusText(`Processando ${i + 1}/${items.length}: ${item.file.name}`);
			try {
				const result = await camuflarAudioPuro(item.file, mode, (s) => {
					setStatusText(`[${i + 1}/${items.length}] ${s}`);
				});
				setItems((prev) => prev.map((it) => it.id === item.id ? {
					...it,
					status: "done",
					url: result.url,
					outputName: result.outputName,
					size: result.size,
					blob: result.blob
				} : it));
			} catch (err) {
				console.error("Erro no camuflador de áudio:", err);
				setItems((prev) => prev.map((it) => it.id === item.id ? {
					...it,
					status: "error",
					error: err?.message || "Falha na conversão"
				} : it));
			}
		}
		setProcessing(false);
		setStatusText("");
		toast.success("Todos os áudios foram camuflados com sucesso!");
	}
	async function downloadZip() {
		const doneItems = items.filter((i) => i.blob && i.outputName);
		if (!doneItems.length) return;
		const zip = new import_lib.default();
		doneItems.forEach((it) => {
			zip.file(it.outputName, it.blob);
		});
		const zipBlob = await zip.generateAsync({ type: "blob" });
		const url = URL.createObjectURL(zipBlob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `audios_camuflados_${Date.now()}.zip`;
		a.click();
		toast.success("Download do ZIP iniciado!");
	}
	const doneCount = items.filter((it) => it.status === "done").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Camuflar Áudio",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
						children: "/camuflar-audio-puro"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary",
						children: "METADADOS & PITCH"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-1 text-3xl font-bold tracking-tight text-white flex items-center gap-2",
					children: ["Camuflar Áudio", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-6 text-primary fill-primary/20" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-xs text-muted-foreground leading-relaxed",
					children: "Altere a impressão digital do áudio de criativos com recodificação de frequência, inversão sutil de fase e novo hash contra bloqueios de direitos autorais e criativo duplicado."
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-semibold text-white",
								children: [
									"Arquivos (",
									items.length,
									"/",
									MAX_FILES,
									")"
								]
							}), items.length > 0 && !processing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: clearAll,
								className: "text-xs text-muted-foreground hover:text-destructive transition-colors",
								children: "Limpar lista"
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
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-white",
									children: "Clique ou arraste arquivos de áudio ou vídeo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground",
									children: [
										"MP3, WAV, AAC, M4A, OGG ou MP4 · Até ",
										MAX_FILES,
										" arquivos por lote"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileInputRef,
									type: "file",
									accept: "audio/*,video/*",
									multiple: true,
									onChange: handleFileChange,
									className: "hidden"
								})
							]
						}),
						items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-2.5 max-h-96 overflow-y-auto pr-1",
							children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 rounded-xl border border-border bg-[#0d0f10] p-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "size-4 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-medium text-white",
											children: item.file.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-muted-foreground font-mono",
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
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 animate-spin" }), " Processando..."]
										}),
										item.status === "done" && item.url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), "Pronto"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: item.url,
												download: item.outputName || "audio_camuflado.mp3",
												className: "flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Baixar"]
											})]
										}),
										item.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-destructive/10 border border-destructive/20 px-2 py-0.5 text-[10px] font-bold text-destructive",
											children: item.error || "Erro"
										}),
										item.status === "queued" && !processing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => removeItem(item.id),
											className: "p-1 text-muted-foreground hover:text-destructive transition-colors",
											title: "Remover",
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 text-primary animate-pulse" }), statusText || "Processando áudio..."]
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
							children: "Modo de Camuflagem"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Selecione o nível de alteração:"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 space-y-2",
						children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							onClick: () => !processing && setMode(m.key),
							className: `flex cursor-pointer gap-3 p-3.5 rounded-xl transition-all ${mode === m.key ? "bg-secondary/60 ring-1 ring-primary/40" : "hover:bg-secondary/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "audioMode",
								disabled: processing,
								checked: mode === m.key,
								onChange: () => setMode(m.key),
								className: "mt-1 accent-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs font-bold text-white",
								children: m.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-[11px] text-muted-foreground leading-relaxed",
								children: m.desc
							})] })]
						}, m.key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleCamouflage,
							disabled: processing || items.length === 0,
							className: "flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), processing ? "Processando áudios..." : `Camuflar ${items.length || 1} Áudio(s)`]
						})
					})
				]
			}) })]
		})]
	});
}
//#endregion
export { CamuflarAudioPage as component };
