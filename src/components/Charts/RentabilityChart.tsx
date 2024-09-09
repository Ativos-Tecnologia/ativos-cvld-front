import dateFormater from "@/functions/formaters/dateFormater";
import numberFormat from "@/functions/formaters/numberFormat";
import percentageFormater from "@/functions/formaters/percentFormater";
import { IWalletResponse } from "@/interfaces/IWallet";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { AiOutlineLoading } from "react-icons/ai";

interface ChartOneState {
  series: {
    name: string;
    data: number[]
  }[];
}
export interface RentabilityChartProps {
  data: IWalletResponse;
}

const RentabilityChart: React.FC<RentabilityChartProps> = ({ data }) => {

   function handleRantabilideTotal (data: IWalletResponse) {
    return (data.result[data.result.length - 1].valor_liquido_disponivel - data.valor_investido) / data.valor_investido;
   }

   function handleMesesAteOPagamento (data: IWalletResponse) {
    const data_aquisicao = new Date(data.result[0].data_atualizacao);
    const previsao_de_pgto = new Date(data.previsao_de_pgto);

    const diffMonths = Math.abs(previsao_de_pgto.getTime() - data_aquisicao.getTime()) / (1000 * 60 * 60 * 24 * 30)
    return diffMonths;
   }

   function handleRentabilideAA(rentabilidadeTotal: number, mesesAtePagamento: number) {
    const rentabilidade = Math.pow(1 + rentabilidadeTotal, 12 / mesesAtePagamento) - 1;
    return rentabilidade;
  }

  function handleRentabilidadeAM(rentabilidadeAnual: number) {
    return Math.pow(1 + rentabilidadeAnual, 1 / 12) - 1;
  }

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#3056D3", "#80CAEE", "#3B82F6"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 450,
      zoom: {
        enabled: true,
      },
      id: "area-datetime",
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },

      toolbar: {
        show: true,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,

        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#3056D3", "#80CAEE"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: data?.result.map((item) => dateFormater(item.data_atualizacao).slice(3, 10)),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      opposite: true,
      title: {
        style: {
          fontSize: "0px",
        },
      },
      labels: {
        formatter: function (val) {
          if (val < 2) {
            return val.toFixed(2) + "%";
          }
          return numberFormat(val);
        },
      },
      }



    };


  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: "Valor Liquido Disponivel",
        data: data?.result.map((item) => Number(item.valor_liquido_disponivel.toFixed(2))) || [],
      },
      {
        name: "Valor Inscrito",
        data: data?.result.map((item) => item.valor_inscrito) || [],
      },
      {
        name: "Valor Investido",
        data: data?.result.map((item) => data?.valor_investido) || [],
      },
    ],
  });

  useEffect(() => {
    setState({
      series: [
        {
          name: "Valor Liquido Disponivel",
          data: data?.result.map((item) => Number(item.valor_liquido_disponivel.toFixed(2))) || [],
        },
        {
          name: "Valor Inscrito",
          data: data?.result.map((item) => item.valor_inscrito) || [],
        },
        {
          name: "Valor Investido",
          data: data?.result.map((item) => data.valor_investido) || [],
        },
      ],
    });
  }, [data]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-black dark:border-snow">
              <span className="block h-2 w-full max-w-2 rounded-full bg-black dark:bg-snow"></span>
            </span>
            <div className="w-full mb-4">
              <p className="font-semibold text-black dark:text-snow">Valorização do Ativo</p>
              <p className="text-sm font-medium">
                {
                  dateFormater(data?.result[0].data_atualizacao)
                }
                 &nbsp;a&nbsp;
                {
                  dateFormater(data?.result[data.result.length - 1].data_atualizacao)
                }
              </p>
            </div>
          </div>
          <div className="flex w-72">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-black dark:border-snow">
              <span className="block h-2 w-full max-w-2 rounded-full bg-black dark:bg-snow"></span>
            </span>
            <div className="w-full mb-4">
              <p className="font-semibold text-black dark:text-snow">Previsão de Pagamento</p>
              { data ?  (<p className="text-sm font-medium">
                ({
                  dateFormater(data?.previsao_de_pgto)
                }
              - Cerca de {
                Math.floor(handleMesesAteOPagamento(data))
              } meses)
              </p>) : <AiOutlineLoading className="animate-spin mr-2" />}
            </div>
          </div>

        </div>
        {/* <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-white px-3 py-1 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Day
            </button>
            <button className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Week
            </button>
            <button className="rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Month
            </button>
          </div>
        </div> */}
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
      <div className="flex min-w-36.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-black dark:border-snow">
              <span className="block h-2 w-full max-w-2 rounded-full bg-black dark:bg-snow"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-black dark:text-snow">Valor Investido</p>
              {data ? (<p className="text-sm font-medium">{
                numberFormat(data?.valor_investido)
                }</p>) : <AiOutlineLoading className="animate-spin mr-2" />}
            </div>
          </div>
          {/* <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-lime-300">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-black"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold">Rentabilidade Total</p>
              <p className="text-sm font-medium">{
                (handleRantabilideTotal(response) * 100).toFixed(2) + "%"
                }</p>
            </div>
          </div> */}
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-black dark:border-snow">
              <span className="block h-2 w-full max-w-2 rounded-full bg-black dark:bg-snow"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-black dark:text-snow">Rentabilidade A.A</p>
              {data ? (<p className="text-sm font-medium">{
                (handleRentabilideAA(handleRantabilideTotal(data), handleMesesAteOPagamento(data)) * 100).toFixed(2) + "%"
                }</p>) : <AiOutlineLoading className="animate-spin mr-2" />}
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-black dark:border-snow">
              <span className="block h-2 w-full max-w-2 rounded-full bg-black dark:bg-snow"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-black dark:text-snow">Rentabilidade A.M.</p>
              {data ?(<p className="text-sm font-medium">{
                (handleRentabilidadeAM(handleRentabilideAA(handleRantabilideTotal(data), handleMesesAteOPagamento(data))) * 100).toFixed(2) + "%"
                }</p>) : <AiOutlineLoading className="animate-spin mr-2" />}
            </div>
          </div>
          </div>
    </div>
  );
};

export default RentabilityChart;
