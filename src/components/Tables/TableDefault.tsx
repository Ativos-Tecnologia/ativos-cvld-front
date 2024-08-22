/* caso precise mudar algum estilo de qualquer elemento, o objeto abaixo
é o lugar certo. Todos os elementos da tabela possuem twmerge, podendo ter 
seus estilos sobrescritos. */

import React from 'react';
import { cn } from '@/lib/utils';

/* =====> começa estilos dos elementos da tabela <===== */
const customTableStyles = {
    table: "min-w-full",
    head: {
        base: "group/head bg-zinc-200 text-xs uppercase text-black dark:bg-meta-4 dark:text-white",
        cell: "px-4 py-3 group-first/head:first:rounded-tl-sm group-first/head:last:rounded-tr-sm"
    },
    row: "border-b border-slate-200 dark:border-slate-600",
    data: "px-4 py-1 border-r border-slate-200 dark:border-slate-600 last:border-none"
};
/* =====> termina estilos dos elementos da tabela <===== */

export const Table = ({ children, className }: React.HTMLAttributes<HTMLTableElement>) => {
    return (
        <table className={cn(customTableStyles.table, className)}>
            {children}
        </table>
    )
}

export const TableHead = ({children, className}: React.HTMLAttributes<HTMLTableSectionElement>) => {
    return (
        <thead className={cn(customTableStyles.head.base, className)}>
            {children}
        </thead>
    )
};

export const TableBody = ({children, className}: React.HTMLAttributes<HTMLTableSectionElement>) => {
    return (
        <tbody className={className}>
            {children}
        </tbody>
    )
};

export const TableRow = ({children, className}: React.HTMLAttributes<HTMLTableRowElement>) => {
    return (
        <tr className={cn(customTableStyles.row,className)}>
            {children}
        </tr>
    )
};

export const TableHeadCell = ({children, className}: React.HTMLAttributes<HTMLTableCellElement>) => {
    return (
        <th className={cn(customTableStyles.head.cell, className)}>
            {children}
        </th>
    )
}

export const TableCell = ({children, className}: React.HTMLAttributes<HTMLTableCellElement>) => {
    return (
        <td className={cn(customTableStyles.data, className)}>
            {children}
        </td>
    )
}
