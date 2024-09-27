import { ACCESS_TOKEN } from "@/constants/constants";
import {
  UserInfoAPIContext,
  UserInfoContextType,
} from "@/context/UserInfoContext";
import statusOficio from "@/enums/statusOficio.enum";
import tipoOficio from "@/enums/tipoOficio.enum";
import numberFormat from "@/functions/formaters/numberFormat";
import UseMySwal from "@/hooks/useMySwal";
import { JWTToken } from "@/types/jwtToken";
import api from "@/utils/api";
import Cleave from "cleave.js/react";
import { jwtDecode } from "jwt-decode";
import { Slash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import InputMask from "react-input-mask";
import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineLoading, AiOutlineReload, AiOutlineWarning } from "react-icons/ai";
import {
  BiChevronRight,
  BiLineChart,
  BiLogoUpwork,
  BiMinus,
  BiPlus,
} from "react-icons/bi";

import { UpdatePrecatorioButton } from "../Button/UpdatePrecatorioButton";
import { DrawerConta } from "../Drawer/DrawerConta";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { ShadSelect } from "../ShadSelect";
import { SelectItem } from "../ui/select";
import { PaginatedResponse } from "../TaskElements";
import { Avatar } from "flowbite-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CustomCheckbox from "../CrmUi/Checkbox";

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

const MainForm: React.FC<CVLDFormProps> = ({
  dataCallback,
  setCalcStep,
  setDataToAppend,
}) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const queryClient = useQueryClient();
  const enumOficiosList = Object.values(statusOficio);
  const enumTipoOficiosList = Object.values(tipoOficio);

  const { data } =
    useContext<UserInfoContextType>(UserInfoAPIContext);

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
  ];

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

  const [oficioForm, setOficioForm] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingUsersList, setFetchingUsersList] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [toggleNovaConta, setToggleNovaConta] = useState<boolean>(false);
  const [accountList, setAccountList] = useState<PaginatedResponse<any> | null>(
    null,
  );
  const [selectedAccount, setSelectedAccount] = useState<{
    id: string;
    nome_razao_social: string;
  }>({
    id: "",
    nome_razao_social: "",
  });

  const [usersList, setUsersList] = useState<any[]>([]);

  const [contatoNumberCount, setContatoNumberCount] = useState<number>(1);

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

  /* função que atualiza lista de usuários (somente na role ativos) */
  const updateUsersList = async () => {
    setFetchingUsersList(true);
    const [usersList] = await Promise.all([api.get("/api/notion-api/list/users/")]);
    if (usersList.status === 200) {
      setUsersList(usersList.data);
    }
    setFetchingUsersList(false);
  }

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
  }, [oficioForm, setValue]);

  useEffect(() => {
    const fetchData = async () => {
      setFetchingUsersList(true);
      const [accountList] = await Promise.all([api.get("/api/conta/list/")]);
      if (accountList.status === 200) {
        setAccountList(accountList.data);
      }
      if (data.role === "ativos") {
        const [usersList] = await Promise.all([api.get("/api/notion-api/list/users/")]);
        if (usersList.status === 200) {
          setUsersList(usersList.data);
          setFetchError(false);
        } else {
          setFetchError(true);
        }
      };
      setFetchingUsersList(false);
    };

    fetchData();
  }, [data.role]);

  useEffect(() => {
    if (selectedAccount?.id) {
      setValue("conta", selectedAccount.id);
    }
  }, [selectedAccount, setValue]);

  const isUserAdmin = () => {
    const token = localStorage.getItem(`ATIVOS_${ACCESS_TOKEN}`);
    const decoded: JWTToken = jwtDecode(token!);
    return decoded.is_staff;
  };

  function backendNumberFormat(value: string) {
    if (!value?.replace) {
      return "0.00";
    }

    return (
      value.replace("R$ ", "").replaceAll(".", "").replaceAll(",", ".") ||
      "0.00"
    );
  }

  const postNotionData = async (data: any) => {
    const response = await api.post("/api/extrato/create/", data)
    return response;
  }

  const mutation = useMutation({
    mutationFn: (newData) => {
      return postNotionData(newData);
    },
    onMutate: async (newData) => {
      queryClient.cancelQueries({ queryKey: ['notion_list'] });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["notion_list"], (oldData: any) => {
        return { ...oldData, results: [data.data.result[1], ...oldData.results] };
      });
    }
  })


  const onSubmit = async (data: any) => {
    data.valor_principal = backendNumberFormat(data.valor_principal) || 0;
    data.valor_juros = backendNumberFormat(data.valor_juros) || 0;
    data.valor_pss = backendNumberFormat(data.valor_pss) || 0;

    //#TODO colocar essa condicional dentro de uma função utilitária
    if (!data.data_limite_de_atualizacao_check) {
      const dateInSaoPaulo = new Date().toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      const formattedDate = dateInSaoPaulo.split('/').reverse().join('-');
      data.data_limite_de_atualizacao = formattedDate;
    }

    if (!data.status) {
      data.status = "Realizar Primeiro Contato";
    }


    if (!data.natureza) {
      data.natureza = "NÃO TRIBUTÁRIA";
    }

    if (!data.esfera) {
      data.esfera = "FEDERAL";
    }

    if (!data.regime) {
      data.regime = "GERAL";
    }

    if (!data.ir_incidente_rra) {
      data.numero_de_meses = undefined;
    }

    if (!data.incidencia_pss) {
      data.valor_pss = 0;
    }

    if (!data.upload_notion) {
      data.upload_notion = true;
    }

    if (!data.npu) {
      data.npu = "0000000-00.0000.0.00.0000";
    }

    if (!data.numero_de_meses) {
      data.numero_de_meses = 0;
    }

    if (data.upload_notion) {
      data.notion_db_id = "notion_central_de_prec_db_id";
    }

    if (!data.vincular_usuario) {
      data.username = undefined;
    }

    if (data.ja_possui_destacamento) {
      data.percentual_de_honorarios = 30;
    }


    setLoading(true);

    const mySwal = UseMySwal();

    try {
      setCalcStep("calculating");


      const response = data.gerar_cvld
        ? await mutation.mutateAsync(data)
        : await api.post("/api/extrato/query/", data)

      response.status === 200
        ? dataCallback(response.data)
        : (setDataToAppend(response.data), dataCallback(response.data));


      if (response.status === 201 || response.status === 200) {
        // setCredits({
        //   ...credits,
        //   available_credits:
        //     credits.available_credits - response.data.result[0].price,
        // });

        dataCallback(response.data)


        setCalcStep("done");

        const formatedPrincipal = parseFloat(data.valor_principal).toFixed(2);
        const formatedUpdatedPrincipal = parseFloat(
          response.data.result[0].principal_atualizado_requisicao,
        ).toFixed(2);

        if (data.natureza === "TRIBUTÁRIA") {
          const series = [
            {
              name: "Valor Principal",
              data: [
                Number(parseFloat(formatedPrincipal)),
                Number(parseFloat(formatedPrincipal)),
              ],
            },
            {
              name: "Valor Juros",
              data: [
                Number(parseFloat(data.valor_juros).toFixed(2)),
                Number(
                  parseFloat(response.data.result[0].juros_atualizado).toFixed(
                    2,
                  ),
                ),
              ],
            },
            {
              name: "Total",
              data: [
                Number(
                  parseFloat(response.data.result[0].valor_inscrito).toFixed(2),
                ),
                Number(
                  parseFloat(
                    response.data.result[0].valor_liquido_disponivel,
                  ).toFixed(2),
                ),
              ],
            },
          ];

          setState({ series });
        } else {
          const series = [
            {
              name: "Valor Principal",
              data: [
                Number(parseFloat(formatedPrincipal)),
                Number(parseFloat(formatedUpdatedPrincipal)),
              ],
            },
            {
              name: "Valor Juros",
              data: [
                Number(parseFloat(data.valor_juros).toFixed(2)),
                Number(
                  parseFloat(
                    response.data.result[0].juros_atualizados_requisicao,
                  ).toFixed(2),
                ),
              ],
            },
            {
              name: "Total",
              data: [
                Number(
                  parseFloat(response.data.result[0].valor_inscrito).toFixed(2),
                ),
                Number(
                  parseFloat(
                    response.data.result[0].valor_liquido_disponivel,
                  ).toFixed(2),
                ),
              ],
            },
          ];
          setState({ series });
        }
      }
      setLoading(false);
    } catch (error: any) {
      if (
        error.response?.status === 401 &&
        error.response?.data.code === "token_not_valid"
      ) {
        mySwal.fire({
          icon: "error",
          title: "Erro",
          text: "Sua sessão expirou. Faça login novamente.",
        });
        localStorage.clear();
        window.location.href = "auth/signin";
      } else if (
        error.response?.status === 400 &&
        (error.response.data.subject == "NO_CASH" ||
          error.response.data.subject == "INSUFFICIENT_CASH")
      ) {
        mySwal.fire({
          icon: "warning",
          title: "Saldo insuficiente",
          showConfirmButton: false,
          showCloseButton: true,
          html: (
            <div className="flex flex-col rounded-md border border-stroke dark:border-strokedark dark:bg-boxdark">
              <div className="my-2 flex items-center justify-center">
                <p className="text-md font-semibold dark:text-white">
                  Escolha uma das opções de recarga e continue utilizando a
                  plataforma
                </p>
              </div>
              <div className="mt-2 flex flex-col rounded-md border border-stroke p-4 dark:border-strokedark dark:bg-boxdark">
                <Link
                  href="#"
                  className="text-md group flex flex-row items-center justify-center font-semibold text-primary dark:text-white"
                >
                  Adquirir Créditos
                  <BiChevronRight
                    style={{
                      width: "22px",
                      height: "22px",
                    }}
                    className="ml-1 inline-block transition-all duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          ),
        });
      } else if (error.response?.status === 403) {
        mySwal.fire({
          icon: "warning",
          title: "Erro",
          text: "Alguns campos estão incorretos. Verifique e tente novamente.",
        });
      } else {
        mySwal.fire({
          icon: "error",
          title: "Erro",
          text: error.response?.data.detail,
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="col-span-12 rounded-md border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex-col flex-wrap items-start justify-between gap-3 pb-0 sm:flex-nowrap">
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
        <p className="apexcharts-legend-text mt-0 text-center text-sm font-normal">
          Nosso modelo de atualização de valores de precatórios e RPVs
        </p>
      </div>
      <div className="flex w-full flex-col items-center">
        <UpdatePrecatorioButton setStateFunction={setOficioForm} />
      </div>
      {
        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("conta")} />
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2">
            <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
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
            <div className="invisible 2xsm:hidden sm:flex w-full flex-col gap-2 sm:col-span-1 "></div>

            <div className="flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
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
            <div className="flex flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
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

            <div className="flex min-h-17.5 flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
              <div className="relative mb-6 flex flex-col justify-between">
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

            <div className="flex flex-col gap-2 2xsm:col-span-2 2xsm:mt-3 sm:col-span-1 sm:mt-0">
              <div className="relative mb-6 flex flex-col justify-between">
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
            <div
              className={`flex items-center col-span-1 gap-2 ${watch("data_base") < "2021-12-01" && watch("natureza") !== "TRIBUTÁRIA" ? "" : "hidden"}`}
            >

              <CustomCheckbox
                check={watch("incidencia_juros_moratorios")}
                id={'incidencia_juros_moratorios'}
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
              className={`flex items-center col-span-2 gap-2 ${watch("data_base") > "2021-12-01" && watch("natureza") !== "TRIBUTÁRIA" ? "" : "hidden"}`}
            >

              <CustomCheckbox
                check={watch("nao_incide_selic_no_periodo_db_ate_abril")}
                id={'nao_incide_selic_no_periodo_db_ate_abril'}
                register={register("nao_incide_selic_no_periodo_db_ate_abril")}
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
            <div className="flex items-center gap-2 col-span-2">
              <CustomCheckbox
                check={watch("incidencia_rra_ir")}
                id={'incidencia_rra_ir'}
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
              <div className={`flex gap-2 ${watch("ir_incidente_rra") ? 'items-start' : 'items-center'} 2xsm:col-span-2 sm:col-span-1`}>
                <CustomCheckbox
                  check={watch("ir_incidente_rra")}
                  id={'ir_incidente_rra'}
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
            {watch("natureza") !== "TRIBUTÁRIA" ? (
              <div className={`flex gap-2 ${watch('incidencia_pss') ? 'items-start' : 'items-center'} 2xsm:col-span-2 sm:col-span-1`}>
                <CustomCheckbox
                  check={watch("incidencia_pss")}
                  id={'incidencia_pss'}
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
            <div className={`flex gap-2 ${watch("data_limite_de_atualizacao_check") ? "items-start" : "items-center"} 2xsm:col-span-2 sm:col-span-1`}>
              <CustomCheckbox
                check={watch("data_limite_de_atualizacao_check")}
                id={'data_limite_de_atualizacao_check'}
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
              <div className="flex flex-col gap-2 justify-between 2xsm:col-span-2 sm:col-span-1">
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
                {watch("data_limite_de_atualizacao") <
                  watch("data_requisicao") ? (
                  <span
                    role="alert"
                    className="absolute right-4 top-4 text-sm text-red-500"
                  >
                    Data de atualização deve ser maior que a data de requisição
                  </span>
                ) : null}
              </div>
            ) : null}

            {/* CVLD */}
            <div className="flex flex-col gap-2 col-span-2">
              <div className="flex gap-2 items-center ">
                <CustomCheckbox
                  check={watch("gerar_cvld")}
                  id={'gerar_cvld'}
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
                    {/* <span className="text-lg font-semibold text-black dark:text-white">Dados do Principal</span> */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2"></div>

                    <div className="mb-4 flex w-full justify-end gap-2 2xsm:flex-col sm:flex-row sm:col-span-2">
                      <span className="text-md w-full self-center font-semibold">
                        Dados de Identificação
                      </span>
                      {!window.location.href.includes(
                        "https://ativoscvld.vercel.app/",
                      ) && (
                          <div className="flex flex-col">
                            <div className="flex justify-end">
                              <div className="flex -space-x-1 self-end">
                                {accountList?.results.map((account) => (
                                  <Avatar
                                    onClick={() => {
                                      setSelectedAccount({
                                        id: account.id,
                                        nome_razao_social:
                                          account.nome_razao_social,
                                      });

                                      console.log(selectedAccount);
                                    }}
                                    key={account.id}
                                    rounded
                                    placeholderInitials={
                                      account.nome_razao_social.split(" ")
                                        .length > 1
                                        ? account.nome_razao_social
                                          .split(" ")[0]
                                          .charAt(0) +
                                        account.nome_razao_social
                                          .split(" ")[1]
                                          .charAt(0)
                                        : account.nome_razao_social.charAt(0)
                                    }
                                    alt={account.nome_razao_social}
                                    className="[&>div>div>span]:text-xs [&>div>div>span]:text-white [&>div>div]:border [&>div>div]:border-whiter [&>div>div]:bg-[#4f5e77]"
                                    size="sm"
                                  />
                                ))}

                                <button
                                  type="button"
                                  className="group relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-stroke bg-gray-200 text-primary transition-all duration-300 ease-in-out hover:w-32 dark:border-strokedark dark:bg-[#4f5e77] dark:text-white"
                                  onClick={() =>
                                    setToggleNovaConta(!toggleNovaConta)
                                  }
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
                                    <span className="-ml-20 whitespace-nowrap font-satoshi font-normal opacity-0 transition-all duration-300 ease-in-out group-hover:ml-2 group-hover:opacity-100">
                                      Nova conta
                                    </span>
                                  </div>
                                </button>
                              </div>
                            </div>
                            {selectedAccount.nome_razao_social ? (
                              <div className="flex w-full flex-col gap-2 sm:col-span-2">
                                <label
                                  htmlFor="conta"
                                  className="font-nexa text-xs font-semibold uppercase text-meta-5"
                                >
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
                            ) : (
                              <span className="w-[158px] self-end text-xs font-semibold">
                                Vincular ou criar nova conta
                              </span>
                            )}
                          </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
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
                    <div className="my-4 flex w-full flex-row justify-between gap-4 sm:col-span-2">
                      <div className="flex w-full flex-col gap-2 sm:col-span-1">
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
                      <div className=" flex w-full flex-row justify-between gap-4 sm:col-span-2">
                        <div className="flex w-full flex-col gap-2 sm:col-span-1">
                          <label
                            htmlFor="especie"
                            className="font-nexa text-xs font-semibold uppercase text-meta-5"
                          >
                            Espécie
                          </label>
                          <ShadSelect
                            name="especie"
                            control={control}
                            defaultValue="PRINCIPAL"
                          >
                            <SelectItem value="PRINCIPAL">PRINCIPAL</SelectItem>
                            <SelectItem value="HONORARIOS_CONTRATUAIS">
                              HONORÁRIOS CONTRATUAIS
                            </SelectItem>
                            <SelectItem value="HONORARIOS_SUCUMBENCIAs">
                              HONORÁRIOS SUCUMBENCIAIS
                            </SelectItem>
                          </ShadSelect>
                        </div>
                      </div>
                      {/* <div className="invisible flex w-full flex-col gap-2 sm:col-span-1 "></div> */}
                    </div>
                    {(watch("especie") === "PRINCIPAL" ||
                      watch("especie") === undefined) && (
                        <div className="my-4 flex w-full flex-row justify-between gap-4 sm:col-span-2">
                          <div className={`flex flex-row ${watch('ja_possui_destacamento') ? 'items-center' : 'items-start'} w-full gap-2 sm:col-span-1`}>
                            <CustomCheckbox
                              check={watch("ja_possui_destacamento") || true}
                              id={'ja_possui_destacamento'}
                              register={register("ja_possui_destacamento")}
                              defaultChecked
                            />
                            {/* <input
                              type="checkbox"
                              id="ja_possui_destacamento"
                              defaultChecked
                              className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                              {...register("ja_possui_destacamento")}
                            /> */}
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
                      )}

                    <span className="text-md w-full self-center font-semibold">
                      Dados do Processo
                    </span>
                    <div className="mb-4 grid grid-cols-2 w-full justify-between gap-4 sm:col-span-2">
                      <div className="flex w-full flex-col gap-2 2xsm:col-span-4 sm:col-span-1">
                        <label
                          htmlFor="npu"
                          className="font-nexa text-xs font-semibold uppercase text-meta-5"
                        >
                          Processo de Execução - NPU
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
                      {watch("esfera") !== "FEDERAL" && watch("esfera") !== undefined &&
                        (<div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                          <label
                            htmlFor="natureza"
                            className="font-nexa text-xs font-semibold uppercase text-meta-5"
                          >
                            Regime
                          </label>
                          <ShadSelect name="regime" control={control} defaultValue="GERAL">
                            <SelectItem value="GERAL">GERAL</SelectItem>
                            <SelectItem value="ESPECIAL">ESPECIAL</SelectItem>
                          </ShadSelect>
                        </div>)
                      }
                    </div>

                    <div className="my-4 grid grid-cols-2 w-full justify-between gap-4 sm:col-span-2">
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

                      <div className="flex w-full flex-col gap-2 2xsm:col-span-2 sm:col-span-1">
                        <label
                          htmlFor="estado_ente_devedor"
                          className="font-nexa text-xs font-semibold uppercase text-meta-5"
                        >
                          Estado do Ente Devedor
                        </label>
                        <ShadSelect
                          name="estado_ente_devedor"
                          control={control}
                        >
                          {estados.map((estado) => (
                            <SelectItem key={estado.id} value={estado.id}>
                              {estado.nome}
                            </SelectItem>
                          ))}
                        </ShadSelect>
                      </div>
                    </div>

                    <div className="my-4 flex w-full flex-row justify-between gap-4 sm:col-span-2">
                      <div className="flex w-full flex-col gap-2 sm:col-span-1">
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
                      <div className="flex w-full flex-col gap-2 sm:col-span-1">
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
                        >
                          {tribunais.map((tribunal) => (
                            <SelectItem key={tribunal.id} value={tribunal.id}>
                              {tribunal.nome}
                            </SelectItem>
                          ))}
                        </ShadSelect>
                      </div>
                    </div>

                    <div className="flex w-full flex-row justify-between gap-4 sm:col-span-2">
                      <div className="flex w-full flex-col gap-2 sm:col-span-1">
                        <label
                          htmlFor="tipo"
                          className="font-nexa text-xs font-semibold uppercase text-meta-5"
                        >
                          Tipo
                        </label>

                        <ShadSelect
                          name="tipo_do_oficio"
                          control={control}
                          defaultValue={enumTipoOficiosList[0]}
                        >
                          {enumTipoOficiosList.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </ShadSelect>
                      </div>
                      <div className="flex w-full flex-col gap-2 sm:col-span-1">
                        <label
                          htmlFor="status"
                          className="font-nexa text-xs font-semibold uppercase text-meta-5"
                        >
                          Status
                        </label>
                        <ShadSelect
                          name="status"
                          control={control}
                          defaultValue={enumOficiosList[0]}
                        >
                          {enumOficiosList.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </ShadSelect>
                      </div>
                    </div>
                    {/* campos de e-mail/telefones */}
                    <span className="text-lg font-semibold mt-8">Contato</span>
                    <div className="grid grid-cols-2 gap-4 justify-between w-full sm:col-span-2">
                      <div className="flex flex-col gap-2 w-full 2xsm:col-span-2 sm:col-span-1">
                        <label htmlFor="email_contato" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                          Email de Contato
                        </label>

                        <input
                          type="email"
                          id="email_contato"
                          placeholder='ada@lovelace.com'
                          className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                          {...register("email_contato", {})}
                        />
                      </div>
                      <div className="relative flex flex-col gap-2 w-full 2xsm:col-span-2 sm:col-span-1">
                        <label htmlFor="telefone_contato" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                          Telefone de Contato
                        </label>

                        <input
                          type="tel"
                          id="telefone_contato"
                          placeholder='(00) 00000-0000'
                          className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                          {...register("telefone_contato", {})}
                        />
                        {contatoNumberCount === 1 && (
                          <div
                            title='Adicionar telefone de contato'
                            onClick={() => setContatoNumberCount(2)}
                            className='absolute right-2 top-0 w-4 h-4 rounded-sm flex items-center justify-center bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 cursor-pointer'>
                            <BiPlus />
                          </div>
                        )}
                      </div>
                    </div>
                    {/* copy */}
                    {contatoNumberCount > 1 && (
                      <div className="grid grid-cols-2 gap-4 mt-6 justify-between w-full sm:col-span-1">
                        <div className="relative flex flex-col gap-2 w-full 2xsm:col-span-2 sm:col-span-1">
                          <label htmlFor="telefone_contato_2" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                            Telefone de Contato (2)
                          </label>

                          <input
                            type="tel"
                            id="telefone_contato"
                            placeholder='(00) 00000-0000'
                            className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                            {...register("telefone_contato_2", {})}
                          />
                          {contatoNumberCount === 2 && (
                            <>
                              <div
                                title='Adicionar telefone de contato'
                                onClick={() => setContatoNumberCount(3)}
                                className='absolute right-7 top-0 w-4 h-4 rounded-sm flex items-center justify-center bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 cursor-pointer'>
                                <BiPlus />
                              </div>
                              <div
                                title='Remover telefone de contato'
                                onClick={() => setContatoNumberCount(1)}
                                className='absolute right-2 top-0 w-4 h-4 rounded-sm flex items-center justify-center bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 cursor-pointer'>
                                <BiMinus />
                              </div>
                            </>
                          )}
                        </div>
                        {contatoNumberCount > 2 && (
                          <div className="relative flex flex-col gap-2 w-full 2xsm:col-span-2 sm:col-span-1">
                            <label htmlFor="telefone_contato_3" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                              Telefone de Contato (3)
                            </label>

                            <input
                              type="tel"
                              id="telefone_contato"
                              placeholder='(00) 00000-0000'
                              className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                              {...register("telefone_contato_3", {})}
                            />
                            {contatoNumberCount === 3 && (
                              <div
                                title='Remover telefone de contato'
                                onClick={() => setContatoNumberCount(2)}
                                className='absolute right-2 top-0 w-4 h-4 rounded-sm flex items-center justify-center bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 cursor-pointer'>
                                <BiMinus />
                              </div>
                            )
                            }
                          </div>
                        )}
                      </div>
                    )}
                    {/* end campos de e-mail/telefones */}
                    {/* <span className="text-lg font-semibold mt-8">Contato</span> */}
                    <div className="relative flex w-full flex-row justify-between gap-4 sm:col-span-2">
                      {/* <div className="flex flex-col gap-2 w-full sm:col-span-1">
                          <label htmlFor="email_contato" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                            Email de Contato
                          </label>

                      <div className="flex flex-col gap-2 w-full col-span-1">
                        <label htmlFor="juizo_vara" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                          Juízo/Vara
                        </label>
                        <input
                          type="text"
                          id="juizo_vara"
                          className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2 h-[37px]"
                          {...register("juizo_vara", {})} />
                      </div>
                      <div className="flex flex-col gap-2 w-full col-span-1">
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

                      <div className="flex flex-col gap-2 w-full 2xsm:col-span-2 sm:col-span-1">
                        <label htmlFor="tipo" className="text-xs text-meta-5 font-semibold font-nexa uppercase">
                          Tipo
                        </label>

                      {/* <input
                            type="tel"
                            id="telefone_contato"
                            placeholder='(00) 00000-0000'
                            className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                            {...register("telefone_contato", {})}
                          /> */}
                      {/* {contatoNumberCount === 1 && (
                          <div
                            title='Adicionar telefone de contato'
                            onClick={() => setContatoNumberCount(2)}
                            className='absolute right-2 top-0 w-4 h-4 rounded-sm flex items-center justify-center bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 cursor-pointer'>
                            <BiPlus />
                          </div>
                        )} */}
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

                    </div>
                  </>
                ) : null}
              </div>
              {(data.role === "ativos" || data.role === "judit") &&
                watch("gerar_cvld") ? (
                <>
                  <hr className="col-span-2 my-8 border border-stroke dark:border-strokedark" />
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <div className="flex gap-2 invisible">
                        <CustomCheckbox
                          check={watch("upload-notion")}
                          id={'upload-notion'}
                          register={register("upload-notion")}
                        />
                        {/* <input
                          type="checkbox"
                          id="upload_notion"
                          disabled={watch("regime") === "ESPECIAL" ? true : false}
                          defaultChecked={true}
                          className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark disabled:opacity-50 disabled:cursor-not-allowed`}
                          {...register("upload_notion")}
                        /> */}
                        <label
                          htmlFor="upload_notion"
                          aria-disabled={watch("regime") === "ESPECIAL" ? true : false}
                          className="text-sm font-medium text-meta-5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Fazer upload para o Notion <span className="text-meta-7 text-xs">{watch("regime") === "ESPECIAL" ? " - não negociamos ofícios do regime especial" : null}</span>
                        </label>
                      </div>
                      {watch("upload_notion") === true && data.role === "ativos" && watch("regime") !== "ESPECIAL" || watch('regime') === undefined ? (
                        <>
                          <div className="flex justify-between">
                            <div className="flex gap-2 items-center">
                              <CustomCheckbox
                                check={watch("vincular_usuario")}
                                id={'vincular_usuario'}
                                register={register("vincular_usuario")}
                              />
                              {/* <input
                                type="checkbox"
                                id="vincular_usuario"
                                className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                                {...register("vincular_usuario")}
                              /> */}
                              <label htmlFor="vincular_usuario" className="text-sm font-medium text-meta-5 flex flex-row align-self-baseline cursor-pointer">
                                <BiLogoUpwork className="h-4 w-4 mt-0.5 mr-2" /> Vincular a outro usuário?
                              </label>
                            </div>
                            {(watch("novo_usuario") === false || watch("novo_usuario") === undefined) && watch("vincular_usuario") === true && (
                              <div className="flex gap-2 items-center">
                                <button
                                  type="button"
                                  className="py-1 px-2 flex items-center justify-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-100 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                                  onClick={updateUsersList}
                                >
                                  {fetchingUsersList ? (
                                    <>
                                      <AiOutlineReload className="animate-spin" />
                                      <span className="text-xs">Atualizando...</span>
                                    </>
                                  ) : (
                                    <>
                                      <AiOutlineReload />
                                      <span className="text-xs">Atualizar</span>
                                    </>
                                  )}
                                </button>
                                {fetchError && (
                                  <div className='relative group/warning'>
                                    <AiOutlineWarning className="text-red-600 dark:text-red-400 cursor-pointer" />
                                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-60 p-4 bg-white border border-stroke dark:bg-boxdark dark:border-form-strokedark text-sm rounded-md opacity-0 group-hover/warning:opacity-100 transition-opacity duration-300 pointer-events-none">
                                      <span>
                                        Erro ao atualizar os dados. Tente novamente mais tarde.
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          {watch("vincular_usuario") === true ? (
                            <div className="flex flex-col gap-2">
                              {
                                (watch("novo_usuario") === false || watch("novo_usuario") === undefined) && watch("vincular_usuario") === true && (

                                  <select id="username" className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark" {...register("username")}>
                                    <option value={data.user}>{
                                      data.user
                                    }</option>
                                    {
                                      usersList.filter(user => user !== data.user).map((user) => (
                                        <option key={user} value={user}>{user}</option>
                                      ))
                                    }
                                  </select>

                                )}
                              <div className="flex flex-col gap-2">
                                <div>
                                  <label htmlFor="novo_usuario" className="text-sm font-medium text-meta-5 cursor-pointer flex items-center gap-1">
                                    {/* <span className="text-meta-7 text-xs">👤</span> */}
                                    <CustomCheckbox
                                      check={watch("novo_usuario")}
                                      id={'novo_usuario'}
                                      register={register("novo_usuario")}
                                    />
                                    <span>O nome não está na lista? Crie um novo usuário!</span>
                                    {/* <input
                                      type="checkbox"
                                      id="novo_usuario"
                                      className={`h-[15px] w-[15px] cursor-pointer rounded-[3px] border-2 border-body bg-transparent duration-100 selection:ring-0 focus-within:ring-0 dark:border-bodydark`}
                                      {...register("novo_usuario")}
                                    /> */}
                                  </label>
                                </div>
                                {watch('novo_usuario') === true &&
                                  <input
                                    type="text"
                                    id="username"
                                    className="w-full rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark"
                                    {...register("username")}
                                  />
                                }
                              </div>
                            </div>
                          ) : null}
                        </>

                      ) : null}
                    </div>
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
              <span className="text-[16px] font-medium" aria-disabled={loading}>
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
      }
      <DrawerConta
        open={toggleNovaConta}
        setOpen={setToggleNovaConta}
        loading={loading}
      />
    </div >
  );
};

export default MainForm;
