import { NotionResponse } from "@/interfaces/INotion";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import dateFormater from "@/functions/formaters/dateFormater";
import numberFormat from "@/functions/formaters/numberFormat";
import { IWalletResponse } from "@/interfaces/IWallet";



interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

interface ProfitBarChartProps {
  title: string;
  data: IWalletResponse;
}

const handleLucro = (vlAquisicao: number, vlDisponivel: number) => {
  return vlDisponivel - vlAquisicao;
}

const ProfitBarChart: React.FC<ProfitBarChartProps> = ({
  title,
  data,
}) => {

  const options: ApexOptions = {
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 335,
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
      categories: data.result.map((item) => dateFormater(item.data_atualizacao)),
    },
    yaxis: {
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
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
  };

  const vi = data.valor_investido;
  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: "V.L. na aquisição",
        data: []
      },
      {
        name: "Lucro",
        data: []
      },
    ],
  });

  const handleSeries = () => {
    setState({
      series: [
        {
          name: "V.L. na aquisição",
          data: data.result.map((item) => item.valor_liquido_disponivel),
        },
        {
          name: "Lucro",
          data: data.result.map((item) => handleLucro(vi, item.valor_liquido_disponivel)),
        },
      ],
    });
  };


  useEffect(() => {
    handleSeries();
  }, [data]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
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
          <ReactApexChart
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfitBarChart;
