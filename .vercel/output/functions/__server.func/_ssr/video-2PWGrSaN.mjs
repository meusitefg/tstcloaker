import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { G as Cpu, N as ImagePlus, U as Download, a as Video, m as Scissors, n as X, u as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Panel, t as AppShell } from "./AppShell-DpUAxH45.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/video-2PWGrSaN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function loadFFmpegLib() {
	if (typeof window === "undefined") return null;
	if (window.FFmpeg) return window.FFmpeg;
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = "https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js";
		script.async = true;
		script.onload = () => resolve(window.FFmpeg);
		script.onerror = () => {
			const fallback = document.createElement("script");
			fallback.src = "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js";
			fallback.async = true;
			fallback.onload = () => resolve(window.FFmpeg);
			fallback.onerror = reject;
			document.head.appendChild(fallback);
		};
		document.head.appendChild(script);
	});
}
function VideoCloaker() {
	const [files, setFiles] = (0, import_react.useState)([]);
	const [coverUrl, setCoverUrl] = (0, import_react.useState)("");
	const [mode, setMode] = (0, import_react.useState)("normal");
	const [format, setFormat] = (0, import_react.useState)("mp4");
	const [processing, setProcessing] = (0, import_react.useState)(false);
	const [statusText, setStatusText] = (0, import_react.useState)("");
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [outputBlobUrl, setOutputBlobUrl] = (0, import_react.useState)("");
	const [downloadName, setDownloadName] = (0, import_react.useState)("");
	const [isMp4Output, setIsMp4Output] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		return () => {
			if (outputBlobUrl) URL.revokeObjectURL(outputBlobUrl);
			if (coverUrl) URL.revokeObjectURL(coverUrl);
		};
	}, [outputBlobUrl, coverUrl]);
	function handleVideoPick(e) {
		if (!e.target.files?.length) return;
		const newFiles = Array.from(e.target.files).slice(0, 20);
		setFiles(newFiles);
		setOutputBlobUrl("");
		toast.success(`${newFiles.length} vídeo(s) pronto(s) para camuflagem.`);
	}
	function handleCoverPick(e) {
		const f = e.target.files?.[0];
		if (f) {
			setCoverUrl(URL.createObjectURL(f));
			toast.info("Imagem de capa selecionada.");
		}
	}
	async function processVideo() {
		if (!files.length) return;
		const file = files[0];
		setProcessing(true);
		setProgress(5);
		setStatusText("Iniciando recodificação...");
		try {
			const srcVideoUrl = URL.createObjectURL(file);
			const video = document.createElement("video");
			video.src = srcVideoUrl;
			video.muted = true;
			video.playsInline = true;
			await new Promise((resolve, reject) => {
				video.onloadedmetadata = resolve;
				video.onerror = reject;
			});
			const width = video.videoWidth || 1080;
			const height = video.videoHeight || 1920;
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d", { willReadFrequently: true });
			let coverImg = null;
			if (coverUrl) {
				coverImg = new Image();
				coverImg.src = coverUrl;
				await new Promise((r) => coverImg.onload = r);
			}
			const stream = canvas.captureStream(30);
			(video.captureStream?.()?.getAudioTracks() || []).forEach((t) => stream.addTrack(t));
			const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
			const recorder = new MediaRecorder(stream, {
				mimeType,
				videoBitsPerSecond: {
					basica: 32e5,
					normal: 24e5,
					agressiva: 18e5
				}[mode]
			});
			const chunks = [];
			recorder.ondataavailable = (e) => {
				if (e.data.size > 0) chunks.push(e.data);
			};
			const duration = video.duration || 5;
			const webmPromise = new Promise((resolve) => {
				recorder.onstop = () => {
					resolve(new Blob(chunks, { type: "video/webm" }));
				};
			});
			recorder.start();
			await video.play();
			let animationId = 0;
			const renderFrame = () => {
				if (video.currentTime >= duration || video.ended) {
					cancelAnimationFrame(animationId);
					video.pause();
					recorder.stop();
					return;
				}
				ctx.drawImage(video, 0, 0, width, height);
				if (mode === "normal" || mode === "agressiva") {
					ctx.fillStyle = `rgba(0, 230, 118, ${mode === "agressiva" ? .007 : .003})`;
					ctx.fillRect(0, 0, width, height);
				}
				if (coverImg) {
					ctx.globalAlpha = mode === "basica" ? .015 : mode === "normal" ? .03 : .06;
					ctx.drawImage(coverImg, 0, 0, width, height);
					ctx.globalAlpha = 1;
				}
				const pct = Math.round(video.currentTime / duration * (format === "mp4" ? 60 : 95));
				setProgress(pct);
				setStatusText(`Camuflando quadros... ${Math.round(video.currentTime / duration * 100)}%`);
				animationId = requestAnimationFrame(renderFrame);
			};
			animationId = requestAnimationFrame(renderFrame);
			const webmBlob = await webmPromise;
			URL.revokeObjectURL(srcVideoUrl);
			const randomHash = Math.random().toString(36).substring(2, 9);
			const cleanBaseName = file.name.replace(/\.[^.]+$/, "");
			if (format === "mp4") {
				setStatusText("Carregando motor FFmpeg WebAssembly...");
				setProgress(70);
				try {
					const FFmpegLib = await loadFFmpegLib();
					if (!FFmpegLib) throw new Error("FFmpeg não disponível");
					const { createFFmpeg, fetchFile } = FFmpegLib;
					const ffmpeg = createFFmpeg({
						log: false,
						corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js"
					});
					if (!ffmpeg.isLoaded()) await ffmpeg.load();
					setStatusText("FFmpeg convertendo para MP4 (H.264 / AAC)...");
					setProgress(85);
					ffmpeg.FS("writeFile", "input.webm", await fetchFile(webmBlob));
					await ffmpeg.run("-i", "input.webm", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "25", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", "output.mp4");
					const mp4Data = ffmpeg.FS("readFile", "output.mp4");
					const mp4Blob = new Blob([mp4Data.buffer], { type: "video/mp4" });
					const mp4Url = URL.createObjectURL(mp4Blob);
					setDownloadName(`cloakfy_${cleanBaseName}_${randomHash}.mp4`);
					setOutputBlobUrl(mp4Url);
					setIsMp4Output(true);
					setProgress(100);
					setProcessing(false);
					toast.success("Vídeo camuflado e exportado com FFmpeg em MP4 com sucesso!");
				} catch (ffmpegErr) {
					console.warn("Falha no FFmpeg wasm, baixando WebM camuflado:", ffmpegErr);
					const webmUrl = URL.createObjectURL(webmBlob);
					setDownloadName(`cloakfy_${cleanBaseName}_${randomHash}.webm`);
					setOutputBlobUrl(webmUrl);
					setIsMp4Output(false);
					setProgress(100);
					setProcessing(false);
					toast.info("Vídeo camuflado exportado em WebM.");
				}
			} else {
				const webmUrl = URL.createObjectURL(webmBlob);
				setDownloadName(`cloakfy_${cleanBaseName}_${randomHash}.webm`);
				setOutputBlobUrl(webmUrl);
				setIsMp4Output(false);
				setProgress(100);
				setProcessing(false);
				toast.success("Vídeo camuflado com sucesso!");
			}
		} catch (err) {
			console.error(err);
			setProcessing(false);
			toast.error("Ocorreu um erro ao processar o vídeo. Tente outro arquivo.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Camuflar Vídeo",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-4 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-3xl font-bold tracking-tight text-white flex items-center gap-3",
				children: ["Camuflar Vídeo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400",
					children: "FFmpeg MP4 Ativo"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 max-w-3xl text-xs text-muted-foreground leading-relaxed",
				children: "Envie seus vídeos, opcionalmente uma imagem de capa (misturada em cada quadro) e o modo de camuflagem. Agora com conversão nativa para MP4 via FFmpeg WebAssembly direto no navegador."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-[#14171a] px-3.5 py-1.5 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
						className: "text-white",
						children: "Plano Grátis"
					}),
					" · ferramenta incluída"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-[1fr_380px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mb-2 text-sm font-semibold text-white",
						children: ["Vídeos ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-normal text-muted-foreground",
							children: [
								"(",
								files.length,
								"/20)"
							]
						})]
					}), files.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						onDragOver: (e) => e.preventDefault(),
						onDrop: (e) => {
							e.preventDefault();
							if (e.dataTransfer.files) setFiles(Array.from(e.dataTransfer.files).slice(0, 20));
						},
						className: "flex h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-[#14171a] text-xs text-muted-foreground transition-all hover:border-primary/60 hover:text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-6 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Clique ou arraste para enviar vídeos (máx. 20)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground",
								children: "Compatível com MP4, MOV, WebM, AVI"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "video/*",
								multiple: true,
								onChange: handleVideoPick,
								className: "hidden"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "p-4 bg-[#14171a] border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold text-white",
								children: [files.length, " arquivo(s) na fila de camuflagem"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setFiles([]);
									setOutputBlobUrl("");
								},
								className: "text-xs text-muted-foreground hover:text-destructive transition-colors",
								children: "Remover todos"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 max-h-48 overflow-y-auto",
							children: files.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg bg-[#0d0f10] border border-border px-3 py-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-white font-mono",
									children: f.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-muted-foreground shrink-0 ml-2",
									children: [(f.size / 1048576).toFixed(1), " MB"]
								})]
							}, f.name + i))
						})]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-sm font-semibold text-white",
						children: "Imagem de capa (opcional)"
					}), coverUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "p-4 bg-[#14171a] border-border relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCoverUrl(""),
								className: "absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-black/70 text-white hover:bg-black",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: coverUrl,
								alt: "Capa",
								className: "max-h-44 rounded-lg object-contain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "A capa será misturada subliminarmente em cada quadro para descaracterizar o hash do criativo."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-[#14171a] text-xs text-muted-foreground transition-all hover:border-primary/60 hover:text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-5 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Clique para selecionar uma capa"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								onChange: handleCoverPick,
								className: "hidden"
							})
						]
					})] }),
					processing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "p-5 bg-[#14171a] border-primary/40 ring-1 ring-primary/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-white flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "size-4 animate-spin text-primary" }), statusText]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-primary font-bold",
								children: [progress, "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 w-full overflow-hidden rounded-full bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-primary transition-all duration-300",
								style: { width: `${progress}%` }
							})
						})]
					}),
					outputBlobUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "p-5 bg-[#14171a] border-primary/40 ring-1 ring-primary/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-primary font-semibold text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }),
										"Vídeo camuflado (",
										isMp4Output ? "Formato MP4 H.264" : "Formato WebM",
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary",
									children: "HASH RENOVADO"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: outputBlobUrl,
								controls: true,
								className: "max-h-72 w-full rounded-xl bg-black"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: outputBlobUrl,
								download: downloadName,
								className: "mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4 stroke-[2.5]" }),
									"Baixar vídeo camuflado (",
									downloadName,
									")"
								]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-sm font-semibold text-white",
					children: "Formato de Saída"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "bg-[#14171a] border-border divide-y divide-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						onClick: () => setFormat("mp4"),
						className: `flex cursor-pointer gap-3 p-4 transition-colors ${format === "mp4" ? "bg-secondary/40" : "hover:bg-secondary/20"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							name: "outputFormat",
							checked: format === "mp4",
							onChange: () => setFormat("mp4"),
							className: "mt-1 accent-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-xs font-bold text-white flex items-center gap-2",
							children: ["MP4 (H.264 via FFmpeg)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-primary/20 text-primary text-[10px] px-1.5 py-0.2",
								children: "Recomendado"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-[11px] text-muted-foreground",
							children: "Aceito universalmente pelo Facebook Ads, TikTok Ads e Google Ads."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						onClick: () => setFormat("webm"),
						className: `flex cursor-pointer gap-3 p-4 transition-colors ${format === "webm" ? "bg-secondary/40" : "hover:bg-secondary/20"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "radio",
							name: "outputFormat",
							checked: format === "webm",
							onChange: () => setFormat("webm"),
							className: "mt-1 accent-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs font-bold text-white",
							children: "WebM (Nativo)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 block text-[11px] text-muted-foreground",
							children: "Processamento ultrarrápido sem conversão."
						})] })]
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-sm font-semibold text-white",
					children: "Modo de camuflagem"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "bg-[#14171a] border-border divide-y divide-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							onClick: () => setMode("basica"),
							className: `flex cursor-pointer gap-3 p-5 transition-colors ${mode === "basica" ? "bg-secondary/40" : "hover:bg-secondary/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "cloakingMode",
								checked: mode === "basica",
								onChange: () => setMode("basica"),
								className: "mt-1 accent-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-semibold text-white",
								children: "Básica"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs leading-relaxed text-muted-foreground",
								children: "Recodifica o vídeo e limpa os metadados, mudando a impressão digital do arquivo. A capa, se enviada, entra bem discreta."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							onClick: () => setMode("normal"),
							className: `flex cursor-pointer gap-3 p-5 transition-colors ${mode === "normal" ? "bg-secondary/40" : "hover:bg-secondary/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "cloakingMode",
								checked: mode === "normal",
								onChange: () => setMode("normal"),
								className: "mt-1 accent-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-semibold text-white",
								children: "Normal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs leading-relaxed text-muted-foreground",
								children: "Recodificação mais forte (bitrate menor) para mudar mais a impressão digital. A capa, se enviada, fica um pouco mais presente."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							onClick: () => setMode("agressiva"),
							className: `flex cursor-pointer gap-3 p-5 transition-colors ${mode === "agressiva" ? "bg-secondary/40" : "hover:bg-secondary/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "cloakingMode",
								checked: mode === "agressiva",
								onChange: () => setMode("agressiva"),
								className: "mt-1 accent-primary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm font-semibold text-white",
								children: "Agressiva"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs leading-relaxed text-muted-foreground",
								children: "Recodificação máxima para a maior mudança de impressão digital, com leve custo de qualidade. A capa, se enviada, fica mais visível."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: files.length === 0 || processing,
								onClick: processVideo,
								className: "flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "size-4 stroke-[2.5]" }), processing ? statusText : `Camuflar ${files.length || 1} vídeo(s) (${format.toUpperCase()})`]
							})
						})
					]
				})] })]
			})]
		})]
	});
}
//#endregion
export { VideoCloaker as component };
