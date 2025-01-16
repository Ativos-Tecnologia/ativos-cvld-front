import dateFormater from "@/functions/formaters/dateFormater";
import numberFormat from "@/functions/formaters/numberFormat";
import { handleMesesAteOPagamento, handleRentabilidadeAM } from "@/functions/wallet/rentability";
import { IWalletResponse } from "@/interfaces/IWallet";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { AiOutlineLoading } from "react-icons/ai";
import Decimal from "decimal.js";

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


  function atualizacaoProjetadaAM(data: IWalletResponse) {
    const ultimoValor = data.result[data.result.length - 1].valor_liquido_disponivel;
    // const dataDeAtualizacao = new Date(data.result[0].data_atualizacao);
    // const projetado_12_meses = ultimoValor * (1 + data.ipca_ultimos_12_meses)
    // const diff = projetado_12_meses - ultimoValor;
    // const diff_mensal = diff / 12;

    
    // while (dataDeAtualizacao < new Date(data.previsao_de_pgto)) {
      //   dataDeAtualizacao.setMonth(dataDeAtualizacao.getMonth() + 1);
      //   datas_de_referencia.push(new Date(dataDeAtualizacao).toISOString().split('T')[0]);
      // }

      
      const datas_de_referencia = [];

      if (data.result.length > 0) {

        const dataDeAtualizacao = data.data_de_aquisicao?.split('T')[0];
        const dataDePagamento = data.previsao_de_pgto
        datas_de_referencia.push(dataDeAtualizacao);
        datas_de_referencia.push(dataDePagamento);
      }



    // const mesesAteOPagamento = handleMesesAteOPagamento(data);

    const valores_de_referencia = [ultimoValor, data.valor_projetado];
    // let valor = ultimoValor;

    // for (let i = 0; i <= Math.floor(mesesAteOPagamento); i++) {
    //   valor += diff_mensal;
    //   valorAtualizado.push(valor);
    // }

    return {
      data: datas_de_referencia.map((item) => dateFormater(item).slice(3, 10)),
      valor: valores_de_referencia.map((item) => Number(item.toFixed(2)))
    }
  }

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#58DC61"],
    // colors: ["#3056D3", "#58DC61"],
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
      categories: atualizacaoProjetadaAM(data).data,
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
      // {
      //   name: "Valor Investido",
      //   data: data?.result.map((item) => data?.valor_investido) || [],
      // },
      {
        name: "Total Atualizado",
        data: data?.result.map((item) => Number(item.valor_liquido_disponivel.toFixed(2))) || [],
      },
    ],
  });

  const [valorInvestido, setValorInvestido] = useState<number>(0);

  useEffect(() => {
    setState({
      series: [
        // {
        //   name: "Valor Investido",
        //   data: data?.result.map((item) => data.valor_investido) || [],
        // },
        {
          name: "Total Atualizado",
          // Aqui eu pego o valor líquido disponível de cada mês e arredondo para 2 casas decimais. Também quero adicionar o valor atualizado de cada mês até o pagamento no gráfico
          data: atualizacaoProjetadaAM(data).valor,
        },
      ],
    });

    setValorInvestido(data?.valor_investido);
  }, [data]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-6 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-12">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-56">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-black dark:border-snow">
              <span className="block h-2 w-full max-w-2 rounded-full bg-black dark:bg-snow"></span>
            </span>
            <div className="w-full mb-4">
              <p className="font-semibold text-black dark:text-snow">Análise de Investimentos</p>
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
            <p className="font-semibold text-xs text-black dark:text-snow">Valor Investido</p>
            {data ? (<p className="text-sm font-medium">{
              numberFormat(valorInvestido)
            }</p>) : <AiOutlineLoading className="animate-spin mr-2" />}
          </div>
        </div>
        <div className="flex min-w-60">
          <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-black dark:border-snow">
            <span className="block h-2 w-full max-w-2 rounded-full bg-black dark:bg-snow"></span>
          </span>
          <div className="w-full">
            <p className="font-semibold text-xs text-black dark:text-snow">Rentabilidade Projetada A.A</p>
            {data ? (<p className="text-sm font-medium">{
             (data.rentabilidade_anual * 100).toFixed(2).replace('.', ',') + "%"
            }</p>) : <AiOutlineLoading className="animate-spin mr-2" />}
          </div>
        </div>
        <div className="flex min-w-60">
          <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-black dark:border-snow">
            <span className="block h-2 w-full max-w-2 rounded-full bg-black dark:bg-snow"></span>
          </span>
          <div className="w-full">
            <p className="font-semibold text-xs text-black dark:text-snow">Rentabilidade Projetada A.M.</p>
            {data ? (<p className="text-sm font-medium">{
              (Number(handleRentabilidadeAM(data.rentabilidade_anual)) * 100).toFixed(2).replace('.', ',') + "%"
            }</p>) : <AiOutlineLoading className="animate-spin mr-2" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentabilityChart;
