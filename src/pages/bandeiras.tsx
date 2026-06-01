import { useMemo, useState } from "react";
import { Flag, Info } from "lucide-react";

import { formatBRL, formatNumber } from "@/lib/format";
import {
  BANDEIRAS,
  BANDEIRA_FONTE,
  custoBandeira,
  type Bandeira,
} from "@/lib/bandeiras";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, InputWithUnit } from "@/components/ui/field";
import { Seo, breadcrumbJsonLd } from "@/components/seo";
import { PageHeader } from "@/components/layout/page-header";
import {
  FaqBlock,
  InfoSection,
  faqJsonLd,
  type QA,
} from "@/components/info-section";

const FAQ: QA[] = [
  {
    q: "O que são as bandeiras tarifárias?",
    a: "São um sinal de preço criado pela ANEEL em 2015 que indica, mês a mês, o custo real de gerar energia no país. Quando o custo sobe (por exemplo, com pouca chuva e mais uso de termelétricas), a bandeira fica amarela ou vermelha e um valor extra é somado à conta. Quando as condições são boas, a bandeira é verde e não há acréscimo.",
  },
  {
    q: "Como o valor da bandeira é cobrado?",
    a: "O adicional é cobrado por kWh consumido no mês. Por exemplo, na bandeira vermelha patamar 2 (R$ 0,07877/kWh), uma casa que consome 200 kWh paga cerca de R$ 15,75 a mais — além da tarifa normal e dos impostos.",
  },
  {
    q: "Quem define a bandeira de cada mês?",
    a: "A ANEEL divulga, no fim de cada mês, qual bandeira valerá no mês seguinte, com base no custo de geração (PLD) e no nível dos reservatórios. A bandeira é a mesma para todo o país (no Sistema Interligado Nacional).",
  },
  {
    q: "A bandeira incide sobre impostos?",
    a: "O adicional da bandeira entra na base de cálculo dos tributos (ICMS, PIS/COFINS), então o impacto final na conta é um pouco maior do que o valor bruto por kWh. Esta calculadora mostra apenas o adicional da bandeira, sem impostos.",
  },
];

export function BandeirasPage() {
  const [consumo, setConsumo] = useState("");
  const [bandeiraId, setBandeiraId] = useState<Bandeira["id"]>("vermelha2");

  const consumoKwh = Number(consumo) || 0;
  const selected = BANDEIRAS.find((b) => b.id === bandeiraId)!;

  const linhas = useMemo(
    () =>
      BANDEIRAS.map((b) => ({
        bandeira: b,
        custo: custoBandeira(b, consumoKwh),
      })),
    [consumoKwh]
  );

  return (
    <>
      <Seo
        title="Bandeiras tarifárias: calcule o adicional na conta"
        description="Entenda as bandeiras tarifárias (verde, amarela, vermelha 1 e 2) e calcule quanto cada uma adiciona à sua conta de luz conforme o consumo em kWh. Valores oficiais da ANEEL."
        path="/bandeiras"
        keywords={[
          "bandeiras tarifárias",
          "bandeira vermelha",
          "bandeira amarela",
          "bandeira verde",
          "adicional bandeira",
          "conta de luz",
          "ANEEL",
          "quanto custa bandeira vermelha",
        ]}
        jsonLd={[
          faqJsonLd(FAQ),
          breadcrumbJsonLd([
            { name: "Início", path: "/" },
            { name: "Bandeiras tarifárias", path: "/bandeiras" },
          ]),
        ]}
      />

      <PageHeader
        title="Bandeiras tarifárias"
        description="Veja quanto cada bandeira adiciona à sua conta de luz, conforme o seu consumo mensal."
        breadcrumb={[{ label: "Bandeiras tarifárias" }]}
      />

      <div className="container grid gap-6 py-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flag className="h-5 w-5 text-primary" /> Seu consumo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              htmlFor="bd-consumo"
              label="Consumo mensal"
              hintText="A energia que você consome no mês, em kWh. Você encontra esse número na sua conta de luz."
            >
              <InputWithUnit
                id="bd-consumo"
                type="number"
                inputMode="decimal"
                min="0"
                placeholder="0"
                unit="kWh"
                value={consumo}
                onChange={(e) => setConsumo(e.target.value)}
              />
            </Field>

            <Field label="Bandeira do mês">
              <div className="grid gap-2">
                {BANDEIRAS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBandeiraId(b.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors",
                      bandeiraId === b.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <span className={cn("h-4 w-4 rounded-full", b.cor)} />
                    <span className="flex-1 font-medium">{b.nome}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {b.adicionalKwh === 0
                        ? "sem acréscimo"
                        : `+ ${formatBRL(b.adicionalKwh)}/kWh`}
                    </span>
                  </button>
                ))}
              </div>
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Adicional estimado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-primary/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Bandeira {selected.nome}
              </p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-primary">
                {consumoKwh > 0 ? formatBRL(custoBandeira(selected, consumoKwh)) : "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                adicional no mês para {formatNumber(consumoKwh)} kWh
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">
                Comparação entre bandeiras
              </p>
              <dl className="divide-y">
                {linhas.map(({ bandeira, custo }) => (
                  <div
                    key={bandeira.id}
                    className="flex items-center justify-between gap-3 py-2"
                  >
                    <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span
                        className={cn("h-3 w-3 rounded-full", bandeira.cor)}
                      />
                      {bandeira.nome}
                    </dt>
                    <dd className="font-semibold tabular-nums">
                      {consumoKwh > 0 ? formatBRL(custo) : "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              {selected.descricao} Valor sem impostos; a conta final é um pouco
              maior porque a bandeira entra na base do ICMS/PIS/COFINS.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="container space-y-10 pb-12">
        <InfoSection title="Como funcionam as bandeiras tarifárias">
          <p>
            As bandeiras tarifárias foram criadas pela ANEEL em 2015 para mostrar
            ao consumidor, de forma simples, o custo de gerar energia elétrica a
            cada mês. A maior parte da energia do Brasil vem de hidrelétricas,
            que são baratas. Quando chove pouco e os reservatórios baixam, é
            preciso ligar usinas termelétricas, que geram energia mais cara — e
            esse custo extra é repassado por meio das bandeiras.
          </p>
          <p>
            São quatro situações: <strong>verde</strong> (sem acréscimo),{" "}
            <strong>amarela</strong> (custo moderado),{" "}
            <strong>vermelha patamar 1</strong> e{" "}
            <strong>vermelha patamar 2</strong> (custos progressivamente
            maiores). O valor adicional é cobrado por kWh consumido e a bandeira
            válida é a mesma para todo o Sistema Interligado Nacional.
          </p>
        </InfoSection>

        <InfoSection title="Como reduzir o impacto das bandeiras">
          <p>
            Como o adicional é proporcional ao consumo, qualquer redução no uso
            de energia diminui também o custo da bandeira. Concentrar o uso de
            aparelhos de alta potência (chuveiro, ar-condicionado, máquina de
            lavar) e adotar lâmpadas LED ajuda especialmente nos meses de
            bandeira vermelha. Quem tem geração solar própria reduz a energia
            consumida da rede e, com isso, paga menos bandeira.
          </p>
        </InfoSection>

        <InfoSection title="Perguntas frequentes">
          <FaqBlock items={FAQ} />
        </InfoSection>

        <p className="text-center text-xs text-muted-foreground">
          Fonte dos valores:{" "}
          <a
            href={BANDEIRA_FONTE}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            ANEEL — Bandeiras Tarifárias
          </a>
          . Os valores podem mudar; confirme a bandeira vigente na sua conta.
        </p>
      </div>
    </>
  );
}
