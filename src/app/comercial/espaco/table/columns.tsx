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
        <div className="flex items-center gap-2">
            <Button variant="ghost" className="flex items-center gap-2" onClick={handleOpenSheet}>
                <RiSidebarUnfoldLine size={20} />
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
                    className="flex max-w-20 items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Criado em
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => <div className="max-w-20 lowercase">{row.getValue('criado_em')}</div>,
    },
    {
        accessorKey: 'usuario',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Usuário
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-33 gap-2">
                <p className="truncate">{row.getValue('usuario')}</p>
            </div>
        ),
    },
    {
        accessorKey: 'credor',
        header: () => {
            return <span className="flex min-w-2 max-w-36 items-center gap-4">Nome do Credor</span>;
        },
        cell: ({ row }) => (
            <div
                className="flex max-w-64 items-center overflow-auto text-nowrap"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)',
                }}
            >
                <span className="">{row.getValue('credor')}</span>
            </div>
        ),
    },
    {
        accessorKey: 'sheet',
        header: ({ column }) => {
            return null;
        },
        cell: ({ row }) => <CellComponent original={row.original} />,
    },
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
    {
        accessorKey: 'status_diligencia',
        header: ({ column }) => {
            return <p className="max-w-30 items-center gap-2 truncate">Status Diligência</p>;
        },
        cell: ({ row }) => (
            <div className="flex items-center">
                <p className="max-w-30 truncate">{row.getValue('status_diligencia')}</p>
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
