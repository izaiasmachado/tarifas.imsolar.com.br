/** Um registro de tarifa sem impostos (uma linha da tabela ANEEL processada). */
export interface Tarifa {
  concessionaria: string;
  subgrupo: string;
  modalidade: string;
  classe: string;
  subclasse: string;
  detalhe: string;
  posto: string;
  unidade: string;
  acessante: string;
  /** Valores monetários em string (decimal com ponto). */
  totalTUSD: string;
  totalTE: string;
  TUSDFioB: string;
}

/** Registro derivado para a calculadora de fator de ajuste (Grupo A). */
export interface FatorAjuste {
  concessionaria: string;
  subgrupo: string;
  modalidade: string;
  totalTEForaPonta: string;
  totalTEPonta: string;
  fatorAjuste: string;
}

/** Metadados do dataset, exibidos no site (data de atualização etc.). */
export interface DatasetMeta {
  /** Data ISO (YYYY-MM-DD) em que os dados foram gerados/atualizados. */
  updatedAt: string;
  /**
   * Momento exato da geração (ISO 8601 com fuso, ex.: 2026-05-27T12:00:00+00:00).
   * Opcional: dados gerados antes desta versão do script não têm o campo.
   */
  generatedAt?: string;
  /** Início da vigência das tarifas, se conhecido. */
  vigenciaInicio: string | null;
  fonte: string;
  fonteUrl: string;
  totalRegistros: number;
  observacao?: string;
}

export type TarifaKey = keyof Tarifa;
export type FatorAjusteKey = keyof FatorAjuste;
