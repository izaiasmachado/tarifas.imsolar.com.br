import { useForm } from "react-hook-form";
import { Sun, LayoutGrid, Ruler, Banknote } from "lucide-react";

import { formatBRL, formatNumber } from "@/lib/format";
import {
  REGIOES,
  PERFORMANCE_RATIO,
  POTENCIA_MODULO_WP,
  SOLAR_FONTE,
  dimensionar,
} from "@/lib/solar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { Field, InputWithUnit } from "@/components/ui/field";
import { Seo, breadcrumbJsonLd } from "@/components/seo";
import { PageHeader } from "@/components/layout/page-header";
import {
  FaqBlock,
  InfoSection,
  faqJsonLd,
  type QA,
} from "@/components/info-section";

interface FormValues {
  consumo: string;
  regiao: string;
}

const FAQ: QA[] = [
  {
    q: "Como é calculado o tamanho do sistema solar?",
    a: "Usamos a fórmula convencional: kWp = consumo mensal ÷ (HSP × 30 × fator de desempenho). O HSP (Horas de Sol Pleno) é a irradiação média da região, e o fator de desempenho (~0,78) considera as perdas reais do sistema. O resultado é a potência necessária para gerar, em média, o seu consumo.",
  },
  {
    q: "O que é HSP (Horas de Sol Pleno)?",
    a: "É a irradiação solar diária média de um local, em kWh/m²/dia. Não é o número de horas de sol, e sim a energia solar total do dia concentrada em uma intensidade padrão. O Nordeste tem os maiores HSP do Brasil (~5,8) e o Sul, os menores (~4,5).",
  },
  {
    q: "Quantos painéis vou precisar?",
    a: "Depende da potência total e da potência de cada módulo. Hoje os módulos residenciais têm cerca de 550 Wp. Dividimos a potência do sistema (em watts) pela potência do módulo e arredondamos para cima. Cada módulo ocupa cerca de 2,5 m² e o sistema todo precisa de aproximadamente 7 m² de telhado por kWp.",
  },
  {
    q: "O custo estimado é confiável?",
    a: "É uma ordem de grandeza. Usamos cerca de R$ 4.000 por kWp instalado (turnkey), valor médio para sistemas residenciais no Brasil em 2024–2026. O preço real varia com a região, a estrutura do telhado, a marca dos equipamentos e a empresa instaladora — peça sempre orçamentos.",
  },
  {
    q: "O sistema cobre 100% da minha conta?",
    a: "O dimensionamento mira o seu consumo médio, mas sempre permanece o custo de disponibilidade (taxa mínima de 30, 50 ou 100 kWh conforme o tipo de ligação) e, na geração distribuída, o pagamento gradual pelo uso da rede (Lei 14.300). Mesmo assim, a economia costuma ser expressiva.",
  },
];

export function DimensionarSolarPage() {
  const form = useForm<FormValues>({
    defaultValues: { consumo: "", regiao: "sudeste" },
  });
  const { consumo, regiao } = form.watch();

  const regiaoData = REGIOES.find((r) => r.id === regiao) ?? REGIOES[3];
  const consumoKwh = Number(consumo) || 0;
  const sistema = consumoKwh > 0 ? dimensionar(consumoKwh, regiaoData.hsp) : null;

  const resultados = [
    {
      icon: Sun,
      label: "Potência do sistema",
      value: sistema ? `${formatNumber(sistema.kwp)} kWp` : "—",
      highlight: true,
    },
    {
      icon: LayoutGrid,
      label: `Módulos (${POTENCIA_MODULO_WP} Wp cada)`,
      value: sistema ? `${sistema.modulos}` : "—",
    },
    {
      icon: Ruler,
      label: "Área de telhado",
      value: sistema ? `${formatNumber(sistema.areaM2)} m²` : "—",
    },
    {
      icon: Sun,
      label: "Geração média mensal",
      value: sistema ? `${formatNumber(sistema.geracaoMensalKwh)} kWh` : "—",
    },
    {
      icon: Banknote,
      label: "Custo estimado (turnkey)",
      value: sistema ? formatBRL(sistema.custoEstimado) : "—",
    },
  ];

  return (
    <>
      <Seo
        title="Calculadora de dimensionamento de sistema solar"
        description="Descubra a potência (kWp), o número de painéis, a área de telhado e o custo estimado de um sistema de energia solar a partir do seu consumo e da sua região no Brasil."
        path="/dimensionar-solar"
        keywords={[
          "dimensionamento solar",
          "quantos painéis solares",
          "calculadora energia solar",
          "kWp",
          "quanto custa energia solar",
          "sistema fotovoltaico",
          "HSP",
          "geração distribuída",
        ]}
        jsonLd={[
          faqJsonLd(FAQ),
          breadcrumbJsonLd([
            { name: "Início", path: "/" },
            { name: "Dimensionamento solar", path: "/dimensionar-solar" },
          ]),
        ]}
      />

      <PageHeader
        title="Dimensionamento de sistema solar"
        description="Estime a potência, o número de painéis, a área e o custo de um sistema fotovoltaico para o seu consumo."
        breadcrumb={[{ label: "Dimensionamento solar" }]}
      />

      <div className="container grid gap-6 py-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sun className="h-5 w-5 text-primary" /> Seus dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field
              htmlFor="ds-consumo"
              label="Consumo mensal médio"
              hintText="A média de kWh que você consome por mês. Some as contas do ano e divida por 12 para um valor mais preciso."
            >
              <InputWithUnit
                id="ds-consumo"
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
              htmlFor="ds-regiao"
              label="Região"
              hint="hsp"
              description={`Irradiação média (HSP) usada: ${formatNumber(
                regiaoData.hsp
              )} kWh/m²/dia — ${regiaoData.exemplos}.`}
            >
              <Combobox
                id="ds-regiao"
                value={regiao}
                onChange={(v) => form.setValue("regiao", v)}
                options={REGIOES.map((r) => ({
                  value: r.id,
                  label: `${r.nome} (HSP ${formatNumber(r.hsp)})`,
                }))}
              />
            </Field>
            <p className="text-xs text-muted-foreground">
              Cálculo com fator de desempenho de {PERFORMANCE_RATIO} e módulos de{" "}
              {POTENCIA_MODULO_WP} Wp. Resultados são uma estimativa para
              planejamento.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sistema recomendado</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y">
              {resultados.map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                    <r.icon className="h-4 w-4" />
                    {r.label}
                  </dt>
                  <dd
                    className={
                      r.highlight
                        ? "text-xl font-bold tabular-nums text-primary"
                        : "font-semibold tabular-nums"
                    }
                  >
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="container space-y-10 pb-12">
        <InfoSection title="Como dimensionar um sistema fotovoltaico">
          <p>
            Dimensionar um sistema solar é descobrir a potência (em kWp)
            necessária para gerar, em média, a energia que você consome. A
            fórmula usada por integradores em todo o Brasil é:
          </p>
          <p className="rounded-lg bg-muted/50 p-3 font-mono text-foreground">
            kWp = consumo mensal ÷ (HSP × 30 × fator de desempenho)
          </p>
          <p>
            O <strong>HSP</strong> (Horas de Sol Pleno) representa a irradiação
            média da sua região, e o <strong>fator de desempenho</strong> (cerca
            de 0,78) considera as perdas reais — inversor, temperatura, sujeira
            nos módulos e fiação. Com a potência definida, calculamos o número de
            módulos (≈ 550 Wp cada), a área de telhado (≈ 7 m²/kWp) e uma
            estimativa de custo.
          </p>
        </InfoSection>

        <InfoSection title="A irradiação solar muda conforme a região">
          <p>
            O Brasil tem excelente potencial solar em todo o território, mas há
            diferenças. O <strong>Nordeste</strong> tem a maior irradiação
            (HSP ~5,8), seguido de Centro-Oeste e Sudeste; o <strong>Sul</strong>{" "}
            tem a menor (~4,5), embora ainda muito superior à de muitos países
            que lideram a energia solar. Por isso, um mesmo consumo exige um
            sistema um pouco maior no Sul do que no Nordeste.
          </p>
        </InfoSection>

        <InfoSection title="Perguntas frequentes">
          <FaqBlock items={FAQ} />
        </InfoSection>

        <p className="text-center text-xs text-muted-foreground">
          Dados de irradiação:{" "}
          <a
            href={SOLAR_FONTE}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            CRESESB/CEPEL — SunData
          </a>
          . Estimativas para fins educativos; consulte um projetista para um
          dimensionamento definitivo.
        </p>
      </div>
    </>
  );
}
