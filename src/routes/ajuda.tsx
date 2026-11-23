import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle, Shield, Globe, Video, FileText, ChevronRight } from "lucide-react";
import { AppShell, PageHeader, Panel } from "@/components/AppShell";

export const Route = createFileRoute("/ajuda")({
  head: () => ({
    meta: [
      { title: "Central de Ajuda | Cloakfy" },
      { name: "description", content: "Dúvidas frequentes, guias e boas práticas de proteção de tráfego com Cloakfy." },
      { property: "og:title", content: "Central de Ajuda | Cloakfy" },
      { property: "og:description", content: "Dúvidas frequentes, guias e boas práticas de proteção de tráfego com Cloakfy." },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  const faqs = [
    {
      q: "O que é um Cloaker e como ele protege minha conta de anúncios?",
      a: "O cloaker é um filtro de requisições inteligente. Quando um robô ou moderador (Facebook, Google, TikTok) clica no link, ele é direcionado para uma 'Página Safe' (white page em total conformidade). Quando um usuário real clica, ele é levado para a sua oferta de vendas.",
    },
    {
      q: "Como camuflar vídeos para não cair como criativo duplicado?",
      a: "Vá em 'Camuflar Vídeo', selecione seus arquivos e escolha o modo Normal ou Agressivo. O Cloakfy recodifica o fluxo de frames e insere micro-ruídos nos pixels sem alterar a qualidade visual, alterando o hash MD5/SHA256 para que o algoritmo encare como um criativo 100% inédito.",
    },
    {
      q: "Qual link devo colocar na campanha?",
      a: "Você deve copiar o link curto gerado pelo Cloakfy (ex: /r/xyz) ou o seu domínio personalizado e colá-lo na URL de destino do anúncio.",
    },
    {
      q: "O que são as Páginas Safe?",
      a: "São modelos de páginas institucionais (Salão de Beleza, Clínica Médica, Consultoria) já aprovadas em compliance pelas plataformas de anúncios.",
    },
  ];

  return (
    <AppShell title="Central de Ajuda">
      <PageHeader
        title="Central de Ajuda"
        subtitle="Entenda como funciona o Cloakfy e maximize o tempo de vida das suas campanhas."
      />

      <Panel className="divide-y divide-border bg-[#14171a] border-border">
        {faqs.map((f) => (
          <div key={f.q} className="p-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              {f.q}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground pl-6">
              {f.a}
            </p>
          </div>
        ))}
      </Panel>
    </AppShell>
  );
}
