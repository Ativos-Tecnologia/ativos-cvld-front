"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { NotionPage } from "@/interfaces/INotion";
import api from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaBuilding, FaBuildingColumns, FaUser } from "react-icons/fa6";
import { FaBalanceScale, FaIdCard, FaMapMarkedAlt, FaRegFilePdf } from "react-icons/fa";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import {
  UserInfoAPIContext,
  UserInfoContextType,
} from "@/context/UserInfoContext";
import { InputFieldVariant } from "@/enums/inputFieldVariants.enum";
import { CelerInputField } from "../CrmUi/InputFactory";
import { handleDesembolsoVsRentabilidade, findRentabilidadeAoAnoThroughDesembolso } from "@/functions/juridico/solverDesembolsoVsRentabilidade";
import { SelectItem } from "../ui/select";
import { estados } from "@/constants/estados";
import { IoCalendar, IoDocumentTextSharp } from "react-icons/io5";
import CelerInputFormField from "../Forms/CustomFormField";
import LifeCycleStep from "../LifeCycleStep";
import { tribunais } from "@/constants/tribunais";
import numberFormat from "@/functions/formaters/numberFormat";
import Link from "next/link";
import { BiInfoCircle, BiSolidSave, BiSolidCalculator } from "react-icons/bi";
import { GrDocumentText, GrDocumentUser } from "react-icons/gr";
import { Button } from "../Button";
import backendNumberFormat from "@/functions/formaters/backendNumberFormat";
import UseMySwal from "@/hooks/useMySwal";
import { AxiosError } from "axios";
import CRMTooltip from "../CrmUi/Tooltip";
import BrokerModal from "../Modals/BrokersCedente";
import { BrokersContext } from "@/context/BrokersContext";
import DataStatsTwo from "../DataStats/DataStatsTwo";
import { BsPencilSquare } from "react-icons/bs";
import DocForm from "../Modals/BrokersDocs";
import { AiOutlineLoading } from "react-icons/ai";
import RentabilityChart from "../Charts/RentabilityChart";
import { IWalletResponse } from "@/interfaces/IWallet";
import JuridicoDetailsSkeleton from "../Skeletons/JuridicoDetailsSkeleton";

type JuridicoDetailsProps = {
  id: string;
};

export const LegalDetails = ({ id }: JuridicoDetailsProps) => {
  const {
    data: { first_name },
  } = useContext<UserInfoContextType>(UserInfoAPIContext);

  const {
    cedenteModal,
    setCedenteModal,
    docModalInfo,
    setDocModalInfo,
  } = useContext(BrokersContext);


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
    sliderValores: false
  });
  const [editLock, setEditLock] = useState<boolean>(false);
  const [disabledSaveButton, setDisabledSaveButton] = useState<boolean>(true);
  const [sliderValues, setSliderValues] = useState({
    rentabilidade: 0,
    desembolso: 0
  })

  const swal = UseMySwal();

  /* refs */
  const rentabilidadeSlideRef = useRef<HTMLInputElement>(null);
  const desembolsoSlideRef = useRef<HTMLInputElement>(null);

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

  const onSubmitForm = async (data: any) => {
    setIsLoadingRecalculation(true);

    if (data.valor_aquisicao_total) {
      data.percentual_a_ser_adquirido = 1;
    } else {
      data.percentual_a_ser_adquirido = data.percentual_a_ser_adquirido / 100;
    }

    if (typeof data.valor_principal === "string") {
      data.valor_principal = backendNumberFormat(data.valor_principal) || 0;
      data.valor_principal = parseFloat(data.valor_principal);
    }

    if (typeof data.valor_juros === "string") {
      data.valor_juros = backendNumberFormat(data.valor_juros) || 0;
      data.valor_juros = parseFloat(data.valor_juros);
    }

    if (data.data_base) {
      data.data_base = data.data_base.split("/").reverse().join("-");
    }

    if (data.data_requisicao) {
      data.data_requisicao = data.data_requisicao.split("/").reverse().join("-");
    }

    if (data.data_limite_de_atualizacao) {
      data.data_limite_de_atualizacao = data.data_limite_de_atualizacao.split("/").reverse().join("-");
    }

    if (typeof data.valor_pss) {
      data.valor_pss = backendNumberFormat(data.valor_pss) || 0;
      data.valor_pss = parseFloat(data.valor_pss);
    }

    if (!data.ir_incidente_rra) {
      data.numero_de_meses = 0
    } else {
      data.numero_de_meses = Number(data.numero_de_meses)
    }

    if (!data.incidencia_pss) {
      data.valor_pss = 0
    }

    if (!data.data_limite_de_atualizacao_check) {
      delete data.data_limite_de_atualizacao_check
    }

    data.upload_notion = true;

    try {
      const response = await api.patch(`/api/juridico/update/precatorio/${id}/`, data);
      refetch();
      setHappenedRecalculation(true);
      setRecalculationData(response.data);


      swal.fire({
        title: 'Sucesso',
        text: 'Dados atualizados com sucesso!',
        icon: 'success',
        confirmButtonText: 'OK'
      });

    } catch (error: AxiosError | any) {
      swal.fire({
        title: 'Erro',
        text: `${error.response?.data?.detail || error.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      })
      console.log(error)
    }

    setIsLoadingRecalculation(false);
  }

  async function fetchData() {
    const response = await api.get(`/api/notion-api/list/page/${id}/`);
    return response.data;
  }

  const { data, isFetching, isLoading, refetch } = useQuery<NotionPage>({
    queryKey: ["page", id],
    queryFn: fetchData,
  });

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
    const rawValue = value.replace(/R\$\s*/g, "").replaceAll(".", "").replaceAll(",", ".");

    const newDesembolso = Number(rawValue);
    const newRentabilidade = findRentabilidadeAoAnoThroughDesembolso(Number(newDesembolso), data).rentabilidade_ao_ano;

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

  const handleSaveValues = async () => {

    setLoadingUpdateState(prev => ({ ...prev, formValores: true }));
    try {
      const factor = Math.pow(10,5);
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

  // ----> Mutations <-----
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
        text: `Houve um erro ao atualizar o campo Juíz0.`,
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
      form.setValue("valor_principal", numberFormat(data?.properties["Valor Principal"].number || 0));
      form.setValue("valor_juros", numberFormat(data?.properties["Valor Juros"].number || 0));
      form.setValue("data_base", data?.properties["Data Base"].date?.start.split("-").reverse().join("/") || "");
      form.setValue("data_requisicao", data?.properties["Data do Recebimento"].date?.start.split("-").reverse().join("/") || "");
      form.setValue("valor_aquisicao_total", data?.properties["Percentual a ser adquirido"].number === 1);
      form.setValue("ja_possui_destacamento", data?.properties["Honorários já destacados?"].checkbox);
      form.setValue("percentual_de_honorarios", data?.properties["Percentual de Honorários Não destacados"].number! * 100 || 0);
      form.setValue("incidencia_juros_moratorios", data?.properties["Incidência de Juros Moratórios"].checkbox);
      form.setValue("nao_incide_selic_no_periodo_db_ate_abril", data?.properties["Incide Selic Somente Sobre Principal"].checkbox);
      form.setValue("incidencia_rra_ir", data?.properties["Incidencia RRA/IR"].checkbox);
      form.setValue("ir_incidente_rra", data?.properties["IR Incidente sobre RRA"].checkbox);
      form.setValue("numero_de_meses", data?.properties["Meses RRA"].number || 0);
      form.setValue("incidencia_pss", data?.properties["Meses RRA"].number || 0);
      form.setValue("incidencia_pss", data?.properties["PSS"].number! > 0);
      form.setValue("valor_pss", numberFormat(data?.properties["PSS"].number || 0));

      setFormData(form.watch);

      setSliderValues({
        rentabilidade: data?.properties["Rentabilidade Anual"].number || 0,
        desembolso: data?.properties["Nova Fórmula do Desembolso"].formula?.number || 0
      })
    }
  }, [data]);

  const fetchUpdatedVL = async (oficio: NotionPage) => {
    // Essa função recebe um objeto do tipo NotionPage e retorna um objeto do tipo IWalletResponse com os valores atualizados
    try {
        const response = await api.post('/api/extrato/wallet/', {
            oficio
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
            <div className="xl:col-span-2 w-full">
              <CelerInputField
                name="credor"
                fieldType={InputFieldVariant.INPUT}
                label="Nome do Credor"
                defaultValue={data?.properties["Credor"]?.title?.[0]?.plain_text}
                iconSrc={<FaUser
                  className="self-center" />}
                iconAlt="user"
                className="w-full"
                onSubmit={(_, value) => handleChangeCreditorName(value, id)}
                isLoading={loadingUpdateState.nomeCredor}
                disabled={editLock}
              />
            </div>

            <div className="col-span-1 w-full">
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
                defaultValue={data?.properties["CPF/CNPJ"]?.rich_text?.[0].plain_text}
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

          <section className="form-inputs-container" id="info_processo">
            <div className="col-span-1">
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
            <div className="col-span-1">
              <CelerInputField
                name="npu_precatorio"
                fieldType={InputFieldVariant.INPUT}
                label="NPU (Precatório)"
                defaultValue={data?.properties["NPU (Precatório)"]?.rich_text?.[0].plain_text}
                iconSrc={<IoDocumentTextSharp className="self-center" />}
                iconAlt="law"
                className="w-full"
                onSubmit={(_, value) => handleChangeNpu(value, "NPU (Precatório)", id)}
                isLoading={loadingUpdateState.npuPrecatorio}
                disabled={editLock}
              />
            </div>
            <div className="col-span-1">
              <CelerInputField
                name="juizo_vara"
                fieldType={InputFieldVariant.INPUT}
                label="Vara"
                defaultValue={data?.properties["Juízo"]?.rich_text?.[0].plain_text}
                iconSrc={<FaBuildingColumns className="self-center" />}
                iconAlt="law"
                className="w-full"
                onSubmit={(_, value) => handleChangeJuizo(value, id)}
                isLoading={loadingUpdateState.juizoVara}
                disabled={editLock}
              />
            </div>
            <div className="col-span-1">
              <CelerInputField
                name="ente_devedor"
                fieldType={InputFieldVariant.INPUT}
                label="Ente Devedor"
                defaultValue={data?.properties["Ente Devedor"].select?.name}
                iconSrc={<FaBuilding className="self-center" />}
                iconAlt="law"
                className="w-full"
                onSubmit={(_, value) => handleChangeEnteDevedor(value, id)}
                isLoading={loadingUpdateState.enteDevedor}
                disabled={editLock}
              />
            </div>
            <div className="col-span-1">
              <CelerInputField
                name="estado_ente_devedor"
                fieldType={InputFieldVariant.SELECT}
                label="Estado Ente Devedor"
                defaultValue={data?.properties["Estado do Ente Devedor"].select?.name}
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

          <section id="cedentes" className="form-inputs-container">
          <div className="col-span-4 w-full">
              <h3 className="text-bodydark2 font-medium">
                Detalhes do precatório
              </h3>
            </div>
              <div className="col-span-1">
                <CelerInputField
                  name="loa"
                  fieldType={InputFieldVariant.INPUT}
                  label="LOA"
                  defaultValue={data?.properties["LOA"]?.number || "Sem LOA cadastrada"}
                  iconSrc={<IoCalendar className="self-center" />}
                  iconAlt="law"
                  className="w-full"
                  disabled={true}
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


          <section id="info_valores" className="p-4 rounded-md bg-white dark:bg-boxdark">
            <form onSubmit={form.handleSubmit(onSubmitForm)}>
              <div className="grid grid-cols-4 3xl:grid-cols-5 gap-6">
                {/* tipo */}
                <div className="col-span-1">
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
                <div className="col-span-1">
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
                <div className="col-span-1">
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
                  <div className="col-span-1">
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
                <div className="col-span-1">
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
                <div className="col-span-1">
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
                <div className="col-span-1">
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
                <div className="col-span-1">
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
                <div className="col-span-1">
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

              <div className="grid grid-cols-4 3xl:grid-cols-5 gap-6 mt-6">
                <div className="col-span-2 3xl:col-span-3 grid grid-cols-2 gap-6">
                  {/* percentual adquirido */}
                  <div className="col-span-1">
                    <CelerInputFormField
                      control={form.control}
                      name="valor_aquisicao_total"
                      label="Aquisição Total"
                      fieldType={InputFieldVariant.CHECKBOX}
                      className="w-full"
                    />
                  </div>
                  {form.watch("valor_aquisicao_total") === false ? (
                    <div className="col-span-1">
                      <CelerInputFormField
                        control={form.control}
                        name="percentual_a_ser_adquirido"
                        label="Percentual de Aquisição (%)"
                        fieldType={InputFieldVariant.NUMBER}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="col-span-1">&nbsp;</div>
                  )}

                  {/* destacamento de honorários */}
                  <div className="col-span-2 flex gap-6">
                    <CelerInputFormField
                      control={form.control}
                      name="ja_possui_destacamento"
                      label="Já Possui Destacamento de Honorários?"
                      fieldType={InputFieldVariant.CHECKBOX}
                      className="w-full"
                    />
                    {form.watch("ja_possui_destacamento") === false ? (
                      <div className="col-span-1">
                        <CelerInputFormField
                          control={form.control}
                          name="percentual_de_honorarios"
                          label="Percentual"
                          fieldType={InputFieldVariant.NUMBER}
                          className="w-full"
                        />
                      </div>
                    ) : (
                      null
                    )}
                  </div>

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
                  <div className={`col-span-2 ${form.watch("data_base") && form.watch("data_base").split("/").reverse().join("-") > "2021-12-01" && form.watch("natureza") !== "TRIBUTÁRIA" ? "" : "hidden"}`}>
                    <CelerInputFormField
                      control={form.control}
                      name="nao_incide_selic_no_periodo_db_ate_abril"
                      label="SELIC Somente Sobre o Principal"
                      fieldType={InputFieldVariant.CHECKBOX}
                      className="w-full"
                    />
                  </div>

                  {/* incidência IR */}
                  <div className="col-span-2">
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
                      <div className="col-span-1">
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
                        <div className="col-span-1">&nbsp;</div>
                      )}
                    </>
                  ) : (
                    null
                  )}

                  {/* incidência de PSS */}
                  {form.watch("natureza") !== "TRIBUTÁRIA" && (
                    <>
                      <div className="col-span-1">
                        <CelerInputFormField
                          control={form.control}
                          name="incidencia_pss"
                          label="Incide PSS?"
                          fieldType={InputFieldVariant.CHECKBOX}
                          className="w-full"
                        />
                      </div>
                      {form.watch("incidencia_pss") === true ? (
                        <div className="col-span-1">
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
                        <div className="col-span-1">&nbsp;</div>
                      )}
                    </>
                  )}

                  {/* data limite de atualização */}
                  <div className="col-span-1">
                    <CelerInputFormField
                      control={form.control}
                      name="data_limite_de_atualizacao_check"
                      label="Atualiza Para Data Passada?"
                      fieldType={InputFieldVariant.CHECKBOX}
                      className="w-full"
                    />
                  </div>

                  {form.watch("data_limite_de_atualizacao_check") === true ? (
                    <div className="col-span-1">
                      <CelerInputFormField
                        control={form.control}
                        name="data_limite_de_atualizacao"
                        label="Atualizado Até:"
                        fieldType={InputFieldVariant.DATE}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="col-span-1">&nbsp;</div>
                  )}

                  {(form.watch("data_limite_de_atualizacao") && form.watch("data_limite_de_atualizacao").split("/").reverse().join("-") < form.watch("data_requisicao").split("/").reverse().join("-")) && (
                    <span className="text-red-500 dark:text-red-400 text-xs col-span-2">
                      Data de atualização não pode ser menor que a data da requisição
                    </span>
                  )}

                </div>
                
              </div>

              <hr className="border border-stroke dark:border-strokedark mt-6" />
              <div className="flex items-center justify-center gap-6 mt-6">
                <p>
                  Valor Líquido:{" "}
                </p>
                {
                  !isLoading && (
                    <span>
                      {numberFormat(happenedRecalculation === false ? data?.properties["Valor Líquido (Com Reserva dos Honorários)"]?.formula?.number || 0 : recalculationData.result.net_mount_to_be_assigned)}
                    </span>
                  )
                }
              </div>

              <div className="flex items-center justify-center gap-6 mt-6">

                <Button
                  type="submit"
                  variant="success"
                  isLoading={isLoadingRecalculation}
                  disabled={!isFormModified}
                  className="py-2 px-4 rounded-md flex items-center gap-3 disabled:opacity-50 disabled:hover:bg-green-500 uppercase text-sm"
                >
                  <BiSolidCalculator className="h-4 w-4" />
                  <span className="font-medium">Recalcular</span>
                </Button>

                {data?.properties["Memória de Cálculo Ordinário"].url && (
                  <Link
                    href={data?.properties["Memória de Cálculo Ordinário"].url}
                    className="bg-blue-600 hover:bg-blue-700 text-snow py-2 px-4 rounded-md flex items-center gap-3 transition-colors duration-300 uppercase text-sm"
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
                    className="bg-blue-600 hover:bg-blue-700 text-snow py-2 px-4 rounded-md flex items-center gap-3 transition-colors duration-300 uppercase text-sm"
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
      <div className=" grid grid-cols-12 mt-4 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-8 3xl:col-span-10">
      <RentabilityChart data={vlData} />
      </div>
      <div className="col-span-4 3xl:col-span-2 flex flex-col gap-6">
                  <h2 className="text-xl font-medium">Rentabilidade x Desembolso</h2>

                  <div className="px-10 flex flex-col gap-5">
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

                  <div className="px-10 flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="flex-1">Desembolso</span>
                        <CelerInputField
                          ref={rentabilidadeSlideRef}
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
                        ref={desembolsoSlideRef}
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

                </div>
      </div>

      {data?.properties["Status Diligência"].select?.name === "Due Diligence" && (
        <div className="flex items-center justify-center gap-6 bg-white dark:bg-boxdark p-4 rounded-md">
          <Button
            variant="success"
            className="py-2 px-4 rounded-md flex items-center gap-3 uppercase text-sm font-medium"
            onClick={() => handleDueDiligence()}
          >
            <BiSolidSave className="h-4 w-4" />
            <span>Finalizar Due Diligence</span>
          </Button>
        </div>
      )}
            {cedenteModal !== null && <BrokerModal />}
            {docModalInfo !== null && <DocForm />}
    </div>
  );
};
