'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { CardContent, CardFooter } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import numberFormat from '@/functions/formaters/numberFormat';

const chartConfig = {} satisfies ChartConfig;

export default chartConfig;

interface GoalChartProps {
    footerText: string;
    chartData: {
        usuario: string;
        total: number;
        fill: string;
    }[];
}

export function GoalChart({ footerText, chartData }: GoalChartProps) {
    const total = chartData.reduce((acc, { total }) => acc + total, 0);

    return (
        <div className="flex flex-col">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    formatter={(value, user, rest) => {
                                        const hslColor = rest.payload.fill;
                                        return (
                                            <>
                                                <div
                                                    className={`size-3 rounded`}
                                                    style={{
                                                        backgroundColor: hslColor,
                                                    }}
                                                />
                                                <span>
                                                    {user}:{' '}
                                                    <strong>{numberFormat(Number(value))}</strong>
                                                </span>
                                            </>
                                        );
                                    }}
                                    className="flex min-w-[180px]"
                                    hideLabel
                                />
                            }
                        />
                        <Pie
                            data={chartData}
                            dataKey="total"
                            nameKey="usuario"
                            innerRadius={80}
                            strokeWidth={5}
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
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {numberFormat(total)}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Meta de comissão
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <span className="font-medium">{footerText}</span>
            </CardFooter>
        </div>
    );
}
