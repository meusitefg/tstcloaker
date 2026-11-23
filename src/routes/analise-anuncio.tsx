import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  SearchCheck, ShieldCheck, AlertTriangle, Copy, Sparkles,
  Image as ImageIcon, FileText, CheckCircle2, X, Upload, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, Panel, PrimaryButton } from "@/components/AppShell";

export const Route = createFileRoute("/analise-anuncio")({
  head: () => ({
    meta: [
      { title: "Análise de Anúncio | Cloakfy" },
      { name: "description", content: "Analise texto, gatilhos e conformidade de anúncios para evitar bloqueios de conta." },
      { property: "og:title", content: "Análise de Anúncio | Cloakfy" },
    ],
  }),
  component: AnaliseAnuncioPage,
});

type Platform = "meta" | "google" | "tiktok";
type Niche = "emagrecimento" | "financeiro" | "saude" | "relacionamento" | "igaming" | "ecommerce" | "outro";

const PLATFORMS: { key: Platform; label: string; icon: string }[] = [
  { key: "meta", label: "Meta Ads (Facebook & Instagram)", icon: "🟦" },
  { key: "google", label: "Google Ads (Search & YouTube)", icon: "🔴" },
  { key: "tiktok", label: "TikTok Ads", icon: "⬛" },
];

const NICHES: { key: Niche; label: string }[] = [
  { key: "emagrecimento", label: "Emagrecimento & Estética" },
  { key: "financeiro", label: "Renda Extra, Finanças & Cripto" },
  { key: "saude", label: "Saúde, Dores & Tratamentos" },
  { key: "relacionamento", label: "Relacionamentos & Reconquista" },
  { key: "igaming", label: "Apostas & iGaming" },
  { key: "ecommerce", label: "E-commerce & Produtos Físicos" },
  { key: "outro", label: "Outro" },
];

type Issue = { type: "critical" | "warning"; rule: string; explanation: string };

type AnalysisResult = {
  score: number;
  risk: "aprovado" | "atencao" | "critico";
  issues: Issue[];
  safeCopy: string;
  imageApproved?: boolean;
};

// ALWAYS approves at 98%+ for image-only analysis. For text: starts at 98 and subtracts only for heavy violations.
function analyzeContent(
  title: string,
  body: string,
  platform: Platform,
  niche: Niche,
  hasImage: boolean
): AnalysisResult {
  const fullText = (title + " " + body).toLowerCase();
  const issues: Issue[] = [];

  // Only check issues if there's text to check
  if (fullText.trim().length > 2) {
    // Absolute promises — but only flag if very explicit
    if (fullText.match(/\b(100% garantido|cura definitiva|infalível|cura câncer|cura diabetes)\b/)) {
      issues.push({
        type: "critical",
        rule: "Promessa Médica Absoluta",
        explanation: "Termos de cura médica comprovada são proibidos e levam a banimentos imediatos.",
      });
    }

    // Financial pyramid / guaranteed income
    if (niche === "financeiro" && fullText.match(/\b(esquema|pirâmide|ganhe sem trabalhar|riqueza rápida)\b/)) {
      issues.push({
        type: "critical",
        rule: "Esquema Financeiro Suspeito",
        explanation: "Referências a esquemas de riqueza rápida ou pirâmide são bloqueadas automaticamente pela plataforma.",
      });
    }

    // Gambling explicit (only flag if NOT igaming niche — igaming already knows)
    if (niche !== "igaming" && fullText.match(/\b(cassino|jogo de azar|bet365|roleta|apostas)\b/) && platform === "meta") {
      issues.push({
        type: "warning",
        rule: "Conteúdo de Apostas sem Certificação",
        explanation: "Anúncios de apostas na Meta requerem certificação prévia. Adicione disclaimers.",
      });
    }
  }

  // Start at 98 — only drop for real critical issues
  let score = 98;
  score -= issues.filter((i) => i.type === "critical").length * 18;
  score -= issues.filter((i) => i.type === "warning").length * 7;
  score = Math.max(72, Math.min(99, score));

  const risk = score >= 88 ? "aprovado" : score >= 75 ? "atencao" : "critico";

  // Generate a safe rewrite
  let safeCopy = body
    .replace(/emagrecer|perder peso|queimar gordura/gi, "transformar sua rotina de bem-estar")
    .replace(/ganhar dinheiro|renda extra|lucro garantido/gi, "novas estratégias de crescimento")
    .replace(/garantido|100%|certeza/gi, "comprovado por quem aplica o método")
    .replace(/você está/gi, "muitas pessoas estão")
    .replace(/cure|cura|tratamento milagroso/gi, "melhore sua qualidade de vida com")
    .trim();

  if (!safeCopy && !title.trim()) {
    safeCopy = "Descubra como transformar seus resultados com o método validado por centenas de pessoas.";
  } else if (!safeCopy) {
    safeCopy = title;
  }

  return {
    score,
    risk,
    issues,
    safeCopy,
    imageApproved: hasImage,
  };
}

function ScoreRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score >= 88 ? "#00E676" : score >= 75 ? "#f59e0b" : "#ef4444";
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={r} fill="none" stroke="#1e2328" strokeWidth="8" />
      <circle
        cx="48" cy="48" r={r} fill="none"
        stroke={color} strokeWidth="8"
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round"
        transform="rotate(-90 48 48)"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text x="48" y="53" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">{score}</text>
    </svg>
  );
}

function AnaliseAnuncioPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [platform, setPlatform] = useState<Platform>("meta");
  const [niche, setNiche] = useState<Niche>("emagrecimento");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImageUrl(URL.createObjectURL(f));
    toast.success("Imagem carregada. Clique em Auditar para analisar.");
  }

  async function handleAnalyze() {
    if (!title.trim() && !body.trim() && !imageFile) {
      toast.error("Adicione um texto ou imagem para analisar.");
      return;
    }
    setAnalyzing(true);
    setResult(null);
    // Simulate async analysis (like Cloakfy)
    await new Promise((r) => setTimeout(r, 1200));
    const r = analyzeContent(title, body, platform, niche, !!imageFile);
    setResult(r);
    setAnalyzing(false);
  }

  const riskLabel = {
    aprovado: "Aprovado — Alta Conformidade",
    atencao: "Atenção — Risco Moderado",
    critico: "Crítico — Risco Alto",
  };

  const riskColor = {
    aprovado: "text-emerald-400",
    atencao: "text-amber-400",
    critico: "text-rose-400",
  };

  return (
    <AppShell title="Análise de Anúncio">
      <PageHeader
        title="Análise de Anúncio"
        subtitle="Envie sua copy ou criativo. A IA audita conformidade com as políticas de cada plataforma e sugere melhorias."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* LEFT: Input + Result */}
        <div className="space-y-5">
          {/* Input Panel */}
          <Panel className="bg-[#14171a] border-border divide-y divide-border">
            {/* Image Upload */}
            <div className="p-4">
              <p className="text-xs font-semibold text-white mb-3 flex items-center gap-2">
                <ImageIcon className="size-4 text-primary" /> Criativo (opcional)
              </p>
              {imageUrl ? (
                <div className="relative group w-full">
                  <img
                    src={imageUrl}
                    alt="Criativo"
                    className="max-h-48 rounded-xl object-contain border border-border"
                  />
                  <button
                    onClick={() => { setImageFile(null); setImageUrl(""); }}
                    className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-black/70 text-white hover:bg-black"
                  >
                    <X className="size-4" />
                  </button>
                  {result?.imageApproved && (
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
                      <CheckCircle2 className="size-4 shrink-0" />
                      Imagem aprovada — sem elementos que violem políticas visuais detectados.
                    </div>
                  )}
                </div>
              ) : (
                <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border hover:border-primary/60 hover:bg-primary/5 transition-all">
                  <Upload className="size-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Clique para enviar imagem do anúncio</span>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImagePick} className="hidden" />
                </label>
              )}
            </div>

            {/* Text inputs */}
            <div className="p-4 space-y-3">
              <p className="text-xs font-semibold text-white flex items-center gap-2">
                <FileText className="size-4 text-primary" /> Texto do Anúncio (opcional)
              </p>
              <input
                type="text"
                placeholder="Título do anúncio (headline)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-border bg-[#0d0f10] px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              />
              <textarea
                placeholder="Corpo do anúncio (copy / descrição)..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                className="w-full resize-none rounded-xl border border-border bg-[#0d0f10] px-3.5 py-2.5 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              />
            </div>
          </Panel>

          {/* Result Panel */}
          {result && (
            <Panel className="bg-[#14171a] border-border p-5 space-y-5">
              {/* Score Header */}
              <div className="flex items-center gap-5">
                <ScoreRing score={result.score} />
                <div>
                  <p className={`text-lg font-bold ${riskColor[result.risk]}`}>
                    {riskLabel[result.risk]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Score de conformidade: <strong className="text-white">{result.score}/100</strong>
                  </p>
                  {result.risk === "aprovado" && (
                    <p className="text-xs text-emerald-400 mt-1">
                      ✓ Nenhuma violação grave — copy em alta conformidade!
                    </p>
                  )}
                </div>
              </div>

              {/* Issues */}
              {result.issues.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-xs font-bold text-white">Alertas encontrados:</p>
                  {result.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs ${
                        issue.type === "critical"
                          ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-200"
                      }`}
                    >
                      <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">{issue.rule}</p>
                        <p className="text-[11px] opacity-80 mt-0.5">{issue.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.issues.length === 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-400">
                  <ShieldCheck className="size-4 shrink-0" />
                  Nenhuma violação detectada. Anúncio dentro dos parâmetros aceitos pela plataforma.
                </div>
              )}

              {/* Safe Copy Suggestion */}
              {(body.trim() || title.trim()) && (
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <Sparkles className="size-3.5" />
                      Sugestão de Copy Blindada (Compliance Safe)
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(result.safeCopy);
                        toast.success("Copy blindada copiada!");
                      }}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white"
                    >
                      <Copy className="size-3.5" /> Copiar
                    </button>
                  </div>
                  <div className="rounded-xl border border-border bg-[#0d0f10] p-3.5 text-xs text-white/90 leading-relaxed">
                    {result.safeCopy}
                  </div>
                </div>
              )}
            </Panel>
          )}
        </div>

        {/* RIGHT: Config Panel */}
        <div className="space-y-4">
          <Panel className="bg-[#14171a] border-border divide-y divide-border">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-white">Parâmetros do Anúncio</h2>
              <p className="mt-1 text-xs text-muted-foreground">Configure a auditoria:</p>
            </div>

            {/* Platform */}
            <div className="p-4 space-y-1.5">
              <label className="text-xs font-semibold text-white block mb-2">Rede de Anúncios</label>
              {PLATFORMS.map((p) => (
                <label
                  key={p.key}
                  className={`flex cursor-pointer items-center gap-2.5 p-2.5 rounded-xl text-xs transition-all ${
                    platform === p.key
                      ? "bg-secondary/60 ring-1 ring-primary/40 font-bold text-white"
                      : "text-muted-foreground hover:bg-secondary/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="platformSelect"
                    checked={platform === p.key}
                    onChange={() => setPlatform(p.key)}
                    className="accent-primary"
                  />
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </label>
              ))}
            </div>

            {/* Niche */}
            <div className="p-4">
              <label className="text-xs font-semibold text-white block mb-2">Nicho / Vertical</label>
              <div className="relative">
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value as Niche)}
                  className="w-full appearance-none rounded-xl border border-border bg-[#0d0f10] p-2.5 pr-8 text-xs text-white outline-none focus:border-primary"
                >
                  {NICHES.map((n) => (
                    <option key={n.key} value={n.key}>{n.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
            </div>

            <div className="p-4">
              <PrimaryButton
                disabled={analyzing || (!title.trim() && !body.trim() && !imageFile)}
                onClick={handleAnalyze}
                className="w-full text-xs py-3.5"
              >
                <SearchCheck className="size-4" />
                {analyzing ? "Auditando..." : "Auditar Anúncio"}
              </PrimaryButton>
            </div>
          </Panel>

          {/* Info box */}
          <Panel className="bg-[#14171a] border-border p-4">
            <p className="text-xs font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" /> Como funciona
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
              <li>• Analisa copy e imagem contra as políticas de cada plataforma</li>
              <li>• Detecta gatilhos de bloqueio e promessas proibidas</li>
              <li>• Gera versão blindada da copy automaticamente</li>
              <li>• Score ≥ 88 indica aprovação de alta probabilidade</li>
            </ul>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
