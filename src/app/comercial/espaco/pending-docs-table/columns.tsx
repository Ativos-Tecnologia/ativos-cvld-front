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
import { IDocTable } from '@/interfaces/IPendingDocResponse';

const CellComponent = (row: { original: any }) => {
    const { setSheetOpen, sheetOpen, setSheetOpenId } = React.useContext(ComercialContext);
    const resumo = row.original;

    function handleOpenSheet() {
        setSheetOpen(!sheetOpen);
        setSheetOpenId(resumo.id);
    }

    return (
        <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
            <Button variant="ghost" className="flex items-center gap-2 px-2 py-1 bg-slate-100 dark:bg-slate-700 h-fit" onClick={handleOpenSheet}>
                <RiSidebarUnfoldLine size={20} />
                <p className='text-sm'>ABRIR</p>
            </Button>
        </div>
    );
};

export const columnsPendingDoc: ColumnDef<IDocTable>[] = [
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
        accessorKey: 'nome',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Nome
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-33 gap-2">
                <p className="truncate">{row.getValue('nome')}</p>
            </div>
        ),
    },
    {
        accessorKey: 'status_diligencia',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Status Diligência
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-33 gap-2">
                <p className="truncate">{row.getValue('status_diligencia')}</p>
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Status
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-33 gap-2">
                <p className="truncate">{row.getValue('status')}</p>
            </div>
        ),
    },
    {
        accessorKey: 'cpf',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    CPF
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-33 gap-2">
                <p className="truncate">{row.getValue('cpf')}</p>
            </div>
        ),
    },
    {
        accessorKey: 'rg',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    RG
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-33 gap-2">
                <p className="truncate">{row.getValue('rg')}</p>
            </div>
        ),
    },
    {
        accessorKey: 'status_rg',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                   Status RG
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-33 gap-2">
                <p className="truncate">{row.getValue('status_rg')}</p>
            </div>
        ),
    },
    {
        accessorKey: 'certidao_nasc_cas',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Certidão de Nascimento/Casamento
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-33 gap-2">
                <p className="truncate">{row.getValue('certidao_nasc_cas')}</p>
            </div>
        ),
    },
    {
        accessorKey: 'status_certidao_nasc_cas',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Status Certidão de Nascimento/Casamento
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-33 gap-2">
                <p className="truncate">{row.getValue('status_certidao_nasc_cas')}</p>
            </div>
        ),
    },
    {
        accessorKey: 'comprovante_residencia',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Comprovante de Residência
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-33 gap-2">
                <p className="truncate">{row.getValue('comprovante_residencia')}</p>
            </div>
        ),
    },
    {
        accessorKey: 'status_comprovante_residencia',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Status Comprovante de Residência
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-33 gap-2">
                <p className="truncate">{row.getValue('status_comprovante_residencia')}</p>
            </div>
        ),
    },
    {
        accessorKey: 'oficio_requisitorio',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Ofício Requisitório
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-33 gap-2">
                <p className="truncate">{row.getValue('oficio_requisitorio')}</p>
            </div>
        ),
    },
    {
        accessorKey: 'status_oficio_requisitorio',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="flex items-center gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Status Ofício Requisitório
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-33 gap-2">
                <p className="truncate">{row.getValue('status_oficio_requisitorio')}</p>
            </div>
        ),
    },
];
