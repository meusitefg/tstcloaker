import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { R as Flame, U as Download, Y as CircleCheck, a as Video, at as Activity, it as Archive, k as Layers, s as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Panel, t as AppShell } from "./AppShell-DpUAxH45.mjs";
import { i as processAutoVariacoes, r as formatVariationDesc } from "./ffmpeg-CTXGQP-u.mjs";
import { t as require_lib } from "../_libs/jszip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auto-variacoes-BusEchIV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var VAR_COUNTS = [
	3,
	5,
	7,
	10
];
var MODES = [
	{
		key: "subtle",
		title: "Sutil, imperceptível a olho nu (recomendado)",
		desc: "Diferenças mínimas. Visualmente idênticos, mas hash, fps, brilho e crop 100% únicos."
	},
	{
		key: "moderate",
		title: "Moderado, diferenças leves visíveis",
		desc: "Variações um pouco mais perceptíveis. Maior distância de fingerprint entre os arquivos."
	},
	{
		key: "strong",
		title: "Forte, diferenças claras entre variações",
		desc: "Variações visíveis. Máxima diferença algorítmica entre cada arquivo gerado."
	}
];
var MAX_FILE_SIZE_MB = 100;
function AutoVariacoesPage() {
	const [file, setFile] = (0, import_react.useState)(null);
	const [count, setCount] = (0, import_react.useState)(5);
	const [mode, setMode] = (0, import_react.useState)("subtle");
	const [processing, setProcessing] = (0, import_react.useState)(false);
	const [statusMsg, setStatusMsg] = (0, import_react.useState)("");
	const [doneCount, setDoneCount] = (0, import_react.useState)(0);
	const [results, setResults] = (0, import_react.useState)([]);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const handleSelectFile = (0, import_react.useCallback)((selectedFile) => {
		if (!selectedFile.type.startsWith("video/") && !/\.(mp4|mov|avi|mkv|webm)$/i.test(selectedFile.name)) {
			toast.error("Por favor, selecione um arquivo de vídeo válido.");
			return;
		}
		if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
			toast.error(`O vídeo excede o limite máximo de ${MAX_FILE_SIZE_MB}MB.`);
			return;
		}
		setFile(selectedFile);
		setResults([]);
		toast.success(`Vídeo ${selectedFile.name} selecionado.`);
	}, []);
	function handleFileChange(e) {
		const f = e.target.files?.[0];
		if (f) {
			handleSelectFile(f);
			e.target.value = "";
		}
	}
	function handleDrop(e) {
		e.preventDefault();
		setIsDragging(false);
		const f = e.dataTransfer.files?.[0];
		if (f) handleSelectFile(f);
	}
	async function handleGenerate() {
		if (!file || processing) return;
		setProcessing(true);
		setResults([]);
		setDoneCount(0);
		setStatusMsg("Iniciando gerador de variações...");
		try {
			const generated = await processAutoVariacoes(file, count, mode, (done, total, msg) => {
				setDoneCount(done);
				setStatusMsg(msg);
			}, (newItem) => {
				setResults((prev) => [...prev, newItem]);
			});
			setResults(generated);
			setDoneCount(count);
			setStatusMsg("Concluído!");
			toast.success(`${generated.length} variações únicas geradas com sucesso!`);
		} catch (err) {
			console.error("Erro nas auto-variações:", err);
			toast.error(err?.message || "Falha ao gerar variações.");
		} finally {
			setProcessing(false);
		}
	}
	async function downloadAllZip() {
		if (!results.length) return;
		const zip = new import_lib.default();
		results.forEach((r) => {
			zip.file(r.label, r.blob);
		});
		const zipBlob = await zip.generateAsync({ type: "blob" });
		const url = URL.createObjectURL(zipBlob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${file?.name.replace(/\.[^.]+$/, "") || "variacoes"}_${results.length}_variacoes.zip`;
		a.click();
		toast.success("Download do ZIP iniciado!");
	}
	function downloadSingle(item) {
		const a = document.createElement("a");
		a.href = item.url;
		a.download = item.label;
		a.click();
	}
	const progressPercent = count > 0 ? Math.round(doneCount / count * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Auto-Variações",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-mono text-muted-foreground uppercase tracking-wider",
						children: "/auto-variacoes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold text-primary",
						children: "LIBERADO"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-1 text-3xl font-bold tracking-tight text-white flex items-center gap-2",
					children: ["Auto-Variações", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-6 text-primary fill-primary/20" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-xs text-muted-foreground leading-relaxed",
					children: "Gere múltiplas variações 100% únicas do mesmo criativo para testes A/B e escala sem duplicação no Meta, Google e TikTok Ads."
				})
			] }), results.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: downloadAllZip,
				className: "flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-md transition-all",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "size-4" }),
					"Baixar Todas em ZIP (",
					results.length,
					")"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[1fr_360px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "p-5 bg-[#14171a] border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold text-white",
								children: "Criativo Base (Vídeo)"
							}), file && !processing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setFile(null);
									setResults([]);
								},
								className: "text-xs text-muted-foreground hover:text-destructive transition-colors",
								children: "Trocar vídeo"
							})]
						}),
						!file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
									children: "Clique ou arraste seu vídeo base"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground",
									children: [
										"MP4, MOV, WebM, AVI · Máximo de ",
										MAX_FILE_SIZE_MB,
										"MB"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileInputRef,
									type: "file",
									accept: "video/*,.mp4,.mov,.avi,.mkv,.webm",
									onChange: handleFileChange,
									className: "hidden"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 rounded-xl border border-border bg-[#0d0f10] p-4 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-9 place-items-center rounded-lg bg-secondary text-primary shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-semibold text-white",
										children: file.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground font-mono",
										children: [(file.size / 1048576).toFixed(2), " MB"]
									})]
								})]
							}), !processing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setFile(null);
									setResults([]);
								},
								className: "p-1 text-muted-foreground hover:text-destructive",
								title: "Remover vídeo",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})]
						}),
						processing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 pt-4 border-t border-border space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-semibold text-white",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 animate-pulse" }), statusMsg]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-muted-foreground",
									children: [
										doneCount,
										"/",
										count,
										" (",
										progressPercent,
										"%)"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 w-full overflow-hidden rounded-full bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-primary transition-all duration-300",
									style: { width: `${progressPercent}%` }
								})
							})]
						})
					]
				}), results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "p-5 bg-[#14171a] border-border space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-sm font-bold text-white",
									children: [results.length, " Variações Geradas"]
								})]
							}), results.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: downloadAllZip,
								className: "inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent transition-all",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "size-3.5" }), " Baixar Todas (ZIP)"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2.5",
							children: results.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 rounded-xl border border-border bg-[#0d0f10] p-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-bold text-white",
										children: ["Variação #", item.index + 1]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-0.5 text-[11px] text-muted-foreground font-mono truncate",
										title: formatVariationDesc(item.config),
										children: [
											formatVariationDesc(item.config),
											" · ",
											(item.size / 1048576).toFixed(2),
											" MB"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => downloadSingle(item),
									className: "inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-sm shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Baixar"]
								})]
							}, item.index))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground/80 leading-relaxed border-t border-border/60 pt-3",
							children: "Cada variação possui alteração sutil de brilho, contraste, micro-crop, framerate fracionário e deslocamento de pitch/áudio para quebrar o fingerprinting algorítmico."
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "bg-[#14171a] border-border divide-y divide-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold text-white mb-2",
								children: "Quantas variações?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-4 gap-2",
								children: VAR_COUNTS.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: processing,
									onClick: () => setCount(n),
									className: `rounded-xl py-2.5 text-xs font-bold transition-all ${count === n ? "bg-primary text-primary-foreground shadow-sm" : "border border-border bg-[#0d0f10] text-muted-foreground hover:text-white"}`,
									children: n
								}, n))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-semibold text-white mb-1",
									children: "Nível de alteração"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mb-3",
									children: "Distância algorítmica entre cada criativo:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2",
									children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										onClick: () => !processing && setMode(m.key),
										className: `flex cursor-pointer gap-3 p-3 rounded-xl transition-all ${mode === m.key ? "bg-secondary/60 ring-1 ring-primary/40" : "hover:bg-secondary/20"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "radio",
											name: "autoVarMode",
											disabled: processing,
											checked: mode === m.key,
											onChange: () => setMode(m.key),
											className: "mt-1 accent-primary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-xs font-bold text-white",
											children: m.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-0.5 block text-[11px] text-muted-foreground leading-relaxed",
											children: m.desc
										})] })]
									}, m.key))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: processing || !file,
								onClick: handleGenerate,
								className: "flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" }), processing ? `Processando ${doneCount}/${count}...` : `Gerar ${count} Variações`]
							})
						})
					]
				})
			})]
		})]
	});
}
//#endregion
export { AutoVariacoesPage as component };
