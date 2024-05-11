import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import {
    Controller,
    useForm,
    SubmitHandler,
    useWatch,
    FieldValues,
    FieldValue,
} from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "@/constants/constants";
import { JWTToken } from "@/types/jwtToken";
import api from "@/utils/api";
import ReactApexChart from "react-apexcharts";

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

type CVLDFormProps = {
  dataCallback: (data: any) => void;
}


const CVLDForm: React.FC<CVLDFormProps> = ({ dataCallback }) => {
    const {
      register,
      control,
      handleSubmit,
      watch,
      getFieldState,
      getValues,
      formState: { errors },
    } = useForm();



      const [state, setState] = useState<ChartTwoState>({
        series: [
          {
            name: "Valor Principal",
            data: [203396.06, 1280.35],
          },
          {
            name: "Valor Juros",
            data: [100, 800],
          },
        ],
      });




    const isUserAdmin = () => {
      const token = localStorage.getItem(`ATIVOS_${ACCESS_TOKEN}`);
      const decoded: JWTToken = jwtDecode(token!);
      return decoded.role === "admin" && decoded.is_staff;
    }


    const onSubmit = async (data:any) => {
      const response = await api.post("/api/extrato/create/", data)
      if (response.status === 200) {
        dataCallback(response.data);

        const formatedPrincipal = parseFloat(data.valor_principal).toFixed(2);
        const formatedUpdatedPrincipal = parseFloat(response.data.result[0].principal_atualizado_requisicao).toFixed(2);

        if (data.natureza === "TRIBUTÁRIA") {

          const series = [
            {
              name: "Valor Principal",
              data: [Number(parseFloat(formatedPrincipal)), Number(parseFloat(formatedPrincipal))],
            },
            {
              name: "Valor Juros",
              data: [Number(parseFloat(data.valor_juros).toFixed(2)), Number(parseFloat(response.data.result[0].juros_atualizado).toFixed(2))],
            },
            {
              name: "Total",
              data: [Number(parseFloat(response.data.result[0].valor_inscrito).toFixed(2)), Number(parseFloat(response.data.result[0].valor_liquido_disponivel).toFixed(2))],
            },
          ]

          setState({ series });
        } else {
          const series = [
            {
              name: "Valor Principal",
              data: [Number(parseFloat(formatedPrincipal)), Number(parseFloat(formatedUpdatedPrincipal))],
            },
            {
              name: "Valor Juros",
              data: [Number(parseFloat(data.valor_juros).toFixed(2)), Number(parseFloat(response.data.result[0].juros_atualizados_requisicao).toFixed(2))],
            },
            {
              name: "Total",
              data: [Number(parseFloat(response.data.result[0].valor_inscrito).toFixed(2)), Number(parseFloat(response.data.result[0].valor_liquido_disponivel).toFixed(2))],
            },
          ];
          setState({ series });
        }



      } else {
        alert("Erro ao calcular");
      }
    };

    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
            <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
                <span className="text-lg font-semibold text-primary">Calculadora de Atualização de Precatórios</span>
            </div>
            <form className="mt-5 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2 w-full sm:col-span-2">
                        <label htmlFor="natureza" className="text-sm font-medium text-meta-5">
                            Natureza do Precatório
                        </label>
                        <select
                            id="natureza"
                            className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                            {
                              ...register("natureza", {
                                required: "Campo obrigatório",
                              })
                            }
                            defaultValue={"NÃO TRIBUTÁRIA"}
                        >
                            <option value="NÃO TRIBUTÁRIA">Não Tributário</option>
                            <option value="TRIBUTÁRIA">Tributário</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="valor_principal" className="text-sm font-medium text-meta-5">
                            Valor Principal
                        </label>
                        <input type="text"
                            id="valor_principal"
                            className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                            {
                              ...register("valor_principal", {
                                setValueAs: (value) => {
                                  return parseFloat(value);
                                }
                              })
                            }
                            placeholder="15585.47"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="valor_juros" className="text-sm font-medium text-meta-5">
                            Juros
                        </label>
                        <input
                            type="text"
                            id="valor_juros"
                            className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                            min={0}
                            {
                            ...register("valor_juros", {
                                setValueAs: (value) => {
                                  return parseFloat(value);
                                },
                            })
                            }
                            placeholder="10658.90"
                        />
                    </div>



                    <div className="flex flex-col gap-2 min-h-17.5">
                        <div className="flex flex-col justify-between">
                            <label htmlFor="data_base" className="text-sm font-medium text-meta-5 mb-1">
                                Data Base
                            </label>
                            <input
                                type="date"
                                id="data_base"
                                className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                {
                                ...register("data_base", {
                                    required: "Campo obrigatório",
                                })
                                }
                                aria-invalid={errors.data_base ? "true" : "false"}
                            />
                            {
                      errors.data_base && (
                        <span role="alert" className="absolute right-4 top-4 text-red-500 text-sm">
                          {errors.data_base.message?.toString()}
                        </span>
                      )
                    }
                        </div>
                        {
                            watch("data_base") < "2021-12-01" && watch("natureza") !== "TRIBUTÁRIA" ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="incidencia_juros_moratorios"
                                        className="rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                        defaultChecked
                                        {
                                        ...register("incidencia_juros_moratorios")
                                        }
                                    />
                                    <label htmlFor="incidencia_juros_moratorios" className="text-sm font-medium text-meta-5">
                                        Juros de Mora fixados em sentença
                                    </label>
                                </div>
                            ) : null
                        }
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col justify-between">
                            <label htmlFor="data_requisicao" className="text-sm font-medium text-meta-5 mb-1">
                                Data de Requisição
                            </label>
                            <input
                                type="date"
                                id="data_requisicao"
                                className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                {
                                ...register("data_requisicao", {
                                    required: "Campo obrigatório",
                                })
                                }
                            />
                            {
                                null
                            }
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox"
                            id="incidencia_rra_ir"
                            className="rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                            defaultChecked
                            {
                            ...register("incidencia_rra_ir")
                            }
                        />
                        <label htmlFor="incidencia_rra_ir" className="text-sm font-medium text-meta-5">
                            Incidência de IR
                        </label>
                    </div>
                    {
                      watch("natureza") === "TRIBUTÁRIA" || watch("incidencia_rra_ir") === false  ? (
                        null
                      ) : (
                        <div className="flex gap-2">
                          <input type="checkbox"
                              id="ir_incidente_rra"
                              className="rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {
                              ...register("ir_incidente_rra")
                              }
                          />
                        <label htmlFor="ir_incidente_rra" className="text-sm font-medium text-meta-5">
                            IR incidente sobre RRA?
                        </label>
                    </div>
                      )
                    }
                    {
                      watch("ir_incidente_rra") === true && watch("natureza") !== "TRIBUTÁRIA" ? (
                        <div className="flex flex-col gap-2">
                        <label htmlFor="numero_de_meses" className="text-sm font-medium text-meta-5">
                            Número de meses
                        </label>
                        <input
                            type="number"
                            id="numero_de_meses"
                            className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                            min={0}
                            defaultValue={0}
                            placeholder="0"
                            {
                            ...register("numero_de_meses", {
                                required: "Campo obrigatório",
                                setValueAs: (value) => {
                                  return parseInt(value);
                                }
                            })
                            }
                        />
                    </div>
                      ) : null
                    }
                    {
                      watch("natureza") === "NÃO TRIBUTÁRIA" ? (
                        <div className="flex flex-col gap-2">
                        <label htmlFor="valor_pss" className="text-sm font-medium text-meta-5">
                            PSS
                        </label>
                        <input
                            type="text"
                            id="valor_pss"
                            className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                            min={0}
                            placeholder="0"
                            {
                            ...register("valor_pss", {
                                required: "Campo obrigatório",
                                setValueAs: (value) => {
                                  return parseFloat(value);
                                },
                            })
                            }
                        />
                    </div>
                      ) : null
                    }

                    <div className="flex flex-col gap-2 sm:col-span-2">
                        <div className="flex gap-2 ">
                            <input
                                type="checkbox"
                                id="gerar_cvld"
                                className="rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                {...register("gerar_cvld")}
                            />
                            <label htmlFor="gerar_cvld" className="text-sm font-medium text-meta-5">
                                Emitir CVLD?
                            </label>
                        </div>
                        <div className="flex flex-col gap-2">
                            {
                                watch("gerar_cvld") ? (
                                    <div className="mt-4">
                                        <span className="text-lg font-semibold text-primary">Dados do Cessionário</span><div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-12">
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="credor" className="text-sm font-medium text-meta-5">
                                                    Nome
                                                </label>
                                                <input
                                                    type="text"
                                                    id="credor"
                                                    className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                                    {
                                                    ...register("credor", {
                                                        required: "Campo obrigatório",
                                                    })
                                                    }
                                                     />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="cpf_cnpj" className="text-sm font-medium text-meta-5">
                                                    CPF/CNPJ
                                                </label>
                                                <input
                                                    type="text"
                                                    id="cpf_cnpj"
                                                    className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                                    required
                                                    {
                                                    ...register("cpf_cnpj", {
                                                        required: "Campo obrigatório",
                                                    })

                                                    }/>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="npu" className="text-sm font-medium text-meta-5">
                                                    NPU - Número de Processo Único
                                                </label>
                                                <input
                                                    type="text"
                                                    id="npu"
                                                    className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                                    required
                                                    {
                                                    ...register("npu", {
                                                        required: "Campo obrigatório",
                                                    })
                                                    }
                                                />
                                              </div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="tribunal" className="text-sm font-medium text-meta-5">
                                                    Tribunal
                                                </label>
                                                <select
                                                    id="tribunal"
                                                    className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                                    required
                                                    {
                                                      ...register("tribunal", {
                                                        required: "Campo obrigatório",
                                                      })

                                                    }
                                                    defaultValue="TRF1">
                                                    <option value="TRF1">TRF1</option>
                                                    <option value="TRF2">TRF2</option>
                                                    <option value="TRF3">TRF3</option>
                                                    <option value="TRF4">TRF4</option>
                                                    <option value="TRF5">TRF5</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-2"></div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="juizo_vara" className="text-sm font-medium text-meta-5">
                                                    Juízo deprecante
                                                </label>
                                                <input
                                                    type="text"
                                                    id="juizo_vara"
                                                    className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                                    required
                                                    {
                                                      ...register("juizo_vara", {
                                                        required: "Campo obrigatório",
                                                      })
                                                    }
                                                    />
                                              </div>



                                        </div>
                                    </div>
                                ) : null
                            }
                        </div>
                        {
                          isUserAdmin() ? (
                            <div className="flex flex-col gap-2">
                              <span className="text-lg font-semibold text-primary mb-4">Opções de Administrador</span>
                                <div className="flex flex-col gap-2 sm:col-span-2">
                                <div className="flex gap-2">
                                  <input type="checkbox"
                                      id="upload_notion"
                                      className="rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                      {
                                        ...register("upload_notion")
                                      }
                                  />
                                  <label htmlFor="upload_notion" className="text-sm font-medium text-meta-5">
                                    Fazer upload para o Notion
                                  </label>
                                </div>
                                {
                                  watch("upload_notion") === true ? (
                                    <div className="flex flex-col gap-2">
                                  <label htmlFor="notion_db_id" className="text-sm font-medium text-meta-5">
                                    Banco de dados
                                  </label>
                                  <select id="notion_db_id" className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                  {
                                    ...register("notion_db_id", {
                                      required: "Campo obrigatório",
                                    })

                                  }
                                  defaultValue={"notion_prec_prospect_db_id"}>
                                    <option value="notion_prec_prospect_db_id">Comercial</option>
                                    <option value="notion_prec_prospect_partners_db_id">Parceiro</option>
                                    <option value="notion_prec_prospect_dev_db_id">Dev</option>
                                  </select>
                                  </div>
                                  ) : null
                                }
                                </div>
                            </div>


                          ) : null
                        }


                    </div>






                </div>
                <div className="flex justify-center my-8">
                    <button
                        type="submit"
                        className="px-12 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-dark my-8"
                    >
                        Calcular
                    </button>
                </div>
            </form>
            <hr className="border border-stroke dark:border-strokedark mb-8" />

        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={{
              colors: ["#3C50E0", "#80CAEE", "#FFB946"],
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
                categories: ["Data Base", "Data Requisição"],
              },
              legend: {
                position: "top",
                horizontalAlign: "left",
                fontFamily: "Satoshi",
                fontWeight: 400,
                fontSize: "12px",

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
        </div>
    );
};

export default CVLDForm;
