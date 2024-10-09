/* eslint-disable react-hooks/exhaustive-deps */
import numberFormat from "@/functions/formaters/numberFormat";
import { NotionResponse } from "@/interfaces/INotion";
import { IWalletResponse, IWalletResults } from "@/interfaces/IWallet";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { AiOutlineLoading } from "react-icons/ai";

interface ChartThreeState {
  series: number[];
}

interface newWalletResponse {
  title: string;
  response: [
    NotionResponse,
    IWalletResults[][]
  ]
}

interface ChartThreeProps {
  title?: string;
  data: NotionResponse;
};




const DistributionChart: React.FC<newWalletResponse> = ({ title, response: data }) => {
  const [state, setState] = useState<ChartThreeState>({
    series: [65, 34, 12, 56],
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
      toolbar: {
        show: true,
      }
    },
    labels: data && data[0]?.results.map((item) => item.properties["Credor"]?.title[0]?.plain_text),
    tooltip: {
      y: {
        formatter: function (val: number) {
          return numberFormat(val);
        },
      },

    },
    legend: {
      show: false,
      position: "bottom",

    },

    plotOptions: {

      pie: {

        donut: {
          size: "65%",
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
            width: 380,
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



  function handleSeries(data: IWalletResults[][]) {
    let serie: number[] = [];

    data?.forEach((item: any[]) => {
      item.forEach((results: IWalletResults, index: number) => {
        if (index === 1) {
          results.valor_liquido_disponivel && serie.push(
            results.valor_liquido_disponivel
          )
        }
      })
    })
    setState({
      series: serie
    });
  }

  useEffect(() => {
    if (data) {
      handleSeries(data[1]);
    }

  }, [data]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white mt-4">
            {
              title
            }
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          {data ? <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          /> : <div className="flex justify-center items-center h-96 w-full">
            <p className="text-black dark:text-white">
              <AiOutlineLoading className="animate-spin mr-2" />
            </p>
          </div>}
        </div>
        {/* <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">

          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-3 w-full max-w-3 items-center justify-center rounded-full border border-black dark:border-snow">
              <span className="block h-1 w-full max-w-1 rounded-full bg-black dark:bg-snow"></span>
            </span>
            <div className="w-full flex-column">
              <p className="font-semibold text-xs text-black dark:text-snow">Rentabilidade Média A.A </p>
              {data ? (<p className="text-sm font-medium">{
                100
                }</p>) : <AiOutlineLoading className="animate-spin mr-2" />}
            </div>
          </div>
          <div className="flex min-w-47.5">
          <span className="mr-2 mt-1 flex h-3 w-full max-w-3 items-center justify-center rounded-full border border-black dark:border-snow">
          <span className="block h-1 w-full max-w-1 rounded-full bg-black dark:bg-snow"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-xs text-black dark:text-snow">Rentabilidade Média A.M.</p>
              {data ?(<p className="text-sm font-medium">{
                }</p>) : <AiOutlineLoading className="animate-spin mr-2" />}
            </div>
          </div>
          </div> */}
      </div>
    </div>
  );
};

export default DistributionChart;
