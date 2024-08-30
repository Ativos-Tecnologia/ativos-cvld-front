"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { nome: "Paula", primeiro_contato: 100, proposta_enviada: 50, proposta_aprovada: 30, contrato_assinado: 20, cliente_ativo: 10 },
  { nome: "João", primeiro_contato: 70, proposta_enviada: 90, proposta_aprovada: 30, contrato_assinado: 20, cliente_ativo: 40 },
  { nome: "Jarbas", primeiro_contato: 10, proposta_enviada: 20, proposta_aprovada: 30, contrato_assinado: 40, cliente_ativo: 50 },
    { nome: "Maria", primeiro_contato: 30, proposta_enviada: 40, proposta_aprovada: 50, contrato_assinado: 60, cliente_ativo: 70 },
    { nome: "José", primeiro_contato: 50, proposta_enviada: 60, proposta_aprovada: 70, contrato_assinado: 80, cliente_ativo: 90 },
    { nome: "Ana", primeiro_contato: 150, proposta_enviada: 80, proposta_aprovada: 70, contrato_assinado: 60, cliente_ativo: 50 },
    { nome: "Carlos", primeiro_contato: 100, proposta_enviada: 70, proposta_aprovada: 60, contrato_assinado: 50, cliente_ativo: 40 },
    { nome: "Mariana", primeiro_contato: 90, proposta_enviada: 80, proposta_aprovada: 70, contrato_assinado: 60, cliente_ativo: 50 },
    { nome: "Joaquim", primeiro_contato: 80, proposta_enviada: 70, proposta_aprovada: 60, contrato_assinado: 50, cliente_ativo: 40 },

]

const chartConfig = {
  nome: {
    label: "Nome",
    color: "hsl(var(--chart-1))",
  },
    primeiro_contato: {
        label: "Primeiro Contato",
        color: "hsl(var(--chart-2))",
    },
    proposta_enviada: {
        label: "Proposta Enviada",
        color: "hsl(var(--chart-3))",
    },
    proposta_aprovada: {
        label: "Proposta Aprovada",
        color: "hsl(var(--chart-4))",
    },
    contrato_assinado: {
        label: "Contrato Assinado",
        color: "hsl(var(--chart-5))",
    },
    cliente_ativo: {
        label: "Cliente Ativo",
        color: "hsl(var(--chart-6))",
    },
} satisfies ChartConfig

export function CellerChartBar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="nome"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="primeiro_contato" stackId="a" fill="hsl(var(--chart-2))" />
            <Bar dataKey="proposta_enviada" stackId="a" fill="hsl(var(--chart-3))" />
            <Bar dataKey="proposta_aprovada" stackId="a" fill="hsl(var(--chart-4))" />
            <Bar dataKey="contrato_assinado" stackId="a" fill="hsl(var(--chart-5))" />
            <Bar dataKey="cliente_ativo" stackId="a" fill="hsl(var(--chart-6))" />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
