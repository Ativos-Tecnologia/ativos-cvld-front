/* eslint-disable react-hooks/exhaustive-deps */
import numberFormat from "@/functions/formaters/numberFormat";
import { NotionResponse } from "@/interfaces/INotion";
import { ApexOptions } from "apexcharts";
import { set } from "date-fns";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { AiOutlineLoading } from "react-icons/ai";
import AnimatedNumber from "../ui/AnimatedNumber";
import CRMTooltip from "../CrmUi/Tooltip";
import Title from "../CrmUi/Title";

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
    series: [100, 100, 100, 100],
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
      height: 400,
      // events: {
      //   dataPointSelection: function (_event, _chartContext, config) {
      //     //TODO: Aqui será implementada a lógica de clique no gráfico para filtrar os dados
      //     const selectedData = config?.w?.config?.labels[config.dataPointIndex];
      //   },
      // },
      toolbar: {
        show: false,
      },
      
      animations: {
        enabled: true,
        speed: 400,
        animateGradually: {
          enabled: true,
          delay: 1050,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    labels: chartData.map((item) => Object.keys(item)[0]),
    tooltip: {
      y: {
        formatter: function (val: number) {
          return numberFormat(val);
        },
      },

    },
    

    legend: {
      show: true,
      width: 360,
      offsetY: -10,
      position: "right",
      formatter(legendName, opts) {
        return `${legendName}: ${numberFormat(opts.w.globals.series[opts.seriesIndex])}`;
      },
      
    },
    grid: {
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    
    plotOptions: {
      pie: {
        
        customScale: 1,
        startAngle: 0,
        endAngle: 360,
        

        donut: {
          size: "80%",
          background: "transparent",
          
          labels: {
            show: true,
            name: { show: true,
              formatter: function (val: any) {
                return val.length > 20 ? val.slice(0, 15).concat('...') : val
              },
              offsetY: -4,
              fontSize: "14px",
              fontFamily: "Satoshi, sans-serif",
             },
            total: {
              show: true,
              showAlways: true,
              label: "Total",
              fontSize: '22px',
              formatter: function (w) {
                const result = state.series.reduce((a: any, b: any) => {
                  return a + b;
                }, 0);
                return numberFormat(result)
              },
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: "Rooftop, sans-serif",
              color: "#637381",
              offsetY: 8,
              formatter: function (val: any) {
                return numberFormat(val)
              },
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
            width: 600,
          },
          
          legend: {
            position: "right",
            offsetY: -10,
            width: 360,
            
            
          }
          
        },
      },
      {
        breakpoint: 640,
        options: {
          
          chart: {
            width: 300,
            height: 200,
            },
            legend: {
              show: false
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
        comission: page.properties["Comissão - Celer"]?.number || 0,
      };

  
      result.push({ [credor.name.length > 30 ? credor.name.slice(0, 30).concat('...') : credor.name ]: numberFormat(credor.comission) });
      KKK.push(credor.comission)
    });

    setChartData(result);
    setState((prevState) => ({
      ...prevState,
     series: KKK
    }));

        



  }

  useEffect(() => {
    if (data) {
      handleSeries(data);
    }
  }, [data]);

  return (
    <div className="col-span-6 rounded-sm border border-stroke bg-white py-4 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-4 xl:col-span-6 max-h-73">
      <div className="mb-3 justify-between gap-4 sm:flex ml-2">
        <div>
          <h5 className="mt-4 text-xl text-black dark:text-white tracking-wider font-rooftop">
            {title}
          </h5>
        </div>
      </div>

      <div className="grid grid-cols-1 overflow-clip">
        <div className="mx-auto flex h-[200px]" style={{
          height: 220,
          overflowY: "visible",
        }}>
          {data ? (
            <ReactApexChart
              options={options}
              series={state.series}
              type="donut"
              height="95%"

            />
          ) : (
            <div className="flex max-h-73 w-full items-center justify-center">
              <p className="text-black dark:text-white">
                <AiOutlineLoading className="mr-2 animate-spin" />
              </p>
            </div>
          )}
        </div>
    </div>
  </div>
  );
};

export default BrokerComissionDistribution;
