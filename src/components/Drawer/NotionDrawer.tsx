import dateFormater from "@/functions/formaters/dateFormater";
import numberFormat from "@/functions/formaters/numberFormat";
import { customFlowBiteTheme } from "@/themes/FlowbiteThemes";
import { Button, Drawer, Flowbite, Table } from "flowbite-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineLoading, AiOutlineReload, AiOutlineUser } from "react-icons/ai";
import { BiDownload, BiTransfer, BiX } from "react-icons/bi";
import { CgDetailsMore } from "react-icons/cg";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
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
import Title from "../CrmUi/Title";
import CustomCheckbox from "../CrmUi/Checkbox";

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

  console.log(data)

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

  /* ================> função copiada só para fins de entrega de feat <=================== */
  const updateStatusAtNotion = async (page_id: string, status: statusOficio) => {
    try {
      const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
        "Status": {
          "status": {
            "name": `${status}`
          }
        }
      });
      if (resNotion.status !== 202) {
        console.log('houve um erro ao salvar os dados no notion');
      }
      refetch();
      queryClient.invalidateQueries({ queryKey: ['notion_page_data'] });
    } catch (error) {
      console.log(error)
    }
  }

  /* ================> função copiada só para fins de entrega de feat <=================== */
  const updateTipoAtNotion = async (page_id: string, tipo: tipoOficio) => {

    try {
      const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
        "Tipo": {
          "select": {
            "name": `${tipo}`
          }
        },
      });

      if (resNotion.status !== 202) {
        console.log('houve um erro ao salvar os dados no notion');
      }
      refetch()
    } catch (error) {
      console.log(error)
    }

  }

  /* ================> função copiada só para fins de entrega de feat <=================== */
  const updateNotionCreditorName = async (page_id: string, value: string) => {
    try {
      const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
        "Credor": {
          "title": [
            {
              "text": {
                "content": value
              }
            }
          ]
        }
      });
      if (resNotion.status !== 202) {
        console.log('houve um erro ao salvar os dados no notion');
      }
    } catch (error) {
      console.log(error);
    }
  }

  /* ================> função copiada só para fins de entrega de feat <=================== */
  const handleChangeCreditorName = async (value: string,) => {
    try {
      inputCreditorRef.current!.blur();
      if (data) {
        await updateNotionCreditorName(pageId, value);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // queryClient.invalidateQueries({ queryKey: ['notion_list'] });
    }
  }

  /* ================> função copiada só para fins de entrega de feat <=================== */
  const updateNotionFupDate = async (page_id: string, value: string, type: string) => {

    try {

      let responseStatus: number = 0;

      if (data?.properties[type].date === null) {

        const dateObject = {
          end: null,
          start: value,
          time_zone: null
        }

        const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
          [type]: {
            "date": dateObject
          }
        });

        responseStatus = resNotion.status;

      } else {
        const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
          [type]: {
            "date": {
              "start": value
            }
          }
        });

        responseStatus = resNotion.status;
      }

      if (responseStatus !== 202) {
        console.log('houve um erro ao salvar os dados no notion');
      }
    } catch (error) {
      console.log(error);
    }
  }

  /* ================> função copiada só para fins de entrega de feat <=================== */
  const updateNotionEmail = async (page_id: string, value: string) => {
    try {
      const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
        "Contato de E-mail": {
          "email": value
        }
      });
      if (resNotion.status !== 202) {
        console.log('houve um erro ao salvar os dados no notion');
      }
    } catch (error) {
      console.log(error);
    }
  }

  /* ================> função copiada só para fins de entrega de feat <=================== */
  const updateNotionPhoneNumber = async (page_id: string, type: string, value: string) => {
    try {
      const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
        [type]: {
          "phone_number": value
        }
      });
      if (resNotion.status !== 202) {
        console.log('houve um erro ao salvar os dados no notion');
      }
    } catch (error) {
      console.log(error);
    }
  }

  /* ==================> função nova que deverá ir para o contexto <===================== */
  const updateNotionNpu = async (page_id: string, type: string, value: string) => {
    try {
      const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
        [type]: {
          "rich_text": [
            {
              "text": {
                "content": value
              }
            }
          ]
        }
      });
      if (resNotion.status !== 202) {
        console.log('houve um erro ao salvar os dados no notion');
      }
    } catch (error) {
      console.log(error)
    }
  }

  /* ==================> função nova que deverá ir para o contexto <===================== */
  const updateTribunalAtNotion = async (page_id: string, value: string) => {
    try {
      const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
        "Tribunal": {
          "select":
          {
            "name": value
          }
        }
      });
      if (resNotion.status !== 202) {
        console.log('houve um erro ao salvar os dados no notion');
      }
      refetch();
    } catch (error) {
      console.log(error)
    }
  }

  /* ==================> função nova que deverá ir para o contexto <===================== */
  const updateJuizoAtNotion = async (page_id: string, value: string) => {
    try {
      const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
        "Juízo": {
          "rich_text": [
            {
              "text": {
                "content": value
              }
            }
          ]
        }
      });
      if (resNotion.status !== 202) {
        console.log('houve um erro ao salvar os dados no notion');
      }
    } catch (error) {
      console.log(error)
    }
  }

  /* ==================> função nova que deverá ir para o contexto <===================== */
  const updateIdentificationAtNotion = async (page_id: string, value: string) => {
    try {
      const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
        "CPF/CNPJ": {
          "rich_text": [
            {
              "text": {
                "content": value
              }
            }
          ]
        }
      });
      if (resNotion.status !== 202) {
        console.log('houve um erro ao salvar os dados no notion');
      }
    } catch (error) {
      console.log(error)
    }
  }

  /* ==================> função nova que deverá ir para o contexto <===================== */
  const updateFeesAtNotion = async (page_id: string, value: boolean) => {
    setCheckMark('honorário');
    try {
      const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
        "Honorários já destacados?": {
          "checkbox": !value
        }
      });
      if (resNotion.status !== 202) {
        console.log('houve um erro ao salvar os dados no notion');
      }
      queryClient.invalidateQueries({ queryKey: ['notion_page_data'] });
    } catch (error) {
      console.log(error)
    } finally {
      setCheckMark(null);
    }
  }

  /* ================> função copiada só para fins de entrega de feat <=================== */
  const handleChangeFupDate = async (page_id: string, value: string, type: string) => {

    if (/^[0-9/]{10}$/.test(value)) {

      const parsedValue = value.split('/').reverse().join('-');
      await updateNotionFupDate(page_id, parsedValue, type);

    } else {
      console.log('um campo de data precisa de 8 caracteres');
    }
  }

  const applyMaskCpfCnpj = (str: string) => {

    if (!str) return;

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
                            handleChangeCreditorName(e.currentTarget.value)
                          }
                        }}
                        onBlur={(e) => handleChangeCreditorName(e.currentTarget.value)}
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
                        className='py-1 px-2 mr-1 flex items-center justify-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-100 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                      >
                        <RiNotionFill className='text-lg'
                        />
                        <span className='text-xs'>Notion</span>
                      </a>)
                    }
                    <button className="py-1 px-2 flex items-center justify-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-100 group-hover:opacity-100 transition-all duration-200 cursor-pointer" onClick={() => refetch()}>
                      <AiOutlineReload />
                      <span className="text-xs">Atualizar</span>
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
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Regra de Cálculo</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">Após 12/2021</td>
                              </tr>
                          } */}
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">CPF/CNPJ do credor</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">
                              <input
                                type="text"
                                defaultValue={applyMaskCpfCnpj(data?.properties["CPF/CNPJ"]?.rich_text?.length ? data?.properties["CPF/CNPJ"]?.rich_text![0]!.plain_text : "")}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    updateIdentificationAtNotion(data!.id, e.currentTarget.value)
                                  }
                                }}
                                onBlur={(e) => updateIdentificationAtNotion(data!.id, e.currentTarget.value)}
                                className={`w-full p-0 focus-within:ring-0 focus-within:border-transparent text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                              />
                              {/* {data?.properties["CPF/CNPJ"]?.rich_text?.length ? data?.properties["CPF/CNPJ"]?.rich_text![0]!.plain_text : ""} */}
                            </td>
                          </tr>
                        }
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">E-mail</td>
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">
                            <input
                              type="text"
                              defaultValue={data?.properties['Contato de E-mail'].email || ''}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                  updateNotionEmail(data!.id, e.currentTarget.value)
                                }
                              }}
                              onBlur={(e) => updateNotionEmail(data!.id, e.currentTarget.value)}
                              className={`w-full p-0 focus-within:ring-0 focus-within:border-transparent text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                            />
                            {/* {data?.properties["Contato de E-mail"].email || ""} */}
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Contato</td>
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">
                            <ReactInputMask
                              mask='(99) 99999-9999'
                              maskChar={null}
                              defaultValue={data?.properties["Contato Telefônico"].phone_number || ''}
                              type="text"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                  updateNotionPhoneNumber(data!.id, 'Contato Telefônico', e.currentTarget.value)
                                }
                              }}
                              onBlur={(e) => updateNotionPhoneNumber(data!.id, 'Contato Telefônico', e.currentTarget.value)}
                              className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                            />
                          </td>
                        </tr>

                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Contato 2</td>
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">
                            <ReactInputMask
                              mask='(99) 99999-9999'
                              maskChar={null}
                              defaultValue={data?.properties["Contato Telefônico 2"].phone_number || ''}
                              type="text"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                  updateNotionPhoneNumber(data!.id, 'Contato Telefônico 2', e.currentTarget.value)
                                }
                              }}
                              onBlur={(e) => updateNotionPhoneNumber(data!.id, 'Contato Telefônico 2', e.currentTarget.value)}
                              className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                            />
                          </td>
                        </tr>

                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Contato 3</td>
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">
                            <ReactInputMask
                              mask='(99) 99999-9999'
                              maskChar={null}
                              defaultValue={data?.properties["Contato Telefônico 3"].phone_number || ''}
                              type="text"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                  updateNotionPhoneNumber(data!.id, 'Contato Telefônico 3', e.currentTarget.value)
                                }
                              }}
                              onBlur={(e) => updateNotionPhoneNumber(data!.id, 'Contato Telefônico 3', e.currentTarget.value)}
                              className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                            />
                          </td>
                        </tr>

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
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Status</td>
                            <td
                              onClick={() => setDynamicListId('status')}
                              className="group/status relative border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 cursor-pointer">

                              <Title text={data?.properties?.Status?.status?.name.toUpperCase() || ""}>
                                <div className="py-1 px-2 rounded-md max-w-[170px] text-black-2 text-xs text-ellipsis overflow-hidden whitespace-nowrap" style={{
                                  backgroundColor: notionColorResolver(data!.properties!.Status!.status!.color),
                                }}>{data?.properties?.Status?.status?.name.toUpperCase() || ""}</div>
                              </Title>

                              <TbGridDots className="absolute top-1/2 right-1 -translate-y-1/2 opacity-0 group-hover/status:opacity-100 transition-opacity duration-200" />

                              {/* status list */}
                              <DynamicList
                                label={data!.properties!.Status!.status}
                                listType={ENUM_OFICIOS_LIST}
                                data={data}
                                open={dynamicListId === 'status'}
                                setOpen={setDynamicListId}
                                callback={updateStatusAtNotion}
                              />
                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Due do ativo</td>
                            <td className="relative border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">
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
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Certidões emitidas</td>
                            <td className="relative border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">
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
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">CVLD Necessária?</td>
                            <td className="relative border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">
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
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">1ª Follow Up</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">

                              <ReactInputMask
                                mask='99/99/9999'
                                defaultValue={fupDateConveter(data?.properties["1ª FUP"]?.date?.start || '')}
                                type="text"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    handleChangeFupDate(data!.id, e.currentTarget.value, '1ª FUP')
                                  }
                                }}
                                onBlur={(e) => handleChangeFupDate(data!.id, e.currentTarget.value, '1ª FUP')}
                                className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                              />

                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">2ª Follow Up</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">

                              <ReactInputMask
                                mask='99/99/9999'
                                defaultValue={fupDateConveter(data?.properties["2ª FUP "]?.date?.start || '')}
                                type="text"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    handleChangeFupDate(data!.id, e.currentTarget.value, '2ª FUP ')
                                  }
                                }}
                                onBlur={(e) => handleChangeFupDate(data!.id, e.currentTarget.value, '2ª FUP ')}
                                className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                              />

                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">3ª Follow Up</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">

                              <ReactInputMask
                                mask='99/99/9999'
                                defaultValue={fupDateConveter(data?.properties["3ª FUP"]?.date?.start || '')}
                                type="text"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    handleChangeFupDate(data!.id, e.currentTarget.value, '3ª FUP')
                                  }
                                }}
                                onBlur={(e) => handleChangeFupDate(data!.id, e.currentTarget.value, '3ª FUP')}
                                className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                              />

                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">4ª Follow Up</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">

                              <ReactInputMask
                                mask='99/99/9999'
                                defaultValue={fupDateConveter(data?.properties["4ª FUP"]?.date?.start || '')}
                                type="text"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    handleChangeFupDate(data!.id, e.currentTarget.value, '4ª FUP')
                                  }
                                }}
                                onBlur={(e) => handleChangeFupDate(data!.id, e.currentTarget.value, '4ª FUP')}
                                className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                              />

                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">5ª Follow Up</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">

                              <ReactInputMask
                                mask='99/99/9999'
                                defaultValue={fupDateConveter(data?.properties["5ª FUP "]?.date?.start || '')}
                                type="text"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    handleChangeFupDate(data!.id, e.currentTarget.value, '5ª FUP ')
                                  }
                                }}
                                onBlur={(e) => handleChangeFupDate(data!.id, e.currentTarget.value, '5ª FUP ')}
                                className="border-none text-sm p-0 h-[19.2px] bg-transparent focus-within:ring-0 focus-within:border-none"
                              />

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
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Tipo</td>
                            <td
                              onClick={() => setDynamicListId('tipo')}
                              className="group/oficio relative border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 cursor-pointer">

                              <Title text={data?.properties?.Tipo?.select?.name.toUpperCase() || ""}>
                                <span className="p-1 rounded-md text-boxdark text-xs" style={{
                                  backgroundColor: notionColorResolver(data!.properties!.Tipo!.select!.color),
                                }}>
                                  {data?.properties?.Tipo?.select?.name.toUpperCase() || ""}
                                </span>
                              </Title>

                              <TbGridDots className="absolute top-1/2 right-1 -translate-y-1/2 opacity-0 group-hover/oficio:opacity-100 transition-opacity duration-200" />

                              {/* tipo list */}
                              <DynamicList
                                label={data!.properties!.Tipo!.select}
                                listType={ENUM_TIPO_OFICIOS_LIST}
                                data={data}
                                open={dynamicListId === 'tipo'}
                                setOpen={setDynamicListId}
                                callback={updateTipoAtNotion}
                              />
                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">NPU Originário</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">
                              <ReactInputMask
                                mask="9999999-99.9999.9.99.9999"
                                type="text"
                                defaultValue={data?.properties["NPU (Originário)"]?.rich_text![0]?.text?.content || ""}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    updateNotionNpu(data!.id, "NPU (Originário)", e.currentTarget.value)
                                  }
                                }}
                                onBlur={(e) => updateNotionNpu(data!.id, "NPU (Originário)", e.currentTarget.value)}
                                className={`w-full p-0 focus-within:ring-0 focus-within:border-transparent text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                              />
                              {/* {data?.properties["NPU (Originário)"]?.rich_text![0]?.text?.content || ""} */}
                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">NPU Precatório</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">
                              <ReactInputMask
                                mask="9999999-99.9999.9.99.9999"
                                type="text"
                                defaultValue={data?.properties["NPU (Precatório)"]?.rich_text![0]?.text?.content || ""}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    updateNotionNpu(data!.id, "NPU (Precatório)", e.currentTarget.value)
                                  }
                                }}
                                onBlur={(e) => updateNotionNpu(data!.id, "NPU (Precatório)", e.currentTarget.value)}
                                className={`w-full p-0 focus-within:ring-0 focus-within:border-transparent text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                              />
                              {/* {data?.properties["NPU (Precatório)"]?.rich_text![0]?.text?.content || ""} */}
                            </td>
                          </tr>
                        }
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Tribunal</td>
                          <td
                            onClick={() => setDynamicListId('tribunal')}
                            className="group/tribunal relative border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 cursor-pointer">

                            <span className="py-1 px-2 rounded-md text-black-2 text-xs" style={{
                              backgroundColor: notionColorResolver(data!.properties!.Tribunal!.select!.color),
                            }}>{data?.properties?.Tribunal?.select?.name || ""}</span>

                            <TbGridDots className="absolute top-1/2 right-1 -translate-y-1/2 opacity-0 group-hover/tribunal:opacity-100 transition-opacity duration-200" />

                            {/* tribunais list */}
                            <DynamicList
                              label={data!.properties!.Tribunal!.select}
                              listType={ENUM_TRIBUNAIS_LIST}
                              data={data}
                              open={dynamicListId === 'tribunal'}
                              setOpen={setDynamicListId}
                              callback={updateTribunalAtNotion}
                            />
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Juízo</td>
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">
                            <Title text={data?.properties?.Juízo?.rich_text![0]?.plain_text || ""}>
                              <input
                                type="text"
                                defaultValue={data?.properties?.Juízo?.rich_text![0]?.plain_text || ""}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                    updateJuizoAtNotion(data!.id, e.currentTarget.value)
                                  }
                                }}
                                onBlur={(e) => updateJuizoAtNotion(data!.id, e.currentTarget.value)}
                                className={`w-full p-0 focus-within:ring-0 focus-within:border-transparent text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                              />
                            </Title>
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">L.O.A.</td>
                          <td className="relative border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">
                            {data?.properties.LOA.number}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Valor Principal</td>
                          <td className="relative border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">
                            {numberFormat(data?.properties["Valor Principal"]?.number || 0)}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Valor Juros</td>
                            <td className="relative border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">
                              {numberFormat(data?.properties["Valor Juros"]?.number || 0)}
                              <Title text="Esta informação não é editável">
                                <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                              </Title>
                            </td>
                          </tr>
                        }
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Valor Inscrito</td>
                          <td className="relative border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">
                            {numberFormat(data?.properties["Valor Total Inscrito"]?.formula?.number || 0)}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Valor Atualizado</td>
                          <td className="relative border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">
                            {numberFormat(data?.properties["Valor Atualizado"]?.number || 0)}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        {/* {
                          <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Valor PSS</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(data?.properties["Valor Total Inscrito"]?.formula?.number || 0)}</td>
                          </tr>
                        } */}
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Data Base</td>
                          <td className="relative border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">
                            {dateFormater(data?.properties["Data Base"]?.date?.start)}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Data do Recebimento</td>
                          <td className="relative border border-stroke dark:border-strokedark dark:text-snow px-4 py-2">
                            {dateFormater(data?.properties["Data do Recebimento"]?.date?.start || "2024-05-04")}
                            <Title text="Esta informação não é editável">
                              <HiOutlineLockClosed className="absolute top-1/2 right-1 -translate-y-1/2 text-body dark:!text-bodydark" />
                            </Title>
                          </td>
                        </tr>
                        {/* <tr className="bg-gray dark:bg-boxdark-2">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Atualizado até</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{dateFormater(item?.data_limite_de_atualizacao)}</td>
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
                                  <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Fator IPCA-E até 12/2021</td>
                                  <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{factorFormater(item.fator_correcao_ipca_e)}</td>
                                </tr>
                              </>
                            )
                          }
                          {
                            item.recalc_flag === "before_12_2021" && (
                              <>
                                <tr className="bg-gray dark:bg-boxdark-2">
                                  <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Principal Atualizado até 12/2021</td>
                                  <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.valor_atualizado_principal)}</td>
                                </tr>
                                <tr className="bg-gray dark:bg-boxdark-2">
                                  <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Juros Atualizado até 12/2021</td>
                                  <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.valor_atualizado_juros)}</td>
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
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Fator SELIC</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{factorFormater(item.fator_correcao_selic)}</td>
                              </tr>
                            )
                          }
                          {
                            item.principal_atualizado_requisicao && (
                              <tr className="bg-gray dark:bg-boxdark-2">
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Principal Atualizado até a Requisição</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.principal_atualizado_requisicao)}</td>
                              </tr>
                            )
                          }
                          {
                            String(item.juros_atualizados_requisicao) && (
                              <tr className="bg-gray dark:bg-boxdark-2">
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Juros Atualizados até a Requisição</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.juros_atualizados_requisicao)}</td>
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
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Fator Período de Graça IPCA-E</td>
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{factorFormater(item.fator_periodo_graca_ipca_e)}</td>
                            </tr>
                          )
                        }
                        {
                          item.recalc_flag === "before_12_2021" && (
                            <tr className="bg-gray dark:bg-boxdark-2">
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark text-left">Valor Principal Atualizado Final</td>
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.valor_principal_ipca_e)}</td>
                            </tr>
                          )
                        }
                        {
                          item.recalc_flag === "before_12_2021" && (
                            <tr className="bg-gray dark:bg-boxdark-2">
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark text-left">Valor Juros Atualizado Final</td>
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.valor_juros_ipca_e)}</td>
                            </tr>
                          )
                        }
                        {
                          item.valor_bruto_atualizado_final && (
                            <tr className="bg-gray dark:bg-boxdark-2">
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark text-left">Valor Bruto Atualizado Final</td>
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.valor_bruto_atualizado_final)}</td>
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
                        <tr className="bg-rose-300">
                          <td className="border border-stroke px-4 py-2 text-boxdark text-left">Honorários já destacados?</td>
                          <td className="border border-stroke px-4 py-2 text-boxdark">
                            {checkMark === 'honorário' ? (
                              <div className="flex items-center justify-center w-6 h-6">
                                <AiOutlineLoading className="animate-spin w-4.5 h-4.5" />
                              </div>
                            ) : (
                              <CustomCheckbox
                                className="!border-gray-700"
                                check={data?.properties["Honorários já destacados?"].checkbox}
                                callbackFunction={() => updateFeesAtNotion(data!.id, data!.properties["Honorários já destacados?"]!.checkbox!)}
                              />
                            )}
                            {/* {data?.properties["Honorários já destacados?"].checkbox ? "Sim" : "Não"} */}
                          </td>
                        </tr>
                        {data?.properties["Honorários já destacados?"].checkbox === false && (
                          <>
                            <tr className="bg-rose-300">
                              <td className="border border-stroke px-4 py-2 text-boxdark text-left">Percentual de Honorários Não destacados</td>
                              <td className="border border-stroke px-4 py-2 text-boxdark">{percentageFormater(data?.properties["Percentual de Honorários Não destacados"].number || 0)}</td>
                            </tr><tr className="bg-rose-300">
                              <td className="border border-stroke px-4 py-2 text-boxdark text-left">Honorários Não destacados</td>
                              <td className="border border-stroke px-4 py-2 text-boxdark">{numberFormat(data?.properties["Honorários não destacados"]?.formula?.number || 0)}</td>
                            </tr>
                          </>

                        )}
                        <tr className="bg-rose-300">
                          <td className="border border-stroke px-4 py-2 text-boxdark text-left">Imposto de Renda (3%)</td>
                          <td className="border border-stroke px-4 py-2 text-boxdark">{data?.properties["Imposto de Renda Retido 3%"]?.number ? numberFormat(data?.properties["Imposto de Renda Retido 3%"].number || 0) : "Não Informado"}</td>
                        </tr>

                        <tr className="bg-rose-300">
                          <td className="border border-stroke px-4 py-2 text-boxdark text-left">IR/RRA</td>
                          <td className="border border-stroke px-4 py-2 text-boxdark">{data?.properties["RRA"]?.number ? numberFormat(data?.properties["RRA"].number || 0) : "Não Informado"}</td>
                        </tr>

                        <tr className="bg-rose-300">
                          <td className="border border-stroke px-4 py-2 text-boxdark text-left">PSS</td>
                          <td className="border border-stroke px-4 py-2 text-boxdark">{numberFormat(data?.properties?.PSS.number || 0)}</td>
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
                          <td className="border border-stroke dark:border-strokedark px-4 py-2">{numberFormat(data?.properties["Preço Proposto"]?.number || 0)}</td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">(R$) Proposta Mínima</td>
                          <td className="border border-stroke dark:border-strokedark px-4 py-2">{numberFormat(data?.properties["(R$) Proposta Mínima "]?.formula?.number || 0)}</td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">(%) Proposta Mínima</td>
                          <td className="border border-stroke dark:border-strokedark px-4 py-2">{percentageFormater(data?.properties["(%) Proposta Mínima "]?.formula?.string || 0)}</td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">(R$) Proposta Máxima
                          </td>
                          <td className="border border-stroke dark:border-strokedark px-4 py-2">{numberFormat(data?.properties["(R$) Proposta Máxima"]?.formula?.number || 0)}</td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left">(%) Proposta Máxima
                          </td>
                          <td className="border border-stroke dark:border-strokedark px-4 py-2">{percentageFormater(data?.properties["(%) Proposta Máxima "]?.formula?.string || 0)}</td>
                        </tr>
                        <tr className="bg-green-300">
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-left text-boxdark font-semibold">Valor Líquido Disponível</td>
                          <td className="border border-stroke dark:border-strokedark px-4 py-2 text-boxdark font-semibold">{
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
