"use client"
import React from 'react'
import CustomSkeleton from '../CrmUi/CustomSkeleton'
import { Legend, YAxis } from 'recharts'
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartContainer,
    ChartLegend,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

type ColumnChartProps = {
    data: {
        [key: string]: number
    }[],
    propsArray: string[]
}

type ChartSeries = {
    [key: string]: string | number
}[]

type ConfigChartProps = {
    [key: string]: {
        label: string,
        color: string
    }
}

const ColumnChart = ({ data, propsArray }: ColumnChartProps) => {

    const [chartData, setChartData] = React.useState<ChartSeries | undefined>([]);
    const [chartConfig, setChartConfig] = React.useState<ConfigChartProps>({});

    function fillChartData() {
        let result: any = [];
        data.forEach(item => {
            let newItem: any = {};
            newItem["year"] = item['ANO'];
            propsArray.forEach(prop => {
                newItem[prop] = item[prop];
            });
            result.push(newItem);
        });
        return result;
    }

    function fillChartConfigs() {
        let configs: any = {};
        propsArray.forEach((prop, index) => {
            configs[prop] = {
                label: prop,
                color: `hsl(var(--chart-${index + 1}))`
            }
        });
        return configs;
    }

    React.useEffect(() => {
        if (data) {
            const dataToAppend = fillChartData();
            const configs = fillChartConfigs();
            setChartData(dataToAppend as ChartSeries);
            setChartConfig(configs);
        }
    }, [data])

    if (!data) {
        return (
            <div className='col-span-12 px-5 pb-6 pt-7.5'>
                <div className='flex items-center justify-between mb-3'>
                    <CustomSkeleton type='title' className='h-8 w-[250px]' />
                    <CustomSkeleton type='content' className='h-8 w-8' />
                </div>
                <CustomSkeleton type='content' className='h-80 w-full' />
            </div>
        )
    }

    return (
        <div className='col-span-12 px-5 pb-6 pt-7.5'>
            {/* <ReactApexChart options={options} series={series} type='bar' height={600} /> */}
            <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="year"
                        tickLine={true}
                        tickMargin={10}
                        axisLine={true}
                    />
                    <YAxis

                        tickLine={true}
                        tickMargin={10}
                        axisLine={true}
                        domain={["auto", "auto"]}
                        tickFormatter={(value: any) => {
                            return `${(value / 1000000).toFixed(0)}M`;
                        }}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />

                    <Legend verticalAlign="bottom" height={36} margin={{ top: 20}} />

                    {propsArray.map((prop, index) => (
                        <Bar
                            key={index}
                            dataKey={prop}
                            fill={chartConfig[prop]?.color}
                            radius={4}
                        />
                    ))}
                </BarChart>
            </ChartContainer>
        </div>
    )
}

export default ColumnChart