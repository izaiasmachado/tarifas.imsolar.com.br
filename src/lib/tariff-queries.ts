import type { Tarifa } from "@/lib/types";

/**
 * Consultas puras sobre o conjunto de tarifas (sem impostos), reutilizadas
 * pelas ferramentas (ranking, comparador, simulador, economia solar).
 *
 * Convenções da base ANEEL:
 * - valores monetários estão em R$/MWh (dividir por 1000 para R$/kWh);
 * - linhas de energia usam `unidade === "MWh"` e `detalhe === "Não se aplica"`;
 * - para a mesma chave/posto há linhas duplicadas e classes descontadas
 *   (ex.: Rural, Baixa Renda); tomamos o MAIOR TE por posto, que corresponde à
 *   tarifa de referência (cheia).
 */

export const UNID_MWH = "MWh";
export const STD_DETALHE = "Não se aplica";
export const POSTO_NA = "Não se aplica";
export const POSTO_PONTA = "Ponta";
export const POSTO_FORA_PONTA = "Fora ponta";

/** Tarifa de um posto, em R$/MWh. */
export interface Rate {
  tusd: number;
  te: number;
  fioB: number;
  /** TUSD + TE (tarifa de aplicação sem impostos). */
  total: number;
}

export type Key = string; // `${conc}|${subgrupo}|${modalidade}`

function makeKey(conc: string, subgrupo: string, modalidade: string): Key {
  return `${conc}|${subgrupo}|${modalidade}`;
}

export interface TariffIndex {
  /** key -> (posto -> Rate), com a tarifa de referência por posto. */
  byKey: Map<Key, Map<string, Rate>>;
  concessionarias: string[];
  subgrupos: string[];
  modalidades: string[];
}

/** Constrói um índice de tarifas de referência a partir das linhas brutas. */
export function buildTariffIndex(tarifas: Tarifa[]): TariffIndex {
  const byKey = new Map<Key, Map<string, Rate>>();
  const concessionarias = new Set<string>();
  const subgrupos = new Set<string>();
  const modalidades = new Set<string>();

  for (const t of tarifas) {
    if (t.unidade !== UNID_MWH || t.detalhe !== STD_DETALHE) continue;
    if (!t.concessionaria || !t.subgrupo || !t.modalidade) continue;

    concessionarias.add(t.concessionaria);
    subgrupos.add(t.subgrupo);
    modalidades.add(t.modalidade);

    const key = makeKey(t.concessionaria, t.subgrupo, t.modalidade);
    const postos = byKey.get(key) ?? new Map<string, Rate>();
    const te = Number(t.totalTE);
    const prev = postos.get(t.posto);
    // Mantém a linha de referência (maior TE) por posto.
    if (!prev || te > prev.te) {
      const tusd = Number(t.totalTUSD);
      const fioB = Number(t.TUSDFioB);
      postos.set(t.posto, { tusd, te, fioB, total: tusd + te });
    }
    byKey.set(key, postos);
  }

  const sort = (s: Set<string>) =>
    Array.from(s).sort((a, b) => a.localeCompare(b, "pt-BR"));

  return {
    byKey,
    concessionarias: sort(concessionarias),
    subgrupos: sort(subgrupos),
    modalidades: sort(modalidades),
  };
}

/** Postos (tarifas) de uma concessionária num subgrupo/modalidade. */
export function getPostos(
  index: TariffIndex,
  conc: string,
  subgrupo: string,
  modalidade: string
): Map<string, Rate> | undefined {
  return index.byKey.get(makeKey(conc, subgrupo, modalidade));
}

/**
 * Tarifa "convencional" (monômia) de uma chave: o posto único
 * "Não se aplica" — usado para Grupo B (B1/B2/B3).
 */
export function getConvencional(
  index: TariffIndex,
  conc: string,
  subgrupo: string,
  modalidade: string
): Rate | undefined {
  return getPostos(index, conc, subgrupo, modalidade)?.get(POSTO_NA);
}

/** Concessionárias que têm dados para um dado subgrupo+modalidade. */
export function concessionariasFor(
  index: TariffIndex,
  subgrupo: string,
  modalidade: string
): string[] {
  const out: string[] = [];
  for (const conc of index.concessionarias) {
    if (index.byKey.has(makeKey(conc, subgrupo, modalidade))) out.push(conc);
  }
  return out;
}

/** Modalidades disponíveis para um subgrupo. */
export function modalidadesFor(
  index: TariffIndex,
  subgrupo: string
): string[] {
  const out = new Set<string>();
  for (const key of index.byKey.keys()) {
    const [, sub, mod] = key.split("|");
    if (sub === subgrupo) out.add(mod);
  }
  return Array.from(out).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export type Metric = "total" | "tusd" | "te" | "fioB";

export interface RankingRow {
  concessionaria: string;
  value: number;
  rate: Rate;
}

/**
 * Ranking de concessionárias por uma métrica, num subgrupo/modalidade/posto.
 * Ordena do MAIOR para o menor (decrescente).
 */
export function rankByMetric(
  index: TariffIndex,
  subgrupo: string,
  modalidade: string,
  posto: string,
  metric: Metric
): RankingRow[] {
  const rows: RankingRow[] = [];
  for (const conc of concessionariasFor(index, subgrupo, modalidade)) {
    const rate = getPostos(index, conc, subgrupo, modalidade)?.get(posto);
    if (!rate) continue;
    rows.push({ concessionaria: conc, value: rate[metric], rate });
  }
  return rows.sort((a, b) => b.value - a.value);
}

/** Postos disponíveis para um subgrupo+modalidade (união entre concessionárias). */
export function postosFor(
  index: TariffIndex,
  subgrupo: string,
  modalidade: string
): string[] {
  const out = new Set<string>();
  for (const conc of concessionariasFor(index, subgrupo, modalidade)) {
    const postos = getPostos(index, conc, subgrupo, modalidade);
    if (postos) for (const p of postos.keys()) out.add(p);
  }
  // Ordena com uma ordem natural conhecida primeiro.
  const order = [POSTO_NA, POSTO_PONTA, "Intermediário", POSTO_FORA_PONTA];
  return Array.from(out).sort(
    (a, b) =>
      (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99) ||
      a.localeCompare(b, "pt-BR")
  );
}
