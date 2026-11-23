# Cloakfy - Central de Operação

Plataforma profissional de cloaking inteligente, proteção contra bots de análise (Facebook Ads, Google Ads, TikTok Ads) e conjunto de ferramentas para camuflagem e descaracterização de criativos (vídeos, imagens e copy).

## 🚀 Funcionalidades

### 🛡️ Cloaker Inteligente
- **Proteção em Tempo Real**: Filtra requisições de crawlers e moderadores de anúncios, desviando-os para Páginas Safe (White Pages) em compliance.
- **Detecção Avançada**: Identifica bots via ASN de Data Centers (AWS, Meta, Googlebot, Cloudflare, etc.), assinaturas de User-Agent e emuladores headless.
- **Redirecionamento para Oferta Real**: Visitantes reais e compradores vão diretamente para a sua página de vendas/VSL com parâmetros UTM intactos.
- **Logs de Acesso**: Relatórios em tempo real com IP, cidade, país, dispositivo, navegador e motivo da filtragem.

### 🎨 Suite de Criativos Anti-Bloqueio
- **Camuflar Vídeo**: Recodifica vídeos, remove metadados e injeta micro-ruído imperceptível de pixels em cada quadro, alterando completamente o hash MD5/SHA-256 para evitar ban por criativo duplicado. Permite também mesclar imagem de capa subliminarmente.
- **Camuflar Imagem**: Redimensiona para Feed quadrado, Feed vertical, Stories/Reels e Paisagem, limpando dados EXIF/GPS e gerando nova impressão digital.
- **Camuflagem de Texto**: Detector de palavras sensíveis/proibidas com substituição automática por caracteres homóglifos indetectáveis para robôs de compliance.
- **Páginas Safe (White Pages)**: Modelos prontos em diversas categorias (Beleza, Consultoria, E-commerce, Educação, Finanças, Saúde, Tecnologia) e editor para HTML próprio.

### 👥 Sistema de Indicações
- Cada 3 amigos indicados que criarem o primeiro cloaker liberam +1 cloaker permanente na conta.

## 🛠️ Tecnologias
- **React 19**
- **TanStack Router & TanStack Start**
- **Tailwind CSS v4** com tema Dark Obsidian & Neon Green
- **Lucide Icons**
- **HTML5 Canvas & Web MediaRecorder API**
