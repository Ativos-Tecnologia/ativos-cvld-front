"use client";

import {
    Column,
  ColumnDef as BaseColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { BiChevronLeft, BiChevronRight, BiChevronsLeft, BiChevronsRight } from "react-icons/bi";

type ColumnDef<TData, TValue> = BaseColumnDef<TData, TValue> & {
  filterVariant?: 'range' | 'select' | 'text';
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  loading: boolean;
  pageCount?: number;
refetch: VoidFunction;
}



export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  setPagination,
  loading,
  pageCount,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    rowCount: data.length,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      
    },
    manualPagination: true,
    onPaginationChange: setPagination,
    pageCount,
  });

  function solveHeaderId(headerId: string) {
    switch (headerId) {
        case "username":
            return "Usuário";
        case "email":
            return "E-mail";
        case "date_joined":
            return "Data de Cadastro";
        case "phone":
            return "Telefone";
        case "is_confirmed":
            return "Confirmado";
        default:
            return headerId;
        }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center py-4">
        <Input
          placeholder="Digite um usuário"
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Coluna <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-boxdark-2">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {solveHeaderId(column.id)}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table className="rounded-md" data-state={loading && "loading"}>
          <TableHeader className="rounded-t-md bg-snow dark:border-strokedark dark:bg-boxdark-2">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <BiChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            <BiChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >

            <BiChevronRight />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            >
                <BiChevronsRight />
            
          </Button>
            <span className="flex items-center gap-1">
            <div>Página</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Ir para pág.:
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-12 h-8 px-2 text-center border border-stroke rounded-md"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            className="h-8 py-0 px-2 border border-stroke rounded-md text-sm"
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[20, 30, 40, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize} className="text-black text-xs">
                Mostrar {pageSize} por página
              </option>
            ))}
          </select>
        </div>
        {/* <div>
          Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
          {table.getRowCount().toLocaleString()} Rows
        </div> */}
        </div>
       
      </div>
  );
}
