'use client';

import {
    ColumnDef as BaseColumnDef,
    ColumnFiltersState,
    FilterFn,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronsUpDownIcon, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { BiChevronLeft, BiChevronRight, BiChevronsLeft, BiChevronsRight } from 'react-icons/bi';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup } from '@/components/ui/command';
import AmazingFilter from './test';
import { useClickOutside } from '@/hooks/use-click-outside';
import { cn } from '@/lib/utils';

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
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [open, setOpen] = React.useState(false);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [filters, setFilters] = React.useState<any[]>([]);
    const [showFilters, setShowFilters] = React.useState(false);

    const filterRef = useRef<HTMLDivElement>(null);

    useClickOutside(filterRef, () => setShowFilters(false));

    const advancedFilter: FilterFn<any> = React.useCallback(
        (row, columnId, value, addMeta) => {
            if (filters.length === 0) return true;
            return filters.some((filter) => {
                const cellValue = String(row.getValue(filter.column));
                switch (filter.condition) {
                    case 'equals':
                        return cellValue === String(filter.value);
                    case 'contains':
                        return cellValue.includes(filter.value);
                    case 'startsWith':
                        return cellValue.startsWith(filter.value);
                    case 'endsWith':
                        return cellValue.endsWith(filter.value);
                    default:
                        return true;
                }
            });
        },
        [filters],
    );

    const table = useReactTable<TData>({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        globalFilterFn: advancedFilter,
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
            case 'username':
                return 'Usuário';
            case 'email':
                return 'E-mail';
            case 'date_joined':
                return 'Data de Cadastro';
            case 'phone':
                return 'Telefone';
            case 'is_confirmed':
                return 'Confirmado';
            default:
                return headerId;
        }
    }

    const filterColumns = table
        .getAllColumns()
        .filter((column) => column.getCanHide())
        .map((column) => {
            return {
                key: column.id,
                label: solveHeaderId(column.id),
            };
        });

    const addFilter = () => {
        const newFilter = {
            id: Math.random().toString(36).substr(2, 9),
            column: filterColumns[0].key,
            condition: 'equals',
            value: '',
        };
        setFilters([...filters, newFilter]);
    };

    const removeFilter = (id: string) => {
        setFilters(filters.filter((f) => f.id !== id));
    };

    const updateFilter = (id: string, updates: Partial<any>) => {
        setFilters(filters.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    };

    const applyFilters = () => {
        table.setGlobalFilter(filters);
    };

    const resetFilters = () => {
        setFilters([]);
        table.setGlobalFilter([]);
    };

    const getActiveFilterCount = () => filters.length;

    return (
        <div className="container mx-auto pb-10 pt-4">
            {/* <div className="flex items-center py-4">
                <Input
                    placeholder="Digite um usuário"
                    value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('username')?.setFilterValue(event.target.value)
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
            </div> */}
            {/* <div className="flex items-center justify-between py-4"> */}
            {/* <AmazingFilter filterColumns={filterColumns} applyFilterFn={} /> */}
            {/* <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[200px] justify-between">
                            Filters
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                                            onChange={(e) =>
                                                updateFilter(filter.id, { column: e.target.value })
                                            }
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
                                            onChange={(e) =>
                                                updateFilter(filter.id, {
                                                    condition: e.target.value,
                                                })
                                            }
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
                                            onChange={(e) =>
                                                updateFilter(filter.id, { value: e.target.value })
                                            }
                                            className="w-1/3 p-1 text-sm"
                                            placeholder="Value"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFilter(filter.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CommandGroup>
                            <div className="flex justify-end p-2">
                                <Button onClick={applyFilters}>Apply Filters</Button>
                            </div>
                        </Command>
                    </PopoverContent>
                </Popover> */}
            {/* </div> */}
            <div className="relative z-0 w-full max-w-2xl">
                <div className="relative">
                    <div className="relative flex items-center">
                        <Search className="absolute left-3 h-4 w-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search with filters"
                            className={cn(
                                'w-full py-2 pl-10 pr-20',
                                'rounded-lg border border-zinc-200 dark:border-zinc-800',
                                'bg-white dark:bg-zinc-900',
                                'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                                'placeholder:text-zinc-400 dark:placeholder:text-zinc-600',
                            )}
                        />
                        <div className="absolute right-2 flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={cn(
                                    'flex items-center gap-1 rounded p-1.5',
                                    'text-sm font-medium',
                                    showFilters
                                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                                        : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800',
                                )}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                {getActiveFilterCount() > 0 && (
                                    <span className="min-w-[20px] rounded-full bg-indigo-100 px-1 py-0.5 text-xs dark:bg-indigo-500/20">
                                        {getActiveFilterCount()}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {showFilters && (
                        <div
                            ref={filterRef}
                            className={cn(
                                'absolute bottom-full right-0 mb-2 w-96 p-4',
                                'bg-white dark:bg-zinc-900',
                                'border border-zinc-200 dark:border-zinc-800',
                                'rounded-lg shadow-lg',
                            )}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-medium">Filtros</h3>
                                <button
                                    type="button"
                                    onClick={addFilter}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                    Adicionar
                                </button>
                            </div>

                            {filters.map((filter) => (
                                <div key={filter.id} className="mb-2 flex items-center gap-2">
                                    <select
                                        value={filter.column}
                                        onChange={(e) =>
                                            updateFilter(filter.id, { column: e.target.value })
                                        }
                                        className={cn(
                                            'w-1/3 px-2 py-1',
                                            'rounded-md border border-zinc-200 dark:border-zinc-800',
                                            'bg-white dark:bg-zinc-900',
                                            'text-sm text-zinc-900 dark:text-zinc-100',
                                            'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                                        )}
                                    >
                                        {filterColumns.map((col) => (
                                            <option key={col.key} value={col.key}>
                                                {col.label}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={filter.condition}
                                        onChange={(e) =>
                                            updateFilter(filter.id, { condition: e.target.value })
                                        }
                                        className={cn(
                                            'w-1/3 px-2 py-1',
                                            'rounded-md border border-zinc-200 dark:border-zinc-800',
                                            'bg-white dark:bg-zinc-900',
                                            'text-sm text-zinc-900 dark:text-zinc-100',
                                            'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                                        )}
                                    >
                                        <option value="equals">Igual</option>
                                        <option value="contains">Contém</option>
                                        <option value="startsWith">Starts with</option>
                                        <option value="endsWith">Ends with</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={filter.value}
                                        onChange={(e) =>
                                            updateFilter(filter.id, { value: e.target.value })
                                        }
                                        className={cn(
                                            'w-1/3 px-2 py-1',
                                            'rounded-md border border-zinc-200 dark:border-zinc-800',
                                            'bg-white dark:bg-zinc-900',
                                            'text-sm text-zinc-900 dark:text-zinc-100',
                                            'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                                        )}
                                        placeholder="Value"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFilter(filter.id)}
                                        className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            {filters.length > 0 && (
                                <div className="mt-4 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={applyFilters}
                                        className={cn(
                                            'px-3 py-1.5 text-sm font-medium',
                                            'bg-indigo-600 text-white',
                                            'rounded-md shadow-sm',
                                            'hover:bg-indigo-700',
                                            'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                                        )}
                                    >
                                        Aplicar filtros
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="ml-2 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                    >
                                        Limpar filtros
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {filters.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {filters.map((filter) => {
                            const column = filterColumns.find((col) => col.key === filter.column);
                            return (
                                <span
                                    key={filter.id}
                                    className={cn(
                                        'inline-flex items-center gap-1 px-2 py-1',
                                        'rounded-md text-sm',
                                        'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400',
                                    )}
                                >
                                    {`${column?.label || filter.column} ${filter.condition} ${filter.value}`}
                                    <button
                                        type="button"
                                        onClick={() => removeFilter(filter.id)}
                                        className="hover:text-indigo-900 dark:hover:text-indigo-200"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className="rounded-md border">
                <Table className="rounded-md" data-state={loading && 'loading'}>
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
                                    data-state={row.getIsSelected() && 'selected'}
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
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
                            {table.getState().pagination.pageIndex + 1} de{' '}
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
                            className="h-8 w-12 rounded-md border border-stroke px-2 text-center"
                        />
                    </span>
                    <select
                        value={table.getState().pagination.pageSize}
                        className="h-8 rounded-md border border-stroke px-2 py-0 text-sm"
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                    >
                        {[20, 30, 40, 50, 100].map((pageSize) => (
                            <option key={pageSize} value={pageSize} className="text-xs text-black">
                                Mostrar {pageSize} por página
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
