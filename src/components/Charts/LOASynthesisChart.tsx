"use client"
import React from 'react'
import ReactApexChart from "react-apexcharts";
import CustomSkeleton from '../CrmUi/CustomSkeleton';

interface ISysthesisChartProps {
    data?: Array<Record<string | number, string | number>>
}

const LOASynthesisChart = ({ data }: ISysthesisChartProps) => {

    const [series, setSeries] = React.useState<{ data: { x: string, y: number }[] }[] | undefined>([])

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
                    reset: true
                },
                offsetY: -10
            },
        },
        plotOptions: {
            treemap: {
                distributed: true, // Cada bloco terá uma cor diferente
                enableShades: false,
                borderRadius: 0,
            },
        },
        tooltip: {
            custom: ({ seriesIndex, dataPointIndex, w }) => {
                const data = w.config.series[seriesIndex].data[dataPointIndex];
                const dataColor = w.globals.colors[dataPointIndex]
                return `
                <div class="treemap-tooltip" >
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
                    fontSize: '12px'
                }
            }
        }
    };

    function formatData({ data }: ISysthesisChartProps) {

        return [
            {
                data: data!.map((item) => (
                    {
                        x: String(item["LOA - Acumulado"]),
                        y: Number(item["TOTAL"])
                    }
                ))
            }
        ];
    }

    React.useEffect(() => {
        if (data) {
            const dataToAppend = formatData({ data });
            setSeries(dataToAppend);
        }
    }, [data])

    if (!data) {
        return (
            <>
                <div className='flex items-center justify-between mb-3'>
                    <CustomSkeleton type='title' className='h-8 w-[250px]' />
                    <CustomSkeleton type='content' className='h-8 w-8' />
                </div>
                <CustomSkeleton type='content' className='h-80 w-full' />
            </>
        )
    }

    return (
        <>
            <h2 className='md:text-2xl 2xsm:text-[18px] font-medium'>Síntese das LOA'S</h2>
            <ReactApexChart options={options} series={series} type="treemap" />
        </>
    )
}

export default LOASynthesisChart;
