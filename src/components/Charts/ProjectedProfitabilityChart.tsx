import dateFormater from "@/functions/formaters/dateFormater";
import numberFormat from "@/functions/formaters/numberFormat";
import percentageFormater from "@/functions/formaters/percentFormater";
import { calculateProjectedValue, CDIProjection } from "@/functions/marketplace/cdiProjection";
import { handleMesesAteOPagamento, handleRentabilidadeAM, handleRentabilidadeTotal, handleRentabilideAA } from "@/functions/wallet/rentability";
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

const ProjectedProfitabilityChart: React.FC<RentabilityChartProps> = ({ data }) => {

  const lastUpdatedValue = data?.result[data.result.length - 1].valor_liquido_disponivel;
  const investedValue = data?.valor_investido;

  const projection: CDIProjection = {
    currentValue: Number(investedValue),
    cdiRate: 11.75,
    timePeriodInMonths: Math.floor(handleMesesAteOPagamento(data)),
  };

  const CDIProjectedValue = calculateProjectedValue(projection);

  const lastUpdate = data?.result[data.result.length - 1].data_atualizacao;
  const projectedDate = data?.previsao_de_pgto;
  const projectedValue = data?.valor_projetado;

  const chartDataArray = [lastUpdate, projectedDate];
  const chartValueArray = [lastUpdatedValue, projectedValue];
  const cdiProjectedValueArray = [investedValue, CDIProjectedValue];

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#3056D3", "#58DC61"].reverse(),
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
        show: false,
        tools: {
          download: true,
          selection: true,
        }
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
      strokeColors: ["#58DC85"],
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
      categories: data && chartDataArray?.map((item) => dateFormater(item)),
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      opposite: false,
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
        name: "Projeção do Precatório",
        data: data && chartValueArray.map((item) => Number(item.toFixed(2))) || [],
      },
      {
        name: "Projeção CDI",
        data: data && cdiProjectedValueArray.map((item) => Number(item.toFixed(2))) || [],
      }
    ],
  });

  useEffect(() => {
    setState({
      series: [
       {
          name: "Projeção do Precatório",
          data: data && chartValueArray.map((item) => Number(item.toFixed(2))) || [],
        },
        {
          name: "Projeção CDI",
          data: data && cdiProjectedValueArray.map((item) => Number(item.toFixed(2))) || [],
        }
      ],
    });
  }, [data]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-12">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-56">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-black dark:border-snow">
              <span className="block h-2 w-full max-w-2 rounded-full bg-black dark:bg-snow"></span>
            </span>
            <div className="w-full mb-4">
              <p className="font-semibold text-black dark:text-snow">Análise de Oportunidade</p>
              {
                data ? (
                  (data?.result[0].data_atualizacao !== data?.result[data.result.length - 1].data_atualizacao) ?
                 (<p className="text-sm font-medium">
                    &nbsp;De&nbsp;{
                      dateFormater(data?.result[0].data_atualizacao)
                    }
                    &nbsp;a&nbsp;
                    {
                      dateFormater(data?.result[data.result.length - 1].data_atualizacao)
                    }
                  </p>) : <p className="text-sm font-medium">
                    &nbsp;Atualizado em&nbsp;{
                      dateFormater(data?.result[0].data_atualizacao)
                    }
                  </p>
                ) : <AiOutlineLoading className="animate-spin mr-2" />
              }
            </div>
          </div>
          <div className="flex w-72">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-black dark:border-snow">
              <span className="block h-2 w-full max-w-2 rounded-full bg-black dark:bg-snow"></span>
            </span>
            <div className="w-full mb-4">
              <p className="font-semibold text-black dark:text-snow">Previsão de Pagamento</p>
              {data ? (<p className="text-sm font-medium">
                {
                  dateFormater(data?.previsao_de_pgto)
                }
                 {" "}- cerca de {
                  Math.floor(handleMesesAteOPagamento(data))
                } meses
              </p>) : <AiOutlineLoading className="animate-spin mr-2" />}
            </div>
          </div>

        </div>
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
                (handleRentabilidadeTotal(response) * 100).toFixed(2) + "%"
                }</p>
            </div>
          </div> */}
        <div className="flex min-w-65">
          <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-black dark:border-snow">
            <span className="block h-2 w-full max-w-2 rounded-full bg-black dark:bg-snow"></span>
          </span>
          <div className="w-full">
            <p className="font-semibold text-black dark:text-snow">Rentabilidade Projetada A.A</p>
            {data ? (<p className="text-sm font-medium">{
              (handleRentabilideAA(handleRentabilidadeTotal(data), handleMesesAteOPagamento(data)) * 100).toFixed(2).replace('.', ',') + "%"
            }</p>) : <AiOutlineLoading className="animate-spin mr-2" />}
          </div>
        </div>
        <div className="flex min-w-65">
          <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-black dark:border-snow">
            <span className="block h-2 w-full max-w-2 rounded-full bg-black dark:bg-snow"></span>
          </span>
          <div className="w-full">
            <p className="font-semibold text-black dark:text-snow">Rentabilidade Projetada A.M.</p>
            {data ? (<p className="text-sm font-medium">{
              (handleRentabilidadeAM(handleRentabilideAA(handleRentabilidadeTotal(data), handleMesesAteOPagamento(data))) * 100).toFixed(2).replace('.', ',') + "%"
            }</p>) : <AiOutlineLoading className="animate-spin mr-2" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectedProfitabilityChart;
