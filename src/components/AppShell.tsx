import { createContext, useContext, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  Diamond,
  Gift,
  Globe,
  Instagram,
  LayoutGrid,
  Link2,
  LogOut,
  MessageSquarePlus,
  Plug,
  Plus,
  Radio,
  FileText,
  Sparkles,
  Heart,
  Video,
  HelpCircle,
  FileCode,
  Image as ImageIcon,
  MessageSquare,
  Lock,
  Music,
  Flame,
  ShieldCheck,
  SearchCheck,
  Shield,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { NewLinkDialog, type Preset } from "./NewLinkDialog";
import { toast } from "sonner";

const NewCloakerCtx = createContext<(p?: Preset) => void>(() => {});
export const useNewLink = () => useContext(NewCloakerCtx);
export const useNewCloaker = useNewLink;

type Item = {
  to: string;
  label: string;
  icon: any;
  badge?: "NOVO" | "LIVE";
  onClick?: () => void;
};

export function CloakfyLogo({ className = "size-7" }: { className?: string }) {
  return (
    <div className={`relative flex shrink-0 items-center justify-center rounded-full bg-[#0d1b12] ring-1 ring-[#00E676]/40 ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" className="size-5">
        <circle cx="12" cy="12" r="10" fill="#0d1b12" />
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.08-1.38-4.48-.73-7.88-4.63-7.88-9.32 0-3.9 2.37-7.24 5.76-8.7C13.88 2.21 12.96 2 12 2z"
          fill="#00E676"
        />
        <circle cx="15.5" cy="8.5" r="1.5" fill="#00E676" />
      </svg>
    </div>
  );
}

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const [dialog, setDialog] = useState<{ open: boolean; preset?: Preset }>({ open: false });
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const open = (preset?: Preset) => setDialog({ open: true, ...(preset ? { preset } : {}) });

  const groups: { title: string; items: Item[]; defaultOpen?: boolean }[] = [
    {
      title: "GERAL",
      defaultOpen: true,
      items: [
        { to: "/", label: "Dashboard", icon: LayoutGrid },
        { to: "/compartilhar", label: "Indicações", icon: Gift, badge: "NOVO" },
      ],
    },
    {
      title: "CLOAKER",
      defaultOpen: true,
      items: [
        { to: "/links", label: "Cloakers", icon: Layers },
        { to: "/modelos", label: "Ao Vivo", icon: Radio, badge: "LIVE" },
        { to: "/acessos", label: "Logs", icon: FileText },
        { to: "/dominios", label: "Domínios", icon: Globe },
        { to: "/integracoes", label: "Integrações", icon: Plug, badge: "NOVO" },
        { to: "/paginas", label: "Páginas Safe", icon: FileCode },
      ],
    },
    {
      title: "CRIATIVOS",
      defaultOpen: true,
      items: [
        { to: "/video", label: "Camuflar Vídeo", icon: Video },
        { to: "/imagem", label: "Camuflar Imagem", icon: ImageIcon },
        { to: "/camuflar-audio-puro", label: "Camuflar Áudio", icon: Music },
        { to: "/camuflar-tiktok", label: "Camuflagem TikTok", icon: Video },
        { to: "/auto-variacoes", label: "Auto-Variações", icon: Flame, badge: "NOVO" },
        { to: "/limpar-metadados", label: "Limpar Metadados", icon: ShieldCheck },
        { to: "/analise-anuncio", label: "Análise de Anúncio", icon: SearchCheck },
        { to: "/camuflar-texto", label: "Camuflagem de Texto", icon: MessageSquare },
      ],
    },
    {
      title: "SUPORTE",
      defaultOpen: false,
      items: [{ to: "/ajuda", label: "Central de ajuda", icon: HelpCircle }],
    },
  ];

  return (
    <NewCloakerCtx.Provider value={open}>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[276px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
          {/* Brand header */}
          <Link to="/" className="flex items-center gap-2.5 px-5 pt-4 text-xl font-bold tracking-tight">
            <CloakfyLogo className="size-8" />
            <span className="text-white font-extrabold tracking-tight">Cloakfy</span>
          </Link>

          {/* Action button */}
          <div className="px-3">
            <button
              onClick={() => open()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:brightness-110 active:scale-[0.99]"
            >
              <Plus className="size-4 stroke-[3]" />
              Novo Cloaker
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="mt-4 flex-1 overflow-y-auto px-2.5 space-y-1">
            {groups.map((g) => (
              <NavGroup key={g.title} {...g} />
            ))}
          </nav>

          {/* Planos Item */}
          <div className="border-t border-sidebar-border px-2.5 py-2">
            <NavLink item={{ to: "/planos", label: "Planos", icon: Diamond }} />
          </div>

          {/* User Profile Card */}
          <div className="border-t border-sidebar-border px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                K
              </span>
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate font-semibold text-white leading-tight">Kertulli Machado</p>
                <p className="text-[11px] text-muted-foreground leading-tight">Plano Grátis</p>
                <p className="truncate text-[10px] text-muted-foreground/80 leading-tight">kertullimachado216@gmail.com</p>
              </div>
            </div>
            <div className="mt-3 flex justify-around text-xs text-muted-foreground">
              <button
                onClick={() => toast.info("Obrigado pelo apoio ao Cloakfy!")}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Heart className="size-3.5" />
                Apoiar
              </button>
              <button
                onClick={() => toast.success("Sessão preservada localmente.")}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <LogOut className="size-3.5" />
                Sair
              </button>
            </div>
          </div>
        </aside>

        {/* Content area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top Header */}
          <header className="sticky top-0 z-20 flex h-[60px] items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur md:px-10">
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
              <p className="text-xs text-muted-foreground leading-tight">Central de operação</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-pink-500 hover:border-pink-500/50"
              >
                <Instagram className="size-4" />
              </a>
              <span className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
                <span>🇧🇷</span> Português <ChevronDown className="size-3 text-muted-foreground" />
              </span>
              <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">
                K
              </span>
            </div>
          </header>

          {/* Main View */}
          <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-8 md:px-10">{children}</main>
        </div>
      </div>

      {/* Floating feedback button */}
      <button
        onClick={() => setFeedbackOpen(true)}
        className="fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-xl border border-border bg-card/90 px-4 py-2.5 text-xs font-semibold text-foreground shadow-lg backdrop-blur hover:bg-card transition-all"
      >
        <MessageSquarePlus className="size-4 text-primary" />
        Feedback
      </button>

      {/* Feedback Modal */}
      {feedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" onClick={() => setFeedbackOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="size-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground">Enviar Feedback</h3>
              </div>
              <button onClick={() => setFeedbackOpen(false)} className="text-muted-foreground hover:text-foreground text-sm">✕</button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">O que você gostaria de ver melhorado no Cloakfy?</p>
            <textarea
              placeholder="Descreva sua sugestão ou problema..."
              rows={4}
              className="mt-3 w-full rounded-xl border border-input bg-background p-3 text-xs outline-none focus:border-primary"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setFeedbackOpen(false)} className="rounded-lg border border-border px-3 py-2 text-xs">Cancelar</button>
              <button
                onClick={() => {
                  toast.success("Feedback recebido com sucesso!");
                  setFeedbackOpen(false);
                }}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Cloaker Dialog */}
      <NewLinkDialog
        key={dialog.open ? "o" : "c"}
        open={dialog.open}
        preset={dialog.preset}
        onClose={() => setDialog({ open: false })}
      />
    </NewCloakerCtx.Provider>
  );
}

function NavGroup({ title, items, defaultOpen = true }: { title: string; items: Item[]; defaultOpen?: boolean }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(defaultOpen || items.some((i) => i.to === path));

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/80 hover:text-muted-foreground"
      >
        {title}
        <ChevronDown className={`size-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-1 space-y-0.5">
          {items.map((i) => (
            <NavLink key={i.label + i.to} item={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function NavLink({ item }: { item: Item }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: true }}
      className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-foreground data-[status=active]:font-semibold transition-colors"
    >
      <Icon className="size-4 shrink-0 text-muted-foreground group-data-[status=active]:text-primary group-hover:text-primary transition-colors" />
      <span className="truncate">{item.label}</span>
      {item.badge && (
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-bold text-primary">
          {item.badge === "LIVE" && <span className="size-1.5 animate-pulse rounded-full bg-primary" />}
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function PrimaryButton({ children, className = "", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export function NewLinkButton({ label = "+ Novo Cloaker" }: { label?: string }) {
  const open = useNewCloaker();
  return (
    <PrimaryButton onClick={() => open()}>
      <Plus className="size-4 stroke-[3]" />
      {label}
    </PrimaryButton>
  );
}

export const NewCloakerButton = NewLinkButton;

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Empty({
  icon: Icon = Globe,
  title,
  text,
  actionLabel = "Criar primeira",
  onAction,
}: {
  icon?: any;
  title: string;
  text?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const open = useNewCloaker();
  return (
    <Panel className="flex flex-col items-center px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-xl border border-border bg-secondary/80">
        <Icon className="size-5 text-muted-foreground" />
      </span>
      <p className="mt-5 text-base font-semibold text-foreground">{title}</p>
      {text && <p className="mt-1 max-w-md text-sm text-muted-foreground leading-relaxed">{text}</p>}
      <div className="mt-6">
        <PrimaryButton onClick={onAction || (() => open())}>
          <Plus className="size-4 stroke-[3]" />
          {actionLabel}
        </PrimaryButton>
      </div>
    </Panel>
  );
}

export function LockedCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-border bg-card/90 px-8 py-10 text-center shadow-lg">
      <div className="mx-auto grid size-12 place-items-center rounded-full border border-border bg-secondary">
        <Lock className="size-5 text-muted-foreground" />
      </div>
      <p className="mt-4 text-xl font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
      <p className="mt-3 text-sm text-muted-foreground">
        Disponível no plano <b className="text-foreground">Starter</b>.
      </p>
      <Link
        to="/planos"
        className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.99]"
      >
        Liberar no plano Starter
      </Link>
    </div>
  );
}
