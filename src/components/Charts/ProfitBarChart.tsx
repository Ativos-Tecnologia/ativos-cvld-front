import { NotionResponse } from "@/interfaces/INotion";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import dateFormater from "@/functions/formaters/dateFormater";
import numberFormat from "@/functions/formaters/numberFormat";
import { IWalletResponse, IWalletResults } from "@/interfaces/IWallet";
import { AiOutlineLoading } from "react-icons/ai";



interface ChartTwoState {
  series: {
    name: string;
    data: number[]
  }[];
}

interface ProfitBarChartProps {
  title: string;
  data: IWalletResponse;
}

interface newWalletResponse {
  title: string;
  response: [
    NotionResponse,
    any[]
  ]
}

const handleLucro = (vlAquisicao: number, vlDisponivel: number) => {
  return vlDisponivel - vlAquisicao;
}

const ProfitBarChart: React.FC<newWalletResponse> = ({
  title,
  response: data,
}) => {




  const options: ApexOptions = {
    colors: ["#58DC61","#3C50E0", "#80CAEE"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 535,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },

    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: "25%",
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        distributed: false,
        isFunnel: true,
        borderRadius: 0,
        columnWidth: "25%",
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: data && data?.[0]?.results?.map((item) => item.properties["Credor"]?.title[0]?.plain_text.slice(0, 10).concat('...') ?? 'N/A'),
    },
    yaxis: {
      show: false,
      labels: {
        formatter: function (val) {
          return numberFormat(val);
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Satoshi",
      fontWeight: 500,
      fontSize: "14px",

      markers: {
        shape: "square",
      },
    },
    fill: {
      opacity: 1,
    },
  };

  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: "Ágio",
        data: []
      },
      {
        name: "Investido",
        data: []
      },
      {
        name: "Total atualizado",
        data: []
      },
    ],
  });

  const handleSeries = (data: [
    NotionResponse,
    IWalletResponse[]
  ]) => {
    setState({
      series: [

        {
          name: "Ágio",
          data: data && data[1].map((item: any) => handleLucro(item[0]?.valor_liquido_disponivel, item[1]?.valor_liquido_disponivel)),
        },
        {
          name: "Investido",
          data: (data && data[0]?.results.map((item) => item.properties["Desembolso All-In"]?.formula?.number).filter((num): num is number => num !== null && num !== undefined)) || [0],
        },
        {
          name: "Total atualizado",
          data: data && data[1].map((item: any) => item[1]?.valor_liquido_disponivel)
        },
      ],
    })

  }


  useEffect(() => {
    handleSeries(data);
  }, [data]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark lg:col-span-6 xl:col-span-7">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            {
              title
            }
          </h4>
        </div>
        <div>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-mb-9 -ml-5">
        {data ? <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />: <div className="flex justify-center items-center h-96 w-full">
          <p className="text-black dark:text-white">
            <AiOutlineLoading className="animate-spin mr-2" />
          </p>
        </div>}
        </div>

      </div>
    </div>
  );
};

export default ProfitBarChart;
