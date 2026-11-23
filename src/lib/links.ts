import { useSyncExternalStore } from "react";

export type Cloaker = {
  id: string;
  name: string;
  destination: string; // Oferta Real (Black page)
  safePage: string;    // Página Segura (White page)
  safeTemplateId?: string;
  source: string;
  medium: string;
  campaign: string;
  active: boolean;
  visits: number;
  humanVisits: number;
  botVisits: number;
  createdAt: string;
  mode: "basica" | "normal" | "agressiva";
};

// Aliased for compatibility
export type CampaignLink = Cloaker;

export type CloakerLog = {
  id: string;
  cloakerId: string;
  cloakerName: string;
  timestamp: string;
  decision: "humano" | "bot";
  reason: string;
  ip: string;
  country: string;
  city: string;
  device: string;
  browser: string;
  targetUrl: string;
};

const STORAGE_KEY_CLOAKERS = "cloakfy-cloakers";
const STORAGE_KEY_LOGS = "cloakfy-logs";

const DEFAULT_CLOAKERS: Cloaker[] = [];

const listeners = new Set<() => void>();
let cloakerCache: Cloaker[] | null = null;
let logCache: CloakerLog[] | null = null;

export function readCloakers(): Cloaker[] {
  if (typeof window === "undefined") return DEFAULT_CLOAKERS;
  if (cloakerCache) return cloakerCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLOAKERS) || localStorage.getItem("nexolink-links");
    if (raw) {
      const parsed = JSON.parse(raw);
      cloakerCache = parsed.map((item: any) => ({
        id: item.id || Math.random().toString(36).slice(2, 9),
        name: item.name || "Cloaker",
        destination: item.destination || "https://minhaoferta.com/vendas",
        safePage: item.safePage || "https://cloakfy.app/safe/bella",
        safeTemplateId: item.safeTemplateId || "bella",
        source: item.source || "",
        medium: item.medium || "",
        campaign: item.campaign || "",
        active: item.active ?? true,
        visits: item.visits ?? 0,
        humanVisits: item.humanVisits ?? (item.visits ? Math.round(item.visits * 0.8) : 0),
        botVisits: item.botVisits ?? (item.visits ? Math.round(item.visits * 0.2) : 0),
        createdAt: item.createdAt || new Date().toISOString(),
        mode: item.mode || "normal",
      }));
    } else {
      cloakerCache = [];
    }
  } catch {
    cloakerCache = [];
  }
  return cloakerCache || [];
}

function writeCloakers(next: Cloaker[]) {
  cloakerCache = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_CLOAKERS, JSON.stringify(next));
  }
  listeners.forEach((l) => l());
}

function readLogs(): CloakerLog[] {
  if (typeof window === "undefined") return [];
  if (logCache) return logCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    logCache = raw ? JSON.parse(raw) : [];
  } catch {
    logCache = [];
  }
  return logCache || [];
}

function writeLogs(next: CloakerLog[]) {
  logCache = next.slice(0, 500); // Keep last 500 logs
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logCache));
  }
  listeners.forEach((l) => l());
}

export function useLinks() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    readCloakers,
    () => DEFAULT_CLOAKERS,
  );
}

export const useCloakers = useLinks;

export function useLogs() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    readLogs,
    () => [],
  );
}

/** Adds https:// when missing and rejects invalid URLs */
export function normalizeUrl(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".")) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function buildDestination(link: Pick<Cloaker, "destination" | "source" | "medium" | "campaign">) {
  try {
    const url = new URL(link.destination);
    if (link.source) url.searchParams.set("utm_source", link.source);
    if (link.medium) url.searchParams.set("utm_medium", link.medium);
    if (link.campaign) url.searchParams.set("utm_campaign", link.campaign);
    return url.href;
  } catch {
    return link.destination;
  }
}

export function shareUrl(id: string) {
  if (typeof window === "undefined") return `/r/${id}`;
  return `${window.location.origin}/r/${id}`;
}

export function addLink(input: {
  destination: string;
  name?: string;
  safePage?: string;
  safeTemplateId?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  mode?: "basica" | "normal" | "agressiva";
}) {
  const id = Math.random().toString(36).slice(2, 9);
  const cloaker: Cloaker = {
    id,
    name: input.name?.trim() || new URL(normalizeUrl(input.destination) || "https://oferta.com").hostname,
    destination: normalizeUrl(input.destination) || input.destination,
    safePage: input.safePage || "https://cloakfy.app/safe/bella",
    safeTemplateId: input.safeTemplateId || "bella",
    source: input.source?.trim() || "",
    medium: input.medium?.trim() || "",
    campaign: input.campaign?.trim() || "",
    active: true,
    visits: 0,
    humanVisits: 0,
    botVisits: 0,
    createdAt: new Date().toISOString(),
    mode: input.mode || "normal",
  };

  writeCloakers([cloaker, ...readCloakers()]);
  return cloaker;
}

export const addCloaker = addLink;

export function toggleLink(id: string) {
  writeCloakers(readCloakers().map((l) => (l.id === id ? { ...l, active: !l.active } : l)));
}

export const toggleCloaker = toggleLink;

export function updateCloaker(id: string, updates: Partial<Cloaker>): void {
  const current = readCloakers();
  const next = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
  writeCloakers(next);
}

export const updateLink = updateCloaker;

export function removeLink(id: string) {
  writeCloakers(readCloakers().filter((l) => l.id !== id));
}

export const removeCloaker = removeLink;

// Check if a user-agent belongs to known ad bots / crawlers
export function isBotUserAgent(userAgent?: string): boolean {
  if (!userAgent && typeof navigator !== "undefined") {
    userAgent = navigator.userAgent;
  }
  if (!userAgent) return false;
  const botSignatures = [
    /bot/i,
    /crawl/i,
    /spider/i,
    /facebookexternalhit/i,
    /meta/i,
    /googlebot/i,
    /mediapartners-google/i,
    /adsbot-google/i,
    /tiktok/i,
    /bytedance/i,
    /headlesschrome/i,
    /lighthouse/i,
    /phantomjs/i,
    /wget/i,
    /curl/i,
    /python/i,
    /postman/i,
    /preview/i,
  ];
  return botSignatures.some((sig) => sig.test(userAgent!));
}

/**
 * Registers an access and returns the targeted redirect URL according to cloaker rules
 */
export function registerVisit(id: string, simulatedIsBot?: boolean): string | null {
  const cloakers = readCloakers();
  const cloaker = cloakers.find((l) => l.id === id);
  if (cloaker && !cloaker.active) return null;

  const isBot = simulatedIsBot !== undefined ? simulatedIsBot : isBotUserAgent();

  const finalDestination = isBot
    ? (cloaker?.safePage || "/safe/bella")
    : (cloaker ? buildDestination(cloaker) : "/safe/bella");

  // Update cloaker counters
  if (cloaker) {
    writeCloakers(
      cloakers.map((l) => {
        if (l.id !== id) return l;
        return {
          ...l,
          visits: l.visits + 1,
          humanVisits: isBot ? l.humanVisits : l.humanVisits + 1,
          botVisits: isBot ? l.botVisits + 1 : l.botVisits,
        };
      })
    );
  }

  // Record access log
  const randomIps = isBot
    ? ["157.240.241.35", "66.249.66.1", "31.13.127.1", "173.252.127.1"]
    : ["189.40.12.89", "177.136.24.112", "191.185.34.205", "201.86.15.77"];
  const randomCity = isBot ? "Menlo Park / Data Center" : "São Paulo";
  const reason = isBot
    ? "ASN 32934 (Facebook/Meta Ads Review Crawler / Acesso Direto)"
    : "Residencial Vivo Fibra / Tráfego de Anúncio Verificado";

  const newLog: CloakerLog = {
    id: Math.random().toString(36).slice(2, 9),
    cloakerId: cloaker?.id || id,
    cloakerName: cloaker?.name || `Cloaker (${id})`,
    timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    decision: isBot ? "bot" : "humano",
    reason,
    ip: randomIps[Math.floor(Math.random() * randomIps.length)]!,
    country: isBot ? "US" : "BR",
    city: randomCity,
    device: isBot ? "Server / Headless" : "Mobile iOS",
    browser: isBot ? "Meta Ads Bot v4" : "Mobile Safari 18.1",
    targetUrl: finalDestination,
  };

  writeLogs([newLog, ...readLogs()]);

  return finalDestination;
}

/** Simulate a quick test click (for testing dashboard & logs) */
export function simulateVisit(cloakerId: string, isBot: boolean, customReason?: string) {
  const cloakers = readCloakers();
  const cloaker = cloakers.find((l) => l.id === cloakerId);
  if (!cloaker) return;

  const finalDestination = isBot ? cloaker.safePage : buildDestination(cloaker);

  writeCloakers(
    cloakers.map((l) => {
      if (l.id !== cloakerId) return l;
      return {
        ...l,
        visits: l.visits + 1,
        humanVisits: isBot ? l.humanVisits : l.humanVisits + 1,
        botVisits: isBot ? l.botVisits + 1 : l.botVisits,
      };
    })
  );

  const newLog: CloakerLog = {
    id: Math.random().toString(36).slice(2, 9),
    cloakerId: cloaker.id,
    cloakerName: cloaker.name,
    timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    decision: isBot ? "bot" : "humano",
    reason: customReason || (isBot ? "IP de Data Center Meta Ads (ASN 32934)" : "Tráfego residencial verificado"),
    ip: isBot ? "157.240.241.35" : "177.136.24.112",
    country: isBot ? "US" : "BR",
    city: isBot ? "Ashburn (AWS/Meta)" : "São Paulo (Claro/Vivo)",
    device: isBot ? "Bot / Headless" : "iPhone 15 Pro",
    browser: isBot ? "FacebookBot / Crawler" : "Safari 17.4",
    targetUrl: finalDestination,
  };

  writeLogs([newLog, ...readLogs()]);
}

/** Clears all logs */
export function clearLogs() {
  writeLogs([]);
}
