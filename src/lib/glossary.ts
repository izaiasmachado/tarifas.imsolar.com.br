/**
 * Glossário central dos termos tarifários. Usado pelo componente InfoHint (o
 * "(?)" ao lado dos rótulos) e pelas seções didáticas das páginas. Manter as
 * definições aqui evita divergência de texto entre as ferramentas.
 */
export interface GlossaryEntry {
  term: string;
  short: string;
  long: string;
}

export const GLOSSARY = {
  tusd: {
    term: "TUSD",
    short:
      "Tarifa de Uso do Sistema de Distribuição — remunera o uso da rede elétrica (fios, postes, transformadores) para levar a energia até você.",
    long: "A TUSD (Tarifa de Uso do Sistema de Distribuição) cobre o custo de transportar a energia pela rede da distribuidora: fios, postes, transformadores, perdas e a operação do sistema. É cobrada por kWh consumido e, no Grupo A, também por demanda (kW). Junto com a TE, forma a tarifa de energia antes dos impostos.",
  },
  te: {
    term: "TE",
    short:
      "Tarifa de Energia — corresponde ao custo da energia elétrica de fato gerada e comprada pela distribuidora.",
    long: "A TE (Tarifa de Energia) corresponde ao custo da energia efetivamente consumida — a compra de energia pela distribuidora nos leilões e a parcela de encargos e perdas associada. É cobrada por kWh. A soma de TUSD + TE é a tarifa de energia sem impostos.",
  },
  fioB: {
    term: "TUSD Fio B",
    short:
      "Parcela da TUSD ligada à distribuição local. É a base do cálculo da compensação da geração distribuída (Lei 14.300/2022).",
    long: "A TUSD Fio B é a parte da TUSD associada aos ativos de distribuição (a 'última milha' da rede). Ela é a referência para o pagamento gradual pelo uso da rede na geração distribuída (sistemas solares com compensação), conforme a Lei 14.300/2022 — o chamado 'fio B'.",
  },
  subgrupo: {
    term: "Subgrupo",
    short:
      "Classificação da unidade pela tensão de fornecimento. Grupo A é alta tensão (A1–A4, AS); Grupo B é baixa tensão (B1–B4).",
    long: "O subgrupo indica o nível de tensão de atendimento. O Grupo A (alta tensão, A1 a A4 e AS) reúne indústrias e grandes comércios, com tarifa binômia (energia + demanda). O Grupo B (baixa tensão, B1 residencial, B2 rural, B3 demais, B4 iluminação pública) é faturado só pelo consumo.",
  },
  modalidade: {
    term: "Modalidade tarifária",
    short:
      "Forma de tarifação: Convencional (preço único) ou horária (Branca, no Grupo B; Azul/Verde, no Grupo A).",
    long: "A modalidade define como a tarifa varia ao longo do dia. No Grupo B: Convencional (preço único) ou Branca (preços por posto horário). No Grupo A: Azul (demanda diferenciada por posto) ou Verde (demanda única), ambas com energia mais cara na ponta.",
  },
  posto: {
    term: "Posto tarifário",
    short:
      "Faixa de horário com preço distinto: Ponta (mais cara), Intermediário e Fora Ponta (mais barata).",
    long: "O posto tarifário é a faixa horária que define o preço da energia nas modalidades horárias. Ponta é o período de maior demanda (geralmente início da noite, mais caro); Fora Ponta é o restante (mais barato); Intermediário é a transição entre eles, usado na Tarifa Branca.",
  },
  fatorAjuste: {
    term: "Fator de ajuste da TE",
    short:
      "Relação entre a TE fora ponta e a TE na ponta no Grupo A. Indica quanta energia fora ponta compensa 1 kWh na ponta.",
    long: "No Grupo A com tarifação horária, a energia na ponta é mais cara que fora ponta. O fator de ajuste (TE fora ponta ÷ TE ponta) traduz essa diferença: para compensar o consumo da ponta com geração fora ponta, é preciso gerar mais energia, na proporção desse fator.",
  },
  bandeira: {
    term: "Bandeiras tarifárias",
    short:
      "Acréscimo na conta conforme o custo de geração: Verde (sem custo), Amarela e Vermelha (P1 e P2).",
    long: "As bandeiras tarifárias sinalizam o custo de gerar energia no mês. Verde não tem acréscimo; Amarela e Vermelha (patamares 1 e 2) adicionam um valor por kWh consumido, definido pela ANEEL, para cobrir o uso de termelétricas mais caras em períodos de escassez hídrica.",
  },
  hsp: {
    term: "HSP (Horas de Sol Pleno)",
    short:
      "Irradiação solar diária média de um local, em kWh/m²/dia. Quanto maior, mais um painel gera ali.",
    long: "HSP (Horas de Sol Pleno) é a irradiação solar diária média de uma região, expressa em kWh/m²/dia. Não é o número de horas de sol, mas a energia solar total do dia normalizada para 1000 W/m². É o principal fator para dimensionar quanto um sistema solar gera em cada local do Brasil.",
  },
} as const;

export type GlossaryKey = keyof typeof GLOSSARY;
