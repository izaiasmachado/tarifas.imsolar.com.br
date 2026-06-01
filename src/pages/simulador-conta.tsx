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

/** Subgrupos de baixa tensão (Grupo B), monômios. */
const GRUPO_B = ["B1", "B2", "B3", "B4"];

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
        jsonLd={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Simulador de conta", path: "/simulador-conta" },
        ])}
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
                  value: result
                    ? `${formatBRL(result.tarifaKwh)}/kWh`
                    : "—",
                },
                {
                  label: "TUSD (uso da rede)",
                  value: result ? formatBRL(result.tusd) : "—",
                },
                {
                  label: "TE (energia)",
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
                  <dt className="text-sm text-muted-foreground">{o.label}</dt>
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

      <div className="container pb-8">
        <DataSource />
      </div>
    </>
  );
}
