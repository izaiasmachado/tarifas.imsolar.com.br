import { useMemo, useState } from "react";

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

interface UseCascadingFilters<T> {
  filters: ResolvedFilter<T>[];
  /** Linhas após aplicar todos os filtros ativos. */
  filtered: T[];
  setFilter: (key: keyof T, value: string) => void;
  clear: () => void;
  activeCount: number;
}

/**
 * Filtros encadeados: cada select mostra apenas os valores que ainda existem
 * dadas as outras seleções. `SHOW_ALL` significa "sem filtro" para a chave.
 * Função pura de (rows, state) — sem mutação.
 */
export function useCascadingFilters<T>(
  rows: T[],
  defs: FilterDef<T>[]
): UseCascadingFilters<T> {
  const [state, setState] = useState<Record<string, string>>(() =>
    Object.fromEntries(defs.map((d) => [String(d.key), SHOW_ALL]))
  );

  const applyExcept = useMemo(
    () =>
      (exceptKey: keyof T | null): T[] => {
        return rows.filter((row) =>
          defs.every((def) => {
            if (def.key === exceptKey) return true;
            const selected = state[String(def.key)];
            if (!selected || selected === SHOW_ALL) return true;
            return String(row[def.key]) === selected;
          })
        );
      },
    [rows, defs, state]
  );

  const filters: ResolvedFilter<T>[] = defs.map((def) => ({
    key: def.key,
    label: def.label,
    value: state[String(def.key)] ?? SHOW_ALL,
    options: [SHOW_ALL, ...uniqueValues(applyExcept(def.key), def.key)],
  }));

  const filtered = useMemo(() => applyExcept(null), [applyExcept]);

  const setFilter = (key: keyof T, value: string) =>
    setState((prev) => ({ ...prev, [String(key)]: value }));

  const clear = () =>
    setState(Object.fromEntries(defs.map((d) => [String(d.key), SHOW_ALL])));

  const activeCount = defs.reduce(
    (n, d) => n + (state[String(d.key)] !== SHOW_ALL ? 1 : 0),
    0
  );

  return { filters, filtered, setFilter, clear, activeCount };
}
