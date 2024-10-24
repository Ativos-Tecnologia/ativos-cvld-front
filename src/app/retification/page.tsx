"use client";
import CustomCheckbox from "@/components/CrmUi/Checkbox";
import UnloggedHeader from "@/components/Header/UnloggedHeader";
import { ShadSelect } from "@/components/ShadSelect";
import { SelectItem } from "@/components/ui/select";
import backendNumberFormat from "@/functions/formaters/backendNumberFormat";
import numberFormat from "@/functions/formaters/numberFormat";
import api from "@/utils/api";
import Cleave from "cleave.js/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import ReactInputMask from "react-input-mask";
import { toast } from "sonner";

interface IRecalculateTRF1 {
  natureza: string;
  data_requisicao: string;
  data_base: string;
  valor_principal: number;
  valor_juros: number;
  valor_juros_compensatorio: number;
  encargo_legal: number;
  incidencia_juros_moratorios: boolean;
  incidencia_pss: boolean;
  valor_pss: number;
  incidencia_rra_ir: boolean;
  ir_incidente_rra: boolean;
  numero_de_meses: number;
}

const RecalculateTrf1 = () => {
  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IRecalculateTRF1>({
    defaultValues: {
      natureza: "NÃO TRIBUTÁRIA",
      data_requisicao: "",
      data_base: "",
      valor_principal: 0,
      valor_juros: 0,
      valor_juros_compensatorio: 0,
      encargo_legal: 0,
      incidencia_juros_moratorios: true,
      incidencia_pss: false,
      valor_pss: 0,
      incidencia_rra_ir: false,
      ir_incidente_rra: false,
      numero_de_meses: 0,
    },
  });
  const [totalValue, setTotalValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [backendData, setBackendData] = useState<any>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  const valuesFormater = (value: string | number) => {
    if (typeof value === "string") {
      return parseFloat(
        value.replace("R$ ", "").replaceAll(".", "").replaceAll(",", "."),
      );
    } else {
      return value;
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    data.valor_principal =
      valuesFormater(data.valor_principal) + valuesFormater(data.encargo_legal);
    data.valor_principal = data.valor_principal.toFixed(2);

    data.valor_juros =
      valuesFormater(data.valor_juros) +
      valuesFormater(data.valor_juros_compensatorio);
    data.valor_juros = data.valor_juros.toFixed(2);

    if (valuesFormater(data.valor_pss) > 0) {
      data.incidencia_pss = true;
    }

    if (valuesFormater(data.numero_de_meses) > 0) {
      data.ir_incidente_rra = true;
    }

    data.valor_pss = backendNumberFormat(data.valor_pss) || 0;

    if (data.data_base > "2021-12-01") {
      data.incidencia_juros_moratorios = false;
    }

    // faz requisição para o backend
    try {
      const response = await api.post("/api/recalculate-trf1/", data);

      if (response.status === 200) {
        setBackendData(response.data.result);
        setShowResults(true);
      } else {
        toast.error("Houve um erro ao gerar o cálculo.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const total =
      valuesFormater(watch("valor_principal")) +
      valuesFormater(watch("valor_juros")) +
      valuesFormater(watch("valor_juros_compensatorio")) +
      valuesFormater(watch("encargo_legal"));

    setTotalValue(total);
  }, [
    watch("valor_principal"),
    watch("valor_juros"),
    watch("valor_juros_compensatorio"),
    watch("encargo_legal"),
  ]);

  return (
    <>
      <UnloggedHeader
        theme="light" //tema do header
        logoPath="/images/logo/celer-app-logo-text-black.svg" //logo do header
      />

      {/* image-wrapper */}
      <div className="relative">
        <Image
          src="/images/TRF1.png"
          alt="imagem do tribunal regional 1"
          className="max-h-[500px] w-full"
          width={1920}
          height={500}
          quality={100}
        />
        <div className="absolute inset-0 flex flex-col bg-[linear-gradient(to_top,rgba(229,231,235,1)_1%,transparent_99%)]">
          <div className="mx-auto w-230">
            <h1 className="block translate-x-25 animate-fade-right pt-44 text-6xl font-bold text-[#222] opacity-0">
              Retificação de <br /> Valor Disponível <br /> Nos TRFs 1 e 6
            </h1>
          </div>
        </div>
      </div>
      {/* end image-wrapper */}

      <div className="min-h-screen w-full bg-gray-200 py-10">
        <div className="mx-auto max-w-230">
          <div className="item-center mb-5 flex gap-12">
            <div className="flex flex-col gap-2 text-black-2">
              <p className="text-lg font-bold">Nº 2024.0000.000.000000</p>
              <div className="flex items-center gap-2 text-sm">
                <span>Status: </span>
                <span>5 - Requisição Cadastrado Concluído</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>Tipo de Requisição: </span>
                <span>Geral</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <label htmlFor="natureza" className="text-sm">
                  Natureza:
                </label>

                <ShadSelect
                  name="natureza"
                  control={control}
                  defaultValue={"NÃO TRIBUTÁRIA"}
                  className="h-7 w-40 border-transparent bg-transparent py-1 text-slate-700 hover:border-gray-700 hover:bg-slate-500 hover:text-slate-50 focus:border-slate-600 focus:bg-slate-600 focus:text-slate-50 active:bg-slate-600"
                >
                  <SelectItem
                    defaultValue="NÃO TRIBUTÁRIA"
                    value="NÃO TRIBUTÁRIA"
                  >
                    Não Tributária
                  </SelectItem>
                  <SelectItem value="TRIBUTÁRIA">Tributária</SelectItem>
                </ShadSelect>
              </div>
              <div className="flex items-center text-sm ">
                <span>Data de Cadastro da Req: </span>
                <Controller
                  name="data_requisicao"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Campo obrigatório",
                  }}
                  render={({ field: { onChange, value, ...field } }) => (
                    <ReactInputMask
                      {...field}
                      mask="99/99/9999"
                      placeholder="dd/mm/yyyy"
                      className={`${errors.data_requisicao && "border-red"} ml-2 w-22 border-none border-slate-600 bg-slate-300 bg-transparent p-1 text-center text-xs text-slate-700 placeholder:text-sm focus-within:ring-0 hover:border-gray-700 hover:bg-slate-300  focus:border-slate-800 focus:bg-slate-300 active:bg-slate-300 `}
                      onBlur={(e) => {
                        const inputValue = e.target.value;

                        // Verifica se o valor tem o formato esperado (dd/mm/yyyy)
                        if (/^\d{2}\/\d{2}\/\d{4}$/.test(inputValue)) {
                          const [day, month, year] = inputValue.split("/");

                          // Converte para o formato yyyy-mm-dd
                          const formattedValue = `${year}-${month}-${day}`;

                          // Atualiza o valor apenas se for diferente do atual
                          if (formattedValue !== value) {
                            onChange(formattedValue);
                          }
                        } else {
                          // Atualiza com o valor original
                          onChange(inputValue);
                        }
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid place-items-center text-center">
              <Image
                src={"/images/poder_judiciario.webp"}
                alt={"símbolo do poder judiciário"}
                width={200}
                height={200}
              />
              <div className="mt-4 flex flex-col gap-px text-black-2">
                <p className="text-sm uppercase">poder judiciário</p>
                <p className="text-sm uppercase">
                  tribunal regional federal 1ª região
                </p>
                <h2 className="font-medium underline">
                  Requisição de Pagamento
                </h2>
                <p className="text-sm font-medium">Precatório</p>
              </div>
            </div>
          </div>

          <h3 className="text-center font-medium text-black-2 underline">
            BENEFICIÁRIO(S)
          </h3>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto mt-4 max-w-[850px]"
          >
            <div className="border border-slate-600">
              <p className="border-b border-slate-600 py-1 text-center font-medium uppercase">
                beneficiário principal
              </p>

              {/* headers info */}
              <div className="grid grid-cols-10 border-b border-slate-600 font-medium text-black-2">
                <div className="col-span-4 flex items-center justify-center py-[2px] text-xs uppercase">
                  Nome completo
                </div>
                <div className="col-span-2 flex items-center justify-center py-[2px] text-xs uppercase">
                  cpf/cnpj
                </div>
                <div className="col-span-2 flex items-center justify-center py-[2px] text-xs uppercase">
                  situação
                </div>
                <div className="col-span-1 flex items-center justify-center py-[2px] text-center text-xs uppercase">
                  expressa renúncia
                </div>
                <div className="col-span-1 flex items-center justify-center py-[2px] text-xs uppercase">
                  data base
                </div>
              </div>
              {/* end headers info */}

              {/* data */}
              <div className="grid h-12 grid-cols-10 border-b border-slate-600">
                <div className="col-span-4 flex items-center justify-center border-r  border-slate-600 bg-slate-300 py-[2px]  text-xs  uppercase  text-slate-700 hover:border-gray-700 hover:bg-slate-500 hover:text-slate-50 focus:border-slate-800 focus:bg-slate-600 active:bg-slate-600">
                  Nome do Credor
                </div>
                <div className="col-span-2 flex items-center justify-center border-r  border-slate-600 bg-slate-300 py-[2px]    text-xs  uppercase  text-slate-700 hover:border-gray-700 hover:bg-slate-500 hover:text-slate-50 focus:border-slate-800 focus:bg-slate-600 active:bg-slate-600">
                  000.000.000-00
                </div>
                <div className="col-span-2 flex items-center justify-center border-r  border-slate-600 bg-slate-300   py-[2px]   text-xs  uppercase text-slate-700 hover:border-gray-700 hover:bg-slate-500 hover:text-slate-50 focus:border-slate-800 focus:bg-slate-600 active:bg-slate-600">
                  regular
                </div>
                <div className="col-span-1 flex items-center justify-center border-r  border-slate-600 bg-slate-300 py-[2px]   text-center   text-xs uppercase  text-slate-700 hover:border-gray-700 hover:bg-slate-500 hover:text-slate-50 focus:border-slate-800 focus:bg-slate-600 active:bg-slate-600">
                  não
                </div>
                <div className="col-span-1 flex items-center justify-center border-slate-600 bg-slate-300 p-[3px] text-center text-xs uppercase text-slate-700 hover:border-gray-700 hover:bg-slate-300 focus:border-slate-800 focus:bg-slate-300 active:bg-slate-300 ">
                  <Controller
                    name="data_base"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Campo obrigatório",
                    }}
                    render={({ field: { onChange, value, ...field } }) => (
                      <ReactInputMask
                        {...field}
                        mask="99/99/9999"
                        placeholder="dd/mm/yyyy"
                        className={`${errors.data_base && "border-red"} my-auto h-fit w-full border-none bg-transparent p-1 text-center text-xs  placeholder:text-xs focus-within:border-none focus-visible:border-none`}
                        onBlur={(e) => {
                          const inputValue = e.target.value;

                          // Verifica se o valor tem o formato esperado (dd/mm/yyyy)
                          if (/^\d{2}\/\d{2}\/\d{4}$/.test(inputValue)) {
                            const [day, month, year] = inputValue.split("/");

                            // Converte para o formato yyyy-mm-dd
                            const formattedValue = `${year}-${month}-${day}`;

                            // Atualiza o valor apenas se for diferente do atual
                            if (formattedValue !== value) {
                              onChange(formattedValue);
                            }
                          } else {
                            // Atualiza com o valor original
                            onChange(inputValue);
                          }
                        }}
                      />
                    )}
                  />
                </div>
              </div>
              {/* end data */}

              {watch("data_base") < "2021-12-01" ? (
                <>
                  {/* warning */}
                  <div className="flex h-15 flex-col justify-center border-b border-slate-600">
                    <p className="text-center text-sm font-medium uppercase text-red-500">
                      observação: Para precatórios cuja data base seja anterior
                      a Dezembro de 2021, não haverá divergência de cálculo.
                    </p>
                  </div>
                  {/* end warning */}
                </>
              ) : null}

              {/* headers valores */}
              <div className="grid h-9 grid-cols-8 border-b border-slate-600 font-medium text-black-2">
                <div className="col-span-2 flex items-center justify-center py-[2px] text-xs uppercase">
                  principal (R$)
                </div>
                <div className="col-span-2 flex items-center justify-center py-[2px] text-xs uppercase">
                  juros/selic (R$)
                </div>
                <div className="col-span-2 flex items-center justify-center py-[2px] text-xs uppercase">
                  juros compensatório (R$)
                </div>
                <div className="col-span-2 flex items-center justify-center py-[2px] text-center text-xs uppercase">
                  encargo legal (R$)
                </div>
              </div>
              {/* end headers valores */}

              {/* data valores */}
              <div className="grid h-9 grid-cols-8 border-b border-slate-600">
                <div className="hover:border-gray-600 col-span-2 flex items-center justify-center border-r border-slate-600 bg-slate-300 py-[2px] text-xs uppercase text-slate-700 hover:bg-slate-500 hover:text-slate-50 focus:border-slate-800 focus:bg-slate-600 active:bg-slate-600">
                  <Controller
                    name="valor_principal"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <Cleave
                        {...field}
                        className="border-none bg-transparent py-0 text-xs placeholder:text-xs focus-within:ring-0"
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
                <div className="col-span-2 flex items-center justify-center border-r border-slate-600 bg-slate-300 py-[2px] text-xs uppercase text-slate-700 hover:border-gray-700 hover:bg-slate-500 hover:text-slate-50 focus:border-slate-800 focus:bg-slate-600 active:bg-slate-600">
                  <Controller
                    name="valor_juros"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <Cleave
                        {...field}
                        className="border-none bg-transparent py-0 text-xs placeholder:text-xs focus-within:ring-0"
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
                <div className="col-span-2 flex items-center justify-center border-r border-slate-600 bg-slate-300 py-[2px] text-xs uppercase text-slate-700 hover:border-gray-700 hover:bg-slate-500 hover:text-slate-50 focus:border-slate-800 focus:bg-slate-600 active:bg-slate-600">
                  <Controller
                    name="valor_juros_compensatorio"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <Cleave
                        {...field}
                        className="border-none bg-transparent py-0 text-xs placeholder:text-xs focus-within:ring-0"
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
                <div className="col-span-2 flex items-center justify-center border-r border-slate-600 bg-slate-300 py-[2px] text-xs uppercase text-slate-700 hover:border-gray-700 hover:bg-slate-500 hover:text-slate-50 focus:border-slate-800 focus:bg-slate-600 active:bg-slate-600 ">
                  <Controller
                    name="encargo_legal"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <Cleave
                        {...field}
                        className="border-none bg-transparent py-0 text-xs placeholder:text-xs focus-within:ring-0"
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
              </div>
              {/* end data valores */}

              {watch("data_base") < "2021-12-01" ? (
                <div
                  className={`col-span-2 flex h-9 items-center gap-1 border-b border-slate-600`}
                >
                  <CustomCheckbox
                    check={watch("incidencia_juros_moratorios")}
                    id={"incidencia_juros_moratorios"}
                    defaultChecked
                    register={register("incidencia_juros_moratorios")}
                  />

                  <label
                    htmlFor="incidencia_juros_moratorios"
                    className="text-xs font-medium uppercase text-black-2 "
                  >
                    Juros de Mora fixados em sentença
                  </label>
                </div>
              ) : null}

              <div
                className={`col-span-2 flex h-9 items-center gap-1 border-b  border-slate-600 bg-slate-300 py-[2px] text-xs uppercase text-slate-700`}
              >
                <label
                  htmlFor="valor_pss"
                  className="ml-2 text-xs font-medium uppercase text-black-2"
                >
                  Valor PSS:
                </label>

                <Controller
                  name="valor_pss"
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <Cleave
                      {...field}
                      className="border-none bg-transparent py-0 text-xs placeholder:text-xs focus-within:ring-0"
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

              <div className="flex h-8 items-center justify-center gap-2">
                <span className="text-sm font-medium uppercase text-black-2">
                  valor total:
                </span>
                <span>{numberFormat(totalValue)}</span>
              </div>
            </div>

            <div className={`my-10 flex gap-2 2xsm:col-span-2 sm:col-span-1`}>
              <CustomCheckbox
                check={watch("incidencia_rra_ir")}
                id={"incidencia_rra_ir"}
                register={register("incidencia_rra_ir")}
              />

              <label
                htmlFor="incidencia_rra_ir"
                className="mt-1 font-nexa text-xs font-medium uppercase text-black-2"
              >
                Possui IR/RRA?
              </label>
            </div>

            {watch("incidencia_rra_ir") && (
              <div className="grid text-sm">
                <p className="mb-2 border border-slate-600 bg-gray-300 py-1 text-center text-sm font-medium text-black-2">
                  Indicação da Apuração e Tributação de Rendimentos Recebidos
                  Acumuladamente - RRA
                </p>
                <div className="ml-1 flex items-center gap-2">
                  <span className="text-black-2">
                    Valor Total do Beneficiário:
                  </span>
                  <span>{numberFormat(totalValue)}</span>
                </div>
                <div className="ml-1 flex items-center gap-2">
                  <span className="text-black-2">
                    Quantidade de Parcelas dos Exercícios Anteriores:
                  </span>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    id="numero_de_meses"
                    {...register("numero_de_meses", {
                      required: "Campo obrigatório",
                      setValueAs: (value) => {
                        return parseInt(value);
                      },
                    })}
                    className="w-15 border-none bg-slate-300 bg-transparent px-1 py-0 text-sm placeholder:text-sm focus-within:ring-0 hover:border-none hover:bg-slate-600 hover:text-white focus:text-slate-50"
                  />
                </div>
              </div>
            )}
            {/* calculate button */}
            <button
              type="submit"
              className="mb-8 mt-10 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-700 px-8 py-3 text-sm text-white transition-all duration-200 hover:bg-blue-800 focus:z-0"
            >
              <span className="text-[16px] font-medium" aria-disabled={loading}>
                {loading ? "Calculando valores..." : "Calcular"}
              </span>
              {loading && (
                <AiOutlineLoading className="ml-2 mt-[0.2rem] h-4 w-4 animate-spin" />
              )}
            </button>
            {/* end calculate button */}
          </form>

          {showResults && (
            <div className="mx-auto flex max-w-[850px] animate-fade-up flex-col gap-2 opacity-0">
              <div className="mb-8 h-px border-t border-dashed border-slate-400"></div>

              <div className="border border-slate-600">
                <h2 className="border-b border-slate-600 bg-gray-300 py-1 text-center text-sm font-medium text-black-2">
                  Diferença Entre Valores Líquidos Disponíveis
                </h2>
                <div className="flex h-8 border-b border-slate-600">
                  <span className="flex h-full flex-1 items-center border-r border-slate-600 px-2 text-xs font-medium uppercase text-black-2">
                    Valor líquido correto
                  </span>
                  <span className="flex h-full basis-39 items-center justify-end px-4 text-sm">
                    {numberFormat(backendData[0].valor_liquido_disponivel)}
                  </span>
                </div>
                <div className="flex h-8 border-b border-slate-600">
                  <span className="flex h-full flex-1 items-center border-r border-slate-600 px-2 text-xs font-medium uppercase text-black-2">
                    Valor líquido ilegal
                  </span>
                  <span className="flex h-full basis-39 items-center justify-end px-4 text-sm">
                    {numberFormat(backendData[1].valor_liquido_disponivel)}
                  </span>
                </div>
                <div className="flex h-8">
                  <span className="flex h-full flex-1 items-center border-r border-slate-600 px-2 text-xs font-medium uppercase text-black-2">
                    Diferença a ser reajustada
                  </span>
                  <span className="flex h-full basis-39 items-center justify-end px-4 text-sm">
                    {numberFormat(
                      backendData[0].valor_liquido_disponivel -
                        backendData[1].valor_liquido_disponivel,
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecalculateTrf1;
