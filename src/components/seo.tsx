import { Helmet } from "react-helmet-async";

import { SITE } from "@/lib/site";

interface SeoProps {
  title: string;
  description: string;
  /** Caminho da rota (ex.: "/sem-impostos"). Usado em canonical e og:url. */
  path: string;
  /** Dados estruturados extras (objeto JSON-LD ou lista deles). */
  jsonLd?: object | object[];
  /** Se true, não anexa " | Tarifas IM Solar" ao título. */
  rawTitle?: boolean;
}

/** Metadados por rota: title, description, canonical, Open Graph e JSON-LD. */
export function Seo({
  title,
  description,
  path,
  jsonLd,
  rawTitle = false,
}: SeoProps) {
  const fullTitle = rawTitle ? title : `${title} | ${SITE.name}`;
  const canonical = `${SITE.url}${path === "/" ? "/" : path}`;
  const blocks = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={SITE.ogImage} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={SITE.ogImage} />

      {blocks.map((block, i) => (
        <script type="application/ld+json" key={i}>
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}

/** Helper: JSON-LD de breadcrumbs a partir de pares [nome, caminho]. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.path === "/" ? "/" : item.path}`,
    })),
  };
}
