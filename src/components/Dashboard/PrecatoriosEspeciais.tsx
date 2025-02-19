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
import { Card, CardHeader, CardTitle } from '../ui/card';
import { BadgeDollarSign, BadgeInfoIcon } from 'lucide-react';
import ColumnChart from '../Charts/ColumnChart';
import { LOADistribuitionBubbleChart } from '../Charts/LOADistribuitionBubbleChart';
import Image from 'next/image';
import dateFormater from '@/functions/formaters/dateFormater';

const chartProps = {
    COMUM: [
        'MONTANTE TOTAL ATÉ ANO ANTERIOR AO DE REFERÊNCIA',
        'SALDO DEVEDOR TOTAL  APÓS PAGAMENTO',
    ],
    HISTORICO: ['MONTANTE TOTAL PAGO NO ANO DE REFERÊNCIA '],
    PROJEÇÃO: ['MONTANTE TOTAL A SER PAGO NO ANO DE REFERÊNCIA'],
};

const formatDatePicker = (timestamp: number): string => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const PrecatoriosEspeciais = () => {

    const [dateRange, setDateRange] = React.useState({
        start: new Date().getTime(),
        end: new Date('2026-03-30').getTime()
    });

    const { data: synthesisData, refetch: refetchSysthesisData } = useQuery({
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

    const {
        data: paymentHistoricData,
        isLoading: paymentHistoricLoading,
        refetch: refetchPaymentHistoricData,
    } = useQuery({
        queryKey: ['paymentHistoricData'],
        queryFn: async () => {
            const response = await api.post('/api/precatorios-especiais/extrair-historico/');

            return response.data;
        },
        refetchOnWindowFocus: false,
    });

    const {
        data: paymentProjectionData,
        isLoading: paymentProjectionLoading,
        refetch: refetchPaymentProjectionData,
    } = useQuery({
        queryKey: ['paymentProjectionData'],
        queryFn: async () => {
            const response = await api.post('/api/precatorios-especiais/extrair-projecao/');

            return response.data;
        },
        refetchOnWindowFocus: false,
    });

    const {
        data: precatoryData,
        isLoading: precatoryLoading,
        refetch: refetchPrecatoryData,
    } = useQuery({
        queryKey: ['precatoryData'],
        queryFn: async () => {
            const response = await api.post(
                `/api/precatorios-especiais/extrair-amostragem-do-estoque/?initial_date=${formatDatePicker(dateRange.start)}&final_date=${formatDatePicker(dateRange.end)}`,
            );

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

    React.useEffect(() => {
        refetchPrecatoryData();
    }, [dateRange.start, dateRange.end])

    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="relative col-span-12 flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-slate-900 p-5 h-[30vh]">
                <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-slate-900 [mask-image:radial-gradient(transparent,white)]" />
                <Boxes />
                <Image
                    src="/images/logo/radar_logo_light_mode.svg"
                    width={400}
                    height={400}
                    alt="Logo do Radar"
                    className='relative z-5'
                />
                <h1 className="relative z-5 mt-2 text-center text-neutral-300">
                    Nosso motor de análise de dados e inteligência artificial
                </h1>
            </div>
            <section className="col-span-12 mx-auto w-full rounded-md bg-white dark:bg-boxdark">
                <CardResumoPrecatorioEspecial
                    data={overviewData?.results}
                    estados={estados.map((item) => item.nome)}
                    estadoSelecionado={estadoSelecionado}
                    handleEstadoChange={handleEstadoChange}
                    isLoading={overviewLoading}
                />
            </section>
            <Card
                className={`col-span-12 mx-auto w-full translate-y-0 transform overflow-hidden opacity-100 transition-all duration-300 ease-out`}
            >
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                        <BadgeInfoIcon size={28} />
                        Síntese de LOAs
                    </CardTitle>
                </CardHeader>
                <div className="grid grid-cols-12 rounded-bl-md rounded-br-md bg-white dark:bg-boxdark">
                    <LOASynthesisChart data={synthesisData?.results} />
                </div>
            </Card>

            <Card
                className={`col-span-12 mx-auto w-full translate-y-0 transform overflow-hidden opacity-100 transition-all duration-300 ease-out lg:col-span-6`}
            >
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                        <BadgeInfoIcon size={28} />
                        Histórico de Pagamentos
                    </CardTitle>
                </CardHeader>
                <div className="grid grid-cols-12 rounded-bl-md rounded-br-md bg-white dark:bg-boxdark">
                    <ColumnChart
                        data={paymentHistoricData?.results}
                        propsArray={[...chartProps['HISTORICO'], ...chartProps['COMUM']]}
                    />
                </div>
            </Card>

            <Card
                className={`col-span-12 mx-auto w-full translate-y-0 transform overflow-hidden opacity-100 transition-all duration-300 ease-out lg:col-span-6`}
            >
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                        <BadgeInfoIcon size={28} />
                        Projeção de Pagamentos
                    </CardTitle>
                </CardHeader>
                <div className="grid grid-cols-12 rounded-bl-md rounded-br-md bg-white dark:bg-boxdark">
                    <ColumnChart
                        data={paymentProjectionData?.results}
                        propsArray={[...chartProps['PROJEÇÃO'], ...chartProps['COMUM']]}
                    />
                </div>
            </Card>
            <Card
                className={`col-span-12 mx-auto my-6 w-full translate-y-0 transform overflow-hidden opacity-100 transition-all duration-300 ease-out`}
            >
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                        <BadgeDollarSign size={28} />
                        Estoque de Precatórios
                    </CardTitle>
                </CardHeader>
                <div className="mx-auto rounded-br-md rounded-bl-md bg-white dark:bg-boxdark">
                    <LOADistribuitionBubbleChart
                        results={precatoryData?.results}
                        isLoading={precatoryLoading}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                    />
                </div>
            </Card>
        </div>
    );
};

export default PrecatoriosEspeciais;
