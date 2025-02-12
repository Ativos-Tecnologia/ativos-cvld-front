import * as React from 'react';
import { ColumnDef, flexRender } from '@tanstack/react-table';

import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

import dateFormater from '@/functions/formaters/dateFormater';
import CRMTooltip from '@/components/CrmUi/Tooltip';
import { ITabelaGerencial } from '@/interfaces/ITabelaGerencialResponse';
import numberFormat from '@/functions/formaters/numberFormat';
import percentageFormater from '@/functions/formaters/percentFormater';
import { SheetCelerComponent } from '@/components/CrmUi/Sheet';
import { SheetViewComercial } from '@/components/Features/Comercial/SheetViewComercial';
import { RiSidebarUnfoldLine } from 'react-icons/ri';
import { CoordinatorParticipationChart } from '@/components/Charts/CommissionParticipationChart';
import { ComercialContext } from '@/context/ComercialContext';

const CellComponent = (row: { original: any }) => {
    const { setSheetOpen, sheetOpen, setSheetOpenId } = React.useContext(ComercialContext);
    const resumo = row.original;

    function handleOpenSheet() {
        setSheetOpen(!sheetOpen);
        setSheetOpenId(resumo.id);
    }

    return (
        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Button
                variant="ghost"
                className="flex h-fit items-center gap-2 bg-slate-100 px-2 py-1 dark:bg-slate-700"
                onClick={handleOpenSheet}
            >
                <RiSidebarUnfoldLine size={20} />
                <p className="text-sm">ABRIR</p>
            </Button>
        </div>
    );
};

export const columns: ColumnDef<ITabelaGerencial>[] = [
    {
        accessorKey: 'criado_em',
        accessorFn: (row) => dateFormater(row.criado_em.split('T')[0]),
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex items-center justify-normal gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Criado em
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => <div className="w-33 lowercase">{row.getValue('criado_em')}</div>,
    },
    {
        accessorKey: 'usuario',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="min-w-50 flex items-center justify-normal gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Usuário
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-45 gap-2">
                <p className="truncate">{row.getValue('usuario')}</p>
            </div>
        ),
    },
    {
        accessorKey: 'credor',
        header: () => {
            return <span className="flex min-w-100 max-w-36 items-center gap-4">Nome do Credor</span>;
        },
        cell: ({ row }) => (
            <div
                className="flex min-w-100 items-center justify-normal overflow-auto text-nowrap"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)',
                }}
            >
                <p className="truncate max-w-90">{row.getValue('credor')}</p>
                <CellComponent original={row.original} />
            </div>
        ),
    },
    // {
    //     accessorKey: 'sheet',
    //     header: ({ column }) => {
    //         return null;
    //     },
    //     cell: ({ row }) => <CellComponent original={row.original} />,
    // },
    // {
    //     accessorKey: 'observacoes',
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 className="flex justify-start gap-2"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //             >
    //                 <p className="flex justify-start">Observações</p>
    //                 <ArrowUpDown size={16} />
    //             </Button>
    //         );
    //     },
    //     cell: ({ row }) => {
    //         return <p className="max-w-36 truncate">{row.getValue('observacoes')}</p>;
    //     },
    // },
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
        header: () => {
            return (
                <p className='min-w-55'>Valor Liquido Disponível</p>
            )
        },
        cell: ({ row }) => (
            <div className="min-w-55 truncate flex items-center justify-normal">
                <p>{numberFormat(row.getValue('valor_liquido_disponivel'))}</p>
            </div>
        ),
    },
    {
        accessorKey: 'custo_do_precatorio',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="min-w-55 flex items-center justify-normal gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Custo do Precatório
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-full flex items-center">
                <span>{percentageFormater(row.getValue('custo_do_precatorio'))}</span>
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
            return <p className="min-w-40 items-center gap-2 truncate">Status</p>;
        },
        cell: ({ row }) => (
            <div className="flex items-center">
                <p className="w-full truncate">{row.getValue('status')}</p>
            </div>
        ),
    },
    {
        accessorKey: 'status_diligencia',
        header: ({ column }) => {
            return <p className="min-w-55 items-center gap-2 truncate">Status Diligência</p>;
        },
        cell: ({ row }) => (
            <div className="flex items-center">
                <p className="w-full truncate">{row.getValue('status_diligencia')}</p>
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
