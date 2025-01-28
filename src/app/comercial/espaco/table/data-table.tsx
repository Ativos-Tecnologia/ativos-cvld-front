'use client';

import {
    ColumnDef as BaseColumnDef,
    ColumnFiltersState,
    FilterFn,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
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
import React, { useContext, useRef } from 'react';

import { FilterIcon, Search, X } from 'lucide-react';

import { useClickOutside } from '@/hooks/use-click-outside';
import { cn } from '@/lib/utils';
import { SheetCelerComponent } from '@/components/CrmUi/Sheet';
import { SheetViewComercial } from '@/components/Features/Comercial/SheetViewComercial';
import { RiSidebarUnfoldLine } from 'react-icons/ri';
import { ComercialContext } from '@/context/ComercialContext';

type ColumnDef<TData, TValue> = BaseColumnDef<TData, TValue> & {
    filterVariant?: 'range' | 'select' | 'text';
};

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    loading: boolean;
}

type AwesomeFilterProps = {
    filterColumns: { key: string; label: string }[];
    addGlobalFilter: (column: string, condition: string, value: string) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    filterRef: React.RefObject<HTMLDivElement>;
    filters: any[];
    updateFilter: (id: string, updates: Partial<any>) => void;
    removeFilter: (id: string) => void;
    applyFilters: () => void;
    resetFilters: () => void;
    getActiveFilterCount: () => number;
    addFilter: () => void;
    statusOptions: string[];
    statusDiligencia: string[];
    loaOptions: string[];
    usuarioOptions: string[];
    auxFn: (e: any) => void;
};

const FilterSelect: React.FC<{
    id: string;
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}> = ({ id, label, value, options, onChange }) => (
    <div className="relative py-2">
        <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label}
        </label>
        <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
                'mt-2 w-full py-1.5 pl-3 pr-8',
                'rounded-md border border-zinc-200 dark:border-zinc-800',
                'bg-white dark:bg-zinc-900',
                'text-sm text-zinc-900 dark:text-zinc-100',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
            )}
        >
            <option value="">Selecione</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {String(option)}
                </option>
            ))}
        </select>
    </div>
);

export const AwesomeFilter: React.FC<AwesomeFilterProps> = ({
    auxFn,
    filterColumns,
    addGlobalFilter,
    filters,
    updateFilter,
    removeFilter,
    applyFilters,
    resetFilters,
    getActiveFilterCount,
    showFilters,
    setShowFilters,
    filterRef,
    addFilter,
    statusOptions,
    loaOptions,
    usuarioOptions,
    statusDiligencia,
}) => (
    <div className="relative z-50 mb-14 w-full max-w-sm">
        <div className="relative">
            <div className="relative flex max-w-sm items-center">
                <Search className="absolute left-3 h-4 w-4 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Pesquisar nome do credor"
                    className={cn(
                        'w-full py-2 pl-10 pr-20',
                        'rounded-lg border border-stroke dark:border-strokedark',
                        'bg-white dark:bg-boxdark-2',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                        'placeholder:text-slate-400 dark:placeholder:text-slate-600',
                    )}
                    onChange={(e) => {
                        auxFn(e);
                    }}
                />
                <div className="absolute right-2 flex items-center gap-1">
                    <button
                        title="Filtros"
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
                        <FilterIcon className="h-4 w-4" />
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
                        'absolute left-[25rem] top-0 w-full max-w-sm p-4',
                        'bg-white dark:bg-zinc-900',
                        'border border-zinc-200 dark:border-zinc-800',
                        'rounded-lg shadow-lg',
                        'z-50',
                    )}
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-medium">Filtros</h3>
                    </div>

                    {filterColumns
                        .filter((t) => t.key === 'status')
                        .map((col) => (
                            <FilterSelect
                                key={col.key}
                                id={`filter-${col.key}`}
                                label="Status"
                                value={filters.find((f) => f.column === col.key)?.value || ''}
                                options={statusOptions}
                                onChange={(value) => addGlobalFilter(col.key, 'equals', value)}
                            />
                        ))}

                    {filterColumns
                        .filter((t) => t.key === 'status_diligencia')
                        .map((col) => (
                            <FilterSelect
                                key={col.key}
                                id={`filter-${col.key}`}
                                label="Status da Diligência"
                                value={filters.find((f) => f.column === col.key)?.value || ''}
                                options={statusDiligencia}
                                onChange={(value) => addGlobalFilter(col.key, 'equals', value)}
                            />
                        ))}

                    {filterColumns
                        .filter((t) => t.key === 'loa')
                        .map((col) => (
                            <FilterSelect
                                key={col.key}
                                id={`filter-${col.key}`}
                                label="Lei Orçamentária Anual"
                                value={filters.find((f) => f.column === col.key)?.value || ''}
                                options={loaOptions}
                                onChange={(value) => addGlobalFilter(col.key, 'equals', value)}
                            />
                        ))}

                    {filterColumns
                        .filter((t) => t.key === 'usuario')
                        .map((col) => (
                            <FilterSelect
                                key={col.key}
                                id={`filter-${col.key}`}
                                label="Broker"
                                value={filters.find((f) => f.column === col.key)?.value || ''}
                                options={usuarioOptions}
                                onChange={(value) => addGlobalFilter(col.key, 'equals', value)}
                            />
                        ))}

                    {/* {filterColumns
                        .filter((t) => t.key === 'status')
                        .map((col) => (
                            <div className="relative py-2" key={col.key}>
                                <label
                                    htmlFor={`filter-${col.key}`}
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
                                    Status
                                </label>
                                <select
                                    id={`filter-${col.key}`}
                                    value={filters.find((f) => f.column === col.key)?.value || ''}
                                    onChange={(e) =>
                                        addGlobalFilter(col.key, 'equals', e.target.value)
                                    }
                                    className={cn(
                                        'mt-2 w-full py-1.5 pl-3 pr-8',
                                        'rounded-md border border-zinc-200 dark:border-zinc-800',
                                        'bg-white dark:bg-zinc-900',
                                        'text-sm text-zinc-900 dark:text-zinc-100',
                                        'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                                    )}
                                >
                                    <option defaultChecked value="">
                                        Selecione
                                    </option>
                                    {statusOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}

                    {
                        filterColumns
                        .filter((t) => t.key === 'status_diligencia')
                        .map((col) => (
                            <div className="relative py-2" key={col.key}>
                                <label
                                    htmlFor={`filter-${col.key}`}
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
                                    Status da Diligência
                                </label>
                                <select
                                    id={`filter-${col.key}`}
                                    value={filters.find((f) => f.column === col.key)?.value || ''}
                                    onChange={(e) =>
                                        addGlobalFilter(col.key, 'equals', e.target.value)
                                    }
                                    className={cn(
                                        'mt-2 w-full py-1.5 pl-3 pr-8',
                                        'rounded-md border border-zinc-200 dark:border-zinc-800',
                                        'bg-white dark:bg-zinc-900',
                                        'text-sm text-zinc-900 dark:text-zinc-100',
                                        'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                                    )}
                                >
                                    <option defaultChecked value="">
                                        Selecione
                                    </option>
                                    {statusDiligencia.map((option) => (
                                        <option key={option} value={option}>
                                            {option.toString()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}

                    {filterColumns
                        .filter((t) => t.key === 'loa')
                        .map((col) => (
                            <div className="relative py-2" key={col.key}>
                                <label
                                    htmlFor={`filter-${col.key}`}
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
                                    <span>Lei Orçamentária Anual</span>
                                </label>
                                <select
                                    id={`filter-${col.key}`}
                                    value={filters.find((f) => f.column === col.key)?.value || ''}
                                    onChange={(e) =>
                                        // addGlobalFilter(col.key, 'equals', e.target.value)
                                        addGlobalFilter(col.key, 'equals', e.target.value)
                                    }
                                    className={cn(
                                        'mt-2 w-full py-1.5 pl-3 pr-8',
                                        'rounded-md border border-zinc-200 dark:border-zinc-800',
                                        'bg-white dark:bg-zinc-900',
                                        'text-sm text-zinc-900 dark:text-zinc-100',
                                        'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                                    )}
                                >
                                    <option defaultChecked value="">
                                        Selecione
                                    </option>
                                    {loaOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {String(option)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}

                    {filterColumns
                        .filter((t) => t.key === 'usuario')
                        .map((col) => (
                            <div className="relative py-2" key={col.key}>
                                <label
                                    htmlFor={`filter-${col.key}`}
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
                                    <span>Broker</span>
                                </label>
                                <select
                                    id={`filter-${col.key}`}
                                    value={filters.find((f) => f.column === col.key)?.value || ''}
                                    onChange={(e) =>
                                        addGlobalFilter(col.key, 'equals', e.target.value)
                                    }
                                    className={cn(
                                        'mt-2 w-full py-1.5 pl-3 pr-8',
                                        'rounded-md border border-zinc-200 dark:border-zinc-800',
                                        'bg-white dark:bg-zinc-900',
                                        'text-sm text-zinc-900 dark:text-zinc-100',
                                        'focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
                                    )}
                                >
                                    <option defaultChecked value="">
                                        Selecione
                                    </option>
                                    {usuarioOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {String(option)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))} */}

                    {/* {filters
                        .filter(
                            (e) =>
                                e.column !== 'status' &&
                                e.column !== 'loa' &&
                                e.column !== 'usuario',
                        )
                        .map((filter) => (
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
                                    {filterColumns
                                        .filter(
                                            (t) =>
                                                t.key !== 'status' &&
                                                t.key !== 'loa' &&
                                                t.key !== 'usuario',
                                        )
                                        .map((col) => (
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
                        ))} */}
                    {/* {filters.length > 0 && ( */}
                    <div className="mt-4 flex justify-end">
                        {/* <button
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
                        </button> */}
                        <button
                            type="button"
                            onClick={resetFilters}
                            className={`ml-2 text-sm text-indigo-600 transition-all duration-200 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 ${
                                filters.length === 0 ? 'cursor-not-allowed opacity-50 ' : ''
                            }`}
                        >
                            Limpar filtros
                        </button>
                    </div>
                    {/* )} */}
                </div>
            )}
        </div>

        {filters.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
                {filters.map((filter) => {
                    return (
                        <span
                            key={filter.id}
                            className={cn(
                                'inline-flex items-center gap-1 px-2 py-1',
                                'rounded-md text-sm',
                                `bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400`,
                            )}
                        >
                            {`${filter.value}`}
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
);

export function DataTable<TData, TValue>({
    columns,
    data,
    loading,
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
            return filters.every((filter) => {
                const cellValue = String(row.getValue(filter.column));
                switch (filter.condition) {
                    case 'equals':
                        return cellValue === String(filter.value);
                    case 'contains':
                        return cellValue.includes(filter.value);
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
        },
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

    const addGlobalFilter = (column: string, condition: string, value: string) => {
        const exists = filters.find((f) => f.column === column);
        if (exists) {
            if (!value) {
                removeFilter(exists.id);
                return;
            }
            updateFilter(exists.id, { condition, value });
            return;
        }

        const newFilter = {
            id: Math.random().toString(36).substr(2, 9),
            column,
            condition,
            value,
        };

        setFilters([...filters, newFilter]);
        applyFilters();
    };

    const updateFilter = (id: string, updates: Partial<any>) => {
        setFilters(filters.map((f) => (f.id === id ? { ...f, ...updates } : f)));
        table.setGlobalFilter(filters.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    };

    const removeFilter = (id: string) => {
        setFilters(filters.filter((f) => f.id !== id));
        table.setGlobalFilter(filters.filter((f) => f.id !== id));
    };

    const applyFilters = () => {
        table.setGlobalFilter(filters);
    };

    const resetFilters = () => {
        setFilters([]);
        table.setGlobalFilter([]);
    };

    const getActiveFilterCount = () => filters.length;

    const getColumnValues = (columnId: string) => {
        const column = table.getColumn(columnId);
        if (!column) return [];
        return column.getFacetedRowModel().rows.map((row) => row.getValue(columnId));
    };

    const filterByCredorName = (e: { target: { value: any } }) => {
        table.getColumn('credor')?.setFilterValue(e.target.value);
    };

    const statusOptions = Array.from(new Set(getColumnValues('status'))) as string[];
    const loaOptions = Array.from(new Set(getColumnValues('loa'))) as string[];
    const usuarioOptions = Array.from(new Set(getColumnValues('usuario'))) as string[];
    const statusDiligencia = Array.from(new Set(getColumnValues('status_diligencia'))) as string[];

    return (
        <div className="container pb-10 pt-4">
            <AwesomeFilter
                {...{
                    filterColumns,
                    addGlobalFilter,
                    filters,
                    updateFilter,
                    removeFilter,
                    applyFilters,
                    resetFilters,
                    getActiveFilterCount,
                    showFilters,
                    setShowFilters,
                    filterRef,
                    addFilter,
                    statusOptions,
                    loaOptions,
                    usuarioOptions,
                    statusDiligencia,
                    auxFn: filterByCredorName,
                }}
            />
            <div className="rounded-md border">
                <Table className="rounded-md" data-state={loading && 'loading'}>
                    <TableHeader className="rounded-t-md bg-snow dark:border-strokedark dark:bg-boxdark-2">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead className='w-90' key={header.id}>
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
                                    className='group'
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell className='relative' key={cell.id}>
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
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-500"></div>
                                            <span>Carregando...</span>
                                        </div>
                                    ) : (
                                        <span>Nenhum registro encontrado</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* <div className="flex items-center justify-end space-x-2 py-4">
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
            </div> */}
        </div>
    );
}
