import { estados } from "@/constants/estados";
import { tribunais } from "@/constants/tribunais";
import { DefaultLayoutContext } from "@/context/DefaultLayoutContext";
import {
  UserInfoAPIContext,
  UserInfoContextType,
} from "@/context/UserInfoContext";
import tipoOficio from "@/enums/tipoOficio.enum";
import backendNumberFormat from "@/functions/formaters/backendNumberFormat";
import { formatCurrency } from "@/functions/formaters/formatCurrency";
import numberFormat from "@/functions/formaters/numberFormat";
import UseMySwal from "@/hooks/useMySwal";
import { CvldFormInputsProps } from "@/types/cvldform";
import { LeadMagnetResposeProps } from "@/types/leadMagnet";
import api from "@/utils/api";
import { AxiosError } from "axios";
import Cleave from "cleave.js/react";
import { Slash } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Controller, useForm } from "react-hook-form";
import {
  AiOutlineLoading,
  AiOutlineReload,
  AiOutlineWarning,
} from "react-icons/ai";
import {
  BiCheck,
  BiLineChart,
  BiLogoUpwork,
  BiSave,
  BiX,
} from "react-icons/bi";
import { toast } from "sonner";
import { Button } from "../Button";
import { UpdatePrecatorioButton } from "../Button/UpdatePrecatorioButton";
import CustomCheckbox from "../CrmUi/Checkbox";
import NewFormResultSkeleton from "../Skeletons/NewFormResultSkeleton";

const NewForm = () => {
  const { modalOpen, setModalOpen } = useContext(DefaultLayoutContext);
  const [oficioForm, setOficioForm] = useState<any>(null);
  const mySwal = UseMySwal();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingUsersList, setFetchingUsersList] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState<boolean>(false);
  const enumTipoOficiosList = Object.values(tipoOficio);
  const [backendResponse, setBackendResponse] = useState<LeadMagnetResposeProps>({
    id: "",
    min_proposal: 0,
    max_proposal: 0,
    min_comission: 0,
    max_comission: 0,
    min_proposal_percent: 0,
    max_proposal_percent: 0,
    memoria_de_calculo_simples: "",
    memoria_de_calculo_rra: "",
  });
  const [showResults, setShowResults] = useState<boolean>(false);
  const [sliderValues, setSliderValues] = useState({
    proposal: 0,
    comission: 0,
  });
  const [savingProposalAndComission, setSavingProposalAndComission] = useState<boolean>(false);
  const { data } = useContext<UserInfoContextType>(UserInfoAPIContext);
  const resultContainerRef = useRef<HTMLDivElement | null>(null);
  const proposalRef = useRef<HTMLInputElement | null>(null);
  const comissionRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<Partial<CvldFormInputsProps>>({
    defaultValues: {
      numero_de_meses: 0,
      gerar_cvld: true
    },
  });

  /* função que atualiza lista de usuários (somente na role ativos) */
  const updateUsersList = async () => {
    setFetchingUsersList(true);
    const [usersList] = await Promise.all([
      api.get("/api/notion-api/list/users/"),
    ]);
    if (usersList.status === 200) {
      setUsersList(usersList.data);
    }
    setFetchingUsersList(false);
  };

  // Função para atualizar a proposta e ajustar a comissão proporcionalmente
  const handleProposalSliderChange = (
    value: string,
    sliderChange:boolean
  ) => {
    const newProposalSliderValue = parseFloat(value);
    setSliderValues((oldValues) => {
      return { ...oldValues, proposal: newProposalSliderValue };
    });

    // Calcular a proporção em relação a proposta e ajustar a comissão
    const proportion =
      (newProposalSliderValue - backendResponse.min_proposal) /
      (backendResponse.max_proposal - backendResponse.min_proposal);

    const newComissionSliderValue =
      backendResponse.max_comission -
      proportion * (backendResponse.max_comission - backendResponse.min_comission);

    setSliderValues((oldValues) => {
      return { ...oldValues, comission: newComissionSliderValue };
    });

    if (comissionRef.current && proposalRef.current) {
      comissionRef.current.value = numberFormat(newComissionSliderValue)
      if (sliderChange) {
        proposalRef.current.value = numberFormat(newProposalSliderValue)
      }
    }

  };

  // Função para atualizar a comissão e ajustar a proposta proporcionalmente
  const handleComissionSliderChange = (
    value: string,
    sliderChange:boolean
  ) => {
    const newComissionSliderValue = parseFloat(value);
    setSliderValues((oldValues) => {
      return { ...oldValues, comission: newComissionSliderValue };
    });

    // Calcular a proporção em relação a comissão e ajustar a proposta
    const proportion =
      (newComissionSliderValue - backendResponse.min_comission) /
      (backendResponse.max_comission - backendResponse.min_comission);

    const newProposalSliderValue =
      backendResponse.max_proposal - proportion * (backendResponse.max_proposal - backendResponse.min_proposal);

    setSliderValues((oldValues) => {
      return { ...oldValues, proposal: newProposalSliderValue };
    });

    if (proposalRef.current && comissionRef.current) {
      proposalRef.current.value = numberFormat(newProposalSliderValue)
      if (sliderChange) {
        comissionRef.current.value = numberFormat(newComissionSliderValue)
      }
    }

  };

  // Função para atualizar proposta/comissão com os dados dos inputs
  const changeInputValues = (inputField: string, value: string) => {
    const rawValue = value.replace(/R\$\s*/g, "").replaceAll(".", "").replaceAll(",", ".");
    switch (inputField) {
      case "proposal":
        setSliderValues(old => {
          return {
            ...old,
            proposal: parseFloat(rawValue)
          }
        });
        handleProposalSliderChange(rawValue, false);
        break;
      case "comission":
        setSliderValues(old => {
          return {
            ...old,
            comission: parseFloat(rawValue)
          }
        });
        handleComissionSliderChange(rawValue, false);
        break;
      default:
        break;
    }

  }

  const onSubmit = async (data: any) => {
    setLoading(true);

    if (resultContainerRef.current) {
      resultContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }

    data.valor_principal = backendNumberFormat(data.valor_principal) || 0;
    data.valor_juros = backendNumberFormat(data.valor_juros) || 0;
    data.valor_pss = backendNumberFormat(data.valor_pss) || 0;

    if (data.tipo_do_oficio === "CREDITÓRIO") {
      const dateInSaoPaulo = new Date().toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      const formattedDate = dateInSaoPaulo.split("/").reverse().join("-");
      data.data_requisicao = formattedDate;
    }

    if (data.valor_aquisicao_total) {
      data.percentual_a_ser_adquirido = 1;
    } else {
      data.percentual_a_ser_adquirido /= 100;
    }

    if (data.tribunal === "TRF1" || data.tribunal === "TRF6") {
      data.nao_incide_selic_no_periodo_db_ate_abril = true;
    }

    if (!data.regime) {
      data.regime = "GERAL";
    }

    if (data.data_base > "2021-12-01") {
      data.incidencia_juros_moratorios = false;
    }

    if (data.ja_possui_destacamento) {
      data.percentual_de_honorarios = 0;
    } else {
      data.percentual_de_honorarios /= 100;
    }

    if (data.gerar_cvld) {
      data.upload_notion = true;
    }

    if (!data.estado_ente_devedor) {
      data.estado_ente_devedor = null;
    }

    if (!data.data_limite_de_atualizacao_check) {
      const dateInSaoPaulo = new Date().toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      const formattedDate = dateInSaoPaulo.split("/").reverse().join("-");
      data.data_limite_de_atualizacao = formattedDate;
    }
    try {
      const response = data.gerar_cvld
        ? await api.post("/api/lead-magnet/save/", data)
        : await api.post("/api/lead-magnet/", data);

      if (response.status === 200 || response.status === 201) {
        if (response.status === 201) {
          toast.success('Dados salvos no Notion com Sucesso!', {
            icon: <BiCheck className="text-lg fill-green-400" />
          });
        }
        const results = response.data.result; // pega o resultado da requisição
        setBackendResponse(results)
        setShowResults(true);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error((error.response?.data.error || "Erro ao salvar dados no Notion!"), {
          icon: <BiX className="text-lg fill-red-500" />
        });
      } else {
        toast.error(String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const saveProposalAndComission = async () => {
    setSavingProposalAndComission(true);
    const req = await api.patch(`/api/notion-api/broker/negotiation/${backendResponse.id}/`,
      {
        proposal: sliderValues.proposal,
        commission: sliderValues.comission
      }
    )

    if (req.status === 202) {
      toast.success('Proposta e comissão salvas com sucesso!', {
        icon: <BiCheck className="text-lg fill-green-400" />
      });
    }

    if (req.status === 400) {
      toast.error('Erro ao salvar proposta e comissão!', {
        icon: <BiX className="text-lg fill-red-500" />
      });
    }
    setSavingProposalAndComission(false);
  }

  useEffect(() => {
    setSliderValues({
      proposal: backendResponse.min_proposal,
      comission: backendResponse.max_comission,
    });
    if (proposalRef.current && comissionRef.current) {
      proposalRef.current.value = numberFormat(backendResponse.min_proposal)
      comissionRef.current.value = numberFormat(backendResponse.max_comission)
    }
  }, [backendResponse]);

  useEffect(() => {
    if (oficioForm) {
      setValue("natureza", oficioForm.result[0].natureza);
      setValue(
        "valor_principal",
        numberFormat(oficioForm.result[0].valor_principal).replace("R$", ""),
      );
      setValue(
        "valor_juros",
        numberFormat(oficioForm.result[0].valor_juros).replace("R$", ""),
      );
      setValue(
        "data_base",
        oficioForm.result[0].data_base.split("/").reverse().join("-"),
      );

      if (oficioForm.result[0].data_base < "2021-12-01") {
        setValue("incidencia_juros_moratorios", true);
      }

      setValue(
        "data_requisicao",
        oficioForm.result[0].data_requisicao.split("/").reverse().join("-"),
      );
      setValue("ir_incidente_rra", oficioForm.result[0].incidencia_rra_ir);

      if (oficioForm.result[0].incidencia_juros_moratorios) {
        setValue("incidencia_juros_moratorios", true);
      } else {
        setValue("incidencia_juros_moratorios", false);
      }
      setValue("numero_de_meses", oficioForm.result[0].numero_de_meses);
      setValue(
        "incidencia_pss",
        oficioForm.result[0].valor_pss > 0 ? true : false,
      );
      setValue(
        "valor_pss",
        numberFormat(oficioForm.result[0].valor_pss).replace("R$", ""),
      );
    }
  }, [oficioForm]);

  return (
    <div
      className={`absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black-2/50 ${modalOpen ? "visible opacity-100" : "hidden opacity-0"}`}
    >
      <Fade
        className="overflow-hidden 2xsm:h-[90%] 2xsm:w-11/12 lg:w-10/12 xl:h-4/5"
        damping={0.1}
      >
        <div className="h-full w-full rounded-sm border border-stroke bg-white p-5 dark:border-strokedark dark:bg-boxdark 2xsm:text-sm md:text-base">
          <div className="mb-10 flex max-h-[15%] gap-2">
            <div className="flex-1 flex-col flex-wrap items-start justify-between gap-3 pb-0 sm:flex-nowrap">
              <div className="flex w-full justify-center align-middle">
                <h2 className="mt-1.5 flex select-none flex-col justify-center font-nexa text-3xl font-normal text-primary antialiased">
                  Celer
                </h2>
                <p className="flex flex-col justify-center text-xs font-semibold text-primary">
                  <Slash className="-mr-3 mt-1 h-5 w-5 -rotate-45 text-gray-200" />
                </p>
                <Image
                  src="/images/logo/celer-ia-only-logo.svg"
                  alt="Celler IA Engine"
                  width={56}
                  height={50}
                  className="mt-[6.1px] select-none antialiased"
                  aria-selected={false}
                  draggable={false}
                />
              </div>
              <p className="apexcharts-legend-text mt-0 text-center font-rooftop text-sm">
                Nosso modelo de atualização de valores de precatórios e RPVs
              </p>
            </div>
            <span
              title="fechar"
              onClick={() => setModalOpen(false)}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              <BiX className="text-2xl" />
            </span>
          </div>

          <div className="grid h-[83%] grid-cols-12 gap-4 overflow-y-scroll">
            {/* form */}
            <div className="col-span-12 p-3 xl:col-span-7">
              <div className="col-span-12 mx-auto flex w-full flex-col justify-center">
                <UpdatePrecatorioButton setStateFunction={setOficioForm} />
              </div>
              <form
                className="mt-8 space-y-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-2">
                  <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                    <label
                      htmlFor="tipo"
                      className="font-nexa text-xs font-semibold uppercase text-meta-5"
                    >
                      Tipo
                    </label>

                    <select
                      defaultValue={"NÃO TRIBUTÁRIA"}
                      className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                      {...register("tipo_do_oficio")}
                    >
                      {enumTipoOficiosList.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {/* <ShadSelect
                                            name="tipo_do_oficio"
                                            control={control}
                                            defaultValue={enumTipoOficiosList[0]}
                                        >
                                            {enumTipoOficiosList.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </ShadSelect> */}
                  </div>

                  <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                    <label
                      htmlFor="natureza"
                      className="font-nexa text-xs font-semibold uppercase text-meta-5"
                    >
                      Natureza
                    </label>

                    <select
                      defaultValue={"NÃO TRIBUTÁRIA"}
                      className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                      {...register("natureza")}
                    >
                      <option value="NÃO TRIBUTÁRIA">não tributária</option>
                      <option value="TRIBUTÁRIA">tributária</option>
                    </select>

                    {/* <ShadSelect
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
                                        </ShadSelect> */}
                  </div>

                  <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                    <label
                      htmlFor="esfera"
                      className="font-nexa text-xs font-semibold uppercase text-meta-5"
                    >
                      Esfera
                    </label>

                    <select
                      defaultValue={"FEDERAl"}
                      className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                      {...register("esfera")}
                    >
                      <option value="FEDERAL">Federal</option>
                      <option value="ESTADUAL">Estadual</option>
                      <option value="MUNICIPAL">Municipal</option>
                    </select>
                  </div>
                  {watch("esfera") !== "FEDERAL" &&
                    watch("esfera") !== undefined && (
                      <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                        <label
                          htmlFor="regime"
                          className="font-nexa text-xs font-semibold uppercase text-meta-5"
                        >
                          Regime
                        </label>
                        <select
                          defaultValue={""}
                          className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                          {...register("regime")}
                        >
                          <option value="GERAL">geral</option>
                          <option value="ESPECIAL">especial</option>
                        </select>
                        {/* <ShadSelect name="regime" control={control} defaultValue="GERAL">
                                                <SelectItem value="GERAL">GERAL</SelectItem>
                                                <SelectItem value="ESPECIAL">ESPECIAL</SelectItem>
                                            </ShadSelect> */}
                      </div>
                    )}

                  <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                    <label
                      htmlFor="tribunal"
                      className="font-nexa text-xs font-semibold uppercase text-meta-5"
                    >
                      Tribunal
                    </label>

                    <select
                      defaultValue={""}
                      className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                      {...register("tribunal")}
                    >
                      {tribunais.map((tribunal) => (
                        <option key={tribunal.id} value={tribunal.id}>
                          {tribunal.nome}
                        </option>
                      ))}
                    </select>
                    {/* <ShadSelect
                                            name="tribunal"
                                            control={control}
                                            defaultValue={tribunais[0].nome}
                                        >
                                            {tribunais.map((tribunal) => (
                                                <SelectItem key={tribunal.id} value={tribunal.id}>
                                                    {tribunal.nome}
                                                </SelectItem>
                                            ))}
                                        </ShadSelect> */}
                  </div>

                  <div className="relative flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
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
                            className={`w-full rounded-md border-stroke ${error ? "border-red" : "dark:border-strokedark"} px-3 py-2 text-sm font-medium dark:bg-boxdark-2 dark:text-bodydark`}
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
                            <span className="absolute right-2 top-8.5 text-xs font-medium text-red">
                              {error.message}
                            </span>
                          )}
                        </>
                      )}
                    />
                  </div>
                  <div className="relative flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
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
                            className={`w-full rounded-md border-stroke ${error ? "border-red" : "dark:border-strokedark"} px-3 py-2 text-sm font-medium dark:bg-boxdark-2 dark:text-bodydark`}
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
                          {error && (
                            <span className="absolute right-2 top-8.5 text-xs font-medium text-red">
                              {error.message}
                            </span>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                    <div className="relative flex flex-col justify-between">
                      <label
                        htmlFor="data_base"
                        className="mb-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                      >
                        Data Base
                      </label>
                      <input
                        type="date"
                        id="data_base"
                        className={`${errors.data_base && "!border-red !ring-0"} w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2`}
                        {...register("data_base", {
                          required: "Campo obrigatório",
                        })}
                        aria-invalid={errors.data_base ? "true" : "false"}
                      />
                      {errors.data_base && (
                        <span className="absolute right-8.5 top-7.5 text-xs font-medium text-red">
                          campo obrigatório
                        </span>
                      )}
                    </div>
                  </div>

                  {watch("tipo_do_oficio") !== "CREDITÓRIO" ? (
                    <div className="flex flex-col gap-2 2xsm:col-span-2 2xsm:mt-3 sm:col-span-1 sm:mt-0">
                      <div className="relative flex flex-col justify-between">
                        <label
                          htmlFor="data_requisicao"
                          className="mb-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                        >
                          Data de Requisição / Recebimento
                        </label>
                        <input
                          type="date"
                          id="data_requisicao"
                          className={`${errors.data_requisicao && "!border-red !ring-0"} w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2`}
                          {...register("data_requisicao", {
                            required: "Campo obrigatório",
                          })}
                        />
                        {errors.data_requisicao && (
                          <span className="absolute right-8.5 top-7.5 text-xs font-medium text-red">
                            campo obrigatório
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="col-span-1 hidden sm:block"></div>
                  )}

                  {watch("esfera") !== "FEDERAL" &&
                    watch("esfera") !== undefined && (
                      <div className="col-span-1"></div>
                    )}

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

                  {/* ====> label PERCENTUAL DE AQUISIÇÃO <==== */}
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

                  {(watch("especie") === "PRINCIPAL" ||
                    watch("especie") === undefined) && (
                    <div className="col-span-2 flex w-full flex-col justify-between gap-4 sm:flex-row">
                      <div
                        className={`flex flex-row ${watch("ja_possui_destacamento") ? "items-center" : "items-start"} w-full gap-2 2xsm:col-span-2 sm:col-span-1`}
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
                          Já possui destacamento de honorários?
                        </label>
                      </div>
                      {watch("ja_possui_destacamento") === false && (
                        <div className=" flex w-full flex-row justify-between gap-4 sm:col-span-2">
                          <div className="flex w-full flex-col gap-2 sm:col-span-1">
                            <label
                              htmlFor="percentual_de_honorarios"
                              className="font-nexa text-xs font-semibold uppercase text-meta-5"
                            >
                              Percentual
                            </label>
                            <input
                              type="number"
                              id="percentual_de_honorarios"
                              defaultValue={30}
                              className="h-[37px] w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                              {...register("percentual_de_honorarios", {})}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={`col-span-2 flex items-center gap-2 md:col-span-1 ${watch("data_base")! < "2021-12-01" && watch("natureza") !== "TRIBUTÁRIA" ? "" : "hidden"}`}
                  >
                    <CustomCheckbox
                      check={watch("incidencia_juros_moratorios")}
                      id={"incidencia_juros_moratorios"}
                      defaultChecked
                      register={register("incidencia_juros_moratorios")}
                    />

                    {/* <input
                  type="checkbox"
                  id="incidencia_juros_moratorios"
                  className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                  defaultChecked
                  {...register("incidencia_juros_moratorios")}
                /> */}
                    <label
                      htmlFor="incidencia_juros_moratorios"
                      className="font-nexa text-xs font-semibold uppercase text-meta-5"
                    >
                      Juros de Mora fixados em sentença
                    </label>
                  </div>
                  <div
                    className={`col-span-2 flex items-center gap-2 ${watch("data_base")! > "2021-12-01" && watch("natureza") !== "TRIBUTÁRIA" ? "" : "hidden"}`}
                  >
                    <CustomCheckbox
                      check={watch("nao_incide_selic_no_periodo_db_ate_abril")}
                      id={"nao_incide_selic_no_periodo_db_ate_abril"}
                      register={register(
                        "nao_incide_selic_no_periodo_db_ate_abril",
                      )}
                    />

                    {/* <input
                  type="checkbox"
                  id="nao_incide_selic_no_periodo_db_ate_abril"
                  className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                  defaultChecked
                  {...register("nao_incide_selic_no_periodo_db_ate_abril")}
                /> */}
                    <label
                      htmlFor="nao_incide_selic_no_periodo_db_ate_abril"
                      className="font-nexa text-xs font-semibold uppercase text-meta-5"
                    >
                      SELIC somente sobre o principal
                    </label>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <CustomCheckbox
                      check={watch("incidencia_rra_ir")}
                      id={"incidencia_rra_ir"}
                      defaultChecked
                      register={register("incidencia_rra_ir")}
                    />
                    {/* <input
                type="checkbox"
                id="incidencia_rra_ir"
                className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                defaultChecked
                {...register("incidencia_rra_ir")}
              /> */}
                    <label
                      htmlFor="incidencia_rra_ir"
                      className="font-nexa text-xs font-semibold uppercase text-meta-5"
                    >
                      Incidência de IR
                    </label>
                  </div>
                  {watch("natureza") === "TRIBUTÁRIA" ||
                  watch("incidencia_rra_ir") === false ? (
                    <>
                      {/* {watch("natureza") === "TRIBUTÁRIA" && watch("incidencia_rra_ir") === false ? null : (
                  <div className="flex items-center col-span-1">&nbsp;</div>
                )} */}
                    </>
                  ) : (
                    <div
                      className={`flex h-6 gap-2 2xsm:col-span-2 md:col-span-1`}
                    >
                      <CustomCheckbox
                        check={watch("ir_incidente_rra")}
                        id={"ir_incidente_rra"}
                        register={register("ir_incidente_rra")}
                      />
                      {/* <input
                  type="checkbox"
                  id="ir_incidente_rra"
                  className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                  {...register("ir_incidente_rra")}
                /> */}
                      <label
                        htmlFor="ir_incidente_rra"
                        className="mt-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                      >
                        IR incidente sobre RRA?
                      </label>
                    </div>
                  )}

                  {watch("ir_incidente_rra") &&
                  watch("incidencia_rra_ir") === true &&
                  watch("natureza") !== "TRIBUTÁRIA" ? (
                    <div className="mt-1 flex flex-col gap-2 overflow-hidden 2xsm:col-span-2 sm:col-span-1">
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
                    <div className="col-span-1 hidden md:block"></div>
                  )}
                  {watch("natureza") !== "TRIBUTÁRIA" ? (
                    <div
                      className={`flex gap-2 ${watch("incidencia_pss") ? "items-start" : "items-center"} 2xsm:col-span-2 sm:col-span-1`}
                    >
                      <CustomCheckbox
                        check={watch("incidencia_pss")}
                        id={"incidencia_pss"}
                        register={register("incidencia_pss")}
                      />
                      {/* <input
                  type="checkbox"
                  id="incidencia_pss"
                  className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                  {...register("incidencia_pss")}
                /> */}
                      <label
                        htmlFor="incidencia_pss"
                        className="mt-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                      >
                        Incide PSS?
                      </label>
                    </div>
                  ) : null}
                  {watch("incidencia_pss") &&
                  watch("natureza") !== "TRIBUTÁRIA" ? (
                    <div className="mt-1 flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
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
                      {watch("natureza") === "TRIBUTÁRIA" ? null : (
                        <div className="hidden items-center md:flex">
                          &nbsp;
                        </div>
                      )}
                    </>
                  )}
                  <div
                    className={`flex gap-2 ${watch("data_limite_de_atualizacao_check") ? "items-start" : "items-center"} 2xsm:col-span-2 sm:col-span-1`}
                  >
                    <CustomCheckbox
                      check={watch("data_limite_de_atualizacao_check")}
                      id={"data_limite_de_atualizacao_check"}
                      register={register("data_limite_de_atualizacao_check")}
                    />
                    {/* <input
                type="checkbox"
                id="data_limite_de_atualizacao_check"
                className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                {...register("data_limite_de_atualizacao_check")}
              /> */}
                    <label
                      htmlFor="data_limite_de_atualizacao_check"
                      className="mt-1 font-nexa text-xs font-semibold uppercase text-meta-5"
                    >
                      Atualizar para data passada?
                    </label>
                  </div>
                  {watch("data_limite_de_atualizacao_check") ? (
                    <div className="mt-1 flex flex-col justify-between gap-2 2xsm:col-span-2 sm:col-span-1">
                      <label
                        htmlFor="data_limite_de_atualizacao"
                        className="font-nexa text-xs font-semibold uppercase text-meta-5"
                      >
                        Atualizado até:
                      </label>
                      <input
                        type="date"
                        id="data_limite_de_atualizacao"
                        className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                        {...register("data_limite_de_atualizacao", {})}
                        min={watch("data_requisicao")}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      {watch("data_limite_de_atualizacao")! <
                      watch("data_requisicao")! ? (
                        <span
                          role="alert"
                          className="absolute right-4 top-4 text-sm text-red-500"
                        >
                          Data de atualização deve ser maior que a data de
                          requisição
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  {/* CVLD */}
                  <div className="col-span-2 flex flex-col gap-2">
                    <div className="flex items-center gap-2 ">
                      <CustomCheckbox
                        check={watch("gerar_cvld")}
                        id={"gerar_cvld"}
                        register={register("gerar_cvld")}
                      />
                      {/* <input
                  type="checkbox"
                  id="gerar_cvld"
                  className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                  {...register("gerar_cvld")}
                /> */}
                      {/* <label htmlFor="gerar_cvld" className="text-sm font-medium text-meta-5">
                    Emitir Certidão de Valor Líquido Disponível (CVLD)?
                  </label> */}
                      <label
                        htmlFor="gerar_cvld"
                        className="font-nexa text-xs font-semibold uppercase text-meta-5"
                      >
                        Salvar informações de ofício e recálculo?
                      </label>
                    </div>
                    <div className="mt-8 flex flex-col gap-2">
                      {watch("gerar_cvld") ? (
                        <>
                          <div className="mb-4 w-full">
                            <span className="text-md w-full self-center font-semibold">
                              Dados de Identificação
                            </span>
                          </div>

                          <div className="mb-4 grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                              <label
                                htmlFor="credor"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                              >
                                Nome/Razão Social
                              </label>
                              <input
                                type="text"
                                id="credor"
                                className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                {...register("credor", {})}
                              />
                            </div>

                            <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                              <label
                                htmlFor="cpf_cnpj"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                              >
                                CPF/CNPJ
                              </label>
                              <input
                                type="text"
                                id="cpf_cnpj"
                                className="h-[37px] w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                {...register("cpf_cnpj", {})}
                              />
                            </div>

                            <div className=" flex w-full flex-row justify-between gap-4 2xsm:col-span-2 sm:col-span-1">
                              <div className="flex w-full flex-col gap-2 sm:col-span-1">
                                <label
                                  htmlFor="especie"
                                  className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
                                  Espécie
                                </label>

                                <select
                                  defaultValue={""}
                                  className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                  {...register("especie")}
                                >
                                  <option value="Principal">principal</option>
                                  <option value="Honorários Contratuais">
                                    honorários contratuais
                                  </option>
                                  <option value="Honorários Sucumbenciais">
                                    honorários sucumbenciais
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <span className="text-md mb-4 w-full self-center font-semibold">
                            Dados do Processo
                          </span>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                              <label
                                htmlFor="npu"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                              >
                                NPU (requisitório)
                              </label>
                              <Controller
                                name="npu"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <Cleave
                                    {...field}
                                    className="h-[37px] w-full rounded-md border border-stroke bg-white px-3 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                    options={{
                                      blocks: [7, 2, 4, 1, 2, 4],
                                      delimiters: ["-", ".", ".", ".", "."],
                                      numericOnly: true,
                                    }}
                                  />
                                )}
                              />
                            </div>

                            <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                              <label
                                htmlFor="npu_originario"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                              >
                                NPU (originario)
                              </label>
                              <Controller
                                name="npu_originario"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                  <Cleave
                                    {...field}
                                    className="h-[37px] w-full rounded-md border border-stroke bg-white px-3 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                    options={{
                                      blocks: [7, 2, 4, 1, 2, 4],
                                      delimiters: ["-", ".", ".", ".", "."],
                                      numericOnly: true,
                                    }}
                                  />
                                )}
                              />
                            </div>

                            <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                              <label
                                htmlFor="ente_devedor"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                              >
                                Ente Devedor
                              </label>
                              <input
                                type="text"
                                id="ente_devedor"
                                className="h-[37px] w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                {...register("ente_devedor", {})}
                              />
                            </div>

                            {watch("esfera") &&
                              watch("esfera") !== "FEDERAL" && (
                                <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                                  <label
                                    htmlFor="estado_ente_devedor"
                                    className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                  >
                                    Estado do Ente Devedor
                                  </label>

                                  <select
                                    defaultValue={""}
                                    className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                    {...register("estado_ente_devedor")}
                                  >
                                    {estados.map((estado) => (
                                      <option key={estado.id} value={estado.id}>
                                        {estado.nome}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}

                            <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                              <label
                                htmlFor="juizo_vara"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                              >
                                Juízo/Vara
                              </label>
                              <input
                                type="text"
                                id="juizo_vara"
                                className="h-[37px] w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                                {...register("juizo_vara", {})}
                              />
                            </div>

                            <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                              <label
                                htmlFor="status"
                                className="font-nexa text-xs font-semibold uppercase text-meta-5"
                              >
                                Status
                              </label>

                              <select
                                defaultValue={""}
                                className="flex h-[37px] w-full cursor-pointer items-center justify-between rounded-md border border-stroke bg-background px-2 py-2 font-satoshi text-xs font-semibold uppercase ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-strokedark dark:bg-boxdark-2 [&>span]:line-clamp-1"
                                {...register("status")}
                              >
                                <option value="Negociação em Andamento">
                                  negociação em andamento
                                </option>
                                <option value="Proposta aceita">
                                  proposta aceita
                                </option>
                              </select>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                    {(data.role === "ativos" || data.role === "judit") &&
                    watch("gerar_cvld") ? (
                      <>
                        <hr className="col-span-2 my-8 border border-stroke dark:border-strokedark" />
                        <div className="flex flex-col gap-2">
                          {(data.role === "ativos" &&
                            watch("regime") !== "ESPECIAL") ||
                          watch("regime") === undefined ? (
                            <>
                              <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                  <CustomCheckbox
                                    check={watch("vincular_usuario")}
                                    id={"vincular_usuario"}
                                    register={register("vincular_usuario")}
                                  />

                                  <label
                                    htmlFor="vincular_usuario"
                                    className="align-self-baseline flex cursor-pointer flex-row text-sm font-medium text-meta-5"
                                  >
                                    <BiLogoUpwork className="mr-2 mt-0.5 h-4 w-4" />{" "}
                                    Vincular a outro usuário?
                                  </label>
                                </div>
                                {(watch("novo_usuario") === false ||
                                  watch("novo_usuario") === undefined) &&
                                  watch("vincular_usuario") === true && (
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        className="flex cursor-pointer items-center justify-center gap-1 rounded-md bg-slate-100 px-2 py-1 opacity-100 transition-all duration-200 hover:bg-slate-200 group-hover:opacity-100 dark:bg-slate-600 dark:hover:bg-slate-700"
                                        onClick={updateUsersList}
                                      >
                                        {fetchingUsersList ? (
                                          <>
                                            <AiOutlineReload className="animate-spin" />
                                            <span className="text-xs">
                                              Atualizando...
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <AiOutlineReload />
                                            <span className="text-xs">
                                              Atualizar
                                            </span>
                                          </>
                                        )}
                                      </button>
                                      {fetchError && (
                                        <div className="group/warning relative">
                                          <AiOutlineWarning className="cursor-pointer text-red-600 dark:text-red-400" />
                                          <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-60 -translate-x-1/2 transform rounded-md border border-stroke bg-white p-4 text-sm opacity-0 transition-opacity duration-300 group-hover/warning:opacity-100 dark:border-form-strokedark dark:bg-boxdark">
                                            <span>
                                              Erro ao atualizar os dados. Tente
                                              novamente mais tarde.
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                              </div>
                              {watch("vincular_usuario") === true ? (
                                <div className="flex flex-col gap-2">
                                  {(watch("novo_usuario") === false ||
                                    watch("novo_usuario") === undefined) &&
                                    watch("vincular_usuario") === true && (
                                      <select
                                        id="username"
                                        className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                        {...register("username")}
                                      >
                                        <option value={data.user}>
                                          {data.user}
                                        </option>
                                        {usersList
                                          .filter((user) => user !== data.user)
                                          .map((user) => (
                                            <option key={user} value={user}>
                                              {user}
                                            </option>
                                          ))}
                                      </select>
                                    )}
                                  <div className="flex flex-col gap-2">
                                    <div>
                                      <label
                                        htmlFor="novo_usuario"
                                        className="flex cursor-pointer items-center gap-1 text-sm font-medium text-meta-5"
                                      >
                                        <CustomCheckbox
                                          check={watch("novo_usuario")}
                                          id={"novo_usuario"}
                                          register={register("novo_usuario")}
                                        />
                                        <span>
                                          O nome não está na lista? Crie um novo
                                          usuário!
                                        </span>
                                      </label>
                                    </div>
                                    {watch("novo_usuario") === true && (
                                      <input
                                        type="text"
                                        id="username"
                                        className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                        {...register("username")}
                                      />
                                    )}
                                  </div>
                                </div>
                              ) : null}
                            </>
                          ) : null}
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="my-8 flex justify-center">
                  <button
                    type="submit"
                    className="my-8 flex cursor-pointer items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm text-white transition-all duration-200 hover:bg-blue-800 focus:z-0"
                  >
                    <span
                      className="text-[16px] font-medium"
                      aria-disabled={loading}
                    >
                      {loading ? "Fazendo cálculo..." : "Calcular"}
                    </span>
                    {!loading ? (
                      <BiLineChart className="ml-2 mt-[0.2rem] h-4 w-4" />
                    ) : (
                      <AiOutlineLoading className="ml-2 mt-[0.2rem] h-4 w-4 animate-spin" />
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* results */}
            <div
              ref={resultContainerRef}
              className="col-span-12 border-stroke px-4 pb-20 pt-3 dark:border-strokedark xl:col-span-5 xl:border-l"
            >
              {loading ? (
                <NewFormResultSkeleton />
              ) : (
                <>
                  {showResults ? (
                    <div className="flex flex-col">
                      <div className="mb-6 flex flex-col gap-2">
                        <h2 className="text-xl font-medium uppercase">
                          Tudo pronto!
                        </h2>
                        <p className="text-sm 2xsm:text-center sm:text-left">
                          Abaixo foram gerados os valores mínimos e máximos de
                          proposta e comissão. Mova os sliders ou use os campos
                          para alterar os valores proporcionalmente.
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-5 p-2 2xsm:flex-col sm:mb-4 md:flex-row">
                        <div className="relative flex flex-col md:items-center">
                          <h4 className="">Proposta Mínima</h4>
                          <span>
                            {numberFormat(backendResponse.min_proposal)}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col items-center gap-1">
                          <div className="flex items-center text-sm font-medium">
                            <p className="w-full">Proposta Atual:</p>
                            <input
                              ref={proposalRef}
                              type="text"
                              onBlur={(e) => {
                                e.target.value = formatCurrency(e.target.value);
                              }}
                              onChange={(e) =>
                                changeInputValues("proposal", e.target.value)
                              }
                              className="ml-2 max-w-39 rounded-md border-none bg-gray-100 py-2 pl-1 pr-2 text-center text-sm font-medium text-body focus-visible:ring-body dark:bg-bodydark1/10 dark:text-bodydark dark:focus-visible:ring-snow"
                            />
                          </div>
                          <input
                            type="range"
                            step="0.01"
                            min={backendResponse.min_proposal}
                            max={backendResponse.max_proposal}
                            value={sliderValues.proposal}
                            onChange={(e) =>
                              handleProposalSliderChange(e.target.value, true)
                            }
                            className="w-full"
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <h4 className="">Proposta Máxima</h4>
                          <span>
                            {numberFormat(backendResponse.max_proposal)}
                          </span>
                        </div>
                      </div>

                      <div className="my-4 h-px w-full bg-stroke dark:bg-strokedark sm:hidden"></div>

                      <div className="relative flex items-center justify-between gap-5 2xsm:flex-col md:flex-row">
                        <div className="flex flex-col items-center">
                          <h4 className="">Comissão Mínima</h4>
                          <span>
                            {numberFormat(backendResponse.min_comission)}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col items-center gap-1">
                          <div className="flex items-center text-sm font-medium">
                            <p className="">Comissão Atual:</p>
                            <input
                              ref={comissionRef}
                              type="text"
                              onBlur={(e) => {
                                e.target.value = formatCurrency(e.target.value);
                              }}
                              onChange={(e) =>
                                changeInputValues("comission", e.target.value)
                              }
                              className="ml-2 max-w-39 rounded-md border-none bg-gray-100 py-2 pl-1 pr-2 text-center text-sm font-medium text-body focus-visible:ring-body dark:bg-bodydark1/10 dark:text-bodydark dark:focus-visible:ring-snow"
                            />
                          </div>
                          <input
                            type="range"
                            step="0.01"
                            min={backendResponse.min_comission}
                            max={backendResponse.max_comission}
                            value={sliderValues.comission}
                            onChange={(e) =>
                              handleComissionSliderChange(e.target.value, true)
                            }
                            className="w-full"
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <h4 className="">Comissão Máxima</h4>
                          <span>
                            {numberFormat(backendResponse.max_comission)}
                          </span>
                        </div>
                      </div>

                      {/* separator */}
                      <div className="my-6 h-px w-full bg-stroke dark:bg-strokedark"></div>
                      {/* end separator */}

                      <div className="flex flex-col gap-5">
                        {backendResponse.id && (
                          <Button
                            onClick={saveProposalAndComission}
                            className="mx-auto mt-4 flex items-center justify-center gap-2 font-medium"
                          >
                            {savingProposalAndComission ? (
                              <>
                                Salvando dados...
                                <AiOutlineLoading className="animate-spin text-lg" />
                              </>
                            ) : (
                              <>
                                Salvar Proposta e Comissão
                                <BiSave className="text-lg text-white" />
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mx-auto flex w-fit flex-col items-center justify-between gap-5">
                      <h4 className="text-xl font-semibold text-black dark:text-white">
                        Ainda sem resultados
                      </h4>
                      <Image
                        src="/images/search-results.svg"
                        alt="mulher procurando resultados"
                        width={200}
                        height={450}
                        aria-selected={false}
                        draggable={false}
                      />
                      <span className="select-none text-center text-sm">
                        Opa! Parece que ainda não há resultados disponíveis.
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default NewForm;
