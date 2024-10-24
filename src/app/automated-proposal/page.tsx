"use client";
import CustomCheckbox from "@/components/CrmUi/Checkbox";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage";
import { MainFooter } from "@/components/Footer";
import UnloggedHeader from "@/components/Header/UnloggedHeader";
import UnloggedLayout from "@/components/Layouts/UnloggedLayout";
import { ShadSelect } from "@/components/ShadSelect";
import AutomatedProposalSkeleton from "@/components/Skeletons/AutomatedProposalSteketon";
import AutomatedProposalSteketon from "@/components/Skeletons/AutomatedProposalSteketon";
import NewFormResultSkeleton from "@/components/Skeletons/NewFormResultSkeleton";
import { SelectItem } from "@/components/ui/select";
import { APP_ROUTES } from "@/constants/app-routes";
import { ENUM_TIPO_OFICIOS_LIST } from "@/constants/constants";
import tipoOficio from "@/enums/tipoOficio.enum";
import backendNumberFormat from "@/functions/formaters/backendNumberFormat";
import numberFormat from "@/functions/formaters/numberFormat";
import api from "@/utils/api";
import { AxiosError } from "axios";
import Cleave from "cleave.js/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { BsChevronCompactDown } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";

interface IProposalFormStateProps {
  tipo_do_oficio: string;
  natureza: string;
  esfera: string;
  regime: string;
  tribunal: string;
  valor_principal: number;
  valor_juros: number;
  data_base: string;
  data_requisicao: string;
  incidencia_juros_moratorios: boolean;
  nao_incide_selic_no_periodo_db_ate_abril: boolean;
  incidencia_rra_ir: boolean;
  ir_incidente_rra: boolean;
  numero_de_meses: number;
  incidencia_pss: boolean;
  valor_pss: number;
  ja_possui_destacamento: boolean;
  percentual_de_honorarios: number;
  percentual_a_ser_adquirido: number;
  valor_aquisicao_total: boolean;
}

const whatsAppNumber = "5581998158585"; // número do consultor da Ativos para receber mensagens

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
  {
    id: "TJDFT",
    nome: "Tribunal de Justiça do Distrito Federal e dos Territórios",
  },
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
].sort((a, b) => a.nome.localeCompare(b.nome));

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
      regime: "",
      tribunal: "STJ",
      natureza: "NÃO TRIBUTÁRIA",
      valor_principal: 0,
      valor_juros: 0,
      data_base: "",
      data_requisicao: "",
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
    },
  });

  function convertInputIntegerToFloat(data: any) {
    data.percentual_de_honorarios /= 100;
  }

  const enumTipoOficiosList = Object.values(tipoOficio);
  const [headerColorset, setHeaderColorset] = useState<"smooth" | "glass">(
    "smooth",
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isFloatingButtonsVisible, setIsFloatingButtonVisible] = useState<boolean>(false);
  const [filledFormData, setFilledFormData] =
    useState<IProposalFormStateProps | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  /* ====> value states <==== */
  const [proposalValue, setProposalValue] = useState({ min: 0, max: 0 });
  const [comissionValue, setComissionValue] = useState({ min: 0, max: 0 });
  const [sliderValues, setSliderValues] = useState({
    proposal: 0,
    comission: 0,
  });

  // Função para atualizar a proposta e ajustar a comissão proporcionalmente
  const handleProposalSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newProposalSliderValue = parseFloat(e.target.value);
    setSliderValues((oldValues) => {
      return { ...oldValues, proposal: newProposalSliderValue };
    });

    // Calcular a proporção em relação a proposta e ajustar a comissão
    const proportion =
      (newProposalSliderValue - proposalValue.min) /
      (proposalValue.max - proposalValue.min);
    const newComissionSliderValue =
      comissionValue.max -
      proportion * (comissionValue.max - comissionValue.min);
    setSliderValues((oldValues) => {
      return { ...oldValues, comission: newComissionSliderValue };
    });
  };

  // Função para atualizar a comissão e ajustar a proposta proporcionalmente
  const handleComissionSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newComissionSliderValue = parseFloat(e.target.value);
    setSliderValues((oldValues) => {
      return { ...oldValues, comission: newComissionSliderValue };
    });

    // Calcular a proporção em relação a comissão e ajustar a proposta
    const proportion =
      (newComissionSliderValue - comissionValue.min) /
      (comissionValue.max - comissionValue.min);
    const newProposalSliderValue =
      proposalValue.max - proportion * (proposalValue.max - proposalValue.min);
    setSliderValues((oldValues) => {
      return { ...oldValues, proposal: newProposalSliderValue };
    });
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

    data.valor_principal = backendNumberFormat(data.valor_principal) || 0;
    data.valor_juros = backendNumberFormat(data.valor_juros) || 0;
    data.valor_pss = backendNumberFormat(data.valor_pss) || 0;
    // data.percentual_a_ser_adquirido /= 100;

    if (data.tribunal === "TRF1" || data.tribunal === "TRF6") {
      data.nao_incide_selic_no_periodo_db_ate_abril = true;
    }

    if (data.data_base > "2021-12-01") {
      data.incidencia_juros_moratorios = false;
    }

    if (data.ja_possui_destacamento) {
      data.percentual_de_honorarios = 0;
    } else {
      convertInputIntegerToFloat(data);
    }

    if (!data.regime) {
      data.regime = "GERAL";
    }

    if (data.valor_aquisicao_total) {
      data.percentual_a_ser_adquirido = 1;
    } else {
      convertInputIntegerToFloat(data);
    }

    try {
      const response = await api.post("/api/lead-magnet/", data);
      if (response.status === 200) {
        const results = response.data.result; // pega o resultado da requisição
        setProposalValue({
          min: results.min_proposal,
          max: results.max_proposal,
        });
        setComissionValue({
          min: results.min_comission,
          max: results.max_comission,
        });
        setShowResults(true);
        setFilledFormData(data);
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({
            behavior: "smooth"
          })
        }
      } else if (response.status === 400) {
        toast.error(response.data.error); // lança toast de erro na tela com mensagem personalizada
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      } else {
        toast.error(String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  function dateConverter(date: string): string {
    const convertedDate = date.split("-").reverse().join("/");
    return convertedDate;
  }

  function scrollTo(ref: HTMLElement | HTMLDivElement | null) {
    if (ref) {
      ref.scrollIntoView({
        behavior: "smooth"
      })
    }
  }

  const sendDefaultWhatsAppMessage = () => {
    const message = "Olá, venho do site do Celer, e gostaria de tirar uma dúvida!";
    const linkWhatsApp = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;
    window.open(linkWhatsApp, "_blank", "noopener,noreferrer");
  }

  const sendProposalToWhatsApp = () => {
    const message = `
        Olá, venho da aplicação CelerApp, onde acabo de fazer um cálculo de proposta.
Segue abaixo os dados do cálculo:

    - Valor de proposta: ${numberFormat(sliderValues.proposal)}
    - Valor de comissão: ${numberFormat(sliderValues.comission)}


E abaixo, uma memória das informações de entrada:

    - Tipo: ${filledFormData!.tipo_do_oficio}
    - Natureza: ${filledFormData!.natureza}
    - Esfera: ${filledFormData!.esfera}
    - Tribunal:  ${filledFormData!.tribunal}
    - Valor Principal: ${numberFormat(filledFormData!.valor_principal)}
    - Valor Juros: ${numberFormat(filledFormData!.valor_juros)}
    - Data Base: ${dateConverter(filledFormData!.data_base)}
    - Data de Requisição:  ${dateConverter(filledFormData!.data_requisicao)}
    - Percentual de Aquisição: ${filledFormData!.percentual_a_ser_adquirido}%
    - Juros de mora?: ${filledFormData!.incidencia_juros_moratorios ? "Sim" : "Não"}
    - Incidência de IR?: ${filledFormData!.incidencia_rra_ir ? "Sim" : "Não"}
    - IR incide sobre RRA?: ${filledFormData!.ir_incidente_rra ? "Sim" : "Não"}
    - Incidência de PSS?: ${filledFormData!.incidencia_pss ? "Sim" : "Não"}
    - Quantidade de meses: ${filledFormData!.numero_de_meses}
    - Possui destacamento de honorários?: ${filledFormData!.ja_possui_destacamento ? "Sim" : "Não"}
        `;

    const linkWhatsApp = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;
    window.open(linkWhatsApp, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    setSliderValues({
      proposal: proposalValue.min,
      comission: comissionValue.max,
    });
  }, [proposalValue, comissionValue]);

  useEffect(() => {
    const watchWindowScroll = () => {
      const scrollPosition = window.scrollY;
      // faz o botão do whatsapp surgir
      if (scrollPosition > 500) {
        setIsFloatingButtonVisible(true);
      } else {
        setIsFloatingButtonVisible(false);
      }

      // altera o colorset do header
      if (scrollPosition > 100) {
        setHeaderColorset("glass");
      } else {
        setHeaderColorset("smooth");
      }
    };
    window.addEventListener("scroll", watchWindowScroll);
    return () => window.removeEventListener("scroll", watchWindowScroll);
  }, []);

  return (
    <div ref={mainRef} className="bg-boxdark-2 font-nexa">
      <UnloggedHeader
        theme="dark" //tema do header
        logoPath="/images/logo/new-logo-text-dark.png" //logo do header
      />

      {/* image-wrapper */}
      <div className="relative min-h-dvh">
        <div className="shadow-ball"></div>
        {/* <Image
          src="/images/hero-image.webp"
          alt="homem com terno e notebook"
          className="w-full"
          width={1913}
          height={490}
          quality={100}
        /> */}
        <div className="absolute inset-0 flex flex-col items-center justify-between bg-[linear-gradient(to_top,#1A222C_5%,transparent_95%)]">
          <div className="mx-auto md:min-w-[80%] xl:min-w-[1080px] pt-20 md:pt-55">
            <Fade direction="up" triggerOnce>
              <h1 className="font-manyChat pt-15 text-center text-7xl tracking-wide text-snow 2xsm:hidden md:block md:text-5xl lg:text-7xl">
                Expanda suas <br /> vendas <br /> de precatórios
              </h1>
              <h1 className="font-manyChat pt-20 text-center text-snow 2xsm:mt-8 2xsm:flex 2xsm:flex-col 2xsm:items-center 2xsm:justify-center  2xsm:text-title-xl2 md:hidden">
                <span>Expanda suas vendas</span>
                <span>de Precatórios</span>
              </h1>
            </Fade>
            <Fade direction="up" delay={700} triggerOnce>
              <p className="font-rooftop pt-10 text-center  text-base font-bold text-slate-500 2xsm:text-2xl">
                Conduza mais negociações de precatórios <br /> e converta mais antecipações.
              </p>
            </Fade>
          </div>

          <div className="flex flex-col items-center justify-center pb-3">
            <BsChevronCompactDown
              onClick={() => { scrollTo(formRef.current) }}
              className="animate-upforward text-6xl text-bodydark2 cursor-pointer" 
            />
            <span>clique aqui para ir ao formulário</span>
          </div>
        </div>
      </div>
      {/* end image-wrapper */}

      {/* form */}
      <div className=" bg-boxdark-2">
        <div className="mx-auto  max-w-[80%] py-10 2xl:min-w-[1080px] 2xl:px-60">
          <div className="mb-10">
            <h2 className="text-xl font-medium uppercase text-bodydark">
              Preencha o formulário abaixo
            </h2>
          </div>
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="scroll-m-25 scroll-p-46">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-2">
              {/* ====> label TIPO DO OFÍCIO <==== */}
              <div className="mb-4 flex w-full flex-col gap-2 2xsm:col-span-2 md:col-span-1">
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
                  className="border-strokedark bg-form-input text-bodydark"

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
              <div className="mb-4 flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1 md:col-span-1">
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
                  className="border-strokedark bg-form-input text-bodydark"

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
              <div className="mb-4 flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1 md:col-span-1">
                <label
                  htmlFor="esfera"
                  className="font-nexa text-xs font-semibold uppercase text-meta-5"
                >
                  Esfera
                </label>
                <ShadSelect
                  defaultValue="FEDERAL"
                  name="esfera"
                  control={control}
                  className="border-strokedark bg-form-input text-bodydark"
                >
                  <SelectItem value="FEDERAL">Federal</SelectItem>
                  <SelectItem value="ESTADUAL">Estadual</SelectItem>
                  <SelectItem value="MUNICIPAL">Municipal</SelectItem>
                </ShadSelect>
              </div>
              {/* ====> end label ESFERA <==== */}

              {/* ====> label REGIME <==== */}
              {watch("esfera") !== "FEDERAL" &&
                watch("esfera") !== undefined ? (
                <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                  <label
                    htmlFor="natureza"
                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                  >
                    Regime
                  </label>
                  <ShadSelect
                    name="regime"
                    control={control}
                    defaultValue="GERAL"
                    className="border-strokedark bg-form-input text-bodydark"
                  >
                    <SelectItem value="GERAL">GERAL</SelectItem>
                    <SelectItem value="ESPECIAL">ESPECIAL</SelectItem>
                  </ShadSelect>
                </div>
              ) : null}
              {/* ====> end label REGIME <==== */}

              {/* ====> label TRIBUNUAL <==== */}
              <div className="relative mb-4 flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1 md:col-span-1">
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
                  className="border-strokedark bg-form-input text-bodydark"
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
              <div className="relative mb-4 flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1 md:col-span-1">
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
                  rules={{
                    min: {
                      value: 0.01,
                      message: "O valor deve ser maior que 0",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Cleave
                        {...field}
                        className={`w-full rounded-md border ${error ? "border-red" : "border-strokedark"} bg-form-input px-3 py-2 text-sm font-medium text-bodydark`}
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
                      {error && (
                        <span className="absolute left-1 top-16 text-xs font-medium text-red">
                          {error.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
              {/* ====> end label VALOR PRINCIPAL <==== */}

              {/* ====> label JUROS <==== */}
              <div className="relative mb-4 flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1 md:col-span-1">
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
                    <>
                      <Cleave
                        {...field}
                        className={`w-full rounded-md border bg-form-input px-3 py-2 text-sm font-medium text-bodydark`}
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
                    </>
                  )}
                />
              </div>
              {/* ====> end label JUROS <==== */}

              {/* ====> label DATA BASE <==== */}
              <div className="flex min-h-17.5 flex-col gap-2 2xsm:col-span-2 sm:col-span-1 md:col-span-1">
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
                    className={`${errors.data_base && "!border-red !ring-0"} w-full rounded-md border border-strokedark bg-form-input px-3 py-2 text-sm font-medium text-bodydark`}
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
              <div className="flex flex-col gap-2 2xsm:col-span-2 2xsm:mt-3 sm:col-span-1 sm:mt-0 md:col-span-1">
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
                    className={`${errors.data_requisicao && "!border-red !ring-0"} w-full rounded-md border border-strokedark bg-form-input px-3 py-2 text-sm font-medium text-bodydark`}
                    {...register("data_requisicao", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <ErrorMessage errors={errors} field="data_requisicao" />
                </div>
              </div>
              {/* ====> endlabel DATA DE REQUISIÇÃO <==== */}

              {/* ====> label PERCENTUAL DE AQUISIÇÃO <==== */}
              <div
                className={`col-span-2 flex max-h-6 items-center gap-2 md:col-span-1`}
              >
                <CustomCheckbox
                  check={watch("valor_aquisicao_total")}
                  id={"valor_aquisicao_total"}
                  defaultChecked
                  register={register("valor_aquisicao_total")}
                />

                <label
                  htmlFor="valor_aquisicao_total"
                  className="font-nexa text-xs font-semibold uppercase text-meta-5"
                >
                  Aquisição total
                </label>
              </div>

              {watch("valor_aquisicao_total") === false ? (
                <div className="mt-1 flex flex-col gap-2 overflow-hidden 2xsm:col-span-2 md:col-span-1">
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
              ) : (
                <div className="col-span-1 hidden md:block"></div>
              )}
              {/* ====> end label PERCENTUAL DE AQUISIÇÃO <==== */}

              {/* ====> checkbox JUROS DE MORA <==== */}
              {watch("data_base") < "2021-12-01" &&
                watch("natureza") !== "TRIBUTÁRIA" && (
                  <div className={`col-span-2 flex items-center gap-2`}>
                    <CustomCheckbox
                      check={watch("incidencia_juros_moratorios")}
                      id={"incidencia_juros_moratorios"}
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
              {/* <div
                className={`col-span-2 flex items-center gap-2 ${watch("data_base") > "2021-12-01" && watch("natureza") !== "TRIBUTÁRIA" && watch("tribunal") !== "TRF1" && watch("tribunal") !== "TRF6" ? "" : "hidden"}`}
              >
                <CustomCheckbox
                  check={watch("nao_incide_selic_no_periodo_db_ate_abril")}
                  id={"nao_incide_selic_no_periodo_db_ate_abril"}
                  register={register(
                    "nao_incide_selic_no_periodo_db_ate_abril",
                  )}
                />

                <label
                  htmlFor="nao_incide_selic_no_periodo_db_ate_abril"
                  className="font-nexa text-xs font-semibold uppercase text-meta-5"
                >
                  SELIC somente sobre o principal
                </label>
              </div> */}
              {/* ====> end checkbox SELIC SOBRE PRINCIPAL <==== */}

              {/* ====> checkbox INCIDÊNCIA DE IR <==== */}
              <div className="col-span-2 flex items-center gap-2">
                <CustomCheckbox
                  check={watch("incidencia_rra_ir")}
                  id={"incidencia_rra_ir"}
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
                watch("incidencia_rra_ir") === false ? null : (
                <div
                  className={`flex gap-2 ${watch("ir_incidente_rra") ? "items-start" : "items-center"} 2xsm:col-span-2 sm:col-span-1`}
                >
                  <CustomCheckbox
                    check={watch("ir_incidente_rra")}
                    id={"ir_incidente_rra"}
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
                    className="w-full rounded-md border border-strokedark bg-form-input px-3 py-2 text-sm font-medium text-bodydark"
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
                  {watch("natureza") === "TRIBUTÁRIA" ||
                    watch("incidencia_rra_ir") === false ? null : (
                    <div className="col-span-1 hidden items-center md:flex">&nbsp;</div>
                  )}
                </>
              )}
              {/* ====> label NÚMERO DE MESES <==== */}

              {/* ====> checkbox INCIDE PSS <==== */}
              {watch("natureza") !== "TRIBUTÁRIA" ? (
                <div
                  className={`flex gap-2 ${watch("incidencia_pss") ? "items-start" : "items-center"} 2xsm:col-span-2 sm:col-span-1`}
                >
                  <CustomCheckbox
                    check={watch("incidencia_pss")}
                    id={"incidencia_pss"}
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
                        className="w-full rounded-md border border-strokedark bg-form-input px-3 py-2 text-sm font-medium text-bodydark"
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
                  {watch("natureza") === "TRIBUTÁRIA" ? null : (
                    <div className="hidden sm:flex items-center">&nbsp;</div>
                  )}
                </>
              )}
              {/* ====> label VALOR PSS <==== */}
            </div>

            {/* ====> checkbox DESTACAMENTO DE HONORÁRIOS <==== */}
            <div className="my-4 flex w-full flex-row justify-between gap-4 sm:col-span-2">
              <div
                className={`flex flex-row ${watch("ja_possui_destacamento") ? "items-center" : "items-start"} w-full gap-2 sm:col-span-1`}
              >
                <CustomCheckbox
                  check={watch("ja_possui_destacamento")}
                  id={"ja_possui_destacamento"}
                  register={register("ja_possui_destacamento")}
                  defaultChecked
                />

                <label
                  htmlFor="ja_possui_destacamento"
                  className={`${!watch("ja_possui_destacamento") && "mt-1"} font-nexa text-xs font-semibold uppercase text-meta-5`}
                >
                  Já possui destaque de honorários?
                </label>
              </div>
              {watch("ja_possui_destacamento") === false && (
                <div className=" flex w-full flex-row justify-between gap-4 sm:col-span-2">
                  <div className="flex w-full flex-col gap-2 sm:col-span-1">
                    <label
                      htmlFor="percentual_de_honorarios"
                      className="font-nexa text-xs font-semibold uppercase text-meta-5"
                    >
                      Percentual{" "}
                      <span className="text-xs text-meta-5">(%)</span>
                    </label>
                    <input
                      type="number"
                      defaultValue={30}
                      id="percentual_de_honorarios"
                      className="h-[37px] w-full rounded-md border border-strokedark bg-form-input px-3 py-2 text-sm font-medium text-bodydark"
                      {...register("percentual_de_honorarios", {})}
                    />
                  </div>
                </div>
              )}
            </div>
            {/* ====> end checkbox DESTACAMENTO DE HONORÁRIOS <==== */}

            {/* calculate button */}
            <button
              type="submit"
              className="mb-8 mt-15 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-700 px-8 py-3 text-sm text-white transition-all duration-200 hover:bg-blue-800 focus:z-0 2xsm:w-full md:w-fit"
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
          {loading ? (
            <AutomatedProposalSkeleton />
          ) : (
            <>
              {showResults && (
                <React.Fragment>
                  <div ref={resultsRef} className="flex flex-col 2xsm:p-10 md:my-20 md:gap-10">
                    <div>
                      <h2 className="text-2xl font-medium uppercase text-snow">
                        Tudo pronto!
                      </h2>
                      <p className="text-bodydark">
                        Abaixo foram gerados os valores mínimos e máximos de
                        proposta e comissão. Mova os sliders para alterar os valores
                        proporcionalmente.
                      </p>
                    </div>
                    <div className="mt-10 grid gap-10 text-bodydark">
                      <div className="flex items-center justify-between gap-5 2xsm:flex-col md:flex-row">
                        <div className="relative flex flex-col items-center">
                          <h4 className="">Proposta Mínima</h4>
                          <span>{numberFormat(proposalValue.min)}</span>
                        </div>
                        <div className="flex flex-1 flex-col items-center gap-1">
                          <span className="text-sm font-medium">
                            Proposta Atual: {numberFormat(sliderValues.proposal)}
                          </span>
                          <input
                            type="range"
                            step="0.01"
                            min={proposalValue.min}
                            max={proposalValue.max}
                            value={sliderValues.proposal}
                            onChange={handleProposalSliderChange}
                            className="w-full"
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <h4 className="">Proposta Máxima</h4>
                          <span>{numberFormat(proposalValue.max)}</span>
                        </div>
                      </div>

                      <div className="relative flex items-center justify-between gap-5 2xsm:flex-col md:flex-row">
                        <div className="flex flex-col items-center">
                          <h4 className="">Comissão Mínima</h4>
                          <span>{numberFormat(comissionValue.min)}</span>
                        </div>
                        <div className="flex flex-1 flex-col items-center gap-1">
                          <span className="text-sm font-medium">
                            Comissão Atual: {numberFormat(sliderValues.comission)}
                          </span>
                          <input
                            type="range"
                            step="0.01"
                            min={comissionValue.min}
                            max={comissionValue.max}
                            value={sliderValues.comission}
                            onChange={handleComissionSliderChange}
                            className="w-full"
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <h4 className="">Comissão Máxima</h4>
                          <span>{numberFormat(comissionValue.max)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 2xsm:flex-wrap pb-25">
                    {/* register button */}
                    <Link
                      href={APP_ROUTES.public.register.name}
                      className="flex h-14 items-center justify-center rounded-md min-w-[305px] bg-blue-700 px-4 py-2 text-snow transition-all duration-300 hover:bg-blue-800 2xsm:w-[295px] md:w-fit font-medium uppercase"
                    >
                      Cadastrar este ativo no Celer
                    </Link>
                    {/* register button */}

                    {/* whatsapp button */}
                    <button
                      className={`${headerColorset === "glass" ? "cursor-pointer opacity-100" : "cursor-default opacity-0"} flex min-w-[305px] place-items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-snow uppercase font-medium transition-all duration-300 hover:bg-green-600`}
                      onClick={sendProposalToWhatsApp}
                    >
                      <span>Enviar para um consultor Ativos</span>
                      <FaWhatsapp className="h-10 w-10 text-snow" />
                    </button>
                    {/* end whatsapp button */}
                  </div>
                </React.Fragment>
              )}
            </>
          )}
        </div>
      </div>
      {/* end form */}

      {/* ----> back to top button <---- */}
      {/* TODO: criar componente para esse botão */}
      <button
        title="ir ao topo da página"
        onClick={() => scrollTo(mainRef.current)}
        className={`fixed bottom-28 2xsm:right-5 sm:right-10 lg:right-14 w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 bg-opacity-10 bg-clip-padding backdrop-blur-sm backdrop-filter ${isFloatingButtonsVisible ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"} transition-all duration-500`}>
        <BiChevronUp className="animate-upforward text-4xl text-snow" />
      </button>

      {/* floating whatsapp button */}
      <button
        onClick={sendDefaultWhatsAppMessage}
        title="falar com um consultor Ativos"
        className={`fixed bottom-10 2xsm:right-3.5 md:right-8 xl:right-12 w-15 h-15 rounded-full flex items-center justify-center drop-shadow-2 bg-green-400 ${isFloatingButtonsVisible ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"} transition-all duration-500`}>
        <FaWhatsapp className="h-10 w-10 text-snow" />
      </button>
      {/* floating whatsapp button */}

      {/* footer */}
      <MainFooter />

    </div>
  );
};

export default AutomatedProposal;
