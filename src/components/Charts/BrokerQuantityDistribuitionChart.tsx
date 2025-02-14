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
import { BrokersContext } from '@/context/BrokersContext';
import { generateColor } from '@/functions/charts/generateColor';

interface StatusCount {
    [key: string]: number;
}

interface BrokerQuantityDistribuitionChartProps {
    data: NotionResponse | null;
}

export function BrokerQuantityDistribuitionChart({ data }: BrokerQuantityDistribuitionChartProps) {
    const id = 'pie-interactive';
    const { selectedUser } = useContext(BrokersContext);
    const [chartData, setChartData] = useState<{ label: string; count: number; fill: string }[]>(
        [],
    );
    const [chartConfig, setChartConfig] = useState<ChartConfig>({});
    const [activeItem, setActiveItem] = useState<string>('all');
    const activeIndex = useMemo(
        () => chartData.findIndex((item) => item.label === activeItem),
        [activeItem, chartData],
    );

    function handleData(data: NotionResponse) {
        const statusCount: StatusCount = {};

        data.results.forEach((page) => {
            const status = page.properties.Status.status?.name;
            const statusDiligencia = page.properties['Status Diligência'].select?.name;

            if (statusDiligencia) {
                statusCount[statusDiligencia] = (statusCount[statusDiligencia] || 0) + 1;
                return;
            }

            if (status) {
                statusCount[status] = (statusCount[status] || 0) + 1;
            }
        });

        const entries = Object.entries(statusCount);
        const results = entries.map(([name, count], index) => ({
            label: name,
            count,
            fill: generateColor(index, entries.length),
        }));

        const newChartConfig: ChartConfig = results.reduce((acc, { label, fill }) => {
            acc[label] = { label, color: fill };
            return acc;
        }, {} as ChartConfig);

        setChartData(results);
        setChartConfig(newChartConfig);
    }

    useEffect(() => {
        if (data) {
            handleData(data);
        }
    }, [data]);

    const labels = useMemo(() => chartData.map((item) => item.label), [chartData]);

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
                        Distribuição
                    </h5>
                </div>
                <Select value={activeItem} onValueChange={setActiveItem}>
                    <SelectTrigger className="size-fit rounded-lg" aria-label="Selecione um status">
                        <SelectValue placeholder="Todos os ofícios" />
                    </SelectTrigger>
                    <SelectContent align="end" className="rounded-xl">
                        <SelectItem key="all" value="all" className="rounded-lg [&_span]:flex">
                            <div className="flex items-center gap-2 text-xs">
                                <span className="flex h-3 w-3 shrink-0 rounded-sm bg-gray-400" />
                                Todos os ofícios
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
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={(value, name, item) => {
                                        return (
                                            <>
                                                <div
                                                    className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                                                    style={{
                                                        backgroundColor: item.payload.fill,
                                                    }}
                                                />
                                                {chartConfig[name as keyof typeof chartConfig]
                                                    ?.label || name}
                                                :
                                                <div className="font-mono ml-auto flex items-baseline gap-0.5 font-medium tabular-nums text-foreground">
                                                    {value}
                                                </div>
                                            </>
                                        );
                                    }}
                                />
                            }
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
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
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {activeIndex !== -1
                                                        ? chartData[activeIndex].count
                                                        : data?.results.length}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Ofícios
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
                                key={data.label}
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
