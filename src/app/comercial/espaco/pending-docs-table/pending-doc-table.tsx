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


type ColumnDef<TData, TValue> = BaseColumnDef<TData, TValue> & {
    filterVariant?: 'range' | 'select' | 'text';
};

interface PendingDocTableProps<TData, TValue> {
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
    usuarioOptions: string[];
    nomeCompletoOptions: string[];
    docOficioRequisitorioOptions: string[];
    docOficioRequisitorioStatusOptions: string[];
    docRGOptions: string[];
    docRGStatusOptions: string[];
    docCertidaoNascimentoCasamentoStatusOptions: string[];
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
    usuarioOptions,
    nomeCompletoOptions,
    docOficioRequisitorioOptions,
    docOficioRequisitorioStatusOptions,
    docRGOptions,
    docRGStatusOptions,
    docCertidaoNascimentoCasamentoStatusOptions,
}) => (
    <div className="relative z-50 mb-14 w-full max-w-sm">
        <div className="relative">
            <div className="relative flex max-w-sm items-center">
                <Search className="absolute left-3 h-4 w-4 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Pesquisar nome do cedente"
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
                        .filter((t) => t.key === 'Usuário')
                        .map((col) => (
                            <FilterSelect
                                key={col.key}
                                id={`filter-${col.key}`}
                                label="Usuário"
                                value={filters.find((f) => f.column === col.key)?.value || ''}
                                options={usuarioOptions}
                                onChange={(value) => addGlobalFilter(col.key, 'equals', value)}
                            />
                        ))}

                    {filterColumns
                        .filter((t) => t.key === 'Nome Completo')
                        .map((col) => (
                            <FilterSelect
                                key={col.key}
                                id={`filter-${col.key}`}
                                label="Nome Completo"
                                value={filters.find((f) => f.column === col.key)?.value || ''}
                                options={nomeCompletoOptions}
                                onChange={(value) => addGlobalFilter(col.key, 'equals', value)}
                            />
                        ))}

                    {filterColumns
                        .filter((t) => t.key === 'Doc. Ofício Requisitório')
                        .map((col) => (
                            <FilterSelect
                                key={col.key}
                                id={`filter-${col.key}`}
                                label="Doc. Ofício Requisitório"
                                value={filters.find((f) => f.column === col.key)?.value || ''}
                                options={docOficioRequisitorioOptions}
                                onChange={(value) => addGlobalFilter(col.key, 'equals', value)}
                            />
                        ))}

                    {filterColumns
                        .filter((t) => t.key === 'Doc. Ofício Requisitório Status')
                        .map((col) => (
                            <FilterSelect
                                key={col.key}
                                id={`filter-${col.key}`}
                                label="Doc. Ofício Requisitório Status"
                                value={filters.find((f) => f.column === col.key)?.value || ''}
                                options={docOficioRequisitorioStatusOptions}
                                onChange={(value) => addGlobalFilter(col.key, 'equals', value)}
                            />
                        ))}

                    {filterColumns
                        .filter((t) => t.key === 'Doc. RG')
                        .map((col) => (
                            <FilterSelect
                                key={col.key}
                                id={`filter-${col.key}`}
                                label="Doc. RG"
                                value={filters.find((f) => f.column === col.key)?.value || ''}
                                options={docRGOptions}
                                onChange={(value) => addGlobalFilter(col.key, 'equals', value)}
                            />
                        ))}
                    {filterColumns
                        .filter((t) => t.key === 'Doc. RG Status')
                        .map((col) => (
                            <FilterSelect
                                key={col.key}
                                id={`filter-${col.key}`}
                                label="Doc. RG Status"
                                value={filters.find((f) => f.column === col.key)?.value || ''}
                                options={docRGStatusOptions}
                                onChange={(value) => addGlobalFilter(col.key, 'equals', value)}
                            />
                        ))}
                    {filterColumns
                        .filter((t) => t.key === 'Doc. Certidão Nascimento/Casamento Status')
                        .map((col) => (
                            <FilterSelect
                                key={col.key}
                                id={`filter-${col.key}`}
                                label="Doc. Certidão Nascimento/Casamento Status"
                                value={filters.find((f) => f.column === col.key)?.value || ''}
                                options={docCertidaoNascimentoCasamentoStatusOptions}
                                onChange={(value) => addGlobalFilter(col.key, 'equals', value)}
                            />
                        ))}
                    <div className="mt-4 flex justify-end">
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

export function PendingDocTable<TData, TValue>({
    columns,
    data,
    loading,
}: PendingDocTableProps<TData, TValue>) {
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
                return 'Coordenador';
            case 'Usuário':
                return 'Usuário';
            case 'Nome Completo':
                return 'Nome Completo';
            case 'Doc. Ofício Requisitório':
                return 'Doc. Ofício Requisitório';
            case 'Doc. Ofício Requisitório Status':
                return 'Doc. Ofício Requisitório Status';
            case 'Doc. RG':
                return 'Doc. RG';
            case 'Doc. RG Status':
                return 'Doc. RG Status';
            case 'Doc. Certidão Nascimento/Casamento Status':
                return 'Doc. Certidão Nascimento/Casamento Status';
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
        table.getColumn('Usuário')?.setFilterValue(e.target.value);
    };

    return (
        <div className="container pb-10 pt-4">
                <h2 className='tracking-wider font-semibold mb-8'>Documentação a aprovar</h2>
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
        </div>
    );
}
