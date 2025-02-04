import numberFormat from '@/functions/formaters/numberFormat';
import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';

const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`;

const rawData = [
    { x: 2006, y: 767775.65, natureza: 'teste' },
    { x: 2011, y: 8145025.59, natureza: 'teste' },
    { x: 2015, y: 442717.89, natureza: 'novo' },
    { x: 2016, y: 275580.63, natureza: 'novo' },
    { x: 2017, y: 1934918.39, natureza: 'teste' },
    { x: 2019, y: 2410012.44, natureza: 'teste' },
    { x: 2021, y: 107.45, natureza: 'teste' },
    { x: 2022, y: 306747.84, natureza: 'novo' },
    { x: 2023, y: 55550349.3, natureza: 'novo' },
    { x: 2024, y: 195756935.65, natureza: 'teste' },
    { x: 2025, y: 184417001.3, natureza: 'teste' },
    { x: 2026, y: 99541332.08, natureza: 'teste' },
];

const calculateZ = (y: number) => Math.max(Math.sqrt(y) / 1000, 6);

const data = rawData.map((item) => ({
    ...item,
    z: calculateZ(item.y),
    color: getRandomColor(),
}));

export function BubbleChart() {
    const isDarkMode = localStorage.getItem('color-theme') === '"dark"';

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
                            background: ${item.color}; 
                            border-radius: 6px;
                        "></div>
                        <strong style="font-size: 16px">Ano: ${item.x}</strong>
                    </div>
                    <span style="display: block;"><span style="font-weight: bold">Valor:</span> ${numberFormat(item.y)}<span/>
                    <span style="display: block;"><span style="font-weight: bold">Natureza:</span> ${item.natureza}<span/>
                </div>
              `;
            },
        },
    };

    const series = [
        {
            name: 'Valores',
            data: data.map((item) => ({
                x: item.x,
                y: item.y,
                z: item.z,
                fillColor: item.color,
            })),
        },
    ];

    return (
        <div className="rounded-sm border border-stroke bg-white py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4">
            <div className="mb-3 ml-2 justify-between gap-4 sm:flex">
                <h5 className="mt-4 font-rooftop text-xl tracking-wider text-black dark:text-white">
                    Distribuição do valor por LOA's
                </h5>
            </div>
            <Chart options={options} series={series} type="bubble" height="400" />
        </div>
    );
}
