import { createFileRoute } from "@tanstack/react-router";
import { pageTemplates, renderTemplate } from "@/lib/page-templates";
import { readCustomPages } from "@/lib/custom-pages";

export const Route = createFileRoute("/safe/$templateId")({
  head: ({ params }) => {
    const cp = readCustomPages().find((p) => p.id === params.templateId);
    if (cp) {
      return {
        meta: [
          { title: `${cp.title} | Cloakfy` },
          { name: "description", content: cp.title },
        ],
      };
    }
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
  const cp = readCustomPages().find((p) => p.id === templateId || `custom:${p.id}` === templateId);
  const template = pageTemplates.find((t) => t.id === templateId) || pageTemplates[0]!;
  const html = cp ? cp.html : renderTemplate(template);

  return (
    <div className="fixed inset-0 h-screen w-screen bg-white">
      <iframe
        srcDoc={html}
        title={cp ? cp.title : template.name}
        className="h-full w-full border-none"
      />
    </div>
  );
}
