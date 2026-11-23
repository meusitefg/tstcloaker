import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SearchCheck, ShieldAlert, CheckCircle2, AlertTriangle, Copy, Sparkles, Wand2 } from "lucide-react";
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
type Niche = "emagrecimento" | "financeiro" | "saude" | "relacionamento" | "igaming" | "ecommerce";

const PLATFORMS: { key: Platform; label: string }[] = [
  { key: "meta", label: "Meta Ads (Facebook & Instagram)" },
  { key: "google", label: "Google Ads (Search & YouTube)" },
  { key: "tiktok", label: "TikTok Ads" },
];

const NICHES: { key: Niche; label: string }[] = [
  { key: "emagrecimento", label: "Emagrecimento & Estética" },
  { key: "financeiro", label: "Renda Extra, Finanças & Cripto" },
  { key: "saude", label: "Saúde, Dores & Tratamentos" },
  { key: "relacionamento", label: "Relacionamentos & Reconquista" },
  { key: "igaming", label: "Apostas & iGaming" },
  { key: "ecommerce", label: "E-commerce & Produtos Físicos" },
];

type AnalysisResult = {
  score: number;
  risk: "baixo" | "medio" | "critico";
  issues: { type: "critical" | "warning"; rule: string; explanation: string }[];
  safeCopy: string;
};

function analyzeCopy(title: string, body: string, platform: Platform, niche: Niche): AnalysisResult {
  const fullText = (title + " " + body).toLowerCase();
  const issues: { type: "critical" | "warning"; rule: string; explanation: string }[] = [];

  // Check absolute promises
  if (fullText.match(/(garantido|certeza|100%|definitivo|infalível|cura)/)) {
    issues.push({
      type: "critical",
      rule: "Promessa Absoluta ou Não Comprovável",
      explanation: "Plataformas banem termos que garantem resultados sem comprovação científica ou probabilidade estatística.",
    });
  }

  // Check personal attributes
  if (fullText.match(/(você está|sua barriga|seu peso|está falido|sua dívida|seu casamento)/)) {
    issues.push({
      type: "critical",
      rule: "Atributos Pessoais Diretos",
      explanation: "O algoritmo proíbe apontar falhas ou características corporais/financeiras diretas do usuário na copy.",
    });
  }

  // Check time-bound promises
  if (fullText.match(/(\d+\s*(dias|semanas|horas)|em menos de)/)) {
    issues.push({
      type: "warning",
      rule: "Promessa com Prazo Estrito",
      explanation: "Prazos fixos para resultados (ex: 'em 7 dias') ativam alertas de revisão manual nos moderadores.",
    });
  }

  // Niche-specific checks
  if (niche === "emagrecimento" && fullText.match(/(perder peso|queimar gordura|secar)/)) {
    issues.push({
      type: "warning",
      rule: "Sensibilidade de Política de Saúde",
      explanation: "Use termos neutros como 'rotina equilibrada' ou 'método de autocuidado' em vez de emagrecimento explícito.",
    });
  }

  if (niche === "financeiro" && fullText.match(/(renda extra|dinheiro rápido|ganhar dinheiro|lucro)/)) {
    issues.push({
      type: "critical",
      rule: "Promessa de Oportunidade Financeira Irreal",
      explanation: "Termos explícitos de ganho de dinheiro levam a bloqueios imediatos da BM no Facebook.",
    });
  }

  let score = 100 - issues.filter((i) => i.type === "critical").length * 35 - issues.filter((i) => i.type === "warning").length * 15;
  score = Math.max(15, Math.min(98, score));

  const risk = score >= 80 ? "baixo" : score >= 50 ? "medio" : "critico";

  // Generate safe shielded rewrite
  let safeCopy = body
    .replace(/emagrecer|perder peso|queimar gordura/gi, "transformar sua rotina de bem-estar")
    .replace(/ganhar dinheiro|renda extra|lucro garantido/gi, "novas estratégias de crescimento")
    .replace(/garantido|100%|certeza/gi, "comprovado por quem aplica o método")
    .replace(/você está/gi, "muitas pessoas estão");

  if (!safeCopy) {
    safeCopy = "Descubra como estruturar sua jornada de forma prática com o método validado por centenas de pessoas.";
  }

  return { score, risk, issues, safeCopy };
}

function AnaliseAnuncioPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [platform, setPlatform] = useState<Platform>("meta");
  const [niche, setNiche] = useState<Niche>("emagrecimento");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  function handleAnalyze() {
    if (!title.trim() && !body.trim()) {
      toast.error("Informe o título ou a copy do anúncio.");
      return;
    }

    setAnalyzing(true);
    setTimeout(() => {
      const res = analyzeCopy(title, body, platform, niche);
      setResult(res);
      setAnalyzing(false);
      toast.success("Análise de conformidade concluída!");
    }, 400);
  }

  return (
    <AppShell title="Análise de Anúncio">
      <div className="mb-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">/analise-anuncio</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
          Análise de Anúncio
          <SearchCheck className="size-6 text-primary" />
        </h1>
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
          Analise texto, gatilhos mentais e conformidade de compliance do seu anúncio contra as políticas da Meta, Google e TikTok antes de publicar.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: Ad Inputs */}
        <div className="space-y-4">
          <Panel className="p-5 bg-[#14171a] border-border space-y-4">
            <div>
              <label className="text-xs font-semibold text-white block mb-1.5">Título do Anúncio</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Como Conquistar Sua Liberdade Financeira..."
                className="w-full rounded-xl border border-border bg-[#0d0f10] p-3 text-xs text-white outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-white block mb-1.5">Texto Principal / Copy do Anúncio</label>
              <textarea
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Cole o texto completo do anúncio aqui..."
                className="w-full resize-none rounded-xl border border-border bg-[#0d0f10] p-3.5 text-xs text-white outline-none focus:border-primary font-sans leading-relaxed"
              />
            </div>
          </Panel>

          {/* Analysis Result */}
          {result && (
            <Panel className="p-6 bg-[#14171a] border-border space-y-5">
              {/* Score Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Índice de Aprovação
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-3xl font-extrabold text-white">{result.score}%</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                        result.risk === "baixo"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : result.risk === "medio"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      Risco {result.risk}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-right">
                  <p>Plataforma: <b>{PLATFORMS.find((p) => p.key === platform)?.label.split(" ")[0]}</b></p>
                  <p>Nicho: <b>{NICHES.find((n) => n.key === niche)?.label.split(" ")[0]}</b></p>
                </div>
              </div>

              {/* Issues List */}
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                  Diagnóstico de Políticas ({result.issues.length} alertas)
                </h3>
                {result.issues.length === 0 ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                    <CheckCircle2 className="size-4" />
                    Nenhuma violação grave encontrada. Copy em alta conformidade!
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {result.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs ${
                          issue.type === "critical"
                            ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
                            : "border-amber-500/30 bg-amber-500/10 text-amber-200"
                        }`}
                      >
                        <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">{issue.rule}</p>
                          <p className="text-[11px] opacity-80 mt-0.5">{issue.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shielded Copy Suggestion */}
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
                <div className="rounded-xl border border-border bg-[#0d0f10] p-3.5 text-xs text-white/90 leading-relaxed font-sans">
                  {result.safeCopy}
                </div>
              </div>
            </Panel>
          )}
        </div>

        {/* Right: Platform & Niche Selectors */}
        <div>
          <Panel className="bg-[#14171a] border-border divide-y divide-border">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-white">Parâmetros do Anúncio</h2>
              <p className="mt-1 text-xs text-muted-foreground">Configuração de auditoria:</p>
            </div>

            {/* Platform Selector */}
            <div className="p-4 space-y-2">
              <label className="text-xs font-semibold text-white block">Rede de Anúncios</label>
              {PLATFORMS.map((p) => (
                <label
                  key={p.key}
                  onClick={() => setPlatform(p.key)}
                  className={`flex cursor-pointer gap-2.5 p-2.5 rounded-xl text-xs transition-all ${
                    platform === p.key ? "bg-secondary/60 ring-1 ring-primary/40 font-bold text-white" : "text-muted-foreground hover:bg-secondary/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="platformSelect"
                    checked={platform === p.key}
                    onChange={() => setPlatform(p.key)}
                    className="accent-primary"
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>

            {/* Niche Selector */}
            <div className="p-4 space-y-2">
              <label className="text-xs font-semibold text-white block">Nicho / Vertical</label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value as Niche)}
                className="w-full rounded-xl border border-border bg-[#0d0f10] p-2.5 text-xs text-white outline-none focus:border-primary"
              >
                {NICHES.map((n) => (
                  <option key={n.key} value={n.key}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4">
              <button
                disabled={analyzing || (!title.trim() && !body.trim())}
                onClick={handleAnalyze}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 disabled:opacity-50"
              >
                <SearchCheck className="size-4" />
                {analyzing ? "Auditando Copy..." : "Auditar Anúncio"}
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
