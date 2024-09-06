import dateFormater from "@/functions/formaters/dateFormater";
import numberFormat from "@/functions/formaters/numberFormat";
import percentageFormater from "@/functions/formaters/percentFormater";
import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";



interface ChartOneState {
  series: {
    name: string;
    data: number[]
  }[];
}

interface IWalletResults {
  data_atualizacao: string;
  valor_principal: number;
  valor_juros: number;
  valor_inscrito: number;
  valor_bruto_atualizado_final: number;
  valor_liquido_disponivel: number;
}

interface IWalletResponse {
  id: string;
  valor_investido: number;
  previsao_de_pgto: string;
  result: IWalletResults[];
}

const RentabilityChart: React.FC = () => {
  const [response, setResponse] = useState<IWalletResponse>(
    {
      "id": "1601fbf8-7f93-489c-8f35-1a2a6739f5ac",
      "valor_investido": 144335.06443864203,
      "previsao_de_pgto": "2025-12-05",
      "result": [
        {
          "data_atualizacao": "2024-01-05",
          "valor_principal": 230625.7,
          "valor_juros": 35323.81,
          "valor_inscrito": 265949.51,
          "valor_bruto_atualizado_final": 302880.75856881065,
          "valor_liquido_disponivel": 292930.78881881066
        },
        {
          "data_atualizacao": "2024-02-05",
          "valor_principal": 230625.7,
          "valor_juros": 35323.81,
          "valor_inscrito": 265949.51,
          "valor_bruto_atualizado_final": 303819.68892037397,
          "valor_liquido_disponivel": 293747.58617037395
        },
        {
          "data_atualizacao": "2024-03-05",
          "valor_principal": 230625.7,
          "valor_juros": 35323.81,
          "valor_inscrito": 265949.51,
          "valor_bruto_atualizado_final": 306189.4824939529,
          "valor_liquido_disponivel": 295809.1252439529
        },
        {
          "data_atualizacao": "2024-04-05",
          "valor_principal": 230625.7,
          "valor_juros": 35323.81,
          "valor_inscrito": 265949.51,
          "valor_bruto_atualizado_final": 307291.7646309312,
          "valor_liquido_disponivel": 296768.0268809312
        },
        {
          "data_atualizacao": "2024-05-05",
          "valor_principal": 230625.7,
          "valor_juros": 35323.81,
          "valor_inscrito": 265949.51,
          "valor_bruto_atualizado_final": 307937.0773366561,
          "valor_liquido_disponivel": 297329.3980866561
        },
        {
          "data_atualizacao": "2024-06-05",
          "valor_principal": 230625.7,
          "valor_juros": 35323.81,
          "valor_inscrito": 265949.51,
          "valor_bruto_atualizado_final": 309292.0004769374,
          "valor_liquido_disponivel": 298508.0772269374
        },
        {
          "data_atualizacao": "2024-07-05",
          "valor_principal": 230625.7,
          "valor_juros": 35323.81,
          "valor_inscrito": 265949.51,
          "valor_bruto_atualizado_final": 310498.2392787974,
          "valor_liquido_disponivel": 299557.4130287974
        },
        {
          "data_atualizacao": "2024-08-05",
          "valor_principal": 230625.7,
          "valor_juros": 35323.81,
          "valor_inscrito": 265949.51,
          "valor_bruto_atualizado_final": 311429.7339966338,
          "valor_liquido_disponivel": 300367.7422466338
        },
        {
          "data_atualizacao": "2024-09-05",
          "valor_principal": 230625.7,
          "valor_juros": 35323.81,
          "valor_inscrito": 265949.51,
          "valor_bruto_atualizado_final": 312021.45049122744,
          "valor_liquido_disponivel": 300882.48924122745
        }
      ]
    }
   );

   function handleRantabilideTotal (response: IWalletResponse) {
    return (response.result[response.result.length - 1].valor_liquido_disponivel - response.valor_investido) / response.valor_investido;
   }

   function handleMesesAteOPagamento (response: IWalletResponse) {
    const data_aquisicao = new Date(response.result[0].data_atualizacao);
    const previsao_de_pgto = new Date(response.previsao_de_pgto);

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
      height: 350,
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
      categories: response.result.map((item) => dateFormater(item.data_atualizacao).slice(3, 10)),
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
        data: response.result.map((item) => Number(item.valor_liquido_disponivel.toFixed(2))),
      },
      {
        name: "Valor Inscrito",
        data: response.result.map((item) => item.valor_inscrito),
      },
      {
        name: "Valor Investido",
        data: response.result.map((item) => response.valor_investido),
      },

    ],
  });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };
  handleReset;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full mb-4">
              <p className="font-semibold text-primary">Valorização do Ativo</p>
              <p className="text-sm font-medium">
                {
                  dateFormater(response.result[0].data_atualizacao)
                }
                 &nbsp;a&nbsp;
                {
                  dateFormater(response.result[response.result.length - 1].data_atualizacao)
                }
              </p>
            </div>
          </div>
          <div className="flex w-72">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full mb-4">
              <p className="font-semibold text-primary">Previsão de Pagamento</p>
              <p className="text-sm font-medium">
                {
                  dateFormater(response.previsao_de_pgto)
                }
              - Cerca de {
                Math.floor(handleMesesAteOPagamento(response))
              } meses

              </p>
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
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-lime-300">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-black"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-meta-4">Valor Investido</p>
              <p className="text-sm font-medium">{
                numberFormat(response.valor_investido)
                }</p>
            </div>
          </div>
          {/* <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-lime-300">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-black"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-meta-4">Rentabilidade Total</p>
              <p className="text-sm font-medium">{
                (handleRantabilideTotal(response) * 100).toFixed(2) + "%"
                }</p>
            </div>
          </div> */}
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-lime-300">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-black"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-meta-4">Rentabilidade A.A</p>
              <p className="text-sm font-medium">{
                (handleRentabilideAA(handleRantabilideTotal(response), handleMesesAteOPagamento(response)) * 100).toFixed(2) + "%"
                }</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-lime-300">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-black"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-meta-4">Rentabilidade A.M.</p>
              <p className="text-sm font-medium">{
                (handleRentabilidadeAM(handleRentabilideAA(handleRantabilideTotal(response), handleMesesAteOPagamento(response))) * 100).toFixed(2) + "%"
                }</p>
            </div>
          </div>
          </div>
    </div>
  );
};

export default RentabilityChart;
