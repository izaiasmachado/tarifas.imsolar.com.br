import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Plus, X } from "lucide-react";

import { DATA_PATHS } from "@/lib/data";
import { formatBRL } from "@/lib/format";
import type { Tarifa } from "@/lib/types";
import { useDataset } from "@/hooks/use-dataset";
import {
  buildTariffIndex,
  concessionariasFor,
  getPostos,
  modalidadesFor,
  postosFor,
  type Rate,
} from "@/lib/tariff-queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    q: "Como funciona o comparador de concessionárias?",
    a: "Você escolhe duas ou mais concessionárias e o subgrupo/modalidade desejado, e a ferramenta mostra a TUSD, a TE e a TUSD Fio B de cada uma lado a lado, com os valores sem impostos homologados pela ANEEL.",
  },
  {
    q: "Para que serve comparar tarifas entre concessionárias?",
    a: "É útil para empresas com unidades em diferentes regiões, para estudos de viabilidade e para entender o peso da distribuidora no custo final da energia. Como a comparação é sem impostos, ela isola o efeito da tarifa em si.",
  },
  {
    q: "Posso comparar concessionárias de estados diferentes?",
    a: "Sim. Justamente por usar valores sem impostos, a comparação é justa mesmo entre estados com ICMS diferente.",
  },
];

interface FormValues {
  subgrupo: string;
  modalidade: string;
  selected: string[];
  toAdd: string;
}

export function CompararPage() {
  const { data, isLoading } = useDataset<Tarifa[]>(DATA_PATHS.tarifas);
  const index = useMemo(() => buildTariffIndex(data ?? []), [data]);

  const form = useForm<FormValues>({
    defaultValues: {
      subgrupo: "A4",
      modalidade: "Azul",
      selected: [],
      toAdd: "",
    },
  });
  const { subgrupo, modalidade, selected, toAdd } = form.watch();

  const modalidadeOptions = useMemo(
    () => modalidadesFor(index, subgrupo),
    [index, subgrupo]
  );
  const available = useMemo(
    () => concessionariasFor(index, subgrupo, modalidade),
    [index, subgrupo, modalidade]
  );
  const postos = useMemo(
    () => postosFor(index, subgrupo, modalidade),
    [index, subgrupo, modalidade]
  );

  const addable = available.filter((c) => !selected.includes(c));

  const add = (conc: string) => {
    if (conc && !selected.includes(conc)) {
      form.setValue("selected", [...selected, conc]);
      form.setValue("toAdd", "");
    }
  };
  const remove = (conc: string) =>
    form.setValue(
      "selected",
      selected.filter((c) => c !== conc)
    );

  // Matriz: para cada concessionária selecionada, os Rates por posto.
  const matrix = useMemo(() => {
    return selected.map((conc) => ({
      conc,
      postos: getPostos(index, conc, subgrupo, modalidade),
    }));
  }, [selected, index, subgrupo, modalidade]);

  const cell = (rate: Rate | undefined, field: keyof Rate) =>
    rate ? formatBRL(rate[field]) : "—";

  return (
    <>
      <Seo
        title="Comparador de tarifas entre concessionárias"
        description="Compare lado a lado as tarifas de energia (TUSD, TE e TUSD Fio B, sem impostos) de duas ou mais concessionárias, por subgrupo e modalidade, com dados da ANEEL."
        path="/comparar"
        keywords={[
          "comparar concessionárias",
          "comparador de tarifas",
          "tarifa de energia",
          "TUSD",
          "TE",
          "TUSD Fio B",
          "ANEEL",
        ]}
        jsonLd={[
          faqJsonLd(FAQ),
          breadcrumbJsonLd([
            { name: "Início", path: "/" },
            { name: "Comparador de tarifas", path: "/comparar" },
          ]),
        ]}
      />

      <PageHeader
        title="Comparador de tarifas entre concessionárias"
        description="Escolha o subgrupo e a modalidade, adicione as concessionárias e compare TUSD, TE e TUSD Fio B lado a lado."
        breadcrumb={[{ label: "Comparador de tarifas" }]}
      />

      <div className="container space-y-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Parâmetros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="cmp-subgrupo">Subgrupo</Label>
                <Combobox
                  id="cmp-subgrupo"
                  aria-label="Subgrupo"
                  value={subgrupo}
                  onChange={(v) => form.setValue("subgrupo", v)}
                  options={index.subgrupos.map((s) => ({ value: s, label: s }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cmp-modalidade">Modalidade</Label>
                <Combobox
                  id="cmp-modalidade"
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
                <Label htmlFor="cmp-add">Adicionar concessionária</Label>
                <div className="flex gap-2">
                  <Combobox
                    id="cmp-add"
                    aria-label="Adicionar concessionária"
                    className="flex-1"
                    value={toAdd}
                    onChange={(v) => add(v)}
                    options={addable.map((c) => ({ value: c, label: c }))}
                    placeholder="Buscar…"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-label="Adicionar"
                    onClick={() => add(toAdd)}
                    disabled={!toAdd}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selected.map((conc) => (
                  <Badge key={conc} variant="secondary" className="gap-1">
                    {conc}
                    <button
                      type="button"
                      aria-label={`Remover ${conc}`}
                      onClick={() => remove(conc)}
                      className="rounded-full hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {isLoading ? (
          <Skeleton className="h-72 w-full" />
        ) : selected.length === 0 ? (
          <p className="rounded-xl border bg-muted/30 p-6 text-center text-muted-foreground">
            Adicione pelo menos uma concessionária para comparar (valores em
            R$/MWh, sem impostos).
          </p>
        ) : (
          <div className="space-y-6">
            {postos.map((posto) => (
              <Card key={posto}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {posto === "Não se aplica" ? "Convencional" : posto}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Concessionária</TableHead>
                        <TableHead className="text-right">TUSD</TableHead>
                        <TableHead className="text-right">TE</TableHead>
                        <TableHead className="text-right">TUSD Fio B</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matrix.map(({ conc, postos: pm }) => {
                        const rate = pm?.get(posto);
                        return (
                          <TableRow key={conc}>
                            <TableCell className="font-medium">
                              {conc}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {cell(rate, "tusd")}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {cell(rate, "te")}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {cell(rate, "fioB")}
                            </TableCell>
                            <TableCell className="text-right font-semibold tabular-nums">
                              {cell(rate, "total")}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <DataSource />
      </div>

      <div className="container space-y-10 pb-12">
        <InfoSection title="Comparando tarifas entre concessionárias">
          <p>
            Cada distribuidora de energia do Brasil tem a sua própria tabela de
            tarifas, homologada pela ANEEL. Este comparador coloca as
            concessionárias <strong>lado a lado</strong> nos três componentes que
            mais importam — <strong>TUSD</strong> (uso da rede),{" "}
            <strong>TE</strong> (energia) e <strong>TUSD Fio B</strong> (base da
            compensação solar) — sempre sem impostos.
          </p>
          <p>
            Assim fica fácil enxergar o quanto a escolha da região, ou a presença
            de uma unidade em determinada área de concessão, pesa no custo da
            energia.
          </p>
        </InfoSection>

        <InfoSection title="Perguntas frequentes">
          <FaqBlock items={FAQ} />
        </InfoSection>
      </div>
    </>
  );
}
