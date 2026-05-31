import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { DATA_PATHS } from "@/lib/data";
import { SITE } from "@/lib/site";
import type { Tarifa } from "@/lib/types";
import { useDataset } from "@/hooks/use-dataset";
import {
  useCascadingFilters,
  type FilterDef,
} from "@/hooks/use-cascading-filters";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Seo, breadcrumbJsonLd } from "@/components/seo";
import { PageHeader } from "@/components/layout/page-header";
import { LastUpdated } from "@/components/last-updated";
import { FilterBar } from "@/components/tarifas/filter-bar";
import { TarifasTable } from "@/components/tarifas/tarifas-table";

const FILTERS: FilterDef<Tarifa>[] = [
  { key: "concessionaria", label: "Concessionária" },
  { key: "subgrupo", label: "Subgrupo" },
  { key: "modalidade", label: "Modalidade" },
];

export function SemImpostosPage() {
  const { data, loading, error } = useDataset<Tarifa[]>(DATA_PATHS.tarifas);
  const rows = useMemo(() => data ?? [], [data]);

  const { filters, filtered, setFilter, clear, activeCount } =
    useCascadingFilters(rows, FILTERS);

  const [search, setSearch] = useState("");

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
        jsonLd={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Tarifas sem impostos", path: "/sem-impostos" },
        ])}
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
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar nas tarifas"
            />
          </div>
        </div>

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6 text-center">
            <p className="font-medium text-destructive">
              Não foi possível carregar as tarifas.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tente recarregar a página. ({error})
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            <FilterBar
              filters={filters}
              onChange={setFilter}
              onClear={clear}
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
    </>
  );
}
