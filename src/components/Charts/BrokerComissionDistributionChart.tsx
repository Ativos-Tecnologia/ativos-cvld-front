/* eslint-disable react-hooks/exhaustive-deps */
import numberFormat from "@/functions/formaters/numberFormat";
import { NotionResponse } from "@/interfaces/INotion";
import { ApexOptions } from "apexcharts";
import { set } from "date-fns";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { AiOutlineLoading } from "react-icons/ai";

interface ChartThreeState {
  series: number[];
}

interface IBrokerDistributionData {
  title: string;
  response: NotionResponse | null;
}

interface ICredorAndComission {
  [credorName: string]: string;
}

const BrokerComissionDistribution: React.FC<IBrokerDistributionData> = ({
  title,
  response: data,
}) => {
  const [chartData, setChartData] = useState<Array<ICredorAndComission>>([]);
  const [state, setState] = useState<ChartThreeState>({
    series: [0, 0, 0],
  });

  const options: ApexOptions = {
    title: {
      // text: title,
      style: {
        fontSize: "18px",
        fontWeight: "bold",
        fontFamily: "Satoshi, sans-serif",
        color: "#637381",
      },
    },

    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
      // events: {
      //   dataPointSelection: function (_event, _chartContext, config) {
      //     //TODO: Aqui será implementada a lógica de clique no gráfico para filtrar os dados
      //     const selectedData = config?.w?.config?.labels[config.dataPointIndex];
      //   },
      // },
      toolbar: {
        show: false,
      },
    },
    labels: chartData.map((item) => Object.keys(item)[0]),

    legend: {
      show: true,
      position: "right",
      formatter(legendName, opts) {
        return `${legendName}: ${opts.w.globals.series[opts.seriesIndex]}`;
      },
    },

    plotOptions: {
      pie: {
        customScale: 1,

        donut: {
          size: "85%",
          background: "transparent",

          labels: {
            value: {
              show: true,
              fontSize: "22px",
              fontFamily: "Satoshi, sans-serif",
              color: "#637381",
              offsetY: 8,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 450,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  function handleSeries(data: NotionResponse) {
    const result: Array<{ [key: string]: string }> = [];
    const KKK: Array<number> = [];

    data.results.forEach((page) => {
      const credor = {
        id: page.properties.Credor.id,
        name: page.properties.Credor.title[0]?.text.content || "Desconhecido",
        comission: page.properties["Comissão - Celer"].number || 0,
      };

      result.push({ [credor.name]: numberFormat(credor.comission) });
    });

    setChartData(result);

    return result;
  }

  useEffect(() => {
    if (data) {
      handleSeries(data);
    }
  }, [data]);

  return (
    <div className="col-span-6 rounded-sm border border-stroke bg-white py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="mt-4 text-xl font-semibold text-black dark:text-white">
            {title}
          </h5>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="mx-auto flex">
          {data ? (
            <ReactApexChart
              options={options}
              series={state.series}
              type="donut"
            />
          ) : (
            <div className="flex h-96 w-full items-center justify-center">
              <p className="text-black dark:text-white">
                <AiOutlineLoading className="mr-2 animate-spin" />
              </p>
            </div>
          )}
        </div>
        {/* <div className="flex flex-col flex-wrap items-start justify-start gap-3 sm:flex-nowrap"> */}
        {/* {chartData.map((item, index) => {
            const key = Object.keys(item)[0];
            const value = Object.values(item)[0];
            return (
              <div
                key={index}
                className="flex min-w-60 flex-row items-center justify-between rounded-md"
              >
                <span className="mr-2  flex h-3 w-full max-w-3 items-center justify-center rounded-full border border-black dark:border-snow">
                  <span className="block h-1 w-full max-w-1 rounded-full bg-black dark:bg-snow"></span>
                </span>
                <div className="flex w-full justify-between gap-2">
                  <p className="text-sm font-semibold text-black dark:text-snow">
                    {key}
                  </p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            );
          })} */}
        {/* <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-3 w-full max-w-3 items-center justify-center rounded-full border border-black dark:border-snow">
              <span className="block h-1 w-full max-w-1 rounded-full bg-black dark:bg-snow"></span>
            </span>
            <div className="w-full">
              <p className="text-xs font-semibold text-black dark:text-snow">
                Rentabilidade Média A.M.
              </p>
              {data ? (
                <p className="text-sm font-medium">{}</p>
              ) : (
                <AiOutlineLoading className="mr-2 animate-spin" />
              )}
            </div>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default BrokerComissionDistribution;
