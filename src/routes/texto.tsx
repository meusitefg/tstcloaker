import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldAlert, Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, Panel, PrimaryButton } from "@/components/AppShell";

export const Route = createFileRoute("/texto")({
  head: () => ({
    meta: [
      { title: "Camuflagem de Texto | Cloakfy" },
      { name: "description", content: "Camufle termos proibidos e revise copy de anúncios contra bloqueios de conta." },
      { property: "og:title", content: "Camuflagem de Texto | Cloakfy" },
      { property: "og:description", content: "Camufle termos proibidos e revise copy de anúncios contra bloqueios de conta." },
    ],
  }),
  component: TextTool,
});

const limits = [
  { label: "Título do Anúncio", max: 40, hint: "Espaço visível no cabeçalho dos anúncios" },
  { label: "Texto Principal / Copy", max: 125, hint: "Texto exibido antes do botão 'Ver mais'" },
  { label: "Descrição", max: 30, hint: "Abaixo do título no feed de notícias" },
];

const bannedWords = [
  "emagrecer", "emagrecimento", "perder peso", "cura", "garantido", "renda extra",
  "ganhar dinheiro", "fique rico", "antes e depois", "milagroso", "sem esforço", "lucro garantido"
];

function cloakText(text: string): string {
  // Replace sensitive letters with invisible zero-width spaces or homoglyphs
  return text
    .replace(/a/g, "а") // Cyrillic 'а'
    .replace(/e/g, "е") // Cyrillic 'е'
    .replace(/o/g, "о") // Cyrillic 'о'
    .replace(/p/g, "р"); // Cyrillic 'р'
}

function TextTool() {
  const [values, setValues] = useState(["", "", ""]);
  const [cloakedOutput, setCloakedOutput] = useState("");

  const foundBanned = bannedWords.filter((w) =>
    values.some((v) => v.toLowerCase().includes(w))
  );

  function handleCloak() {
    const fullText = values.filter(Boolean).join("\n\n");
    if (!fullText) return;
    const processed = cloakText(fullText);
    setCloakedOutput(processed);
    toast.success("Texto camuflado com caracteres homóglifos! Robôs não detectarão palavras sensíveis.");
  }

  return (
    <AppShell title="Camuflagem de Texto">
      <PageHeader
        title="Camuflagem de Texto"
        subtitle="Analise sua copy contra palavras sensíveis e camufle termos proibidos com caracteres indetectáveis."
      />

      {/* Warning if sensitive words detected */}
      {foundBanned.length > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
          <ShieldAlert className="size-5 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-300">Atenção: Palavras com alto risco de bloqueio detectadas:</p>
            <p className="mt-1 flex flex-wrap gap-1.5">
              {foundBanned.map((w) => (
                <span key={w} className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-amber-300">
                  {w}
                </span>
              ))}
            </p>
            <p className="mt-2 text-muted-foreground">
              Utilize o botão <b>"Camuflar Texto"</b> abaixo para substituir caracteres sensíveis por homóglifos indetectáveis pelo crawler.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Editor Inputs */}
        <Panel className="divide-y divide-border bg-[#14171a] border-border">
          {limits.map((l, i) => {
            const n = values[i]!.length;
            const isOver = n > l.max;
            return (
              <div key={l.label} className="p-6">
                <div className="flex justify-between text-xs font-semibold text-white">
                  <span>{l.label}</span>
                  <span className={isOver ? "text-destructive font-bold" : "text-muted-foreground font-mono"}>
                    {n}/{l.max}
                  </span>
                </div>
                <textarea
                  rows={i === 1 ? 4 : 2}
                  value={values[i]}
                  placeholder={`Digite seu ${l.label.toLowerCase()}...`}
                  onChange={(e) => setValues(values.map((v, j) => (j === i ? e.target.value : v)))}
                  className="mt-2.5 w-full resize-none rounded-xl border border-border bg-[#0d0f10] p-3 text-xs text-white outline-none focus:border-primary transition-all"
                />
                <span className="mt-1.5 block text-[11px] text-muted-foreground">{l.hint}</span>
                {isOver && (
                  <span className="mt-1 block text-xs text-destructive">
                    Passou {n - l.max} caracteres — corre risco de ser truncado na exibição.
                  </span>
                )}
              </div>
            );
          })}
        </Panel>

        {/* Cloaking Action & Output */}
        <div className="space-y-4">
          <Panel className="p-5 bg-[#14171a] border-border">
            <h3 className="text-sm font-semibold text-white">Camuflar Copy</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Substitui caracteres visíveis por homóglifos cirílicos idênticos aos olhos humanos, mas com código binário diferente para burlar filtros de bots.
            </p>
            <button
              onClick={handleCloak}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all"
            >
              <Sparkles className="size-4" />
              Camuflar Texto Agora
            </button>
          </Panel>

          {cloakedOutput && (
            <Panel className="p-5 bg-[#14171a] border-primary/40 ring-1 ring-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-primary">Texto Camuflado</span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(cloakedOutput);
                    toast.success("Texto copiado para a área de transferência!");
                  }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white"
                >
                  <Copy className="size-3.5" /> Copiar
                </button>
              </div>
              <div className="rounded-xl bg-[#0d0f10] p-3 font-mono text-xs text-white/90 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {cloakedOutput}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </AppShell>
  );
}
