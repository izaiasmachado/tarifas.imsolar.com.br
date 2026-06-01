import {
  type Column,
  type ColumnDef,
  type Row,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

import { formatBRL } from "@/lib/format";
import type { Tarifa } from "@/lib/types";
import type { GlossaryKey } from "@/lib/glossary";
import { Button } from "@/components/ui/button";
import { InfoHint } from "@/components/info-hint";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** Cabeçalho clicável que alterna a ordenação da coluna, com (?) opcional. */
function SortHeader({
  column,
  label,
  hint,
}: {
  column: Column<Tarifa, unknown>;
  label: string;
  hint?: GlossaryKey;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 h-8"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {label}
        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
      </Button>
      {hint && <InfoHint term={hint} />}
    </span>
  );
}

/** Coluna monetária com ordenação numérica e valor formatado em BRL. */
function moneyColumn(
  key: keyof Tarifa,
  label: string,
  hint?: GlossaryKey
): ColumnDef<Tarifa> {
  return {
    accessorKey: key,
    header: ({ column }) => (
      <SortHeader column={column} label={label} hint={hint} />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">{formatBRL(row.original[key])}</span>
    ),
    sortingFn: (a, b) => Number(a.original[key]) - Number(b.original[key]),
  };
}

const columns: ColumnDef<Tarifa>[] = [
  {
    accessorKey: "concessionaria",
    header: ({ column }) => (
      <SortHeader column={column} label="Concessionária" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.original.concessionaria}</span>
    ),
  },
  { accessorKey: "subgrupo", header: "Subgrupo" },
  { accessorKey: "modalidade", header: "Modalidade" },
  { accessorKey: "classe", header: "Classe" },
  { accessorKey: "subclasse", header: "Subclasse" },
  { accessorKey: "detalhe", header: "Detalhe" },
  { accessorKey: "posto", header: "Posto" },
  { accessorKey: "unidade", header: "Unidade" },
  { accessorKey: "acessante", header: "Acessante" },
  moneyColumn("totalTUSD", "TUSD", "tusd"),
  moneyColumn("totalTE", "TE", "te"),
  moneyColumn("TUSDFioB", "TUSD Fio B", "fioB"),
];

/** Cartão de uma tarifa para a visualização em telas pequenas. */
function TarifaCard({ row }: { row: Row<Tarifa> }) {
  const t = row.original;
  const meta: { label: string; value: string }[] = [
    { label: "Subgrupo", value: t.subgrupo },
    { label: "Modalidade", value: t.modalidade },
    { label: "Classe", value: t.classe },
    { label: "Subclasse", value: t.subclasse },
    { label: "Detalhe", value: t.detalhe },
    { label: "Posto", value: t.posto },
    { label: "Acessante", value: t.acessante },
  ].filter((m) => m.value && m.value !== "Não se aplica");

  const money: { label: string; hint: GlossaryKey; value: string }[] = [
    { label: "TUSD", hint: "tusd", value: formatBRL(t.totalTUSD) },
    { label: "TE", hint: "te", value: formatBRL(t.totalTE) },
    { label: "TUSD Fio B", hint: "fioB", value: formatBRL(t.TUSDFioB) },
  ];

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-semibold">{t.concessionaria}</h3>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
          {t.subgrupo} · {t.modalidade} · {t.unidade}
        </span>
      </div>

      {meta.length > 0 && (
        <dl className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          {meta.map((m) => (
            <div key={m.label} className="flex justify-between gap-2">
              <dt className="text-muted-foreground">{m.label}</dt>
              <dd className="text-right font-medium">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="grid grid-cols-3 gap-2 border-t pt-3 text-center">
        {money.map((m) => (
          <div key={m.label}>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              {m.label} <InfoHint term={m.hint} />
            </div>
            <div className="font-semibold tabular-nums">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TarifasTable({ data }: { data: Tarifa[] }) {
  // A ordenação é gerida pelo estado interno do TanStack Table (sem useState).
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const total = table.getFilteredRowModel().rows.length;
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, total);
  const pageRows = table.getRowModel().rows;

  return (
    <div className="space-y-4">
      {/* Tabela — telas médias e maiores */}
      <div className="hidden rounded-xl border bg-card shadow-sm md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {pageRows.length ? (
              pageRows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhuma tarifa encontrada com os filtros atuais.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Cartões — celulares e tablets na vertical */}
      <div className="grid gap-3 md:hidden">
        {pageRows.length ? (
          pageRows.map((row) => <TarifaCard key={row.id} row={row} />)
        ) : (
          <p className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
            Nenhuma tarifa encontrada com os filtros atuais.
          </p>
        )}
      </div>

      {/* Paginação */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          {from}–{to} de {total.toLocaleString("pt-BR")} tarifas
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {pageIndex + 1} de {table.getPageCount() || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
