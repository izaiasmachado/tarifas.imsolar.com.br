import { useState } from "react";
import {
  type Column,
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

import { formatBRL } from "@/lib/format";
import type { Tarifa } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** Cabeçalho clicável que alterna a ordenação da coluna. */
function SortHeader({
  column,
  label,
}: {
  column: Column<Tarifa, unknown>;
  label: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 h-8"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
    </Button>
  );
}

/** Coluna monetária com ordenação numérica e valor formatado em BRL. */
function moneyColumn(key: keyof Tarifa, label: string): ColumnDef<Tarifa> {
  return {
    accessorKey: key,
    header: ({ column }) => <SortHeader column={column} label={label} />,
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
  moneyColumn("totalTUSD", "TUSD"),
  moneyColumn("totalTE", "TE"),
  moneyColumn("TUSDFioB", "TUSD Fio B"),
];

export function TarifasTable({ data }: { data: Tarifa[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const total = table.getFilteredRowModel().rows.length;
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card shadow-sm">
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
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
