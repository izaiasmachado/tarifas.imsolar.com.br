import { SHOW_ALL, uniqueValues } from "@/lib/data";

export interface FilterDef<T> {
  key: keyof T;
  label: string;
}

export interface ResolvedFilter<T> {
  key: keyof T;
  label: string;
  value: string;
  /** Opções disponíveis dado o estado dos OUTROS filtros (cascata). */
  options: string[];
}

export interface CascadingResult<T> {
  filters: ResolvedFilter<T>[];
  /** Linhas após aplicar todos os filtros ativos. */
  filtered: T[];
  activeCount: number;
}

/**
 * Resolve filtros encadeados de forma PURA a partir dos valores atuais.
 * Cada select mostra apenas os valores que ainda existem dadas as outras
 * seleções. `SHOW_ALL` significa "sem filtro" para a chave.
 *
 * O estado dos valores vive fora (em um `useForm`); esta função apenas deriva
 * as opções disponíveis e as linhas filtradas — sem `useState`.
 */
export function resolveCascadingFilters<T>(
  rows: T[],
  defs: FilterDef<T>[],
  values: Partial<Record<keyof T, string>>
): CascadingResult<T> {
  const valueOf = (key: keyof T) => values[key] ?? SHOW_ALL;

  const applyExcept = (exceptKey: keyof T | null): T[] =>
    rows.filter((row) =>
      defs.every((def) => {
        if (def.key === exceptKey) return true;
        const selected = valueOf(def.key);
        if (selected === SHOW_ALL) return true;
        return String(row[def.key]) === selected;
      })
    );

  const filters: ResolvedFilter<T>[] = defs.map((def) => ({
    key: def.key,
    label: def.label,
    value: valueOf(def.key),
    options: [SHOW_ALL, ...uniqueValues(applyExcept(def.key), def.key)],
  }));

  const filtered = applyExcept(null);
  const activeCount = defs.reduce(
    (n, def) => n + (valueOf(def.key) !== SHOW_ALL ? 1 : 0),
    0
  );

  return { filters, filtered, activeCount };
}

/** Valores iniciais (todos em SHOW_ALL) para um conjunto de filtros. */
export function defaultFilterValues<T>(
  defs: FilterDef<T>[]
): Record<string, string> {
  return Object.fromEntries(defs.map((d) => [String(d.key), SHOW_ALL]));
}
