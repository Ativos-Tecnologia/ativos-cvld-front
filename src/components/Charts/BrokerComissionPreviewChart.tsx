'use client';

import { Label, Pie, PieChart, Sector } from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';
import { CardContent } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useContext, useEffect, useMemo, useState } from 'react';
import { NotionResponse } from '@/interfaces/INotion';
import numberFormat from '@/functions/formaters/numberFormat';
import { BrokersContext } from '@/context/BrokersContext';
import { generateColor } from '@/functions/charts/generateColor';

interface Result {
    [key: string]: number;
}

interface BrokerComissionPreviewChartProps {
    data: NotionResponse | null;
}

export function BrokerComissionPreviewChart({ data }: BrokerComissionPreviewChartProps) {
    const id = 'pie-interactive-comission';
    const { selectedUser } = useContext(BrokersContext);
    const [chartData, setChartData] = useState<
        { label: string; comission: number; fill: string }[]
    >([]);
    const [chartConfig, setChartConfig] = useState<ChartConfig>({});
    const [activeItem, setActiveItem] = useState<string>('all');

    const activeIndex = useMemo(
        () => chartData.findIndex((item) => item.label === activeItem),
        [activeItem, chartData],
    );

    const totalComission = useMemo(
        () => chartData.reduce((sum, item) => sum + item.comission, 0),
        [chartData],
    );

    function handleData(data: NotionResponse) {
        const result: Result = {};

        data.results.forEach((page) => {
            const credor = {
                id: page.properties.Credor.id,
                name: page.properties.Credor.title[0]?.text.content || 'Desconhecido',
                comission: page.properties['Comissão - Celer']?.number || 0,
            };

            result[credor.name] = credor.comission;
        });

        const entries = Object.entries(result);
        const formattedData = entries.map(([name, comission], index) => ({
            label: name.length > 30 ? name.slice(0, 30).concat('...') : name,
            comission,
            fill: generateColor(index, entries.length),
        }));

        const newChartConfig: ChartConfig = formattedData.reduce((acc, { label, fill }) => {
            acc[label] = { label, color: fill };
            return acc;
        }, {} as ChartConfig);

        setChartData(formattedData);
        setChartConfig(newChartConfig);
    }

    useEffect(() => {
        if (data) {
            handleData(data);
        }
    }, [data]);

    const labels = useMemo(() => chartData.map((item) => item.label), [chartData]);

    const selectedComission =
        activeItem === 'all'
            ? totalComission
            : chartData.find((item) => item.label === activeItem)?.comission || 0;

    useEffect(() => {
        setActiveItem('all');
    }, [selectedUser]);

    return (
        <div
            data-chart={id}
            className="col-span-6 h-full rounded-sm border border-stroke bg-white p-6 py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4 xl:col-span-6"
        >
            <ChartStyle id={id} config={chartConfig} />
            <div className="flex w-full flex-col justify-between gap-2 sm:flex-row">
                <div>
                    <h5 className="font-rooftop text-xl tracking-wider text-black dark:text-white">
                        Previsão de Comissão
                    </h5>
                </div>
                <Select value={activeItem} onValueChange={setActiveItem}>
                    <SelectTrigger className="size-fit rounded-lg" aria-label="Selecione um status">
                        <SelectValue placeholder="Todos os credores" />
                    </SelectTrigger>
                    <SelectContent align="end" className="rounded-xl">
                        <SelectItem key="all" value="all" className="rounded-lg [&_span]:flex">
                            <div className="flex items-center gap-2 text-xs">
                                <span className="flex h-3 w-3 shrink-0 rounded-sm bg-gray-400" />
                                Todos os credores
                            </div>
                        </SelectItem>
                        {labels.map((key) => {
                            const config = chartConfig[key];
                            return config ? (
                                <SelectItem
                                    key={key}
                                    value={key}
                                    className="rounded-lg [&_span]:flex"
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <span
                                            className="flex h-3 w-3 shrink-0 rounded-sm"
                                            style={{ backgroundColor: config.color }}
                                        />
                                        {config.label}
                                    </div>
                                </SelectItem>
                            ) : null;
                        })}
                    </SelectContent>
                </Select>
            </div>
            <CardContent className="mt-3 flex flex-1 justify-center p-0 sm:justify-between">
                <ChartContainer
                    id={id}
                    config={chartConfig}
                    className="flex aspect-square w-[232px] justify-between"
                >
                    <PieChart className="flex justify-between">
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={chartData}
                            dataKey="comission"
                            nameKey="label"
                            outerRadius={80}
                            innerRadius={65}
                            activeIndex={activeIndex}
                            activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                                <g>
                                    <Sector {...props} outerRadius={outerRadius + 5} />
                                    <Sector
                                        {...props}
                                        outerRadius={outerRadius + 18}
                                        innerRadius={outerRadius + 8}
                                    />
                                </g>
                            )}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-lg font-semibold"
                                                >
                                                    {numberFormat(selectedComission)}
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
                <div className="hidden max-h-[220px] flex-col gap-1 overflow-y-scroll md:flex">
                    {chartData &&
                        chartData.map((data) => (
                            <div
                                className="flex cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-0.5 transition-all hover:bg-accent"
                                onClick={() => setActiveItem(data.label)}
                            >
                                <div
                                    className="size-3 rounded-full"
                                    style={{
                                        backgroundColor: data.fill,
                                    }}
                                />
                                <p className="text-sm">{data.label}</p>
                            </div>
                        ))}
                </div>
            </CardContent>
        </div>
    );
}
