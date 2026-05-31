import { useEffect, useState } from "react";

interface DatasetState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const cache = new Map<string, unknown>();

/**
 * Carrega um JSON de /public/data via fetch, com cache em memória.
 * Mantém os dados pesados FORA do bundle JS.
 */
export function useDataset<T>(path: string): DatasetState<T> {
  const [state, setState] = useState<DatasetState<T>>(() => ({
    data: (cache.get(path) as T) ?? null,
    loading: !cache.has(path),
    error: null,
  }));

  useEffect(() => {
    let active = true;

    if (cache.has(path)) {
      setState({ data: cache.get(path) as T, loading: false, error: null });
      return;
    }

    setState({ data: null, loading: true, error: null });

    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: T) => {
        cache.set(path, json);
        if (active) setState({ data: json, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active)
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "Erro ao carregar",
          });
      });

    return () => {
      active = false;
    };
  }, [path]);

  return state;
}
