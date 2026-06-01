/**
 * Potências típicas de eletrodomésticos no Brasil (em watts), usadas como
 * presets na calculadora de consumo. Valores médios — variam por modelo.
 *
 * Fonte: tabelas de potência de distribuidoras e Mundo da Elétrica.
 */
export interface Aparelho {
  nome: string;
  watts: number;
  /** Horas de uso por dia sugeridas como ponto de partida. */
  horasPadrao: number;
}

export const APARELHOS: Aparelho[] = [
  { nome: "Chuveiro elétrico", watts: 5500, horasPadrao: 0.67 },
  { nome: "Ar-condicionado split 9.000 BTU", watts: 800, horasPadrao: 8 },
  { nome: "Ar-condicionado split 12.000 BTU", watts: 1300, horasPadrao: 8 },
  { nome: "Geladeira", watts: 150, horasPadrao: 24 },
  { nome: "Freezer", watts: 200, horasPadrao: 24 },
  { nome: "Máquina de lavar roupa", watts: 1500, horasPadrao: 1 },
  { nome: "Micro-ondas", watts: 1300, horasPadrao: 0.5 },
  { nome: "Ferro de passar", watts: 1200, horasPadrao: 0.5 },
  { nome: "Forno elétrico", watts: 1500, horasPadrao: 0.5 },
  { nome: "Secador de cabelo", watts: 1500, horasPadrao: 0.25 },
  { nome: "TV LED 40–50\"", watts: 100, horasPadrao: 5 },
  { nome: "Computador desktop", watts: 350, horasPadrao: 6 },
  { nome: "Notebook", watts: 65, horasPadrao: 6 },
  { nome: "Ventilador", watts: 100, horasPadrao: 8 },
  { nome: "Bomba d'água", watts: 750, horasPadrao: 1 },
  { nome: "Lâmpada LED", watts: 10, horasPadrao: 5 },
];

export const APARELHOS_FONTE =
  "https://www.mundodaeletrica.com.br/tabela-de-potencia-dos-eletrodomesticos/";

/** Energia mensal (kWh) de um aparelho: W × h/dia × 30 ÷ 1000. */
export function consumoMensalKwh(
  watts: number,
  horasDia: number,
  quantidade = 1,
  diasMes = 30
): number {
  return (watts * horasDia * quantidade * diasMes) / 1000;
}
