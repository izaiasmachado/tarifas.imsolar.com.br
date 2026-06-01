import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Info, PiggyBank, Sun } from "lucide-react";

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
import {
  FaqBlock,
  InfoSection,
  faqJsonLd,
  type QA,
} from "@/components/info-section";

const FAQ: QA[] = [
  {
    q: "Como é estimada a economia com energia solar?",
    a: "Multiplicamos o seu consumo compensado pela tarifa de energia sem impostos da concessionária, chegando à economia mensal e anual. O tempo de retorno (payback) é o custo estimado do sistema dividido por essa economia.",
  },
  {
    q: "O que é payback?",
    a: "É o tempo necessário para que a economia gerada pela energia solar pague o investimento inicial. Em sistemas residenciais no Brasil, costuma ficar entre 4 e 7 anos, enquanto os painéis têm vida útil de 25 anos ou mais.",
  },
  {
    q: "A economia real pode ser diferente?",
    a: "Sim. A economia depende da geração efetiva, das regras de compensação (Lei 14.300/2022), do custo de disponibilidade e de eventuais reajustes tarifários. Esta é uma estimativa para planejamento, não uma garantia.",
  },
];

const GRUPO_B = ["B1", "B2", "B3", "B4"];

interface FormValues {
  concessionaria: string;
  subgrupo: string;
  modalidade: string;
  consumo: string;
  custoSistema: string;
}

export function EconomiaSolarPage() {
  const { data, isLoading } = useDataset<Tarifa[]>(DATA_PATHS.tarifas);
  const index = useMemo(() => buildTariffIndex(data ?? []), [data]);

  const subgrupos = index.subgrupos.filter((s) => GRUPO_B.includes(s));

  const form = useForm<FormValues>({
    defaultValues: {
      concessionaria: "",
      subgrupo: "B1",
      modalidade: "Convencional",
      consumo: "",
      custoSistema: "",
    },
  });
  const { concessionaria, subgrupo, modalidade, consumo, custoSistema } =
    form.watch();

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
  const custo = Number(custoSistema) || 0;

  // Modelo simplificado (sem impostos): a energia compensada economiza a
  // tarifa cheia menos a parcela do Fio B cobrada sobre a injeção (Lei
  // 14.300). Tarifas em R$/MWh → R$/kWh dividindo por 1000.
  const result =
    rate && consumoKwh > 0
      ? (() => {
          const tarifaKwh = rate.total / 1000;
          const fioBKwh = rate.fioB / 1000;
          const economiaKwh = Math.max(tarifaKwh - fioBKwh, 0);
          const economiaMes = economiaKwh * consumoKwh;
          const economiaAno = economiaMes * 12;
          const paybackAnos = custo > 0 && economiaAno > 0
            ? custo / economiaAno
            : null;
          return {
            tarifaKwh,
            economiaKwh,
            economiaMes,
            economiaAno,
            paybackAnos,
          };
        })()
      : null;

  return (
    <>
      <Seo
        title="Calculadora de economia com energia solar"
        description="Estime a economia mensal e anual e o tempo de retorno (payback) de um sistema de energia solar, a partir do seu consumo e da tarifa da concessionária, com dados da ANEEL."
        path="/economia-solar"
        keywords={[
          "economia energia solar",
          "payback solar",
          "retorno do investimento solar",
          "geração distribuída",
          "Lei 14.300",
          "TUSD Fio B",
          "quanto economizo com solar",
          "ANEEL",
        ]}
        jsonLd={[
          faqJsonLd(FAQ),
          breadcrumbJsonLd([
            { name: "Início", path: "/" },
            { name: "Economia com solar", path: "/economia-solar" },
          ]),
        ]}
      />

      <PageHeader
        title="Calculadora de economia com energia solar"
        description="Estime quanto um sistema solar pode economizar por mês e por ano e em quanto tempo ele se paga, a partir do seu consumo e da sua concessionária."
        breadcrumb={[{ label: "Economia com solar" }]}
      />

      <div className="container grid gap-6 py-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sun className="h-5 w-5 text-primary" /> Dados
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
                <div className="space-y-1.5">
                  <Label htmlFor="es-subgrupo">Subgrupo</Label>
                  <Combobox
                    id="es-subgrupo"
                    aria-label="Subgrupo"
                    value={subgrupo}
                    onChange={(v) => form.setValue("subgrupo", v)}
                    options={subgrupos.map((s) => ({ value: s, label: s }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="es-modalidade">Modalidade</Label>
                  <Combobox
                    id="es-modalidade"
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
                  <Label htmlFor="es-conc">Concessionária</Label>
                  <Combobox
                    id="es-conc"
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
                  <Label htmlFor="es-consumo">Consumo mensal</Label>
                  <div className="relative">
                    <Input
                      id="es-consumo"
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
                <div className="space-y-1.5">
                  <Label htmlFor="es-custo">
                    Custo do sistema (opcional, para o payback)
                  </Label>
                  <div className="relative">
                    <Input
                      id="es-custo"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      placeholder="0"
                      className="pl-10"
                      value={custoSistema}
                      onChange={(e) =>
                        form.setValue("custoSistema", e.target.value)
                      }
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      R$
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
              <PiggyBank className="h-5 w-5 text-primary" /> Economia estimada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!result && (
              <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                Selecione a concessionária e informe o consumo para estimar a
                economia.
              </div>
            )}
            <dl className="divide-y">
              {[
                {
                  label: "Economia por kWh compensado",
                  value: result
                    ? `${formatBRL(result.economiaKwh)}/kWh`
                    : "—",
                },
                {
                  label: "Economia mensal estimada",
                  value: result ? formatBRL(result.economiaMes) : "—",
                },
                {
                  label: "Economia anual estimada",
                  value: result ? formatBRL(result.economiaAno) : "—",
                  highlight: true,
                },
                {
                  label: "Tempo de retorno (payback)",
                  value: result?.paybackAnos
                    ? `${formatNumber(result.paybackAnos)} anos`
                    : "—",
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
                Modelo simplificado: assume que a geração compensa 100% do
                consumo e economiza a tarifa cheia menos a parcela da TUSD Fio B
                cobrada sobre a injeção (Lei 14.300/2022), <strong>sem
                impostos</strong>. Não considera o Fio B progressivo por ano,
                custo de disponibilidade, inflação tarifária nem degradação do
                sistema — use como estimativa inicial.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="container space-y-10 pb-12">
        <InfoSection title="Como a energia solar gera economia">
          <p>
            Um sistema solar reduz a energia que você compra da distribuidora: o
            que o sistema gera abate o seu consumo, e o excedente vira créditos
            para os meses seguintes. A economia, em reais, é o consumo compensado
            multiplicado pela tarifa de energia — por isso, quanto mais cara a
            tarifa da sua concessionária, maior o retorno.
          </p>
          <p>
            O <strong>payback</strong> é o tempo para a economia acumulada pagar o
            investimento. Depois disso, a energia gerada é praticamente gratuita
            pelo resto da vida útil do sistema (25 anos ou mais). Esta calculadora
            dá uma estimativa a partir do seu consumo, da concessionária e do
            custo do sistema.
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
