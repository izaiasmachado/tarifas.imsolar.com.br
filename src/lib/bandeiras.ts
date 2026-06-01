/**
 * Bandeiras tarifárias — valores oficiais da ANEEL.
 *
 * O adicional é cobrado por kWh consumido, somado à tarifa. Os valores mudam
 * ao longo do tempo (e a bandeira em vigor muda mês a mês), por isso ficam
 * centralizados aqui para fácil atualização.
 *
 * Fonte: ANEEL — Bandeiras Tarifárias.
 * Valores vigentes conforme última atualização da ANEEL (jan/2026).
 */
export interface Bandeira {
  id: "verde" | "amarela" | "vermelha1" | "vermelha2";
  nome: string;
  /** Adicional em R$/kWh. */
  adicionalKwh: number;
  /** Classe de cor para o indicador visual (token Tailwind). */
  cor: string;
  descricao: string;
}

export const BANDEIRAS: Bandeira[] = [
  {
    id: "verde",
    nome: "Verde",
    adicionalKwh: 0,
    cor: "bg-emerald-500",
    descricao:
      "Condições favoráveis de geração. Sem acréscimo na conta de energia.",
  },
  {
    id: "amarela",
    nome: "Amarela",
    adicionalKwh: 0.01885,
    cor: "bg-yellow-400",
    descricao:
      "Condições de geração menos favoráveis. Acréscimo moderado por kWh.",
  },
  {
    id: "vermelha1",
    nome: "Vermelha — Patamar 1",
    adicionalKwh: 0.04463,
    cor: "bg-red-500",
    descricao:
      "Custo de geração mais alto (acionamento de termelétricas). Acréscimo elevado.",
  },
  {
    id: "vermelha2",
    nome: "Vermelha — Patamar 2",
    adicionalKwh: 0.07877,
    cor: "bg-red-700",
    descricao:
      "Condição mais crítica de geração. O maior acréscimo por kWh consumido.",
  },
];

export const BANDEIRA_FONTE =
  "https://www.gov.br/aneel/pt-br/assuntos/tarifas/bandeiras-tarifarias";

/** Custo adicional (R$) da bandeira para um consumo em kWh. */
export function custoBandeira(bandeira: Bandeira, consumoKwh: number): number {
  return bandeira.adicionalKwh * consumoKwh;
}
