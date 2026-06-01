import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Info, Receipt, Zap } from "lucide-react";

import { DATA_PATHS } from "@/lib/data";
import { formatBRL, formatNumber } from "@/lib/format";
import type { Tarifa } from "@/lib/types";
import { useDataset } from "@/hooks/use-dataset";
import {
  buildTariffIndex,
  concessionariasFor,
  getConvencional,
  modalidadesFor,
} from "@/lib/tariff-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Seo, breadcrumbJsonLd } from "@/components/seo";
import { PageHeader } from "@/components/layout/page-header";
import { DataSource } from "@/components/data-source";
import { InfoHint } from "@/components/info-hint";
import {
  FaqBlock,
  InfoSection,
  faqJsonLd,
  type QA,
} from "@/components/info-section";

/** Subgrupos de baixa tensão (Grupo B), monômios. */
const GRUPO_B = ["B1", "B2", "B3", "B4"];

const FAQ: QA[] = [
  {
    q: "O valor estimado é igual ao da minha conta?",
    a: "Não exatamente. O simulador mostra apenas a parcela de energia sem impostos (TUSD + TE). A conta real inclui ICMS, PIS/COFINS, bandeira tarifária, iluminação pública e eventual taxa mínima, então será maior. Serve para comparar concessionárias e entender o peso da energia.",
  },
  {
    q: "O que é Grupo B?",
    a: "É o grupo de baixa tensão, que engloba a maioria das residências e pequenos comércios (subgrupos B1 a B4). Nele, a conta é cobrada apenas pelo consumo de energia (kWh), sem cobrança de demanda — diferente do Grupo A (alta tensão).",
  },
  {
    q: "Onde vejo meu consumo em kWh?",
    a: "Na sua conta de luz, normalmente em destaque, em kWh. Para uma estimativa mais estável ao longo do ano, some o consumo dos últimos 12 meses e divida por 12.",
  },
];

interface FormValues {
  concessionaria: string;
  subgrupo: string;
  modalidade: string;
  consumo: string;
}

export function SimuladorContaPage() {
  const { data, isLoading } = useDataset<Tarifa[]>(DATA_PATHS.tarifas);
  const index = useMemo(() => buildTariffIndex(data ?? []), [data]);

  const subgrupos = index.subgrupos.filter((s) => GRUPO_B.includes(s));

  const form = useForm<FormValues>({
    defaultValues: {
      concessionaria: "",
      subgrupo: "B1",
      modalidade: "Convencional",
      consumo: "",
    },
  });
  const { concessionaria, subgrupo, modalidade, consumo } = form.watch();

  const modalidadeOptions = useMemo(
    () => modalidadesFor(index, subgrupo),
    [index, subgrupo]
  );
  const concessionarias = useMemo(
    () => concessionariasFor(index, subgrupo, modalidade),
    [index, subgrupo, modalidade]
  );

  const rate = concessionaria
    ? getConvencional(index, concessionaria, subgrupo, modalidade)
    : undefined;

  const consumoKwh = Number(consumo) || 0;
  // Tarifas estão em R$/MWh; consumo em kWh → dividir por 1000.
  const result =
    rate && consumoKwh > 0
      ? {
          tusd: (rate.tusd / 1000) * consumoKwh,
          te: (rate.te / 1000) * consumoKwh,
          total: (rate.total / 1000) * consumoKwh,
          tarifaKwh: rate.total / 1000,
        }
      : null;

  return (
    <>
      <Seo
        title="Simulador de conta de luz (sem impostos) — Grupo B"
        description="Estime o valor da sua conta de energia sem impostos a partir do consumo em kWh e da concessionária, somando TUSD e TE, com dados da ANEEL."
        path="/simulador-conta"
        keywords={[
          "simulador de conta de luz",
          "calcular conta de energia",
          "valor do kWh",
          "tarifa residencial",
          "grupo B",
          "TUSD",
          "TE",
          "ANEEL",
        ]}
        jsonLd={[
          faqJsonLd(FAQ),
          breadcrumbJsonLd([
            { name: "Início", path: "/" },
            { name: "Simulador de conta", path: "/simulador-conta" },
          ]),
        ]}
      />

      <PageHeader
        title="Simulador de conta de luz — Grupo B"
        description="Estime o custo de energia (sem impostos) a partir do consumo mensal e da concessionária, para unidades de baixa tensão."
        breadcrumb={[{ label: "Simulador de conta" }]}
      />

      <div className="container grid gap-6 py-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-primary" /> Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="sc-subgrupo">Subgrupo</Label>
                  <Combobox
                    id="sc-subgrupo"
                    aria-label="Subgrupo"
                    value={subgrupo}
                    onChange={(v) => form.setValue("subgrupo", v)}
                    options={subgrupos.map((s) => ({ value: s, label: s }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sc-modalidade">Modalidade</Label>
                  <Combobox
                    id="sc-modalidade"
                    aria-label="Modalidade"
                    value={modalidade}
                    onChange={(v) => form.setValue("modalidade", v)}
                    options={modalidadeOptions.map((m) => ({
                      value: m,
                      label: m,
                    }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sc-conc">Concessionária</Label>
                  <Combobox
                    id="sc-conc"
                    aria-label="Concessionária"
                    value={concessionaria}
                    onChange={(v) => form.setValue("concessionaria", v)}
                    options={concessionarias.map((c) => ({
                      value: c,
                      label: c,
                    }))}
                    placeholder="Selecione…"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sc-consumo">Consumo mensal</Label>
                  <div className="relative">
                    <Input
                      id="sc-consumo"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      placeholder="0"
                      className="pr-12"
                      value={consumo}
                      onChange={(e) => form.setValue("consumo", e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      kWh
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="h-5 w-5 text-primary" /> Estimativa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!result && (
              <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                Selecione a concessionária e informe o consumo para ver a
                estimativa.
              </div>
            )}
            <dl className="divide-y">
              {[
                {
                  label: "Tarifa total (sem impostos)",
                  value: result ? `${formatBRL(result.tarifaKwh)}/kWh` : "—",
                },
                {
                  label: "TUSD (uso da rede)",
                  hint: "tusd" as const,
                  value: result ? formatBRL(result.tusd) : "—",
                },
                {
                  label: "TE (energia)",
                  hint: "te" as const,
                  value: result ? formatBRL(result.te) : "—",
                },
                {
                  label: "Total estimado no mês",
                  value: result ? formatBRL(result.total) : "—",
                  highlight: true,
                },
              ].map((o) => (
                <div
                  key={o.label}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <dt className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    {o.label}
                    {"hint" in o && o.hint && <InfoHint term={o.hint} />}
                  </dt>
                  <dd
                    className={
                      o.highlight
                        ? "text-lg font-bold tabular-nums text-primary"
                        : "font-semibold tabular-nums"
                    }
                  >
                    {o.value}
                  </dd>
                </div>
              ))}
            </dl>
            {result && (
              <p className="text-xs text-muted-foreground">
                Estimativa de {formatNumber(consumoKwh)} kWh. Valor{" "}
                <strong>sem impostos</strong> (ICMS, PIS/COFINS) e sem bandeiras
                tarifárias, contribuição de iluminação pública ou taxa mínima —
                a conta final da concessionária será maior.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="container space-y-10 pb-12">
        <InfoSection title="Como a conta de luz é formada">
          <p>
            A tarifa de energia (sem impostos) é a soma de dois componentes: a{" "}
            <strong>TUSD</strong> (Tarifa de Uso do Sistema de Distribuição), que
            paga o transporte da energia pela rede, e a <strong>TE</strong>{" "}
            (Tarifa de Energia), que paga a energia em si. Multiplicando essa
            tarifa pelo seu consumo em kWh, chega-se ao valor da energia antes
            dos impostos.
          </p>
          <p>
            A conta final que chega à sua casa é maior, porque inclui{" "}
            <strong>ICMS, PIS e COFINS</strong>, a{" "}
            <strong>bandeira tarifária</strong> do mês, a contribuição de
            iluminação pública (CIP/COSIP) e, se o consumo for muito baixo, o
            custo de disponibilidade (a “taxa mínima”). Este simulador mostra a
            parcela de energia sem impostos, útil para comparar concessionárias
            e dimensionar projetos.
          </p>
        </InfoSection>

        <InfoSection title="Perguntas frequentes">
          <FaqBlock items={FAQ} />
        </InfoSection>

        <DataSource />
      </div>
    </>
  );
}
