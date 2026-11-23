import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Scissors, Video, ShieldCheck, Check, Sparkles, X, FileVideo, Cpu } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, Panel } from "@/components/AppShell";

export const Route = createFileRoute("/video")({
  head: () => ({
    meta: [
      { title: "Camuflar Vídeo (FFmpeg MP4) | Cloakfy" },
      { name: "description", content: "Camufle vídeos limpando metadados, alterando a impressão digital e convertendo para MP4 via FFmpeg." },
      { property: "og:title", content: "Camuflar Vídeo (FFmpeg MP4) | Cloakfy" },
      { property: "og:description", content: "Camufle vídeos limpando metadados, alterando a impressão digital e convertendo para MP4 via FFmpeg." },
    ],
  }),
  component: VideoCloaker,
});

type CloakingMode = "basica" | "normal" | "agressiva";
type OutputFormat = "mp4" | "webm";

// Dynamic FFmpeg WebAssembly loader (Single-threaded 0.11.x works in all browsers without SharedArrayBuffer headers)
async function loadFFmpegLib() {
  if (typeof window === "undefined") return null;
  if ((window as any).FFmpeg) return (window as any).FFmpeg;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js";
    script.async = true;
    script.onload = () => resolve((window as any).FFmpeg);
    script.onerror = () => {
      // Fallback CDN if unpkg has network issues
      const fallback = document.createElement("script");
      fallback.src = "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js";
      fallback.async = true;
      fallback.onload = () => resolve((window as any).FFmpeg);
      fallback.onerror = reject;
      document.head.appendChild(fallback);
    };
    document.head.appendChild(script);
  });
}

function VideoCloaker() {
  const [files, setFiles] = useState<File[]>([]);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [mode, setMode] = useState<CloakingMode>("normal");
  const [format, setFormat] = useState<OutputFormat>("mp4");
  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [progress, setProgress] = useState(0);
  const [outputBlobUrl, setOutputBlobUrl] = useState<string>("");
  const [downloadName, setDownloadName] = useState("");
  const [isMp4Output, setIsMp4Output] = useState(true);

  useEffect(() => {
    return () => {
      if (outputBlobUrl) URL.revokeObjectURL(outputBlobUrl);
      if (coverUrl) URL.revokeObjectURL(coverUrl);
    };
  }, [outputBlobUrl, coverUrl]);

  function handleVideoPick(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    const newFiles = Array.from(e.target.files).slice(0, 20);
    setFiles(newFiles);
    setOutputBlobUrl("");
    toast.success(`${newFiles.length} vídeo(s) pronto(s) para camuflagem.`);
  }

  function handleCoverPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setCoverUrl(URL.createObjectURL(f));
      toast.info("Imagem de capa selecionada.");
    }
  }

  async function processVideo() {
    if (!files.length) return;
    const file = files[0]!;
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
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

      // Load cover if provided
      let coverImg: HTMLImageElement | null = null;
      if (coverUrl) {
        coverImg = new Image();
        coverImg.src = coverUrl;
        await new Promise((r) => (coverImg!.onload = r));
      }

      const stream = canvas.captureStream(30);
      const audioTracks = (video as any).captureStream?.()?.getAudioTracks() || [];
      audioTracks.forEach((t: any) => stream.addTrack(t));

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";

      const bitrateMap = {
        basica: 3200000,
        normal: 2400000,
        agressiva: 1800000,
      };

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: bitrateMap[mode],
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const duration = video.duration || 5;

      const webmPromise = new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          const finalWebmBlob = new Blob(chunks, { type: "video/webm" });
          resolve(finalWebmBlob);
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

        // Micro-noise pixel injection (changes MD5/SHA256 fingerprint)
        if (mode === "normal" || mode === "agressiva") {
          ctx.fillStyle = `rgba(0, 230, 118, ${mode === "agressiva" ? 0.007 : 0.003})`;
          ctx.fillRect(0, 0, width, height);
        }

        // Blend cover subliminally if provided
        if (coverImg) {
          const coverAlpha = mode === "basica" ? 0.015 : mode === "normal" ? 0.03 : 0.06;
          ctx.globalAlpha = coverAlpha;
          ctx.drawImage(coverImg, 0, 0, width, height);
          ctx.globalAlpha = 1.0;
        }

        const pct = Math.round((video.currentTime / duration) * (format === "mp4" ? 60 : 95));
        setProgress(pct);
        setStatusText(`Camuflando quadros... ${Math.round((video.currentTime / duration) * 100)}%`);
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
            corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
          });

          if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
          }

          setStatusText("FFmpeg convertendo para MP4 (H.264 / AAC)...");
          setProgress(85);

          ffmpeg.FS("writeFile", "input.webm", await fetchFile(webmBlob));

          await ffmpeg.run(
            "-i",
            "input.webm",
            "-c:v",
            "libx264",
            "-preset",
            "ultrafast",
            "-crf",
            "25",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "-movflags",
            "+faststart",
            "output.mp4"
          );

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

  return (
    <AppShell title="Camuflar Vídeo">
      {/* Header with badge matching Screenshot 1 */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Camuflar Vídeo
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              FFmpeg MP4 Ativo
            </span>
          </h1>
          <p className="mt-1.5 max-w-3xl text-xs text-muted-foreground leading-relaxed">
            Envie seus vídeos, opcionalmente uma imagem de capa (misturada em cada quadro) e o modo de camuflagem. Agora com conversão nativa para MP4 via FFmpeg WebAssembly direto no navegador.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[#14171a] px-3.5 py-1.5 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          <b className="text-white">Plano Grátis</b> · ferramenta incluída
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left Column: Uploads - Matching Screenshot 1 */}
        <div className="space-y-6">
          {/* Vídeos (0/20) */}
          <div>
            <h2 className="mb-2 text-sm font-semibold text-white">
              Vídeos <span className="font-normal text-muted-foreground">({files.length}/20)</span>
            </h2>

            {files.length === 0 ? (
              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) {
                    setFiles(Array.from(e.dataTransfer.files).slice(0, 20));
                  }
                }}
                className="flex h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-[#14171a] text-xs text-muted-foreground transition-all hover:border-primary/60 hover:text-white"
              >
                <Video className="size-6 text-muted-foreground" />
                <span className="font-medium">Clique ou arraste para enviar vídeos (máx. 20)</span>
                <span className="text-[11px] text-muted-foreground">Compatível com MP4, MOV, WebM, AVI</span>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoPick}
                  className="hidden"
                />
              </label>
            ) : (
              <Panel className="p-4 bg-[#14171a] border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-white">
                    {files.length} arquivo(s) na fila de camuflagem
                  </span>
                  <button
                    onClick={() => {
                      setFiles([]);
                      setOutputBlobUrl("");
                    }}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Remover todos
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {files.map((f, i) => (
                    <div
                      key={f.name + i}
                      className="flex items-center justify-between rounded-lg bg-[#0d0f10] border border-border px-3 py-2 text-xs"
                    >
                      <span className="truncate text-white font-mono">{f.name}</span>
                      <span className="text-[11px] text-muted-foreground shrink-0 ml-2">
                        {(f.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            )}
          </div>

          {/* Imagem de capa (opcional) */}
          <div>
            <h2 className="mb-2 text-sm font-semibold text-white">Imagem de capa (opcional)</h2>
            {coverUrl ? (
              <Panel className="p-4 bg-[#14171a] border-border relative">
                <button
                  onClick={() => setCoverUrl("")}
                  className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-black/70 text-white hover:bg-black"
                >
                  <X className="size-4" />
                </button>
                <img src={coverUrl} alt="Capa" className="max-h-44 rounded-lg object-contain" />
                <p className="mt-2 text-xs text-muted-foreground">
                  A capa será misturada subliminarmente em cada quadro para descaracterizar o hash do criativo.
                </p>
              </Panel>
            ) : (
              <label className="flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-[#14171a] text-xs text-muted-foreground transition-all hover:border-primary/60 hover:text-white">
                <ImagePlus className="size-5 text-muted-foreground" />
                <span className="font-medium">Clique para selecionar uma capa</span>
                <input type="file" accept="image/*" onChange={handleCoverPick} className="hidden" />
              </label>
            )}
          </div>

          {/* Progress Bar while running */}
          {processing && (
            <Panel className="p-5 bg-[#14171a] border-primary/40 ring-1 ring-primary/20">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-white flex items-center gap-2">
                  <Cpu className="size-4 animate-spin text-primary" />
                  {statusText}
                </span>
                <span className="font-mono text-primary font-bold">{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </Panel>
          )}

          {/* Result Player / Download */}
          {outputBlobUrl && (
            <Panel className="p-5 bg-[#14171a] border-primary/40 ring-1 ring-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                  <ShieldCheck className="size-4" />
                  Vídeo camuflado ({isMp4Output ? "Formato MP4 H.264" : "Formato WebM"})
                </div>
                <span className="rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary">
                  HASH RENOVADO
                </span>
              </div>
              <video
                src={outputBlobUrl}
                controls
                className="max-h-72 w-full rounded-xl bg-black"
              />
              <a
                href={outputBlobUrl}
                download={downloadName}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110"
              >
                <Download className="size-4 stroke-[2.5]" />
                Baixar vídeo camuflado ({downloadName})
              </a>
            </Panel>
          )}
        </div>

        {/* Right Column: Modo de Camuflagem & Formato - Matching Screenshot 1 */}
        <div className="space-y-6">
          {/* Formato de Exportação */}
          <div>
            <h2 className="mb-2 text-sm font-semibold text-white">Formato de Saída</h2>
            <Panel className="bg-[#14171a] border-border divide-y divide-border">
              <label
                onClick={() => setFormat("mp4")}
                className={`flex cursor-pointer gap-3 p-4 transition-colors ${
                  format === "mp4" ? "bg-secondary/40" : "hover:bg-secondary/20"
                }`}
              >
                <input
                  type="radio"
                  name="outputFormat"
                  checked={format === "mp4"}
                  onChange={() => setFormat("mp4")}
                  className="mt-1 accent-primary"
                />
                <div>
                  <span className="block text-xs font-bold text-white flex items-center gap-2">
                    MP4 (H.264 via FFmpeg)
                    <span className="rounded bg-primary/20 text-primary text-[10px] px-1.5 py-0.2">Recomendado</span>
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    Aceito universalmente pelo Facebook Ads, TikTok Ads e Google Ads.
                  </span>
                </div>
              </label>

              <label
                onClick={() => setFormat("webm")}
                className={`flex cursor-pointer gap-3 p-4 transition-colors ${
                  format === "webm" ? "bg-secondary/40" : "hover:bg-secondary/20"
                }`}
              >
                <input
                  type="radio"
                  name="outputFormat"
                  checked={format === "webm"}
                  onChange={() => setFormat("webm")}
                  className="mt-1 accent-primary"
                />
                <div>
                  <span className="block text-xs font-bold text-white">WebM (Nativo)</span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    Processamento ultrarrápido sem conversão.
                  </span>
                </div>
              </label>
            </Panel>
          </div>

          {/* Modo de Camuflagem */}
          <div>
            <h2 className="mb-2 text-sm font-semibold text-white">Modo de camuflagem</h2>
            <Panel className="bg-[#14171a] border-border divide-y divide-border">
              {/* Opção Básica */}
              <label
                onClick={() => setMode("basica")}
                className={`flex cursor-pointer gap-3 p-5 transition-colors ${
                  mode === "basica" ? "bg-secondary/40" : "hover:bg-secondary/20"
                }`}
              >
                <input
                  type="radio"
                  name="cloakingMode"
                  checked={mode === "basica"}
                  onChange={() => setMode("basica")}
                  className="mt-1 accent-primary"
                />
                <div>
                  <span className="block text-sm font-semibold text-white">Básica</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    Recodifica o vídeo e limpa os metadados, mudando a impressão digital do arquivo. A capa, se enviada, entra bem discreta.
                  </span>
                </div>
              </label>

              {/* Opção Normal */}
              <label
                onClick={() => setMode("normal")}
                className={`flex cursor-pointer gap-3 p-5 transition-colors ${
                  mode === "normal" ? "bg-secondary/40" : "hover:bg-secondary/20"
                }`}
              >
                <input
                  type="radio"
                  name="cloakingMode"
                  checked={mode === "normal"}
                  onChange={() => setMode("normal")}
                  className="mt-1 accent-primary"
                />
                <div>
                  <span className="block text-sm font-semibold text-white">Normal</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    Recodificação mais forte (bitrate menor) para mudar mais a impressão digital. A capa, se enviada, fica um pouco mais presente.
                  </span>
                </div>
              </label>

              {/* Opção Agressiva */}
              <label
                onClick={() => setMode("agressiva")}
                className={`flex cursor-pointer gap-3 p-5 transition-colors ${
                  mode === "agressiva" ? "bg-secondary/40" : "hover:bg-secondary/20"
                }`}
              >
                <input
                  type="radio"
                  name="cloakingMode"
                  checked={mode === "agressiva"}
                  onChange={() => setMode("agressiva")}
                  className="mt-1 accent-primary"
                />
                <div>
                  <span className="block text-sm font-semibold text-white">Agressiva</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    Recodificação máxima para a maior mudança de impressão digital, com leve custo de qualidade. A capa, se enviada, fica mais visível.
                  </span>
                </div>
              </label>

              {/* Submit Action Button */}
              <div className="p-5">
                <button
                  disabled={files.length === 0 || processing}
                  onClick={processVideo}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 disabled:opacity-50"
                >
                  <Scissors className="size-4 stroke-[2.5]" />
                  {processing
                    ? statusText
                    : `Camuflar ${files.length || 1} vídeo(s) (${format.toUpperCase()})`}
                </button>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
