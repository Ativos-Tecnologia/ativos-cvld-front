import dateFormater from "@/functions/formaters/dateFormater";
import numberFormat from "@/functions/formaters/numberFormat";
import { customFlowBiteTheme } from "@/themes/FlowbiteThemes";
import { Button, Drawer, Flowbite, Table } from "flowbite-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineLoading, AiOutlineReload, AiOutlineUser } from "react-icons/ai";
import { BiDownload, BiTransfer, BiX } from "react-icons/bi";
import { CgDetailsMore } from "react-icons/cg";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import { NotionPage } from "@/interfaces/INotion";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiNotionFill } from "react-icons/ri";
import percentageFormater from "@/functions/formaters/percentFormater";
import { MdOutlineFollowTheSigns } from "react-icons/md";
import notionColorResolver from "@/functions/formaters/notionColorResolver";
import { UserInfoAPIContext } from "@/context/UserInfoContext";
import { DynamicList } from "../List";
import statusOficio from "@/enums/statusOficio.enum";
import tipoOficio from "@/enums/tipoOficio.enum";
import { ENUM_OFICIOS_LIST, ENUM_TIPO_OFICIOS_LIST, ENUM_TRIBUNAIS_LIST } from "@/constants/constants";
import ReactInputMask from "react-input-mask";
import { TbGridDots } from "react-icons/tb";
import { HiOutlineLockClosed } from "react-icons/hi";
import { HiMiniCalendar } from "react-icons/hi2";
import Title from "../CrmUi/Title";
import CustomCheckbox from "../CrmUi/Checkbox";
import { toast } from "sonner";

type NotionDrawerProps = {
  pageId: string;
  setNotionDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  openDetailsDrawer: boolean;
};

export function NotionDrawer({ pageId, setNotionDrawer, openDetailsDrawer }: NotionDrawerProps) {


  const [pageData, setPageData] = useState<NotionPage>({
    id: "",
    properties: {}
  });
  const [dynamicListId, setDynamicListId] = useState<string | null>(null);
  const [checkMark, setCheckMark] = useState<string | null>(null);
  const [editableTaskInput, setEditableTaskInput] = useState<boolean>(false);
  const { data: { role } } = useContext(UserInfoAPIContext)

  const fetchNotionPageData = async (): Promise<NotionPage> => {
    const { data } = await api.get(`api/notion-api/list/page/${pageId}/`);
    return data;
  }

  const queryClient = useQueryClient()
  const { isPending, data, error, isFetching, refetch } = useQuery(
    {
      queryKey: ['notion_page_data'],
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      queryFn: fetchNotionPageData,
    },
  );

  /* -----> refs <----- */
  const inputCreditorRef = useRef<HTMLInputElement | null>(null);

  const handleClose = () => {
    setNotionDrawer(false);
    setEditableTaskInput(false);
  };

  /* ================> função copiada só para fins de entrega de feat <=================== */
  function fupDateConveter(date: string): string {
    const convertedDate = date.split("-").reverse().join();
    return convertedDate;
  }

  /* COMEÇA ÁREA DAS FUNÇÕES HANDLE */
  const handleChangeCreditorName = async (value: string, page_id: string) => {
    await creditorNameMutation.mutateAsync({
      page_id,
      value
    });
  }

  const handleChangeIdentification = async (page_id: string, value: string) => {
    await identificationMutation.mutateAsync({
      page_id,
      value
    });
  }

  const handleChangeEmail = async (page_id: string, value: string) => {
    await emailMutation.mutateAsync({
      page_id,
      value
    });
  }

  const handleChangePhoneNumber = async (page_id: string, type: string, value: string) => {
    await phoneNumberMutation.mutateAsync({
      page_id,
      type,
      value
    });
  }

  const handleChangeStatus = async (page_id: string, status: statusOficio) => {
    await statusMutation.mutateAsync({
      page_id,
      status
    });
  }

  const handleChangeFupDate = async (page_id: string, value: string, type: string) => {

    if (/^[0-9/]{10}$/.test(value)) {

      const parsedValue = value.split('/').reverse().join('-');
      await fupDateMutation.mutateAsync({
        page_id,
        value: parsedValue,
        type
      })

    } else {
      console.log('um campo de data precisa de 8 caracteres');
    }
  }

  const handleChangeTipo = async (page_id: string, oficio: tipoOficio) => {
    await tipoMutation.mutateAsync({
      page_id,
      oficio
    });
  }

  const handleChangeNpu = async (page_id: string, type: string, value: string) => {
    await npuMutation.mutateAsync({
      page_id,
      type,
      value
    });
  }

  const handleChangeTribunal = async (page_id: string, tribunal: string) => {
    await tribunalMutation.mutateAsync({
      page_id,
      tribunal
    })
  }

  const handleChangeJuizo = async (page_id: string, value: string) => {
    await juizoMutation.mutateAsync({
      page_id,
      value
    });
  }

  const handleChangeHonorarioState = async (page_id: string, value: boolean) => {
    await honorarioStateMutation.mutateAsync({
      page_id,
      value
    });
  }

  const handleChangeProposalPrice = async (page_id: string, value: string) => {
    const formatedValue = value.replace(/[^0-9,]/g, '');
    const valueToNumber = parseFloat(formatedValue);
    await proposalPriceMutation.mutateAsync({
      page_id,
      value: valueToNumber
    })
  }

  /* TERMINA ÁREA DAS FUNÇÕES HANDLE */

  /* ========================================== */

  /* COMEÇA A ÁREA DAS MUTATIONS */

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
      await queryClient.cancelQueries({ queryKey: ['notion_list'] });
      const previousData = queryClient.getQueryData(['notion_page_data']);
      return { previousData }
    },
    onError: (data, paramsObj, context) => {
      queryClient.setQueryData(['notion_page_data'], context?.previousData);
      toast.error('Não foi possível alterar o nome do credor');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_list'] })
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
      await queryClient.cancelQueries({ queryKey: ['notion_list'] });
      const previousData: any = queryClient.getQueryData(['notion_page_data']);
      return { previousData }
    },
    onError: (data, paramsObj, context) => {
      queryClient.setQueryData(['notion_page_data'], context?.previousData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_list'] })
    }
  });

  const emailMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Contato de E-mail": {
          "email": paramsObj.value
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async (paramsObj: { page_id: string, value: string }) => {
      await queryClient.cancelQueries({ queryKey: ['notion_list'] });
      const previousData: any = queryClient.getQueryData(['notion_page_data']);
      return { previousData }
    },
    onError: (data, paramsObj, context) => {
      queryClient.setQueryData(['notion_page_data'], context?.previousData);
      toast.error('Erro ao alterar o email');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_list'] })
    }
  });

  const phoneNumberMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, type: string, value: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        [paramsObj.type]: {
          "phone_number": paramsObj.value
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async (paramsObj: any) => {
      await queryClient.cancelQueries({ queryKey: ['notion_list'] });
      const previousData: any = queryClient.getQueryData(['notion_page_data']);
      return { previousData }
    },
    onError: (data, paramsObj, context) => {
      queryClient.setQueryData(['notion_page_data'], context?.previousData);
      toast.error('Erro ao alterar o contato');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_list'] })
    }
  });

  const statusMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, status: statusOficio }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Status": {
          "status": {
            "name": `${paramsObj.status}`
          }
        }
      });
      if (response.status !== 202) {
        throw new Error('Houve um erro ao alterar o status');
      }
      return response.data
    },
    onMutate: async (paramsObj: { page_id: string, status: statusOficio }) => {
      await queryClient.cancelQueries({ queryKey: ['notion_list'] });
      const previousData: NotionPage | undefined = queryClient.getQueryData(['notion_page_data']);
      queryClient.setQueryData(['notion_page_data'], (old: NotionPage) => {
        return {
          ...old, properties: {
            ...old.properties,
            Status: {
              ...old.properties.Status,
              status: {
                ...old.properties.Status.status,
                name: paramsObj.status
              }
            }
          }
        }
      })
      return { previousData }
    },
    onError: (data, paramsObj, context) => {
      queryClient.setQueryData(['notion_page_data'], context?.previousData)
      toast.error('Erro ao alterar o status do ofício')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_page_data'] })
      queryClient.invalidateQueries({ queryKey: ['notion_list'] })
    }
  });

  const fupDateMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: string, type: string }) => {
      let responseStatus: number = 0;

      if (data?.properties[paramsObj.type].date === null) {

        const dateObject = {
          end: null,
          start: paramsObj.value,
          time_zone: null
        }

        const resNotion = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
          [paramsObj.type]: {
            "date": dateObject
          }
        });

        responseStatus = resNotion.status;

      } else {
        const resNotion = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
          [paramsObj.type]: {
            "date": {
              "start": paramsObj.value
            }
          }
        });

        responseStatus = resNotion.status;
      }

      if (responseStatus !== 202) {
        console.log('houve um erro ao salvar os dados no notion');
      }
    },
    onMutate: async (paramsObj: any) => {
      await queryClient.cancelQueries({ queryKey: ['notion_list'] });
      const previousData: any = queryClient.getQueryData(['notion_page_data']);
      return { previousData }
    },
    onError: (data, paramsObj, context) => {
      queryClient.setQueryData(['notion_page_data'], context?.previousData);
      toast.error('Erro ao alterar a data de follow up');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_list'] })
    }
  });

  const tipoMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, oficio: tipoOficio }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Tipo": {
          "select": {
            "name": `${paramsObj.oficio}`
          }
        },
      });

      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data;
    },
    onMutate: async (paramsObj: { page_id: string, oficio: tipoOficio }) => {
      await queryClient.cancelQueries({ queryKey: ['notion_list'] });
      const previousData: NotionPage | undefined = queryClient.getQueryData(['notion_page_data']);
      queryClient.setQueryData(['notion_page_data'], (old: NotionPage) => {
        return {
          ...old, properties: {
            ...old.properties,
            Tipo: {
              ...old.properties.Tipo,
              select: {
                ...old.properties.Tipo.select,
                name: paramsObj.oficio
              }
            }
          }
        }
      })
      return { previousData }
    },
    onError: (data, paramsObj, context) => {
      queryClient.setQueryData(['notion_page_data'], context?.previousData);
      toast.error('Erro ao alterar o tipo do ofício');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_page_data'] });
      queryClient.invalidateQueries({ queryKey: ['notion_list'] });
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
        console.log('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async (paramsObj: any) => {
      await queryClient.cancelQueries({ queryKey: ['notion_list'] });
      const previousData: any = queryClient.getQueryData(['notion_page_data']);
      return { previousData }
    },
    onError: (data, paramsObj, context) => {
      queryClient.setQueryData(['notion_page_data'], context?.previousData);
      toast.error('não foi possível atualizar o campo')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_list'] });
    }
  });

  const tribunalMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, tribunal: string }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Tribunal": {
          "select":
          {
            "name": paramsObj.tribunal
          }
        }
      });
      if (response.status !== 202) {
        console.log('houve um erro ao salvar os dados no notion');
      }
      return response.data;
    },
    onMutate: async (paramsObj: { page_id: string, tribunal: string }) => {
      await queryClient.cancelQueries({ queryKey: ['notion_list'] });
      const previousData: NotionPage | undefined = queryClient.getQueryData(['notion_page_data']);
      queryClient.setQueryData(['notion_page_data'], (old: NotionPage) => {
        return {
          ...old, properties: {
            ...old.properties,
            Tribunal: {
              ...old.properties.Tribunal,
              select: {
                ...old.properties.Tribunal.select,
                name: paramsObj.tribunal
              }
            }
          }
        }
      })
      return { previousData }
    },
    onError: (data, paramsObj, context) => {
      queryClient.setQueryData(['notion_page_data'], context?.previousData);
      toast.error('Erro ao alterar o tipo do ofício');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_page_data'] });
      queryClient.invalidateQueries({ queryKey: ['notion_list'] });
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
    onMutate: async (paramsObj: any) => {
      await queryClient.cancelQueries({ queryKey: ['notion_list'] });
      const previousData: any = queryClient.getQueryData(['notion_page_data']);
      return { previousData }
    },
    onError: (data, paramsObj, context) => {
      queryClient.setQueryData(['notion_page_data'], context?.previousData)
      toast.error('não foi possível atualizar o campo Juízo');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_list'] })
    }
  });

  const honorarioStateMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: boolean }) => {
      const resNotion = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Honorários já destacados?": {
          "checkbox": !paramsObj.value
        }
      });
      if (resNotion.status !== 202) {
        console.log('houve um erro ao salvar os dados no notion');
      }
      queryClient.invalidateQueries({ queryKey: ['notion_page_data'] });
    },
    onMutate: async (paramsObj: any) => {
      setCheckMark('honorário');
      await queryClient.cancelQueries({ queryKey: ['notion_list'] });
      const previousData: any = queryClient.getQueryData(['notion_page_data']);
      return { previousData }
    },
    onError: (data, paramsObj, context) => {
      queryClient.setQueryData(['notion_page_data'], context?.previousData);
      toast.error('não foi possível atualizar o campo honorário')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_list'] })
    },
    onSettled: () => {
      setCheckMark(null)
    }
  });

  const proposalPriceMutation = useMutation({
    mutationFn: async (paramsObj: { page_id: string, value: number }) => {
      const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
        "Preço Proposto": {
          "number": paramsObj.value
        }
      });
      if (response.status !== 202) {
        throw new Error('houve um erro ao salvar os dados no notion');
      }
      return response.data
    },
    onMutate: async (paramsObj) => {
      await queryClient.cancelQueries({ queryKey: ['notion_list'] });
      const previousData: any = queryClient.getQueryData(['notion_page_data']);
      return { previousData }
    },
    onError: (data, paramsObj, context) => {
      queryClient.setQueryData(['notion_page_data'], context?.previousData);
      toast.error('Erro ao alterar o preço proposto');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_list'] })
    }
  });

  /* TERMINA A ÁREA DAS MUTATIONS */

  const applyMaskCpfCnpj = (str: string) => {

    if (!str) return;

    if (/^(?=.*\.)(?=.*-).+$/.test(str)) return str;

    let maskedStr;

    if (str.length > 0 && str.length <= 11) {
      maskedStr = `${str.slice(0, 3)}.${str.slice(3, 6)}.${str.slice(6, 9)}-${str.slice(9, 11)}`
    } else {
      maskedStr = `${str.slice(0, 2)}.${str.slice(2, 5)}.${str.slice(5, 8)}-${str.slice(8, 12)}/${str.slice(12, 14)}`
    }

    return maskedStr
  }

  return (
    <>
      {
        pageData.properties && (<Flowbite theme={{ theme: customFlowBiteTheme }}>
          <Drawer open={openDetailsDrawer} onClose={handleClose} style={{
            boxShadow: "2px 0 2px 0 rgba(0, 0, 0, 0.1)"
          }} className="min-w-48 sm:w-115 flex flex-col" backdrop={true}>
            {isFetching ? (
              <div className="flex flex-col w-fit mx-auto h-full gap-8 items-center justify-center">
                <AiOutlineLoading className="w-10 h-10 animate-spin fill-blue-700" />
                <p className="text-sm text-center">Carregando dados do extrato<span className="typewriter">...</span></p>
              </div>
            ) : (
              <React.Fragment>
                {/* <Drawer.Header title={data.credor || 'Sem título'} onClose={handleClose} titleIcon={CgDetailsMore} className="mb-1 border-b dark:border-form-strokedark" /> */}
                <div className="mb-1 border-b dark:border-form-strokedark">
                  <div className="flex items-center mb-4 gap-3 text-2xl font-semibold">
                    <CgDetailsMore />
                    <div className="relative flex-1">
                      <input
                        ref={inputCreditorRef}
                        type="text"
                        defaultValue={data?.properties?.Credor?.title[0].text.content || 'Sem título'}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                            handleChangeCreditorName(e.currentTarget.value, data!.id)
                          }
                        }}
                        className={`w-full text-2xl pl-1 focus-within:ring-0 focus-within:border-transparent border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                      />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-300 dark:hover:bg-form-strokedark text-lg cursor-pointer transition-all duration-200">
                      <BiX onClick={handleClose} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end mb-2">
                    {role === "ativos" && (
                      <a href={data!.url} target='_blank' rel='referrer'
                        title='Abrir no Notion'
                        className='py-1 px-2 mr-1 flex items-center justify-center gap-1 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-100 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                      >
                        <RiNotionFill className='text-lg'
                        />
                        <span className='text-xs font-semibold'>Notion</span>
                      </a>)
                    }
                    <button className="py-1 px-2 flex items-center justify-center gap-1 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-100 group-hover:opacity-100 transition-all duration-200 cursor-pointer" onClick={() => refetch()}>
                      <AiOutlineReload />
                      <span className="text-xs font-semibold">Atualizar</span>
                    </button>
                  </div>
                </div>
                <Drawer.Items>
                  <div className="overflow-x-auto">
                    <Table className="min-w-full table-auto border-collapse">
                      <tbody>
                        <tr className="bg-blue-700">
                          <td className="text-white px-4 py-2 font-semibold flex items-center">
                            <AiOutlineUser className="mr-4 text-lg" /> Informações do Credor
                          </td>
                          <td className="text-boxdark min-w-[210px] px-4 py-2">
                            &nbsp;
                          </td>
                        </tr>
                        {/* {

                              <tr className="bg-gray dark:bg-boxdark-2">
                                <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left text-boxdark">Regra de Cálculo</td>
                                <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark">Após 12/2021</td>
                              </tr>
                          } */}
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">CPF/CNPJ do credor</td>
                            <td className="border border-stroke dark:border-strokedark px-4 py-2">
                              <input
                                type="text"
                                defaultValue={applyMaskCpfCnpj(data?.properties["CPF/CNPJ"]?.rich_text?.length ? data?.properties["CPF/CNPJ"]?.rich_text![0]!.plain_text : "")}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    handleChangeIdentification(data!.id, e.currentTarget.value)
                                  }
                                }}
                                className={`w-full p-0 focus-within:ring-0 focus-within:border-transparent text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                              />
                              {/* {data?.properties["CPF/CNPJ"]?.rich_text?.length ? data?.properties["CPF/CNPJ"]?.rich_text![0]!.plain_text : ""} */}
                            </td>
                          </tr>
                        }
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">E-mail</td>
                          <td className="border border-stroke dark:border-strokedark px-4 py-2">
                            <input
                              type="text"
                              defaultValue={data?.properties['Contato de E-mail'].email || ''}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                  handleChangeEmail(data!.id, e.currentTarget.value)
                                }
                              }}
                              className={`w-full p-0 focus-within:ring-0 focus-within:border-transparent text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                            />
                            {/* {data?.properties["Contato de E-mail"].email || ""} */}
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Contato</td>
                          <td className="border border-stroke dark:border-strokedark px-4 py-2">
                            <ReactInputMask
                              mask='(99) 99999-9999'
                              maskChar={null}
                              defaultValue={data?.properties["Contato Telefônico"].phone_number || ''}
                              type="text"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                  handleChangePhoneNumber(data!.id, 'Contato Telefônico', e.currentTarget.value)
                                }
                              }}
                              className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                            />
                          </td>
                        </tr>

                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Contato 2</td>
                          <td className="border border-stroke dark:border-strokedark px-4 py-2">
                            <ReactInputMask
                              mask='(99) 99999-9999'
                              maskChar={null}
                              defaultValue={data?.properties["Contato Telefônico 2"].phone_number || ''}
                              type="text"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                  handleChangePhoneNumber(data!.id, 'Contato Telefônico 2', e.currentTarget.value)
                                }
                              }}
                              className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                            />
                          </td>
                        </tr>

                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Contato 3</td>
                          <td className="border border-stroke dark:border-strokedark px-4 py-2">
                            <ReactInputMask
                              mask='(99) 99999-9999'
                              maskChar={null}
                              defaultValue={data?.properties["Contato Telefônico 3"].phone_number || ''}
                              type="text"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                  handleChangePhoneNumber(data!.id, 'Contato Telefônico 3', e.currentTarget.value)
                                }
                              }}
                              className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                            />
                          </td>
                        </tr>

                        {role === 'ativos' && (
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">
                              Usuários vinculados
                            </td>
                            <td className="border border-stroke dark:border-strokedark px-4 py-2">
                              <div
                                className='flex items-center gap-1 overflow-x-scroll custom-scrollbar pb-0.5 mt-1'>
                                {data?.properties["Usuário"].multi_select?.map((user: any) => (
                                  <p
                                    key={user.id}
                                    style={{
                                      backgroundColor: notionColorResolver(user.color)
                                    }}
                                    className='px-2 pb-0.5 text-black-2 rounded'>
                                    {user.name}
                                  </p>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}

                        <tr className="bg-blue-700">
                          <td className="text-white px-4 py-2 flex items-center font-semibold">
                            <MdOutlineFollowTheSigns className="mr-4" /> Follow Up
                          </td>
                          <td className="text-boxdark px-4 py-2">
                            &nbsp;
                          </td>
                        </tr>

                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Status</td>
                            <td
                              onClick={() => setDynamicListId('status')}
                              className="group/status relative border border-stroke dark:border-strokedark px-4 py-2 cursor-pointer">

                              <Title text={data?.properties?.Status?.status?.name.toUpperCase() || ""}>
                                {data?.properties?.Status?.status ? (
                                  <div className="py-1 px-2 rounded-md w-fit max-w-[170px] text-black-2 text-xs text-ellipsis overflow-hidden whitespace-nowrap" style={{
                                    backgroundColor: notionColorResolver(data!.properties!.Status!.status!.color),
                                  }}>
                                    {data?.properties?.Status?.status?.name.toUpperCase() || ""}
                                  </div>
                                ) : (
                                  <span>Não definido</span>
                                )}
                              </Title>

                              <TbGridDots className="absolute top-1/2 right-1 -translate-y-1/2 opacity-0 group-hover/status:opacity-100 transition-opacity duration-200" />

                              {/* status list */}
                              <DynamicList
                                label={data!.properties!.Status!.status}
                                listType={ENUM_OFICIOS_LIST}
                                data={data}
                                open={dynamicListId === 'status'}
                                setOpen={setDynamicListId}
                                callback={handleChangeStatus}
                              />
                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Due do ativo</td>
                            <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                              <input
                                className="w-[15px] h-[15px] bg-transparent focus-within:ring-0 selection:ring-0 duration-100 border-2 border-body dark:border-bodydark rounded-[3px] cursor-pointer"
                                type="checkbox"
                                checked={data?.properties["Due do Ativo"].checkbox}
                              />
                              <Title text="Esta informação não é editável">
                                <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                              </Title>
                            </td>
                          </tr>
                        }

                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Certidões emitidas</td>
                            <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                              <input
                                className="w-[15px] h-[15px] bg-transparent focus-within:ring-0 selection:ring-0 duration-100 border-2 border-body dark:border-bodydark rounded-[3px] cursor-pointer"
                                type="checkbox"
                                checked={data?.properties["Certidões emitidas"].checkbox}
                              />
                              <Title text="Esta informação não é editável">
                                <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                              </Title>
                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">CVLD Necessária?</td>
                            <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                              <input
                                className="w-[15px] h-[15px] bg-transparent focus-within:ring-0 selection:ring-0 duration-100 border-2 border-body dark:border-bodydark rounded-[3px] cursor-pointer"
                                type="checkbox"
                                checked={data?.properties["CVLD necessária?"].checkbox}
                              />
                              <Title text="Esta informação não é editável">
                                <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                              </Title>
                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">1ª Follow Up</td>
                            <td className="relative border border-stroke dark:border-strokedark px-4 py-2">

                              <ReactInputMask
                                mask='99/99/9999'
                                defaultValue={fupDateConveter(data?.properties["1ª FUP"]?.date?.start || '')}
                                type="text"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    handleChangeFupDate(data!.id, e.currentTarget.value, '1ª FUP')
                                  }
                                }}
                                className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                              />

                              <HiMiniCalendar className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />

                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">2ª Follow Up</td>
                            <td className="relative border border-stroke dark:border-strokedark px-4 py-2">

                              <ReactInputMask
                                mask='99/99/9999'
                                defaultValue={fupDateConveter(data?.properties["2ª FUP "]?.date?.start || '')}
                                type="text"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    handleChangeFupDate(data!.id, e.currentTarget.value, '2ª FUP ')
                                  }
                                }}
                                className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                              />

                              <HiMiniCalendar className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />

                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">3ª Follow Up</td>
                            <td className="relative border border-stroke dark:border-strokedark px-4 py-2">

                              <ReactInputMask
                                mask='99/99/9999'
                                defaultValue={fupDateConveter(data?.properties["3ª FUP"]?.date?.start || '')}
                                type="text"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    handleChangeFupDate(data!.id, e.currentTarget.value, '3ª FUP')
                                  }
                                }}
                                className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                              />

                              <HiMiniCalendar className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />

                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">4ª Follow Up</td>
                            <td className="relative border border-stroke dark:border-strokedark px-4 py-2">

                              <ReactInputMask
                                mask='99/99/9999'
                                defaultValue={fupDateConveter(data?.properties["4ª FUP"]?.date?.start || '')}
                                type="text"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    handleChangeFupDate(data!.id, e.currentTarget.value, '4ª FUP')
                                  }
                                }}
                                className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                              />

                              <HiMiniCalendar className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />

                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">5ª Follow Up</td>
                            <td className="relative border border-stroke dark:border-strokedark px-4 py-2">

                              <ReactInputMask
                                mask='99/99/9999'
                                defaultValue={fupDateConveter(data?.properties["5ª FUP "]?.date?.start || '')}
                                type="text"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    handleChangeFupDate(data!.id, e.currentTarget.value, '5ª FUP ')
                                  }
                                }}
                                className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                              />

                              <HiMiniCalendar className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />

                            </td>
                          </tr>
                        }
                        <tr className="bg-blue-700">
                          <td className="text-white px-4 py-2 flex items-center font-semibold">
                            <IoDocumentTextOutline className="mr-4" /> Processo
                          </td>
                          <td className="text-boxdark px-4 py-2">
                            &nbsp;
                          </td>
                        </tr>
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Tipo</td>
                            <td
                              onClick={() => setDynamicListId('tipo')}
                              className="group/oficio relative border border-stroke dark:border-strokedark px-4 py-2 cursor-pointer">

                              <Title text={data?.properties?.Tipo?.select?.name.toUpperCase() || ""}>
                                {data?.properties?.Tipo?.select?.name ? <span className="p-1 rounded-md text-boxdark text-xs" style={{
                                  backgroundColor: notionColorResolver(data!.properties!.Tipo!.select!.color),
                                }}>
                                  {data?.properties?.Tipo?.select?.name.toUpperCase() || ""}
                                </span> : <span>Não definido</span>}
                              </Title>

                              <TbGridDots className="absolute top-1/2 right-1 -translate-y-1/2 opacity-0 group-hover/oficio:opacity-100 transition-opacity duration-200" />

                              {/* tipo list */}
                              <DynamicList
                                label={data!.properties!.Tipo!.select}
                                listType={ENUM_TIPO_OFICIOS_LIST}
                                data={data}
                                open={dynamicListId === 'tipo'}
                                setOpen={setDynamicListId}
                                callback={handleChangeTipo}
                              />
                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">NPU Originário</td>
                            <td className="border border-stroke dark:border-strokedark px-4 py-2">
                              <ReactInputMask
                                mask="9999999-99.9999.9.99.9999"
                                type="text"
                                defaultValue={data?.properties["NPU (Originário)"]?.rich_text![0]?.text?.content || ""}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    handleChangeNpu(data!.id, "NPU (Originário)", e.currentTarget.value)
                                  }
                                }}
                                className={`w-full p-0 focus-within:ring-0 focus-within:border-transparent text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                              />
                              {/* {data?.properties["NPU (Originário)"]?.rich_text![0]?.text?.content || ""} */}
                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">NPU Precatório</td>
                            <td className="border border-stroke dark:border-strokedark px-4 py-2">
                              <ReactInputMask
                                mask="9999999-99.9999.9.99.9999"
                                type="text"
                                defaultValue={data?.properties["NPU (Precatório)"]?.rich_text![0]?.text?.content || ""}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    handleChangeNpu(data!.id, "NPU (Precatório)", e.currentTarget.value)
                                  }
                                }}
                                className={`w-full p-0 focus-within:ring-0 focus-within:border-transparent text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                              />
                              {/* {data?.properties["NPU (Precatório)"]?.rich_text![0]?.text?.content || ""} */}
                            </td>
                          </tr>
                        }
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Tribunal</td>
                          <td
                            onClick={() => setDynamicListId('tribunal')}
                            className="group/tribunal relative border border-stroke dark:border-strokedark px-4 py-2 cursor-pointer">

                            <Title text={data?.properties?.Tribunal?.select?.name || ""}>
                              {data?.properties?.Tribunal?.select ? (
                                <span className="py-1 px-2 rounded-md text-black-2 text-xs" style={{
                                  backgroundColor: notionColorResolver(data!.properties!.Tribunal!.select!.color),
                                }}>
                                  {data?.properties?.Tribunal?.select?.name || ""}
                                </span>
                              ) : (
                                <span>Não definido</span>
                              )}
                            </Title>

                            <TbGridDots className="absolute top-1/2 right-1 -translate-y-1/2 opacity-0 group-hover/tribunal:opacity-100 transition-opacity duration-200" />

                            {/* tribunais list */}
                            <DynamicList
                              label={data!.properties!.Tribunal!.select}
                              listType={ENUM_TRIBUNAIS_LIST}
                              data={data}
                              open={dynamicListId === 'tribunal'}
                              setOpen={setDynamicListId}
                              callback={handleChangeTribunal}
                            />
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Juízo</td>
                          <td className="border border-stroke dark:border-strokedark px-4 py-2">
                            <Title text={data?.properties?.Juízo?.rich_text![0]?.plain_text || ""}>
                              <input
                                type="text"
                                defaultValue={data?.properties?.Juízo?.rich_text![0]?.plain_text || ""}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    handleChangeJuizo(data!.id, e.currentTarget.value)
                                  }
                                }}
                                className={`w-full p-0 focus-within:ring-0 focus-within:border-transparent text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                              />
                            </Title>
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">L.O.A.</td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                            {data?.properties.LOA.number}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Valor Principal</td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                            {numberFormat(data?.properties["Valor Principal"]?.number || 0)}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Valor Juros</td>
                            <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                              {numberFormat(data?.properties["Valor Juros"]?.number || 0)}
                              <Title text="Esta informação não é editável">
                                <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                              </Title>
                            </td>
                          </tr>
                        }
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Valor Inscrito</td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                            {numberFormat(data?.properties["Valor Total Inscrito"]?.formula?.number || 0)}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Valor Atualizado</td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                            {numberFormat(data?.properties["Valor Atualizado"]?.number || 0)}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        {/* {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left text-boxdark">Valor PSS</td>
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark">{numberFormat(data?.properties["Valor Total Inscrito"]?.formula?.number || 0)}</td>
                          </tr>
                        } */}
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Data Base</td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                            {dateFormater(data?.properties["Data Base"]?.date?.start)}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Data do Recebimento</td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                            {dateFormater(data?.properties["Data do Recebimento"]?.date?.start || "2024-05-04")}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        {/* <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left text-boxdark">Atualizado até</td>
                            <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark">{dateFormater(item?.data_limite_de_atualizacao)}</td>
                          </tr> */}
                        {/* {
                            item.fator_correcao_ipca_e && (
                              <>
                                <tr className="bg-blue-700">
                                  <td className="text-white px-4 py-2">
                                    IPCA-E
                                  </td>
                                  <td className="text-boxdark px-4 py-2">
                                    &nbsp;
                                  </td>
                                </tr>
                                <tr className="bg-gray dark:bg-boxdark-2">
                                  <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left text-boxdark">Fator IPCA-E até 12/2021</td>
                                  <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark">{factorFormater(item.fator_correcao_ipca_e)}</td>
                                </tr>
                              </>
                            )
                          }
                          {
                            item.recalc_flag === "before_12_2021" && (
                              <>
                                <tr className="bg-gray dark:bg-boxdark-2">
                                  <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left text-boxdark">Principal Atualizado até 12/2021</td>
                                  <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark">{numberFormat(item.valor_atualizado_principal)}</td>
                                </tr>
                                <tr className="bg-gray dark:bg-boxdark-2">
                                  <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left text-boxdark">Juros Atualizado até 12/2021</td>
                                  <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark">{numberFormat(item.valor_atualizado_juros)}</td>
                                </tr>
                              </>
                            )
                          }
                          <tr className="bg-blue-700">
                            <td className="text-white px-4 py-2">
                              SELIC
                            </td>
                            <td className="text-boxdark px-4 py-2">
                              &nbsp;
                            </td>
                          </tr>
                          {
                            item.recalc_flag && (
                              <tr className="bg-gray dark:bg-boxdark-2">
                                <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left text-boxdark">Fator SELIC</td>
                                <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark">{factorFormater(item.fator_correcao_selic)}</td>
                              </tr>
                            )
                          }
                          {
                            item.principal_atualizado_requisicao && (
                              <tr className="bg-gray dark:bg-boxdark-2">
                                <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left text-boxdark">Principal Atualizado até a Requisição</td>
                                <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark">{numberFormat(item.principal_atualizado_requisicao)}</td>
                              </tr>
                            )
                          }
                          {
                            String(item.juros_atualizados_requisicao) && (
                              <tr className="bg-gray dark:bg-boxdark-2">
                                <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left text-boxdark">Juros Atualizados até a Requisição</td>
                                <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark">{numberFormat(item.juros_atualizados_requisicao)}</td>
                              </tr>
                            )
                          } */}
                        {/* <tr className="bg-blue-700">
                          <td className="text-white px-4 py-2">
                            Período de Graça IPCA-E
                          </td>
                          <td className="text-boxdark px-4 py-2">
                            &nbsp;
                          </td>
                        </tr>
                        {
                          item.fator_periodo_graca_ipca_e && (
                            <tr className="bg-gray dark:bg-boxdark-2">
                              <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left text-boxdark">Fator Período de Graça IPCA-E</td>
                              <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark">{factorFormater(item.fator_periodo_graca_ipca_e)}</td>
                            </tr>
                          )
                        }
                        {
                          item.recalc_flag === "before_12_2021" && (
                            <tr className="bg-gray dark:bg-boxdark-2">
                              <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark text-left">Valor Principal Atualizado Final</td>
                              <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark">{numberFormat(item.valor_principal_ipca_e)}</td>
                            </tr>
                          )
                        }
                        {
                          item.recalc_flag === "before_12_2021" && (
                            <tr className="bg-gray dark:bg-boxdark-2">
                              <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark text-left">Valor Juros Atualizado Final</td>
                              <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark">{numberFormat(item.valor_juros_ipca_e)}</td>
                            </tr>
                          )
                        }
                        {
                          item.valor_bruto_atualizado_final && (
                            <tr className="bg-gray dark:bg-boxdark-2">
                              <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark text-left">Valor Bruto Atualizado Final</td>
                              <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark">{numberFormat(item.valor_bruto_atualizado_final)}</td>
                            </tr>
                          )
                        } */}

                        <tr className="bg-blue-700">
                          <td className="text-white px-4 py-2 flex items-center font-semibold">
                            <BiTransfer className="mr-4" /> Deduções
                          </td>
                          <td className=" px-4 py-2">
                            &nbsp;
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Honorários já destacados?</td>
                          <td className="border border-stroke dark:border-strokedark px-4 py-2">
                            {checkMark === 'honorário' ? (
                              <div className="flex items-center justify-center gap-3 h-6">
                                <AiOutlineLoading className="animate-spin w-4.5 h-4.5" />
                                <span>Atualizando opção</span>
                              </div>
                            ) : (
                              <div className='flex gap-5 items-center justify-center'>
                                <div className='flex gap-2 items-center'>
                                  <CustomCheckbox
                                    check={data?.properties["Honorários já destacados?"].checkbox}
                                    callbackFunction={() => handleChangeHonorarioState(data!.id, data!.properties["Honorários já destacados?"]!.checkbox!)}
                                  />
                                  <span>Sim</span>
                                </div>
                                <div className='flex gap-2 items-center'>
                                  <CustomCheckbox
                                    check={!data?.properties["Honorários já destacados?"].checkbox}
                                    callbackFunction={() => handleChangeHonorarioState(data!.id, data!.properties["Honorários já destacados?"]!.checkbox!)}
                                  />
                                  <span>Não</span>
                                </div>
                              </div>
                            )}
                            {/* {data?.properties["Honorários já destacados?"].checkbox ? "Sim" : "Não"} */}
                          </td>
                        </tr>
                        {data?.properties["Honorários já destacados?"].checkbox === false && (
                          <>
                            <tr className="bg-gray dark:bg-boxdark-2">
                              <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Percentual de Honorários Não destacados</td>
                              <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                                {percentageFormater(data?.properties["Percentual de Honorários Não destacados"].number || 0)}
                                <Title text="Esta informação não é editável">
                                  <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                                </Title>
                              </td>
                            </tr>
                            <tr className="bg-gray dark:bg-boxdark-2">
                              <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Honorários Não destacados</td>
                              <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                                {numberFormat(data?.properties["Honorários não destacados"]?.formula?.number || 0)}
                                <Title text="Esta informação não é editável">
                                  <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                                </Title>
                              </td>
                            </tr>
                          </>

                        )}
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Imposto de Renda (3%)</td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                            {data?.properties["Imposto de Renda Retido 3%"]?.number ? numberFormat(data?.properties["Imposto de Renda Retido 3%"].number || 0) : "Não Informado"}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>

                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">IR/RRA</td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                            {data?.properties["RRA"]?.number ? numberFormat(data?.properties["RRA"].number || 0) : "Não Informado"}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>

                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">PSS</td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                            {numberFormat(data?.properties?.PSS.number || 0)}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>

                        <tr className="bg-blue-700">
                          <td className="text-white px-4 py-2 flex items-center font-semibold">
                            <IoDocumentTextOutline className="mr-4" /> Estimativas
                          </td>
                          <td className=" px-4 py-2">
                            &nbsp;
                          </td>
                        </tr>
                        {/* <tr className="">
                            <td className="text-boxdark px-1">
                              &nbsp;
                            </td>
                            <td className="text-boxdark px-1">
                              &nbsp;
                            </td>
                          </tr> */}

                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">Preço Proposto</td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                            <input
                              title={numberFormat(data?.properties['Preço Proposto']?.number || 0)}
                              type="text"
                              defaultValue={numberFormat(data?.properties['Preço Proposto']?.number || 0)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                  handleChangeProposalPrice(data!.id, e.currentTarget.value)
                                }
                              }}
                              className={`w-full p-0 focus-within:ring-0 focus-within:border-none text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                            />
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">(R$) Proposta Mínima</td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                            {numberFormat(data?.properties["(R$) Proposta Mínima "]?.formula?.number || 0)}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">(%) Proposta Mínima</td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                            {percentageFormater(data?.properties["(%) Proposta Mínima "]?.formula?.string || 0)}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">(R$) Proposta Máxima
                          </td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                            {numberFormat(data?.properties["(R$) Proposta Máxima"]?.formula?.number || 0)}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">(%) Proposta Máxima
                          </td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                            {percentageFormater(data?.properties["(%) Proposta Máxima "]?.formula?.string || 0)}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">
                            Comissão
                          </td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2">
                            {numberFormat(data?.properties['Comissão'].formula?.number || 0)}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        <tr className="bg-green-300">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left text-boxdark font-semibold">Valor Líquido Disponível</td>
                          <td className="relative border border-stroke dark:border-strokedark px-4 py-2 text-boxdark font-semibold">{
                            data?.properties["Honorários já destacados?"].checkbox === false ? (
                              numberFormat(data?.properties["Valor Líquido (Com Reserva dos Honorários)"]?.formula?.number || 0)
                            ) : (
                              numberFormat(data?.properties["Valor Líquido"]?.formula?.number || 0)
                            )
                          }</td>
                        </tr>

                        {/* numberFormat(data?.properties["Valor Líquido (Com Reserva dos Honorários)"]?.formula?.number || 0) */}
                      </tbody>
                    </Table>
                    {/* <ul>
                        <hr className="border border-stroke dark:border-strokedark my-4" />
                        <li className="text-sm flex text-gray dark:text-gray-400 w-full py-1">
                          <a href={linkAdapter(item.link_memoria_de_calculo_simples)} className="w-full text-center py-3 flex items-center justify-center text-sm font-semibold text-white rounded-md bg-blue-700 hover:bg-blue-800">
                            <span className="text-[16px] font-medium text-gray">
                              Memória de Cálculo Simples
                            </span>
                            <BiDownload style={{
                              width: "22px",
                              height: "22px",
                            }} className="ml-2 text-gray" />
                          </a>
                        </li>
                        {
                          item.link_memoria_de_calculo_rra && (
                            <li className="text-sm flex text-gray-500 dark:text-gray-400 w-full py-1">
                              <a href={linkAdapter(item.link_memoria_de_calculo_rra)} className="w-full text-center py-3 flex items-center justify-center text-sm font-semibold text-white rounded-md bg-blue-700 hover:bg-blue-800">
                                <span className="text-[16px] font-medium">
                                  Memória de Cálculo RRA
                                </span>
                                <BiDownload style={{
                                  width: "22px",
                                  height: "22px",
                                }} className="ml-2  text-gray" />
                              </a>
                            </li>
                          )
                        }
                        {
                          item.link_cvld && (
                            <li className="text-sm flex text-gray-500 dark:text-gray-400 w-full py-1">
                              <Button as={'a'} href={linkAdapter(item.link_cvld)} gradientDuoTone="purpleToBlue" className="w-full text-center px-4 text-sm font-semibold text-boxdark rounded-md hover:opacity-90">
                                <span className="text-[16px] font-medium">
                                  Baixar CVLD
                                </span>
                                <BiDownload style={{
                                  width: "22px",
                                  height: "22px",
                                }} className="ml-2  text-gray" />
                              </Button>
                            </li>
                          )
                        }
                      </ul> */}

                  </div>
                </Drawer.Items>
              </React.Fragment>
            )}
          </Drawer>
        </Flowbite>)
      }
    </>
  );
}
