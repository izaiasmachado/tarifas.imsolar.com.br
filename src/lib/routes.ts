/** Rotas da aplicação — fonte única usada pelo router e pelo gerador de SEO. */
export interface RouteMeta {
  path: string;
  /** Incluir no sitemap.xml? */
  sitemap: boolean;
  /** Prioridade no sitemap (0.0–1.0). */
  priority: number;
}

export const ROUTES: RouteMeta[] = [
  { path: "/", sitemap: true, priority: 1.0 },
  { path: "/sem-impostos", sitemap: true, priority: 0.9 },
  { path: "/fator-ajuste-grupo-a", sitemap: true, priority: 0.9 },
  { path: "/duvidas", sitemap: true, priority: 0.7 },
  { path: "/reportar", sitemap: true, priority: 0.5 },
  { path: "/termos-de-uso", sitemap: true, priority: 0.3 },
];
