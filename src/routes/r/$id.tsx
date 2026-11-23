import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { registerVisit } from "@/lib/links";
import { Shield, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/r/$id")({
  head: () => ({
    meta: [
      { title: "Carregando... | Cloakfy" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Redirect,
});

function Redirect() {
  const { id } = Route.useParams();
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    // Check if query contains ?bot=1 or ?test=safe for developer simulation
    const searchParams = new URLSearchParams(window.location.search);
    const forceBot = searchParams.get("bot") === "1" || searchParams.get("test") === "safe";

    const targetUrl = registerVisit(id, forceBot ? true : undefined);

    if (targetUrl) {
      window.location.replace(targetUrl);
    } else {
      setMissing(true);
    }
  }, [id]);

  return (
    <div className="grid min-h-screen place-items-center bg-[#0d0f10] px-4 text-center text-white">
      {missing ? (
        <div className="max-w-md rounded-2xl border border-border bg-[#14171a] p-8 shadow-2xl">
          <div className="mx-auto grid size-12 place-items-center rounded-xl bg-secondary text-primary">
            <Shield className="size-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold">Cloaker Indisponível</h1>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Este cloaker foi pausado ou ainda não foi configurado neste navegador.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:brightness-110 transition-all"
          >
            Acessar Painel Cloakfy
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground font-mono">Verificando segurança...</p>
        </div>
      )}
    </div>
  );
}
