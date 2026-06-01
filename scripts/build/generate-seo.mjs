/**
 * Pós-build: gera sitemap.xml válido e o 404.html para deep-links no GitHub
 * Pages. Mantenha a lista de rotas em sincronia com src/lib/routes.ts.
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");
const buildDir = resolve(root, "build");

const SITE_URL = "https://tarifas.imsolar.com.br";

// Em sincronia com src/lib/routes.ts
const ROUTES = [
  { path: "/", priority: "1.0" },
  { path: "/sem-impostos", priority: "0.9" },
  { path: "/fator-ajuste-grupo-a", priority: "0.9" },
  { path: "/duvidas", priority: "0.7" },
  { path: "/reportar", priority: "0.5" },
  { path: "/termos-de-uso", priority: "0.3" },
];

function readLastmod() {
  // Usa a data de atualização do dataset, se disponível.
  try {
    const meta = JSON.parse(
      readFileSync(resolve(buildDir, "data/meta.json"), "utf-8")
    );
    if (meta.updatedAt) return meta.updatedAt;
  } catch {
    /* ignora */
  }
  return new Date().toISOString().slice(0, 10);
}

function generateSitemap(lastmod) {
  const urls = ROUTES.map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function main() {
  if (!existsSync(buildDir)) {
    console.error("[seo] build/ não encontrado. Rode `vite build` antes.");
    process.exit(1);
  }

  const lastmod = readLastmod();

  // sitemap.xml válido
  writeFileSync(resolve(buildDir, "sitemap.xml"), generateSitemap(lastmod));
  console.log(
    `[seo] sitemap.xml gerado (${ROUTES.length} rotas, lastmod ${lastmod})`
  );

  // 404.html = cópia do index.html → SPA fallback para deep-links no GH Pages
  const indexPath = resolve(buildDir, "index.html");
  if (existsSync(indexPath)) {
    copyFileSync(indexPath, resolve(buildDir, "404.html"));
    console.log("[seo] 404.html criado a partir do index.html");
  }
}

main();
