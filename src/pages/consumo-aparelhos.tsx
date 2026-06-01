import { useMemo, useState } from "react";
import { Plus, Trash2, Zap } from "lucide-react";

import { DATA_PATHS } from "@/lib/data";
import { formatBRL, formatNumber } from "@/lib/format";
import type { Tarifa } from "@/lib/types";
import { useDataset } from "@/hooks/use-dataset";
import {
  APARELHOS,
  APARELHOS_FONTE,
  consumoMensalKwh,
  type Aparelho,
} from "@/lib/aparelhos";
import {
  buildTariffIndex,
  concessionariasFor,
  getConvencional,
} from "@/lib/tariff-queries";
import { Button } from "@/components/ui/button";
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

interface Linha {
  id: number;
  nome: string;
  watts: number;
  horas: number;
  quantidade: number;
}

let nextId = 1;
function novaLinha(aparelho: Aparelho): Linha {
  return {
    id: nextId++,
    nome: aparelho.nome,
    watts: aparelho.watts,
    horas: aparelho.horasPadrao,
    quantidade: 1,
  };
}

const FAQ: QA[] = [
  {
    q: "Como calcular o consumo de um aparelho em kWh?",
    a: "Multiplique a potência do aparelho (em watts) pelas horas de uso por dia e pelos dias do mês, e divida por 1.000: kWh = (watts × horas/dia × 30) ÷ 1000. Por exemplo, um chuveiro de 5.500 W usado 40 minutos por dia consome cerca de 110 kWh por mês.",
  },
  {
    q: "Por que o chuveiro pesa tanto na conta?",
    a: "Porque tem potência altíssima (4.500 a 6.500 W). Mesmo usado poucos minutos, o consumo se acumula. Aparelhos que geram calor ou frio — chuveiro, ar-condicionado, ferro, forno, secador — são os que mais pesam na conta, mesmo com uso curto.",
  },
  {
    q: "As potências mostradas são exatas?",
    a: "São valores médios típicos de cada categoria, úteis para estimativa. O consumo real depende do modelo, da eficiência e do modo de uso. Você pode ajustar a potência e as horas de cada aparelho na calculadora.",
  },
  {
    q: "O valor em reais inclui impostos?",
    a: "Não. A estimativa usa a tarifa sem impostos (TUSD + TE) da concessionária escolhida. A conta final inclui ICMS, PIS/COFINS, bandeiras e iluminação pública, então será maior.",
  },
];

export function ConsumoAparelhosPage() {
  const { data } = useDataset<Tarifa[]>(DATA_PATHS.tarifas);
  const index = useMemo(() => buildTariffIndex(data ?? []), [data]);

  const concessionarias = useMemo(
    () => concessionariasFor(index, "B1", "Convencional"),
    [index]
  );
  const [concessionaria, setConcessionaria] = useState("");
  const [linhas, setLinhas] = useState<Linha[]>(() => [
    novaLinha(APARELHOS[0]),
    novaLinha(APARELHOS[3]),
  ]);

  const rate = concessionaria
    ? getConvencional(index, concessionaria, "B1", "Convencional")
    : undefined;
  const tarifaKwh = rate ? rate.total / 1000 : undefined;

  const linhasCalc = linhas.map((l) => ({
    ...l,
    kwh: consumoMensalKwh(l.watts, l.horas, l.quantidade),
  }));
  const totalKwh = linhasCalc.reduce((s, l) => s + l.kwh, 0);
  const totalReais = tarifaKwh ? totalKwh * tarifaKwh : undefined;

  const update = (id: number, patch: Partial<Linha>) =>
    setLinhas((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...patch } : l))
    );
  const remove = (id: number) =>
    setLinhas((prev) => prev.filter((l) => l.id !== id));
  const addAparelho = (nome: string) => {
    const ap = APARELHOS.find((a) => a.nome === nome);
    if (ap) setLinhas((prev) => [...prev, novaLinha(ap)]);
  };

  return (
    <>
      <Seo
        title="Calculadora de consumo de energia dos aparelhos"
        description="Calcule quanto cada eletrodoméstico consome de energia (kWh) por mês e quanto custa na conta de luz, com a tarifa da sua concessionária. Veja os vilões do consumo."
        path="/consumo-aparelhos"
        keywords={[
          "consumo de energia",
          "consumo de eletrodomésticos",
          "quanto gasta o chuveiro",
          "kWh por aparelho",
          "calculadora de consumo",
          "gasto de energia",
          "potência eletrodomésticos",
        ]}
        jsonLd={[
          faqJsonLd(FAQ),
          breadcrumbJsonLd([
            { name: "Início", path: "/" },
            { name: "Consumo de aparelhos", path: "/consumo-aparelhos" },
          ]),
        ]}
      />

      <PageHeader
        title="Consumo de aparelhos"
        description="Descubra quanto cada eletrodoméstico consome por mês e o impacto na sua conta de luz."
        breadcrumb={[{ label: "Consumo de aparelhos" }]}
      />

      <div className="container space-y-6 py-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            htmlFor="ca-conc"
            label="Concessionária"
            hintText="Usada para converter o consumo (kWh) em reais, pela tarifa residencial sem impostos."
          >
            <Combobox
              id="ca-conc"
              value={concessionaria}
              onChange={setConcessionaria}
              options={concessionarias.map((c) => ({ value: c, label: c }))}
              placeholder="Selecione…"
            />
          </Field>
          <Field htmlFor="ca-add" label="Adicionar aparelho">
            <Combobox
              id="ca-add"
              value=""
              onChange={addAparelho}
              options={APARELHOS.map((a) => ({
                value: a.nome,
                label: `${a.nome} (${a.watts} W)`,
              }))}
              placeholder="Escolha um aparelho…"
            />
          </Field>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-primary" /> Seus aparelhos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {linhasCalc.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Adicione aparelhos acima para montar sua estimativa.
              </p>
            )}
            {linhasCalc.map((l) => (
              <div
                key={l.id}
                className="grid grid-cols-2 items-end gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_auto_auto_auto_auto]"
              >
                <div className="col-span-2 font-medium sm:col-span-1">
                  {l.nome}
                </div>
                <Field htmlFor={`w-${l.id}`} label="Potência" className="w-24">
                  <InputWithUnit
                    id={`w-${l.id}`}
                    type="number"
                    min="0"
                    unit="W"
                    value={l.watts}
                    onChange={(e) =>
                      update(l.id, { watts: Number(e.target.value) })
                    }
                  />
                </Field>
                <Field htmlFor={`h-${l.id}`} label="Horas/dia" className="w-20">
                  <InputWithUnit
                    id={`h-${l.id}`}
                    type="number"
                    min="0"
                    step="0.25"
                    unit="h"
                    value={l.horas}
                    onChange={(e) =>
                      update(l.id, { horas: Number(e.target.value) })
                    }
                  />
                </Field>
                <Field htmlFor={`q-${l.id}`} label="Qtd." className="w-16">
                  <InputWithUnit
                    id={`q-${l.id}`}
                    type="number"
                    min="1"
                    value={l.quantidade}
                    onChange={(e) =>
                      update(l.id, { quantidade: Number(e.target.value) })
                    }
                  />
                </Field>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-semibold tabular-nums">
                      {formatNumber(l.kwh)} kWh
                    </div>
                    {tarifaKwh && (
                      <div className="text-xs text-muted-foreground tabular-nums">
                        {formatBRL(l.kwh * tarifaKwh)}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remover ${l.nome}`}
                    onClick={() => remove(l.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardContent className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">
                Consumo mensal estimado
              </p>
              <p className="text-3xl font-bold tabular-nums text-primary">
                {formatNumber(totalKwh)} kWh
              </p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-sm text-muted-foreground">
                Custo mensal (sem impostos)
              </p>
              <p className="text-3xl font-bold tabular-nums">
                {totalReais != null ? formatBRL(totalReais) : "—"}
              </p>
              {!concessionaria && (
                <p className="text-xs text-muted-foreground">
                  Selecione a concessionária para ver o valor.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setLinhas((prev) => [...prev, novaLinha(APARELHOS[0])])}
          >
            <Plus className="h-4 w-4" /> Adicionar linha
          </Button>
        </div>
      </div>

      <div className="container space-y-10 pb-12">
        <InfoSection title="Como calcular o consumo de cada aparelho">
          <p>
            O consumo de energia de um aparelho depende de dois fatores: a{" "}
            <strong>potência</strong> (em watts, W) e o <strong>tempo de uso</strong>.
            A fórmula é simples:
          </p>
          <p className="rounded-lg bg-muted/50 p-3 font-mono text-foreground">
            kWh por mês = (potência em W × horas por dia × 30) ÷ 1.000
          </p>
          <p>
            Um chuveiro de 5.500 W ligado 40 minutos por dia (0,67 h) consome
            cerca de <strong>110 kWh/mês</strong>. Já uma geladeira de 150 W
            ligada 24 h consome cerca de 108 kWh/mês — parecido, mas pela razão
            oposta: pouca potência, muitas horas.
          </p>
        </InfoSection>

        <InfoSection title="Os maiores vilões do consumo">
          <p>
            Aparelhos que <strong>esquentam ou esfriam</strong> são os que mais
            consomem: chuveiro elétrico, ar-condicionado, ferro de passar, forno
            e secador. Eles têm potência elevada, então mesmo um uso curto pesa
            na conta. Trocar banhos longos por mais curtos, usar o modo "verão"
            do chuveiro e manter o ar-condicionado em 23–24 °C reduz bastante o
            gasto.
          </p>
        </InfoSection>

        <InfoSection title="Perguntas frequentes">
          <FaqBlock items={FAQ} />
        </InfoSection>

        <DataSource />
        <p className="text-center text-xs text-muted-foreground">
          Potências de referência:{" "}
          <a
            href={APARELHOS_FONTE}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            tabela de potências de eletrodomésticos
          </a>
          .
        </p>
      </div>
    </>
  );
}
