import { FilterX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import type { ResolvedFilter } from "@/lib/cascading-filters";

interface FilterBarProps<T> {
  filters: ResolvedFilter<T>[];
  onChange: (key: keyof T, value: string) => void;
  onClear: () => void;
  activeCount: number;
}

/** Barra de filtros encadeados (comboboxes pesquisáveis) reutilizável. */
export function FilterBar<T>({
  filters,
  onChange,
  onClear,
  activeCount,
}: FilterBarProps<T>) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        {filters.map((filter) => {
          const id = `filter-${String(filter.key)}`;
          return (
            <div key={String(filter.key)} className="space-y-1.5">
              <Label htmlFor={id}>{filter.label}</Label>
              <Combobox
                id={id}
                aria-label={filter.label}
                value={filter.value}
                onChange={(value) => onChange(filter.key, value)}
                options={filter.options.map((option) => ({
                  value: option,
                  label: option,
                }))}
                searchPlaceholder={`Buscar ${filter.label.toLowerCase()}…`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={activeCount === 0}
        >
          <FilterX className="h-4 w-4" /> Limpar filtros
        </Button>
      </div>
    </div>
  );
}
