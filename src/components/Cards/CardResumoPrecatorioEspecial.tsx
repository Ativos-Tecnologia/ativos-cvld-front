'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
    BadgeIcon as BadgeBrasil,
    Coins,
    FileText,
    Calculator,
    MapPin,
    Loader2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import CelerAppCombobox from '../CrmUi/Combobox';

interface PrecatorioData {
    'Valor Total de Precatório em Estoque': number;
    'Quantidade de Precatórios': number;
    'Valor Médio de Precatório': number;
    'Estado Devedor': string;
}

interface DashboardCardProps {
    data: PrecatorioData | null;
    estados: string[];
    estadoSelecionado: string;
    handleEstadoChange: (estado: string) => void;
    isLoading?: boolean;
}

export function CardResumoPrecatorioEspecial({
    data,
    estados,
    estadoSelecionado,
    handleEstadoChange,
    isLoading,
}: DashboardCardProps) {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('pt-BR').format(Math.round(value));
    };

    if (isLoading || !data) {
        return (
            <Card className="mx-auto flex h-64 w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </Card>
        );
    }

    return (
        <Card
            className={`mx-auto w-full overflow-hidden transition-all duration-300 ease-out ${animate ? 'translate-y-0 transform opacity-100' : 'translate-y-10 transform opacity-0'}`}
        >
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                    <BadgeBrasil size={28} />
                    Resumo de Precatórios
                </CardTitle>
            </CardHeader>
            <CardContent className="p-2 dark:bg-boxdark">
                <Table>
                    <TableBody>
                        <TableRow className="transition-colors hover:bg-blue-50 dark:hover:bg-boxdark-2">
                            <TableCell className="flex items-center gap-2 font-medium">
                                <Coins className="text-yellow-500" />
                                Valor Total de Precatório em Estoque
                            </TableCell>
                            <TableCell className="text-right font-bold text-green-600">
                                {formatCurrency(data['Valor Total de Precatório em Estoque'])}
                            </TableCell>
                        </TableRow>
                        <TableRow className="transition-colors hover:bg-blue-50 dark:hover:bg-boxdark-2">
                            <TableCell className="flex items-center gap-2 font-medium">
                                <FileText className="text-blue-500" />
                                Quantidade de Precatórios
                            </TableCell>
                            <TableCell className="text-right font-bold">
                                {formatNumber(data['Quantidade de Precatórios'])}
                            </TableCell>
                        </TableRow>
                        <TableRow className="transition-colors hover:bg-blue-50 dark:hover:bg-boxdark-2">
                            <TableCell className="flex items-center gap-2 font-medium">
                                <Calculator className="text-purple-500" />
                                Valor Médio de Precatório
                            </TableCell>
                            <TableCell className="text-right font-bold text-blue-600">
                                {formatCurrency(data['Valor Médio de Precatório'])}
                            </TableCell>
                        </TableRow>
                        <TableRow className="transition-colors hover:bg-blue-50 dark:hover:bg-boxdark-2">
                            <TableCell className="flex items-center gap-2 font-medium">
                                <MapPin className="text-red-500" />
                                Estado Devedor
                            </TableCell>
                            <TableCell className="text-right font-bold">
                                <CelerAppCombobox
                                    list={estados}
                                    value={estadoSelecionado}
                                    onChangeValue={handleEstadoChange}
                                    placeholder="Selecione um estado"
                                    className="w-20"
                                    disabled={true}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
