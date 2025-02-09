'use client';

import numberFormat from '@/functions/formaters/numberFormat';
import type React from 'react';
import { useMemo, useState } from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    CartesianGrid,
} from 'recharts';

interface ILOADistribuitionResult {
    'MÊS E ANO DO PAGAMENTO': string;
    Recebimento: string;
    'Valor do Precatório Atualizado': number;
    Tribunal: string;
    LOA: string;
    Natureza: string;
}

const parseDate = (dateStr: string): number => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day).getTime();
};

const parseMonthYear = (monthYearStr: string): number => {
    const [month, year] = monthYearStr.split('/').map(Number);
    return new Date(year, month - 1, 1).getTime();
};

const tribunalColors: Record<string, string> = {
    TJPE: '#FF6384',
    TRF5: '#36A2EB',
    TRT: '#4BC0C0',
};

const getColorByTribunal = (tribunal: string): string => {
    return tribunalColors[tribunal] || '#000000';
};

interface LOADistribuitionBubbleChartProps {
    results: ILOADistribuitionResult[];
    isLoading: boolean;
}

export function LOADistribuitionBubbleChart({
    results = [],
    isLoading = false,
}: LOADistribuitionBubbleChartProps) {
    const defaultStart =
        results.length > 0
            ? parseMonthYear(results[0]['MÊS E ANO DO PAGAMENTO'])
            : new Date().getTime();
    const defaultEnd =
        results.length > 0
            ? parseMonthYear(results[results.length - 1]['MÊS E ANO DO PAGAMENTO'])
            : new Date('2026-03-30').getTime();

    const [dateRange, setDateRange] = useState({ start: defaultStart, end: defaultEnd });

    const formatDatePicker = (timestamp: number): string => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
    };

    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [year, month] = e.target.value.split('-').map(Number);
        const newStart = new Date(year, month - 1, 1).getTime();
        setDateRange((prev) => ({ ...prev, start: newStart }));
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [year, month] = e.target.value.split('-').map(Number);
        const newEnd = new Date(year, month - 1, 1).getTime();
        setDateRange((prev) => ({ ...prev, end: newEnd }));
    };

    const calculateZ = (value: number) => Math.sqrt(value) / 150;

    const filteredResults = useMemo(() => {
        return results.filter((item) => {
            const itemTimestamp = parseMonthYear(item['MÊS E ANO DO PAGAMENTO']);
            return itemTimestamp >= dateRange.start && itemTimestamp <= dateRange.end;
        });
    }, [results, dateRange]);

    const processedData = useMemo(() => {
        return filteredResults.map((item) => ({
            ...item,
            x: parseMonthYear(item['MÊS E ANO DO PAGAMENTO']),
            y: parseDate(item.Recebimento),
            z: calculateZ(item['Valor do Precatório Atualizado']),
            fillColor: getColorByTribunal(item.Tribunal),
            pagamentoLabel: item['MÊS E ANO DO PAGAMENTO'],
            recebimentoLabel: item.Recebimento,
            tribunalLabel: item.Tribunal,
        }));
    }, [filteredResults, calculateZ]); // Added calculateZ to dependencies

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0].payload;
            return (
                <div className="border border-gray-300 bg-white p-2 dark:bg-boxdark-2">
                    <p style={{ fontWeight: 'bold' }}>LOA: {item.LOA}</p>
                    <p>Tribunal: {item.tribunalLabel}</p>
                    <p>Valor: {numberFormat(item['Valor do Precatório Atualizado'])}</p>
                    <p>Mês/Ano do Pagamento: {item.pagamentoLabel}</p>
                    <p>Data do Recebimento: {item.recebimentoLabel}</p>
                    <p>Natureza: {item['Natureza']}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ width: '100%', minHeight: '500px', padding: '20px' }}>
            <h2>Distribuição do valor por LOAs</h2>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="start">Início: </label>
                <input
                    type="month"
                    id="start"
                    value={formatDatePicker(dateRange.start)}
                    onChange={handleStartChange}
                    style={{ marginRight: '10px' }}
                    className="rounded-md bg-gray-100 py-0 dark:bg-boxdark-2"
                />
                <label htmlFor="end">Fim: </label>
                <input
                    type="month"
                    id="end"
                    value={formatDatePicker(dateRange.end)}
                    onChange={handleEndChange}
                    className="rounded-md bg-gray-100 py-0 dark:bg-boxdark-2"
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                {Object.entries(tribunalColors).map(([tribunal, color]) => (
                    <span key={tribunal} style={{ marginRight: '10px' }}>
                        <span
                            style={{
                                display: 'inline-block',
                                width: '10px',
                                height: '10px',
                                backgroundColor: color,
                                marginRight: '5px',
                            }}
                        ></span>
                        {tribunal}
                    </span>
                ))}
            </div>
            {isLoading ? (
                <div>Carregando...</div>
            ) : (
                <ResponsiveContainer width="100%" minHeight={500}>
                    <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 50 }}
                        title="Distribuição do valor por LOAs"
                    >
                        <CartesianGrid />
                        <XAxis
                            dataKey="x"
                            type="number"
                            domain={[dateRange.start, dateRange.end]}
                            tickFormatter={(unixTime) =>
                                new Date(unixTime).toLocaleDateString('pt-BR', {
                                    month: '2-digit',
                                    year: 'numeric',
                                })
                            }
                            name="Mês e Ano do Pagamento"
                        />
                        <YAxis
                            dataKey="y"
                            type="number"
                            domain={['auto', 'auto']}
                            tickFormatter={(unixTime) =>
                                new Date(unixTime).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })
                            }
                            name="Data do Recebimento"
                        />
                        <ZAxis dataKey="z" range={[10, 1500]} name="Valor" />
                        <Tooltip content={<CustomTooltip />} />
                        <Scatter
                            data={processedData}
                            fill="#8884d8"
                            shape="circle"
                            fillOpacity={0.7}
                            legendType="circle"
                        >
                            {processedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fillColor} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
