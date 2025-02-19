import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { groupResultsByUsuario } from '@/functions/charts/groupResultsByUsuario';
import numberFormat from '@/functions/formaters/numberFormat';
import { generateColorByBaseHue } from '@/functions/charts/generateColorByBaseHue';
import { TotalLiquidAvailableChartSkeleton } from '../Skeletons/TotalLiquidAvailableChartSkeleton';

type Result = {
    id: string;
    credor: string;
    usuario: string;
    meta_1: number;
    meta_2: number;
    meta_3: number;
    valor_liquido_disponivel: number;
    precatorio_fechado_em: string;
};

interface TotalLiquidAvailableChartProps {
    results: Result[];
    isLoading: boolean;
}

const chartConfig = {
    valor_liquido_disponivel: {
        label: 'Valor Líquido Disponível',
        color: 'hsl(149, 41%, 56%)',
    },
} satisfies ChartConfig;

export function TotalLiquidAvailableChart({ results, isLoading }: TotalLiquidAvailableChartProps) {
    if (isLoading) return <TotalLiquidAvailableChartSkeleton />;

    function handleResults() {
        const groupedData = groupResultsByUsuario(results);

        const chartData = Object.entries(groupedData).map(([usuario, result], index) => ({
            usuario,
            valor_liquido_disponivel: result.reduce(
                (acc, item) => acc + item.valor_liquido_disponivel,
                0,
            ),
            fill: generateColorByBaseHue('lightgreen', index, Object.entries(groupedData).length),
        }));

        const total = chartData.reduce((acc, item) => acc + item.valor_liquido_disponivel, 0);

        const orderedData = chartData.sort(
            (a, b) => b.valor_liquido_disponivel - a.valor_liquido_disponivel,
        );

        const coloredChartData = orderedData.map((data, index) => ({
            ...data,
            fill: generateColorByBaseHue('lightgreen', index, orderedData.length),
        }));

        return { coloredChartData, total };
    }

    const { coloredChartData, total } = handleResults();

    return (
        <div
            style={{
                height: results.length > 0 ? Math.max(results.length * 40, 450) : 'fit-content',
            }}
            className="grid w-full gap-5 p-4"
        >
            <div className="flex w-full flex-wrap justify-between pb-2">
                <h2 className="font-medium 2xsm:text-[18px] md:text-2xl">
                    Valor Liquido a Ser Cedido
                </h2>
                <p className="2xsm:text-sm md:text-xl">
                    Total: <span className="font-bold">{numberFormat(total)}</span>
                </p>
            </div>
            {results.length > 0 ? (
                <ChartContainer config={chartConfig} className="aspect-[none] min-h-[250px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={coloredChartData}
                        layout="vertical"
                        barSize={40}
                        barGap={20}
                    >
                        <CartesianGrid horizontal={false} stroke="#454b52" />
                        <XAxis
                            type="number"
                            dataKey="valor_liquido_disponivel"
                            tickFormatter={(value) =>
                                value.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })
                            }
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            dataKey="usuario"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                            width={100}
                            tickFormatter={(value) =>
                                value.length > 10 ? value.slice(0, 10).concat('...') : value
                            }
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar
                            dataKey="valor_liquido_disponivel"
                            fill="var(--color-valor_liquido_disponivel)"
                            radius={5}
                        />
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
}
