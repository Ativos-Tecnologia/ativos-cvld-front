import { ApexOptions } from "apexcharts";
import Image from "next/image";
import { Result } from "postcss";
import React, { use, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

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
    categories: ["M", "T", "W", "T", "F", "S", "S"],
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

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

export interface CVLDResultProps {
    recalc_flag: string;
    npu: string;
    valor_principal: number;
    valor_juros: number;
    valor_inscrito: number;
    valor_pss: number;
    data_base: string;
    data_requisicao: string;
    fator_correcao_selic: number;
    fator_correcao_ipca_e: number;
    principal_atualizado_requisicao: number;
    juros_atualizados_requisicao: number;
    fator_periodo_graca_ipca_e: number;
    valor_principal_ipca_e: number;
    valor_juros_ipca_e: number;
    valor_bruto_atualizado_final: number;
    pss_atualizado: number;
    numero_de_meses: number;
    imposto_de_renda: number;
    incidencia_rra_ir: boolean;
    rra: number;
    valor_liquido_disponivel: number;
    link_memoria_de_calculo_rra: string | null;
    link_memoria_de_calculo_simples: string;
    link_cvld: string;
    nome_credor: string;
    cpf_cnpj_credor: string;
}
export interface ApiResponse {
    result: CVLDResultProps[];
    setData: React.Dispatch<React.SetStateAction<ApiResponse>>;
}


const CVLDResult: React.FC<ApiResponse> = (result, {setData}) => {

  const [filledData, setFilledData] = useState<boolean>(false);
  const [auxData, setAuxData] = useState<ApiResponse>({ result: [], setData: () => {} });

  useEffect(() => {
    if (result.result.length > 0) {
      setFilledData(true);
      setAuxData(result);
    }
  }, [result, filledData]);



  const numberFormat = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  const dateFormater = (date: string) => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  }

  const factorFormater = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumSignificantDigits: 5,
      style: "decimal",
    }).format(value);
  }

  const linkAdapter = (link: string) => {
    const linkUrl = "https://ativos-cvld-prod-32c6589080c0.herokuapp.com/" + link;
    return linkUrl;
  }






  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        {
          filledData ? (
            <div>
          <h4 className="text-xl pb-4 font-semibold text-black dark:text-white">
            Resultado dos Valores Atualizados
          </h4>
          <div className="flex flex-col items-center mt-2">
          {auxData && auxData.result && auxData.result.map((item: CVLDResultProps) => (
            <ul key={item.npu} className="flex flex-col gap-2">

          {
            item.recalc_flag === "after_12_2021" ? (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            Regra de Recálculo: Após 12/2021
          </li>
            ) : item.recalc_flag === "before_12_2021" ? (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            Regra de Recálculo: Antes 12/2021
          </li>
            ) : (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            Regra de Recálculo: Tributário
          </li>
            )
          }
          {
            item.npu === "00000000000000000000" || !item.link_cvld ? (
              null
            ) : (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            NPU: {item.npu}
          </li>
            )
          }
          {
            item.nome_credor &&  (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            Nome do credor: {item.nome_credor}
          </li>
            )
          }
          {
            item.cpf_cnpj_credor && (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            CPF/CNPJ do credor: {item.cpf_cnpj_credor}
          </li>
            )
          }
          <li className="text-sm text-gray-500 dark:text-gray-400">
            Valor Principal: {numberFormat(item.valor_principal)}
          </li>
          <li className="text-sm text-gray-500 dark:text-gray-400">
            Valor Juros: {numberFormat(item.valor_juros)}
          </li>
          <li className="text-sm text-gray-500 dark:text-gray-400">
            Valor Inscrito: {numberFormat(item.valor_inscrito)}
          </li>
          {
            item.valor_pss ? (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            Valor PSS: {numberFormat(item.valor_pss)}
          </li>
            ) : item.valor_pss === 0 ? (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            Valor PSS: 0
          </li>
            ) : (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            Valor PSS: Não Se Aplica
          </li>
            )

          }
          <li className="text-sm text-gray-500 dark:text-gray-400">
            Data Base: {dateFormater(item.data_base)}
          </li>
          <li className="text-sm text-gray-500 dark:text-gray-400">
            Data Requisição: {dateFormater(item.data_requisicao)}
          </li>
          <li className="text-sm text-gray-500 dark:text-gray-400">
            Fator Correção Selic: {factorFormater(item.fator_correcao_selic)}
          </li>
          {
            item.fator_correcao_ipca_e && (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            Fator Correção IPCA-E: {factorFormater(item.fator_correcao_ipca_e)}
          </li>
            )
          }
          {
            item.principal_atualizado_requisicao && (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            Principal Atualizado Requisição: {numberFormat(item.principal_atualizado_requisicao)}
          </li>
            )
          }
          {
            item.juros_atualizados_requisicao && (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            Juros Atualizados Requisição: {numberFormat(item.juros_atualizados_requisicao)}
          </li>
            )
          }
          {
            item.fator_periodo_graca_ipca_e && (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            Fator Período Graça IPCA-E: {factorFormater(item.fator_periodo_graca_ipca_e)}
          </li>
            )
          }
          {
            item.valor_principal_ipca_e && (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            Valor Principal IPCA-E: {numberFormat(item.valor_principal_ipca_e)}
          </li>
            )
          }
          {
            item.valor_juros_ipca_e && (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            Valor Juros IPCA-E: {numberFormat(item.valor_juros_ipca_e)}
          </li>
            )
          }
          <li className="text-sm text-gray-500 dark:text-gray-400">
            Valor Bruto Atualizado Final: {numberFormat(item.valor_bruto_atualizado_final)}
          </li>
          {
            item.pss_atualizado && (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            PSS Atualizado: {numberFormat(item.pss_atualizado)}
          </li>
            )
          }
          {
            item.numero_de_meses && (
              <li className="text-sm text-gray-500 dark:text-gray-400">
            Número de Meses: {item.numero_de_meses}
          </li>
            )
          }
          <li className="text-sm text-gray-500 dark:text-gray-400">
            Imposto de Renda: {numberFormat(item.imposto_de_renda)}
          </li>
          <li className="text-sm text-gray-500 dark:text-gray-400">
            Incidência IR: {item.incidencia_rra_ir ? "Sim" : "Não"}
          </li>
          <li className="text-sm text-gray-500 dark:text-gray-400">
            RRA: {item.rra ? numberFormat(item.rra) : item.link_memoria_de_calculo_rra ? "Isento" : "Não Incidente"}
          </li>
          <li className="text-sm text-gray-500 dark:text-gray-400">
            Valor Líquido Disponível: {numberFormat(item.valor_liquido_disponivel)}
          </li>
          <hr className="border border-stroke dark:border-strokedark my-4" />
          {
            item.link_memoria_de_calculo_rra && (
              <li className="text-sm flex text-gray-500 dark:text-gray-400 w-full py-1">
            <a href={linkAdapter(item.link_memoria_de_calculo_rra)} className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-dark">Link Memória de Cálculo RRA</a>
          </li>
            )
          }
          <li className="text-sm flex text-gray-500 dark:text-gray-400 w-full py-1">
            <a href={linkAdapter(item.link_memoria_de_calculo_simples)} className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-dark">Link Memória de Cálculo Simples</a>
          </li>
          {
            item.link_cvld && (
              <li className="text-sm flex text-gray-500 dark:text-gray-400 w-full py-1">

            <a href={linkAdapter(item.link_cvld)} className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-dark">Link CVLD</a>
          </li>
            )
          }

          </ul>

))}
</div>
{/* <button className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-dark" onClick={
  () => {
    setData({ result: [] });
    setFilledData(false);
  }

}>Limpar Resultado</button> */}
</div>
          ) : (
            <div className="flex flex-col justify-between items-center gap-22">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Ainda sem resultados
          </h4>
          <Image
              src="/images/business_man.svg"
              alt="Empty"
              width={550}
              height={650}
            />
            <span
              className="text-gray-500 dark:text-gray-400 text-center">
                Faça uma requisição para visualizar os resultados
              </span>
            </div>
          )

          }







        </div>

    </div>
  );
};

export default CVLDResult;
