'use client'
import CustomCheckbox from "@/components/CrmUi/Checkbox";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage";
import UnloggedLayout from "@/components/Layouts/UnloggedLayout";
import { ShadSelect } from "@/components/ShadSelect";
import { SelectItem } from "@/components/ui/select";
import { ENUM_TIPO_OFICIOS_LIST } from "@/constants/constants";
import tipoOficio from "@/enums/tipoOficio.enum";
import backendNumberFormat from "@/functions/formaters/backendNumberFormat";
import api from "@/utils/api";
import Cleave from "cleave.js/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";

interface IProposalFormStateProps {
    tipo_do_oficio: string,
    natureza: string,
    esfera: string,
    tribunal: string,
    valor_principal: number,
    valor_juros: number,
    data_base: string,
    data_requisicao: string,
    incidencia_juros_moratorios: boolean,
    nao_incide_selic_no_periodo_db_ate_abril: boolean,
    incidencia_rra_ir: boolean,
    ir_incidente_rra: boolean,
    numero_de_meses: number,
    incidencia_pss: boolean,
    valor_pss: number,
    ja_possui_destacamento: boolean,
    percentual_de_honorarios: number,
    percentual_a_ser_adquirido: number
}

const tribunais = [
    { id: "TRF1", nome: "Tribunal Regional Federal - 1ª Região" },
    { id: "TRF2", nome: "Tribunal Regional Federal - 2ª Região" },
    { id: "TRF3", nome: "Tribunal Regional Federal - 3ª Região" },
    { id: "TRF4", nome: "Tribunal Regional Federal - 4ª Região" },
    { id: "TRF5", nome: "Tribunal Regional Federal - 5ª Região" },
    { id: "TRF6", nome: "Tribunal Regional Federal - 6ª Região" },
    { id: "STF", nome: "Supremo Tribunal Federal" },
    { id: "STJ", nome: "Superior Tribunal de Justiça" },
    { id: "TST", nome: "Tribunal Superior do Trabalho" },
    { id: "TSE", nome: "Tribunal Superior Eleitoral" },
    { id: "STM", nome: "Superior Tribunal Militar" },
    { id: "TJAC", nome: "Tribunal de Justiça do Acre" },
    { id: "TJAL", nome: "Tribunal de Justiça de Alagoas" },
    { id: "TJAP", nome: "Tribunal de Justiça do Amapá" },
    { id: "TJAM", nome: "Tribunal de Justiça do Amazonas" },
    { id: "TJBA", nome: "Tribunal de Justiça da Bahia" },
    { id: "TJCE", nome: "Tribunal de Justiça do Ceará" },
    { id: "TJDFT", nome: "Tribunal de Justiça do Distrito Federal e dos Territórios" },
    { id: "TJES", nome: "Tribunal de Justiça do Espírito Santo" },
    { id: "TJGO", nome: "Tribunal de Justiça de Goiás" },
    { id: "TJMA", nome: "Tribunal de Justiça do Maranhão" },
    { id: "TJMT", nome: "Tribunal de Justiça do Mato Grosso" },
    { id: "TJMS", nome: "Tribunal de Justiça do Mato Grosso do Sul" },
    { id: "TJMG", nome: "Tribunal de Justiça de Minas Gerais" },
    { id: "TJPA", nome: "Tribunal de Justiça do Pará" },
    { id: "TJPB", nome: "Tribunal de Justiça da Paraíba" },
    { id: "TJPE", nome: "Tribunal de Justiça de Pernambuco" },
    { id: "TJPI", nome: "Tribunal de Justiça do Piauí" },
    { id: "TJPR", nome: "Tribunal de Justiça do Paraná" },
    { id: "TJRJ", nome: "Tribunal de Justiça do Rio de Janeiro" },
    { id: "TJRN", nome: "Tribunal de Justiça do Rio Grande do Norte" },
    { id: "TJRO", nome: "Tribunal de Justiça de Rondônia" },
    { id: "TJRR", nome: "Tribunal de Justiça de Roraima" },
    { id: "TJRS", nome: "Tribunal de Justiça do Rio Grande do Sul" },
    { id: "TJSC", nome: "Tribunal de Justiça de Santa Catarina" },
    { id: "TJSE", nome: "Tribunal de Justiça de Sergipe" },
    { id: "TJSP", nome: "Tribunal de Justiça de São Paulo" },
    { id: "TJTO", nome: "Tribunal de Justiça do Tocantins" },
    { id: "TRT1", nome: "Tribunal Regional do Trabalho da 1ª Região" },
    { id: "TRT2", nome: "Tribunal Regional do Trabalho da 2ª Região" },
    { id: "TRT3", nome: "Tribunal Regional do Trabalho da 3ª Região" },
    { id: "TRT4", nome: "Tribunal Regional do Trabalho da 4ª Região" },
    { id: "TRT5", nome: "Tribunal Regional do Trabalho da 5ª Região" },
    { id: "TRT6", nome: "Tribunal Regional do Trabalho da 6ª Região" },
    { id: "TRT7", nome: "Tribunal Regional do Trabalho da 7ª Região" },
    { id: "TRT8", nome: "Tribunal Regional do Trabalho da 8ª Região" },
    { id: "TRT9", nome: "Tribunal Regional do Trabalho da 9ª Região" },
    { id: "TRT10", nome: "Tribunal Regional do Trabalho da 10ª Região" },
    { id: "TRT11", nome: "Tribunal Regional do Trabalho da 11ª Região" },
    { id: "TRT12", nome: "Tribunal Regional do Trabalho da 12ª Região" },
    { id: "TRT13", nome: "Tribunal Regional do Trabalho da 13ª Região" },
    { id: "TRT14", nome: "Tribunal Regional do Trabalho da 14ª Região" },
    { id: "TRT15", nome: "Tribunal Regional do Trabalho da 15ª Região" },
    { id: "TRT16", nome: "Tribunal Regional do Trabalho da 16ª Região" },
    { id: "TRT17", nome: "Tribunal Regional do Trabalho da 17ª Região" },
    { id: "TRT18", nome: "Tribunal Regional do Trabalho da 18ª Região" },
    { id: "TRT19", nome: "Tribunal Regional do Trabalho da 19ª Região" },
    { id: "TRT20", nome: "Tribunal Regional do Trabalho da 20ª Região" },
    { id: "TRT21", nome: "Tribunal Regional do Trabalho da 21ª Região" },
    { id: "TRT22", nome: "Tribunal Regional do Trabalho da 22ª Região" },
    { id: "TRT23", nome: "Tribunal Regional do Trabalho da 23ª Região" },
    { id: "TRT24", nome: "Tribunal Regional do Trabalho da 24ª Região" },
];

const AutomatedProposal = () => {

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<IProposalFormStateProps>({
        defaultValues: {
            tipo_do_oficio: "PRECATÓRIO",
            esfera: "FEDERAL",
            tribunal: '',
            natureza: 'NÃO TRIBUTÁRIA',
            valor_principal: 0,
            valor_juros: 0,
            data_base: '',
            data_requisicao: '',
            incidencia_juros_moratorios: true,
            nao_incide_selic_no_periodo_db_ate_abril: false,
            incidencia_rra_ir: false,
            ir_incidente_rra: false,
            numero_de_meses: 0,
            incidencia_pss: false,
            valor_pss: 0,
            ja_possui_destacamento: true,
            percentual_de_honorarios: 0,
            percentual_a_ser_adquirido: 100,
        }
    });

    const enumTipoOficiosList = Object.values(tipoOficio);
    const [headerColorset, setHeaderColorset] = useState<'smooth' | 'glass'>('smooth');
    const [loading, setLoading] = useState<boolean>(false);
    const mainRef = useRef<HTMLDivElement | null>(null);

    const onSubmit = async (data: any) => {
        setLoading(true);

        data.valor_principal = backendNumberFormat(data.valor_principal) || 0;
        data.valor_juros = backendNumberFormat(data.valor_juros) || 0;
        data.valor_pss = backendNumberFormat(data.valor_pss) || 0;

        if (data.data_base > "2021-12-01") {
            data.incidencia_juros_moratorios = false
        }

        if (data.ja_possui_destacamento) {
            data.percentual_de_honorarios = 30;
        }

        console.log(data);

        const response = await api.post('/api/lead-magnet/', {
            data: data
        });

        console.log(response.data)
    }

    useEffect(() => {
        const watchWindowScroll = () => {
            if (window.scrollY > 100) {
                setHeaderColorset('glass');
            } else {
                setHeaderColorset('smooth');
            }
        }
        window.addEventListener('scroll', watchWindowScroll);
        return () => window.removeEventListener('scroll', watchWindowScroll);
    }, [])

    return (
        <UnloggedLayout>
            <div ref={mainRef}>
                {/* header */}
                <div className={`fixed top-0 w-full z-1 py-6 xsm:px-5 lg:px-10 flex items-center justify-between ${headerColorset === 'smooth' ? 'bg-transparent' : 'bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 bg-boxdark-2'} transition-colors duration-200`}>
                    <Image
                        className="block"
                        src={"/images/logo/celer-app-logo-text.svg"}
                        alt="Logo"
                        width={176}
                        height={32}
                    />
                    {/* <nav className='flex items-center text-strokedark justify-center gap-12'>
                    <Link href="#">Home</Link>
                    <Link href="#" className='flex items-center gap-1'>
                        <span>Produtos</span>
                        <BiChevronDown />
                    </Link>
                    <Link href="#" className='flex items-center gap-1'>
                        <span>Recursos</span>
                        <BiChevronDown />
                    </Link>
                    <Link href="#">Sobre nós</Link>
                </nav> */}
                    <div className='flex items-center gap-4'>
                        <Link href='/auth/signin/' className='px-6 py-3 border border-snow rounded-md text-snow hover:-translate-y-1 hover:bg-snow hover:border-snow hover:text-black-2 transition-translate duration-300'>
                            <span>Entrar</span>
                        </Link>
                        <Link href='/auth/signup/' className='px-6 py-3 bg-snow border border-snow text-black-2 rounded-md hover:-translate-y-1 hover:border-snow transition-all duration-300'>
                            <span>Cadastrar</span>
                        </Link>
                    </div>
                </div>
                {/* end header */}

                {/* image-wrapper */}
                <div className="relative">
                    <img
                        src="/images/hero-image.jfif"
                        alt="homem com terno e notebook"
                        className="h-full"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.7)_10%,transparent_90%)] flex flex-col items-start justify-center">
                        <h1 className="text-7xl font-bold pl-10 pt-15 opacity-0 translate-x-25 animate-fade-right text-snow">
                            Gerador de <br /> Propostas <br /> Automáticas
                        </h1>
                    </div>
                </div>
                {/* end image-wrapper */}

                {/* form */}
                <div className="max-w-270 mx-auto py-10 mb-50">
                    <h2 className="text-2xl text-center mb-10">Preencha o formulário abaixo</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-2">

                            {/* ====> label TIPO DO OFÍCIO <==== */}
                            <div className="flex w-full flex-col gap-2 col-span-1 mb-4">
                                <label
                                    htmlFor="tipo_do_oficio"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Tipo
                                </label>

                                <ShadSelect
                                    name="tipo_do_oficio"
                                    control={control}
                                    defaultValue={enumTipoOficiosList[0]}

                                // className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-xs font-bold dark:border-strokedark dark:bg-boxdark uppercase"
                                >
                                    {ENUM_TIPO_OFICIOS_LIST.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </ShadSelect>
                            </div>
                            {/* ====> end label TIPO DO OFÍCIO <==== */}

                            {/* ====> label NATUREZA DO OFÍCIO <==== */}
                            <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1 mb-4">
                                <label
                                    htmlFor="natureza"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Natureza
                                </label>

                                <ShadSelect
                                    name="natureza"
                                    control={control}
                                    defaultValue={"NÃO TRIBUTÁRIA"}

                                // className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-xs font-bold dark:border-strokedark dark:bg-boxdark uppercase"
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
                            {/* ====>  end label NATUREZA DO OFÍCIO <==== */}

                            {/* ====> label ESFERA <==== */}
                            <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1 mb-4">
                                <label
                                    htmlFor="esfera"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Esfera
                                </label>
                                <ShadSelect defaultValue="FEDERAL" name="esfera" control={control}>
                                    <SelectItem value="FEDERAL">Federal</SelectItem>
                                    <SelectItem value="ESTADUAL">Estadual</SelectItem>
                                    <SelectItem value="MUNICIPAL">Municipal</SelectItem>
                                </ShadSelect>
                            </div>
                            {/* ====> end label ESFERA <==== */}

                            {/* ====> label TRIBUNUAL <==== */}
                            <div className="relative flex w-full flex-col gap-2 sm:col-span-1 mb-4">
                                <label
                                    htmlFor="tribunal"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Tribunal
                                </label>
                                <ShadSelect
                                    name="tribunal"
                                    control={control}
                                    defaultValue={tribunais[0].nome}
                                    required={true}
                                >
                                    {tribunais.map((tribunal) => (
                                        <SelectItem key={tribunal.id} value={tribunal.id}>
                                            {tribunal.nome}
                                        </SelectItem>
                                    ))}
                                </ShadSelect>

                                <ErrorMessage errors={errors} field="tribunal" />
                            </div>
                            {/* ====> end label TRIBUNUAL <==== */}

                            {/* ====> label VALOR PRINCIPAL <==== */}
                            <div className="flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1 mb-4">
                                <label
                                    htmlFor="valor_principal"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Valor Principal
                                </label>
                                <Controller
                                    name="valor_principal"
                                    control={control}
                                    defaultValue={0}
                                    render={({ field }) => (
                                        <Cleave
                                            {...field}
                                            className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
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
                            {/* ====> end label VALOR PRINCIPAL <==== */}

                            {/* ====> label JUROS <==== */}
                            <div className="flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1 mb-4">
                                <label
                                    htmlFor="valor_juros"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Juros
                                </label>
                                <Controller
                                    name="valor_juros"
                                    control={control}
                                    defaultValue={0}
                                    render={({ field }) => (
                                        <Cleave
                                            {...field}
                                            className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
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
                            {/* ====> end label JUROS <==== */}

                            {/* ====> label DATA BASE <==== */}
                            <div className="flex min-h-17.5 flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                <div className="relative mb-4 flex flex-col justify-between">
                                    <label
                                        htmlFor="data_base"
                                        className="mb-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                                    >
                                        Data Base
                                    </label>
                                    <input
                                        type="date"
                                        id="data_base"
                                        className={`${errors.data_base && "!border-rose-400 !ring-0"} w-full rounded-md border bg-white px-3 py-2 text-sm font-medium border-stroke dark:border-strokedark dark:bg-boxdark-2`}
                                        {...register("data_base", {
                                            required: "Campo obrigatório",
                                        })}
                                        aria-invalid={errors.data_base ? "true" : "false"}
                                    />
                                    <ErrorMessage errors={errors} field="data_base" />
                                </div>
                            </div>
                            {/* ====> end label DATA BASE <==== */}

                            {/* ====> label DATA DE REQUISIÇÃO <==== */}
                            <div className="flex flex-col gap-2 2xsm:col-span-2 2xsm:mt-3 sm:col-span-1 sm:mt-0">
                                <div className="relative mb-4 flex flex-col justify-between">
                                    <label
                                        htmlFor="data_requisicao"
                                        className="mb-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                                    >
                                        Data de Requisição / Recebimento
                                    </label>
                                    <input
                                        type="date"
                                        id="data_requisicao"
                                        className={`${errors.data_requisicao && "!border-rose-400 !ring-0"} w-full rounded-md border bg-white px-3 py-2 text-sm font-medium border-stroke dark:border-strokedark dark:bg-boxdark-2`}
                                        {...register("data_requisicao", {
                                            required: "Campo obrigatório",
                                        })}
                                    />
                                    <ErrorMessage errors={errors} field="data_requisicao" />
                                </div>
                            </div>
                            {/* ====> endlabel DATA DE REQUISIÇÃO <==== */}

                            {/* ====> label PERCENTUAL DE AQUISIÇÃO <==== */}
                            <div className="flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                <label
                                    htmlFor="percentual_a_ser_adquirido"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Percentual de aquisição (%)
                                </label>
                                <input
                                    type="number"
                                    id="percentual_a_ser_adquirido"
                                    defaultValue={100}
                                    className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                    min={0}
                                    {...register("percentual_a_ser_adquirido", {
                                        required: "Campo obrigatório",
                                        setValueAs: (value) => {
                                            return parseInt(value);
                                        },
                                    })}
                                />
                            </div>
                            {/* ====> end label PERCENTUAL DE AQUISIÇÃO <==== */}

                            {/* ====> checkbox JUROS DE MORA <==== */}
                            {watch("data_base") < "2021-12-01" && watch("natureza") !== "TRIBUTÁRIA" && (
                                <div
                                    className={`flex items-center gap-2 col-span-2`}
                                >

                                    <CustomCheckbox
                                        check={watch("incidencia_juros_moratorios")}
                                        id={'incidencia_juros_moratorios'}
                                        defaultChecked
                                        register={register("incidencia_juros_moratorios")}
                                    />

                                    <label
                                        htmlFor="incidencia_juros_moratorios"
                                        className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                    >
                                        Juros de Mora fixados em sentença
                                    </label>
                                </div>
                            )}
                            {/* ====> end checkbox JUROS DE MORA <==== */}

                            {/* ====> checkbox SELIC SOBRE PRINCIPAL <==== */}
                            <div
                                className={`flex items-center col-span-2 gap-2 ${watch("data_base") > "2021-12-01" && watch("natureza") !== "TRIBUTÁRIA" ? "" : "hidden"}`}
                            >

                                <CustomCheckbox
                                    check={watch("nao_incide_selic_no_periodo_db_ate_abril")}
                                    id={'nao_incide_selic_no_periodo_db_ate_abril'}
                                    register={register("nao_incide_selic_no_periodo_db_ate_abril")}
                                />

                                <label
                                    htmlFor="nao_incide_selic_no_periodo_db_ate_abril"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    SELIC somente sobre o principal
                                </label>
                            </div>
                            {/* ====> end checkbox SELIC SOBRE PRINCIPAL <==== */}

                            {/* ====> checkbox INCIDÊNCIA DE IR <==== */}
                            <div className="flex items-center gap-2 col-span-2">
                                <CustomCheckbox
                                    check={watch("incidencia_rra_ir")}
                                    id={'incidencia_rra_ir'}
                                    defaultChecked
                                    register={register("incidencia_rra_ir")}
                                />

                                <label
                                    htmlFor="incidencia_rra_ir"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                    Incidência de IR
                                </label>
                            </div>
                            {/* ====> end checkbox INCIDÊNCIA DE IR <==== */}

                            {/* ====> checkbox IR INCIDE RRA <==== */}
                            {watch("natureza") === "TRIBUTÁRIA" ||
                                watch("incidencia_rra_ir") === false ? (
                                null
                            ) : (
                                <div className={`flex gap-2 ${watch("ir_incidente_rra") ? 'items-start' : 'items-center'} 2xsm:col-span-2 sm:col-span-1`}>
                                    <CustomCheckbox
                                        check={watch("ir_incidente_rra")}
                                        id={'ir_incidente_rra'}
                                        register={register("ir_incidente_rra")}
                                    />

                                    <label
                                        htmlFor="ir_incidente_rra"
                                        className="mt-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                                    >
                                        IR incidente sobre RRA?
                                    </label>
                                </div>
                            )}
                            {/* ====> checkbox IR INCIDE RRA <==== */}

                            {/* ====> label NÚMERO DE MESES <==== */}
                            {watch("ir_incidente_rra") === true &&
                                watch("natureza") !== "TRIBUTÁRIA" ? (
                                <div className="flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                    <label
                                        htmlFor="numero_de_meses"
                                        className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                    >
                                        Número de meses
                                    </label>
                                    <input
                                        type="number"
                                        id="numero_de_meses"
                                        className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                        min={0}
                                        {...register("numero_de_meses", {
                                            required: "Campo obrigatório",
                                            setValueAs: (value) => {
                                                return parseInt(value);
                                            },
                                        })}
                                    />
                                </div>
                            ) : (
                                <>
                                    {watch('natureza') === 'TRIBUTÁRIA' || watch('incidencia_rra_ir') === false ? null : (
                                        <div className="flex items-center col-span-1">&nbsp;</div>
                                    )}
                                </>
                            )}
                            {/* ====> label NÚMERO DE MESES <==== */}

                            {/* ====> checkbox INCIDE PSS <==== */}
                            {watch("natureza") !== "TRIBUTÁRIA" ? (
                                <div className={`flex gap-2 ${watch('incidencia_pss') ? 'items-start' : 'items-center'} 2xsm:col-span-2 sm:col-span-1`}>
                                    <CustomCheckbox
                                        check={watch("incidencia_pss")}
                                        id={'incidencia_pss'}
                                        register={register("incidencia_pss")}
                                    />

                                    <label
                                        htmlFor="incidencia_pss"
                                        className="mt-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                                    >
                                        Incide PSS?
                                    </label>
                                </div>
                            ) : null}
                            {/* ====> end checkbox INCIDE PSS<==== */}

                            {/* ====> label VALOR PSS <==== */}
                            {watch("incidencia_pss") && watch("natureza") !== "TRIBUTÁRIA" ? (
                                <div className="flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                    <label
                                        htmlFor="valor_pss"
                                        className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                    >
                                        PSS
                                    </label>
                                    <Controller
                                        name="valor_pss"
                                        control={control}
                                        defaultValue={0}
                                        render={({ field }) => (
                                            <Cleave
                                                {...field}
                                                className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
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
                                <>
                                    {watch('natureza') === 'TRIBUTÁRIA' ? null : (
                                        <div className="flex items-center">&nbsp;</div>
                                    )}
                                </>
                            )}
                            {/* ====> label VALOR PSS <==== */}
                        </div>

                        {/* ====> checkbox DESTACAMENTO DE HONORÁRIOS <==== */}
                        <div className="my-4 flex w-full flex-row justify-between gap-4 sm:col-span-2">
                            <div className={`flex flex-row ${watch('ja_possui_destacamento') ? 'items-center' : 'items-start'} w-full gap-2 sm:col-span-1`}>
                                <CustomCheckbox
                                    check={watch("ja_possui_destacamento")}
                                    id={'ja_possui_destacamento'}
                                    register={register("ja_possui_destacamento")}
                                    defaultChecked
                                />

                                <label
                                    htmlFor="ja_possui_destacamento"
                                    className={`${!watch('ja_possui_destacamento') && 'mt-1'} font-nexa text-xs font-semibold uppercase text-meta-5`}
                                >
                                    Já possui destacamento de honorários?
                                </label>
                            </div>
                            {watch('ja_possui_destacamento') === false && (<div className=" flex w-full flex-row justify-between gap-4 sm:col-span-2">
                                <div className="flex w-full flex-col gap-2 sm:col-span-1">
                                    <label
                                        htmlFor="percentual_de_honorarios"
                                        className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                    >
                                        Percentual <span className="text-xs text-meta-5">(%)</span><span className="text-[7px] text-meta-8">&nbsp; Dedução feita no Notion</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="percentual_de_honorarios"
                                        className="h-[37px] w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                        {...register("percentual_de_honorarios", {})}
                                    />
                                </div>
                            </div>)}
                        </div>
                        {/* ====> end checkbox DESTACAMENTO DE HONORÁRIOS <==== */}

                        {/* calculate button */}
                        <button
                            type="submit"
                            className="mb-8 mt-15 flex gap-2 cursor-pointer items-center justify-center rounded-lg bg-blue-700 px-8 py-3 text-sm text-white transition-all duration-200 hover:bg-blue-800 focus:z-0"
                        >
                            <span className="text-[16px] font-medium" aria-disabled={loading}>
                                {loading ? "Fazendo cálculo..." : "Calcular"}
                            </span>
                            {loading && (<AiOutlineLoading className="ml-2 mt-[0.2rem] h-4 w-4 animate-spin" />)}
                        </button>
                        {/* end calculate button */}
                    </form>
                </div>
                {/* end form */}
            </div>
        </UnloggedLayout>
    )
}

export default AutomatedProposal;
