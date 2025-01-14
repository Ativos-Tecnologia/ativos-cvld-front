"use client";

import { Form } from "@/components/ui/form";
import { estados } from "@/constants/estados";
import { tipoRegime } from "@/constants/regime-casamento";
import { tribunais } from "@/constants/tribunais";
import { BrokersContext } from "@/context/BrokersContext";
import {
  UserInfoAPIContext,
  UserInfoContextType,
} from "@/context/UserInfoContext";
import { InputFieldVariant } from "@/enums/inputFieldVariants.enum";
import backendNumberFormat from "@/functions/formaters/backendNumberFormat";
import dateFormater from "@/functions/formaters/dateFormater";
import numberFormat from "@/functions/formaters/numberFormat";
import percentageFormater from "@/functions/formaters/percentFormater";
import { findRentabilidadeAoAnoThroughDesembolso, handleDesembolsoVsRentabilidade } from "@/functions/juridico/solverDesembolsoVsRentabilidade";
import UseMySwal from "@/hooks/useMySwal";
import { NotionPage } from "@/interfaces/INotion";
import { IWalletResponse } from "@/interfaces/IWallet";
import api from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import { BiInfoCircle, BiSave, BiSolidCalculator, BiSolidCoinStack, BiX } from "react-icons/bi";
import { BsCalendar2HeartFill, BsPencilSquare } from "react-icons/bs";
import { FaBalanceScale, FaIdCard, FaMapMarkedAlt, FaRegFilePdf } from "react-icons/fa";
import { FaBuilding, FaBuildingColumns, FaLink, FaUser } from "react-icons/fa6";
import { GiPayMoney, GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import { GrDocumentText, GrDocumentUser } from "react-icons/gr";
import { IoIosPaper } from "react-icons/io";
import { IoCalendar, IoDocumentTextSharp, IoGlobeOutline } from "react-icons/io5";
import { LuClipboardCheck, LuCopy, LuHandshake } from "react-icons/lu";
import { TbMoneybag } from "react-icons/tb";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { Button } from "../Button";
import RentabilityChart from "../Charts/RentabilityChart";
import { CelerInputField } from "../CrmUi/InputFactory";
import CRMTooltip from "../CrmUi/Tooltip";
import CelerInputFormField from "../Forms/CustomFormField";
import LifeCycleStep from "../LifeCycleStep";
import BrokerModal, { IdentificationType } from "../Modals/BrokersCedente";
import DocForm from "../Modals/BrokersDocs";
import JuridicoDetailsSkeleton from "../Skeletons/JuridicoDetailsSkeleton";
import { SelectItem } from "../ui/select";
import { ReactGlobalQueryContext } from "@/context/ReactGlobalQueryContext";

type JuridicoDetailsProps = {
  id: string;
};

export const LegalDetails = ({ id }: JuridicoDetailsProps) => {
  const {
    data: { first_name, user },
  } = useContext<UserInfoContextType>(UserInfoAPIContext);

  const {
    cedenteModal,
    setCedenteModal,
    docModalInfo,
    setDocModalInfo,
  } = useContext(BrokersContext);

  const [credorIdentificationType, setCredorIdentificationType] = useState<IdentificationType>(null);
  const [vlData, setVlData] = useState<IWalletResponse>({
    id: "",
    valor_investido: 0,
    valor_projetado: 0,
    previsao_de_pgto: "",
    rentabilidade_anual: 0,
    result: [
      {
        data_atualizacao: "",
        valor_principal: 0,
        valor_juros: 0,
        valor_inscrito: 0,
        valor_bruto_atualizado_final: 0,
        valor_liquido_disponivel: 0,
      },
    ]
  });
  const [fetchingVL, setFetchingVL] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [observation, setObservation] = useState<string>("");
  const [formData, setFormData] = useState<any>(null);
  const [happenedRecalculation, setHappenedRecalculation] = useState<boolean>(false);
  const [recalculationData, setRecalculationData] = useState<any>(null);
  const [isLoadingRecalculation, setIsLoadingRecalculation] = useState<boolean>(false);
  const [loadingUpdateState, setLoadingUpdateState] = useState({
    nomeCredor: false,
    cpfCnpj: false,
    npuOriginario: false,
    npuPrecatorio: false,
    juizoVara: false,
    enteDevedor: false,
    estadoEnteDevedor: false,
    formValores: false,
    sliderValores: false,
    observacoes: false,
    responsavel: false,
    previsaoDePagamento: false,
    linkDue: false,
    revisaoCalculo: false,
    espelhoOficio: false,
    estoquePrecatorio: false,
    estadoCivil: false,
    certidaoEmitidas: false,
    possuiProcessos: false
  });
  const [editLock, setEditLock] = useState<boolean>(false);
  const [disabledSaveButton, setDisabledSaveButton] = useState<boolean>(true);
  const [sliderError, setSliderError] = useState<boolean>(false);
  const [sliderValues, setSliderValues] = useState({
    rentabilidade: 0,
    desembolso: 0
  })
  const [statusDiligence, setStatusDiligence] = useState<String>("");

  const swal = UseMySwal();
  const {
    globalQueryClient
  } = useContext(ReactGlobalQueryContext);

  /* refs */
  const rentabilidadeSlideRef = useRef<HTMLInputElement>(null);
  const desembolsoSlideRef = useRef<HTMLInputElement>(null);
  const linkDueInputRef = useRef<HTMLInputElement>(null);

  const handleDueDiligence = () => {
    swal.fire({
      title: 'Diligência',
      text: 'Deseja mesmo finalizar a diligência?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#F44336',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await api.patch(`api/notion-api/update/${id}/`, {
          "Status Diligência": {
            "select": {
              "name": "Em liquidação"
            }
          }
        });
        if (response.status !== 202) {
          swal.fire({
            title: 'Erro',
            text: 'Houve um erro ao finalizar a diligência',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }

        refetch();

        swal.fire({
          title: 'Diligência Finalizada',
          text: 'A diligência foi Finalizada com sucesso! O ofício agora está em liquidação.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    })
  }
  const handleCessao = () => {
    swal.fire({
      title: 'Cessão',
      text: 'Deseja mesmo Enviar o Registro de Cessão?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#F44336',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await api.patch(`api/notion-api/update/${id}/`, {
          "Status Diligência": {
            "select": {
              "name": "Registro de cessão"
            }
          }
        });
        if (response.status !== 202) {
          swal.fire({
            title: 'Erro',
            text: 'Houve um erro ao Enviar Registro de Cessão',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }

        refetch();

        swal.fire({
          title: 'Diligência Finalizada',
          text: 'A diligência foi Finalizada com sucesso! O ofício agora está em liquidação.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    })
  }

  const handlePendencia = () => {
    swal.fire({
      title: 'Pendência a Sanar',
      input: 'textarea',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#F44336',
      inputLabel: 'Informe a pendência a ser sanada pelo cedente',
      inputPlaceholder: 'Ex: Falta de documentação. Favor enviar o documento X',

      inputValidator: (value) => {
        if (!value) {
          return 'Você precisa informar a pendência'
        }
      }


    }).then(async (result) => {

      if (result.isConfirmed) {
        const response = await api.patch(`api/notion-api/update/${id}/`, {
          "Status Diligência": {
            "select": {
              "name": "Pendência a Sanar"
            }
          },
          "Observação": {
            "rich_text": [
              {
                "text": {
                  "content": `
- Motivo do Retorno: ${result.value}
- Encaminhado por: ${user} em ${new Date().toLocaleString()}
-------------------------------
${(data?.properties["Observação"]?.rich_text?.[0]?.text?.content ?? "")}
                  `
                }
              }
            ]
          },
        });
        if (response.status !== 202) {
          swal.fire({
            title: 'Erro',
            text: 'Houve um erro ao encaminhar o ofício para repactuação',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }

        refetch();

        swal.fire({
          title: 'Diligência Repactuada',
          text: 'O ofício foi encaminhado para repactuação com sucesso!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    })
  }



  async function fetchData() {
    const response = await api.get(`/api/notion-api/list/page/${id}/`);
    return response.data;
  }
  async function fetchCedenteData(cedenteId: string) {
    if (!cedenteId) return;
    const response = await api.get(`/api/notion-api/list/page/${cedenteId}/`);
    return response.data;
  }

  const { data, isFetching, isLoading, refetch } = useQuery<NotionPage>({
    queryKey: ["page", id],
    queryFn: fetchData,
    refetchOnWindowFocus: false
  });

  const { data: cedenteDataPF, isFetching: isFetchingCedentePF } = useQuery<NotionPage>({
    queryKey: ["cedentePF", data?.properties['Cedente PF']?.relation?.[0]?.id],
    queryFn: () => fetchCedenteData(data?.properties['Cedente PF']?.relation?.[0]?.id!),
    refetchOnWindowFocus: false,
    enabled: !!data?.properties['Cedente PF']?.relation?.[0]?.id
  });

  const { data: cedenteDataPJ, isFetching: isFetchingCedentePJ } = useQuery<NotionPage>({
    queryKey: ["cedentePJ", data?.properties['Cedente PJ']?.relation?.[0]?.id],
    queryFn: () => fetchCedenteData(data?.properties['Cedente PJ']?.relation?.[0]?.id!),
    refetchOnWindowFocus: false,
    enabled: !!data?.properties['Cedente PJ']?.relation?.[0]?.id
  });

  const { data: socioData, isFetching: isFetchingSocioData } = useQuery<NotionPage>({
    queryKey: ["socio", cedenteDataPJ?.properties["Sócio Representante"]?.relation?.[0]?.id],
    queryFn: () => fetchCedenteData(cedenteDataPJ?.properties["Sócio Representante"]?.relation?.[0]?.id!),
    refetchOnWindowFocus: false,
    enabled: !!cedenteDataPJ?.properties["Sócio Representante"]?.relation?.[0]?.id
  });

  const onSubmitForm = async (formData: any) => {
    setIsLoadingRecalculation(true);
    if (formData.observacao) {
      formData.observacao = `
💭 Comentários: ${formData.observacao}
`
    }

    if (formData.valor_aquisicao_total) {
      formData.percentual_a_ser_adquirido = 1;
    } else {
      formData.percentual_a_ser_adquirido = formData.percentual_a_ser_adquirido / 100;
    }

    if (typeof formData.valor_principal === "string") {
      formData.valor_principal = backendNumberFormat(formData.valor_principal) || 0;
      formData.valor_principal = parseFloat(formData.valor_principal);
    }

    if (typeof formData.valor_juros === "string") {
      formData.valor_juros = backendNumberFormat(formData.valor_juros) || 0;
      formData.valor_juros = parseFloat(formData.valor_juros);
    }

    if (formData.data_base) {
      formData.data_base = formData.data_base.split("/").reverse().join("-");
    }

    if (formData.data_requisicao) {
      formData.data_requisicao = formData.data_requisicao.split("/").reverse().join("-");
    }

    if (formData.data_limite_de_atualizacao) {
      formData.data_limite_de_atualizacao = formData.data_limite_de_atualizacao.split("/").reverse().join("-");
    }

    if (typeof formData.valor_pss) {
      formData.valor_pss = backendNumberFormat(formData.valor_pss) || 0;
      formData.valor_pss = parseFloat(formData.valor_pss);
    }

    if (!formData.ir_incidente_rra) {
      formData.numero_de_meses = 0
    } else {
      formData.numero_de_meses = Number(formData.numero_de_meses)
    }

    if (!formData.incidencia_pss) {
      formData.valor_pss = 0
    }

    if (!formData.data_limite_de_atualizacao_check) {
      delete formData.data_limite_de_atualizacao_check
    }

    formData.upload_notion = true;
    formData.need_to_recalculate_proposal = true;

    try {
      const response = await api.patch(`/api/juridico/update/precatorio/${id}/`, formData);
      setHappenedRecalculation(true);
      setRecalculationData(response.data);


      swal.fire({
        title: 'Sucesso',
        text: 'Dados atualizados com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      refetch();
    } catch (error: AxiosError | any) {
      swal.fire({
        title: 'Erro',
        text: `${error.response?.data?.detail || error.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      })
      console.error(error)
    }

    setIsLoadingRecalculation(false);
  }

  const form = useForm();
  const isFormModified = Object.keys(form.watch()).some((key: any) => form.watch()[key] !== formData?.[key]);

  // TODO: documentar todas as funções desse componente com JSDocs
  const handleChangeCreditorName = async (value: string, page_id: string) => {
    await creditorNameMutation.mutateAsync({
      page_id,
      value
    });
  }

  const handleChangeIdentification = async (value: string, page_id: string) => {

    if (value.length === 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (value.length === 14) {
      value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }

    await identificationMutation.mutateAsync({
      page_id,
      value
    });
  }

  const handleChangeNpu = async (value: string, type: string, page_id: string) => {

    value = value.replace(/(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})/, "$1-$2.$3.$4.$5.$6");

    await npuMutation.mutateAsync({
      page_id,
      type,
      value
    });
  }

  const handleChangeJuizo = async (value: string, page_id: string) => {
    await juizoMutation.mutateAsync({
      page_id,
      value
    });
  }

  const handleChangeEnteDevedor = async (value: string, page_id: string) => {
    await enteDevedorMutation.mutateAsync({
      page_id,
      value
    });
  }

  const handleChangeEstadoEnteDevedor = async (value: string, page_id: string) => {
    await estadoEnteDevedorMutation.mutateAsync({
      page_id,
      value
    });
  }

  const handleChangeRentabilidadeSlider = (value: string, fromSlider?: boolean) => {

    if (!value) return;
    const sanitizedValue = value.replace(/%/g, "");

    const newRentabilidade = !fromSlider ? Number(sanitizedValue) / 100 : Number(sanitizedValue);
    const newDesembolso = handleDesembolsoVsRentabilidade(Number(newRentabilidade), data).desembolso;

    if (newRentabilidade > 2 || newRentabilidade < 0) {

      setSliderError(true);
      return;

    } else {
      setSliderError(false);
    }

    setSliderValues({
      rentabilidade: newRentabilidade,
      desembolso: newDesembolso
    })

    if (rentabilidadeSlideRef.current && desembolsoSlideRef.current) {
      rentabilidadeSlideRef.current.value = `${(newRentabilidade * 100).toFixed(2).replace(".", ",")}%`;
      if (fromSlider) {
        desembolsoSlideRef.current.value = numberFormat(newDesembolso);
      }
    }
  }

  const handleChangeDesembolsoSlider = (value: string, fromSlider?: boolean) => {

    if (!value) return;
    const rawValue = !fromSlider
      ? Number(value.replace(/R\$\s*/g, "").replaceAll(".", "").replaceAll(",", "."))
      : Number(value);

    const newDesembolso = rawValue;
    const newRentabilidade = findRentabilidadeAoAnoThroughDesembolso(Number(newDesembolso), data).rentabilidade_ao_ano;

    if (newDesembolso > handleDesembolsoVsRentabilidade(0, data).desembolso
      || newDesembolso < handleDesembolsoVsRentabilidade(2, data).desembolso) {

      setSliderError(true);
      return;

    } else {
      setSliderError(false);
    }

    setSliderValues({
      rentabilidade: newRentabilidade,
      desembolso: newDesembolso
    })

    if (rentabilidadeSlideRef.current && desembolsoSlideRef.current) {
      desembolsoSlideRef.current.value = numberFormat(newDesembolso);
      if (fromSlider) {
        rentabilidadeSlideRef.current.value = `${(newRentabilidade * 100).toFixed(2).replace(".", ",")}%`;
      }
    }
  }

  const handleChangeResponsavel = async (page_id: string) => {
    await resposavelMutation.mutateAsync({ page_id });
  }

  const handleSaveValues = async () => {

    setLoadingUpdateState(prev => ({ ...prev, formValores: true }));
    try {
      const factor = Math.pow(10, 5);
      const newRentabilidade = Math.floor(sliderValues.rentabilidade * factor) / factor;
      const res = await api.post(`/api/juridico/desembolso/${id}/`, {
        rentabilidade_anual: newRentabilidade
      });

      if (res.status === 200) {
        swal.fire({
          toast: true,
          timer: 3000,
          timerProgressBar: true,
          icon: 'success',
          text: "Valores salvos com sucesso",
          position: "bottom-right",
          showConfirmButton: false,
        })
        refetch();
      }

    } catch (error) {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: "Erro ao salvar os valores",
        position: "bottom-right",
        showConfirmButton: false,
      })
    } finally {
      setLoadingUpdateState(prev => ({ ...prev, formValores: false }));
    }

  }

  const handleUpdatePrevisaoDePagamento = async (value: string, page_id: string) => {
    await previsaoDePagamentoMutation.mutateAsync({
      page_id,
      value
    });
  }

  const handleUpdateObservation = async (value: string, page_id: string) => {
    await observationMutation.mutateAsync({
      page_id,
      value
    });
  }

  const handleUpdateDueLink = async (value: string, page_id: string) => {
    await dueLinkMutation.mutateAsync({
      page_id,
      value
    })
  }

  const handleCopyDueLink = () => {
    if (linkDueInputRef.current) {
      const value = linkDueInputRef.current.value;
      navigator.clipboard.writeText(value);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  }

  const handleUpdateRevisaoCalculo = async (value: boolean, page_id: string) => {
    await revisaoCalculoMutation.mutateAsync({
      value,
      page_id
    })
  }

  const handleUpdateEspelhoDoOficio = async (value: string, page_id: string) => {
    await espelhoOficioMutation.mutateAsync({
      value,
      page_id
    })
  }

  const handleUpdateEstoquePrecatorio = async (value: string, page_id: string) => {
    await estoquePrecatoriosMutation.mutateAsync({
      value,
      page_id
    })
  }

  const handleUpdateCertidoesEmitidas = async (value: string, page_id: string) => {
    await certidaoEmitidaMutation.mutateAsync({
      page_id,
      value
    });
  }

  const handleUpdatePossuiProcessos = async (value: string, page_id: string) => {
    await possuiProcessosMutation.mutateAsync({
      page_id,
      value
    });
  }

  const handleUpdateEstadoCivil = async (value: string, page_id: string) => {
    await estadoCivilMutation.mutateAsync({
      page_id,
      value
    });
  }



  // ----> Mutations <-----
  const estoquePrecatoriosMutation = useMutation({
    mutationFn: async (paramsObj: { value: string, page_id: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Estoque de Precatórios Baixado": {
          "checkbox": paramsObj.value
        }
      });

      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }

      return response.data
    },
    onMutate: async (paramsObj) => {
      setLoadingUpdateState(prev => ({ ...prev, estoquePrecatorio: true }));
      setEditLock(true);
      const prevData = globalQueryClient.getQueryData(['page', id]);
      globalQueryClient.setQueryData(['page', id], (old: NotionPage) => {
        return {
          ...old,
          properties: {
            ...old?.properties,
            "Estoque de Precatórios Baixado": {
              ...old?.properties["Estoque de Precatórios Baixado"],
              checkbox: paramsObj.value,
            },
          },
        };
      });
      return { prevData }
    },
    onError: (error, paramsObj, context) => {
      globalQueryClient.setQueryData(['details', id], context?.prevData);
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: "Houve um erro ao atualizar campo Estoque de Precatórios",
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSuccess: (data, paramsObj) => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: "Campo Estoque de Precatórios atualizado com sucesso",
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, estoquePrecatorio: false }));
    }
  })

  const espelhoOficioMutation = useMutation({
    mutationFn: async (paramsObj: { value: string, page_id: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Espelho do ofício": {
          "checkbox": paramsObj.value
        }
      });

      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }

      return response.data
    },
    onMutate: async (paramsObj) => {
      setLoadingUpdateState(prev => ({ ...prev, espelhoOficio: true }));
      setEditLock(true);
      const prevData = globalQueryClient.getQueryData(['page', id]);
      globalQueryClient.setQueryData(['page', id], (old: NotionPage) => {
        return {
          ...old,
          properties: {
            ...old.properties,
            "Espelho do ofício": {
              ...old.properties["Espelho do ofício"],
              checkbox: paramsObj.value,
            },
          },
        };
      });
      return { prevData }
    },
    onError: (error, paramsObj, context) => {
      globalQueryClient.setQueryData(['details', id], context?.prevData);
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: "Houve um erro ao atualizar Espelho do ofício",
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSuccess: (data, paramsObj) => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: "Campo Espelho do ofício atualizado com sucesso",
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, espelhoOficio: false }));
    }
  })

  const revisaoCalculoMutation = useMutation({
    mutationFn: async (paramsObj: { value: boolean, page_id: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Cálculo Revisado": {
          "checkbox": paramsObj.value
        }
      });

      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }

      return response.data
    },
    onMutate: async (paramsObj) => {
      setLoadingUpdateState(prev => ({ ...prev, revisaoCalculo: true }));
      setEditLock(true);
      const prevData = globalQueryClient.getQueryData(['page', id]);
      globalQueryClient.setQueryData(['page', id], (old: NotionPage) => {
        return {
          ...old,
          properties: {
            ...old.properties,
            "Cálculo Revisado": {
              ...old.properties["Cálculo Revisado"],
              checkbox: paramsObj.value,
            },
          },
        };
      });
      return { prevData }
    },
    onError: (error, paramsObj, context) => {
      globalQueryClient.setQueryData(['details', id], context?.prevData);
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: "Houve um erro ao atualizar Revisão de Cálculo",
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSuccess: (data, paramsObj) => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: "Campo Revisão de Cálculo atualizado com sucesso",
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, revisaoCalculo: false }));
    }
  })

  const dueLinkMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string | null }) => {

      if (paramsObj.value === "") {
        paramsObj.value = null
      }

      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Link de Due Diligence": {
          "url": paramsObj.value
        }
      });

      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }

      return response.data
    },
    onMutate: async () => {
      setLoadingUpdateState(prev => ({ ...prev, linkDue: true }));
      setEditLock(true);
    },
    onError: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: "Houve um erro ao atualizar o campo Link do Ofício",
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSuccess: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: "Campo Link do Ofício atualizado com sucesso",
        position: "bottom-right",
        showConfirmButton: false,
      });
      refetch();
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, linkDue: false }));
    }
  });

  const resposavelMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        // pegar os responsáveis do ofício e adicionar o usuário logado. Exemplo: henrique, jarbas, joao, maria
        "Responsável - Celer": {
          "multi_select": [
            {
              "name": data?.properties["Responsável - Celer"]?.multi_select?.map((item: any) => item.name).join(",") + `${user}`
            }
          ]
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async () => {
      setLoadingUpdateState(prev => ({ ...prev, responsavel: true }));
      setEditLock(true);
    },
    onError: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: "Houve um erro ao atualizar o campo Responsável",
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSuccess: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: "Campo Responsável atualizado com sucesso",
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, responsavel: false }));
    }
  });

  const creditorNameMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Credor": {
          "title": [
            {
              "text": {
                "content": paramsObj.value
              }
            }
          ]
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async (paramsObj: any) => {
      setEditLock(true);
      setLoadingUpdateState(prev => ({ ...prev, nomeCredor: true }));
    },
    onError: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: "Houve um erro ao atualizar o campo Nome do Credor",
        position: "bottom-right",
        showConfirmButton: false,
      })
    },
    onSuccess: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: "Nome do Credor atualizado com sucesso",
        position: "bottom-right",
        showConfirmButton: false,
      })
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, nomeCredor: false }));
    }
  });

  const observationMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Observação": {
          "rich_text": [
            {
              "text": {
                "content": paramsObj.value
              }
            }
          ]
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data;
    },
    onMutate: async (paramsObj: any) => {
      setLoadingUpdateState(prev => ({ ...prev, observacoes: true }));
      setEditLock(true);
    },
    onError: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: "Houve um erro ao atualizar o campo Observações",
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSuccess: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: "Observações atualizadas com sucesso",
        position: "bottom-right",
        showConfirmButton: false,
      });
      refetch();
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, observacoes: false }));
    }
  });

  const identificationMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "CPF/CNPJ": {
          "rich_text": [
            {
              "text": {
                "content": paramsObj.value
              }
            }
          ]
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data;
    },
    onMutate: async (paramsObj: any) => {
      setLoadingUpdateState(prev => ({ ...prev, cpfCnpj: true }));
      setEditLock(true);
    },
    onError: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: "Houve um erro ao atualizar o campo CPF/CNPJ",
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSuccess: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: "CPF/CNPJ atualizado com sucesso",
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSettled: () => {
      setLoadingUpdateState(prev => ({ ...prev, cpfCnpj: false }));
      setEditLock(false);
    }
  });

  const previsaoDePagamentoMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/legal/change-estimated-date/${paramsObj.page_id}/`, {
        "previsao_de_pagamento": paramsObj.value.split("/").reverse().join("-"),
        "data_base": data?.properties["Data Base"].date?.start,
        "valor_principal": data?.properties["Valor Principal"]?.number,
        "valor_juros": data?.properties["Valor Juros"]?.number,
        "valor_pss": data?.properties["PSS"]?.number,
        "numero_de_meses": data?.properties["Meses RRA"]?.number,
        "ir_incidente_rra": data?.properties["IR Incidente sobre RRA"]?.checkbox,
        "incidencia_pss": data?.properties["Incidência PSS"]?.checkbox,
        "data_requisicao": data?.properties["Data do Recebimento"].date?.start,
        "upload_notion": true,
        "need_to_recalculate_proposal": true,
        "percentual_a_ser_adquirido": data?.properties["Percentual a ser adquirido"]?.number,
        "natureza": data?.properties["Natureza"]?.select?.name,
        "incidencia_juros_moratorios": data?.properties["Incidência de Juros Moratórios"]?.checkbox,
        "incidencia_rra_ir": data?.properties["Incidencia RRA/IR"]?.checkbox,
      }
      );

      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data;
    },
    onMutate: async () => {
      setLoadingUpdateState(prev => ({ ...prev, previsaoDePagamento: true }));
      setEditLock(true);
    },
    onError: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: "Houve um erro ao atualizar o campo Previsão de Pagamento",
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSuccess: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: "Previsão de Pagamento atualizada com sucesso",
        position: "bottom-right",
        showConfirmButton: false,
      });
      refetch(); // refetch para atualizar o objeto do notion com a nova data
    },
    onSettled: () => {
      setLoadingUpdateState(prev => ({ ...prev, previsaoDePagamento: false }));
      setEditLock(false);
    }
  });

  const npuMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, type: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        [paramsObj.type]: {
          "rich_text": [
            {
              "text": {
                "content": paramsObj.value
              }
            }
          ]
        }
      });
      if (response.status !== 202) {
        console.error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async (paramsObj) => {
      let npuType = paramsObj.type === "NPU (Originário)" ? "npuOriginario" : "npuPrecatorio"
      setLoadingUpdateState(prev => ({ ...prev, [npuType]: true }));
      setEditLock(true);
      return { npuType };
    },
    onError: (error, paramsObj) => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: `Houve um erro ao atualizar o campo ${paramsObj.type}`,
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSuccess: (data, paramsObj) => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: `Campo ${paramsObj.type} alterado com sucesso.`,
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSettled: (data, error, paramsObj, context) => {
      setEditLock(false);
      if (context?.npuType) {
        setLoadingUpdateState(prev => ({ ...prev, [context?.npuType]: false }));
      }
    }
  });

  const juizoMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Juízo": {
          "rich_text": [
            {
              "text": {
                "content": paramsObj.value
              }
            }
          ]
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async () => {
      setLoadingUpdateState(prev => ({ ...prev, juizoVara: true }));
      setEditLock(true);
    },
    onError: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: `Houve um erro ao atualizar o campo Juízo.`,
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSuccess: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: `Campo Juízo alterado com sucesso.`,
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, juizoVara: false }));
    }
  });

  const enteDevedorMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Ente Devedor": {
          "select": {
            "name": paramsObj.value
          }
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async () => {
      setLoadingUpdateState(prev => ({ ...prev, enteDevedor: true }));
      setEditLock(true);
    },
    onError: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: `Houve um erro ao atualizar o campo Ente Devedor`,
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSuccess: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: `Campo Ente Devedor alterado com sucesso.`,
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, enteDevedor: false }));
    }
  });

  const estadoEnteDevedorMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Estado do Ente Devedor": {
          "select": {
            "name": paramsObj.value
          }
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async () => {
      setLoadingUpdateState(prev => ({ ...prev, estadoEnteDevedor: true }));
      setEditLock(true);
    },
    onError: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: `Houve um erro ao atualizar o campo Estado do Ente Devedor`,
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSuccess: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: `Campo Estado do Ente Devedor alterado com sucesso.`,
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, estadoEnteDevedor: false }));
    }
  });

  const certidaoEmitidaMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Certidões emitidas": {
          "checkbox": paramsObj.value === "SIM" ? true : false
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async (paramsObj) => {
      setLoadingUpdateState(prev => ({ ...prev, certidaoEmitidas: true }));
      setEditLock(true);
      const prevData = globalQueryClient.getQueryData(['page', id]);
      globalQueryClient.setQueryData(['page', id], (old: NotionPage) => {
        return {
          ...old,
          properties: {
            ...old?.properties,
            "Certidões emitidas": {
              ...old?.properties["Certidões emitidas"],
              checkbox: paramsObj.value,
            },
          },
        };
      });
      return { prevData }
    },
    onError: (error, paramsObj, context) => {
      globalQueryClient.setQueryData(['page', id], context?.prevData);
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: `Houve um erro ao atualizar o campo Certidões Emitidas`,
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSuccess: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: `Campo Certidões Emitidas foi alterado com sucesso.`,
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, certidaoEmitidas: false }));
    }
  });

  const possuiProcessosMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Possui processos?": {
          "checkbox": paramsObj.value === "SIM" ? true : false
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async (paramsObj) => {
      setLoadingUpdateState(prev => ({ ...prev, possuiProcessos: true }));
      setEditLock(true);
      const prevData = globalQueryClient.getQueryData(['page', id]);
      globalQueryClient.setQueryData(['page', id], (old: NotionPage) => {
        return {
          ...old,
          properties: {
            ...old?.properties,
            "Possui processos?": {
              ...old?.properties["Possui processos?"],
              checkbox: paramsObj.value,
            },
          },
        };
      });
      return { prevData }
    },
    onError: (error, paramsObj, context) => {
      globalQueryClient.setQueryData(['page', id], context?.prevData);
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: `Houve um erro ao atualizar o campo Possui Processos`,
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSuccess: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: `Campo Possui Processos foi alterado com sucesso.`,
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, possuiProcessos: false }));
    }
  });

  const estadoCivilMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Estado Civil": {
          "select": {
            "name": paramsObj.value
          }
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async () => {
      setLoadingUpdateState(prev => ({ ...prev, estadoCivil: true }));
      setEditLock(true);
    },
    onError: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'error',
        text: `Houve um erro ao atualizar o campo Estado Civil`,
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSuccess: () => {
      swal.fire({
        toast: true,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        text: `Campo Estado Civil alterado com sucesso.`,
        position: "bottom-right",
        showConfirmButton: false,
      });
    },
    onSettled: () => {
      setEditLock(false);
      setLoadingUpdateState(prev => ({ ...prev, estadoCivil: false }));
    }
  });

  useEffect(() => {
    if (data && sliderValues.rentabilidade !== 0 && sliderValues.desembolso !== 0) {
      if (
        sliderValues.rentabilidade !== data.properties["Rentabilidade Anual"].number ||
        sliderValues.desembolso !== data.properties["Nova Fórmula do Desembolso"].formula?.number
      ) {
        setDisabledSaveButton(false);
      } else {
        setDisabledSaveButton(true);
      }
    }
  }, [sliderValues])

  useEffect(() => {
    if (data) {
      form.setValue("tipo_do_oficio", data?.properties["Tipo"].select?.name || "PRECATÓRIO");
      form.setValue("natureza", data?.properties["Natureza"].select?.name || "NÃO TRIBUTÁRIA");
      form.setValue("esfera", data?.properties["Esfera"].select?.name || "FEDERAL");
      form.setValue("regime", data?.properties["Regime"].select?.name || "GERAL");
      form.setValue("tribunal", data?.properties["Tribunal"].select?.name || "STJ");
      form.setValue("valor_principal", numberFormat(data?.properties["Valor Principal"]?.number || 0));
      form.setValue("valor_juros", numberFormat(data?.properties["Valor Juros"]?.number || 0));
      form.setValue("data_base", data?.properties["Data Base"].date?.start.split("-").reverse().join("/") || "");
      form.setValue("data_requisicao", data?.properties["Data do Recebimento"].date?.start.split("-").reverse().join("/") || "");
      form.setValue("valor_aquisicao_total", data?.properties["Percentual a ser adquirido"]?.number === 1);
      form.setValue("ja_possui_destacamento", data?.properties["Honorários já destacados?"].checkbox);
      form.setValue("percentual_de_honorarios", data?.properties["Percentual de Honorários Não destacados"]?.number! * 100 || 0);
      form.setValue("incidencia_juros_moratorios", data?.properties["Incidência de Juros Moratórios"].checkbox);
      form.setValue("nao_incide_selic_no_periodo_db_ate_abril", data?.properties["Incide Selic Somente Sobre Principal"].checkbox);
      form.setValue("incidencia_rra_ir", data?.properties["Incidencia RRA/IR"].checkbox);
      form.setValue("ir_incidente_rra", data?.properties["IR Incidente sobre RRA"].checkbox);
      form.setValue("numero_de_meses", data?.properties["Meses RRA"]?.number || 0);
      form.setValue("incidencia_pss", data?.properties["Meses RRA"]?.number || 0);
      form.setValue("incidencia_pss", data?.properties["PSS"]?.number! > 0);
      form.setValue("valor_pss", numberFormat(data?.properties["PSS"]?.number || 0));

      setFormData(form.watch);

      setSliderValues({
        rentabilidade: data?.properties["Rentabilidade Anual"].number || 0,
        desembolso: data?.properties["Nova Fórmula do Desembolso"].formula?.number || 0
      })

      setObservation(data?.properties["Observação"]?.rich_text?.[0]?.text?.content || "");
    }
  }, [data]);

  const fetchUpdatedVL = async (oficio: NotionPage) => {
    // Essa função recebe um objeto do tipo NotionPage e retorna um objeto do tipo IWalletResponse com os valores atualizados
    try {
      const response = await api.post('/api/extrato/wallet/', {
        oficio,
        from_today: data?.properties["Data de aquisição do precatório"].date?.start ? false : true
      });
      setVlData(response.data);
      // refetch();

    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  useEffect(() => {
    if (data) {
      fetchUpdatedVL(data);
    }

  }, [data]);

  useEffect(() => {
    // verifica o tipo de identificação do credor e formata para só obter números na string
    const credorIdent = data?.properties["CPF/CNPJ"].rich_text?.[0]?.text?.content.replace(/\D/g, '') || "";

    setCredorIdentificationType(credorIdent?.length === 11 ? "CPF" : credorIdent?.length === 14 ? "CNPJ" : null);
   }, [data]);
  
   useEffect(() => { 
     const dataStatusDiligence = data?.properties["Status Diligência"].select?.name;
     setStatusDiligence(dataStatusDiligence || "");
    
  }, [data]);

  if (!data) {
    return (
      <JuridicoDetailsSkeleton />
    )
  }

  return (
    <div className="flex flex-col w-full gap-5">
      <div className="flex w-full items-end justify-end rounded-md">
        <Breadcrumb
          customIcon={<FaBalanceScale className="h-[32px] w-[32px]" />}
          altIcon="Espaço de trabalho do time jurídico"
          pageName="Jurídico / Detalhes"
          title={`Olá, ${first_name}`}
        />
      </div>
      <LifeCycleStep status={data?.properties["Status Diligência"].select?.name ?? "ops"} />
      <Form {...form}>
        <div className="space-y-6 rounded-md">
          <section id="info_credor" className="form-inputs-container">
            <div className="2xsm:col-span-4 lg:col-span-2 xl:col-span-2 w-full">
              <CelerInputField
                name="credor"
                fieldType={InputFieldVariant.INPUT}
                label="Nome do Credor"
                defaultValue={data?.properties["Credor"]?.title?.[0]?.plain_text || ''}
                iconSrc={<FaUser
                  className="self-center" />}
                iconAlt="user"
                className="w-full"
                onSubmit={(_, value) => handleChangeCreditorName(value, id)}
                isLoading={loadingUpdateState.nomeCredor}
                disabled={editLock}
              />
            </div>

            <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1 w-full">
              <CelerInputField
                name="cpf_cnpj"
                fieldType={InputFieldVariant.INPUT}
                label={
                  data?.properties["CPF/CNPJ"]?.rich_text?.[0]
                    ?.plain_text &&
                    data.properties["CPF/CNPJ"].rich_text[0].plain_text
                      .length > 11
                    ? "CNPJ"
                    : "CPF"
                }
                defaultValue={data?.properties["CPF/CNPJ"]?.rich_text?.[0].plain_text || ''}
                iconSrc={<FaIdCard
                  className="self-center" />}
                iconAlt="document"
                className="w-full"
                onSubmit={(_, value) => handleChangeIdentification(value, id)}
                isLoading={loadingUpdateState.cpfCnpj}
                disabled={editLock}
              />
            </div>
          </section>

          <section id="cedentes" className="form-inputs-container">
            <div className="col-span-4 w-full">
              <h3 className="text-bodydark2 font-medium">
                Informações sobre o cedente
              </h3>

            </div>
            <div className="col-span-4 gap-4">
              <div className="flex flex-wrap items-center gap-6">
                <div className="grid min-w-35">
                  <CelerInputField
                    name="emissao_certidao_check"
                    fieldType={InputFieldVariant.SELECT}
                    label={`Certidões Emitidas ?`}
                    defaultValue={data?.properties["Certidões emitidas"]?.checkbox ? "SIM" : "NÃO"}
                    onValueChange={(_, value) => handleUpdateCertidoesEmitidas(value, id)}
                    isLoading={loadingUpdateState.certidaoEmitidas}
                    disabled={editLock}
                    className="w-full"
                  >
                    <SelectItem value="SIM">Sim</SelectItem>
                    <SelectItem value="NÃO">Não</SelectItem>
                  </CelerInputField>
                </div>

                <div className="grid min-w-35">
                  <CelerInputField
                    name="possui_processos_check"
                    fieldType={InputFieldVariant.SELECT}
                    label={`Possui Processos ?`}
                    defaultValue={data?.properties["Possui processos?"]?.checkbox ? "SIM" : "NÃO"}
                    onValueChange={(_, value) => handleUpdatePossuiProcessos(value, id)}
                    isLoading={loadingUpdateState.possuiProcessos}
                    disabled={editLock}
                    className="w-full"
                  >
                    <SelectItem value="SIM">Sim</SelectItem>
                    <SelectItem value="NÃO">Não</SelectItem>
                  </CelerInputField>
                </div>

              </div>
              <div className="grid 2xsm:w-full md:w-115 gap-2 mt-5">
                <CelerInputField
                  className="w-full gap-2"
                  fieldType={InputFieldVariant.SELECT}
                  name="regime_casamento"
                  label="Estado Civil"
                  iconSrc={<BsCalendar2HeartFill />}
                  defaultValue={
                    credorIdentificationType === "CPF"
                      ? cedenteDataPF?.properties["Estado Civil"]?.select?.name || ''
                      : socioData?.properties["Estado Civil"]?.select?.name || ''
                  }
                  onValueChange={(_, value) => handleUpdateEstadoCivil(value,
                    credorIdentificationType === "CPF"
                      ? cedenteDataPF?.id!
                      : socioData?.id!
                  )}
                  isLoading={loadingUpdateState.estadoCivil}
                  disabled={editLock}
                >
                  {tipoRegime.map((item, index) => (
                    <SelectItem
                      defaultChecked={
                        credorIdentificationType === "CPF"
                          ? cedenteDataPF?.properties["Estado Civil"]?.select?.name === item
                          : socioData?.properties["Estado Civil"]?.select?.name === item
                      }
                      key={index}
                      value={item}
                    >
                      {item}
                    </SelectItem>
                  ))}
                </CelerInputField>
              </div>
            </div>
            <div className="col-span-4 gap-4">

              <div className="flex items-center gap-4">

                <button
                  onClick={() => data && setCedenteModal(data)}
                  className="border border-strokedark/20 dark:border-stroke/20 dark:text-white text-slate-600 py-2 px-4 rounded-md flex items-center gap-3 uppercase text-sm font-medium hover:bg-strokedark/20 dark:hover:bg-stroke/20 transition-colors duration-200"
                >
                  {(data?.properties["Cedente PF"].relation?.[0] || data?.properties["Cedente PJ"].relation?.[0]) ? (
                    <>
                      <BsPencilSquare />
                      Editar Cedente
                    </>
                  ) : (
                    <>
                      <GrDocumentUser />
                      Cadastrar Cedente
                    </>
                  )}
                </button>
                <button
                  onClick={() => data && setDocModalInfo(data)}
                  className="border border-strokedark/20 dark:border-stroke/20 dark:text-white text-slate-600 py-2 px-4 rounded-md flex items-center gap-3 uppercase text-sm font-medium hover:bg-strokedark/20 dark:hover:bg-stroke/20 transition-colors duration-200"
                >
                  <FaRegFilePdf />
                  Gerir Documentos
                </button>
              </div>
            </div>
          </section>


          <section className="form-inputs-container" id="info_processo">
            <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
              <CelerInputField
                name="npu_originario"
                fieldType={InputFieldVariant.INPUT}
                label="NPU (Originário)"
                defaultValue={data?.properties["NPU (Originário)"]?.rich_text?.[0].plain_text}
                iconSrc={<IoDocumentTextSharp className="self-center" />}
                iconAlt="law"
                className="w-full"
                onSubmit={(_, value) => handleChangeNpu(value, "NPU (Originário)", id)}
                isLoading={loadingUpdateState.npuOriginario}
                disabled={editLock}
              />
            </div>
            <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
              <CelerInputField
                name="npu_precatorio"
                fieldType={InputFieldVariant.INPUT}
                label="NPU (Precatório)"
                defaultValue={data?.properties["NPU (Precatório)"]?.rich_text?.[0].plain_text || ''}
                iconSrc={<IoDocumentTextSharp className="self-center" />}
                iconAlt="law"
                className="w-full"
                onSubmit={(_, value) => handleChangeNpu(value, "NPU (Precatório)", id)}
                isLoading={loadingUpdateState.npuPrecatorio}
                disabled={editLock}
              />
            </div>
            <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
              <CelerInputField
                name="juizo_vara"
                fieldType={InputFieldVariant.INPUT}
                label="Vara"
                defaultValue={data?.properties["Juízo"]?.rich_text?.[0].plain_text || ''}
                iconSrc={<FaBuildingColumns className="self-center" />}
                iconAlt="law"
                className="w-full"
                onSubmit={(_, value) => handleChangeJuizo(value, id)}
                isLoading={loadingUpdateState.juizoVara}
                disabled={editLock}
              />
            </div>
            <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
              <CelerInputField
                name="ente_devedor"
                fieldType={InputFieldVariant.INPUT}
                label="Ente Devedor"
                defaultValue={data?.properties["Ente Devedor"].select?.name || ''}
                iconSrc={<FaBuilding className="self-center" />}
                iconAlt="law"
                className="w-full"
                onSubmit={(_, value) => handleChangeEnteDevedor(value, id)}
                isLoading={loadingUpdateState.enteDevedor}
                disabled={editLock}
              />
            </div>
            <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
              <CelerInputField
                name="estado_ente_devedor"
                fieldType={InputFieldVariant.SELECT}
                label="Estado Ente Devedor"
                defaultValue={data?.properties["Estado do Ente Devedor"].select?.name || ''}
                iconSrc={<FaMapMarkedAlt className="self-center" />}
                iconAlt="law"
                className="w-full"
                onValueChange={(_, value) => handleChangeEstadoEnteDevedor(value, id)}
                isLoading={loadingUpdateState.estadoEnteDevedor}
                disabled={editLock}
              >
                {estados.map(estado => (
                  <SelectItem className="shad-select-item" defaultChecked={
                    data?.properties["Estado do Ente Devedor"].select?.name === estado.id
                  } key={estado.id} value={estado.id}>{estado.nome}</SelectItem>
                ))}
              </CelerInputField>
            </div>
          </section>

          <section id="info_valores" className="p-4 rounded-md bg-white dark:bg-boxdark">
            <form onSubmit={form.handleSubmit(onSubmitForm)}>
              <div className="grid grid-cols-4 3xl:grid-cols-5 gap-6">
                {/* tipo */}
                <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="tipo_do_oficio"
                    label="Tipo"
                    fieldType={InputFieldVariant.SELECT}
                    defaultValue={data?.properties["Tipo"].select?.name ?? ""}
                    className="w-full"
                  >
                    <SelectItem value="PRECATÓRIO">PRECATÓRIO</SelectItem>
                    <SelectItem value="CREDITÓRIO">CREDITÓRIO</SelectItem>
                    <SelectItem value="R.P.V.">R.P.V.</SelectItem>
                  </CelerInputFormField>
                </div>
                {/* natureza */}
                <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="natureza"
                    label="Natureza"
                    fieldType={InputFieldVariant.SELECT}
                    defaultValue={data?.properties["Natureza"].select?.name ?? ""}
                    className="w-full"
                  >
                    <SelectItem value="NÃO TRIBUTÁRIA">NÃO TRIBUTÁRIA</SelectItem>
                    <SelectItem value="TRIBUTÁRIA">TRIBUTÁRIA</SelectItem>
                  </CelerInputFormField>
                </div>
                {/* esfera */}
                <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="esfera"
                    label="Esfera"
                    fieldType={InputFieldVariant.SELECT}
                    defaultValue={data?.properties["Esfera"].select?.name ?? ""}
                    className="w-full"
                  >
                    <SelectItem value="FEDERAL">FEDERAL</SelectItem>
                    <SelectItem value="ESTADUAL">ESTADUAL</SelectItem>
                    <SelectItem value="MUNICIPAL">MUNICIPAL</SelectItem>
                  </CelerInputFormField>
                </div>
                {/* regime */}
                {form.watch("esfera") !== "FEDERAL" && (
                  <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                    <CelerInputFormField
                      control={form.control}
                      name="regime"
                      label="Regime"
                      fieldType={InputFieldVariant.SELECT}
                      defaultValue={data?.properties["Regime"].select?.name ?? ""}
                      className="w-full"
                    >
                      <SelectItem value="GERAL">GERAL</SelectItem>
                      <SelectItem value="ESPECIAL">ESPECIAL</SelectItem>
                    </CelerInputFormField>
                  </div>
                )}
                {/* tribunal */}
                <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="tribunal"
                    label="Tribunal"
                    fieldType={InputFieldVariant.SELECT}
                    defaultValue={data?.properties["Tribunal"].select?.name ?? ""}
                    className="w-full"
                  >
                    {tribunais.map(tribunal => (
                      <SelectItem key={tribunal.id} value={tribunal.id}>{tribunal.nome}</SelectItem>
                    ))}
                  </CelerInputFormField>
                </div>
                {/* valor principal */}
                <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="valor_principal"
                    label="Valor Principal"
                    fieldType={InputFieldVariant.NUMBER}
                    currencyFormat="R$ "
                    defaultValue={data?.properties["Valor Principal"].number ?? 0}
                    className="w-full"
                  />
                </div>
                {/* valor juros */}
                <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="valor_juros"
                    label="Juros"
                    fieldType={InputFieldVariant.NUMBER}
                    currencyFormat="R$ "
                    defaultValue={data?.properties["Valor Juros"].number ?? 0}
                    className="w-full"
                  />
                </div>
                {/* data base */}
                <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="data_base"
                    label="Data Base"
                    fieldType={InputFieldVariant.DATE}
                    defaultValue={data?.properties["Data Base"].date?.start ?? ""}
                    className="w-full"
                  />
                </div>
                {/* data requisição */}
                <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
                  <CelerInputFormField
                    control={form.control}
                    name="data_requisicao"
                    label="Data Requisição"
                    fieldType={InputFieldVariant.DATE}
                    defaultValue={data?.properties["Data do Recebimento"].date?.start ?? ""}
                    className="w-full"
                  />
                </div>
              </div>

              <hr className="border border-stroke dark:border-strokedark mt-6" />

              <div className="grid md:grid-cols-4 xl:grid-cols-4 3xl:grid-cols-5 gap-6 mt-6">
                <div className="grid 2xsm:col-span-4 xl:col-span-2 3xl:col-span-3 xl:grid-cols-2 gap-6">
                  {/* percentual adquirido */}
                  <div className="2xsm:col-span-4 xl:col-span-1">
                    <CelerInputFormField
                      control={form.control}
                      name="valor_aquisicao_total"
                      label="Aquisição Total"
                      fieldType={InputFieldVariant.CHECKBOX}
                      className="w-full"
                    />
                  </div>
                  {form.watch("valor_aquisicao_total") === false ? (
                    <div className="2xsm:col-span-4 xl:col-span-1">
                      <CelerInputFormField
                        control={form.control}
                        name="percentual_a_ser_adquirido"
                        label="Percentual de Aquisição (%)"
                        fieldType={InputFieldVariant.NUMBER}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="2xsm:hidden xl:col-span-1 xl:block">&nbsp;</div>
                  )}

                  {/* destacamento de honorários */}
                  <div className="2xsm:col-span-4 xl:col-span-1 flex gap-6">
                    <CelerInputFormField
                      control={form.control}
                      name="ja_possui_destacamento"
                      label="Já Possui Destacamento de Honorários?"
                      fieldType={InputFieldVariant.CHECKBOX}
                      className="w-full"
                    />

                  </div>

                  {!form.watch("ja_possui_destacamento") ? (
                    <div className="2xsm:col-span-4 xl:col-span-1">
                      <CelerInputFormField
                        control={form.control}
                        name="percentual_de_honorarios"
                        label="Percentual de Honorários (%)"
                        fieldType={InputFieldVariant.NUMBER}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="2xsm:hidden xl:col-span-1 xl:block">&nbsp;</div>
                  )}

                  {/* juros moratórios */}
                  <div className={`col-span-2 ${form.watch("data_base") && form.watch("data_base").split("/").reverse().join("-") < "2021-12-01" && form.watch("natureza") !== "TRIBUTÁRIA" ? "" : "hidden"}`}>
                    <CelerInputFormField
                      control={form.control}
                      name="incidencia_juros_moratorios"
                      label="Juros de Mora Fixados em Sentença"
                      fieldType={InputFieldVariant.CHECKBOX}
                      className="w-full"
                    />
                  </div>

                  {/* incide selic */}
                  <div className={`2xsm:col-span-4 xl:col-span-2 ${form.watch("data_base") && form.watch("data_base").split("/").reverse().join("-") > "2021-12-01" && form.watch("natureza") !== "TRIBUTÁRIA" ? "" : "hidden"}`}>
                    <CelerInputFormField
                      control={form.control}
                      name="nao_incide_selic_no_periodo_db_ate_abril"
                      label="SELIC Somente Sobre o Principal"
                      fieldType={InputFieldVariant.CHECKBOX}
                      className="w-full"
                    />
                  </div>

                  {/* incidência IR */}
                  <div className="2xsm:col-span-4 xl:col-span-2">
                    <CelerInputFormField
                      control={form.control}
                      name="incidencia_rra_ir"
                      label="Incidência de IR"
                      fieldType={InputFieldVariant.CHECKBOX}
                      className="w-full"
                    />
                  </div>

                  {/* Incidência de IR sobre RRA */}
                  {form.watch("natureza") !== "TRIBUTÁRIA" && form.watch("incidencia_rra_ir") === true ? (
                    <>
                      <div className="2xsm:col-span-4 xl:col-span-1">
                        <CelerInputFormField
                          control={form.control}
                          name="ir_incidente_rra"
                          label="IR Incidente sobre RRA?"
                          fieldType={InputFieldVariant.CHECKBOX}
                          className="w-full"
                        />
                      </div>
                      {form.watch("ir_incidente_rra") === true ? (
                        <div className="col-span-1">
                          <CelerInputFormField
                            control={form.control}
                            name="numero_de_meses"
                            label="Número de Meses"
                            fieldType={InputFieldVariant.INPUT}
                            className="w-full"
                          />
                        </div>
                      ) : (
                        <div className="2xsm:hidden xl:col-span-1 xl:block">&nbsp;</div>
                      )}
                    </>
                  ) : (
                    null
                  )}

                  {/* incidência de PSS */}
                  {form.watch("natureza") !== "TRIBUTÁRIA" && (
                    <>
                      <div className="2xsm:col-span-4 xl:col-span-1">
                        <CelerInputFormField
                          control={form.control}
                          name="incidencia_pss"
                          label="Incide PSS?"
                          fieldType={InputFieldVariant.CHECKBOX}
                          className="w-full"
                        />
                      </div>
                      {form.watch("incidencia_pss") === true ? (
                        <div className="2xsm:col-span-4 xl:col-span-1">
                          <CelerInputFormField
                            control={form.control}
                            name="valor_pss"
                            label="Valor PSS"
                            fieldType={InputFieldVariant.NUMBER}
                            currencyFormat={"R$ "}
                            className="w-full"
                          />
                        </div>
                      ) : (
                        <div className="2xsm:hidden xl:col-span-1 xl:block">&nbsp;</div>
                      )}
                    </>
                  )}

                  {/* data limite de atualização */}
                  <div className="2xsm:col-span-4 xl:col-span-1">
                    <CelerInputFormField
                      control={form.control}
                      name="data_limite_de_atualizacao_check"
                      label="Atualiza Para Data Passada?"
                      fieldType={InputFieldVariant.CHECKBOX}
                      className="w-full"
                    />
                  </div>

                  {form.watch("data_limite_de_atualizacao_check") === true ? (
                    <div className="2xsm:col-span-4 xl:col-span-1">
                      <CelerInputFormField
                        control={form.control}
                        name="data_limite_de_atualizacao"
                        label="Atualizado Até:"
                        fieldType={InputFieldVariant.DATE}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="2xsm:hidden xl:col-span-1 xl:block">&nbsp;</div>
                  )}

                  {(form.watch("data_limite_de_atualizacao") && form.watch("data_limite_de_atualizacao").split("/").reverse().join("-") < form.watch("data_requisicao").split("/").reverse().join("-")) && (
                    <span className="text-red-500 dark:text-red-400 text-xs col-span-2">
                      Data de atualização não pode ser menor que a data da requisição
                    </span>
                  )}
                </div>

                <div className="col-span-4">
                  <hr className="border border-stroke dark:border-strokedark my-6" />
                  <CelerInputFormField
                    name="observacao"
                    control={form.control}
                    fieldType={InputFieldVariant.TEXTAREA}
                    label="Motivo da Atualização"
                    required={true}
                    placeholder="Insira o motivo da atualização do ativo"
                    iconSrc={<IoIosPaper className="self-center" />}
                    iconAlt="law"
                    className="w-full"
                    rows={7}
                    disabled={editLock}
                  />
                </div>

                <div className="col-span-4">
                  <h3 className="text-bodydark2 text-sm font-medium 2xsm:text-center md:text-left">
                    Atenção: A atualização dos valores, datas, percentuais etc implica na modificação do valor líquido do ativo. O status do ativo será alterado para Repactuação e retornará para o broker para negociação.
                  </h3>
                </div>

              </div>

              <hr className="border border-stroke dark:border-strokedark mt-6" />

              <div className="flex items-center justify-center gap-6 mt-6">
                <p>
                  Valor Líquido:{" "}
                </p>
                {
                  !isLoading && (
                    <span className="font-medium">
                      {numberFormat(happenedRecalculation === false ? data?.properties["Valor Líquido (Com Reserva dos Honorários)"]?.formula?.number || 0 : recalculationData.result.net_mount_to_be_assigned)}
                    </span>
                  )
                }
              </div>

              <div className="flex items-center justify-center 2xsm:gap-3 2xsm:flex-col lg:flex-row lg:gap-6 mt-6">

                <Button
                  type="submit"
                  variant="success"
                  isLoading={isLoadingRecalculation}
                  disabled={!isFormModified}
                  className="py-2 px-4 2xsm:w-full md:w-fit rounded-md flex items-center gap-3 disabled:opacity-50 disabled:hover:bg-green-500 uppercase text-sm"
                >
                  <BiSolidCalculator className="h-4 w-4" />
                  <span className="font-medium">Recalcular</span>
                </Button>

                {data?.properties["Memória de Cálculo Ordinário"].url && (
                  <Link
                    href={data?.properties["Memória de Cálculo Ordinário"].url}
                    className="bg-blue-600 hover:bg-blue-700 text-snow py-2 px-4 2xsm:w-full md:w-fit rounded-md flex items-center justify-center gap-3 transition-colors duration-300 uppercase text-sm"
                  >
                    <GrDocumentText className="h-4 w-4" />
                    <span className="font-medium">Memória de Cálculo Simples</span>
                  </Link>
                )}

                {data?.properties["Memória de Cálculo RRA"].url && (
                  <Link
                    href={data?.properties["Memória de Cálculo RRA"].url}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="bg-blue-600 hover:bg-blue-700 text-snow py-2 px-4 2xsm:w-full md:w-fit rounded-md flex items-center justify-center gap-3 transition-colors duration-300 uppercase text-sm"
                  >
                    <GrDocumentText className="h-4 w-4" />
                    <span className="font-medium">Memória de Cálculo RRA</span>
                  </Link>
                )}
              </div>

            </form>
          </section>
        </div>
      </Form>

      <section id="due_diligence" className="form-inputs-container">
        <div className="text-bodydark2 col-span-4 3xl:col-span-5">
          <h2 className="font-medium mb-2">
            Due Diligence
          </h2>
          <p className="text-sm">
            Qualquer pessoa com o link poderá acessar o documento
          </p>
        </div>
        <div className="flex gap-2 col-span-4 2xsm:flex-col md:flex-row md:items-center 3xl:col-span-5">
          <CelerInputField
            name="link_due_diligence"
            ref={linkDueInputRef}
            fieldType={InputFieldVariant.INPUT}
            placeholder="Digite o link"
            isLoading={loadingUpdateState.linkDue}
            defaultValue={data?.properties["Link de Due Diligence"]?.url || "Sem link disponível"}
            className="2xsm:wfull md:w-100 !h-10"
            onSubmit={(_, value) => handleUpdateDueLink(value, id)}
          />

          <Button
            disabled={!data?.properties["Link de Due Diligence"]?.url || editLock}
            className="disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            onClick={() => window.open(data?.properties["Link da Due"]?.url, '_blank')}
          >
            <FaLink />
            Visualizar Due
          </Button>

          <Button
            disabled={!data?.properties["Link de Due Diligence"]?.url || editLock}
            className={`disabled:opacity-50 disabled:cursor-not-allowed mt-2 ${linkCopied && "!text-snow !bg-green-500 hover:!bg-green-600"}`}
            onClick={() => handleCopyDueLink()}
          >
            {linkCopied ? (
              <>
                <LuClipboardCheck />
                <p>Link Copiado!</p>
              </>
            ) : (
              <>
                <LuCopy />
                Copiar
              </>
            )}
          </Button>
        </div>
      </section>

      <section id="cedentes" className="grid gap-6 p-4 rounded-md bg-white dark:bg-boxdark">
        <h3 className="text-bodydark2 font-medium">
          Detalhes do precatório
        </h3>
        <div className="grid grid-cols-4 3xl:grid-cols-5 gap-6">
          <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
            <CelerInputField
              name="vl_com_reservas"
              fieldType={InputFieldVariant.INPUT}
              label="Valor Líquido"
              defaultValue={
                numberFormat(
                  (data.properties["Valor Líquido (Com Reserva dos Honorários)"]?.formula?.number || 0)
                )
              }
              iconSrc={<GiReceiveMoney className="self-center" />}
              iconAlt="money"
              className="w-full disabled:dark:text-white disabled:text-boxdark"
              disabled={true}
            />
          </div>

          <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
            <CelerInputField
              name="proposta"
              fieldType={InputFieldVariant.INPUT}
              label="Proposta Escolhida"
              defaultValue={numberFormat(data?.properties["Proposta Escolhida - Celer"]?.number || 0)}
              iconSrc={<LuHandshake className="self-center" />}
              iconAlt="deal"
              className="w-full disabled:dark:text-white disabled:text-boxdark"
              disabled={true}
            />
          </div>
          <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
            <CelerInputField
              name="comissao"
              fieldType={InputFieldVariant.INPUT}
              label="Comissão"
              defaultValue={numberFormat(data?.properties["Comissão - Celer"]?.number || 0)}
              iconSrc={<TbMoneybag className="self-center" />}
              iconAlt="money_bag"
              className="w-full disabled:dark:text-white disabled:text-boxdark"
              disabled={true}
            />
          </div>
          <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
            <CelerInputField
              name="custo_total"
              fieldType={InputFieldVariant.INPUT}
              label="Custo total do Precatório (absoluto)"
              defaultValue={
                numberFormat(
                  (data.properties["Comissão - Celer"].number || 0) +
                  (data.properties["Proposta Escolhida - Celer"].number || 0)
                )
              }
              iconSrc={<GiReceiveMoney className="self-center" />}
              iconAlt="money"
              className="w-full disabled:dark:text-white disabled:text-boxdark"
              disabled={true}
            />
          </div>
          <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
            <CelerInputField
              name="custo"
              fieldType={InputFieldVariant.INPUT}
              label="Custo do precatório"
              defaultValue={percentageFormater(data?.properties["Custo do precatório"]?.formula?.number || 0)}
              iconSrc={<GiReceiveMoney className="self-center" />}
              iconAlt="receive_money"
              className="w-full disabled:dark:text-white disabled:text-boxdark"
              disabled={true}
            />
          </div>
          <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
            <CelerInputField
              name="loa"
              fieldType={InputFieldVariant.INPUT}
              label="LOA"
              defaultValue={data?.properties["LOA"]?.number || "Sem LOA cadastrada"}
              iconSrc={<IoCalendar className="self-center" />}
              iconAlt="calendar"
              className="w-full disabled:dark:text-white disabled:text-boxdark"
              disabled={true}
            />
          </div>
          <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
            <CelerInputField
              name="esfera"
              fieldType={InputFieldVariant.INPUT}
              label="Esfera"
              defaultValue={data?.properties["Esfera"].select?.name || "Não informada"}
              iconSrc={<IoGlobeOutline className="self-center" />}
              iconAlt="calendar"
              className="w-full disabled:dark:text-white disabled:text-boxdark"
              disabled={true}
            />
          </div>
          <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
            <CelerInputField
              name="percentual_de_honorarios"
              fieldType={InputFieldVariant.INPUT}
              label="Destacamento de Honorários"
              defaultValue={percentageFormater(data?.properties["Percentual de Honorários Não destacados"].number || 0)}
              iconSrc={<GiReceiveMoney className="self-center" />}
              iconAlt="money"
              className="w-full disabled:dark:text-white disabled:text-boxdark"
              disabled={true}
            />
          </div>
          <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
            <CelerInputField
              name="spread"
              fieldType={InputFieldVariant.INPUT}
              label="Spread"
              defaultValue={
                numberFormat(
                  (data.properties["Nova Fórmula do Desembolso"].formula?.number || 0) -
                  (data.properties["Comissão - Celer"].number || 0) -
                  (data.properties["Proposta Escolhida - Celer"].number || 0)
                )
              }
              iconSrc={<GiTakeMyMoney className="self-center" />}
              iconAlt="money"
              className="w-full disabled:dark:text-white disabled:text-boxdark"
              disabled={true}
            />
          </div>
          <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
            <CelerInputField
              name="percentual_a_ser_adquirido"
              fieldType={InputFieldVariant.INPUT}
              label="Percentual a ser Adquirido"
              defaultValue={percentageFormater(data?.properties["Percentual a ser adquirido"]?.number || 0)}
              iconSrc={<GiReceiveMoney className="self-center" />}
              iconAlt="money"
              className="w-full disabled:dark:text-white disabled:text-boxdark"
              disabled={true}
            />
          </div>
          <div className="2xsm:col-span-4 md:col-span-2 xl:col-span-1">
            <CelerInputField
              name="valor_liquido_cedido"
              fieldType={InputFieldVariant.INPUT}
              label="Valor Líquido a ser Cedido"
              defaultValue={
                numberFormat(
                  (data?.properties["Valor Líquido a ser cedido"]?.formula?.number || 0)
                )
              }
              iconSrc={<GiPayMoney className="self-center" />}
              iconAlt="money"
              className="w-full disabled:dark:text-white disabled:text-boxdark"
              disabled={true}
            />
          </div>
        </div>

        <hr className="border border-stroke dark:border-strokedark" />

        <div className="grid gap-6">
          <CelerInputField
            name="calculo_revisado_check"
            fieldType={InputFieldVariant.CHECKBOX}
            checked={data?.properties["Cálculo Revisado"].checkbox}
            label="Cálculo Revisado"
            isLoading={loadingUpdateState.revisaoCalculo}
            onValueChange={(_, value) => handleUpdateRevisaoCalculo(value, id)}
            className="text-sm font-medium"
          />
        </div>
      </section>

      <section id="valores_grafico">
        <div className="grid 2xsm:grid-cols-2 xl:grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
          {/*
          Deve ser feita uma verificação em "Data de aquisição do precatório" para que o gráfico seja exibido ou não - situação em que o precatório ainda não foi adquirido. Caso não tenha sido adquirido, o gráfico não deve ser exibido, ficando apenas uma div opaca com a mensagem "Gráfico de rentabilidade indisponível".
          */}
          <div className="col-span-8 3xl:col-span-8">
            <RentabilityChart data={vlData} />
          </div>
          <div className=" 2xsm:col-span-8 xl:col-span-4 3xl:col-span-4 flex flex-col gap-6 bg-white dark:bg-boxdark p-4 rounded-md">
            <h2 className="text-xl font-medium">Rentabilidade x Desembolso</h2>

            <div className="px-5 flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="flex-1">Rentabilidade Anual</span>
                  <CelerInputField
                    ref={rentabilidadeSlideRef}
                    name="rentabilidade_anual"
                    fieldType={InputFieldVariant.INPUT}
                    iconSrc={
                      <CRMTooltip text="Insira um valor e pressione ENTER para modificar">
                        <BiInfoCircle className="cursor-pointer" />
                      </CRMTooltip>
                    }
                    defaultValue={`${(sliderValues.rentabilidade * 100).toFixed(2).replace(".", ",")}%`}
                    className="w-25 text-right font-medium"
                    onSubmit={(_, value) => handleChangeRentabilidadeSlider(value)}
                    disabled={editLock}
                  />
                </div>
                <input
                  onChange={(e) => handleChangeRentabilidadeSlider(e.target.value, true)}
                  type="range"
                  min={0}
                  max={2}
                  step={0.01}
                  className="w-full range-slider disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  value={sliderValues.rentabilidade}
                />
              </div>
            </div>

            <div className="px-5 flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="flex-1">Desembolso</span>
                  <CelerInputField
                    ref={desembolsoSlideRef}
                    name="desembolso"
                    fieldType={InputFieldVariant.INPUT}
                    iconSrc={
                      <CRMTooltip text="Insira um valor e pressione ENTER para modificar">
                        <BiInfoCircle className="cursor-pointer" />
                      </CRMTooltip>
                    }
                    defaultValue={numberFormat(sliderValues.desembolso) || "0,00"}
                    className="max-w-40 text-right font-medium"
                    onSubmit={(_, value) => handleChangeDesembolsoSlider(value)}
                    disabled={editLock}
                  />
                </div>
                <input
                  onChange={(e) => handleChangeDesembolsoSlider(e.target.value, true)}
                  type="range"
                  min={data && handleDesembolsoVsRentabilidade(2, data).desembolso}
                  max={data && data.properties["Valor Projetado"].number || 0}
                  step={0.01}
                  className="w-full range-slider disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  value={sliderValues.desembolso}
                />
              </div>
            </div>

            <Button
              disabled={disabledSaveButton}
              onClick={handleSaveValues}
              className="w-fit mx-auto text-sm uppercase">
              {loadingUpdateState.formValores && (<AiOutlineLoading className="animate-spin" />)}
              <span className="font-medium">Salvar Valores</span>
            </Button>

            {sliderError && (
              <span className="text-red-500 dark:text-red-400 text-xs uppercase font-medium text-center">Valores fora do escopo permitido!</span>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-1">
                <CelerInputField
                  name="valor_projetado"
                  fieldType={InputFieldVariant.INPUT}
                  label="Valor Projetado"
                  defaultValue={numberFormat(data?.properties["Valor Projetado"]?.number || 0)}
                  className="w-full disabled:dark:text-white disabled:text-boxdark"
                  disabled={true}
                />
              </div>
              <div className="col-span-1">
                <CelerInputField
                  name="previsao_de_pgto"
                  fieldType={InputFieldVariant.DATE}
                  label="Previsão de pagamento"
                  defaultValue={dateFormater(data?.properties["Previsão de pagamento"]?.date?.start)}
                  className="w-full disabled:dark:text-white disabled:text-boxdark"
                  onSubmit={(_, value) => handleUpdatePrevisaoDePagamento(value, id)}
                />
              </div>

              <hr className="border border-stroke dark:border-strokedark col-span-2" />

              <div className="col-span-2">
                <CelerInputField
                  name="espelho_oficio_check"
                  fieldType={InputFieldVariant.CHECKBOX}
                  label="Espelho do Ofício"
                  defaultValue={data?.properties["Espelho do ofício"].checkbox}
                  className="text-sm font-medium"
                  onValueChange={(_, value) => handleUpdateEspelhoDoOficio(value, id)}
                  isLoading={loadingUpdateState.espelhoOficio}
                  disabled={editLock}
                />
              </div>

              {data?.properties["Esfera"].select?.name !== "FEDERAL" && (
                <div className="col-span-2">
                  <CelerInputField
                    name="espelho_oficio_check"
                    fieldType={InputFieldVariant.CHECKBOX}
                    label="Estoque de Precatórios Baixado"
                    defaultValue={data?.properties["Estoque de Precatórios Baixado"].checkbox}
                    className="text-sm font-medium"
                    onValueChange={(_, value) => handleUpdateEstoquePrecatorio(value, id)}
                    isLoading={loadingUpdateState.estoquePrecatorio}
                    disabled={editLock}
                  />
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      <section id="observacao" className="form-inputs-container">
        <div className="col-span-5">

          <p className='mb-2'>Observações:</p>
          <div className='relative'>
            <textarea
              defaultValue={data?.properties["Observação"]?.rich_text?.[0]?.plain_text || ""}
              className='w-full rounded-md placeholder:text-sm border-stroke dark:border-strokedark dark:bg-boxdark-2/50 resize-none'
              onChange={(e) => setObservation(e.target.value)}
              rows={10}
              placeholder='Insira uma observação'
            />
            <Button
              variant='ghost'
              onClick={() => handleUpdateObservation(observation, id)}
              className='absolute z-2 bottom-3 right-2 py-1 text-sm px-1 bg-slate-100 hover:bg-slate-200 dark:bg-boxdark-2/50 dark:hover:bg-boxdark-2/70'>
              {/* {
                                            savingObservation ? (
                                                <AiOutlineLoading className="text-lg animate-spin" />
                                            ) : ( */}
              <BiSave className="text-lg" />
              {/* )
                                        } */}
            </Button>
          </div>
        </div>
      </section>

      {statusDiligence === "Due Diligence" && (
        <div className="flex items-center justify-center gap-6 bg-white dark:bg-boxdark p-4 rounded-md">
          <Button
            variant="danger"
            className="py-2 px-4 rounded-md flex items-center gap-3 uppercase text-sm font-medium"
            onClick={() => handlePendencia()}
          >
            <BiX className="h-4 w-4" />
            <span>Pendência a Sanar</span>
          </Button>
          {statusDiligence === "Due Diligence" ? (
            <Button
              variant="success"
              className="py-2 px-4 rounded-md flex items-center gap-3 uppercase text-sm font-medium"
              onClick={() => handleDueDiligence()}
            >
              <BiSolidCoinStack className="h-4 w-4" />
              <span>
                Enviar para Liquidação
              </span>
            </Button>
          ) : null}
        </div>
      )}
      {statusDiligence === "Em cessão" && (
        <div className="flex items-center justify-center gap-6 bg-white dark:bg-boxdark p-4 rounded-md">
          <Button
            variant="danger"
            className="py-2 px-4 rounded-md flex items-center gap-3 uppercase text-sm font-medium"
            onClick={() => handlePendencia()}
          >
            <BiX className="h-4 w-4" />
            <span>Pendência a Sanar</span>
          </Button>
          {statusDiligence === "Em cessão" ? (
            <Button
              variant="success"
              className="py-2 px-4 rounded-md flex items-center gap-3 uppercase text-sm font-medium"
              onClick={() => handleCessao()}
            >
              <BiSolidCoinStack className="h-4 w-4" />
              <span>
                Enviar pra Registro de Cessão
              </span>
            </Button>
          ) : null}
        </div>
      )}
      {cedenteModal !== null && <BrokerModal />}
      {docModalInfo !== null && <DocForm />}
    </div>
  );
};
