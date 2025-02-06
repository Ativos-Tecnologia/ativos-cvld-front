'use client';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import CustomSkeleton from '../CrmUi/CustomSkeleton';

interface ISysthesisChartProps {
    data?: Array<Record<string | number, string | number>>;
}

const LOASynthesisChart = ({ data }: ISysthesisChartProps) => {
    const [series, setSeries] = React.useState<{ data: { x: string; y: number }[] }[] | undefined>(
        [],
    );

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: 'treemap',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true,
                },
                offsetY: -10,
            },
        },
        plotOptions: {
            treemap: {
                distributed: true,
                enableShades: true,
                borderRadius: 0,
                shadeIntensity: 0.2,
            },
        },
        tooltip: {
            custom: ({ seriesIndex, dataPointIndex, w }) => {
                const data = w.config.series[seriesIndex].data[dataPointIndex];
                const dataColor = w.globals.colors[dataPointIndex];
                return `
                <div class="treemap-tooltip text-white bg-boxdark p-3 rounded-lg">
                    <div class="tooltip-title">
                        <span style="background-color: ${dataColor};" class="tooltip-title-dot"></span>
                        <p>${data.x}</p>
                    </div>
                    <div class="tooltip-divider"></div>
                    <div class="tooltip-body">
                        <p>Valor: <strong>${data.y.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
                    </div>
                </div>
            `;
            },
        },
        xaxis: {
            labels: {
                style: {
                    colors: 'lightgray',
                    fontSize: '12px',
                },
            },
        },
        responsive: [
            {
                breakpoint: 430,
                options: {
                    chart: {
                        height: 400,
                    },
                },
            },
            {
                breakpoint: 768,
                options: {
                    chart: {
                        height: 500,
                    },
                },
            },
        ],
    };

    function formatData({ data }: ISysthesisChartProps) {
        return [
            {
                data: data!.map((item) => ({
                    x: String(item['LOA - Acumulado']),
                    y: Number(item['TOTAL']),
                })),
            },
        ];
    }

    React.useEffect(() => {
        if (data) {
            const dataToAppend = formatData({ data });
            setSeries(dataToAppend);
        }
    }, [data]);

    if (!data) {
        return (
            <>
                <div className="mb-3 flex items-center justify-between">
                    <CustomSkeleton type="title" className="h-8 w-[250px]" />
                    <CustomSkeleton type="content" className="h-8 w-8" />
                </div>
                <CustomSkeleton type="content" className="h-80 w-full" />
            </>
        );
    }

    return (
        <div className="col-span-12 px-5 pb-6 pt-7.5">
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
                A maneira como os recursos estão distribuídos em relação à Lei Orçamentária Anual
            </h3>
            <ReactApexChart options={options} series={series} height={600} type="treemap" />
        </div>
    );
};

export default LOASynthesisChart;
