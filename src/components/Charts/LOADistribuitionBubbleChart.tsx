import numberFormat from '@/functions/formaters/numberFormat';
import { ILOADistribuitionResult } from '@/interfaces/ILOADistribuitionResults';
import { ApexOptions } from 'apexcharts';
import React from 'react';
import Chart from 'react-apexcharts';
import { AiOutlineLoading } from 'react-icons/ai';

// Função auxiliar para converter "DD/MM/YYYY" para timestamp
const parseDate = (dateStr: string): number => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day).getTime();
};

// Função auxiliar para converter "MM/YYYY" para timestamp (assumindo o primeiro dia do mês)
const parseMonthYear = (monthYearStr: string): number => {
    const [month, year] = monthYearStr.split('/').map(Number);
    return new Date(year, month - 1, 1).getTime();
};

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.8)`;
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

    const calculateZ = (y: number) => Math.max(Math.sqrt(y) / 150, 15);

    // Mapeia os dados, trocando os eixos:
    // x: MÊS E ANO DO PAGAMENTO (convertido com parseMonthYear)
    // y: Recebimento (convertido com parseDate)
    const processedData = React.useMemo(() => {
        return results.map((item) => ({
            ...item,
            x: parseMonthYear(item['MÊS E ANO DO PAGAMENTO']),
            y: parseDate(item.Recebimento),
            z: calculateZ(item['Valor do Precatório Atualizado']),
            fillColor: getRandomColor(),
            // Mantém os valores originais para uso no tooltip
            pagamentoLabel: item['MÊS E ANO DO PAGAMENTO'],
            recebimentoLabel: item.Recebimento,
        }));
    }, [results]);

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
                    enabled: false,
                    type: 'x',
                    autoScaleYaxis: false,
                },
            },
            xaxis: {
                title: {
                    text: 'Mês e Ano do Pagamento',
                },
                type: 'datetime',
                labels: {
                    // Formata a data para exibir MM/YYYY
                    formatter: (value) =>
                        new Date(value).toLocaleDateString('pt-BR', {
                            month: '2-digit',
                            year: 'numeric',
                        }),
                },
            },
            yaxis: {
                title: { text: 'Data do Recebimento' },
                type: 'datetime',
                labels: {
                    // Formata a data para exibir DD/MM/YYYY
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
                        <span style="display: block;"><span style="font-weight: bold">Valor:</span> ${numberFormat(item['Valor do Precatório Atualizado'])}</span>
                        <span style="display: block;"><span style="font-weight: bold">Mês/Ano do Pagamento:</span> ${item.pagamentoLabel}</span>
                        <span style="display: block;"><span style="font-weight: bold">Data do Recebimento:</span> ${item.recebimentoLabel}</span>
                        <span style="display: block;"><span style="font-weight: bold">Natureza:</span> ${item['Natureza']}</span>
                      </div>
                    `;
                },
            },
        };
    }, [processedData, isDarkMode]);

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4">
            <div className="mb-3 ml-2 justify-between gap-4 sm:flex">
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
