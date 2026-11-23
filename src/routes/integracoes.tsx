import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plug, CheckCircle2, AlertCircle, ChevronDown, ChevronRight, ExternalLink, Shield } from "lucide-react";
import { toast } from "sonner";
import { AppShell, Panel, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/integracoes")({
  head: () => ({
    meta: [
      { title: "Integrações | Cloakfy" },
      { name: "description", content: "Conecte Meta, TikTok e Google e envie as vendas dos seus cloakers para cada plataforma." },
      { property: "og:title", content: "Integrações | Cloakfy" },
    ],
  }),
  component: IntegracoesPage,
});

interface PlatformConfig {
  id: string;
  connected: boolean;
  pixelId: string;
  token: string;
}

const STORAGE_KEY = "cloakfy-integracoes";

function readConfigs(): Record<string, PlatformConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveConfigs(configs: Record<string, PlatformConfig>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}

const PLATFORMS = [
  {
    id: "meta",
    name: "Meta (Facebook & Instagram)",
    description: "Envie eventos de conversão do seu cloaker diretamente para o Pixel da Meta via Conversions API.",
    icon: "🟦",
    color: "#1877f2",
    fields: [
      { key: "pixelId", label: "Pixel ID", placeholder: "Ex: 1234567890123456" },
      { key: "token", label: "Access Token da API", placeholder: "EAAG..." },
    ],
    docsUrl: "https://developers.facebook.com/docs/marketing-api/conversions-api",
  },
  {
    id: "tiktok",
    name: "TikTok Ads",
    description: "Envie eventos de pixel do TikTok para rastrear conversões dos seus anúncios com os cloakers.",
    icon: "⬛",
    color: "#fe2c55",
    fields: [
      { key: "pixelId", label: "Pixel ID do TikTok", placeholder: "Ex: CXXX..." },
      { key: "token", label: "Access Token", placeholder: "Token da API..." },
    ],
    docsUrl: "https://ads.tiktok.com/marketing_api/docs",
  },
  {
    id: "google",
    name: "Google Ads",
    description: "Integre com o Google Ads para rastrear conversões de cliques e enviar eventos do cloaker.",
    icon: "🔴",
    color: "#ea4335",
    fields: [
      { key: "pixelId", label: "ID de Conversão", placeholder: "AW-XXXXXXXXX" },
      { key: "token", label: "Rótulo de Conversão", placeholder: "Ex: AbCdEf..." },
    ],
    docsUrl: "https://support.google.com/google-ads/answer/6095821",
  },
];

function IntegracoesPage() {
  const [configs, setConfigs] = useState<Record<string, PlatformConfig>>(() => readConfigs());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [forms, setForms] = useState<Record<string, { pixelId: string; token: string }>>({});

  function getForm(id: string) {
    return forms[id] || { pixelId: configs[id]?.pixelId || "", token: configs[id]?.token || "" };
  }

  function setForm(id: string, field: string, value: string) {
    setForms((prev) => ({ ...prev, [id]: { ...getForm(id), [field]: value } }));
  }

  function handleConnect(platformId: string) {
    const form = getForm(platformId);
    if (!form.pixelId.trim() || !form.token.trim()) {
      toast.error("Preencha todos os campos para conectar.");
      return;
    }
    const updated = {
      ...configs,
      [platformId]: {
        id: platformId,
        connected: true,
        pixelId: form.pixelId.trim(),
        token: form.token.trim(),
      },
    };
    setConfigs(updated);
    saveConfigs(updated);
    setExpanded(null);
    toast.success(`${PLATFORMS.find((p) => p.id === platformId)?.name} conectado com sucesso!`);
  }

  function handleDisconnect(platformId: string) {
    if (!confirm("Desconectar esta integração?")) return;
    const updated = { ...configs };
    delete updated[platformId];
    setConfigs(updated);
    saveConfigs(updated);
    toast.success("Integração desconectada.");
  }

  return (
    <AppShell title="Integrações">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">Integrações</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Conecte Meta, TikTok e Google e envie as vendas dos seus cloakers para cada plataforma.
        </p>
      </div>

      <div className="space-y-4">
        {PLATFORMS.map((platform) => {
          const cfg = configs[platform.id];
          const isConnected = cfg?.connected;
          const isExpanded = expanded === platform.id;

          return (
            <Panel key={platform.id} className="bg-[#14171a] border-border overflow-hidden">
              {/* Platform Header Row */}
              <div className="flex flex-wrap items-center gap-4 px-6 py-5">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-2xl">{platform.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white">{platform.name}</p>
                      {isConnected && (
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="size-3" />
                          Conectado
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed max-w-md">
                      {platform.description}
                    </p>
                    {isConnected && (
                      <p className="mt-1 text-xs font-mono text-primary">
                        Pixel: {cfg.pixelId}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={platform.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="grid size-8 place-items-center rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-white transition-colors"
                    title="Ver documentação"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>

                  {isConnected ? (
                    <>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : platform.id)}
                        className="rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-white transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDisconnect(platform.id)}
                        className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        Desconectar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : platform.id)}
                      className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all"
                    >
                      {isExpanded ? "Cancelar" : "Conectar"}
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Config Form */}
              {isExpanded && (
                <div className="border-t border-border bg-[#0d0f10] px-6 py-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {platform.fields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          value={getForm(platform.id)[field.key as keyof ReturnType<typeof getForm>]}
                          onChange={(e) => setForm(platform.id, field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full rounded-xl border border-border bg-[#14171a] px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-muted-foreground/60 focus:border-primary transition-all font-mono"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => handleConnect(platform.id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:brightness-110 transition-all"
                    >
                      <Shield className="size-4" />
                      {isConnected ? "Atualizar integração" : "Conectar agora"}
                    </button>
                    <button
                      onClick={() => setExpanded(null)}
                      className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs text-muted-foreground hover:text-white transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>

                  <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
                    Suas credenciais são salvas localmente e nunca enviadas a servidores externos.
                  </p>
                </div>
              )}
            </Panel>
          );
        })}
      </div>
    </AppShell>
  );
}
