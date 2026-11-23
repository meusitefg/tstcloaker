export type PageTemplate = { id: string; name: string; brand: string; category: string; headline: string; text: string; cta: string; color: string; bg: string };

export const pageTemplates: PageTemplate[] = [
  { id: "bella", name: "Studio Bella — Salão & Estética", brand: "Studio Bella", category: "Beleza", headline: "Realce sua beleza natural", text: "Cabelo, unhas, estética facial e massagem com profissionais experientes.", cta: "Agendar horário", color: "#e84c8b", bg: "#fdf2f7" },
  { id: "derma", name: "DermaCare — Clínica Dermatológica", brand: "DermaCare", category: "Saúde", headline: "Pele saudável, você mais confiante", text: "Tratamentos dermatológicos com tecnologia de ponta e equipe especializada.", cta: "Marcar avaliação", color: "#0e8fb5", bg: "#ecf8fc" },
  { id: "stratego", name: "Stratego Consultoria Empresarial", brand: "Stratego", category: "Consultoria", headline: "Resultados mensuráveis para sua empresa", text: "Diagnóstico, planejamento e execução para levar seu negócio ao próximo nível.", cta: "Agendar diagnóstico", color: "#0f6b5c", bg: "#e8f4f1" },
  { id: "techstore", name: "TechStore — Eletrônicos", brand: "TechStore", category: "E-commerce", headline: "Tecnologia com o melhor preço", text: "Smartphones, notebooks e acessórios com entrega rápida para todo o Brasil.", cta: "Ver ofertas", color: "#2563eb", bg: "#eef3ff" },
  { id: "aprenda", name: "Aprenda+ — Cursos Online", brand: "Aprenda+", category: "Educação", headline: "Aprenda no seu ritmo", text: "Cursos práticos com certificado e acesso vitalício.", cta: "Começar agora", color: "#d97706", bg: "#fff7e8" },
  { id: "invest", name: "Invest Claro — Planejamento", brand: "Invest Claro", category: "Finanças", headline: "Seu dinheiro organizado", text: "Planejamento financeiro simples para você e sua família.", cta: "Falar com especialista", color: "#15803d", bg: "#eefaf1" },
];

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function renderTemplate(t: PageTemplate) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(t.brand)}</title>
<style>body{margin:0;font-family:Georgia,serif;color:#1d1d1f;background:${t.bg}}header{display:flex;justify-content:space-between;align-items:center;padding:16px 28px;background:#fff}
.logo{display:flex;gap:8px;align-items:center;font-weight:700}.logo i{width:16px;height:16px;border-radius:4px;background:${t.color}}
a.btn{background:${t.color};color:#fff;padding:10px 20px;border-radius:999px;text-decoration:none;font-family:sans-serif;font-size:14px}
main{padding:56px 28px}small{letter-spacing:.3em;color:${t.color};font-family:sans-serif;font-size:11px;text-transform:uppercase}h1{font-size:40px;margin:12px 0}p{max-width:520px;line-height:1.6}</style></head>
<body><header><span class="logo"><i></i>${esc(t.brand)}</span><a class="btn" href="#">${esc(t.cta)}</a></header>
<main><small>${esc(t.category)}</small><h1>${esc(t.headline)}</h1><p>${esc(t.text)}</p><a class="btn" href="#">${esc(t.cta)}</a></main></body></html>`;
}
