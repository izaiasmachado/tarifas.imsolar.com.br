import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { DATA_PATHS } from "@/lib/data";
import { formatBRL } from "@/lib/format";
import type { Tarifa } from "@/lib/types";
import { useDataset } from "@/hooks/use-dataset";
import {
  buildTariffIndex,
  modalidadesFor,
  postosFor,
  rankByMetric,
  type Metric,
} from "@/lib/tariff-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Seo, breadcrumbJsonLd } from "@/components/seo";
import { PageHeader } from "@/components/layout/page-header";
import { DataSource } from "@/components/data-source";

const METRICS: { value: Metric; label: string }[] = [
  { value: "total", label: "TUSD + TE (tarifa total)" },
  { value: "te", label: "TE (energia)" },
  { value: "tusd", label: "TUSD (distribuição)" },
  { value: "fioB", label: "TUSD Fio B" },
];

interface FormValues {
  subgrupo: string;
  modalidade: string;
  posto: string;
  metric: Metric;
}

export function RankingPage() {
  const { data, isLoading } = useDataset<Tarifa[]>(DATA_PATHS.tarifas);
  const index = useMemo(
    () => buildTariffIndex(data ?? []),
    [data]
  );

  const form = useForm<FormValues>({
    defaultValues: {
      subgrupo: "B1",
      modalidade: "Convencional",
      posto: "Não se aplica",
      metric: "total",
    },
  });
  const { subgrupo, modalidade, posto, metric } = form.watch();

  const modalidadeOptions = useMemo(
    () => modalidadesFor(index, subgrupo),
    [index, subgrupo]
  );
  const postoOptions = useMemo(
    () => postosFor(index, subgrupo, modalidade),
    [index, subgrupo, modalidade]
  );

  const ranking = useMemo(
    () => rankByMetric(index, subgrupo, modalidade, posto, metric),
    [index, subgrupo, modalidade, posto, metric]
  );

  const max = ranking[0]?.value ?? 0;
  const metricLabel =
    METRICS.find((m) => m.value === metric)?.label ?? "valor";

  return (
    <>
      <Seo
        title="Ranking de tarifas de energia por concessionária"
        description="Concessionárias de energia ordenadas da mais cara para a mais barata por TUSD, TE e tarifa total (sem impostos), por subgrupo e modalidade, com dados da ANEEL."
        path="/ranking"
        keywords={[
          "ranking de tarifas",
          "tarifa mais cara",
          "tarifa mais barata",
          "concessionária mais cara",
          "comparar tarifas",
          "TUSD",
          "TE",
          "ANEEL",
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Ranking de tarifas", path: "/ranking" },
        ])}
      />

      <PageHeader
        title="Ranking de tarifas por concessionária"
        description="Veja quais concessionárias têm as tarifas mais altas e mais baixas do Brasil, por subgrupo, modalidade e componente tarifário."
        breadcrumb={[{ label: "Ranking de tarifas" }]}
      />

      <div className="container space-y-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Parâmetros</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor="rk-subgrupo">Subgrupo</Label>
              <Combobox
                id="rk-subgrupo"
                aria-label="Subgrupo"
                value={subgrupo}
                onChange={(v) => form.setValue("subgrupo", v)}
                options={index.subgrupos.map((s) => ({ value: s, label: s }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rk-modalidade">Modalidade</Label>
              <Combobox
                id="rk-modalidade"
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
              <Label htmlFor="rk-posto">Posto</Label>
              <Combobox
                id="rk-posto"
                aria-label="Posto"
                value={posto}
                onChange={(v) => form.setValue("posto", v)}
                options={postoOptions.map((p) => ({
                  value: p,
                  label: p === "Não se aplica" ? "Convencional" : p,
                }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rk-metric">Componente</Label>
              <Combobox
                id="rk-metric"
                aria-label="Componente"
                value={metric}
                onChange={(v) => form.setValue("metric", v as Metric)}
                options={METRICS.map((m) => ({
                  value: m.value,
                  label: m.label,
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : ranking.length === 0 ? (
          <p className="rounded-xl border bg-muted/30 p-6 text-center text-muted-foreground">
            Nenhuma tarifa para essa combinação. Tente outro posto ou
            modalidade.
          </p>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium text-muted-foreground">
                {ranking.length} concessionárias · {metricLabel} · valores em
                R$/MWh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {ranking.map((row, i) => (
                <div
                  key={row.concessionaria}
                  className="flex items-center gap-3"
                >
                  <span className="w-7 shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="w-40 shrink-0 truncate text-sm font-medium">
                    {row.concessionaria}
                  </span>
                  <div className="relative h-6 flex-1 overflow-hidden rounded bg-muted">
                    <div
                      className="h-full rounded bg-primary/80"
                      style={{
                        width: `${max > 0 ? (row.value / max) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right text-sm tabular-nums">
                    {formatBRL(row.value)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <DataSource />
      </div>
    </>
  );
}
