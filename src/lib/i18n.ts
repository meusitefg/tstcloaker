import { useSyncExternalStore } from "react";

export type Language = "pt" | "en" | "es";

export type LanguageInfo = {
  code: Language;
  name: string;
  flag: string;
};

export const LANGUAGES: LanguageInfo[] = [
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

const STORAGE_KEY = "cloakfy_language";

const translations: Record<Language, Record<string, string>> = {
  pt: {
    dashboard: "Dashboard",
    cloakers: "Cloakers",
    acessos: "Acessos",
    paginas: "Páginas Safe",
    dominios: "Domínios",
    integracoes: "Integrações",
    camuflar_tiktok: "Camuflar TikTok",
    camuflar_audio: "Camuflar Áudio Puro",
    camuflar_video: "Camuflar Vídeo",
    camuflar_imagem: "Camuflar Imagem",
    limpar_metadados: "Limpar Metadados",
    camuflar_texto: "Camuflar Texto",
    analise_anuncio: "Análise de Anúncio",
    auto_variacoes: "Auto Variações",
    links_campanhas: "Links & Campanhas",
    ferramentas_midia: "Ferramentas de Mídia",
    configuracoes: "Configurações",
    novo_cloaker: "Novo Cloaker",
    seu_plano: "Seu plano:",
    ilimitado: "Ilimitado",
    protecao_ativa: "Proteção ativa sem limites",
    cliques_humanos: "Cliques humanos este mês",
    sem_restricoes: "Sem restrições de volume de tráfego, limites de links ou bloqueio por cliques.",
    criar_primeira: "Criar primeira",
    fechar: "Fechar",
    salvar: "Salvar",
    cancelar: "Cancelar",
    excluir: "Excluir",
    editar: "Editar",
    copiar: "Copiar",
    ativo: "Ativo",
    pausado: "Pausado",
    humanos: "Humanos",
    bots: "Bots",
    alterar: "Alterar",
  },
  en: {
    dashboard: "Dashboard",
    cloakers: "Cloakers",
    acessos: "Access Logs",
    paginas: "Safe Pages",
    dominios: "Domains",
    integracoes: "Integrations",
    camuflar_tiktok: "Camouflage TikTok",
    camuflar_audio: "Camouflage Pure Audio",
    camuflar_video: "Camouflage Video",
    camuflar_imagem: "Camouflage Image",
    limpar_metadados: "Clean Metadata",
    camuflar_texto: "Camouflage Text",
    analise_anuncio: "Ad Analysis",
    auto_variacoes: "Auto Variations",
    links_campanhas: "Links & Campaigns",
    ferramentas_midia: "Media Tools",
    configuracoes: "Settings",
    novo_cloaker: "New Cloaker",
    seu_plano: "Your plan:",
    ilimitado: "Unlimited",
    protecao_ativa: "Active unlimited protection",
    cliques_humanos: "Human clicks this month",
    sem_restricoes: "No restrictions on traffic volume, link limits or click blocks.",
    criar_primeira: "Create first",
    fechar: "Close",
    salvar: "Save",
    cancelar: "Cancel",
    excluir: "Delete",
    editar: "Edit",
    copiar: "Copy",
    ativo: "Active",
    pausado: "Paused",
    humanos: "Humans",
    bots: "Bots",
    alterar: "Modify",
  },
  es: {
    dashboard: "Panel",
    cloakers: "Cloakers",
    acessos: "Accesos",
    paginas: "Páginas Seguras",
    dominios: "Dominios",
    integracoes: "Integraciones",
    camuflar_tiktok: "Camuflar TikTok",
    camuflar_audio: "Camuflar Audio Puro",
    camuflar_video: "Camuflar Video",
    camuflar_imagem: "Camuflar Imagen",
    limpar_metadados: "Limpiar Metadatos",
    camuflar_texto: "Camuflar Texto",
    analise_anuncio: "Análisis de Anuncios",
    auto_variacoes: "Auto Variaciones",
    links_campanhas: "Enlaces y Campañas",
    ferramentas_midia: "Herramientas de Medios",
    configuracoes: "Configuración",
    novo_cloaker: "Nuevo Cloaker",
    seu_plano: "Tu plan:",
    ilimitado: "Ilimitado",
    protecao_ativa: "Protección activa sin límites",
    cliques_humanos: "Clics humanos este mes",
    sem_restricoes: "Sin restricciones de volumen de tráfico, límites de enlaces o bloqueo por clics.",
    criar_primeira: "Crear primera",
    fechar: "Cerrar",
    salvar: "Guardar",
    cancelar: "Cancelar",
    excluir: "Eliminar",
    editar: "Editar",
    copiar: "Copiar",
    ativo: "Activo",
    pausado: "Pausado",
    humanos: "Humanos",
    bots: "Bots",
    alterar: "Modificar",
  },
};

const listeners = new Set<() => void>();
let currentLanguage: Language = "pt";

if (typeof window !== "undefined") {
  const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (saved && (saved === "pt" || saved === "en" || saved === "es")) {
    currentLanguage = saved;
  }
}

export function getLanguage(): Language {
  return currentLanguage;
}

export function setLanguage(lang: Language) {
  if (currentLanguage === lang) return;
  currentLanguage = lang;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, lang);
  }
  listeners.forEach((l) => l());
}

export function useLanguage() {
  const lang = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getLanguage,
    () => "pt" as Language
  );

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.pt[key] || key;
  };

  const currentInfo = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]!;

  return { lang, setLanguage, t, currentInfo, languages: LANGUAGES };
}
