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
import UseMySwal from "@/hooks/useMySwal";
import Loader from "../common/Loader";
import { CVLDResultProps } from "../ResultCVLD";
import { Button } from "../Button";

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

  const [loading, setLoading] = useState<boolean>(false);


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


  const getOptions = (value: any) => {

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
    if (!value?.replace) {
      return "0.00";
    }

    return value.replace("R$ ", "").replaceAll(".", "").replaceAll(",", ".") || "0.00";
  }


  const onSubmit = async (data: any) => {
    data.valor_principal = backendNumberFormat(data.valor_principal) || 0;
    data.valor_juros = backendNumberFormat(data.valor_juros) || 0;
    data.valor_pss = backendNumberFormat(data.valor_pss) || 0;

    // let formattedData = data.data_base.split("-")
    // formattedData[2] = "01";
    // data.data_base = formattedData.join("-");

    // let formattedDataRequisicao = data.data_requisicao.split("-")
    // formattedDataRequisicao[2] = "01";
    // data.data_requisicao = formattedDataRequisicao.join("-");

    if (!data.data_limite_de_atualizacao_check) {
      data.data_limite_de_atualizacao = undefined;
    }
    // else {
    //   let formattedDataLimite = data.data_limite_de_atualizacao.split("-")
    //   formattedDataLimite[2] = "01";
    //   data.data_limite_de_atualizacao = formattedDataLimite.join("-");
    // }

    if (!data.ir_incidente_rra) {
      data.numero_de_meses = undefined;
    }

    if (!data.incidencia_pss) {
      data.valor_pss = undefined;
    }

    if (!data.upload_notion) {
      data.upload_notion = false;
    }

    if (!data.npu) {
      data.npu = "0000000-00.0000.0.00.0000";
    }

    // data.valor_representante = backendNumberFormat(data.valor_representante);
    // data.valor_cessionario = backendNumberFormat(data.valor_cessionario);
    setLoading(true);
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



    } else if (response.status === 400) {
      UseMySwal().fire({
        icon: "error",
        title: "Sessão expirada",
        text: "Sua sessão expirou, por favor faça login novamente",
      });
    } else {
      UseMySwal().fire({
        icon: "error",
        title: "Erro",
        text: "Ocorreu um erro ao tentar processar a requisição",
      });
    }
    setLoading(false);
  };





  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <span className="text-lg font-semibold text-primary">Calculadora de Atualização de Precatórios</span>
      </div>
      {
        loading ? (
          <Loader />
        ) : (
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




              <div className="flex gap-2 items-center">
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
                  <div className="flex gap-2 items-center">
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
                  </div>
                ) : (
                  <div className="flex items-center">
                    &nbsp;
                  </div>
                )
              }
              <div className="flex flex-col gap-2 items-start">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="data_limite_de_atualizacao_check"
                    className="rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                    {
                    ...register("data_limite_de_atualizacao_check")
                    }
                  />
                  <label htmlFor="data_limite_de_atualizacao_check" className="text-sm font-medium text-meta-5 mb-1">
                    Atualizar para data passada?
                  </label>
                </div>


              </div>
              {
                watch("data_limite_de_atualizacao_check") ? (
                  <div className="flex flex-col justify-between">
                    <label htmlFor="data_limite_de_atualizacao" className="text-sm font-medium text-meta-5">
                      Atualizado até:
                    </label>
                    <input
                      type="date"
                      id="data_limite_de_atualizacao"
                      className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                      {
                      ...register("data_limite_de_atualizacao", {
                      })
                      } min={watch("data_requisicao")}
                      max={new Date().toISOString().split("T")[0]}


                    />
                    {
                      watch("data_limite_de_atualizacao") < watch("data_requisicao") ? (
                        <span role="alert" className="absolute right-4 top-4 text-red-500 text-sm">
                          Data de atualização deve ser maior que a data de requisição
                        </span>
                      ) : null
                    }
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
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-4">
                          <span className="text-lg font-semibold text-primary mt-8">Dados do Colaborador</span>
                          &nbsp;
                          <div className="flex flex-col gap-2">
                            <label htmlFor="nome_funcionario" className="text-sm font-medium text-meta-5">
                              Nome
                            </label>
                            <input
                              type="text"
                              id="nome_funcionario"
                              className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("nome_funcionario", {})} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="matricula" className="text-sm font-medium text-meta-5">
                              Matrícula
                            </label>
                            <input
                              type="text"
                              id="matricula"
                              className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("matricula", {})} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="cargo" className="text-sm font-medium text-meta-5">
                              Cargo
                            </label>
                            <input
                              type="text"
                              id="cargo"
                              className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("cargo", {})} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="und_administrativa" className="text-sm font-medium text-meta-5">
                              Unidade Administrativa
                            </label>
                            <input
                              type="text"
                              id="und_administrativa"
                              className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("und_administrativa", {})} />
                          </div>
                          <div className="flex flex-col gap-2 sm:col-span-2 mt-4">
                            <div className="flex gap-2 ">
                              <input
                                type="checkbox"
                                id="possui_subscritor"
                                className="rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                {...register("possui_subscritor")}
                              />
                              <label htmlFor="possui_subscritor" className="text-sm font-medium text-meta-5">
                                Suscritor, se houver
                              </label>
                            </div>
                          </div>
                          {
                            watch("possui_subscritor") === true ? (
                              <>
                                <span className="text-lg font-semibold text-primary">Dados do Funcionário Subscritor</span>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-4"></div>

                                <div className="flex flex-col">
                                  <label htmlFor="nome_funcionario_subscritor" className="text-sm font-medium text-meta-5">
                                    Nome
                                  </label>
                                  <input
                                    type="text"
                                    id="nome_funcionario_subscritor"
                                    className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                    {...register("nome_funcionario_subscritor", {})} />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label htmlFor="matricula_funcionario_subscritor" className="text-sm font-medium text-meta-5">
                                    Matrícula
                                  </label>
                                  <input
                                    type="text"
                                    id="matricula_funcionario_subscritor"
                                    className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                    {...register("matricula_funcionario_subscritor", {})} />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label htmlFor="cargo_funcionario_subscritor" className="text-sm font-medium text-meta-5">
                                    Cargo
                                  </label>
                                  <input
                                    type="text"
                                    id="cargo_funcionario_subscritor"
                                    className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                    {...register("cargo_funcionario_subscritor", {})} />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label htmlFor="und_administrativa_funcionario_subscritor" className="text-sm font-medium text-meta-5">
                                    Unidade Administrativa
                                  </label>
                                  <input
                                    type="text"
                                    id="und_administrativa_funcionario_subscritor"
                                    className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                    {...register("und_administrativa_funcionario_subscritor", {})} />
                                </div>
                              </>
                            ) : null
                          }
                          <hr className="border border-stroke dark:border-strokedark my-8 sm:col-span-2" />



                          <span className="text-lg font-semibold text-primary">Dados do Principal</span>
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-4"></div>

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
                            </>
                          ) : null}
                          <hr className="border border-stroke dark:border-strokedark my-8 sm:col-span-2" />
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
                          <hr className="border border-stroke dark:border-strokedark my-8 sm:col-span-2" />

                          <span className="text-lg font-semibold text-primary">Dados do Processo</span>
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-4"></div>

                          <div className="flex flex-col gap-2">
                            <label htmlFor="processo_origem" className="text-sm font-medium text-meta-5">
                              Processo de Origem
                            </label>
                            <Controller
                              name="processo_origem"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <Cleave
                                  {...field}
                                  className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                  options={{
                                    blocks: [7, 2, 4, 1, 2, 4],
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
                            <Controller
                              name="npu"
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <Cleave
                                  {...field}
                                  className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                  options={{
                                    blocks: [7, 2, 4, 1, 2, 4],
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
                          <div className="flex flex-col gap-2">
                            <label htmlFor="n_precatorio" className="text-sm font-medium text-meta-5">
                              Número do Precatório
                            </label>
                            <input
                              type="text"
                              id="n_precatorio"
                              className="w-full rounded-sm border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("n_precatorio", {})} />
                          </div>

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
                  isUserAdmin() && watch("gerar_cvld") ? (
                    <><hr className="border border-stroke dark:border-strokedark my-8 col-span-2" /><div className="flex flex-col gap-2">
                      <span className="text-lg font-semibold text-primary mb-4">Opções de Administrador 🛡️</span>
                      <div className="flex flex-col gap-2 sm:col-span-2">
                        <div className="flex gap-2">
                          <input type="checkbox"
                            id="upload_notion"
                            defaultChecked={false}
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
                              <option value="notion_prec_prospect_partners_db_id">Parceiro - Distribuição</option>
                              <option value="notion_prec_prospect_partners_brito_e_pimentel_db_id">Parceiro - Brito E Pimentel</option>
                              <option value="notion_prec_prospect_partners_marcela_vasconcelos_db_id">Parceiro - Marcela Vasconcelos</option>
                              <option value="notion_prec_prospect_partners_antecippe_db_id">Parceiro - Antecippe</option>
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
              {/* <button
            type="submit"
            className="px-12 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-dark my-8"
          >
            Calcular {
              watch("gerar_cvld") ? "e Emitir CVLD" : ""
            }
          </button> */}
              <Button type="submit" className="px-12 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-dark">
                Calcular {
                  watch("gerar_cvld") ? "e Emitir CVLD" : ""
                }
              </Button>
            </div>
          </form>
        )
      }
      <hr className="border border-stroke dark:border-strokedark my-8" />

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
