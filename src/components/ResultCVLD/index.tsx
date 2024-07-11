import { ApexOptions } from "apexcharts";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { BiDownload } from "react-icons/bi";
import { CVLDResultProps } from "@/interfaces/IResultCVLD";
import { BsEraser } from "react-icons/bs";
import linkAdapter from "@/functions/formaters/linkFormater";
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


export interface ApiResponse {
  result: CVLDResultProps[];
  setData: React.Dispatch<React.SetStateAction<ApiResponse>>;
}

const CVLDResult: React.FC<ApiResponse> = (result, { setData }) => {

  const [filledData, setFilledData] = useState<boolean>(false);
  const [auxData, setAuxData] = useState<ApiResponse>({ result: [], setData: () => { } });
  const CVLDResultRef = React.useRef<HTMLDivElement>(null);

  // lógica para limpar a tela de cálculos
  const clearData = () => {
    setFilledData(false);
    setAuxData({ result: [], setData: () => { } });
  }

  useEffect(() => {
    if (result.result.length > 0 && window.innerWidth <= 1270) {
      CVLDResultRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [result])

  const [state, setState] = useState<ChartTwoState>({
    series: [
      {
        name: "Valor Principal",
        data: [0, 0],
      },
      {
        name: "Valor Juros",
        data: [0, 0],
      },
    ],
  });

  useEffect(() => {
    if (result.result.length > 0) {
      setFilledData(true);
      setAuxData(result);

        const formatedPrincipal = result.result[0].valor_principal.toFixed(2);

        const formatedUpdatedPrincipal = result.result[0]?.principal_atualizado_requisicao?.toFixed(2);




        if (result.result[0].recalc_flag === "tributario") {

          const series = [
            {
              name: "Valor Principal",
              data: [Number(formatedPrincipal), Number(formatedPrincipal)],
            },
            {
              name: "Valor Juros",
              data: [Number(result.result[0].valor_juros.toFixed(2)), Number(result.result[0].juros_atualizado.toFixed(2))],
            },
            {
              name: "Total",
              data: [Number(result.result[0].valor_inscrito.toFixed(2)), Number(result.result[0].valor_liquido_disponivel.toFixed(2))],
            },
          ];

          setState({ series });
        }
        else {
          const series = [
            {
              name: "Valor Principal",
              data: [Number(formatedPrincipal), Number(formatedUpdatedPrincipal)],
            },
            {
              name: "Valor Juros",
              data: [Number(result.result[0].valor_juros.toFixed(2)), Number(result.result[0].juros_atualizados_requisicao.toFixed(2))],
            },
            {
              name: "Total",
              data: [Number(result.result[0].valor_inscrito.toFixed(2)), Number(result.result[0].valor_liquido_disponivel.toFixed(2))],
            },
          ];
          setState({ series });
        }
    }
  }, [result]);



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

  return (
    <div ref={CVLDResultRef} className="scroll-m-20 scroll-smooth col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-4 justify-between gap-4 sm:flex flex-col">
        {
          filledData ? (
            <div>
              <h4 className="text-xl pb-4 font-semibold text-black dark:text-white">
                Resultado dos Valores Atualizados
              </h4>
              <div className="flex flex-col items-center mt-2">
                {auxData && auxData.result && auxData.result.map((item: CVLDResultProps) => (
                  <ul key={item.npu + item.valor_inscrito} className="w-full flex flex-col gap-2">
                    {
                      item.recalc_flag === "after_12_2021" ? (
                        <li className="text-sm ">
                          <span className="font-bold">Regra de Cálculo:</span> Após 12/2021
                        </li>
                      ) : item.recalc_flag === "before_12_2021" ? (
                        <li className="text-sm ">
                          <span className="font-bold">Regra de Cálculo:</span> Antes 12/2021
                        </li>
                      ) : (
                        <li className="text-sm ">
                          <span className="font-bold">Regra de Cálculo:</span> Tributário
                        </li>
                      )
                    }
                    {
                      item.npu === "00000000000000000000" || !item.link_cvld ? (
                        null
                      ) : (
                        <li className="text-sm ">
                          <span className="font-bold">NPU:</span> {item.npu}
                        </li>
                      )
                    }
                    {
                      item.nome_credor && (
                        <li className="text-sm ">
                          <span className="font-bold">Nome do credor:</span> {item.nome_credor}
                        </li>
                      )
                    }
                    {
                      item.cpf_cnpj_credor && (
                        <li className="text-sm ">
                          <span className="font-bold">CPF/CNPJ do credor:</span> {item.cpf_cnpj_credor}
                        </li>
                      )
                    }
                    <li className="text-sm ">
                      <span className="font-bold">Valor Principal:</span> {numberFormat(item.valor_principal)}
                    </li>
                    {
                      item.valor_juros ? (
                        <li className="text-sm ">
                          <span className="font-bold">Valor Juros:</span> {numberFormat(item.valor_juros)}
                        </li>
                      ) : (
                        <li className="text-sm ">
                          <span className="font-bold">Valor Juros:</span> Não Informado
                        </li>
                      )
                    }
                    <li className="text-sm ">
                      <span className="font-bold">Valor Inscrito:</span> {numberFormat(item.valor_inscrito)}
                    </li>
                    {
                      item.valor_pss !== 0 && item.valor_pss && (
                        <li className="text-sm ">
                          <span className="font-bold">Valor PSS:</span> {numberFormat(item.valor_pss)}
                        </li>
                      )
                    }
                    <li className="text-sm ">
                      <span className="font-bold">Data Base:</span> {dateFormater(item.data_base)}
                    </li>
                    <li className="text-sm ">
                      <span className="font-bold">Data Requisição:</span> {dateFormater(item.data_requisicao)}
                    </li>
                    <li className="text-sm ">
                      <span className="font-bold">Atualizado até:</span> {dateFormater(item.data_limite_de_atualizacao)}
                    </li>
                    {
                      item.fator_correcao_ipca_e && (
                        <li className="text-sm ">
                          <span className="font-bold">Fator Correção IPCA-E:</span> {factorFormater(item.fator_correcao_ipca_e)}
                        </li>
                      )
                    }
                    {
                      item.valor_atualizado_principal && (
                        <li className="text-sm ">
                          <span className="font-bold">Principal Atualizado até 12/2021</span>: {numberFormat(item.valor_atualizado_principal)}
                        </li>
                      )
                    }
                    {
                      item.recalc_flag === "before_12_2021" && (
                        <li className="text-sm ">
                          <span className="font-bold">Juros Atualizado até 12/2021:</span> {numberFormat(item.valor_atualizado_juros)}
                        </li>
                      )
                    }
                    <li className="text-sm ">
                      <span className="font-bold">Fator Correção SELIC:</span> {factorFormater(item.fator_correcao_selic)}
                    </li>
                    {
                      item.principal_atualizado_requisicao && (
                        <li className="text-sm ">
                          <span className="font-bold">Principal Atualizado Requisição:</span> {numberFormat(item.principal_atualizado_requisicao)}
                        </li>
                      )
                    }
                    {
                      String(item.juros_atualizados_requisicao) !== "0.0" || String(item.juros_atualizados_requisicao) !== "0.0" && (
                        <li className="text-sm ">
                          <span className="font-bold">Juros Atualizados Requisição:</span> {numberFormat(item.juros_atualizados_requisicao)}
                        </li>
                      )
                    }
                    {
                      item.fator_periodo_graca_ipca_e && (
                        <li className="text-sm ">
                          <span className="font-bold">Fator Período Graça IPCA-E:</span> {factorFormater(item.fator_periodo_graca_ipca_e)}
                        </li>
                      )
                    }
                    {
                      item.recalc_flag === "before_12_2021" && item.valor_principal_ipca_e && (
                        <li className="text-sm ">
                          <span className="font-bold">Valor Principal IPCA-E:</span> {numberFormat(item.valor_principal_ipca_e)}
                        </li>
                      )
                    }
                    {
                      item.recalc_flag === "before_12_2021" && (
                        <li className="text-sm ">
                          <span className="font-bold">Valor Juros IPCA-E:</span> {numberFormat(item.valor_juros_ipca_e)}
                        </li>
                      )
                    }
                    {
                      item.recalc_flag === "before_12_2021" && item.pss_atualizado !== 0 && (
                        <li className="text-sm ">
                          <span className="font-bold">PSS Atualizado:</span> {numberFormat(item.pss_atualizado)}
                        </li>
                      )
                    }
                    <li className="text-sm ">
                      <span className="font-bold">Valor Bruto Atualizado Final:</span> {numberFormat(item.valor_bruto_atualizado_final)}
                    </li>
                    {
                      item.recalc_flag !== "tributario" && item.numero_de_meses !== 0 && (
                        <li className="text-sm ">
                          <span className="font-bold">Número de Meses:</span> {item.numero_de_meses}
                        </li>
                      )
                    }
                    <li className="text-sm ">
                      <span className="font-bold">Incidência IR:</span> {item.incidencia_rra_ir ? "Sim" : "Não"}
                    </li>
                    <li className="text-sm ">
                      <span className="font-bold">Imposto de Renda:</span> {numberFormat(item.imposto_de_renda)}
                    </li>
                    <li className="text-sm ">
                      <span className="font-bold">RRA:</span> {item.rra ? numberFormat(item.rra) : item.link_memoria_de_calculo_rra ? "Isento" : "Não Incidente"}
                    </li>
                    <li className="text-sm ">
                      <span className="font-bold">Valor Líquido Disponível:</span> {numberFormat(item.valor_liquido_disponivel)}
                    </li>
                    <div id="chartOne" className="mt-8">
        <ReactApexChart
          options={{
            colors: ["#3C50E0", "#80CAEE", "#FFB946"],
            chart: {
              fontFamily: "Satoshi, sans-serif",
              type: "bar",
              height: 335,
              stacked: true,
              toolbar: {
                show: true,
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
              enabled: true,
              textAnchor: "start",
              style: {
                fontSize: "8px",
              },
            },

            xaxis: {
              offsetX: 10,
              categories: ["Data Base", "Data Requisição"],
              labels: {
                style: {
                  fontSize: "10px",

                },
                trim: false,

              },
              title: {
                text: "Movimentação",
              },
              position: "bottom",
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
            },
            yaxis: {
              show: false,
              title: {
                text: "Valores",
              },
              labels: {
                style: {
                  fontSize: "10px",
                },
              },

            },
            legend: {
              show: false,
              position: "top",
              horizontalAlign: "left",
              fontFamily: "Satoshi",
              fontWeight: 400,
              fontSize: "6px",

              markers: {
                radius: 99,
              },
            },
            fill: {
              opacity: 1,
            },
          }}
          series={state.series}
          type="area"
          height={350}
          width={"100%"}

        />
      </div>
                    <hr className="border border-stroke dark:border-strokedark my-4" />
                    {
                      item.link_memoria_de_calculo_rra && (
                        <li className="text-sm flex  w-full py-1">
                          <a href={linkAdapter(item.link_memoria_de_calculo_rra)} className="w-full text-center p-4 flex items-center justify-center text-sm font-semibold text-white rounded-md bg-blue-700 hover:bg-blue-800">
                            <span className="text-[16px] font-medium">
                              Memória de Cálculo RRA
                            </span>
                            <BiDownload style={{
                              width: "22px",
                              height: "22px",
                            }} className="ml-2" />
                          </a>
                        </li>
                      )
                    }
                    <li className="text-sm flex  w-full py-1">
                      <a href={linkAdapter(item.link_memoria_de_calculo_simples)} className="w-full text-center p-4 flex items-center justify-center text-sm font-semibold text-white rounded-md bg-blue-700 hover:bg-blue-800">
                        <span className="text-[16px] font-medium">
                          Memória de Cálculo Simples
                        </span>
                        <BiDownload style={{
                          width: "22px",
                          height: "22px",
                        }} className="ml-2 self-center" />
                      </a>
                    </li>
                    {
                      item.link_cvld && (
                        <li className="text-sm flex  w-full py-1">
                          <a href={linkAdapter(item.link_cvld)} className="w-full text-center p-4 flex items-center justify-center text-sm font-semibold text-white rounded-md bg-blue-700 hover:bg-blue-800">
                            <span className="text-[16px] font-medium">
                              Baixar CVLD
                            </span>
                            <BiDownload style={{
                              width: "22px",
                              height: "22px",
                            }} className="ml-2" />
                          </a>
                        </li>
                      )
                    }
                    <li className="text-sm flex  w-full py-1">
                      <button onClick={clearData} className="w-full text-center p-4 flex items-center justify-center text-sm font-semibold text-white rounded-md bg-red hover:bg-meta-1 transition-all duration-200">
                        <span className="text-[16px] font-medium">
                          Limpar Cálculo
                        </span>
                        <BsEraser style={{
                          width: "22px",
                          height: "22px",
                        }} className="ml-2" />
                      </button>
                    </li>
                  </ul>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-between w-fit mx-auto gap-5 items-center" title="Sem resultados disponíveis - ainda">
              <h4 className="text-xl font-semibold text-black dark:text-white">
                Ainda sem resultados
              </h4>
              <Image
                src="/images/no-results-anim.svg"
                alt="homem ao lado de uma pasta vazia"
                width={200}
                height={450}
                aria-selected={false}
                draggable={false}
              />
              <span
                className="text-center select-none text-sm text-gray-500 dark:text-gray-400">
                Opa! Parece que ainda não há resultados disponíveis.
              </span>
            </div>
          )
        }

      </div>
    </div>
  );
};

export default CVLDResult;
