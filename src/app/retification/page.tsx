"use client"
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
        formState: {
            errors
        }
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
            numero_de_meses: 0
        }
    });
    const [totalValue, setTotalValue] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [backendData, setBackendData] = useState<any>([]);
    const [showResults, setShowResults] = useState<boolean>(false);

    const valuesFormater = (value: string | number) => {
        if (typeof value === 'string') {
            return parseFloat(
                value.replace("R$ ", "").replaceAll(".", "").replaceAll(",", ".")
            )
        } else {
            return value;
        }
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        data.valor_principal = valuesFormater(data.valor_principal) + valuesFormater(data.encargo_legal);
        data.valor_principal = data.valor_principal.toFixed(2);

        data.valor_juros = valuesFormater(data.valor_juros) + valuesFormater(data.valor_juros_compensatorio);
        data.valor_juros = data.valor_juros.toFixed(2);

        if (valuesFormater(data.valor_pss) > 0) {
            data.incidencia_pss = true;
        }

        if (valuesFormater(data.numero_de_meses) > 0) {
            data.ir_incidente_rra = true;
        }

        data.valor_pss = backendNumberFormat(data.valor_pss) || 0;

        if (data.data_base > "2021-12-01") {
            data.incidencia_juros_moratorios = false
        }

        // faz requisição para o backend
        try {

            const response = await api.post("/api/recalculate-trf1/", data);

            if (response.status === 200) {
                console.log(response.data);
                setBackendData(response.data.result);
                setShowResults(true);
            } else {
                toast.error("Houve um erro ao gerar o cálculo.")
            }

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const total = valuesFormater(watch("valor_principal")) + valuesFormater(watch("valor_juros")) + valuesFormater(watch("valor_juros_compensatorio")) + valuesFormater(watch("encargo_legal"));

        setTotalValue(total)

    }, [
        watch("valor_principal"),
        watch("valor_juros"),
        watch("valor_juros_compensatorio"),
        watch("encargo_legal")
    ]);

    return (
        <>
            <UnloggedHeader
                logoPath="/images/logo/celer-app-logo-text-black.svg"
            />

            {/* image-wrapper */}
            <div className="relative">
                <Image
                    src="/images/TRF1.jpg"
                    alt="imagem do tribunal regional 1"
                    className="w-full max-h-[500px]"
                    width={1920}
                    height={500}
                    quality={100}
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(229,231,235,1)_1%,transparent_99%)] flex flex-col">
                    <div className="w-230 mx-auto">
                        <h1 className="block text-6xl font-bold pt-44 opacity-0 translate-x-25 animate-fade-right text-[#222]">
                            Retificação de <br /> Valor Disponível <br /> Nos TRFs 1 e 6
                        </h1>
                    </div>
                </div>
            </div>
            {/* end image-wrapper */}

            <div className="w-full min-h-screen py-10 bg-gray-200">
                <div className="mx-auto max-w-230">
                    <div className="flex item-center gap-12 mb-5">
                        <div className="flex flex-col gap-2 text-black-2">
                            <p className="font-bold text-lg">Nº 2024.0000.000.000000</p>
                            <div className="flex items-center text-sm gap-2">
                                <span>Status: </span>
                                <span>5 - Requisição Cadastrado Concluído</span>
                            </div>
                            <div className="flex items-center text-sm gap-2">
                                <span>Tipo de Requisição: </span>
                                <span>Geral</span>
                            </div>
                            <div className="flex items-center text-sm gap-2">
                                <label
                                    htmlFor="natureza"
                                    className="text-sm"
                                >
                                    Natureza:
                                </label>

                                <ShadSelect
                                    name="natureza"
                                    control={control}
                                    defaultValue={"NÃO TRIBUTÁRIA"}
                                    className="border-transparent bg-transparent w-40 py-1 h-7"
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
                            <div className="flex items-center text-sm">
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
                                            className={`${errors.data_requisicao && "border-red"} p-1 w-22 ml-2 border-none bg-transparent focus-within:ring-0 placeholder:text-sm`}
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
                            <div className="flex flex-col gap-px mt-4 text-black-2">
                                <p className="uppercase text-sm">poder judiciário</p>
                                <p className="uppercase text-sm">tribunal regional federal 1ª região</p>
                                <h2 className="underline font-medium">Requisição de Pagamento</h2>
                                <p className="font-medium text-sm">Precatório</p>
                            </div>
                        </div>

                    </div>

                    <h3 className="text-center font-medium underline text-black-2">BENEFICIÁRIO(S)</h3>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-4 max-w-[850px] mx-auto">
                        <div className="border border-slate-600">
                            <p className="uppercase font-medium text-center py-1 border-b border-slate-600">beneficiário principal</p>

                            {/* headers info */}
                            <div className="grid grid-cols-10 border-b border-slate-600 font-medium text-black-2">
                                <div className="uppercase flex items-center justify-center py-[2px] text-xs col-span-4">Nome completo</div>
                                <div className="uppercase flex items-center justify-center py-[2px] text-xs col-span-2">cpf/cnpj</div>
                                <div className="uppercase flex items-center justify-center py-[2px] text-xs col-span-2">situação</div>
                                <div className="uppercase flex items-center justify-center text-center py-[2px] text-xs col-span-1">expressa renúncia</div>
                                <div className="uppercase flex items-center justify-center py-[2px] text-xs col-span-1">data base</div>
                            </div>
                            {/* end headers info */}

                            {/* data */}
                            <div className="grid grid-cols-10 border-b border-slate-600 h-12">
                                <div className="uppercase flex items-center justify-center py-[2px] text-xs col-span-4 border-r border-slate-600">Alexandre Dias Silva Cavalvanti</div>
                                <div className="uppercase flex items-center justify-center py-[2px] text-xs col-span-2 border-r border-slate-600">123.456.789-00</div>
                                <div className="uppercase flex items-center justify-center py-[2px] text-xs col-span-2 border-r border-slate-600">regular</div>
                                <div className="uppercase flex items-center justify-center text-center py-[2px] text-xs col-span-1 border-r border-slate-600">não</div>
                                <div className="uppercase flex items-center justify-center text-center p-[3px] text-xs col-span-1 ">
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
                                                className={`${errors.data_base && "border-red"} p-1 h-fit border-none w-full my-auto bg-transparent  focus-visible:border-none focus-within:border-none text-xs text-center placeholder:text-xs`}
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
                                    <div className="h-15 border-b border-slate-600 flex flex-col justify-center">
                                        <p className="uppercase text-red-500 font-medium text-center text-sm">
                                            observação: Para precatórios cuja data base seja anterior a Dezembro de 2021, não haverá divergência de cálculo.
                                        </p>
                                    </div>
                                    {/* end warning */}
                                </>
                            ) : null}

                            {/* headers valores */}
                            <div className="grid grid-cols-8 border-b border-slate-600 font-medium text-black-2 h-9">
                                <div className="uppercase flex items-center justify-center py-[2px] text-xs col-span-2">principal (R$)</div>
                                <div className="uppercase flex items-center justify-center py-[2px] text-xs col-span-2">juros/selic (R$)</div>
                                <div className="uppercase flex items-center justify-center py-[2px] text-xs col-span-2">juros compensatório (R$)</div>
                                <div className="uppercase flex items-center justify-center text-center py-[2px] text-xs col-span-2">encargo legal (R$)</div>
                            </div>
                            {/* end headers valores */}

                            {/* data valores */}
                            <div className="grid grid-cols-8 border-b border-slate-600 h-9">
                                <div
                                    className="uppercase flex items-center justify-center py-[2px] text-xs col-span-2 border-r border-slate-600">
                                    <Controller
                                        name="valor_principal"
                                        control={control}
                                        defaultValue={0}
                                        render={({ field }) => (
                                            <Cleave
                                                {...field}
                                                className="bg-transparent border-none py-0 focus-within:ring-0 text-xs placeholder:text-xs"
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
                                <div
                                    className="uppercase flex items-center justify-center py-[2px] text-xs col-span-2 border-r border-slate-600">
                                    <Controller
                                        name="valor_juros"
                                        control={control}
                                        defaultValue={0}
                                        render={({ field }) => (
                                            <Cleave
                                                {...field}
                                                className="bg-transparent border-none py-0 focus-within:ring-0 text-xs placeholder:text-xs"
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
                                <div
                                    className="uppercase flex items-center justify-center py-[2px] text-xs col-span-2 border-r border-slate-600">
                                    <Controller
                                        name="valor_juros_compensatorio"
                                        control={control}
                                        defaultValue={0}
                                        render={({ field }) => (
                                            <Cleave
                                                {...field}
                                                className="bg-transparent border-none py-0 focus-within:ring-0 text-xs placeholder:text-xs"
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
                                <div
                                    className="uppercase flex items-center justify-center text-center py-[2px] text-xs col-span-2 ">
                                    <Controller
                                        name="encargo_legal"
                                        control={control}
                                        defaultValue={0}
                                        render={({ field }) => (
                                            <Cleave
                                                {...field}
                                                className="bg-transparent border-none py-0 focus-within:ring-0 text-xs placeholder:text-xs"
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
                                <div className={`flex items-center gap-1 col-span-2 h-9 border-b border-slate-600`}>

                                    <CustomCheckbox
                                        check={watch("incidencia_juros_moratorios")}
                                        id={'incidencia_juros_moratorios'}
                                        defaultChecked
                                        register={register("incidencia_juros_moratorios")}
                                    />

                                    <label
                                        htmlFor="incidencia_juros_moratorios"
                                        className="text-xs font-medium uppercase text-black-2"
                                    >
                                        Juros de Mora fixados em sentença
                                    </label>
                                </div>
                            ) : null}

                            <div className={`flex items-center gap-1 col-span-2 h-9 border-b border-slate-600`}>

                                <label
                                    htmlFor="valor_pss"
                                    className="text-xs ml-2 font-medium uppercase text-black-2"
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
                                            className="bg-transparent border-none py-0 focus-within:ring-0 text-xs placeholder:text-xs"
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

                            <div className="flex items-center justify-center gap-2 h-8">
                                <span className="text-sm font-medium uppercase text-black-2">valor total:</span>
                                <span>{numberFormat(totalValue)}</span>
                            </div>
                        </div>

                        <div className={`flex gap-2 2xsm:col-span-2 sm:col-span-1 my-10`}>
                            <CustomCheckbox
                                check={watch("incidencia_rra_ir")}
                                id={'incidencia_rra_ir'}
                                register={register("incidencia_rra_ir")}
                            />

                            <label
                                htmlFor="incidencia_rra_ir"
                                className="mt-1 font-nexa text-xs font-medium uppercase text-black-2"
                            >
                                Possui RRA?
                            </label>
                        </div>

                        {watch("incidencia_rra_ir") && (
                            <div className="grid text-sm">
                                <p className="text-black-2 mb-2 py-1 text-center font-medium text-sm border border-slate-600 bg-gray-300">
                                    Indicação da Apuração e Tributação de Rendimentos Recebidos Acumuladamente - RRA
                                </p>
                                <div className="flex gap-2 items-center ml-1">
                                    <span className="text-black-2">Valor Total do Beneficiário:</span>
                                    <span>{numberFormat(totalValue)}</span>
                                </div>
                                <div className="flex gap-2 items-center ml-1">
                                    <span className="text-black-2">Quantidade de Parcelas dos Exercícios Anteriores:</span>
                                    <input
                                        type="number"
                                        min={0}
                                        placeholder="0"
                                        id="numero_de_meses"
                                        {...register("numero_de_meses",
                                            {
                                                required: "Campo obrigatório",
                                                setValueAs: (value) => {
                                                    return parseInt(value);
                                                },
                                            }
                                        )}
                                        className="bg-transparent border-none focus-within:ring-0 w-18 py-0 px-1 text-sm placeholder:text-sm"
                                    />
                                </div>
                            </div>
                        )}
                        {/* calculate button */}
                        <button
                            type="submit"
                            className="mb-8 mt-10 flex gap-2 cursor-pointer items-center justify-center rounded-lg bg-blue-700 px-8 py-3 text-sm text-white transition-all duration-200 hover:bg-blue-800 focus:z-0"
                        >
                            <span className="text-[16px] font-medium" aria-disabled={loading}>
                                {loading ? "Calculando valores..." : "Calcular"}
                            </span>
                            {loading && (<AiOutlineLoading className="ml-2 mt-[0.2rem] h-4 w-4 animate-spin" />)}
                        </button>
                        {/* end calculate button */}
                    </form>

                    {showResults && (
                        <div className="opacity-0 animate-fade-up flex flex-col gap-2 max-w-[850px] mx-auto">

                            <div className="h-px border-t border-slate-400 border-dashed mb-8"></div>

                            <div className="border border-slate-600">
                                <h2 className="text-black-2 py-1 text-center font-medium text-sm border-b border-slate-600 bg-gray-300">
                                    Diferença Entre Valores Líquidos Disponíveis
                                </h2>
                                <div className="flex h-8 border-b border-slate-600">
                                    <span className="uppercase font-medium flex items-center h-full flex-1 text-xs text-black-2 px-2 border-r border-slate-600">Valor líquido correto</span>
                                    <span className="px-4 text-sm flex items-center justify-end h-full basis-39">{numberFormat(backendData[0].valor_liquido_disponivel)}</span>
                                </div>
                                <div className="flex h-8 border-b border-slate-600">
                                    <span className="uppercase font-medium flex items-center h-full flex-1 text-xs text-black-2 px-2 border-r border-slate-600">Valor líquido ilegal</span>
                                    <span className="px-4 text-sm flex items-center justify-end h-full basis-39">{numberFormat(backendData[1].valor_liquido_disponivel)}</span>
                                </div>
                                <div className="flex h-8">
                                    <span className="uppercase font-medium flex items-center h-full flex-1 text-xs text-black-2 px-2 border-r border-slate-600">Diferença a ser reajustada</span>
                                    <span className="px-4 text-sm flex items-center justify-end h-full basis-39">{numberFormat(backendData[0].valor_liquido_disponivel - backendData[1].valor_liquido_disponivel)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default RecalculateTrf1;
