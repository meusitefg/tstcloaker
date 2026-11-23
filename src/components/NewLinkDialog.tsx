import { useState } from "react";
import { Shield, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { addCloaker, normalizeUrl } from "@/lib/links";

export type Preset = {
  source?: string;
  medium?: string;
  campaign?: string;
  name?: string;
  safeTemplateId?: string;
};

export function NewLinkDialog({
  open,
  onClose,
  preset,
}: {
  open: boolean;
  onClose: () => void;
  preset?: Preset | undefined;
}) {
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [safeTemplate, setSafeTemplate] = useState(preset?.safeTemplateId || "bella");
  const [mode, setMode] = useState<"basica" | "normal" | "agressiva">("normal");

  if (!open) return null;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const destinationInput = String(f.get("destination") || "").trim();
    const destination = normalizeUrl(destinationInput);

    if (!destination) {
      setError("Informe um endereço válido da sua oferta (ex: minhaoferta.com/vendas).");
      return;
    }

    const name = String(f.get("name") || "").trim() || new URL(destination).hostname;
    const source = String(f.get("source") || "").trim();
    const medium = String(f.get("medium") || "").trim();
    const campaign = String(f.get("campaign") || "").trim();

    const appOrigin = typeof window !== "undefined" ? window.location.origin : "";
    addCloaker({
      destination,
      name,
      safePage: `${appOrigin}/safe/${safeTemplate}`,
      safeTemplateId: safeTemplate,
      source,
      medium,
      campaign,
      mode,
    });

    toast.success("Cloaker criado com proteção ativa!");
    setError("");
    onClose();
  }

  function useExample() {
    const appOrigin = typeof window !== "undefined" ? window.location.origin : "";
    addCloaker({
      name: "Oferta Exemplo (VSL)",
      destination: "https://minhaoferta.com/vsl-secreta",
      safePage: `${appOrigin}/safe/bella`,
      safeTemplateId: "bella",
      source: "facebook",
      medium: "cpc",
      campaign: "vsl-black",
      mode: "normal",
    });
    toast.success("Cloaker de exemplo criado!");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-border bg-[#14171a] p-6 shadow-2xl"
      >
        {/* Header matching Screenshot 7 */}
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl border border-border/80 bg-secondary text-primary">
            <Shield className="size-5" />
          </span>
          <h2 className="text-lg font-semibold text-white">Seu primeiro cloaker</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="ml-auto text-muted-foreground hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Uma pergunta só. A página segura que o bot vai ver já vem pronta — você troca depois se quiser.
        </p>

        {/* Main Offer Link Input */}
        <div className="mt-5">
          <label className="block text-xs font-semibold text-white">
            Link da sua oferta
            <input
              name="destination"
              type="text"
              placeholder="minhaoferta.com/vendas"
              autoFocus
              required
              className="mt-2 w-full rounded-xl border border-border bg-[#0d0f10] px-3.5 py-3 text-sm text-white outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </label>
          <span className="mt-1.5 block text-[11px] text-muted-foreground">
            É pra onde seu lead vai. Pode trocar depois.
          </span>
        </div>

        {/* Collapsible Advanced Settings */}
        <div className="mt-4 border-t border-border/60 pt-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-white"
          >
            Opções avançadas (Página safe, UTMs e filtros)
            <ChevronDown className={`size-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </button>

          {showAdvanced && (
            <div className="mt-3 space-y-3.5 pt-1">
              <div>
                <label className="block text-xs font-medium text-muted-foreground">Nome da campanha</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Ex: Escala Facebook Ads #1"
                  defaultValue={preset?.name}
                  className="mt-1.5 w-full rounded-lg border border-border bg-[#0d0f10] px-3 py-2 text-xs text-white outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground">Template da Página Safe (White Page)</label>
                <select
                  value={safeTemplate}
                  onChange={(e) => setSafeTemplate(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-border bg-[#0d0f10] px-3 py-2 text-xs text-white outline-none focus:border-primary"
                >
                  <option value="bella">Studio Bella — Salão & Estética (Beleza)</option>
                  <option value="derma">DermaCare — Clínica Dermatológica (Saúde)</option>
                  <option value="stratego">Stratego Consultoria Empresarial (Consultoria)</option>
                  <option value="techstore">TechStore — Eletrônicos (E-commerce)</option>
                  <option value="aprenda">Aprenda+ — Cursos Online (Educação)</option>
                  <option value="invest">Invest Claro — Planejamento (Finanças)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground">Nível de agressividade do cloaker</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="mt-1.5 w-full rounded-lg border border-border bg-[#0d0f10] px-3 py-2 text-xs text-white outline-none focus:border-primary"
                >
                  <option value="basica">Básica (Bloqueio de bots conhecidos)</option>
                  <option value="normal">Normal (Recomendado: ASN Meta/Google + User-Agent)</option>
                  <option value="agressiva">Agressiva (Bloqueio de VPNs, proxies e emuladores)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-muted-foreground">utm_source</label>
                  <input
                    name="source"
                    placeholder="facebook"
                    defaultValue={preset?.source}
                    className="mt-1 w-full rounded-lg border border-border bg-[#0d0f10] px-2.5 py-1.5 text-xs text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted-foreground">utm_medium</label>
                  <input
                    name="medium"
                    placeholder="cpc"
                    defaultValue={preset?.medium}
                    className="mt-1 w-full rounded-lg border border-border bg-[#0d0f10] px-2.5 py-1.5 text-xs text-white outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-muted-foreground">utm_campaign</label>
                  <input
                    name="campaign"
                    placeholder="escala"
                    defaultValue={preset?.campaign}
                    className="mt-1 w-full rounded-lg border border-border bg-[#0d0f10] px-2.5 py-1.5 text-xs text-white outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

        {/* Buttons matching Screenshot 7 */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <Shield className="size-4" />
            Criar cloaker
          </button>
          <button
            type="button"
            onClick={useExample}
            className="text-xs font-medium text-muted-foreground hover:text-white transition-colors"
          >
            Não tenho agora, usar exemplo
          </button>
        </div>
      </form>
    </div>
  );
}
