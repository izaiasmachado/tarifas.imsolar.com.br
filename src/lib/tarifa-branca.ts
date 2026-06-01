/**
 * Apoio à comparação Tarifa Branca × Convencional (Grupo B).
 *
 * A Tarifa Branca cobra preços diferentes por horário (posto): mais cara na
 * ponta, intermediária na transição e mais barata fora ponta. A Convencional
 * tem preço único. Vale a pena migrar para a Branca quem consegue concentrar o
 * consumo fora ponta (madrugada, manhã e fins de semana).
 *
 * Horários típicos (Enel SP); variam por distribuidora.
 */
export const HORARIOS_BRANCA = {
  ponta: "17h30 – 20h30 (dias úteis)",
  intermediario: "16h30 – 17h30 e 20h30 – 21h30 (dias úteis)",
  foraPonta: "demais horas, fins de semana e feriados",
};

/**
 * Fatores de preço da Tarifa Branca em relação à Convencional (aproximados,
 * referência ANEEL): fora ponta ~15% mais barata; ponta bem mais cara;
 * intermediário um pouco acima da convencional. Servem para uma comparação
 * didática quando não há a tarifa branca real da distribuidora na base.
 */
export const FATORES_BRANCA = {
  ponta: 1.6,
  intermediario: 1.1,
  foraPonta: 0.85,
};

export interface ComparacaoBranca {
  custoConvencional: number;
  custoBranca: number;
  economia: number;
  economiaPct: number;
  vantajosa: boolean;
}

/**
 * Compara o custo mensal entre Convencional e Branca dado o consumo total e a
 * distribuição percentual entre os postos.
 *
 * @param tarifaConvKwh Tarifa convencional em R$/kWh.
 * @param consumoKwh Consumo mensal total (kWh).
 * @param pctPonta Fração do consumo na ponta (0–1).
 * @param pctIntermediario Fração no intermediário (0–1).
 *  O restante é considerado fora ponta.
 */
export function compararBranca(
  tarifaConvKwh: number,
  consumoKwh: number,
  pctPonta: number,
  pctIntermediario: number
): ComparacaoBranca {
  const pctFora = Math.max(0, 1 - pctPonta - pctIntermediario);

  const kwhPonta = consumoKwh * pctPonta;
  const kwhInter = consumoKwh * pctIntermediario;
  const kwhFora = consumoKwh * pctFora;

  const custoConvencional = consumoKwh * tarifaConvKwh;
  const custoBranca =
    kwhPonta * tarifaConvKwh * FATORES_BRANCA.ponta +
    kwhInter * tarifaConvKwh * FATORES_BRANCA.intermediario +
    kwhFora * tarifaConvKwh * FATORES_BRANCA.foraPonta;

  const economia = custoConvencional - custoBranca;
  const economiaPct =
    custoConvencional > 0 ? (economia / custoConvencional) * 100 : 0;

  return {
    custoConvencional,
    custoBranca,
    economia,
    economiaPct,
    vantajosa: economia > 0,
  };
}

export const BRANCA_FONTE =
  "https://www.gov.br/aneel/pt-br/assuntos/tarifas/tarifa-branca";
