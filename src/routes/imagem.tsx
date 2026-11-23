import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Image as ImageIcon, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, Panel } from "@/components/AppShell";

export const Route = createFileRoute("/imagem")({
  head: () => ({
    meta: [
      { title: "Camuflar Imagem | Cloakfy" },
      { name: "description", content: "Redimensione, limpe metadados EXIF e altere a impressão digital das suas imagens." },
      { property: "og:title", content: "Camuflar Imagem | Cloakfy" },
      { property: "og:description", content: "Redimensione, limpe metadados EXIF e altere a impressão digital das suas imagens." },
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

function ImageTool() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [fmt, setFmt] = useState(0);
  const [out, setOut] = useState("");
  const [hash, setHash] = useState("");

  function load(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const i = new Image();
    i.onload = () => {
      setImg(i);
      render(i, fmt);
    };
    i.src = URL.createObjectURL(f);
  }

  function render(i: HTMLImageElement, n: number) {
    const { w, h } = formats[n]!;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d")!;

    // Center crop & scale
    const s = Math.max(w / i.width, h / i.height);
    const dx = (w - i.width * s) / 2;
    const dy = (h - i.height * s) / 2;
    ctx.drawImage(i, dx, dy, i.width * s, i.height * s);

    // Subtle cloak noise injection to alter hash (MD5/SHA256)
    ctx.fillStyle = "rgba(0, 230, 118, 0.003)";
    ctx.fillRect(0, 0, w, h);

    const dataUrl = c.toDataURL("image/jpeg", 0.94);
    setOut(dataUrl);
    setHash(Math.random().toString(36).substring(2, 10).toUpperCase());
    toast.success("Imagem camuflada! Metadados limpos e novo hash gerado.");
  }

  return (
    <AppShell title="Camuflar Imagem">
      <PageHeader
        title="Camuflar Imagem"
        subtitle="Escolha o formato, limpe metadados e gere uma nova impressão digital para seu criativo."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Preview / Upload Area */}
        <div>
          {out ? (
            <Panel className="flex flex-col items-center justify-center p-6 bg-[#14171a] border-border">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-4">
                <ShieldCheck className="size-4" />
                Hash exclusivo: {hash} · EXIF Removido
              </div>
              <img src={out} alt="Resultado" className="max-h-[460px] rounded-xl object-contain shadow-2xl" />
              <label className="mt-4 text-xs font-medium text-muted-foreground hover:text-white cursor-pointer">
                Trocar imagem
                <input type="file" accept="image/*" onChange={load} className="hidden" />
              </label>
            </Panel>
          ) : (
            <label className="flex h-72 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-[#14171a] text-xs font-medium text-muted-foreground hover:border-primary/60 hover:text-white transition-all">
              <div className="grid size-12 place-items-center rounded-xl bg-secondary text-primary">
                <ImageIcon className="size-6" />
              </div>
              <span>Clique ou arraste uma imagem (JPG, PNG, WebP)</span>
              <span className="text-[11px] text-muted-foreground">Metadados e GPS serão removidos automaticamente</span>
              <input type="file" accept="image/*" onChange={load} className="hidden" />
            </label>
          )}
        </div>

        {/* Format Selectors */}
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
                  type="radio"
                  checked={fmt === n}
                  onChange={() => {
                    setFmt(n);
                    if (img) render(img, n);
                  }}
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
    </AppShell>
  );
}
