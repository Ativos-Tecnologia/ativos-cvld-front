"use client";

import {
    ColumnDef as BaseColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
  // const [filters, setFilters] = React.useState<any[]>([])
  // const [open, setOpen] = React.useState(false)

  // const advancedFilter: FilterFn<any> = React.useCallback(
  //   (row, columnId, value, addMeta) => {
  //     if (filters.length === 0) return true
  //     return filters.some((filter) => {
  //       const cellValue = row.getValue(filter.column) as string
  //       switch (filter.condition) {
  //         case "equals":
  //           return cellValue === filter.value
  //         case "contains":
  //           return cellValue.includes(filter.value)
  //         case "startsWith":
  //           return cellValue.startsWith(filter.value)
  //         case "endsWith":
  //           return cellValue.endsWith(filter.value)
  //         default:
  //           return true
  //       }
  //     })
  //   },
  //   [filters],
  // )

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
    // globalFilterFn: advancedFilter,
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

  // const filterColumns = table
  //   .getAllColumns()
  //   .filter((column) => column.getCanHide())
  //   .map((column) => {
  //     return {
  //       key: column.id,
  //       label: solveHeaderId(column.id),
  //     };
  //   });

    // const addFilter = () => {
    //   const newFilter = {
    //     id: Math.random().toString(36).substr(2, 9),
    //     column: filterColumns[0].key,
    //     condition: "equals",
    //     value: "",
    //   };
    //   setFilters([...filters, newFilter]);
    // };

    // const removeFilter = (id: string) => {
    //   setFilters(filters.filter((f) => f.id !== id));
    // };

    // const updateFilter = (id: string, updates: Partial<any>) => {
    //   setFilters(
    //     filters.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    //   );
    // };

    // const applyFilters = () => {
    //   table.setGlobalFilter(filters);
    // };


  return (
    <div className="container mx-auto pb-10 pt-4">
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
      {/* <div className="flex justify-between items-center py-4">
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          Filters
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <Button onClick={addFilter}>
            <Plus className="mr-2 h-4 w-4" />
            Add filter
            </Button>
            <CommandEmpty>No filters found.</CommandEmpty>
            <CommandGroup>
              {filters.map((filter) => (
                <div key={filter.id} className="flex items-center p-2">
                <select
                  value={filter.column}
                  onChange={(e) => updateFilter(filter.id, { column: e.target.value })}
                  className="w-1/3 p-1 text-sm"
                >
                  {filterColumns.map((col) => (
                    <option key={col.key} value={col.key}>
                      {col.label}
                    </option>
                  ))}
                </select>
                <select
                  value={filter.condition}
                  onChange={(e) => updateFilter(filter.id, { condition: e.target.value})}
                  className="w-1/3 p-1 text-sm"
                >
                  <option value="equals">Equals</option>
                  <option value="contains">Contains</option>
                  <option value="startsWith">Starts with</option>
                  <option value="endsWith">Ends with</option>
                </select>
                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                  className="w-1/3 p-1 text-sm"
                  placeholder="Value"
                />
                <Button variant="ghost" size="sm" onClick={() => removeFilter(filter.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              ))}

            </CommandGroup>
            <div className="flex justify-end p-2">
              <Button
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </div>

          </Command>

          </PopoverContent>
        </Popover>
      </div> */}
      <div className="rounded-md border">
        <Table className="rounded-md lg:w-[938px] xl:w-[1066px] 2xl:w-[1130px] 3xl:w-full shadow-[inset_-9px_0_5px_-5px_rgba(0,0,0,0.1),inset_9px_0_5px_-5px_rgba(0,0,0,0.1)] overflow-x-scroll overflow-y-hidden" data-state={loading && "loading"}>
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
