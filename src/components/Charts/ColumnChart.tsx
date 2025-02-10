"use client"
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import CustomSkeleton from '../CrmUi/CustomSkeleton'
import { YAxis } from 'recharts'

type ColumnChartProps = {
    data: {
        [key: string]: number
    }[],
    propsArray: string[]
}

type ChartSeries = {
    name: string,
    data: number[]
}[]

const ColumnChart = ({ data, propsArray }: ColumnChartProps) => {

    const [series, setSeries] = React.useState<ChartSeries | undefined>([]);

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                },
                offsetY: -10
            }
        },
        dataLabels: {
            enabled: false
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 4,
                columnWidth: "50%",
                borderRadiusApplication: "end",
            }
        },
        stroke: {
            width: 3,
            show: true,
            colors: ['transparent']
        },
        xaxis: {
            categories: data?.map((item) => String(item["ANO"]))
        },
        yaxis: {
            labels: {
                formatter: (value) => {
                    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                }
            }
        },
        tooltip: {

            y: {
                formatter: (value) => {
                    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                }
            }
        },
        responsive: [
            {
                breakpoint: 430,
                options: {
                    yaxis: {
                        labels: {
                            show: false
                        }
                    }
                }
            }
        ]
    }

    function fillChartData() {
        return propsArray.map(prop => ({
            name: prop.trim(),
            data: data?.map(item => item[prop] ?? 0)
        }));
    }

    React.useEffect(() => {
        if (data) {
            const dataToAppend = fillChartData();
            setSeries(dataToAppend);
        }
    }, [data])

    if (!data) {
        return (
            <div className='col-span-12 px-5 pb-6 pt-7.5'>
                <div className='flex items-center justify-between mb-3'>
                    <CustomSkeleton type='title' className='h-8 w-[250px]' />
                    <CustomSkeleton type='content' className='h-8 w-8' />
                </div>
                <CustomSkeleton type='content' className='h-80 w-full' />
            </div>
        )
    }

    return (
        <div className='col-span-12 px-5 pb-6 pt-7.5'>
            <ReactApexChart options={options} series={series} type='bar' height={600} />
        </div>
    )
}

export default ColumnChart