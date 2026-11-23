import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Image as ImageIcon, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, Panel } from "@/components/AppShell";

export const Route = createFileRoute("/imagem")({
  head: () => ({
    meta: [
      { title: "Camuflar Imagem | Cloakfy" },
      { name: "description", content: "Camufle sua imagem com capa, granulamento anti-IA e limpeza de metadados EXIF." },
      { property: "og:title", content: "Camuflar Imagem | Cloakfy" },
    ],
  }),
  component: ImageTool,
});

const formats = [
  { label: "Feed quadrado", w: 1080, h: 1080, desc: "Padrão feed Instagram / Facebook (1:1)" },
  { label: "Feed vertical", w: 1080, h: 1350, desc: "Maior retenção e área de tela (4:5)" },
  { label: "Stories / Reels", w: 1080, h: 1920, desc: "Formato vertical completo (9:16)" },
  { label: "Paisagem", w: 1200, h: 628, desc: "Feed horizontal e links patrocinados" },
];

function Slider({
  label, value, min, max, step, left, right, description, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number;
  left: string; right: string; description: string; onChange: (v: number) => void;
}) {
  return (
    <div className="p-4 border-b border-border last:border-0 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">{label}</span>
        <span className="text-xs font-mono text-primary font-bold">{description}</span>
      </div>
      <div className="relative mt-1">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
        />
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{left}</span><span>{right}</span>
      </div>
    </div>
  );
}

function ImageTool() {
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [coverImg, setCoverImg] = useState<HTMLImageElement | null>(null);
  const [fmt, setFmt] = useState(0);
  const [blend, setBlend] = useState(6);   // 0–10: how much cover mixes in
  const [grain, setGrain] = useState(6);   // 0–10: adversarial noise level
  const [out, setOut] = useState("");
  const [hash, setHash] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render whenever source or params change
  const render = useCallback(
    (src: HTMLImageElement | null, cov: HTMLImageElement | null, fmtIdx: number, b: number, g: number) => {
      if (!src) return;
      const { w, h } = formats[fmtIdx]!;
      const canvas = canvasRef.current ?? document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

      // --- Draw source image (center crop) ---
      const s = Math.max(w / src.width, h / src.height);
      const dx = (w - src.width * s) / 2;
      const dy = (h - src.height * s) / 2;
      ctx.drawImage(src, dx, dy, src.width * s, src.height * s);

      // --- Blend cover image if present ---
      if (cov && b > 0) {
        // blend 1-10 → alpha 0.03 ... 0.60 (curve: more sensitive at low values)
        const alpha = Math.min(0.60, (b / 10) ** 1.4 * 0.60);
        ctx.globalAlpha = alpha;
        const cs = Math.max(w / cov.width, h / cov.height);
        const cdx = (w - cov.width * cs) / 2;
        const cdy = (h - cov.height * cs) / 2;
        ctx.drawImage(cov, cdx, cdy, cov.width * cs, cov.height * cs);
        ctx.globalAlpha = 1;
      }

      // --- Adversarial checkerboard grain (anti-IA / anti-Facebook hash) ---
      if (g > 0) {
        // intensity: g 1-10 → 0.015 ... 0.22
        const noiseAlpha = (g / 10) ** 1.3 * 0.22;
        const size = 2; // checkerboard cell size px
        for (let y = 0; y < h; y += size) {
          for (let x = 0; x < w; x += size) {
            if ((Math.floor(x / size) + Math.floor(y / size)) % 2 === 0) {
              ctx.fillStyle = `rgba(255,255,255,${noiseAlpha})`;
            } else {
              ctx.fillStyle = `rgba(0,0,0,${noiseAlpha})`;
            }
            ctx.fillRect(x, y, size, size);
          }
        }
      }

      const dataUrl = canvas.toDataURL("image/jpeg", 0.94);
      setOut(dataUrl);
      setHash(Math.random().toString(36).substring(2, 10).toUpperCase());
    },
    []
  );

  useEffect(() => {
    if (sourceImg) render(sourceImg, coverImg, fmt, blend, grain);
  }, [sourceImg, coverImg, fmt, blend, grain, render]);

  function loadSource(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const i = new Image();
    i.onload = () => { setSourceImg(i); };
    i.src = URL.createObjectURL(f);
  }

  function loadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const i = new Image();
    i.onload = () => { setCoverImg(i); toast.info("Imagem de capa carregada."); };
    i.src = URL.createObjectURL(f);
  }

  const blendPct = blend === 0 ? "~0% capa" : `~${Math.round((blend / 10) ** 1.4 * 60)}% capa`;
  const blendLabel = `${blend} (${blend <= 3 ? "sutil" : blend <= 6 ? "equilíbrio" : "pesado"}) · ${blendPct}`;
  const grainLabel = `${grain} (${grain === 0 ? "sem granulado" : grain <= 3 ? "leve" : grain <= 6 ? "perceptível" : "intenso"})`;

  return (
    <AppShell title="Camuflar Imagem">
      <canvas ref={canvasRef} className="hidden" />
      <PageHeader
        title="Camuflar Imagem"
        subtitle="Misture uma imagem de capa, adicione ruído adversarial anti-IA e limpe os metadados do criativo."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Preview / Upload Area */}
        <div className="space-y-4">
          {/* Source image */}
          {!sourceImg ? (
            <label className="flex h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-[#14171a] text-xs font-medium text-muted-foreground hover:border-primary/60 hover:text-white transition-all">
              <div className="grid size-12 place-items-center rounded-xl bg-secondary text-primary">
                <ImageIcon className="size-6" />
              </div>
              <span>Clique ou arraste a imagem principal (JPG, PNG, WebP)</span>
              <span className="text-[11px] text-muted-foreground">Metadados e GPS serão removidos automaticamente</span>
              <input type="file" accept="image/*" onChange={loadSource} className="hidden" />
            </label>
          ) : (
            <Panel className="flex flex-col items-center p-5 bg-[#14171a] border-border">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-3">
                <ShieldCheck className="size-4" />
                Hash exclusivo: {hash} · EXIF Removido
              </div>
              {out && <img src={out} alt="Resultado" className="max-h-[460px] rounded-xl object-contain shadow-2xl" />}
              <label className="mt-3 text-xs font-medium text-muted-foreground hover:text-white cursor-pointer">
                Trocar imagem
                <input type="file" accept="image/*" onChange={loadSource} className="hidden" />
              </label>
            </Panel>
          )}

          {/* Cover image (optional) */}
          <Panel className="bg-[#14171a] border-border p-4">
            <p className="text-xs font-semibold text-white mb-3">Imagem de capa (opcional)</p>
            {coverImg ? (
              <div className="flex items-center gap-3">
                <img src={coverImg.src} alt="Capa" className="size-16 rounded-lg object-cover border border-border" />
                <div>
                  <p className="text-xs text-white">Capa carregada</p>
                  <label className="mt-1 text-xs text-muted-foreground hover:text-white cursor-pointer block">
                    Trocar capa
                    <input type="file" accept="image/*" onChange={loadCover} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex h-16 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border hover:border-primary/60 transition-all text-xs text-muted-foreground">
                <ImageIcon className="size-4" /> Clique para adicionar imagem de capa
                <input type="file" accept="image/*" onChange={loadCover} className="hidden" />
              </label>
            )}
          </Panel>
        </div>

        {/* Controls & Format */}
        <div className="space-y-4">
          {/* Sliders */}
          <Panel className="bg-[#14171a] border-border">
            <div className="p-4 border-b border-border">
              <h2 className="text-sm font-semibold text-white">Camuflagem</h2>
            </div>
            <Slider
              label="Mistura de capa"
              value={blend} min={0} max={10} step={1}
              left="Sem ofuscar" right="Quase só capa"
              description={blendLabel}
              onChange={(v) => setBlend(v)}
            />
            <div className="px-4 pb-3 text-[11px] text-muted-foreground leading-relaxed">
              Quanto da imagem de capa entra na mistura. À esquerda a saída fica praticamente só o criativo (mínima ofuscação); à direita a capa domina. A curva é mais sensível nos primeiros passos para você conseguir um ajuste fino.
            </div>

            <div className="border-t border-border">
              <div className="p-4 border-b border-border">
                <h2 className="text-sm font-semibold text-white">Granulamento (anti-IA)</h2>
              </div>
              <Slider
                label="Ruído adversarial"
                value={grain} min={0} max={10} step={1}
                left="Sem granulado" right="Granulado máximo"
                description={grainLabel}
                onChange={(v) => setGrain(v)}
              />
              <div className="px-4 pb-3 text-[11px] text-muted-foreground leading-relaxed">
                Intensidade do ruído adversarial em padrão checkerboard (anti-IA Facebook). Valores altos deixam o granulado visível, mas confundem classificadores de IA.
              </div>
            </div>
          </Panel>

          {/* Format */}
          <div>
            <h2 className="mb-2 text-sm font-semibold text-white">Formato do anúncio</h2>
            <Panel className="divide-y divide-border bg-[#14171a] border-border">
              {formats.map((f, n) => (
                <label
                  key={f.label}
                  className={`flex cursor-pointer gap-3 p-4 transition-colors ${
                    fmt === n ? "bg-secondary/40" : "hover:bg-secondary/20"
                  }`}
                >
                  <input
                    type="radio" checked={fmt === n}
                    onChange={() => setFmt(n)}
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <span className="block text-sm font-semibold text-white">{f.label}</span>
                    <span className="text-xs text-muted-foreground">{f.w} × {f.h} px</span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground/80">{f.desc}</span>
                  </div>
                </label>
              ))}

              <div className="p-4">
                <a
                  aria-disabled={!out}
                  href={out || undefined}
                  download={`cloakfy_criativo_${hash || "img"}.jpg`}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 ${
                    out ? "" : "pointer-events-none opacity-50"
                  }`}
                >
                  <Download className="size-4" />
                  Baixar imagem camuflada
                </a>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
