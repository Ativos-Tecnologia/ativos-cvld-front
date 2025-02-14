'use client';

import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { NotionPage } from '@/interfaces/INotion';
import { generateColorByBaseHue } from '@/functions/charts/generateColorByBaseHue';

const COLORS = {
    red: generateColorByBaseHue('red', 0, 1),
    yellow: generateColorByBaseHue('yellow', 0, 1),
    green: generateColorByBaseHue('green', 0, 1),
};

const chartConfig = {
    meta1: {
        label: 'Meta até 2.5MM',
        color: COLORS.red,
    },
    meta2: {
        label: 'Meta 2.5MM até 3.75MM',
        color: COLORS.yellow,
    },
    meta3: {
        label: 'Meta acima de 3.75MM',
        color: COLORS.green,
    },
} satisfies ChartConfig;

interface CoordinatorParticipationChartProps {
    chartData: NotionPage;
    className?: string;
}

export function CoordinatorParticipationChart({
    chartData,
    className,
}: CoordinatorParticipationChartProps) {
    const data = [
        {
            commission: 'Comissão',
            meta1: chartData.properties['META 1 - Comissão Interna (Comercial)']?.formula?.number,
            meta2: chartData.properties['META 2 - Comissão Interna (Comercial)']?.formula?.number,
            meta3: chartData.properties['META 3 - Comissão Interna (Comercial)']?.formula?.number,
        },
    ];

    return (
        <div className="relative mx-auto flex h-full w-full max-w-fit flex-col items-center justify-center">
            <CardHeader className="p-0">
                <CardTitle>Participação da Comissão do Coordenador</CardTitle>
                <CardDescription>Metas de um único precatório</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <ChartContainer config={chartConfig} className={`h-[300px] w-[280px] ${className}`}>
                    <BarChart data={data} layout="vertical">
                        <XAxis type="number" />
                        <YAxis
                            dataKey="commission"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="meta1" fill="var(--color-meta1)" radius={[0, 5, 5, 0]} />
                        <Bar dataKey="meta2" fill="var(--color-meta2)" radius={[0, 5, 5, 0]} />
                        <Bar dataKey="meta3" fill="var(--color-meta3)" radius={[0, 5, 5, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="justify-center p-0">
                <div className="flex w-full max-w-full flex-row flex-wrap justify-center gap-2 font-medium sm:gap-4">
                    <span className="flex items-center gap-1 whitespace-nowrap text-xs">
                        <div className="size-3 rounded" style={{ backgroundColor: COLORS.red }} />
                        <span className="hidden sm:inline">Meta </span>até 2.5MM
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap text-xs">
                        <span
                            className="size-3 rounded"
                            style={{ backgroundColor: COLORS.yellow }}
                        />
                        <span className="hidden sm:inline">Meta </span>2.5MM até 3.75MM
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap text-xs">
                        <span
                            className="size-3 rounded"
                            style={{ backgroundColor: COLORS.green }}
                        />
                        <span className="hidden sm:inline">Meta </span>acima de 3.75MM
                    </span>
                </div>
            </CardFooter>
        </div>
    );
}
