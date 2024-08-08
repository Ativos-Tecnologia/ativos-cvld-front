import { ACCESS_TOKEN } from '@/constants/constants';
import { UserInfoAPIContext, UserInfoContextType } from '@/context/UserInfoContext';
import statusOficio from '@/enums/statusOficio.enum';
import tipoOficio from '@/enums/tipoOficio.enum';
import numberFormat from '@/functions/formaters/numberFormat';
import UseMySwal from '@/hooks/useMySwal';
import { JWTToken } from '@/types/jwtToken';
import api from '@/utils/api';
import Cleave from 'cleave.js/react';
import { jwtDecode } from 'jwt-decode';
import { Slash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AiOutlineLoading } from 'react-icons/ai';
import { BiChevronRight, BiLineChart, BiLogoUpwork } from 'react-icons/bi';

import { UpdatePrecatorioButton } from '../Button/UpdatePrecatorioButton';
import { DrawerConta } from '../Drawer/DrawerConta';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { ShadSelect } from '../ShadSelect';
import { SelectItem } from '../ui/select';
import { PaginatedResponse } from '../TaskElements';
import { Avatar } from 'flowbite-react';



interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

type CVLDFormProps = {
  dataCallback: (data: any) => void;
  setCalcStep: (stage: string) => void;
  setDataToAppend: (data: any) => void;
};

// interface CPFCNPJprops {
//   blocks: Array<number>;
//   delimiters: Array<string>;
//   numericOnly: boolean;
// }

const MainForm: React.FC<CVLDFormProps> = ({ dataCallback, setCalcStep, setDataToAppend }) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const enumOficiosList = Object.values(statusOficio);
  const enumTipoOficiosList = Object.values(tipoOficio);

  const estados = [
    { id: "AC", nome: "Acre" },
    { id: "AL", nome: "Alagoas" },
    { id: "AP", nome: "Amapá" },
    { id: "AM", nome: "Amazonas" },
    { id: "BA", nome: "Bahia" },
    { id: "CE", nome: "Ceará" },
    { id: "DF", nome: "Distrito Federal" },
    { id: "ES", nome: "Espírito Santo" },
    { id: "GO", nome: "Goiás" },
    { id: "MA", nome: "Maranhão" },
    { id: "MT", nome: "Mato Grosso" },
    { id: "MS", nome: "Mato Grosso do Sul" },
    { id: "MG", nome: "Minas Gerais" },
    { id: "PA", nome: "Pará" },
    { id: "PB", nome: "Paraíba" },
    { id: "PR", nome: "Paraná" },
    { id: "PE", nome: "Pernambuco" },
    { id: "PI", nome: "Piauí" },
    { id: "RJ", nome: "Rio de Janeiro" },
    { id: "RN", nome: "Rio Grande do Norte" },
    { id: "RS", nome: "Rio Grande do Sul" },
    { id: "RO", nome: "Rondônia" },
    { id: "RR", nome: "Roraima" },
    { id: "SC", nome: "Santa Catarina" },
    { id: "SP", nome: "São Paulo" },
    { id: "SE", nome: "Sergipe" },
    { id: "TO", nome: "Tocantins" },
  ]

  const tribunais = [
    { id: "TRF1", nome: "Tribunal Regional Federal - 1ª Região" },
    { id: "TRF2", nome: "Tribunal Regional Federal - 2ª Região" },
    { id: "TRF3", nome: "Tribunal Regional Federal - 3ª Região" },
    { id: "TRF4", nome: "Tribunal Regional Federal - 4ª Região" },
    { id: "TRF5", nome: "Tribunal Regional Federal - 5ª Região" },
    { id: "TRF6", nome: "Tribunal Regional Federal - 6ª Região" },
  ]


  const { setCredits, credits, data } = useContext<UserInfoContextType>(UserInfoAPIContext);

  const [oficioForm, setOficioForm] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [toggleNovaConta, setToggleNovaConta] = useState<boolean>(false);
  const [accountList, setAccountList] = useState<PaginatedResponse<any> | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<{
    id: string;
    nome_razao_social: string;
  }>({
    id: '',
    nome_razao_social: '',
  });

  const mySwal = UseMySwal();




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
    if (oficioForm) {

      setValue("natureza", oficioForm.result[0].natureza);
      setValue("valor_principal", numberFormat(oficioForm.result[0].valor_principal).replace("R$", ""));
      setValue("valor_juros", numberFormat(oficioForm.result[0].valor_juros).replace("R$", ""));
      setValue("data_base", oficioForm.result[0].data_base.split("/").reverse().join("-"));

      if (oficioForm.result[0].data_base < "2021-12-01") {
        setValue("incidencia_juros_moratorios", true);
      }

      setValue("data_requisicao", oficioForm.result[0].data_requisicao.split("/").reverse().join("-"));
      setValue("ir_incidente_rra", oficioForm.result[0].incidencia_rra_ir);

      if (oficioForm.result[0].incidencia_juros_moratorios) {
        setValue("incidencia_juros_moratorios", true);
      } else {
        setValue("incidencia_juros_moratorios", false);
      }
      setValue("numero_de_meses", oficioForm.result[0].numero_de_meses);
      setValue("incidencia_pss", oficioForm.result[0].valor_pss > 0 ? true : false);
      setValue("valor_pss", numberFormat(oficioForm.result[0].valor_pss).replace("R$", ""));
    }

  }, [oficioForm, setValue]);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [accountList] = await Promise.all([api.get("/api/conta/list/")]);
      if (accountList.status === 200) {
        setAccountList(accountList.data);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Atualiza o valor do campo hidden quando selectedAccount mudar
    if (selectedAccount?.id) {
      setValue("conta", selectedAccount.id);
    }
  }, [selectedAccount, setValue]);

  const isUserAdmin = () => {
    const token = localStorage.getItem(`ATIVOS_${ACCESS_TOKEN}`);
    const decoded: JWTToken = jwtDecode(token!);
    return decoded.is_staff;
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



    if (!data.data_limite_de_atualizacao_check) {
      data.data_limite_de_atualizacao = new Date().toISOString().split("T")[0];
    }

    if (!data.status) {
      data.status = 'ENCARTEIRADO';
    }

    if (!data.natureza) {
      data.natureza = "NÃO TRIBUTÁRIA";
    }

    if (!data.ir_incidente_rra) {
      data.numero_de_meses = undefined;
    }

    if (!data.incidencia_pss) {
      data.valor_pss = 0;
    }

    if (!data.upload_notion) {
      data.upload_notion = false;
    }

    if (!data.npu) {
      data.npu = "0000000-00.0000.0.00.0000";
    }

    if (!data.numero_de_meses) {
      data.numero_de_meses = 0;
    }

    setLoading(true);

    try {
      setCalcStep("calculating");

      const response = data.gerar_cvld ? await api.post("/api/extrato/create/", data) : await api.post("/api/extrato/query/", data);


      if (response.status === 201 || response.status === 200) {
        setCredits({
          ...credits,
          available_credits: credits.available_credits - response.data.result[0].price,
        });

        response.status === 200 ? dataCallback(response.data) : (
          setDataToAppend(response.data),
          dataCallback(response.data)
        )

        setCalcStep('done');

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



      }
      setLoading(false);
    }

    catch (error: any) {
      if (error.response.status === 401 && error.response.data.code === "token_not_valid") {
        mySwal.fire({
          icon: "error",
          title: "Erro",
          text: "Sua sessão expirou. Faça login novamente.",
        });
        localStorage.clear();
        window.location.href = "auth/signin";
      } else if (error.response.status === 400 && (error.response.data.subject == "NO_CASH" || error.response.data.subject == "INSUFFICIENT_CASH")) {
        mySwal.fire({
          icon: "warning",
          title: "Saldo insuficiente",
          showConfirmButton: false,
          showCloseButton: true,
          html: (
            <div className="flex flex-col border border-stroke rounded-md dark:border-strokedark dark:bg-boxdark">
              <div className="flex items-center justify-center my-2">
                <p className="text-md font-semibold dark:text-white">Escolha uma das opções de recarga e continue utilizando a plataforma</p>
              </div>
              <div className="flex flex-col mt-2 border border-stroke p-4 rounded-md dark:border-strokedark dark:bg-boxdark">
                <Link href='#' className="flex flex-row items-center justify-center group text-primary text-md font-semibold dark:text-white">
                  Adquirir Créditos

                  <BiChevronRight style={{
                    width: "22px",
                    height: "22px",
                  }} className="inline-block ml-1 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          )
        });
      } else if (error.response.status === 403) {
        mySwal.fire({
          icon: "warning",
          title: "Erro",
          text: "Alguns campos estão incorretos. Verifique e tente novamente.",
        });
      } else {
        mySwal.fire({
          icon: "error",
          title: "Erro",
          text: error.response.data.detail,
        });

      }
      setLoading(false);
    }
  }


  return (
    <div className="col-span-12 rounded-md border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex-col flex-wrap items-start justify-between gap-3 sm:flex-nowrap pb-0">
        <div className="w-full flex justify-center align-middle">
          <h2 className='font-nexa text-3xl mt-1.5 font-normal antialiased text-primary flex flex-col justify-center select-none'>
            Celer
          </h2>
          <p className='text-xs font-semibold text-primary flex flex-col justify-center'>
            <Slash className='w-5 h-5 text-gray-200 -rotate-45 mt-1 -mr-3' />
          </p>
          <Image src="/images/logo/celer-ia-only-logo.svg" alt="Celler IA Engine" width={56} height={50} className='mt-[6.1px] select-none antialiased' aria-selected={false}
            draggable={false} />
        </div>
        <p className="text-sm font-normal text-center apexcharts-legend-text mt-0">
          Nosso modelo de atualização de valores de precatórios e RPVs
        </p>
      </div>
      <div className="flex flex-col items-center w-full">
        <UpdatePrecatorioButton setStateFunction={setOficioForm} />

      </div>
      {
        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("conta")} />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2">







            <div className="flex flex-col gap-2 w-full sm:col-span-1">
              <label htmlFor="natureza" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                Natureza
              </label>

              <ShadSelect
                name='natureza'
                control={control}
                defaultValue={"NÃO TRIBUTÁRIA"}

              // className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-xs font-bold dark:border-strokedark dark:bg-boxdark uppercase"

              >
                <SelectItem defaultValue="NÃO TRIBUTÁRIA" value="NÃO TRIBUTÁRIA">Não Tributária</SelectItem>
                <SelectItem value="TRIBUTÁRIA">Tributária</SelectItem>
              </ShadSelect>
            </div>
            <div className="flex flex-col gap-2 w-full sm:col-span-1 invisible ">

            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="valor_principal" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
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
                    className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
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
              <label htmlFor="valor_juros" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                Juros
              </label>
              <Controller
                name="valor_juros"
                control={control}
                defaultValue={0}
                render={({ field }) => (
                  <Cleave
                    {...field}
                    className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
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
              <div className="relative flex flex-col justify-between mb-6">
                <label htmlFor="data_base" className="text-xs text-meta-5 font-semibold font-nexa uppercase mb-1">
                  Data Base
                </label>
                <input
                  type="date"
                  id="data_base"
                  className={`${errors.data_base && '!border-rose-400 !ring-0'} w-full rounded-md border bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark`}
                  {
                  ...register("data_base", {
                    required: "Campo obrigatório",
                  })
                  }
                  aria-invalid={errors.data_base ? "true" : "false"}
                />
                <ErrorMessage errors={errors} field="data_base" />
              </div>
              <div className={`flex items-center gap-2 ${watch("data_base") < "2021-12-01" && watch("natureza") !== "TRIBUTÁRIA" ? "" : "hidden"}`}>
                <input
                  type="checkbox"
                  id="incidencia_juros_moratorios"
                  className="rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                  defaultChecked
                  {
                  ...register("incidencia_juros_moratorios")
                  }
                />
                <label htmlFor="incidencia_juros_moratorios" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                  Juros de Mora fixados em sentença
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="relative flex flex-col justify-between mb-6">
                <label htmlFor="data_requisicao" className="text-xs text-meta-5 font-semibold font-nexa uppercase mb-1">
                  Data de Requisição / Recebimento
                </label>
                <input
                  type="date"
                  id="data_requisicao"
                  className={`${errors.data_requisicao && '!border-rose-400 !ring-0'} w-full rounded-md border bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark`}
                  {
                  ...register("data_requisicao", {
                    required: "Campo obrigatório",
                  })
                  }
                />
                <ErrorMessage errors={errors} field="data_requisicao" />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox"
                id="incidencia_rra_ir"
                className="rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                defaultChecked
                {
                ...register("incidencia_rra_ir")
                }
              />
              <label htmlFor="incidencia_rra_ir" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
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
                    className="rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                    {
                    ...register("ir_incidente_rra")
                    }
                  />
                  <label htmlFor="ir_incidente_rra" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                    IR incidente sobre RRA?
                  </label>
                </div>
              )
            }
            {
              watch("ir_incidente_rra") === true && watch("natureza") !== "TRIBUTÁRIA" ? (
                <div className="flex flex-col gap-2">
                  <label htmlFor="numero_de_meses" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                    Número de meses
                  </label>
                  <input
                    type="number"
                    id="numero_de_meses"
                    className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
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
                    className="rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                    {
                    ...register("incidencia_pss")
                    }
                  />
                  <label htmlFor="incidencia_pss" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                    Incide PSS?
                  </label>
                </div>
              ) : null
            }
            {
              watch("incidencia_pss") && watch("natureza") !== "TRIBUTÁRIA" ? (
                <div className="flex flex-col gap-2">
                  <label htmlFor="valor_pss" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                    PSS
                  </label>
                  <Controller
                    name="valor_pss"
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <Cleave
                        {...field}
                        className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
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
                  className="rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                  {
                  ...register("data_limite_de_atualizacao_check")
                  }
                />
                <label htmlFor="data_limite_de_atualizacao_check" className="text-xs text-meta-5 font-semibold font-nexa uppercase mb-1">
                  Atualizar para data passada?
                </label>
              </div>


            </div>
            {
              watch("data_limite_de_atualizacao_check") ? (
                <div className="flex flex-col justify-between">
                  <label htmlFor="data_limite_de_atualizacao" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                    Atualizado até:
                  </label>
                  <input
                    type="date"
                    id="data_limite_de_atualizacao"
                    className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
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

            {/* CVLD */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <div className="flex gap-2 ">
                <input
                  type="checkbox"
                  id="gerar_cvld"
                  className="rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                  {...register("gerar_cvld")}
                />
                {/* <label htmlFor="gerar_cvld" className="text-sm font-medium text-meta-5">
                    Emitir Certidão de Valor Líquido Disponível (CVLD)?
                  </label> */}
                <label htmlFor="gerar_cvld" className="text-xs font-nexa font-semibold text-meta-5 uppercase">
                  Salvar informações de ofício e recálculo?
                </label>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                {
                  watch("gerar_cvld") ? (
                    <>
                      {/* <span className="text-lg font-semibold text-black dark:text-white">Dados do Principal</span> */}
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2"></div>

                      <div className="flex gap-2 w-full sm:col-span-2 justify-end mb-4">
                        <span className="text-md font-semibold self-center w-full">Dados do Principal</span>
                      {!window.location.href.includes('https://ativoscvld.vercel.app/') && (
                        <div className='flex flex-col'>
                          <div className='flex justify-end'>
                            <div className="flex -space-x-1 self-end">

                              {
                                accountList?.results.map((account) => (
                                  <Avatar onClick={() => {
                                    setSelectedAccount({
                                      id: account.id,
                                      nome_razao_social: account.nome_razao_social,
                                    })

                                    console.log(selectedAccount);


                                  }} key={account.id} rounded placeholderInitials={account.nome_razao_social.split(" ").length > 1 ? account.nome_razao_social.split(" ")[0].charAt(0) + account.nome_razao_social.split(" ")[1].charAt(0) : account.nome_razao_social.charAt(0)} alt={account.nome_razao_social} className='[&>div>div]:bg-[#4f5e77] [&>div>div>span]:text-white [&>div>div>span]:text-xs [&>div>div]:border [&>div>div]:border-whiter' size='sm' />
                                ))
                              }

                              <button
                                type="button"
                                className="relative group flex h-8 w-8 items-center justify-center rounded-full border border-stroke bg-gray-200 text-primary dark:border-strokedark dark:bg-[#4f5e77] dark:text-white transition-all duration-300 ease-in-out hover:w-32 overflow-hidden"
                                onClick={() => setToggleNovaConta(!toggleNovaConta)}
                              >
                                <div className="flex items-center justify-center">
                                  <svg
                                    className="fill-black dark:fill-gray-300"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 16 16"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z"
                                      fill=""
                                    />
                                  </svg>
                                  <span className="-ml-20 opacity-0 font-satoshi font-normal transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:ml-2 whitespace-nowrap">
                                    Nova conta
                                  </span>
                                </div>
                              </button>
                            </div>
                          </div>
                          {
                            selectedAccount.nome_razao_social ? (
                              <div className="flex flex-col gap-2 w-full sm:col-span-2">
                                <label htmlFor="conta" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                                  Conta
                                </label>
                                <input
                                  type="text"
                                  id="conta"
                                  className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                  value={selectedAccount.nome_razao_social}
                                  readOnly
                                />
                              </div>
                            ) : (<span className='text-xs font-semibold self-end w-[158px]'>Vincular ou criar nova conta</span>)
                          }
                        </div>

)}
                      </div>


                      <div className="flex flex-col gap-2">
                        <label htmlFor="credor" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                          Nome/Razão Social do Credor Principal
                        </label>
                        <input
                          type="text"
                          id="credor"
                          className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                          {...register("credor", {})} />
                      </div>
                      <div className="flex flex-row gap-4 justify-between w-full sm:col-span-2 my-4">

                        <div className="flex flex-col gap-2 w-full sm:col-span-1">
                          <label htmlFor="cpf_cnpj" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                            CPF/CNPJ
                          </label>
                          <input
                            type="text"
                            id="cpf_cnpj"
                            className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                            {...register("cpf_cnpj", {})} />
                        </div>
                        <div className="flex flex-col gap-2 w-full sm:col-span-1 invisible ">

                        </div>







                      </div>
                      <span className="text-md font-semibold self-center w-full">Dados do Processo</span>
                      <div className="flex flex-row gap-4 justify-between w-full sm:col-span-2 mb-4">


                        <div className="flex flex-col gap-2 w-full sm:col-span-1">
                          <label htmlFor="npu" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                            Processo de Execução - NPU
                          </label>
                          <Controller
                            name="npu"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <Cleave
                                {...field}
                                className="w-full rounded-md border border-stroke bg-white px-3 text-sm font-medium dark:border-strokedark dark:bg-boxdark h-[34.5px]"
                                options={{
                                  blocks: [7, 2, 4, 1, 2, 4],
                                  delimiters: ['.', '-', '.', '.', '.'],
                                  numericOnly: true
                                }}
                              />
                            )}
                          />
                        </div>

                        <div className="flex flex-col gap-2 w-full sm:col-span-1">
                          <label htmlFor="natureza" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                            Esfera
                          </label>
                          <ShadSelect
                            name='esfera'
                            control={control}
                          >
                            <SelectItem value="FEDERAL">Federal</SelectItem>
                            <SelectItem value="ESTADUAL">Estadual</SelectItem>
                            <SelectItem value="MUNICIPAL">Municipal</SelectItem>
                          </ShadSelect>
                        </div>
                      </div>

                      <div className="flex flex-row gap-4 justify-between w-full sm:col-span-2 my-4">

                        <div className="flex flex-col gap-2 w-full sm:col-span-1">
                          <label htmlFor="ente_devedor" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                            Ente Devedor
                          </label>
                          <input
                            type="text"
                            id="ente_devedor"
                            className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark  h-[34.5px]"
                            {...register("ente_devedor", {})} />

                        </div>

                        <div className="flex flex-col gap-2 w-full sm:col-span-1">
                          <label htmlFor="estado_ente_devedor" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                            Estado do Ente Devedor
                          </label>
                          <ShadSelect
                            name='estado_ente_devedor'
                            control={control}
                          >
                            {
                              estados.map((estado) => (
                                <SelectItem key={estado.id} value={estado.id}>{estado.nome}</SelectItem>
                              ))
                            }
                          </ShadSelect>
                        </div>
                      </div>


                      <div className="flex flex-row gap-4 justify-between w-full sm:col-span-2 my-4">
                        <div className="flex flex-col gap-2 w-full sm:col-span-1">
                          <label htmlFor="juizo_vara" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                            Juízo/Vara
                          </label>
                          <input
                            type="text"
                            id="juizo_vara"
                            className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark h-[34.5px]"
                            {...register("juizo_vara", {})} />
                        </div>
                        <div className="flex flex-col gap-2 w-full sm:col-span-1">
                          <label htmlFor="tribunal" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                            Tribunal
                          </label>
                          <ShadSelect
                            name="tribunal"
                            control={control}
                            defaultValue={tribunais[0].nome}
                          >
                            {
                              tribunais.map((tribunal) => (
                                <SelectItem key={tribunal.id} value={tribunal.id}>{tribunal.nome}</SelectItem>
                              ))
                            }
                          </ShadSelect>
                        </div>

                      </div>

                      <div className="flex flex-row gap-4 justify-between w-full sm:col-span-2">
                        <div className="flex flex-col gap-2 w-full sm:col-span-1">
                          <label htmlFor="tipo" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                            Tipo
                          </label>

                          <ShadSelect
                            name="tipo_do_oficio"
                            control={control}
                            defaultValue={enumTipoOficiosList[0]}
                          >
                            {
                              enumTipoOficiosList.map((status) => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                              ))
                            }
                          </ShadSelect>
                        </div>
                        <div className="flex flex-col gap-2 w-full sm:col-span-1">
                          <label htmlFor="status" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                            Status
                          </label>
                          <ShadSelect
                            name="status"
                            control={control}
                            defaultValue={enumOficiosList[0]}
                          >
                            {
                              enumOficiosList.map((status) => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                              ))
                            }
                          </ShadSelect>
                        </div>

                      </div>
                      <span className="text-lg font-semibold mt-8">Contato</span>
                      <div className="flex flex-row gap-4 justify-between w-full sm:col-span-2">

                        <div className="flex flex-col gap-2 w-full sm:col-span-1">
                          <label htmlFor="email" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                            Email de Contato
                          </label>

                          <input
                            type="email"
                            id="email_contato"
                            placeholder='ada@lovelace.com'
                            className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                            {...register("email_contato", {})} />
                        </div>
                        <div className="flex flex-col gap-2 w-full sm:col-span-1">
                          <label htmlFor="status" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                            Telefone de Contato
                          </label>
                          <input
                            type="tel"
                            id="telefone_contato"
                            placeholder='(00) 00000-0000'
                            className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                            {...register("telefone_contato", {})} />


                        </div>

                      </div>
                      {/* <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-4">
                          <span className="text-lg font-semibold text-primary mt-8">Dados do Colaborador</span>
                          &nbsp;
                          <div className="flex flex-col gap-2">
                            <label htmlFor="nome_funcionario" className="text-sm font-medium text-meta-5">
                              Nome
                            </label>
                            <input
                              type="text"
                              id="nome_funcionario"
                              className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("nome_funcionario", {})} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="matricula" className="text-sm font-medium text-meta-5">
                              Matrícula
                            </label>
                            <input
                              type="text"
                              id="matricula"
                              className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("matricula", {})} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="cargo" className="text-sm font-medium text-meta-5">
                              Cargo
                            </label>
                            <input
                              type="text"
                              id="cargo"
                              className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("cargo", {})} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="und_administrativa" className="text-sm font-medium text-meta-5">
                              Unidade Administrativa
                            </label>
                            <input
                              type="text"
                              id="und_administrativa"
                              className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("und_administrativa", {})} />
                          </div>
                          <div className="flex flex-col gap-2 sm:col-span-2 mt-4">
                            <div className="flex gap-2 ">
                              <input
                                type="checkbox"
                                id="possui_subscritor"
                                className="rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
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
                                    className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                    {...register("nome_funcionario_subscritor", {})} />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label htmlFor="matricula_funcionario_subscritor" className="text-sm font-medium text-meta-5">
                                    Matrícula
                                  </label>
                                  <input
                                    type="text"
                                    id="matricula_funcionario_subscritor"
                                    className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                    {...register("matricula_funcionario_subscritor", {})} />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label htmlFor="cargo_funcionario_subscritor" className="text-sm font-medium text-meta-5">
                                    Cargo
                                  </label>
                                  <input
                                    type="text"
                                    id="cargo_funcionario_subscritor"
                                    className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                    {...register("cargo_funcionario_subscritor", {})} />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label htmlFor="und_administrativa_funcionario_subscritor" className="text-sm font-medium text-meta-5">
                                    Unidade Administrativa
                                  </label>
                                  <input
                                    type="text"
                                    id="und_administrativa_funcionario_subscritor"
                                    className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
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
                              className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("credor", {})} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="cpf_cnpj" className="text-sm font-medium text-meta-5">
                              CPF/CNPJ
                            </label>
                            <input
                              type="text"
                              id="cpf_cnpj"
                              className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("cpf_cnpj", {})} />
                          </div>

                          <div className="flex flex-col gap-2 sm:col-span-2 mt-0">
                            <div className="flex gap-2 ">
                              <input
                                type="checkbox"
                                id="possui_advogado"
                                className="rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
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
                                    className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                    {...register("nome_advogado", {})} />
                                </div>
                                <div className="flex flex-col">
                                  <label htmlFor="cpf_cnpj_advogado" className="text-sm font-medium text-meta-5">
                                    CPF/CNPJ
                                  </label>
                                  <input
                                    type="text"
                                    id="cpf_cnpj_advogado"
                                    className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
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
                                className="rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
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
                                  className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                  {...register("nome_cessionario", {})} />
                              </div>
                              <div className="flex flex-col">
                                <label htmlFor="cpf_cnpj_cessionario" className="text-sm font-medium text-meta-5">
                                  CPF/CNPJ
                                </label>
                                <input
                                  type="text"
                                  id="cpf_cnpj_cessionario"
                                  className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
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
                              className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("credor_solicitante", {})} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="cpf_cnpj_credor_solicitante" className="text-sm font-medium text-meta-5">
                              CPF/CNPJ do Credor Solicitante
                            </label>
                            <input
                              type="text"
                              id="cpf_cnpj_credor_solicitante"
                              className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
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
                                  className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
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
                                  className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
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
                              className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("numero_requisicao", {})} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="juizo_vara" className="text-sm font-medium text-meta-5">
                              Juízo/Vara
                            </label>
                            <input
                              type="text"
                              id="juizo_vara"
                              className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("juizo_vara", {})} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label htmlFor="tribunal" className="text-sm font-medium text-meta-5">
                              Tribunal
                            </label>
                            <select
                              id="tribunal"
                              className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
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
                              className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                              {...register("n_precatorio", {})} />
                          </div>
                        </div> */}
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* <div className="flex flex-col gap-2">
                        <label htmlFor="valor_penhora" className="text-sm font-medium text-meta-5">
                          Penhora/Arresto <span className="text-xs text-meta-4">(se houver)</span>
                        </label>
                        <input
                          type="text"
                          id="valor_penhora"
                          className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark disabled:opacity-50 cursor-not-allowed"
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
                          className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark disabled:opacity-50 cursor-not-allowed"
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
                          className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark disabled:opacity-50 cursor-not-allowed"
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
                          className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark disabled:opacity-50 cursor-not-allowed"
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
                          className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark disabled:opacity-50 cursor-not-allowed"
                          {...register("outras_deducoes", {})} />
                      </div> */}
                      </div></>
                  ) : null
                }
              </div>
              {
                (data.role === "ativos" || data.role === "judit") && watch("gerar_cvld") ? (
                  <><hr className="border border-stroke dark:border-strokedark my-8 col-span-2" /><div className="flex flex-col gap-2">
                    {/* <span className="text-lg font-semibold text-primary mb-4">Opções de Administrador 🛡️</span> */}
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <div className="flex gap-2">
                        <input type="checkbox"
                          id="upload_notion"
                          defaultChecked={false}
                          className="rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                          {...register("upload_notion")} />
                        <label htmlFor="upload_notion" className="text-sm font-medium text-meta-5">
                          Fazer upload para o Notion
                        </label>
                      </div>
                      {watch("upload_notion") === true ? (
                        <div className="flex flex-col gap-2">
                          <label htmlFor="notion_db_id" className="text-sm font-medium text-meta-5 flex flex-row align-self-baseline">
                            <BiLogoUpwork className="h-4 w-4 mt-0.5 mr-2" /> Selecione o Workspace
                          </label>
                          <select id="notion_db_id" className="flex uppercase font-semibold font-satoshi text-xs w-full items-center justify-between rounded-md border border-input bg-background px-2 py-2  ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:bg-boxdark-2"

                            {...register("notion_db_id", {
                              required: "Campo obrigatório",
                            })}
                            defaultValue={"notion_prec_fed_db_id"}>
                            {data.role === "ativos" && (
                              <>
                              <option value="notion_prec_fed_db_id">PRECATÓRIOS FEDERAIS - BASE PRÓPRIA</option>
                              <option value="notion_prec_reg_com_db_id">PRECATÓRIOS REGIME COMUM - BASE PRÓPRIA</option>
                              <option value="notion_prec_fed_partners_db_id">PRECATÓRIOS FEDERAIS - PARCEIROS</option>
                              <option value="notion_prec_reg_com_partners_db_id">PRECATÓRIOS REGIME COMUM - PARCEIROS</option>
                              <option value="notion_prec_prospect_dev_db_id">Dev</option></>
                            )}

                            {
                              data.role === "judit" || data.role === "ativos" && (
                                <>
                                  <option value="notion_prec_fed_judit_db_id">PRECATÓRIOS FEDERAIS - JUDIT</option>
                                  <option value="notion_prec_reg_com_judit_db_id">PRECATÓRIOS REGIME COMUM - JUDIT</option>
                                </>
                              )
                            }
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
            <button type='submit' className='flex items-center justify-center cursor-pointer rounded-lg px-5 py-3 my-8 focus:z-0 text-sm text-white bg-blue-700 hover:bg-blue-800 transition-all duration-200'>
              <span className="text-[16px] font-medium" aria-disabled={loading}>
                {loading ? "Fazendo cálculo..." : "Calcular"}
              </span>
              {
                !loading ? (<BiLineChart className="mt-[0.2rem] ml-2 h-4 w-4" />) : (<AiOutlineLoading className="mt-[0.2rem] ml-2 h-4 w-4 animate-spin" />)
              }
            </button>
          </div>
        </form>
      }
      <DrawerConta open={toggleNovaConta} setOpen={setToggleNovaConta} loading={loading} />
    </div>
  );
};

export default MainForm;
