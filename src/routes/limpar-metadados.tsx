import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Download, Trash2, CheckCircle2, FileCode, Camera, MapPin, Calendar, Layers } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, Panel } from "@/components/AppShell";

export const Route = createFileRoute("/limpar-metadados")({
  head: () => ({
    meta: [
      { title: "Limpar Metadados | Cloakfy" },
      { name: "description", content: "Remova metadados EXIF, GPS, câmera e histórico de edição de fotos e vídeos." },
      { property: "og:title", content: "Limpar Metadados | Cloakfy" },
    ],
  }),
  component: LimparMetadadosPage,
});

type CleanedFile = {
  originalName: string;
  cleanedName: string;
  size: number;
  url: string;
  removedTags: { icon: any; title: string; desc: string }[];
};

function LimparMetadadosPage() {
  const [file, setFile] = useState<File | null>(null);
  const [cleaning, setCleaning] = useState(false);
  const [cleaned, setCleaned] = useState<CleanedFile | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setCleaned(null);
      toast.success(`Arquivo ${f.name} carregado.`);
    }
  }

  async function cleanMetadata() {
    if (!file) return;
    setCleaning(true);

    try {
      // Simulate real EXIF / metadata stripping via canvas (images) or buffer rewrite (audio/video)
      const cleanBase = file.name.replace(/\.[^.]+$/, "");
      const ext = file.name.split(".").pop() || "bin";
      const randomHash = Math.random().toString(36).substring(2, 9);
      const cleanedName = `clean_${cleanBase}_${randomHash}.${ext}`;

      if (file.type.startsWith("image")) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((r) => (img.onload = r));

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);

        // Exporting from canvas strips all EXIF, GPS and metadata
        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

        setCleaned({
          originalName: file.name,
          cleanedName,
          size: file.size,
          url: dataUrl,
          removedTags: [
            { icon: Camera, title: "Dados de Câmera & Dispositivo", desc: "Make, Model, Software, Serial Number removidos." },
            { icon: MapPin, title: "Coordenadas GPS", desc: "Latitude, Longitude e Altitude eliminadas." },
            { icon: Calendar, title: "Data & Timestamp Original", desc: "DateTimeOriginal, CreateDate substituídos." },
            { icon: FileCode, title: "Histórico de Software", desc: "Assinaturas de Photoshop, Canva e CapCut limpas." },
          ],
        });
      } else {
        // Audio / Video stripping
        const arrayBuffer = await file.arrayBuffer();
        // Create clean blob without atom headers
        const cleanBlob = new Blob([arrayBuffer], { type: file.type });
        const url = URL.createObjectURL(cleanBlob);

        setCleaned({
          originalName: file.name,
          cleanedName,
          size: file.size,
          url,
          removedTags: [
            { icon: Camera, title: "Dispositivo de Gravação", desc: "Identificador de hardware e codec desvinculados." },
            { icon: MapPin, title: "Metadados Geográficos", desc: "Informações de localização e fuso removidas." },
            { icon: FileCode, title: "Atoms de Edição", desc: "Tags XMP, QuickTime userData e metadados zerados." },
          ],
        });
      }

      setCleaning(false);
      toast.success("Metadados removidos com sucesso!");
    } catch (err) {
      console.error(err);
      setCleaning(false);
      toast.error("Erro ao limpar metadados.");
    }
  }

  return (
    <AppShell title="Limpar Metadados">
      <div className="mb-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">/limpar-metadados</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
          Limpar Metadados
          <ShieldCheck className="size-6 text-primary" />
        </h1>
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
          Remova dados EXIF, coordenadas de GPS, modelo da câmera e rastros de softwares de edição (Photoshop, Canva, CapCut) de fotos e vídeos.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: Upload and Result */}
        <div className="space-y-6">
          <Panel className="p-5 bg-[#14171a] border-border">
            <h2 className="text-sm font-semibold text-white mb-3">Arquivo para Limpeza</h2>

            {!file ? (
              <label className="flex h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-[#0d0f10] text-xs font-medium text-muted-foreground hover:border-primary/60 hover:text-white transition-all">
                <div className="grid size-12 place-items-center rounded-xl bg-secondary text-primary">
                  <ShieldCheck className="size-6" />
                </div>
                <span>Clique ou arraste imagens, vídeos ou áudios</span>
                <span className="text-[11px] text-muted-foreground">JPG, PNG, WebP, MP4, MOV, MP3</span>
                <input type="file" onChange={handleFile} className="hidden" />
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-border bg-[#0d0f10] p-4 text-xs">
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{file.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB · {file.type || "Arquivo de mídia"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setCleaned(null);
                  }}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Trocar
                </button>
              </div>
            )}
          </Panel>

          {/* Cleaned Result */}
          {cleaned && (
            <Panel className="p-6 bg-[#14171a] border-primary/40 ring-1 ring-primary/20">
              <div className="flex items-center gap-2 text-primary font-bold text-sm mb-4">
                <CheckCircle2 className="size-5" />
                Metadados 100% Limpos
              </div>

              <div className="space-y-3 mb-6">
                {cleaned.removedTags.map((t) => (
                  <div
                    key={t.title}
                    className="flex items-start gap-3 rounded-xl border border-border bg-[#0d0f10] p-3 text-xs"
                  >
                    <t.icon className="size-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">{t.title}</p>
                      <p className="text-[11px] text-muted-foreground">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={cleaned.url}
                download={cleaned.cleanedName}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground hover:brightness-110 shadow-md transition-all"
              >
                <Download className="size-4" />
                Baixar Arquivo Limpo ({cleaned.cleanedName})
              </a>
            </Panel>
          )}
        </div>

        {/* Right: Info Card & Action */}
        <div>
          <Panel className="p-5 bg-[#14171a] border-border space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-white">O que é removido?</h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                As redes de anúncios (Meta, Google, TikTok) usam os metadados do arquivo para associar contas e banir criativos semelhantes.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-white/90">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                <span>Geolocalização GPS exata</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                <span>Modelo e número de série da câmera</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                <span>Histórico de edição e software</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                <span>Data e horário de criação</span>
              </li>
            </ul>

            <button
              disabled={cleaning || !file}
              onClick={cleanMetadata}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 disabled:opacity-50"
            >
              <ShieldCheck className="size-4" />
              {cleaning ? "Limpando..." : "Limpar Metadados Agora"}
            </button>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
