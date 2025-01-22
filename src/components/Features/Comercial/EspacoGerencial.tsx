'use client';
import { DataTable } from '@/app/comercial/espaco/table/data-table';
import { columns } from '@/app/comercial/espaco/table/columns';
import { ITabelaGerencialResponse } from '@/interfaces/ITabelaGerencialResponse';
import api from '@/utils/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { GoalChartCard } from './GoalChartCard';
import ComercialUserVsStatusChart from '@/components/Charts/ComercialUserVsStatusChart';
import { SheetCelerComponent } from '@/components/CrmUi/Sheet';

async function fetchData() {
    const response = await api.get(`/api/comercial/coordenador/BeatrizRodolfo/`);
    return response.data;
}

async function fetchChartData() {
    const response = await api.get(`/api/comercial/coordenador/BeatrizRodolfo/targets`);
    return response.data;
}

function EspacoGerencial() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['espaco-gerencial'],
        queryFn: () => fetchData(),
        placeholderData: keepPreviousData,
    });

    const { data: chartData } = useQuery({
        queryKey: ['espaco-gerencial-chart'],
        queryFn: () => fetchChartData(),
        placeholderData: keepPreviousData,
    });

    return (
        <>
            <div className="flex w-full flex-col rounded-md bg-white py-2 pl-4 dark:bg-boxdark">
                <h1>Espaço Gerencial</h1>
                <p>Ecossistema de gestão da esteira comercial de ofícios da Ativos.</p>
            </div>
            {/* Seção do Gráfico de Usuários X status X VL */}
            <section className="mt-6 flex min-h-fit rounded-md bg-white dark:bg-boxdark">
                <ComercialUserVsStatusChart chartData={data?.results} />
            </section>
            {/* Seção do Gráfico de Metas */}
            <section className="mt-6 flex min-h-fit rounded-md bg-white dark:bg-boxdark">
                <GoalChartCard results={chartData?.results || []} />
            </section>
            {/* Seção da Tabela Gerencial */}
            <section className="mt-6 flex flex-col rounded-md bg-white dark:bg-boxdark">
                <DataTable columns={columns} data={data?.results || []} loading={isLoading} />
            </section>
        </>
    );
}

export default EspacoGerencial;
