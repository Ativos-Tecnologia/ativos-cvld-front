'use client';
import React from 'react';
import LOASynthesisChart from '../Charts/LOASynthesisChart';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { Boxes } from '../BackgroundBoxes';
import { cn } from '@/lib/utils';
import { estados } from '@/constants/estados';
import { CelerInputField } from '../CrmUi/InputFactory';
import { InputFieldVariant } from '@/enums/inputFieldVariants.enum';
import { SelectItem } from '../ui/select';
import CelerAppCombobox from '../CrmUi/Combobox';
import CRMTooltip from '../CrmUi/Tooltip';
import { CardResumoPrecatorioEspecial } from '../Cards/CardResumoPrecatorioEspecial';

const PrecatoriosEspeciais = () => {
    const {
        data: synthesisData,
        isLoading,
        refetch: refetchSysthesisData,
    } = useQuery({
        queryKey: ['treeMapData'],
        queryFn: async () => {
            const response = await api.post(`api/precatorios-especiais/extrair-sintese-loas/`);

            return response.data;
        },
        refetchOnWindowFocus: false,
    });

    const {
        data: overviewData,
        isLoading: overviewLoading,
        refetch: refetchOverviewData,
    } = useQuery({
        queryKey: ['overviewData'],
        queryFn: async () => {
            const response = await api.post(`api/precatorios-especiais/extrair-resumo/`);

            return response.data;
        },
        refetchOnWindowFocus: false,
    });

    const [estadoSelecionado, setEstadoSelecionado] = React.useState<string>('PE');

    function handleEstadoChange(value: string) {
        const estado = estados.find((item: IEstado) => item.nome === value);
        setEstadoSelecionado(estado?.id || 'PE');
    }

    interface IEstado {
        id: string;
        nome: string;
    }

    function solveEstadoName(estado: string) {
        return estados.find((item: IEstado) => item.id === estado)?.nome;
    }

    return (
        <>
            <div className="relative flex h-[85vh] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-slate-900">
                <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-slate-900 [mask-image:radial-gradient(transparent,white)]" />

                <Boxes />
                <h1 className={cn('relative z-20 font-satoshi text-xl text-white md:text-6xl')}>
                    Análise de Precatórios Especiais
                </h1>
                <p className="relative z-20 mt-2 text-center text-neutral-300">
                    Nosso motor de análise de dados e inteligência artificial
                </p>
            </div>
            <section className="mx-auto my-6 rounded-md bg-white dark:bg-boxdark">
                <CardResumoPrecatorioEspecial
                    data={overviewData?.results}
                    estados={estados.map((item) => item.nome)}
                    estadoSelecionado={estadoSelecionado}
                    handleEstadoChange={handleEstadoChange}
                    isLoading={overviewLoading}
                />
            </section>
            <div className="container mx-auto my-6 rounded-md bg-white pb-10 pt-4 dark:bg-boxdark">
                <div className="grid grid-cols-12 rounded-md bg-white dark:bg-boxdark">
                    <LOASynthesisChart data={synthesisData?.results} />
                </div>
            </div>
        </>
    );
};

export default PrecatoriosEspeciais;
