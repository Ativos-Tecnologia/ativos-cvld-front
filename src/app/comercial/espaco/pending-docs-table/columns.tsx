import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ComercialContext } from '@/context/ComercialContext';
import { IDocTable } from '@/interfaces/IPendingDocResponse';
import { LuAppWindow } from 'react-icons/lu';
import { BrokersContext } from '@/context/BrokersContext';
import api from '@/utils/api';

const CellComponent = (row: { original: any }) => {

    const { setDocModalInfo, docModalInfo } = React.useContext(BrokersContext);
    const resumo = row.original;

    async function handleOpenSheet() {
        const response = await api.get(`/api/notion-api/list/page/${resumo.id}/`);
        if (response.status === 200) {

            const relationId = response.data.properties["CENTRAL DE PRECATÓRIOS"]?.relation[0]?.id;
            const request = await api.get(`/api/notion-api/list/page/${relationId}/`);

            if (request.status === 200) {
                setDocModalInfo(request.data);
            } else {
                throw new Error("Erro ao obter dados do Notion");
            }
        } else {
            throw new Error("Erro ao obter dados do Notion");
        }
    }

    return (
        <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
            <Button variant="ghost" className="flex items-center gap-2 px-2 py-1 bg-slate-100 dark:bg-slate-700 h-fit" onClick={handleOpenSheet}>
                <LuAppWindow size={20} />
                <p className='text-sm'>GERENCIAR DOCS</p>
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
                    className="min-w-100 flex justify-normal gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Nome
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="relative min-w-90 gap-2">
                <p className="truncate">{row.getValue('nome')}</p>
                <CellComponent original={row.original} />
            </div>
        ),
    },
    {
        accessorKey: 'status_diligencia',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="min-w-50 flex justify-normal gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Status Diligência
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-full gap-2">
                <p className="truncate">{row.getValue('status_diligencia') || "Sem status de diligência"}</p>
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="min-w-55 flex justify-normal gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Status
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-full gap-2">
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
                    className="min-w-55 flex justify-normal gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    CPF
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-full gap-2">
                <p className="truncate">{row.getValue('cpf')}</p>
            </div>
        ),
    },
    // {
    //     accessorKey: 'rg',
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant={'ghost'}
    //                 className="flex items-center gap-2"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //             >
    //                 RG
    //                 <ArrowUpDown size={16} />
    //             </Button>
    //         );
    //     },
    //     cell: ({ row }) => (
    //         <div className="w-33 gap-2">
    //             <p className="truncate">{row.getValue('rg')}</p>
    //         </div>
    //     ),
    // },
    {
        accessorKey: 'status_rg',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="min-w-55 flex justify-normal gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <p className="truncate">Status RG</p>
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-full gap-2">
                <p className="truncate">{row.getValue('status_rg') || "Sem documento cadastrado"}</p>
            </div>
        ),
    },
    // {
    //     accessorKey: 'certidao_nasc_cas',
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant={'ghost'}
    //                 className="flex items-center gap-2"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //             >
    //                 Certidão de Nascimento/Casamento
    //                 <ArrowUpDown size={16} />
    //             </Button>
    //         );
    //     },
    //     cell: ({ row }) => (
    //         <div className="w-33 gap-2">
    //             <p className="truncate">{row.getValue('certidao_nasc_cas')}</p>
    //         </div>
    //     ),
    // },
    {
        accessorKey: 'status_certidao_nasc_cas',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="min-w-55 flex justify-normal gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <p className="truncate">Status Certidão de Nascimento/Casamento</p>
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-full gap-2">
                <p className="truncate">{row.getValue('status_certidao_nasc_cas')  || "Sem documento cadastrado"}</p>
            </div>
        ),
    },
    // {
    //     accessorKey: 'comprovante_residencia',
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant={'ghost'}
    //                 className="flex items-center gap-2"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //             >
    //                 Comprovante de Residência
    //                 <ArrowUpDown size={16} />
    //             </Button>
    //         );
    //     },
    //     cell: ({ row }) => (
    //         <div className="w-33 gap-2">
    //             <p className="truncate">{row.getValue('comprovante_residencia')}</p>
    //         </div>
    //     ),
    // },
    {
        accessorKey: 'status_comprovante_residencia',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="min-w-55 flex justify-normal gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <p className="truncate">Status Comprovante de Residência</p>
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-full gap-2">
                <p className="truncate">{row.getValue('status_comprovante_residencia')  || "Sem documento cadastrado"}</p>
            </div>
        ),
    },
    // {
    //     accessorKey: 'oficio_requisitorio',
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant={'ghost'}
    //                 className="flex items-center gap-2"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    //             >
    //                 Ofício Requisitório
    //                 <ArrowUpDown size={16} />
    //             </Button>
    //         );
    //     },
    //     cell: ({ row }) => (
    //         <div className="w-33 gap-2">
    //             <p className="truncate">{row.getValue('oficio_requisitorio')}</p>
    //         </div>
    //     ),
    // },
    {
        accessorKey: 'status_oficio_requisitorio',
        header: ({ column }) => {
            return (
                <Button
                    variant={'ghost'}
                    className="min-w-55 flex justify-normal gap-2"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    <p className='truncate'>Status Ofício Requisitório</p>
                    <ArrowUpDown size={16} />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="w-full gap-2">
                <p className="truncate">{row.getValue('status_oficio_requisitorio')  || "Sem documento cadastrado"}</p>
            </div>
        ),
    },
];
