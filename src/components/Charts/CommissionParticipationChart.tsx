"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { NotionPage } from "@/interfaces/INotion"

const COLORS = [
  "#2662D9",
  "#2EB88A",
  "#E88C30"
]

const chartConfig = {
  meta1: {
    label: "Cenário 1",
    color: COLORS[0],
  },
  meta2: {
    label: "Cenário 2",
    color: COLORS[1],
  },
  meta3: {
    label: "Cenário 3",
    color: COLORS[2],
  },
} satisfies ChartConfig;

interface CoordinatorParticipationChartProps {
  chartData: NotionPage;
  className?: string;
}

export function CoordinatorParticipationChart({ chartData, className }: CoordinatorParticipationChartProps) {
  const data = [
    {
      commission: "Comissão",
      meta1: chartData.properties["META 1 - Comissão Interna (Comercial)"]?.formula?.number,
      meta2: chartData.properties["META 2 - Comissão Interna (Comercial)"]?.formula?.number,
      meta3: chartData.properties["META 3 - Comissão Interna (Comercial)"]?.formula?.number,
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center relative h-full w-full max-w-fit">
      <CardHeader>
        <CardTitle>Participação da Comissão do Coordenador</CardTitle>
        <CardDescription>Metas de um único precatório</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className={`h-[300px] sm:w-full w-[280px] ${className}`}>
          <BarChart
            data={data}
            layout="vertical"
            width={0}
            height={0}
          >
            <XAxis type="number" />
            <YAxis
              dataKey="commission"
              type="category"
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="meta1"
              fill="var(--color-meta1)"
              radius={[0, 5, 5, 0]}
            />
            <Bar
              dataKey="meta2"
              fill="var(--color-meta2)"
              radius={[0, 5, 5, 0]}
            />
            <Bar
              dataKey="meta3"
              fill="var(--color-meta3)"
              radius={[0, 5, 5, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex flex-row w-full sm:gap-6 gap-2 justify-center font-medium">
          <span className="flex items-center gap-2">
            <div
              className="size-3 rounded"
              style={{ backgroundColor: COLORS[0] }}
            />
            Cenário 1
          </span>
          <span className="flex items-center gap-2">
            <span
              className="size-3 rounded"
              style={{ backgroundColor: COLORS[1] }}
            />
            Cenário 2
          </span>
          <span className="flex items-center gap-2">
            <span
              className="size-3 rounded"
              style={{ backgroundColor: COLORS[2] }}
            />
            Cenário 3
          </span>
        </div>
      </CardFooter>
    </div>
  );
}
