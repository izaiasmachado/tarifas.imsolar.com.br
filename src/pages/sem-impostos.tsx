import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";

import { DATA_PATHS } from "@/lib/data";
import { SITE } from "@/lib/site";
import type { Tarifa } from "@/lib/types";
import { useDataset } from "@/hooks/use-dataset";
import {
  resolveCascadingFilters,
  defaultFilterValues,
  type FilterDef,
} from "@/lib/cascading-filters";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Seo, breadcrumbJsonLd } from "@/components/seo";
import { PageHeader } from "@/components/layout/page-header";
import { LastUpdated } from "@/components/last-updated";
import { FilterBar } from "@/components/tarifas/filter-bar";
import { TarifasTable } from "@/components/tarifas/tarifas-table";
import {
  FaqBlock,
  InfoSection,
  faqJsonLd,
  type QA,
} from "@/components/info-section";

const FILTERS: FilterDef<Tarifa>[] = [
  { key: "concessionaria", label: "Concessionária" },
  { key: "subgrupo", label: "Subgrupo" },
  { key: "modalidade", label: "Modalidade" },
];

const FAQ: QA[] = [
  {
    q: "O que é tarifa de energia sem impostos?",
    a: "É o valor da tarifa (TUSD + TE) antes da incidência de tributos como ICMS, PIS e COFINS. Como os impostos variam por estado e situação do cliente, a tarifa sem impostos é a base mais justa para comparar concessionárias e dimensionar projetos de energia.",
  },
  {
    q: "Qual a diferença entre TUSD e TE?",
    a: "A TUSD (Tarifa de Uso do Sistema de Distribuição) remunera o transporte da energia pela rede; a TE (Tarifa de Energia) corresponde à energia consumida. A soma das duas é a tarifa de aplicação sem impostos.",
  },
  {
    q: "O que é TUSD Fio B?",
    a: "É a parcela da TUSD ligada à distribuição local. Ela é a referência para o pagamento gradual pelo uso da rede na geração distribuída (sistemas solares), conforme a Lei 14.300/2022.",
  },
  {
    q: "Os valores estão atualizados?",
    a: "Sim. Os dados vêm das Tarifas Homologadas das Distribuidoras da ANEEL (Dados Abertos) e a data da última atualização é exibida no topo da página. Ainda assim, confirme sempre na conta e com a concessionária.",
  },
];

interface FormValues {
  concessionaria: string;
  subgrupo: string;
  modalidade: string;
  search: string;
}

export function SemImpostosPage() {
  const { data, isLoading, isError, error } = useDataset<Tarifa[]>(
    DATA_PATHS.tarifas
  );
  const rows = useMemo(() => data ?? [], [data]);

  // O estado dos filtros e da busca vive no react-hook-form.
  const form = useForm<FormValues>({
    defaultValues: {
      ...defaultFilterValues(FILTERS),
      search: "",
    } as FormValues,
  });
  const { concessionaria, subgrupo, modalidade, search } = form.watch();

  const { filters, filtered, activeCount } = useMemo(
    () =>
      resolveCascadingFilters(rows, FILTERS, {
        concessionaria,
        subgrupo,
        modalidade,
      }),
    [rows, concessionaria, subgrupo, modalidade]
  );

  const searched = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return filtered;
    return filtered.filter((row) =>
      [row.concessionaria, row.classe, row.subclasse, row.detalhe]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [filtered, search]);

  return (
    <>
      <Seo
        title="Tarifas de energia sem impostos"
        description="Tabela com as tarifas de energia elétrica sem impostos (TUSD, TE e TUSD Fio B) por concessionária, subgrupo e modalidade, com dados da ANEEL. Filtre e ordene livremente."
        path="/sem-impostos"
        keywords={[
          "tarifa de energia sem impostos",
          "TUSD",
          "TE",
          "TUSD Fio B",
          "tarifa por concessionária",
          "tarifa ANEEL",
          "tabela de tarifas",
          "grupo A",
          "grupo B",
        ]}
        jsonLd={[
          faqJsonLd(FAQ),
          breadcrumbJsonLd([
            { name: "Início", path: "/" },
            { name: "Tarifas sem impostos", path: "/sem-impostos" },
          ]),
        ]}
      />

      <PageHeader
        title="Tarifas de energia sem impostos"
        description="Valores de TUSD, TE e TUSD Fio B por concessionária, sem a incidência de impostos. Use os filtros e a busca para encontrar a tarifa que precisa."
      />

      <div className="container space-y-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <LastUpdated />
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar concessionária, classe…"
              className="pl-9"
              value={search}
              onChange={(e) => form.setValue("search", e.target.value)}
              aria-label="Buscar nas tarifas"
            />
          </div>
        </div>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6 text-center">
            <p className="font-medium text-destructive">
              Não foi possível carregar as tarifas.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tente recarregar a página. ({error?.message})
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <FilterBar
              filters={filters}
              onChange={(key, value) =>
                form.setValue(key as keyof FormValues, value)
              }
              onClear={() => form.reset()}
              activeCount={activeCount}
            />
            <TarifasTable data={searched} />
          </>
        )}

        <p className="text-xs text-muted-foreground">
          Fonte: {SITE.name} a partir dos dados abertos da ANEEL. Os valores são
          informativos e não dispensam a consulta oficial à concessionária.
        </p>
      </div>

      <div className="container space-y-10 pb-12">
        <InfoSection title="Entenda as tarifas de energia sem impostos">
          <p>
            A tarifa que aparece na sua conta de luz reúne vários componentes. As
            duas parcelas principais, antes dos impostos, são a{" "}
            <strong>TUSD</strong> (uso da rede de distribuição) e a{" "}
            <strong>TE</strong> (a energia em si). Esta tabela mostra esses
            valores homologados pela ANEEL para cada concessionária, separados por{" "}
            <strong>subgrupo</strong> (nível de tensão) e{" "}
            <strong>modalidade</strong> (convencional, branca, azul, verde).
          </p>
          <p>
            Trabalhar com a tarifa <strong>sem impostos</strong> é essencial para
            comparar concessionárias de estados diferentes (o ICMS varia) e para
            dimensionar projetos de energia solar, em que o que importa é o valor
            da energia e do uso da rede — especialmente a{" "}
            <strong>TUSD Fio B</strong>, usada na compensação da geração
            distribuída.
          </p>
        </InfoSection>

        <InfoSection title="Perguntas frequentes">
          <FaqBlock items={FAQ} />
        </InfoSection>
      </div>
    </>
  );
}
