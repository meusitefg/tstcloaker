import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import {
  Video,
  Download,
  Scissors,
  Sparkles,
  CheckCircle2,
  Trash2,
  Clock,
  Layers,
  Archive,
  Zap,
  Activity,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";
import { AppShell, Panel } from "@/components/AppShell";
import { camuflarTikTokVideo, TikTokCamouflageMode } from "@/lib/ffmpeg";

export const Route = createFileRoute("/camuflar-tiktok")({
  head: () => ({
    meta: [
      { title: "Camuflagem TikTok | Cloakfy" },
      { name: "description", content: "Camufle criativos especificamente para os parâmetros do algoritmo do TikTok Ads." },
      { property: "og:title", content: "Camuflagem TikTok | Cloakfy" },
    ],
  }),
  component: CamuflarTikTokPage,
});

interface VideoItem {
  id: string;
  file: File;
  status: "queued" | "processing" | "done" | "error";
  error?: string;
  blob?: Blob;
  url?: string;
  outputName?: string;
  size?: number;
}

const TIKTOK_MODES = [
  {
    key: "basic" as TikTokCamouflageMode,
    title: "Básica, rápida, só metadados",
    desc: "Remove metadados e altera o hash do arquivo. Menor alteração, processamento mais rápido.",
    badge: "Rápido",
  },
  {
    key: "normal" as TikTokCamouflageMode,
    title: "Normal, recomendada",
    desc: "Metadados + framerate 29.97 + bitrate variado. Boa proteção sem perda de qualidade visível.",
    badge: "Recomendado",
  },
  {
    key: "aggressive" as TikTokCamouflageMode,
    title: "Agressiva, máxima proteção",
    desc: "Tudo acima + micro-crop 1.2% + re-encode completo com ruído imperceptível. Virtualmente indetectável.",
    badge: "Máxima Proteção",
  },
];

const MAX_VIDEOS = 20;

function CamuflarTikTokPage() {
  const [items, setItems] = useState<VideoItem[]>([]);
  const [mode, setMode] = useState<TikTokCamouflageMode>("normal");
  const [processing, setProcessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: File[]) => {
    const valid = files.filter(
      (f) => f.type.startsWith("video/") || /\.(mp4|mov|avi|mkv|webm)$/i.test(f.name)
    );
    if (!valid.length) {
      toast.error("Por favor, selecione arquivos de vídeo válidos (MP4, MOV, WebM, AVI).");
      return;
    }

    setItems((prev) => {
      const combined = [
        ...prev,
        ...valid.map((f) => ({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          status: "queued" as const,
        })),
      ];
      if (combined.length > MAX_VIDEOS) {
        toast.error(`Máximo de ${MAX_VIDEOS} vídeos permitidos por lote.`);
        return combined.slice(0, MAX_VIDEOS);
      }
      return combined;
    });

    toast.success(`${valid.length} vídeo(s) adicionado(s) à fila.`);
  }, []);

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  }

  function removeVideo(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function clearAll() {
    setItems([]);
  }

  async function handleProcessAll() {
    const pending = items.filter((i) => i.status !== "done");
    if (!pending.length) {
      toast.error("Adicione ao menos um vídeo para camuflar.");
      return;
    }

    setProcessing(true);

    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      if (!item || item.status === "done") continue;

      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: "processing" } : it))
      );

      try {
        const result = await camuflarTikTokVideo(item.file, mode, (msg) => {
          setCurrentStatus(`[${idx + 1}/${items.length}] ${msg}`);
        });

        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  status: "done",
                  blob: result.blob,
                  url: result.url,
                  outputName: result.outputName,
                  size: result.size,
                }
              : it
          )
        );
      } catch (err: any) {
        console.error("Erro no processamento TikTok:", err);
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? { ...it, status: "error", error: err?.message || "Erro no processamento" }
              : it
          )
        );
      }
    }

    setProcessing(false);
    setCurrentStatus("");
    toast.success("Processamento para TikTok concluído!");
  }

  async function downloadZip() {
    const readyItems = items.filter((i) => i.blob && i.outputName);
    if (!readyItems.length) return;

    const zip = new JSZip();
    readyItems.forEach((item, idx) => {
      zip.file(item.outputName || `tiktok_var_${idx + 1}.mp4`, item.blob!);
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

  return (
    <AppShell title="Camuflagem TikTok">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">/camuflar-tiktok</p>
            <span className="rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary">
              TIKTOK ADS
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Camuflagem TikTok
            <Zap className="size-6 text-primary fill-primary/20" />
          </h1>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            Camufle vídeos especificamente contra o sistema de fingerprinting da ByteDance/TikTok Ads, ajustando framerate (29.97 CFR), metadados e micro-crop.
          </p>
        </div>

        {doneCount > 1 && (
          <button
            onClick={downloadZip}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-md transition-all"
          >
            <Archive className="size-4" />
            Baixar Todos em ZIP ({doneCount})
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: Upload and Video Queue */}
        <div className="space-y-4">
          <Panel className="p-5 bg-[#14171a] border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">
                Vídeos para TikTok ({items.length}/{MAX_VIDEOS})
              </h2>
              {items.length > 0 && !processing && (
                <button
                  onClick={clearAll}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Limpar todos
                </button>
              )}
            </div>

            {/* Drop Zone */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex h-44 cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed transition-all ${
                isDragging
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-[#0d0f10] text-muted-foreground hover:border-primary/60 hover:text-white"
              }`}
            >
              <div className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
                <Video className="size-5" />
              </div>
              <p className="text-xs font-semibold text-white">
                Clique ou arraste vídeos para TikTok Ads
              </p>
              <p className="text-[11px] text-muted-foreground">
                MP4, MOV, WebM, AVI · Até {MAX_VIDEOS} vídeos por lote
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,.mp4,.mov,.avi,.mkv,.webm"
                multiple
                onChange={handleFilePick}
                className="hidden"
              />
            </div>

            {/* Queue List */}
            {items.length > 0 && (
              <div className="mt-4 space-y-2 max-h-96 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-[#0d0f10] p-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid size-8 place-items-center rounded-lg bg-secondary text-primary shrink-0">
                        <Video className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">{item.file.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                          {item.size && (
                            <span className="text-foreground font-medium">
                              {" "}→ {(item.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.status === "processing" && (
                        <span className="flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-[11px] font-medium text-primary">
                          <Clock className="size-3 animate-spin" />
                          Processando...
                        </span>
                      )}

                      {item.status === "done" && item.url && (
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="size-3" />
                            Pronto
                          </span>
                          <a
                            href={item.url}
                            download={item.outputName || "tiktok_safe.mp4"}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-sm"
                          >
                            <Download className="size-3.5" />
                            Baixar
                          </a>
                        </div>
                      )}

                      {item.status === "error" && (
                        <span className="rounded-full bg-destructive/10 border border-destructive/20 px-2 py-0.5 text-[10px] font-bold text-destructive">
                          {item.error || "Erro"}
                        </span>
                      )}

                      {item.status === "queued" && !processing && (
                        <button
                          onClick={() => removeVideo(item.id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="Remover da fila"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          {/* Current Processing Status */}
          {processing && (
            <Panel className="p-4 bg-[#14171a] border-primary/40">
              <div className="flex items-center justify-between text-xs font-semibold mb-2 text-white">
                <span className="flex items-center gap-2">
                  <Activity className="size-4 text-primary animate-pulse" />
                  {currentStatus || "Processando camuflagem..."}
                </span>
                <span className="text-primary font-mono">
                  {doneCount}/{items.length}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.round((doneCount / Math.max(1, items.length)) * 100)}%` }}
                />
              </div>
            </Panel>
          )}
        </div>

        {/* Right: TikTok Modes */}
        <div>
          <Panel className="bg-[#14171a] border-border divide-y divide-border">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-white">Modo TikTok</h2>
              <p className="mt-1 text-xs text-muted-foreground">Configuração de re-encode para TikTok:</p>
            </div>

            <div className="p-3 space-y-2">
              {TIKTOK_MODES.map((m) => (
                <label
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className={`flex cursor-pointer gap-3 p-3.5 rounded-xl transition-all ${
                    mode === m.key ? "bg-secondary/60 ring-1 ring-primary/40" : "hover:bg-secondary/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="tiktokMode"
                    checked={mode === m.key}
                    onChange={() => setMode(m.key)}
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="block text-xs font-bold text-white">{m.title}</span>
                      <span className="rounded bg-primary/10 px-1.5 py-0.2 text-[9px] font-semibold text-primary">
                        {m.badge}
                      </span>
                    </div>
                    <span className="mt-1 block text-[11px] text-muted-foreground leading-relaxed">
                      {m.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="p-4">
              <button
                disabled={processing || items.length === 0}
                onClick={handleProcessAll}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 disabled:opacity-50"
              >
                <Scissors className="size-4" />
                {processing
                  ? "Processando vídeos..."
                  : `Camuflar ${items.length > 0 ? `${items.length} vídeo(s)` : "para TikTok"}`}
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
