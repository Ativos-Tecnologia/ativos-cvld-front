/* eslint-disable react-hooks/exhaustive-deps */
import numberFormat from "@/functions/formaters/numberFormat";
import { NotionResponse } from "@/interfaces/INotion";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { AiOutlineLoading } from "react-icons/ai";

interface ChartThreeState {
  series: number[];
}

interface ChartThreeProps {
  title?: string;
  data?: NotionResponse;
};

const DistributionChart: React.FC<ChartThreeProps> = ({title, data}) => {
  const [state, setState] = useState<ChartThreeState>({
    series: [65, 34, 12, 56],
  });

  const options: ApexOptions = {
    title: {
      text: title,
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
    labels: data?.results.map((item) => item.properties["Credor"]?.title[0]?.plain_text),
    tooltip: {
      y: {
        formatter: function (val: number) {
          return numberFormat(val);
        },
      },

    },
    legend: {
      show: true,
      position: "bottom",
    },

    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
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



  function handleSeries(data: NotionResponse) {
    let serie = Array<{
      name: string,
      value: number
    }>();

    let dataForChart = data?.results.forEach((item) => {
      item?.properties["Valor de Aquisição (Wallet)"].number && serie.push({
        name: item.properties["Credor"]?.title[0]?.plain_text,
        value: item.properties["Valor de Aquisição (Wallet)"]?.number
      })
      }
    )
    setState({
      series: serie.map((item) => item.value)
    });
  }

  useEffect(() => {
    if (data) {

      handleSeries(data);
    }

  }, [data]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          {/* <h5 className="text-xl font-semibold text-black dark:text-white">
            {
              title
            }
          </h5> */}
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
      </div>
    </div>
  );
};

export default DistributionChart;
