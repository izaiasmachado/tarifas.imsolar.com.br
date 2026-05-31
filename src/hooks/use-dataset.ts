import { useQuery, type UseQueryResult } from "@tanstack/react-query";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

/**
 * Carrega um JSON de /public/data via TanStack Query.
 * Mantém os dados pesados FORA do bundle e cuida de cache, loading e erro.
 * Os datasets são estáticos (atualizados mensalmente), então nunca ficam
 * "stale" durante a sessão.
 */
export function useDataset<T>(path: string): UseQueryResult<T, Error> {
  return useQuery({
    queryKey: ["dataset", path],
    queryFn: () => fetchJson<T>(path),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
