import React, { useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { InputData, transformChartData } from '@/functions/charts/chartDataTransformer';
import numberFormat from '@/functions/formaters/numberFormat';
import ComercialBrokersChartSkeleton from '../Skeletons/ComercialBrokersChartSkeleton';
import { ITabelaGerencialResponse } from '@/interfaces/ITabelaGerencialResponse';
import { UserVsStatusChartProps } from '@/types/userVsStatusChart';

interface CounterItem {
    counter: number;
    total: number;
}

interface Counter {
    [key: string]: CounterItem;
}

interface UserData {
    user: string;
    counter: Counter;
}

interface ComercialUserVsStatusChartProps {
    chartData: ITabelaGerencialResponse;
    isLoading: boolean;
}

const ComercialUserVsStatusChart = ({ chartData, isLoading }: ComercialUserVsStatusChartProps) => {
    const [data, setData] = React.useState<UserVsStatusChartProps[] | null>(null);

    const chartConfig = {
        'Negociação em Andamento': {
            label: 'Negociação em Andamento',
            color: '#2563eb',
        },
        'Proposta aceita': {
            label: 'Proposta aceita',
            color: '#34D399',
        },
        Repactuação: {
            label: 'Repactuação',
            color: '#60a5fa',
        },
        'Pendência a Sanar': {
            label: 'Pendência a Sanar',
            color: '#F59E0B',
        },
        'Due Diligence': {
            label: 'Due Diligence',
            color: '#84CC16',
        },
        'Em liquidação': {
            label: 'Em liquidação',
            color: '#F87171',
        },
        'Em cessão': {
            label: 'Em cessão',
            color: '#EA580C',
        },
        'Due em Andamento': {
            label: 'Due em Andamento',
            color: '#A855F7',
        },
        'Revisão de Due Diligence': {
            label: 'Revisão de Due Diligence',
            color: '#9333EA',
        },
    } satisfies ChartConfig;

    const handleChartData = (data: any) => {
        const counterObj: any = {};

        data.forEach((item: any) => {
            // verificando a existência do usuário no objeto
            if (!counterObj[item.usuario]) {
                counterObj[item.usuario] = {};
            }

            // verificando a existência do status de diligência no usuario do array
            if (item.status_diligencia !== 'Sem status') {
                counterObj[item.usuario][item.status_diligencia] = {
                    counter: (counterObj[item.usuario][item.status_diligencia]?.counter || 0) + 1,
                    total:
                        (counterObj[item.usuario][item.status_diligencia]?.total || 0) +
                        item.valor_liquido_disponivel,
                };
            } else {
                counterObj[item.usuario][item.status] = {
                    counter: (counterObj[item.usuario][item.status]?.counter || 0) + 1,
                    total:
                        (counterObj[item.usuario][item.status]?.total || 0) +
                        item.valor_liquido_disponivel,
                };
            }
        });

        const chartData = Object.entries(counterObj).map(([user, counter]) => ({
            user,
            counter,
        }));

        const totalValue = (user: UserData): number => {
            return Object.values(user.counter).reduce((acc, curr) => acc + curr.total, 0);
        };

        const orderedData = (chartData as UserData[]).sort((a, b) => totalValue(b) - totalValue(a));

        setData(transformChartData(orderedData as InputData[]));
    };

    useEffect(() => {
        if (!chartData) return;
        handleChartData(chartData);
    }, [chartData]);

    if (isLoading) {
        return <ComercialBrokersChartSkeleton />;
    }

    return (
        <div
            style={{
                height: data && data.length > 0 ? Math.max(data.length * 40, 450) : 'fit-content',
            }}
            className="grid w-full gap-5 p-5"
        >
            <h2 className="p-5 text-2xl font-medium">Usuário x Status x Valor Líquido</h2>
            {data && data.length > 0 ? (
                <ChartContainer config={chartConfig} className="aspect-[none] min-h-[250px] w-full">
                    <BarChart data={data} layout="vertical" barSize={40} barGap={20}>
                        <CartesianGrid horizontal={false} stroke="#454b52" />
                        <XAxis type="number" tickFormatter={(value) => numberFormat(value)} />
                        <YAxis
                            dataKey="user"
                            type="category"
                            width={100}
                            tickFormatter={(value) =>
                                value.length > 10 ? value.slice(0, 10).concat('...') : value
                            }
                        />
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Legend className="gap-5" />
                        {Object.keys(chartConfig).map((key: string) => (
                            <Bar
                                key={key}
                                dataKey={key}
                                stackId={'a'}
                                fill={chartConfig[key as keyof typeof chartConfig]?.color || '#ccc'}
                            />
                        ))}
                    </BarChart>
                </ChartContainer>
            ) : (
                <section className="flex h-fit w-full justify-center gap-2 rounded-md bg-white px-4 py-2 dark:bg-boxdark lg:flex-row">
                    <p className="scroll-m-20 text-center text-2xl font-semibold tracking-tight">
                        Nenhum dado disponível.
                    </p>
                </section>
            )}
        </div>
    );
};

export default ComercialUserVsStatusChart;
