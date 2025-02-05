import numberFormat from '@/functions/formaters/numberFormat';
import { ILOADistribuitionResult } from '@/interfaces/ILOADistribuitionResults';
import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import { AiOutlineLoading } from 'react-icons/ai';

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.8)`;
};

interface LOADistribuitionBubbleChartProps {
    results: ILOADistribuitionResult[];
    isLoading: boolean;
}

export function LOADistribuitionBubbleChart({
    results,
    isLoading,
}: LOADistribuitionBubbleChartProps) {
    const isDarkMode = localStorage.getItem('color-theme') === '"dark"';

    const calculateZ = (y: number) => Math.max(Math.sqrt(y) / 150, 15);

    const data = results.map((item) => ({
        ...item,
        x: item.LOA,
        y: item['Valor do Precatório Atualizado'],
        z: calculateZ(item['Valor do Precatório Atualizado']),
        fillColor: getRandomColor(),
    }));

    const options: ApexOptions = {
        chart: {
            id: 'bubble-chart',
            toolbar: { show: true },
        },
        xaxis: {
            title: { text: 'Ano' },
            min: Math.min(...data.map((item) => item.x)) - 3,
            max: Math.max(...data.map((item) => item.x)) + 2,
        },
        yaxis: {
            title: { text: 'Valor Liquido (R$)' },
            min: Math.max(...data.map((item) => item.y)) * -0.2,
            max: Math.max(...data.map((item) => item.y)) * 1.2,
            labels: { formatter: (value) => numberFormat(value) },
        },
        dataLabels: {
            enabled: true,
            formatter: (_, opts) => data[opts.dataPointIndex].x,
            style: { colors: [isDarkMode ? '#fff' : '#000'] },
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
                const item = data[dataPointIndex];
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
                        <strong style="font-size: 16px">Ano: ${item.x}</strong>
                    </div>
                    <span style="display: block;"><span style="font-weight: bold">Valor:</span> ${numberFormat(item.y)}<span/>
                    <span style="display: block;"><span style="font-weight: bold">Natureza:</span> ${item.Natureza}<span/>
                </div>
              `;
            },
        },
    };

    const series = [
        {
            name: 'Valores',
            data: data.map(({ x, y, z, fillColor }) => ({
                x,
                y,
                z,
                fillColor,
            })),
        },
    ];

    return (
        <div className="rounded-sm border border-stroke bg-white py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4">
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
