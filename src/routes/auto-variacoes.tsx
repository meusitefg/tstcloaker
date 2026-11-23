import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import {
  Flame,
  Download,
  Sparkles,
  Layers,
  Video,
  CheckCircle2,
  Archive,
  Clock,
  Activity,
  Trash2,
  Sliders,
  Feather,
} from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";
import { AppShell, Panel } from "@/components/AppShell";
import {
  processAutoVariacoes,
  AutoVarLevel,
  VariationConfig,
  formatVariationDesc,
} from "@/lib/ffmpeg";

export const Route = createFileRoute("/auto-variacoes")({
  head: () => ({
    meta: [
      { title: "Auto-Variações | Cloakfy" },
      { name: "description", content: "Gere múltiplas variações 100% únicas do mesmo criativo para testes A/B e escala sem duplicação." },
      { property: "og:title", content: "Auto-Variações | Cloakfy" },
    ],
  }),
  component: AutoVariacoesPage,
});

interface VariationResultItem {
  index: number;
  config: VariationConfig;
  blob: Blob;
  size: number;
  url: string;
  label: string;
}

const VAR_COUNTS = [3, 5, 7, 10];

const MODES = [
  {
    key: "subtle" as AutoVarLevel,
    title: "Sutil, imperceptível a olho nu (recomendado)",
    desc: "Diferenças mínimas. Visualmente idênticos, mas hash, fps, brilho e crop 100% únicos.",
  },
  {
    key: "moderate" as AutoVarLevel,
    title: "Moderado, diferenças leves visíveis",
    desc: "Variações um pouco mais perceptíveis. Maior distância de fingerprint entre os arquivos.",
  },
  {
    key: "strong" as AutoVarLevel,
    title: "Forte, diferenças claras entre variações",
    desc: "Variações visíveis. Máxima diferença algorítmica entre cada arquivo gerado.",
  },
];

const MAX_FILE_SIZE_MB = 100;

function AutoVariacoesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [count, setCount] = useState<number>(5);
  const [mode, setMode] = useState<AutoVarLevel>("subtle");
  const [processing, setProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [doneCount, setDoneCount] = useState(0);
  const [results, setResults] = useState<VariationResultItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = useCallback((selectedFile: File) => {
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      handleSelectFile(f);
      e.target.value = "";
    }
  }

  function handleDrop(e: React.DragEvent) {
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
      const generated = await processAutoVariacoes(
        file,
        count,
        mode,
        (done, total, msg) => {
          setDoneCount(done);
          setStatusMsg(msg);
        },
        (newItem) => {
          setResults((prev) => [...prev, newItem]);
        }
      );

      setResults(generated);
      setDoneCount(count);
      setStatusMsg("Concluído!");
      toast.success(`${generated.length} variações únicas geradas com sucesso!`);
    } catch (err: any) {
      console.error("Erro nas auto-variações:", err);
      toast.error(err?.message || "Falha ao gerar variações.");
    } finally {
      setProcessing(false);
    }
  }

  async function downloadAllZip() {
    if (!results.length) return;
    const zip = new JSZip();
    results.forEach((r) => {
      zip.file(r.label, r.blob);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    const base = file?.name.replace(/\.[^.]+$/, "") || "variacoes";
    a.download = `${base}_${results.length}_variacoes.zip`;
    a.click();
    toast.success("Download do ZIP iniciado!");
  }

  function downloadSingle(item: VariationResultItem) {
    const a = document.createElement("a");
    a.href = item.url;
    a.download = item.label;
    a.click();
  }

  const progressPercent = count > 0 ? Math.round((doneCount / count) * 100) : 0;

  return (
    <AppShell title="Auto-Variações">
      {/* Top Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">/auto-variacoes</p>
            <span className="rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold text-primary">
              LIBERADO
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Auto-Variações
            <Flame className="size-6 text-primary fill-primary/20" />
          </h1>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            Gere múltiplas variações 100% únicas do mesmo criativo para testes A/B e escala sem duplicação no Meta, Google e TikTok Ads.
          </p>
        </div>

        {results.length > 1 && (
          <button
            onClick={downloadAllZip}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-md transition-all"
          >
            <Archive className="size-4" />
            Baixar Todas em ZIP ({results.length})
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left Column: Upload and Results */}
        <div className="space-y-6">
          {/* Base Video Selector */}
          <Panel className="p-5 bg-[#14171a] border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">Criativo Base (Vídeo)</h2>
              {file && !processing && (
                <button
                  onClick={() => {
                    setFile(null);
                    setResults([]);
                  }}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Trocar vídeo
                </button>
              )}
            </div>

            {!file ? (
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
                  Clique ou arraste seu vídeo base
                </p>
                <p className="text-[11px] text-muted-foreground">
                  MP4, MOV, WebM, AVI · Máximo de {MAX_FILE_SIZE_MB}MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,.mp4,.mov,.avi,.mkv,.webm"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-[#0d0f10] p-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid size-9 place-items-center rounded-lg bg-secondary text-primary shrink-0">
                    <Video className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{file.name}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {!processing && (
                  <button
                    onClick={() => {
                      setFile(null);
                      setResults([]);
                    }}
                    className="p-1 text-muted-foreground hover:text-destructive"
                    title="Remover vídeo"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            )}

            {/* Live Progress Bar */}
            {processing && (
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span className="flex items-center gap-2 text-primary">
                    <Activity className="size-4 animate-pulse" />
                    {statusMsg}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {doneCount}/{count} ({progressPercent}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </Panel>

          {/* Generated Variations List */}
          {results.length > 0 && (
            <Panel className="p-5 bg-[#14171a] border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  <h3 className="text-sm font-bold text-white">
                    {results.length} Variações Geradas
                  </h3>
                </div>
                {results.length > 1 && (
                  <button
                    onClick={downloadAllZip}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent transition-all"
                  >
                    <Archive className="size-3.5" /> Baixar Todas (ZIP)
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {results.map((item) => (
                  <div
                    key={item.index}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-[#0d0f10] p-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-white">
                        Variação #{item.index + 1}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground font-mono truncate" title={formatVariationDesc(item.config)}>
                        {formatVariationDesc(item.config)} · {(item.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>

                    <button
                      onClick={() => downloadSingle(item)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-sm shrink-0"
                    >
                      <Download className="size-3.5" />
                      Baixar
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-muted-foreground/80 leading-relaxed border-t border-border/60 pt-3">
                Cada variação possui alteração sutil de brilho, contraste, micro-crop, framerate fracionário e deslocamento de pitch/áudio para quebrar o fingerprinting algorítmico.
              </p>
            </Panel>
          )}
        </div>

        {/* Right Column: Controls */}
        <div className="space-y-4">
          <Panel className="bg-[#14171a] border-border divide-y divide-border">
            {/* Number of Variations */}
            <div className="p-4">
              <h2 className="text-sm font-semibold text-white mb-2">Quantas variações?</h2>
              <div className="grid grid-cols-4 gap-2">
                {VAR_COUNTS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    disabled={processing}
                    onClick={() => setCount(n)}
                    className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                      count === n
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border bg-[#0d0f10] text-muted-foreground hover:text-white"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Level of Variation */}
            <div className="p-4">
              <h2 className="text-sm font-semibold text-white mb-1">Nível de alteração</h2>
              <p className="text-xs text-muted-foreground mb-3">Distância algorítmica entre cada criativo:</p>

              <div className="space-y-2">
                {MODES.map((m) => (
                  <label
                    key={m.key}
                    onClick={() => !processing && setMode(m.key)}
                    className={`flex cursor-pointer gap-3 p-3 rounded-xl transition-all ${
                      mode === m.key ? "bg-secondary/60 ring-1 ring-primary/40" : "hover:bg-secondary/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="autoVarMode"
                      disabled={processing}
                      checked={mode === m.key}
                      onChange={() => setMode(m.key)}
                      className="mt-1 accent-primary"
                    />
                    <div>
                      <span className="block text-xs font-bold text-white">{m.title}</span>
                      <span className="mt-0.5 block text-[11px] text-muted-foreground leading-relaxed">
                        {m.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="p-4">
              <button
                disabled={processing || !file}
                onClick={handleGenerate}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 disabled:opacity-50"
              >
                <Layers className="size-4" />
                {processing ? `Processando ${doneCount}/${count}...` : `Gerar ${count} Variações`}
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
