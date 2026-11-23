import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, Scissors, Video, ShieldCheck, X, Cpu } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, Panel } from "@/components/AppShell";

export const Route = createFileRoute("/video")({
  head: () => ({
    meta: [
      { title: "Camuflar Vídeo | Cloakfy" },
      { name: "description", content: "Camufle vídeos com recodificação, mistura de capa e mudança de impressão digital." },
      { property: "og:title", content: "Camuflar Vídeo | Cloakfy" },
    ],
  }),
  component: VideoCloaker,
});

type CloakingMode = "basica" | "normal" | "agressiva";

function VideoCloaker() {
  const [files, setFiles] = useState<File[]>([]);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [mode, setMode] = useState<CloakingMode>("normal");
  const [coverBlend, setCoverBlend] = useState(5);
  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [progress, setProgress] = useState(0);
  const [outputBlobUrl, setOutputBlobUrl] = useState<string>("");
  const [downloadName, setDownloadName] = useState("");
  const coverImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    return () => {
      if (outputBlobUrl) URL.revokeObjectURL(outputBlobUrl);
      if (coverUrl) URL.revokeObjectURL(coverUrl);
    };
  }, []);

  function handleVideoPick(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    const newFiles = Array.from(e.target.files).slice(0, 20);
    setFiles(newFiles);
    // Reset output but DO NOT reset processing — let the button handle it
    setOutputBlobUrl("");
    setStatusText("");
    setProgress(0);
    toast.success(`${newFiles.length} vídeo(s) prontos para camuflagem.`);
  }

  function handleCoverPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (coverUrl) URL.revokeObjectURL(coverUrl);
    const url = URL.createObjectURL(f);
    setCoverUrl(url);
    setCoverLoaded(false);
    const img = new Image();
    img.onload = () => { coverImgRef.current = img; setCoverLoaded(true); };
    img.src = url;
    toast.info("Imagem de capa selecionada.");
  }

  function removeCover() {
    if (coverUrl) URL.revokeObjectURL(coverUrl);
    setCoverUrl("");
    setCoverLoaded(false);
    coverImgRef.current = null;
  }

  async function processVideo() {
    if (!files.length) return;
    const file = files[0]!;

    // Always fully reset state before processing
    setProcessing(true);
    setProgress(5);
    setOutputBlobUrl("");
    setStatusText("Iniciando recodificação...");

    try {
      const srcVideoUrl = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = srcVideoUrl;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("Falha ao carregar vídeo"));
        setTimeout(() => reject(new Error("Timeout ao carregar vídeo")), 15000);
      });

      const width = video.videoWidth || 1080;
      const height = video.videoHeight || 1920;
      setStatusText("Preparando canvas...");
      setProgress(15);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      const coverImg = coverImgRef.current;

      // Try to capture audio from the video element
      let audioTracks: MediaStreamTrack[] = [];
      try {
        const vs = (video as any).captureStream?.();
        if (vs) audioTracks = vs.getAudioTracks();
      } catch { /* no audio */ }

      const stream = canvas.captureStream(30);
      audioTracks.forEach((t) => stream.addTrack(t));

      const bitrateMap: Record<CloakingMode, number> = {
        basica: 3200000,
        normal: 2400000,
        agressiva: 1800000,
      };

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: bitrateMap[mode],
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

      setStatusText("Recodificando...");
      setProgress(25);

      await new Promise<void>((resolve, reject) => {
        recorder.onstop = () => resolve();
        recorder.onerror = (ev) => reject(ev);
        recorder.start(100);

        video.currentTime = 0;
        video.play().catch(() => {});

        const coverAlpha = coverImg ? Math.min(0.55, (coverBlend / 10) * 0.55) : 0;

        function drawFrame() {
          if (video.paused || video.ended) {
            if (recorder.state === "recording") recorder.stop();
            return;
          }
          ctx.drawImage(video, 0, 0, width, height);

          if (coverImg && coverBlend > 0) {
            ctx.globalAlpha = coverAlpha;
            const cs = Math.max(width / coverImg.width, height / coverImg.height);
            const cdx = (width - coverImg.width * cs) / 2;
            const cdy = (height - coverImg.height * cs) / 2;
            ctx.drawImage(coverImg, cdx, cdy, coverImg.width * cs, coverImg.height * cs);
            ctx.globalAlpha = 1;
          }

          // Anti-fingerprint pixel
          if (mode !== "basica") {
            ctx.fillStyle = `rgba(0,230,118,${mode === "agressiva" ? 0.012 : 0.006})`;
            ctx.fillRect(0, 0, 2, 2);
          }

          const progVal = Math.min(90, 25 + (video.currentTime / (video.duration || 1)) * 65);
          setProgress(Math.round(progVal));
          requestAnimationFrame(drawFrame);
        }

        video.onplay = () => requestAnimationFrame(drawFrame);
        video.onended = () => { if (recorder.state === "recording") recorder.stop(); };
      });

      setStatusText("Finalizando arquivo...");
      setProgress(95);

      const blob = new Blob(chunks, { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const name = `cloakfy_video_${mode}_${Math.random().toString(36).slice(2, 7)}.webm`;

      setOutputBlobUrl(blobUrl);
      setDownloadName(name);
      setProgress(100);
      setStatusText("Concluído!");
      toast.success("Vídeo camuflado com sucesso!");
      URL.revokeObjectURL(srcVideoUrl);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao processar vídeo. Tente novamente.");
    } finally {
      // Always reset processing state so user can click again
      setProcessing(false);
      setProgress(0);
      setStatusText("");
    }
  }

  const coverBlendPct = Math.round((coverBlend / 10) * 55);
  const coverBlendLabel =
    coverBlend === 0 ? "Sem capa" :
    coverBlend <= 3 ? `${coverBlendPct}% — discreta` :
    coverBlend <= 6 ? `${coverBlendPct}% — equilibrada` :
    `${coverBlendPct}% — dominante`;

  return (
    <AppShell title="Camuflar Vídeo">
      <PageHeader
        title="Camuflar Vídeo"
        subtitle="Recodifique seus vídeos, misture uma imagem de capa e altere a impressão digital. Envie seus vídeos, opcionalmente uma imagem de capa e o modo de camuflagem."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* LEFT: Upload + Preview */}
        <div className="space-y-4">
          {/* Video Upload */}
          <label className="flex h-52 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-[#14171a] text-xs font-medium text-muted-foreground hover:border-primary/60 hover:text-white transition-all">
            <div className="grid size-12 place-items-center rounded-xl bg-secondary text-primary">
              <Video className="size-6" />
            </div>
            <span>Clique ou arraste para enviar vídeos (máx. 20)</span>
            {files.length > 0 && (
              <span className="text-primary font-semibold">{files.length} vídeo(s) selecionado(s)</span>
            )}
            <input type="file" accept="video/*" multiple onChange={handleVideoPick} className="hidden" />
          </label>

          {/* File List */}
          {files.length > 0 && (
            <Panel className="bg-[#14171a] border-border divide-y divide-border">
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 text-xs">
                  <span className="text-white truncate max-w-[200px]">{f.name}</span>
                  <span className="text-muted-foreground">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                </div>
              ))}
            </Panel>
          )}

          {/* Cover image */}
          <Panel className="bg-[#14171a] border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-white flex items-center gap-2">
                <ImagePlus className="size-4 text-primary" /> Imagem de capa (opcional)
              </p>
            </div>
            {coverUrl ? (
              <div>
                {/* Preview: overlay simulation */}
                <div className="relative overflow-hidden rounded-xl border border-border bg-black h-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="size-10 text-white/20" />
                  </div>
                  <img
                    src={coverUrl}
                    alt="Capa"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity"
                    style={{ opacity: Math.min(0.95, (coverBlend / 10) * 0.95) }}
                  />
                  <button
                    onClick={removeCover}
                    className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-black/70 text-white hover:bg-black z-10"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                {/* Blend Slider */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Sobreposição da capa</span>
                    <span className="text-primary font-mono font-bold">{coverBlendLabel}</span>
                  </div>
                  <input
                    type="range" min={0} max={10} step={1} value={coverBlend}
                    onChange={(e) => setCoverBlend(Number(e.target.value))}
                    className="w-full h-2 cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Sem capa</span><span>Capa domina</span>
                  </div>
                </div>
              </div>
            ) : (
              <label className="flex h-16 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border hover:border-primary/60 transition-all text-xs text-muted-foreground">
                <ImagePlus className="size-4" /> Clique para adicionar imagem de capa
                <input type="file" accept="image/*" onChange={handleCoverPick} className="hidden" />
              </label>
            )}
          </Panel>

          {/* Progress */}
          {processing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Cpu className="size-4 text-primary animate-pulse" /> {statusText}
                </span>
                <span className="text-primary font-bold">{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Download */}
          {outputBlobUrl && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
              <ShieldCheck className="size-5 text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-emerald-400">Vídeo camuflado pronto!</p>
                <p className="text-[11px] text-muted-foreground truncate">{downloadName}</p>
              </div>
              <a
                href={outputBlobUrl}
                download={downloadName}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all"
              >
                <Download className="size-4" /> Baixar
              </a>
            </div>
          )}
        </div>

        {/* RIGHT: Mode */}
        <div>
          <h2 className="mb-2 text-sm font-semibold text-white">Modo de camuflagem</h2>
          <Panel className="bg-[#14171a] border-border divide-y divide-border">
            {(
              [
                { key: "basica" as CloakingMode, label: "Básica", desc: "Recodifica o vídeo e limpa os metadados, mudando a impressão digital do arquivo. A capa, se enviada, entra bem discreta." },
                { key: "normal" as CloakingMode, label: "Normal", desc: "Recodificação mais forte (bitrate menor) para mudar mais a impressão digital. A capa, se enviada, fica um pouco mais presente." },
                { key: "agressiva" as CloakingMode, label: "Agressiva", desc: "Recodificação máxima para a maior mudança de impressão digital, com leve custo de qualidade. A capa, se enviada, fica mais visível." },
              ] as const
            ).map((m) => (
              <label
                key={m.key}
                className={`flex cursor-pointer gap-3 p-5 transition-colors ${mode === m.key ? "bg-secondary/40" : "hover:bg-secondary/20"}`}
              >
                <input type="radio" name="cloakingMode" checked={mode === m.key} onChange={() => setMode(m.key)} className="mt-1 accent-primary" />
                <div>
                  <span className="block text-sm font-semibold text-white">{m.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{m.desc}</span>
                </div>
              </label>
            ))}

            <div className="p-5">
              <button
                disabled={files.length === 0 || processing}
                onClick={processVideo}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 disabled:opacity-50"
              >
                <Scissors className="size-4 stroke-[2.5]" />
                {processing ? (statusText || "Processando...") : `Camuflar ${files.length || 1} vídeo(s)`}
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
