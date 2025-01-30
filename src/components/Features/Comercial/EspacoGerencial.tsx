'use client';
import { DataTable } from '@/app/comercial/espaco/table/data-table';
import { columns } from '@/app/comercial/espaco/table/columns';
import { ITabelaGerencialResponse } from '@/interfaces/ITabelaGerencialResponse';
import api from '@/utils/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useState } from 'react';
import { GoalChartCard } from './GoalChartCard';
import ComercialUserVsStatusChart from '@/components/Charts/ComercialUserVsStatusChart';
import { SheetCelerComponent } from '@/components/CrmUi/Sheet';
import { SheetViewComercial } from './SheetViewComercial';
import CelerAppCombobox from '@/components/CrmUi/Combobox';
import { BiUser } from 'react-icons/bi';
import Show from '@/components/Show';
import { UserInfoAPIContext } from '@/context/UserInfoContext';
import { TotalLiquidAvailableChart } from '@/components/Charts/TotalAvailableLiquidChart';
import { ComercialContext, ComercialProvider } from '@/context/ComercialContext';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Spotlight } from '@/components/ui/spotlight-new';

function EspacoGerencial() {
    const { sheetOpen, setSheetOpen, sheetOpenId } = useContext(ComercialContext);
    const {
        data: { product, first_name, user },
    } = useContext(UserInfoAPIContext);
    const [selectedCoordinator, setSelectedCoordinator] = useState<string>(user);

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
            <div className="bg-grid-white/[0.02] relative flex h-[15rem] max-w-screen-xsm overflow-hidden rounded-md bg-white/[0.96] antialiased dark:bg-boxdark dark:bg-opacity-50 md:mx-auto md:h-[40rem] md:max-w-screen-2xl md:flex-col md:items-center md:justify-center md:overflow-hidden md:bg-opacity-50 md:antialiased md:shadow-md md:dark:rounded-md md:dark:bg-boxdark md:dark:bg-opacity-50">
                <Spotlight />
                <div className="relative z-10 w-full pt-20 md:w-3/4 md:pt-0">
                    <h1 className="bg-opacity-50 bg-gradient-to-b from-slate-500 to-neutral-600 bg-clip-text text-center text-4xl font-bold text-transparent dark:from-neutral-50 dark:to-neutral-400 md:w-full md:max-w-[1000px] md:text-7xl">
                        Espaço Gerencial <br /> {first_name}
                    </h1>
                </div>
            </div>
            {/* Seção dos Filtros Administrativos */}
            <Show when={product === 'global'}>
                <section className="mt-6 flex min-h-fit flex-col rounded-md bg-white dark:bg-boxdark">
                    <span className="pl-4 pt-2">
                        Filtros Administr<b>ativos</b>
                    </span>
                    <div className="flex 2xsm:w-full lg:max-w-[200px] flex-col gap-4 p-4">
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
            <section className="mt-6 min-h-fit rounded-md bg-white dark:bg-boxdark">
                <ComercialUserVsStatusChart chartData={data?.results} isLoading={isFetching} />
            </section>
            {/* Seção do Gráfico de Metas */}
            <section className="mt-6 flex min-h-fit rounded-md bg-white dark:bg-boxdark">
                <GoalChartCard
                    results={chartData?.results || []}
                    isLoading={isChartDataLoading || isFetching}
                />
            </section>
            {/* Seção do Gráfico de Metas de Valor Líquido */}
            <section className="mt-6 flex min-h-fit rounded-md bg-white dark:bg-boxdark">
                <TotalLiquidAvailableChart
                    results={chartData?.results || []}
                    isLoading={isChartDataLoading || isFetching}
                />
            </section>
            {/* Seção da Tabela de Dados */}
            <section className="mt-6 flex 2xsm:max-w-screen-2xl md:max-w-[750px] lg:max-w-[1050px] xl:max-w-screen-2xl flex-col overflow-auto rounded-md bg-white dark:bg-boxdark">
                <DataTable columns={columns} data={data?.results || []} loading={isFetching} />
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetContent
                        className="w-fit overflow-y-auto overflow-x-hidden bg-[#f4f4f4] drop-shadow-2xl dark:bg-boxdark-2"
                        style={{
                            scrollbarWidth: 'thin',
                        }}
                    >
                        <SheetHeader>
                            <SheetTitle>Detalhes</SheetTitle>
                            <SheetDescription className="pb-4">
                                Veja os detalhes do ofício selecionado
                            </SheetDescription>
                        </SheetHeader>
                        <SheetViewComercial id={sheetOpenId} />
                    </SheetContent>
                </Sheet>
            </section>
        </>
    );
}

export default EspacoGerencial;
