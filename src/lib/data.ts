/** Caminhos dos datasets servidos a partir de /public/data. */
export const DATA_PATHS = {
  tarifas: "/data/tarifas.json",
  fatorAjuste: "/data/fator-ajuste.json",
  meta: "/data/meta.json",
} as const;

/** Texto exibido quando um filtro não está selecionado. */
export const SHOW_ALL = "Mostrar todos";

/** Extrai valores únicos de uma chave, ordenados (pt-BR). */
export function uniqueValues<T>(rows: T[], key: keyof T): string[] {
  const set = new Set<string>();
  for (const row of rows) {
    const value = row[key];
    if (value != null && value !== "") set.add(String(value));
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
}
