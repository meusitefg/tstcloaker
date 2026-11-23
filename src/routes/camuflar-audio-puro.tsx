import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import {
  Music,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Volume2,
  Sparkles,
  Archive,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";
import { AppShell, Panel } from "@/components/AppShell";
import { camuflarAudioPuro, AudioPuroMode } from "@/lib/ffmpeg";

export const Route = createFileRoute("/camuflar-audio-puro")({
  head: () => ({
    meta: [
      { title: "Camuflar Áudio | Cloakfy" },
      { name: "description", content: "Camufle áudios com alteração de pitch, injeção de ruído imperceptível e novo hash para Meta e TikTok." },
      { property: "og:title", content: "Camuflar Áudio | Cloakfy" },
    ],
  }),
  component: CamuflarAudioPage,
});

const MODES = [
  {
    key: "basic" as AudioPuroMode,
    label: "Básico",
    desc: "Recodificação leve do áudio com alteração de bitrate e metadados. Rápido e eficaz para a maioria dos casos.",
  },
  {
    key: "aggressive" as AudioPuroMode,
    label: "Agressivo",
    desc: "Máxima camuflagem: alteração de pitch, ruído de fundo imperceptível (-50dB), inversão de fase parcial e recodificação completa.",
  },
];

interface AudioItem {
  id: string;
  file: File;
  status: "queued" | "processing" | "done" | "error";
  url?: string;
  outputName?: string;
  size?: number;
  blob?: Blob;
  error?: string;
}

const MAX_FILES = 20;

function CamuflarAudioPage() {
  const [items, setItems] = useState<AudioItem[]>([]);
  const [mode, setMode] = useState<AudioPuroMode>("basic");
  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: File[]) => {
    const valid = files.filter(
      (f) =>
        f.type.startsWith("audio/") ||
        f.type.startsWith("video/") ||
        /\.(mp3|wav|ogg|m4a|aac|mp4|mov|webm)$/i.test(f.name)
    );

    if (!valid.length) {
      toast.error("Por favor, selecione arquivos de áudio válidos (MP3, WAV, AAC, M4A, OGG) ou vídeos.");
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
      if (combined.length > MAX_FILES) {
        toast.error(`Máximo de ${MAX_FILES} arquivos permitidos por lote.`);
        return combined.slice(0, MAX_FILES);
      }
      return combined;
    });

    toast.success(`${valid.length} arquivo(s) adicionado(s) à fila.`);
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
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

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function clearAll() {
    setItems([]);
  }

  async function handleCamouflage() {
    const pending = items.filter((it) => it.status !== "done");
    if (!pending.length) {
      toast.error("Adicione ao menos um arquivo de áudio.");
      return;
    }

    setProcessing(true);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item || item.status === "done") continue;

      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: "processing" } : it))
      );
      setStatusText(`Processando ${i + 1}/${items.length}: ${item.file.name}`);

      try {
        const result = await camuflarAudioPuro(item.file, mode, (s) => {
          setStatusText(`[${i + 1}/${items.length}] ${s}`);
        });

        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  status: "done",
                  url: result.url,
                  outputName: result.outputName,
                  size: result.size,
                  blob: result.blob,
                }
              : it
          )
        );
      } catch (err: any) {
        console.error("Erro no camuflador de áudio:", err);
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? { ...it, status: "error", error: err?.message || "Falha na conversão" }
              : it
          )
        );
      }
    }

    setProcessing(false);
    setStatusText("");
    toast.success("Todos os áudios foram camuflados com sucesso!");
  }

  async function downloadZip() {
    const doneItems = items.filter((i) => i.blob && i.outputName);
    if (!doneItems.length) return;

    const zip = new JSZip();
    doneItems.forEach((it) => {
      zip.file(it.outputName!, it.blob!);
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

  return (
    <AppShell title="Camuflar Áudio">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">/camuflar-audio-puro</p>
            <span className="rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary">
              METADADOS & PITCH
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Camuflar Áudio
            <Volume2 className="size-6 text-primary fill-primary/20" />
          </h1>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            Altere a impressão digital do áudio de criativos com recodificação de frequência, inversão sutil de fase e novo hash contra bloqueios de direitos autorais e criativo duplicado.
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
        {/* Left: File Queue */}
        <div className="space-y-4">
          <Panel className="p-5 bg-[#14171a] border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">
                Arquivos ({items.length}/{MAX_FILES})
              </span>
              {items.length > 0 && !processing && (
                <button
                  onClick={clearAll}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Limpar lista
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
                <Music className="size-5" />
              </div>
              <p className="text-xs font-semibold text-white">
                Clique ou arraste arquivos de áudio ou vídeo
              </p>
              <p className="text-[11px] text-muted-foreground">
                MP3, WAV, AAC, M4A, OGG ou MP4 · Até {MAX_FILES} arquivos por lote
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* File List */}
            {items.length > 0 && (
              <div className="mt-4 space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-[#0d0f10] p-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Music className="size-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">{item.file.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">
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
                          <Clock className="size-3 animate-spin" /> Processando...
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
                            download={item.outputName || "audio_camuflado.mp3"}
                            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-sm"
                          >
                            <Download className="size-3.5" /> Baixar
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
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          title="Remover"
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

          {/* Processing Bar */}
          {processing && (
            <Panel className="p-4 bg-[#14171a] border-primary/40">
              <div className="flex items-center justify-between text-xs font-semibold mb-2 text-white">
                <span className="flex items-center gap-2">
                  <Activity className="size-4 text-primary animate-pulse" />
                  {statusText || "Processando áudio..."}
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

        {/* Right: Mode Options */}
        <div>
          <Panel className="bg-[#14171a] border-border divide-y divide-border">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-white">Modo de Camuflagem</h2>
              <p className="mt-1 text-xs text-muted-foreground">Selecione o nível de alteração:</p>
            </div>

            <div className="p-3 space-y-2">
              {MODES.map((m) => (
                <label
                  key={m.key}
                  onClick={() => !processing && setMode(m.key)}
                  className={`flex cursor-pointer gap-3 p-3.5 rounded-xl transition-all ${
                    mode === m.key ? "bg-secondary/60 ring-1 ring-primary/40" : "hover:bg-secondary/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="audioMode"
                    disabled={processing}
                    checked={mode === m.key}
                    onChange={() => setMode(m.key)}
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <span className="block text-xs font-bold text-white">{m.label}</span>
                    <span className="mt-1 block text-[11px] text-muted-foreground leading-relaxed">
                      {m.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="p-4">
              <button
                onClick={handleCamouflage}
                disabled={processing || items.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 disabled:opacity-50"
              >
                <Sparkles className="size-4" />
                {processing ? "Processando áudios..." : `Camuflar ${items.length || 1} Áudio(s)`}
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
