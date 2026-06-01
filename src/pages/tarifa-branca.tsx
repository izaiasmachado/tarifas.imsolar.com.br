import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Clock, Info, TrendingDown, TrendingUp } from "lucide-react";

import { DATA_PATHS } from "@/lib/data";
import { formatBRL, formatNumber } from "@/lib/format";
import type { Tarifa } from "@/lib/types";
import { useDataset } from "@/hooks/use-dataset";
import {
  buildTariffIndex,
  concessionariasFor,
  getConvencional,
} from "@/lib/tariff-queries";
import {
  BRANCA_FONTE,
  HORARIOS_BRANCA,
  compararBranca,
} from "@/lib/tarifa-branca";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { Field, InputWithUnit } from "@/components/ui/field";
import { Seo, breadcrumbJsonLd } from "@/components/seo";
import { PageHeader } from "@/components/layout/page-header";
import { DataSource } from "@/components/data-source";
import {
  FaqBlock,
  InfoSection,
  faqJsonLd,
  type QA,
} from "@/components/info-section";

interface FormValues {
  concessionaria: string;
  consumo: string;
  pctPonta: string;
  pctIntermediario: string;
}

const FAQ: QA[] = [
  {
    q: "O que é a Tarifa Branca?",
    a: "É uma opção de tarifa para consumidores de baixa tensão (Grupo B) em que o preço da energia varia conforme o horário: mais caro na ponta (início da noite), intermediário na transição e mais barato no restante do dia, nos fins de semana e feriados. Na tarifa Convencional, o preço é único o dia todo.",
  },
  {
    q: "Quando vale a pena a Tarifa Branca?",
    a: "Vale a pena para quem consegue deslocar o consumo para fora do horário de ponta (aproximadamente 17h30 às 21h30 nos dias úteis). Se a maior parte do seu consumo é de madrugada, de manhã ou nos fins de semana, a Branca tende a sair mais barata. Para quem usa muita energia no início da noite, ela fica mais cara.",
  },
  {
    q: "Quais são os horários de cada posto?",
    a: "Os horários exatos variam por distribuidora. Um padrão comum (Enel SP) é: ponta das 17h30 às 20h30; intermediário das 16h30 às 17h30 e das 20h30 às 21h30; e fora ponta nas demais horas, além de fins de semana e feriados (que são integralmente fora ponta).",
  },
  {
    q: "Como peço a Tarifa Branca?",
    a: "A adesão é gratuita e feita junto à distribuidora. É necessário ter medidor eletrônico (a troca costuma ser sem custo). Você pode voltar para a Convencional depois, respeitando o prazo mínimo definido pela distribuidora.",
  },
];

const POSTOS = [
  { id: "ponta", nome: "Ponta", horario: HORARIOS_BRANCA.ponta, cor: "bg-red-500" },
  {
    id: "intermediario",
    nome: "Intermediário",
    horario: HORARIOS_BRANCA.intermediario,
    cor: "bg-yellow-400",
  },
  {
    id: "fora",
    nome: "Fora ponta",
    horario: HORARIOS_BRANCA.foraPonta,
    cor: "bg-emerald-500",
  },
];

export function TarifaBrancaPage() {
  const { data } = useDataset<Tarifa[]>(DATA_PATHS.tarifas);
  const index = useMemo(() => buildTariffIndex(data ?? []), [data]);
  const concessionarias = useMemo(
    () => concessionariasFor(index, "B1", "Convencional"),
    [index]
  );

  const form = useForm<FormValues>({
    defaultValues: {
      concessionaria: "",
      consumo: "",
      pctPonta: "20",
      pctIntermediario: "15",
    },
  });
  const { concessionaria, consumo, pctPonta, pctIntermediario } = form.watch();

  const rate = concessionaria
    ? getConvencional(index, concessionaria, "B1", "Convencional")
    : undefined;
  const tarifaKwh = rate ? rate.total / 1000 : undefined;

  const consumoKwh = Number(consumo) || 0;
  const fPonta = Math.min(100, Math.max(0, Number(pctPonta) || 0)) / 100;
  const fInter =
    Math.min(100, Math.max(0, Number(pctIntermediario) || 0)) / 100;
  const fFora = Math.max(0, 1 - fPonta - fInter);

  const comparacao =
    tarifaKwh && consumoKwh > 0
      ? compararBranca(tarifaKwh, consumoKwh, fPonta, fInter)
      : null;

  return (
    <>
      <Seo
        title="Tarifa Branca vale a pena? Compare com a Convencional"
        description="Compare a Tarifa Branca com a Convencional conforme seus horários de consumo e descubra se vale a pena migrar. Entenda os postos (ponta, intermediário e fora ponta)."
        path="/tarifa-branca"
        keywords={[
          "tarifa branca",
          "tarifa branca vale a pena",
          "tarifa branca x convencional",
          "horário de ponta",
          "posto tarifário",
          "economia de energia",
          "grupo B",
        ]}
        jsonLd={[
          faqJsonLd(FAQ),
          breadcrumbJsonLd([
            { name: "Início", path: "/" },
            { name: "Tarifa Branca", path: "/tarifa-branca" },
          ]),
        ]}
      />

      <PageHeader
        title="Tarifa Branca vs Convencional"
        description="Descubra se a Tarifa Branca vale a pena para o seu perfil de consumo ao longo do dia."
        breadcrumb={[{ label: "Tarifa Branca" }]}
      />

      <div className="container grid gap-6 py-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" /> Seu consumo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field htmlFor="tb-conc" label="Concessionária">
              <Combobox
                id="tb-conc"
                value={concessionaria}
                onChange={(v) => form.setValue("concessionaria", v)}
                options={concessionarias.map((c) => ({ value: c, label: c }))}
                placeholder="Selecione…"
              />
            </Field>
            <Field htmlFor="tb-consumo" label="Consumo mensal">
              <InputWithUnit
                id="tb-consumo"
                type="number"
                inputMode="decimal"
                min="0"
                placeholder="0"
                unit="kWh"
                value={consumo}
                onChange={(e) => form.setValue("consumo", e.target.value)}
              />
            </Field>
            <Field
              htmlFor="tb-ponta"
              label="% do consumo na ponta"
              hint="posto"
              description="Quanto do seu consumo ocorre entre ~17h30 e 20h30 nos dias úteis."
            >
              <InputWithUnit
                id="tb-ponta"
                type="number"
                min="0"
                max="100"
                unit="%"
                value={pctPonta}
                onChange={(e) => form.setValue("pctPonta", e.target.value)}
              />
            </Field>
            <Field
              htmlFor="tb-inter"
              label="% do consumo no intermediário"
              description="As duas horas em torno da ponta (~16h30–17h30 e 20h30–21h30)."
            >
              <InputWithUnit
                id="tb-inter"
                type="number"
                min="0"
                max="100"
                unit="%"
                value={pctIntermediario}
                onChange={(e) =>
                  form.setValue("pctIntermediario", e.target.value)
                }
              />
            </Field>
            <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              Fora ponta:{" "}
              <strong className="text-foreground">
                {formatNumber(fFora * 100)}%
              </strong>{" "}
              do consumo (madrugada, manhã, tarde e fins de semana).
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Comparação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!comparacao && (
              <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                Selecione a concessionária e informe o consumo para comparar.
              </div>
            )}
            {comparacao && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-xs text-muted-foreground">Convencional</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums">
                      {formatBRL(comparacao.custoConvencional)}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg border p-4 text-center",
                      comparacao.vantajosa
                        ? "border-primary bg-primary/5"
                        : "border-destructive/40 bg-destructive/5"
                    )}
                  >
                    <p className="text-xs text-muted-foreground">Branca</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums">
                      {formatBRL(comparacao.custoBranca)}
                    </p>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg p-4 text-center font-semibold",
                    comparacao.vantajosa
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {comparacao.vantajosa ? (
                    <>
                      <TrendingDown className="h-5 w-5" />
                      A Tarifa Branca economiza{" "}
                      {formatBRL(comparacao.economia)}/mês (
                      {formatNumber(comparacao.economiaPct)}%)
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-5 w-5" />
                      A Convencional é melhor:{" "}
                      {formatBRL(Math.abs(comparacao.economia))}/mês a menos
                    </>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  Comparação estimada com base nos fatores médios de preço por
                  posto da Tarifa Branca (referência ANEEL), aplicados sobre a
                  tarifa convencional da concessionária. A tarifa branca real de
                  cada distribuidora pode diferir.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="container space-y-10 pb-12">
        <InfoSection title="Como funciona a Tarifa Branca">
          <p>
            A Tarifa Branca é uma opção para quem é do Grupo B (baixa tensão,
            como residências e pequenos comércios) e quer pagar pela energia de
            acordo com o horário de uso. Em vez de um preço único, ela divide o
            dia em três postos:
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {POSTOS.map((p) => (
              <div key={p.id} className="rounded-lg border p-3">
                <div className="mb-1 flex items-center gap-2">
                  <span className={cn("h-3 w-3 rounded-full", p.cor)} />
                  <span className="font-semibold text-foreground">{p.nome}</span>
                </div>
                <p className="text-xs">{p.horario}</p>
              </div>
            ))}
          </div>
          <p>
            Na ponta, a energia é bem mais cara que na Convencional; fora ponta,
            mais barata. O intermediário fica perto da Convencional. Por isso, a
            Branca premia quem usa energia longe do início da noite.
          </p>
        </InfoSection>

        <InfoSection title="Para quem a Tarifa Branca compensa">
          <p>
            Costuma compensar para quem fica fora de casa no fim da tarde e
            início da noite, ou que consegue programar os aparelhos de maior
            consumo (máquina de lavar, ferro, forno, carga de carro elétrico)
            para a madrugada, a manhã ou os fins de semana — que são
            integralmente fora ponta. Para famílias com pico de consumo entre
            18h e 21h (chuveiro, ar-condicionado, cozinha), a Convencional
            normalmente sai mais barata.
          </p>
        </InfoSection>

        <InfoSection title="Perguntas frequentes">
          <FaqBlock items={FAQ} />
        </InfoSection>

        <DataSource />
        <p className="text-center text-xs text-muted-foreground">
          Saiba mais na fonte oficial:{" "}
          <a
            href={BRANCA_FONTE}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            ANEEL — Tarifa Branca
          </a>
          .
        </p>
      </div>
    </>
  );
}
