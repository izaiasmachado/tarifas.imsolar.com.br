import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Calculator, Info, Zap } from "lucide-react";

import { DATA_PATHS, SHOW_ALL } from "@/lib/data";
import { formatBRL, formatFator, formatNumber } from "@/lib/format";
import type { FatorAjuste } from "@/lib/types";
import { useDataset } from "@/hooks/use-dataset";
import {
  resolveCascadingFilters,
  defaultFilterValues,
  type FilterDef,
} from "@/lib/cascading-filters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Seo, breadcrumbJsonLd } from "@/components/seo";
import { PageHeader } from "@/components/layout/page-header";
import {
  FaqBlock,
  InfoSection,
  faqJsonLd,
  type QA,
} from "@/components/info-section";

const FILTERS: FilterDef<FatorAjuste>[] = [
  { key: "concessionaria", label: "Concessionária" },
  { key: "subgrupo", label: "Subgrupo" },
  { key: "modalidade", label: "Modalidade" },
];

const FAQ: QA[] = [
  {
    q: "O que é o fator de ajuste da TE no Grupo A?",
    a: "É a relação entre a Tarifa de Energia (TE) fora ponta e a TE na ponta. Como a energia na ponta é mais cara, para compensar 1 kWh consumido na ponta com geração feita fora ponta é preciso gerar mais do que 1 kWh — exatamente na proporção do fator de ajuste.",
  },
  {
    q: "Para quem serve essa calculadora?",
    a: "Para projetos de geração distribuída em clientes do Grupo A (média/alta tensão) com tarifação horária (modalidades azul e verde), onde o consumo e a geração ocorrem em postos com preços diferentes.",
  },
  {
    q: "Como interpreto o resultado?",
    a: "A 'geração ajustada para compensar a ponta' indica quanta energia fora ponta é necessária para zerar, em valor de TE, o consumo da ponta. Some a isso o consumo fora ponta para obter a geração total necessária.",
  },
  {
    q: "Os valores incluem impostos?",
    a: "Não. O cálculo usa a TE sem impostos da base da ANEEL. A compensação real também depende das regras da distribuidora e da Lei 14.300/2022.",
  },
];

interface FormValues {
  concessionaria: string;
  subgrupo: string;
  modalidade: string;
  consumoPonta: string;
  consumoForaPonta: string;
}

interface Result {
  teForaPonta: number;
  tePonta: number;
  fator: number;
  geracaoCompensaPonta: number;
  geracaoTotal: number;
}

/** Cálculo puro do fator de ajuste — sem efeitos colaterais. */
function compute(
  row: FatorAjuste | undefined,
  consumoPonta: number,
  consumoForaPonta: number
): Result | null {
  if (!row) return null;
  const fator = Number(row.fatorAjuste);
  if (!Number.isFinite(fator) || fator === 0) return null;

  const geracaoCompensaPonta = consumoPonta / fator;
  return {
    teForaPonta: Number(row.totalTEForaPonta),
    tePonta: Number(row.totalTEPonta),
    fator,
    geracaoCompensaPonta,
    geracaoTotal: geracaoCompensaPonta + consumoForaPonta,
  };
}

export function FatorAjustePage() {
  const { data, isLoading } = useDataset<FatorAjuste[]>(DATA_PATHS.fatorAjuste);
  const rows = useMemo(() => data ?? [], [data]);

  // Filtros e consumo vivem no react-hook-form; o resultado é derivado.
  const form = useForm<FormValues>({
    defaultValues: {
      ...defaultFilterValues(FILTERS),
      consumoPonta: "",
      consumoForaPonta: "",
    } as FormValues,
  });
  const values = form.watch();

  const { filters, filtered } = useMemo(
    () =>
      resolveCascadingFilters(rows, FILTERS, {
        concessionaria: values.concessionaria,
        subgrupo: values.subgrupo,
        modalidade: values.modalidade,
      }),
    [rows, values.concessionaria, values.subgrupo, values.modalidade]
  );

  const selectedRow = filtered.length === 1 ? filtered[0] : undefined;
  const result = compute(
    selectedRow,
    Number(values.consumoPonta) || 0,
    Number(values.consumoForaPonta) || 0
  );

  const outputs = [
    {
      label: "TE Fora Ponta",
      value: result ? formatBRL(result.teForaPonta) : "—",
    },
    { label: "TE Ponta", value: result ? formatBRL(result.tePonta) : "—" },
    {
      label: "Fator de ajuste",
      value: result ? formatFator(result.fator) : "—",
      highlight: true,
    },
    {
      label: "Geração ajustada p/ compensar a ponta",
      value: result ? `${formatNumber(result.geracaoCompensaPonta)} kWh` : "—",
    },
    {
      label: "Geração total necessária",
      value: result ? `${formatNumber(result.geracaoTotal)} kWh` : "—",
    },
  ];

  return (
    <>
      <Seo
        title="Calculadora de fator de ajuste TE — Grupo A"
        description="Calcule a geração fora ponta necessária para compensar o consumo na ponta em unidades do Grupo A com tarifação binômia (azul/verde), usando o fator de ajuste da TE por concessionária."
        path="/fator-ajuste-grupo-a"
        keywords={[
          "fator de ajuste",
          "fator de ajuste TE",
          "grupo A",
          "tarifação binômia",
          "tarifa azul",
          "tarifa verde",
          "geração fora ponta",
          "compensação ponta",
          "geração distribuída",
        ]}
        jsonLd={[
          faqJsonLd(FAQ),
          breadcrumbJsonLd([
            { name: "Início", path: "/" },
            { name: "Fator de ajuste", path: "/fator-ajuste-grupo-a" },
          ]),
        ]}
      />

      <PageHeader
        title="Calculadora de fator de ajuste TE — Grupo A"
        description="Para clientes do Grupo A com tarifação binômia, calcule quanta energia fora ponta é necessário gerar para compensar o consumo na hora ponta."
        breadcrumb={[{ label: "Fator de ajuste" }]}
      />

      <div className="container grid gap-6 py-8 lg:grid-cols-2">
        {/* Entrada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-primary" /> Dados de consumo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))}
              </div>
            ) : (
              <>
                {filters.map((filter) => {
                  const id = `fa-${String(filter.key)}`;
                  return (
                    <div key={String(filter.key)} className="space-y-1.5">
                      <Label htmlFor={id}>{filter.label}</Label>
                      <Combobox
                        id={id}
                        aria-label={filter.label}
                        value={filter.value}
                        onChange={(value) =>
                          form.setValue(
                            filter.key as keyof FormValues,
                            value
                          )
                        }
                        options={filter.options.map((o) => ({
                          value: o,
                          label: o === SHOW_ALL ? "Selecione…" : o,
                        }))}
                        placeholder="Selecione…"
                        searchPlaceholder={`Buscar ${filter.label.toLowerCase()}…`}
                      />
                    </div>
                  );
                })}

                <div className="space-y-1.5">
                  <Label htmlFor="consumo-ponta">Consumo na ponta</Label>
                  <div className="relative">
                    <Input
                      id="consumo-ponta"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      placeholder="0"
                      className="pr-12"
                      value={values.consumoPonta}
                      onChange={(e) =>
                        form.setValue("consumoPonta", e.target.value)
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      kWh
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="consumo-fora-ponta">
                    Consumo fora da ponta
                  </Label>
                  <div className="relative">
                    <Input
                      id="consumo-fora-ponta"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      placeholder="0"
                      className="pr-12"
                      value={values.consumoForaPonta}
                      onChange={(e) =>
                        form.setValue("consumoForaPonta", e.target.value)
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      kWh
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => form.reset()}
                  className="w-full"
                >
                  Limpar campos
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Resultado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-primary" /> Resultado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!selectedRow && !isLoading && (
              <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                Selecione concessionária, subgrupo e modalidade para ver o fator
                de ajuste.
              </div>
            )}
            <dl className="divide-y">
              {outputs.map((output) => (
                <div
                  key={output.label}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <dt className="text-sm text-muted-foreground">
                    {output.label}
                  </dt>
                  <dd
                    className={
                      output.highlight
                        ? "text-lg font-bold tabular-nums text-primary"
                        : "font-semibold tabular-nums"
                    }
                  >
                    {output.value}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="container space-y-10 pb-12">
        <InfoSection title="O que é o fator de ajuste da TE">
          <p>
            No Grupo A com tarifação horária (modalidades azul e verde), a Tarifa
            de Energia (TE) é mais cara no horário de <strong>ponta</strong> do
            que <strong>fora ponta</strong>. Quando um cliente gera a própria
            energia (geração distribuída) fora ponta para compensar o que
            consumiu na ponta, a compensação não é de 1 para 1: como o kWh da
            ponta vale mais, é preciso gerar uma quantidade maior fora ponta.
          </p>
          <p>
            O <strong>fator de ajuste</strong> é justamente essa proporção
            (TE&nbsp;fora&nbsp;ponta ÷ TE&nbsp;ponta). Esta calculadora aplica o
            fator da concessionária escolhida ao seu consumo na ponta, mostrando
            quanta geração fora ponta é necessária para compensá-lo e qual a
            geração total para zerar a conta de energia.
          </p>
        </InfoSection>

        <InfoSection title="Perguntas frequentes">
          <FaqBlock items={FAQ} />
        </InfoSection>
      </div>
    </>
  );
}
