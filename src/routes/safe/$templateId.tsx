import { createFileRoute } from "@tanstack/react-router";
import { pageTemplates, renderTemplate } from "@/lib/page-templates";

export const Route = createFileRoute("/safe/$templateId")({
  head: ({ params }) => {
    const t = pageTemplates.find((x) => x.id === params.templateId);
    return {
      meta: [
        { title: `${t?.name || "Página Segura"} | Cloakfy` },
        { name: "description", content: t?.headline || "Página Segura" },
      ],
    };
  },
  component: SafePageRoute,
});

function SafePageRoute() {
  const { templateId } = Route.useParams();
  const template = pageTemplates.find((t) => t.id === templateId) || pageTemplates[0]!;
  const html = renderTemplate(template);

  return (
    <div className="fixed inset-0 h-screen w-screen bg-white">
      <iframe
        srcDoc={html}
        title={template.name}
        className="h-full w-full border-none"
      />
    </div>
  );
}
