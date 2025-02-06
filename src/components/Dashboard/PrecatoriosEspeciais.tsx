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

const chartProps = {
    "COMUM": [
        "MONTANTE TOTAL ATÉ ANO ANTERIOR AO DE REFERÊNCIA",
        "SALDO DEVEDOR TOTAL  APÓS PAGAMENTO"
    ],
    "HISTORICO": ["MONTANTE TOTAL PAGO NO ANO DE REFERÊNCIA "],
    "PROJEÇÃO": ["MONTANTE TOTAL A SER PAGO NO ANO DE REFERÊNCIA"]
}

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

    const {
        data: paymentHistoricData,
        isLoading: paymentHistoricLoading,
        refetch: refetchPaymentHistoricData,
    } = useQuery({
        queryKey: ['paymentHistoricData'],
        queryFn: async () => {
            const response = await api.post(
                '/api/precatorios-especiais/extrair-historico/',
            );

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
            const response = await api.post(
                '/api/precatorios-especiais/extrair-projecao/',
            );

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
                '/api/precatorios-especiais/extrair-amostragem-do-estoque/',
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

    const plotData = {
        "results": [
            {
                "ANO": 2020,
                "RECEITA CORRENTE LÍQUIDA (R$)": 39600184522,
                "% DA RECEITA CORRENTE LÍQUIDA REPASSADA": 0.00423666276824527,
                "MONTANTE TOTAL PAGO NO ANO DE REFERÊNCIA ": 167772627.38,
                "MONTANTE TOTAL ATÉ ANO ANTERIOR AO DE REFERÊNCIA": 472141925.86,
                "SALDO DEVEDOR TOTAL  APÓS PAGAMENTO": 420432545.11,
                "MUTAÇÃO SALDO DEVEDOR TOTAL": -51709380.75
            },
            {
                "ANO": 2021,
                "RECEITA CORRENTE LÍQUIDA (R$)": 44248574081,
                "% DA RECEITA CORRENTE LÍQUIDA REPASSADA": 0.00589252222597514,
                "MONTANTE TOTAL PAGO NO ANO DE REFERÊNCIA ": 260735706.24,
                "MONTANTE TOTAL ATÉ ANO ANTERIOR AO DE REFERÊNCIA": 420571567.88,
                "SALDO DEVEDOR TOTAL  APÓS PAGAMENTO": 381510341.70000005,
                "MUTAÇÃO SALDO DEVEDOR TOTAL": -39061226.17999995
            },
            {
                "ANO": 2022,
                "RECEITA CORRENTE LÍQUIDA (R$)": 51402332982.04,
                "% DA RECEITA CORRENTE LÍQUIDA REPASSADA": 0.0032964316030014416,
                "MONTANTE TOTAL PAGO NO ANO DE REFERÊNCIA ": 169444274.91,
                "MONTANTE TOTAL ATÉ ANO ANTERIOR AO DE REFERÊNCIA": 383975801.42,
                "SALDO DEVEDOR TOTAL  APÓS PAGAMENTO": 321886284.73,
                "MUTAÇÃO SALDO DEVEDOR TOTAL": -62089516.69
            },
            {
                "ANO": 2023,
                "RECEITA CORRENTE LÍQUIDA (R$)": 49894515999.66,
                "% DA RECEITA CORRENTE LÍQUIDA REPASSADA": 0.003891036197271118,
                "MONTANTE TOTAL PAGO NO ANO DE REFERÊNCIA ": 194141367.8,
                "MONTANTE TOTAL ATÉ ANO ANTERIOR AO DE REFERÊNCIA": 321834027.26,
                "SALDO DEVEDOR TOTAL  APÓS PAGAMENTO": 479602912.82000005,
                "MUTAÇÃO SALDO DEVEDOR TOTAL": 157768885.56000006
            },
            {
                "ANO": 2024,
                "RECEITA CORRENTE LÍQUIDA (R$)": 46526699402.61,
                "% DA RECEITA CORRENTE LÍQUIDA REPASSADA": 0.0058480844193460335,
                "MONTANTE TOTAL PAGO NO ANO DE REFERÊNCIA ": 272092065.85999995,
                "MONTANTE TOTAL ATÉ ANO ANTERIOR AO DE REFERÊNCIA": 479602912.82,
                "SALDO DEVEDOR TOTAL  APÓS PAGAMENTO": 561072317.48,
                "MUTAÇÃO SALDO DEVEDOR TOTAL": 81469404.66000003
            }
        ]
    }

    return (
        <div className='grid gap-6 grid-cols-12'>
            <div className="relative col-span-12 flex h-[85vh] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-slate-900">
                <div className="pointer-events-none absolute inset-0 z-20 h-full w-full bg-slate-900 [mask-image:radial-gradient(transparent,white)]" />

                <Boxes />
                <h1 className={cn('relative z-20 font-satoshi text-xl text-white md:text-6xl')}>
                    Análise de Precatórios Especiais
                </h1>
                <p className="relative z-20 mt-2 text-center text-neutral-300">
                    Nosso motor de análise de dados e inteligência artificial
                </p>
            </div>
            <section className="w-full col-span-12 mx-auto rounded-md bg-white dark:bg-boxdark">
                <CardResumoPrecatorioEspecial
                    data={overviewData?.results}
                    estados={estados.map((item) => item.nome)}
                    estadoSelecionado={estadoSelecionado}
                    handleEstadoChange={handleEstadoChange}
                    isLoading={overviewLoading}
                />
            </section>
            <Card
                className={`mx-auto w-full col-span-12 translate-y-0 transform overflow-hidden opacity-100 transition-all duration-300 ease-out`}
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
                className={`mx-auto w-full col-span-6 translate-y-0 transform overflow-hidden opacity-100 transition-all duration-300 ease-out`}
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
                        propsArray={[...chartProps["HISTORICO"], ...chartProps["COMUM"]]}
                    />
                </div>
            </Card>

            <Card
                className={`mx-auto w-full col-span-6 translate-y-0 transform overflow-hidden opacity-100 transition-all duration-300 ease-out`}
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
                        propsArray={[...chartProps["PROJEÇÃO"], ...chartProps["COMUM"]]}
                    />
                </div>
            </Card>
            {/* <Card
                className={`mx-auto my-6 w-full col-span-12 translate-y-0 transform overflow-hidden opacity-100 transition-all duration-300 ease-out`}
            >
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                        <BadgeDollarSign size={28} />
                        Estoque de Precatórios
                    </CardTitle>
                </CardHeader>
                <div className="mx-auto my-6 rounded-md bg-white dark:bg-boxdark">
                    <LOADistribuitionBubbleChart
                        results={precatoryData?.results}
                        isLoading={precatoryLoading}
                    />
                </div>
            </Card> */}
        </div >
    );
};

export default PrecatoriosEspeciais;
