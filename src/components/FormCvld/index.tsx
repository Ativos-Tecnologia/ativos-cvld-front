import { ApexOptions } from "apexcharts";
import React, { useEffect, useRef, useState } from "react";
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
import Cleave from "cleave.js/react";

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

type CVLDFormProps = {
  dataCallback: (data: any) => void;
};

interface CPFCNPJprops {
  blocks: Array<number>;
  delimiters: Array<string>;
  numericOnly: boolean;
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

  const [inputValue, setInputValue] = useState<string>("");


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


  const getOptions = (value:any) => {

    if (value.length <= 11) {
      return {
        blocks: [3, 3, 3, 2],
        delimiters: ['.', '.', '-'],
        numericOnly: true
      };
    } else {
      return {
        blocks: [2, 3, 3, 4, 2],
        delimiters: ['.', '.', '/', '-'],
        numericOnly: true
      };
    }
  };



  const isUserAdmin = () => {
    const token = localStorage.getItem(`ATIVOS_${ACCESS_TOKEN}`);
    const decoded: JWTToken = jwtDecode(token!);
    return decoded.role === "admin" && decoded.is_staff;
  }

  function backendNumberFormat(value: string) {
    if (value === "" || undefined || null) {
      return "0.00";
    }

    return value?.replace("R$ ", "").replaceAll(".", "").replaceAll(",", ".");
  }


  const onSubmit = async (data: any) => {
    data.valor_principal = backendNumberFormat(data.valor_principal);
    console.log(data.valor_principal);

    data.valor_juros = backendNumberFormat(data.valor_juros);
    data.valor_pss = backendNumberFormat(data.valor_pss);
    // data.valor_representante = backendNumberFormat(data.valor_representante);
    // data.valor_cessionario = backendNumberFormat(data.valor_cessionario);

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



    } else if (response.status === 401) {
      window.location.reload();
    } else {
      alert("Erro ao processar a requisição. Tente novamente mais tarde.");
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
            <Controller
              name="valor_principal"
              control={
                control
              }
              defaultValue={0}
              render={({ field }) => (
                <Cleave
                  {...field}
                  className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                  options={{
                    numeral: true,
                    numeralThousandsGroupStyle: "thousand",
                    numeralDecimalScale: 2,
                    numeralDecimalMark: ",",
                    delimiter: ".",
                    prefix: "R$ ",
                    rawValueTrimPrefix: true,
                  }}
                />
              )}


            />
            {/* <input type="text"
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
            /> */}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="valor_juros" className="text-sm font-medium text-meta-5">
              Juros
            </label>
            <Controller
              name="valor_juros"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <Cleave
                  {...field}
                  className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                  options={{
                    numeral: true,
                    numeralPositiveOnly: true,
                    numeralThousandsGroupStyle: "thousand",
                    numeralDecimalScale: 2,
                    numeralDecimalMark: ",",
                    delimiter: ".",
                    prefix: "R$ ",
                    rawValueTrimPrefix: true,
                  }}
                />
              )}
            />
            {/* <input
              type="text"
              id="valor_juros"
              className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
              min={0}
              defaultValue={0}
              {
              ...register("valor_juros", {
                setValueAs: (value) => {
                  return parseFloat(value);
                },
              })
              }
              placeholder="10658.90"
            /> */}
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
            watch("natureza") === "TRIBUTÁRIA" || watch("incidencia_rra_ir") === false ? (
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
            watch("natureza") !== "TRIBUTÁRIA" ? (
              <div className="flex gap-2 items-center">
                <input type="checkbox"
                  id="incidencia_pss"
                  className="rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                  {
                  ...register("incidencia_pss")
                  }
                />
                <label htmlFor="incidencia_pss" className="text-sm font-medium text-meta-5">
                  Incide PSS?
                </label>
              </div>
            ) : null
          }

          {
            watch("incidencia_pss") && watch("natureza") !== "TRIBUTÁRIA" ? (
              <div className="flex flex-col gap-2">
                <label htmlFor="valor_pss" className="text-sm font-medium text-meta-5">
                  PSS
                </label>
                <Controller
                  name="valor_pss"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <Cleave
                      {...field}
                      className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                      options={{
                        numeral: true,
                        numeralThousandsGroupStyle: "thousand",
                        numeralDecimalScale: 2,
                        numeralDecimalMark: ",",
                        delimiter: ".",
                        prefix: "R$ ",
                        rawValueTrimPrefix: true,
                      }}
                    />
                  )}
                />
                {/* <input
                  type="text"
                  id="valor_pss"
                  className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                  placeholder="0"
                  {
                  ...register("valor_pss", {
                    setValueAs: (value) => {
                      return parseFloat(value);
                    },
                  })
                  }
                /> */}
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
                Emitir Certidão de Valor Líquido Disponível (CVLD)?
              </label>
            </div>
            <div className="flex flex-col gap-2">
              {
                watch("gerar_cvld") ? (
                  <>
                    <span className="text-lg font-semibold text-primary mt-8">Dados do Principal</span><div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-4">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="credor" className="text-sm font-medium text-meta-5">
                          Nome/Razão Social do Credor Principal
                        </label>
                        <input
                          type="text"
                          id="credor"
                          className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                          {...register("credor", {})} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="cpf_cnpj" className="text-sm font-medium text-meta-5">
                          CPF/CNPJ
                        </label>
                        {/* <Controller
                          name="cpf_cnpj"
                          control={control}
                          defaultValue=""
                          render={({ field }) => (
                            <Cleave
                              {...field}
                              className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              options={getOptions(inputValue)}
                              onChange={(e) => {
                                field.onChange(e);
                                setInputValue(e.target.rawValue);
                              }}
                            />
                          )}
                        /> */}
                        <input
                          type="text"
                          id="cpf_cnpj"
                          className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                          {...register("cpf_cnpj", {})} />
                      </div>

                      <div className="flex flex-col gap-2 sm:col-span-2 mt-0">
                        <div className="flex gap-2 ">
                          <input
                            type="checkbox"
                            id="possui_advogado"
                            className="rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                            {...register("possui_advogado")}
                          />
                          <label htmlFor="possui_advogado" className="text-sm font-medium text-meta-5">
                            Advogado, se houver
                          </label>
                        </div>
                      </div>
                      {
                        watch("possui_advogado") ? (
                          <>
                          <span className="text-lg font-semibold text-primary">Dados do Advogado</span>
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-4"></div>

                            <div className="flex flex-col">
                              <label htmlFor="nome_advogado" className="text-sm font-medium text-meta-5">
                                Nome/Razão Social do Advogado
                              </label>
                              <input
                                type="text"
                                id="nome_advogado"
                                className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                {...register("nome_advogado", {})} />
                            </div>
                            <div className="flex flex-col">
                              <label htmlFor="cpf_cnpj_advogado" className="text-sm font-medium text-meta-5">
                                CPF/CNPJ
                              </label>
                              <input
                                type="text"
                                id="cpf_cnpj_advogado"
                                className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                {...register("cpf_cnpj_advogado", {})} />
                            </div>
                            {/* <div className="flex flex-col gap-2">
                              <label htmlFor="valor_representante" className="text-sm font-medium text-meta-5">
                                Honorários Contratuais
                              </label>
                              <Controller name="valor_representante"
                                control={control}
                                defaultValue={0}
                                render={({ field }) => (
                                  <Cleave
                                    {...field}
                                    className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                    options={{
                                      numeral: true,
                                      numeralThousandsGroupStyle: "thousand",
                                      numeralDecimalScale: 2,
                                      numeralDecimalMark: ",",
                                      delimiter: ".",
                                      prefix: "R$ ",
                                      rawValueTrimPrefix: true,
                                    }}
                                  />
                                )}
                              />
                            </div> */}
                          </>
                        ) : null
                      }

                      <div className="flex flex-col gap-2 sm:col-span-2">
                        <div className="flex gap-2 ">
                          <input
                            type="checkbox"
                            id="possui_cessionario"
                            className="rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                            {...register("possui_cessionario")}
                          />
                          <label htmlFor="possui_cessionario" className="text-sm font-medium text-meta-5">
                            Cessionário, se houver
                          </label>
                        </div>
                      </div>

                      {watch("possui_cessionario") ? (
                        <>
                          <span className="text-lg font-semibold text-primary">Dados do Cessionário</span>
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-4"></div>
                          <div className="flex flex-col">
                            <label htmlFor="nome_cessionario" className="text-sm font-medium text-meta-5">
                              Nome/Razão Social do Cessionário
                            </label>
                            <input
                              type="text"
                              id="nome_cessionario"
                              className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("nome_cessionario", {})} />
                          </div>
                          <div className="flex flex-col">
                            <label htmlFor="cpf_cnpj_cessionario" className="text-sm font-medium text-meta-5">
                              CPF/CNPJ
                            </label>
                            <input
                              type="text"
                              id="cpf_cnpj_cessionario"
                              className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("cpf_cnpj_cessionario", {})} />
                          </div>
                          {/* <div className="flex flex-col">
                            <label htmlFor="valor_cessionario" className="text-sm font-medium text-meta-5">
                              Cessão de Crédito
                            </label>
                            <Controller
                              name="valor_cessionario"
                              control={control}
                              defaultValue={0}
                              render={({ field }) => (
                                <Cleave
                                  {...field}
                                  className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                  options={{
                                    numeral: true,
                                    numeralThousandsGroupStyle: "thousand",
                                    numeralDecimalScale: 2,
                                    numeralDecimalMark: ",",
                                    delimiter: ".",
                                    prefix: "R$ ",
                                    rawValueTrimPrefix: true,
                                  }}
                                />
                              )}
                            />
                          </div>
                          &nbsp; */}

                        </>
                      ) : null}

<span className="text-lg font-semibold text-primary">Dados do Credor Solicitante</span>
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-4"></div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="credor_solicitante" className="text-sm font-medium text-meta-5">
                          Nome/Razão Social do Credor Solicitante
                        </label>
                        <input
                          type="text"
                          id="credor_solicitante"
                          className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                          {...register("credor_solicitante", {})} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="cpf_cnpj_credor_solicitante" className="text-sm font-medium text-meta-5">
                          CPF/CNPJ do Credor Solicitante
                        </label>
                        <input
                          type="text"
                          id="cpf_cnpj_credor_solicitante"
                          className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                          {...register("cpf_cnpj_credor_solicitante", {})} />
                      </div>

                      <span className="text-lg font-semibold text-primary">Dados do Processo</span>
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-4"></div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="processo_origem" className="text-sm font-medium text-meta-5">
                          Processo de Origem
                        </label>
                        {/* <input
                          type="text"
                          id="processo_origem"
                          className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                          {...register("processo_origem", {})} /> */}
                          <Controller
                            name="processo_origem"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <Cleave
                                {...field}
                                className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                options={{
                                  blocks: [7,2,4,1,2,4],
                                  delimiters: ['.', '-', '.', '.', '.'],
                                  numericOnly: true
                                }}
                              />
                            )}
                            />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="npu" className="text-sm font-medium text-meta-5">
                          Processo de Execução
                        </label>
                        {/* <input
                          type="text"
                          id="npu"
                          className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                          {...register("npu", {})} /> */}
                          <Controller
                            name="npu"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <Cleave
                                {...field}
                                className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                options={{
                                  blocks: [7,2,4,1,2,4],
                                  delimiters: ['.', '-', '.', '.', '.'],
                                  numericOnly: true
                                }}
                              />
                            )}
                            />


                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="numero_requisicao" className="text-sm font-medium text-meta-5">
                          Número da Requisição
                        </label>
                        <input
                          type="text"
                          id="numero_requisicao"
                          className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                          {...register("numero_requisicao", {})} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="juizo_vara" className="text-sm font-medium text-meta-5">
                          Juízo/Vara
                        </label>
                        <input
                          type="text"
                          id="juizo_vara"
                          className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                          {...register("juizo_vara", {})} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="tribunal" className="text-sm font-medium text-meta-5">
                          Tribunal
                        </label>
                        <select
                          id="tribunal"
                          className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                          {...register("tribunal", {})}
                          defaultValue="TRF1">
                          <option value="TRF1">TRF1</option>
                          <option value="TRF2">TRF2</option>
                          <option value="TRF3">TRF3</option>
                          <option value="TRF4">TRF4</option>
                          <option value="TRF5">TRF5</option>
                        </select>
                      </div>
                      {/* <div className="hidden flex-col gap-2">
                        <label htmlFor="tribunal" className="text-sm font-medium text-meta-5">
                          Tribunal
                        </label>
                        <select
                          id="tribunal"
                          className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                          {...register("tribunal", {})}
                          defaultValue="TRF1">
                          <option value="TRF1">TRF1</option>
                          <option value="TRF2">TRF2</option>
                          <option value="TRF3">TRF3</option>
                          <option value="TRF4">TRF4</option>
                          <option value="TRF5">TRF5</option>
                        </select>
                      </div> */}
                      &nbsp;

                    </div>


                    {/* <hr className="border border-stroke dark:border-strokedark my-6 col-span-2" /> */}


                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* <div className="flex flex-col gap-2">
                        <label htmlFor="valor_penhora" className="text-sm font-medium text-meta-5">
                          Penhora/Arresto <span className="text-xs text-meta-4">(se houver)</span>
                        </label>
                        <input
                          type="text"
                          id="valor_penhora"
                          className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark disabled:opacity-50 cursor-not-allowed"
                          disabled
                          {...register("valor_penhora", {})} />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="valor_fgts" className="text-sm font-medium text-meta-5">
                          Valor de FGTS <span className="text-xs text-meta-4">(se houver)</span>
                        </label>
                        <input
                          type="text"
                          id="valor_fgts"
                          className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark disabled:opacity-50 cursor-not-allowed"
                          disabled
                          {...register("valor_fgts", {})} />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="valor_fgts" className="text-sm font-medium text-meta-5 disabled:opacity-50 cursor-not-allowed">
                          Parcela paga
                        </label>
                        <input
                          type="text"
                          id="valor_fgts"
                          disabled
                          className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark disabled:opacity-50 cursor-not-allowed"
                          {...register("valor_fgts", {})} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="valor_fgts" className="text-sm font-medium text-meta-5 disabled:opacity-50 cursor-not-allowed">
                          Crédito utilizado
                        </label>
                        <input
                          type="text"
                          id="valor_fgts"
                          disabled
                          className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark disabled:opacity-50 cursor-not-allowed"
                          {...register("valor_fgts", {})} />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="outras_deducoes" className="text-sm font-medium text-meta-5 disabled:opacity-50 cursor-not-allowed">
                          Outras deduções <span className="text-xs text-meta-4">(identificar)</span>
                        </label>
                        <input
                          type="text"
                          id="outras_deducoes"
                          disabled
                          className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark disabled:opacity-50 cursor-not-allowed"
                          {...register("outras_deducoes", {})} />
                      </div> */}
                    </div></>
                ) : null
              }
              </div>
            {
              isUserAdmin() ? (
                <><hr className="border border-stroke dark:border-strokedark my-8 col-span-2" /><div className="flex flex-col gap-2">
                  <span className="text-lg font-semibold text-primary mb-4">Opções de Administrador 🛡️</span>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <div className="flex gap-2">
                      <input type="checkbox"
                        id="upload_notion"
                        className="rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                        {...register("upload_notion")} />
                      <label htmlFor="upload_notion" className="text-sm font-medium text-meta-5">
                        Fazer upload para o Notion
                      </label>
                    </div>
                    {watch("upload_notion") === true ? (
                      <div className="flex flex-col gap-2">
                        <label htmlFor="notion_db_id" className="text-sm font-medium text-meta-5">
                          Banco de dados
                        </label>
                        <select id="notion_db_id" className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                          {...register("notion_db_id", {
                            required: "Campo obrigatório",
                          })}
                          defaultValue={"notion_prec_prospect_db_id"}>
                          <option value="notion_prec_prospect_db_id">Comercial</option>
                          <option value="notion_prec_prospect_partners_db_id">Parceiro</option>
                          <option value="notion_prec_prospect_dev_db_id">Dev</option>
                        </select>
                      </div>
                    ) : null}
                  </div>
                </div>
                </>
              ) : null
            }
          </div>

        </div>
        <div className="flex justify-center my-8">
          <button
            type="submit"
            className="px-12 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-dark my-8"
          >
            Calcular {
              watch("gerar_cvld") ? "e Emitir CVLD" : ""
            }
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
