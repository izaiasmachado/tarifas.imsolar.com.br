/** Configuração central do site (URLs, navegação, contato). */
export const SITE = {
  name: "Tarifas IM Solar",
  shortName: "Tarifas",
  url: "https://tarifas.imsolar.com.br",
  company: "IM Solar",
  companyUrl: "https://imsolar.com.br",
  repo: "https://github.com/izaiasmachado/tarifas.imsolar.com.br",
  /** Fonte oficial dos dados (ANEEL — Dados Abertos). */
  dataSourceUrl:
    "https://dadosabertos.aneel.gov.br/dataset/tarifas-distribuidoras-energia-eletrica",
  description:
    "Ferramentas gratuitas de tarifas de energia elétrica do Brasil: tabela de tarifas sem impostos por concessionária e calculadora de fator de ajuste TE do Grupo A, com dados da ANEEL.",
  ogImage: "https://tarifas.imsolar.com.br/img/meter-80.png",
} as const;

export interface NavItem {
  label: string;
  to: string;
}

/** Itens de navegação principais (rotas reais). Curada para caber na navbar. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Início", to: "/" },
  { label: "Tarifas sem impostos", to: "/sem-impostos" },
  { label: "Ranking", to: "/ranking" },
  { label: "Comparar", to: "/comparar" },
  { label: "Dúvidas", to: "/duvidas" },
];
