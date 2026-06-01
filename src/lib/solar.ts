/**
 * Constantes e fórmulas para o dimensionamento de sistemas fotovoltaicos no
 * Brasil. Valores de irradiação (HSP) são médias por região, baseadas no Atlas
 * Brasileiro de Energia Solar (CRESESB/INPE), no plano inclinado usado para
 * dimensionamento.
 */

export interface Regiao {
  id: string;
  nome: string;
  /** Horas de Sol Pleno médias (kWh/m²/dia). */
  hsp: number;
  exemplos: string;
}

export const REGIOES: Regiao[] = [
  { id: "norte", nome: "Norte", hsp: 4.8, exemplos: "AM, PA, AC, RO, RR, AP, TO" },
  { id: "nordeste", nome: "Nordeste", hsp: 5.8, exemplos: "BA, CE, PE, RN, PI…" },
  { id: "centro-oeste", nome: "Centro-Oeste", hsp: 5.5, exemplos: "GO, MT, MS, DF" },
  { id: "sudeste", nome: "Sudeste", hsp: 5.2, exemplos: "SP, RJ, MG, ES" },
  { id: "sul", nome: "Sul", hsp: 4.5, exemplos: "RS, SC, PR" },
];

/** HSP de fallback (média nacional) quando a região é desconhecida. */
export const HSP_NACIONAL = 5.2;

/** Fator de desempenho (performance ratio) padrão para sistemas residenciais. */
export const PERFORMANCE_RATIO = 0.78;

/** Potência típica de um módulo fotovoltaico atual (Wp). */
export const POTENCIA_MODULO_WP = 550;

/** Área aproximada de telhado por kWp instalado (m²/kWp). */
export const AREA_POR_KWP = 7;

/** Custo médio aproximado de um sistema instalado (R$/kWp), turnkey. */
export const CUSTO_POR_KWP = 4000;

export interface SistemaSolar {
  /** Potência do sistema (kWp). */
  kwp: number;
  /** Número de módulos (arredondado para cima). */
  modulos: number;
  /** Área aproximada necessária (m²). */
  areaM2: number;
  /** Geração mensal estimada (kWh). */
  geracaoMensalKwh: number;
  /** Custo estimado de instalação (R$). */
  custoEstimado: number;
}

/**
 * Dimensiona um sistema a partir do consumo mensal alvo e do HSP local.
 * Fórmula convencional: kWp = consumo / (HSP × 30 × PR).
 */
export function dimensionar(
  consumoMensalKwh: number,
  hsp: number,
  opts?: {
    performanceRatio?: number;
    potenciaModuloWp?: number;
    areaPorKwp?: number;
    custoPorKwp?: number;
  }
): SistemaSolar {
  const pr = opts?.performanceRatio ?? PERFORMANCE_RATIO;
  const moduloWp = opts?.potenciaModuloWp ?? POTENCIA_MODULO_WP;
  const areaPorKwp = opts?.areaPorKwp ?? AREA_POR_KWP;
  const custoPorKwp = opts?.custoPorKwp ?? CUSTO_POR_KWP;

  const kwp = consumoMensalKwh > 0 ? consumoMensalKwh / (hsp * 30 * pr) : 0;
  const modulos = Math.ceil((kwp * 1000) / moduloWp);
  // Recalcula a potência real instalada com base no nº inteiro de módulos.
  const kwpReal = (modulos * moduloWp) / 1000;

  return {
    kwp: kwpReal,
    modulos,
    areaM2: kwpReal * areaPorKwp,
    geracaoMensalKwh: kwpReal * hsp * 30 * pr,
    custoEstimado: kwpReal * custoPorKwp,
  };
}

export const SOLAR_FONTE = "https://cresesb.cepel.br/sundata/index.php";
