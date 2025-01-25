'use client';
import { DataTable } from '@/app/comercial/espaco/table/data-table';
import { columns } from '@/app/comercial/espaco/table/columns';
import { ITabelaGerencialResponse } from '@/interfaces/ITabelaGerencialResponse';
import api from '@/utils/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useState } from 'react';
import { GoalChartCard } from './GoalChartCard';
import ComercialUserVsStatusChart from '@/components/Charts/ComercialUserVsStatusChart';
import CelerAppCombobox from '@/components/CrmUi/Combobox';
import { BiUser } from 'react-icons/bi';
import Show from '@/components/Show';
import { UserInfoAPIContext } from '@/context/UserInfoContext';
import { TotalLiquidAvailableChart } from '@/components/Charts/TotalAvailableLiquidChart';

function EspacoGerencial() {
    const {
        data: { product },
    } = useContext(UserInfoAPIContext);
    const [selectedCoordinator, setSelectedCoordinator] = useState<string>('BeatrizRodolfo');

    async function fetchData() {
        const response = await api.get(`/api/comercial/coordenador/${selectedCoordinator}/`);
        return response.data;
    }

    async function fetchChartData() {
        const response = await api.get(`/api/comercial/coordenador/${selectedCoordinator}/targets`);
        return response.data;
    }
    const { data, isFetching, refetch } = useQuery({
        queryKey: ['espaco-gerencial'],
        queryFn: () => fetchData(),
        placeholderData: keepPreviousData,
    });

    const {
        data: chartData,
        refetch: refetchChart,
        isLoading: isChartDataLoading,
    } = useQuery({
        queryKey: ['espaco-gerencial-chart'],
        queryFn: () => fetchChartData(),
        placeholderData: keepPreviousData,
    });

    const coordenadores = ['BeatrizRodolfo', 'VivianeMatos', 'Thais', 'Ativos'];

    const handleCoordinatorChange = (value: string) => {
        setSelectedCoordinator(value);
    };

    useEffect(() => {
        refetch();
        refetchChart();
    }, [selectedCoordinator]);

    return (
        <>
            <div className="flex w-full flex-col rounded-md bg-white py-2 pl-4 dark:bg-boxdark">
                <h1>Espaço Gerencial</h1>
                <p>Ecossistema de gestão da esteira comercial de ofícios da Ativos.</p>
            </div>
            {/* Seção dos Filtros Administrativos */}
            <Show when={product === 'global'}>
                <section className="mt-6 flex min-h-fit flex-col rounded-md bg-white dark:bg-boxdark">
                    <span className="pl-4 pt-2">
                        Filtros Administr<b>ativos</b>
                    </span>
                    <div className="flex max-w-[200px] flex-col gap-4 p-4">
                        <label className="flex items-center gap-2">
                            <BiUser className="text-xl" />
                            Coordenador
                        </label>
                        <CelerAppCombobox
                            list={coordenadores}
                            onChangeValue={handleCoordinatorChange}
                            value={selectedCoordinator}
                            placeholder="Selecione um coordenador"
                            className="w-full"
                        />
                    </div>
                </section>
            </Show>
            {/* Fim da Seção dos Filtros Administrativos */}
            {/* Seção do Gráfico de Usuários X status X VL */}
            <section className="mt-6 flex min-h-fit rounded-md bg-white dark:bg-boxdark">
                <ComercialUserVsStatusChart chartData={data?.results} isLoading={isFetching} />
            </section>
            {/* Seção do Gráfico de Metas */}
            <section className="mt-6 flex min-h-fit rounded-md bg-white dark:bg-boxdark">
                <GoalChartCard results={chartData?.results || []} isLoading={isChartDataLoading} />
            </section>
            {/* Seção do Gráfico de Metas de Valor Líquido */}
            <section className="mt-6 flex min-h-fit rounded-md bg-white dark:bg-boxdark">
                <TotalLiquidAvailableChart
                    results={chartData?.results || []}
                    isLoading={isChartDataLoading}
                />
            </section>
            {/* Seção da Tabela de Dados */}
            <section className="mt-6 flex flex-col rounded-md bg-white dark:bg-boxdark">
                <DataTable columns={columns} data={data?.results || []} loading={isFetching} />
            </section>
        </>
    );
}

export default EspacoGerencial;
