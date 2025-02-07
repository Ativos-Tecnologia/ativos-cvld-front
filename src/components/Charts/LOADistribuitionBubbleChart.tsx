import numberFormat from '@/functions/formaters/numberFormat';
import { ILOADistribuitionResult } from '@/interfaces/ILOADistribuitionResults';
import { ApexOptions } from 'apexcharts';
import React from 'react';
import Chart from 'react-apexcharts';
import { AiOutlineLoading } from 'react-icons/ai';

const parseDate = (dateStr: string): number => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day).getTime();
};

const parseMonthYear = (monthYearStr: string): number => {
    const [month, year] = monthYearStr.split('/').map(Number);
    return new Date(year, month - 1, 1).getTime();
};

const tribunalColors: Record<string, string> = {
    TJPE: 'rgba(255, 99, 132, 0.8)',
    TRF5: 'rgba(54, 162, 235, 0.8)',
    TRT: 'rgba(75, 192, 192, 0.8)',
};

const getColorByTribunal = (tribunal: string): string => {
    return tribunalColors[tribunal] || 'rgba(0, 0, 0, 0.8)';
};

interface LOADistribuitionBubbleChartProps {
    results?: ILOADistribuitionResult[];
    isLoading: boolean;
}

export function LOADistribuitionBubbleChart({
    results = [],
    isLoading,
}: LOADistribuitionBubbleChartProps) {
    const isDarkMode = localStorage.getItem('color-theme') === '"dark"';

    const defaultStart = parseMonthYear('02/2025');
    const defaultEnd = parseMonthYear('03/2026');

    const [dateRange, setDateRange] = React.useState({ start: defaultStart, end: defaultEnd });

    const formatDatePicker = (timestamp: number): string => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        if (month.length < 2) month = '0' + month;
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

    // Calcula os valores mínimo e máximo dos dados (para o cálculo de Z) considerando todos os resultados caso a gente precise plotar dados muito mais discrepantes que os atuais
    // const { minValue, maxValue } = React.useMemo(() => {
    //     if (results.length === 0) return { minValue: 0, maxValue: 0 };
    //     const valores = results.map((item) => item['Valor do Precatório Atualizado']);
    //     return {
    //         minValue: Math.min(...valores),
    //         maxValue: Math.max(...valores),
    //     };
    // }, [results]);

    const calculateZ = (y: number) => Math.max(Math.sqrt(y) / 150, 15);

    const filteredResults = React.useMemo(() => {
        return results.filter((item) => {
            const itemTimestamp = parseMonthYear(item['MÊS E ANO DO PAGAMENTO']);
            return itemTimestamp >= dateRange.start && itemTimestamp <= dateRange.end;
        });
    }, [results, dateRange]);

    const processedData = React.useMemo(() => {
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
    }, [filteredResults]);

    const series = React.useMemo(() => {
        return [
            {
                data: processedData.map(({ x, y, z, fillColor }) => ({ x, y, z, fillColor })),
            },
        ];
    }, [processedData]);

    const options: ApexOptions = React.useMemo(() => {
        return {
            chart: {
                id: 'bubble-chart',
                animations: { enabled: false },
                zoom: {
                    enabled: true,
                    type: 'x',
                    autoScaleYaxis: true,
                },
                toolbar: {
                    show: true,
                    autoSelected: 'zoom',
                },
            },
            xaxis: {
                title: {
                    text: 'Mês e Ano do Pagamento',
                },
                type: 'datetime',
                labels: {
                    formatter: (value) =>
                        new Date(value).toLocaleDateString('pt-BR', {
                            month: '2-digit',
                            year: 'numeric',
                        }),
                },
                min: dateRange.start,
                max: dateRange.end,
            },
            yaxis: {
                title: { text: 'Data do Recebimento' },
                type: 'datetime',
                labels: {
                    formatter: (value) =>
                        new Date(value).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        }),
                },
            },
            dataLabels: {
                enabled: false,
            },
            plotOptions: {
                bubble: {
                    zScaling: true,
                },
            },
            fill: {
                opacity: 0.7,
            },
            tooltip: {
                custom: ({ dataPointIndex }) => {
                    const item = processedData[dataPointIndex];
                    return `
                      <div style="
                        padding: 12px; 
                        background: rgba(0, 0, 0, 0.85); 
                        color: #fff; 
                        border-radius: 8px; 
                        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
                        font-size: 14px;
                        text-align: left;
                        line-height: 1.6;
                      ">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <div style="
                            width: 12px; 
                            height: 12px; 
                            background: ${item.fillColor}; 
                            border-radius: 6px;
                          "></div>
                          <strong style="font-size: 16px">LOA: ${item.LOA}</strong>
                        </div>
                        <span style="display: block;"><span style="font-weight: bold">Tribunal:</span> ${item.tribunalLabel}</span>
                        <span style="display: block;"><span style="font-weight: bold">Valor:</span> ${numberFormat(item['Valor do Precatório Atualizado'])}</span>
                        <span style="display: block;"><span style="font-weight: bold">Mês/Ano do Pagamento:</span> ${item.pagamentoLabel}</span>
                        <span style="display: block;"><span style="font-weight: bold">Data do Recebimento:</span> ${item.recebimentoLabel}</span>
                        <span style="display: block;"><span style="font-weight: bold">Natureza:</span> ${item['Natureza']}</span>
                      </div>
                    `;
                },
            },
        };
    }, [processedData, dateRange, isDarkMode]);

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4">
            <div className="mb-3 ml-2">
                {/* Date Picker e Legends */}
                <div className="my-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <label htmlFor="start" className="font-medium">
                            Início:
                        </label>
                        <input
                            type="month"
                            id="start"
                            value={formatDatePicker(dateRange.start)}
                            onChange={handleStartChange}
                            className="rounded border p-1"
                        />
                        <label htmlFor="end" className="font-medium">
                            Fim:
                        </label>
                        <input
                            type="month"
                            id="end"
                            value={formatDatePicker(dateRange.end)}
                            onChange={handleEndChange}
                            className="rounded border p-1"
                        />
                    </div>
                    {/* Legends para os tribunais */}
                    <div className="flex items-center gap-4">
                        {Object.entries(tribunalColors).map(([tribunal, color]) => (
                            <div key={tribunal} className="flex items-center gap-1">
                                <span
                                    className="inline-block h-3 w-3 rounded-full"
                                    style={{ background: color }}
                                ></span>
                                <span className="text-sm">{tribunal}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <h5 className="mt-4 font-rooftop text-xl tracking-wider text-black dark:text-white">
                    Distribuição do valor por LOAs
                </h5>
            </div>
            {isLoading ? (
                <div className="flex h-15 w-full items-center justify-center">
                    <AiOutlineLoading className="animate-spin" />
                </div>
            ) : (
                <Chart options={options} series={series} type="bubble" height="400" />
            )}
        </div>
    );
}
