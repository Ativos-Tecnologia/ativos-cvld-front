import * as React from 'react';
import { ColumnDef, Row } from '@tanstack/react-table';

import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { IResumoComercial } from '@/interfaces/IResumoComercial';
import dateFormater from '@/functions/formaters/dateFormater';
import { FindCoordinator } from '@/functions/comercial/find_cordinator';
import api from '@/utils/api';
import { useMutation } from '@tanstack/react-query';
import CRMTooltip from '@/components/CrmUi/Tooltip';
import { toast } from 'sonner';
import { BiCheck } from 'react-icons/bi';
import { ITabelaGerencial } from '@/interfaces/ITabelaGerencialResponse';
import numberFormat from '@/functions/formaters/numberFormat';
import percentageFormater from '@/functions/formaters/percentFormater';

export const columns: ColumnDef<ITabelaGerencial>[] = [
    {
        accessorKey: 'criado_em',
        accessorFn: (row) => dateFormater(row.criado_em.split('T')[0]),
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Criado em
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue('criado_em')}</div>,
    },
    {
        accessorKey: 'usuario',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex max-w-36 items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <p className="flex justify-start">Usuário</p>
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => <p className="max-w-36 truncate">{row.getValue('usuario')}</p>,
    },
    {
        accessorKey: 'loa',
        header: 'LOA',
        cell: ({ row }) => (
            <CRMTooltip text="Lei Orçamentária Anual">{row.getValue('loa')}</CRMTooltip>
        ),
    },
    {
        accessorKey: 'observacoes',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="flex justify-start gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <p className="flex justify-start">Observações</p>
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <p className="max-w-36 truncate">{row.getValue('observacoes')}</p>;
        },
    },
    // {
    //     header: 'Comissão',
    //     cell: ({ row }) => {
    //         const resumo = row.original;
    //         return (
    //             <div className="flex items-center">
    //                 <span>{numberFormat(resumo.comissao)}</span>
    //             </div>
    //         );
    //     },
    // },
    // {
    //     accessorKey: 'proposta_escolhida',
    //     header: 'Proposta',
    //     cell: ({ row }) => (
    //         <div className="flex items-center">
    //             <span>{numberFormat(row.getValue('proposta_escolhida'))}</span>
    //         </div>
    //     ),
    // },
    {
        accessorKey: 'valor_liquido_disponivel',
        header: 'Valor Líquido',
        cell: ({ row }) => (
            <div className="flex items-center">
                <span>{numberFormat(row.getValue('valor_liquido_disponivel'))}</span>
            </div>
        ),
    },
    {
        accessorKey: 'custo_do_precatorio',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="flex max-w-18 items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Custo do Precatório
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="flex items-center">
                <span>{percentageFormater(row.getValue('custo_do_precatorio'))}</span>
            </div>
        ),
    },
    {
        accessorKey: 'credor',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="flex min-w-2 max-w-36 items-center gap-4"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Nome do Credor
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="flex items-center">
                <span>{row.getValue('credor')}</span>
            </div>
        ),
    },
    // {
    //     accessorKey: 'proposta_minima',
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 className="flex min-w-2 max-w-36 items-center gap-4"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //             >
    //                 Proposta Mínima
    //                 <ArrowUpDown size={16} />
    //             </Button>
    //         );
    //     },
    //     cell: ({ row }) => (
    //         <div className="flex items-center">
    //             <span>{numberFormat(row.getValue('proposta_minima'))}</span>
    //         </div>
    //     ),
    // },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return <p className="max-w-30 items-center gap-2 truncate">Status</p>;
        },
        cell: ({ row }) => (
            <div className="flex items-center">
                <p className="max-w-30 truncate">{row.getValue('status')}</p>
            </div>
        ),
    },
    // {
    //   id: "actions",
    //   enableHiding: false,
    //   cell: ({ row }) => {
    //     return (
    //       <CellComponent row={row} />
    //     )
    //   },
    // },
];
