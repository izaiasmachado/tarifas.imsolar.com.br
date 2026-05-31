/** Formatadores pt-BR centralizados. */

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const decimal = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Formata um valor (string/number) como moeda brasileira. */
export function formatBRL(value: string | number): string {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "—";
  return brl.format(n);
}

/** Formata um número com 2 casas decimais (pt-BR). */
export function formatNumber(value: string | number): string {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "—";
  return decimal.format(n);
}

/** Formata o fator de ajuste com 5 casas decimais. */
export function formatFator(value: string | number): string {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(5).replace(".", ",");
}

/** Formata uma data ISO (YYYY-MM-DD) como "30 de maio de 2025". */
export function formatDateLong(iso: string | null | undefined): string {
  if (!iso) return "—";
  // Evita problemas de fuso interpretando como data local "pura".
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "—";
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
