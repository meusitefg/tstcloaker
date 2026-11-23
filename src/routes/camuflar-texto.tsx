import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wand2, Copy, Check, MessageSquare, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader, Panel, PrimaryButton } from "@/components/AppShell";

export const Route = createFileRoute("/camuflar-texto")({
  head: () => ({
    meta: [
      { title: "Camuflar Texto | Cloakfy" },
      { name: "description", content: "Camufle suas copies e textos usando homóglifos e separadores invisíveis para evitar bloqueios." },
      { property: "og:title", content: "Camuflar Texto | Cloakfy" },
    ],
  }),
  component: CamuflarTextoPage,
});

// Exact Cloakfy Homoglyph Dictionary
const HOMOGLYPHS: Record<string, string> = {
  a: "а", c: "с", d: "ԁ", e: "е", g: "ɡ", h: "һ", i: "і", j: "ј", k: "к", o: "о",
  p: "р", s: "ѕ", w: "ԝ", x: "х", y: "у",
  A: "А", B: "В", C: "С", E: "Е", H: "Н", I: "І", J: "Ј", K: "К", M: "М", N: "Ν",
  O: "О", P: "Р", S: "Ѕ", T: "Т", X: "Х", Y: "Υ", Z: "Ζ"
};

// Exact Cloakfy Zero-width invisible separators
const SEPARATORS = ["\u2060", "\u200C", "\u2063", "\u2062"];

type CloakMode = "anuncios" | "email" | "sms";

const MODES: { mode: CloakMode; label: string; desc: string }[] = [
  { mode: "anuncios", label: "Anúncios (Máxima)", desc: "Substituição completa por homóglifos + separadores invisíveis de micro-bytes entre caracteres." },
  { mode: "email", label: "E-mail (Leve)", desc: "Substitui apenas a primeira ocorrência sensível de cada palavra. Ideal para deliverability." },
  { mode: "sms", label: "SMS (Equilibrada)", desc: "Substitui caracteres de forma intercalada (50%). Excelente para SMS e WhatsApp." },
];

function applyHomoglyphs(word: string, mode: CloakMode): string {
  const chars = [...word];
  let replacedCount = 0;

  const transformed = chars.map((char) => {
    const replacement = HOMOGLYPHS[char];
    if (!replacement) return char;

    const count = replacedCount++;
    if (mode === "email") {
      return count === 0 ? replacement : char;
    }
    if (mode === "sms") {
      return count % 2 === 0 ? replacement : char;
    }
    return replacement;
  });

  if (mode !== "anuncios") return transformed.join("");

  let result = "";
  transformed.forEach((char, index) => {
    result += char;
    if (index < transformed.length - 1) {
      result += SEPARATORS[index % SEPARATORS.length];
    }
  });
  return result;
}

function cloakText(text: string, mode: CloakMode): string {
  return text
    .split(/(\s+)/)
    .map((chunk) => (/^\s+$/.test(chunk) || chunk === "" ? chunk : applyHomoglyphs(chunk, mode)))
    .join("");
}

function CamuflarTextoPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<CloakMode>("anuncios");
  const [result, setResult] = useState<{ text: string; modeLabel: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleProcess() {
    if (!input.trim()) {
      toast.error("Digite ou cole um texto para camuflar.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const modeObj = MODES.find((m) => m.mode === mode)!;
      const camouflaged = cloakText(input.trim(), mode);
      setResult({ text: camouflaged, modeLabel: modeObj.label });
      setLoading(false);
      toast.success("Texto camuflado com sucesso!");
    }, 200);
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    toast.success("Texto camuflado copiado!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <AppShell title="Camuflagem de Texto">
      <div className="mb-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">/camuflar-texto</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Camuflagem de Texto</h1>
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
          Camufle suas copies, termos proibidos e palavras sensíveis usando caracteres homóglifos e separadores invisíveis indetectáveis para robôs de compliance.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left Column: Input */}
        <div>
          <Panel className="p-5 bg-[#14171a] border-border">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="text-input" className="text-sm font-semibold text-white">
                Texto para camuflar
              </label>
              <span className="text-xs font-mono text-muted-foreground">{input.length} caracteres</span>
            </div>
            <textarea
              id="text-input"
              rows={8}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Cole aqui o texto da sua copy, anúncio ou mensagem..."
              className="w-full resize-none rounded-xl border border-border bg-[#0d0f10] p-4 text-sm text-white placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-all font-sans"
            />
          </Panel>
        </div>

        {/* Right Column: Modes & Action */}
        <div>
          <Panel className="bg-[#14171a] border-border divide-y divide-border">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-white">Nível de Camuflagem</h2>
              <p className="mt-1 text-xs text-muted-foreground">Escolha o algoritmo de proteção:</p>
            </div>

            <div className="p-3 space-y-2">
              {MODES.map((m) => (
                <label
                  key={m.mode}
                  onClick={() => setMode(m.mode)}
                  className={`flex cursor-pointer gap-3 p-3 rounded-xl transition-all ${
                    mode === m.mode ? "bg-secondary/60 ring-1 ring-primary/40" : "hover:bg-secondary/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="textMode"
                    checked={mode === m.mode}
                    onChange={() => setMode(m.mode)}
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <span className="block text-xs font-bold text-white">{m.label}</span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground leading-relaxed">
                      {m.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="p-4">
              <button
                onClick={handleProcess}
                disabled={loading || !input.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
              >
                <Wand2 className="size-4" />
                {loading ? "Processando..." : "Camuflar Texto Agora"}
              </button>
            </div>
          </Panel>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <Panel className="mt-6 p-6 bg-[#14171a] border-primary/40 ring-1 ring-primary/20">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Resultado Camuflado
              </span>
              <span className="ml-2 text-xs text-muted-foreground">· Nível: {result.modeLabel}</span>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-card transition-all"
            >
              {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
          <div className="rounded-xl border border-border bg-[#0d0f10] p-4 font-sans text-sm text-white/95 leading-relaxed whitespace-pre-wrap selection:bg-primary/30">
            {result.text}
          </div>
        </Panel>
      )}
    </AppShell>
  );
}
