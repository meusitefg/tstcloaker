export type CustomPage = {
  id: string;
  title: string;
  topic: string;
  html: string;
  createdAt: string;
};

const STORAGE_CUSTOM_PAGES = "cloakfy-custom-pages";
const STORAGE_TOPICS = "cloakfy-custom-topics";

export const DEFAULT_TOPICS = [
  "Todos",
  "Beleza",
  "Consultoria",
  "E-commerce",
  "Educação",
  "Finanças",
  "Saúde",
  "Tecnologia",
];

export function readTopics(): string[] {
  if (typeof window === "undefined") return DEFAULT_TOPICS;
  try {
    const raw = localStorage.getItem(STORAGE_TOPICS);
    if (!raw) return DEFAULT_TOPICS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Merge with default topics ensuring no duplicates
      const merged = Array.from(new Set([...DEFAULT_TOPICS, ...parsed]));
      return merged;
    }
    return DEFAULT_TOPICS;
  } catch {
    return DEFAULT_TOPICS;
  }
}

export function addTopic(newTopic: string): string[] {
  const clean = newTopic.trim();
  if (!clean) return readTopics();
  const current = readTopics();
  if (current.includes(clean)) return current;
  const next = [...current, clean];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_TOPICS, JSON.stringify(next.filter((t) => !DEFAULT_TOPICS.includes(t))));
  }
  return next;
}

let cachedCustomPages: CustomPage[] | null = null;
const customPageListeners = new Set<() => void>();

export function readCustomPages(): CustomPage[] {
  if (typeof window === "undefined") return [];
  if (cachedCustomPages) return cachedCustomPages;
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_PAGES);
    cachedCustomPages = raw ? JSON.parse(raw) : [];
  } catch {
    cachedCustomPages = [];
  }
  return cachedCustomPages || [];
}

export function writeCustomPages(pages: CustomPage[]) {
  cachedCustomPages = pages;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_CUSTOM_PAGES, JSON.stringify(pages));
    // Sync with server store
    fetch("/api/custom-pages", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(pages),
    }).catch(() => {});
  }
  customPageListeners.forEach((l) => l());
}

export function saveCustomPage(page: Omit<CustomPage, "id" | "createdAt">): CustomPage {
  const newPage: CustomPage = {
    ...page,
    id: "cp_" + Math.random().toString(36).slice(2, 9),
    createdAt: new Date().toISOString(),
  };
  const list = readCustomPages();
  const next = [newPage, ...list];
  writeCustomPages(next);
  return newPage;
}

export function deleteCustomPage(id: string) {
  const list = readCustomPages();
  const next = list.filter((p) => p.id !== id);
  writeCustomPages(next);
  if (typeof window !== "undefined") {
    fetch(`/api/custom-pages/delete/${id}`, { method: "POST" }).catch(() => {});
  }
}

// Initial sync on client boot
if (typeof window !== "undefined") {
  fetch("/api/custom-pages")
    .then((r) => r.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const local = readCustomPages();
        const map = new Map<string, CustomPage>();
        local.forEach((p) => map.set(p.id, p));
        data.forEach((p: CustomPage) => {
          if (p?.id && !map.has(p.id)) {
            map.set(p.id, p);
          }
        });
        const merged = Array.from(map.values());
        cachedCustomPages = merged;
        localStorage.setItem(STORAGE_CUSTOM_PAGES, JSON.stringify(merged));
        customPageListeners.forEach((l) => l());
      }
    })
    .catch(() => {});
}
