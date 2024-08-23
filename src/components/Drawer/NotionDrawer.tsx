import dateFormater from "@/functions/formaters/dateFormater";
import factorFormater from "@/functions/formaters/factorFormater";
import linkAdapter from "@/functions/formaters/linkFormater";
import numberFormat from "@/functions/formaters/numberFormat";
import { customFlowBiteTheme } from "@/themes/FlowbiteThemes";
import { Button, Drawer, Flowbite, Table } from "flowbite-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineLoading, AiOutlineReload, AiOutlineUser } from "react-icons/ai";
import { BiDownload, BiTransfer, BiX } from "react-icons/bi";
import { CgDetailsMore } from "react-icons/cg";
import { LinkedTasks } from "../TaskElements/LinkedTasks";
import { ExtratosTableContext } from "@/context/ExtratosTableContext";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import { NotionPage } from "@/interfaces/INotion";
import { IoDocumentTextOutline } from "react-icons/io5";
import { RiNotionFill } from "react-icons/ri";
import percentageFormater from "@/functions/formaters/percentFormater";
import { MdOutlineFollowTheSigns } from "react-icons/md";
import notionColorResolver from "@/functions/formaters/notionColorResolver";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { UserInfoAPIContext } from "@/context/UserInfoContext";

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

  const fetchNotionPageData = async (): Promise<NotionPage> => {
    const { data } = await api.get(`api/notion-api/list/page/${pageId}/`);
    return data;
  }

  const {
    item, setItem,
    editableLabel, setEditableLabel,
    updateCreditorName
  } = useContext(ExtratosTableContext);

  const {data: {role}} = useContext(UserInfoAPIContext)


  // const queryClient = useQueryClient()
  const { isPending, data, error, isFetching, refetch } = useQuery(
    {
      queryKey: ['notion_page_data'],
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      queryFn: fetchNotionPageData,
    },
  );


  const [openTaskDrawer, setOpenTaskDrawer] = useState<boolean>(false);
  const [openSubTask, setOpenSubTask] = useState<boolean>(false);
  const [editableTaskInput, setEditableTaskInput] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClose = () => {
    setNotionDrawer(false);
    setOpenTaskDrawer(false);
    setOpenSubTask(false);
    setEditableTaskInput(false);
  };


  const handleChangeCreditorName = async (id: string, value: string) => {

    inputRef.current?.blur();
    await updateCreditorName(id, value);
    setItem({
      ...item,
      credor: value
    });

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
                        ref={inputRef}
                        type="text"
                        defaultValue={data?.properties?.Credor?.title[0].text.content || 'Sem título'}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                            handleChangeCreditorName(data!.id, e.currentTarget.value)
                          }
                        }}
                        onBlur={(e) => handleChangeCreditorName(item.id, e.currentTarget.value)}
                        className={`${editableLabel === item.id && '!border-1 !border-blue-700'} w-full text-2xl pl-1 focus-within:ring-0 border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                      />
                      {editableLabel === item.id && (
                        <div
                          onClick={() => setEditableLabel!(item.id)}
                          className="absolute inset-0"
                        ></div>
                      )}
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-300 dark:hover:bg-form-strokedark text-lg cursor-pointer transition-all duration-200">
                      <BiX onClick={handleClose} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 justify-end mb-2">
                    { role === "ativos" && (<a href={item.url} target='_blank' rel='referrer'
                      title='Abrir no Notion'
                      className='py-1 px-2 mr-1 flex items-center justify-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-100 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                    >
                      <RiNotionFill className='text-lg'
                      />
                      <span className='text-xs'>Notion</span>
                    </a>)}
                    <button className="py-1 px-2 flex items-center justify-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-100 group-hover:opacity-100 transition-all duration-200 cursor-pointer" onClick={() => refetch()}>

                      <AiOutlineReload />
                      <span className="text-xs">Atualizar</span>
                    </button>
                  </div>
                </div>
                {/* <Drawer.Items>
                    {!window.location.href.includes('https://ativoscvld.vercel.app/') && (
                      <LinkedTasks
                        data={item}
                        openTaskDrawer={openTaskDrawer}
                        setOpenTaskDrawer={setOpenTaskDrawer}
                        openSubTask={openSubTask}
                        setOpenSubTask={setOpenSubTask}
                        editableTaskInput={editableTaskInput}
                        setEditableTaskInput={setEditableTaskInput}
                      />
                    )}

                  </Drawer.Items> */}
                <Drawer.Items>
                  <div className="overflow-x-auto">
                    <Table className="min-w-full table-auto border-collapse">
                      <tbody>
                        <tr className="bg-blue-700">
                          <td className="text-white px-4 py-2 font-semibold flex items-center">
                            <AiOutlineUser className="mr-4" /> Informações do Credor
                          </td>
                          <td className="text-boxdark px-4 py-2">
                            &nbsp;
                          </td>
                        </tr>
                        {/* {

                              <tr className="bg-gray dark:bg-boxdark-2/80">
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Regra de Cálculo</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">Após 12/2021</td>
                              </tr>
                          } */}
                        {
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Nome do credor</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{data?.properties?.Credor?.title[0].text.content || ""}</td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">CPF/CNPJ do credor</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{data?.properties["CPF/CNPJ"]?.rich_text?.length ? data?.properties["CPF/CNPJ"]?.rich_text![0]!.plain_text : ""}</td>
                          </tr>
                        }
                        <tr className="bg-gray dark:bg-boxdark-2/80">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">E-mail</td>
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{data?.properties["Contato de E-mail"].email || ""}</td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2/80">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Contato</td>
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{data?.properties["Contato Telefônico"].phone_number || ""}</td>
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
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Status</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">
                              <span className="p-1 rounded-md dark:text-boxdark" style={{
                                backgroundColor: notionColorResolver(data!.properties!.Status!.status!.color),
                              }}>{data?.properties?.Status?.status?.name || ""}</span>
                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Due do ativo</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{<input className="w-[15px] h-[15px] bg-transparent focus-within:ring-0 selection:ring-0 duration-100 border-2 border-body dark:border-bodydark rounded-[3px] cursor-pointer" type="checkbox" checked={data?.properties["Due do Ativo"].checkbox} />}</td>
                          </tr>
                        }

                        {
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Certidões emitidas</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{<input className="w-[15px] h-[15px] bg-transparent focus-within:ring-0 selection:ring-0 duration-100 border-2 border-body dark:border-bodydark rounded-[3px] cursor-pointer" type="checkbox" checked={data?.properties["Certidões emitidas"].checkbox} />} </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">CVLD Necessária?</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{<input className="w-[15px] h-[15px] bg-transparent focus-within:ring-0 selection:ring-0 duration-100 border-2 border-body dark:border-bodydark rounded-[3px] cursor-pointer" type="checkbox" checked={data?.properties["CVLD necessária?"].checkbox} />} </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">1ª Follow Up</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">
                              {
                                dateFormater(data?.properties["1ª FUP"]?.date?.start)
                              }
                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">2ª Follow Up</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">
                              {
                                dateFormater(data?.properties["2ª FUP "]?.date?.start)
                              }
                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">3ª Follow Up</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">
                              {
                                dateFormater(data?.properties["3ª FUP"]?.date?.start)
                              }
                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">4ª Follow Up</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">
                              {
                                dateFormater(data?.properties["4ª FUP"]?.date?.start)
                              }
                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">5ª Follow Up</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">
                              {
                                dateFormater(data?.properties["5ª FUP "]?.date?.start)
                              }
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
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Tipo</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">
                              <span className="p-1 rounded-md dark:text-boxdark" style={{
                                backgroundColor: notionColorResolver(data!.properties!.Tipo!.select!.color),
                              }}>{data?.properties?.Tipo?.select?.name || ""}</span>
                            </td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">NPU Originário</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{data?.properties["NPU (Originário)"]?.rich_text![0]?.text?.content || ""}</td>
                          </tr>
                        }
                        {
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">NPU Precatório</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{data?.properties["NPU (Precatório)"]?.rich_text![0]?.text?.content || ""}</td>
                          </tr>
                        }
                        <tr className="bg-gray dark:bg-boxdark-2/80">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Tribunal</td>
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{data?.properties?.Tribunal?.select?.name || ""}</td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2/80">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Juízo</td>
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{data?.properties?.Juízo?.rich_text![0]?.plain_text || ""}</td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2/80">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">L.O.A.</td>
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{data?.properties.LOA.number}</td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2/80">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Valor Principal</td>
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(data?.properties["Valor Principal"]?.number || 0)}</td>
                        </tr>
                        {
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Valor Juros</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(data?.properties["Valor Juros"]?.number || 0)}</td>
                          </tr>
                        }
                        <tr className="bg-gray dark:bg-boxdark-2/80">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Valor Inscrito</td>
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(data?.properties["Valor Total Inscrito"]?.formula?.number || 0)}</td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2/80">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Valor Atualizado</td>
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(data?.properties["Valor Atualizado"]?.number || 0)}</td>
                        </tr>
                        {/* {
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Valor PSS</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(data?.properties["Valor Total Inscrito"]?.formula?.number || 0)}</td>
                          </tr>
                        } */}
                        <tr className="bg-gray dark:bg-boxdark-2/80">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Data Base</td>
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{dateFormater(data?.properties["Data Base"]?.date?.start)}</td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2/80">
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Data do Recebimento</td>
                          <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{dateFormater(data?.properties["Data do Recebimento"]?.date?.start || "2024-05-04")}</td>
                        </tr>
                        {/* <tr className="bg-gray dark:bg-boxdark-2/80">
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
                                <tr className="bg-gray dark:bg-boxdark-2/80">
                                  <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Fator IPCA-E até 12/2021</td>
                                  <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{factorFormater(item.fator_correcao_ipca_e)}</td>
                                </tr>
                              </>
                            )
                          }
                          {
                            item.recalc_flag === "before_12_2021" && (
                              <>
                                <tr className="bg-gray dark:bg-boxdark-2/80">
                                  <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Principal Atualizado até 12/2021</td>
                                  <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.valor_atualizado_principal)}</td>
                                </tr>
                                <tr className="bg-gray dark:bg-boxdark-2/80">
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
                              <tr className="bg-gray dark:bg-boxdark-2/80">
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Fator SELIC</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{factorFormater(item.fator_correcao_selic)}</td>
                              </tr>
                            )
                          }
                          {
                            item.principal_atualizado_requisicao && (
                              <tr className="bg-gray dark:bg-boxdark-2/80">
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Principal Atualizado até a Requisição</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.principal_atualizado_requisicao)}</td>
                              </tr>
                            )
                          }
                          {
                            String(item.juros_atualizados_requisicao) && (
                              <tr className="bg-gray dark:bg-boxdark-2/80">
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
                            <tr className="bg-gray dark:bg-boxdark-2/80">
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Fator Período de Graça IPCA-E</td>
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{factorFormater(item.fator_periodo_graca_ipca_e)}</td>
                            </tr>
                          )
                        }
                        {
                          item.recalc_flag === "before_12_2021" && (
                            <tr className="bg-gray dark:bg-boxdark-2/80">
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark text-left">Valor Principal Atualizado Final</td>
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.valor_principal_ipca_e)}</td>
                            </tr>
                          )
                        }
                        {
                          item.recalc_flag === "before_12_2021" && (
                            <tr className="bg-gray dark:bg-boxdark-2/80">
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark text-left">Valor Juros Atualizado Final</td>
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.valor_juros_ipca_e)}</td>
                            </tr>
                          )
                        }
                        {
                          item.valor_bruto_atualizado_final && (
                            <tr className="bg-gray dark:bg-boxdark-2/80">
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark text-left">Valor Bruto Atualizado Final</td>
                              <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.valor_bruto_atualizado_final)}</td>
                            </tr>
                          )
                        } */}

                        <tr className="bg-blue-700">
                          <td className="text-white px-4 py-2 flex items-center font-semibold">
                            <BiTransfer className="mr-4" /> Deduções
                          </td>
                          <td className="text-boxdark px-4 py-2">
                            &nbsp;
                          </td>
                        </tr>
                        <tr className="bg-rose-300">
                          <td className="border border-stroke px-4 py-2 text-boxdark text-left">Honorários já destacados?</td>
                          <td className="border border-stroke px-4 py-2 text-boxdark">{data?.properties["Honorários já destacados?"].checkbox ? "Sim" : "Não"}</td>
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
                          <td className="text-boxdark px-4 py-2">
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
                        <tr className="bg-green-300 text-boxdark">
                          <td className="border border-stroke px-4 py-2 text-left font-semibold">Valor Líquido Disponível</td>
                          <td className="border border-stroke px-4 py-2 text-boxdark font-semibold">{
                            data?.properties["Honorários já destacados?"].checkbox === false ? (
                              numberFormat(data?.properties["Valor Líquido (Com Reserva dos Honorários)"]?.formula?.number || 0)
                            ) : (
                              numberFormat(data?.properties["Valor Líquido"]?.formula?.number || 0)
                            )
                          }</td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2/80">
                          <td className="border border-stroke px-4 py-2 text-boxdark text-left">Preço Proposto</td>
                          <td className="border border-stroke px-4 py-2 text-boxdark">{numberFormat(data?.properties["Preço Proposto"]?.number || 0)}</td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2/80">
                          <td className="border border-stroke px-4 py-2 text-boxdark text-left">(R$) Proposta Mínima</td>
                          <td className="border border-stroke px-4 py-2 text-boxdark">{numberFormat(data?.properties["(R$) Proposta Mínima "]?.formula?.number || 0)}</td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2/80">
                          <td className="border border-stroke px-4 py-2 text-boxdark text-left">(%) Proposta Mínima</td>
                          <td className="border border-stroke px-4 py-2 text-boxdark">{percentageFormater(data?.properties["(%) Proposta Mínima "]?.formula?.string || 0)}</td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2/80">
                          <td className="border border-stroke px-4 py-2 text-boxdark text-left">(R$) Proposta Máxima
                          </td>
                          <td className="border border-stroke px-4 py-2 text-boxdark">{numberFormat(data?.properties["(R$) Proposta Máxima"]?.formula?.number || 0)}</td>
                        </tr>
                        <tr className="bg-gray dark:bg-boxdark-2/80">
                          <td className="border border-stroke px-4 py-2 text-boxdark text-left">(%) Proposta Máxima
                          </td>
                          <td className="border border-stroke px-4 py-2 text-boxdark">{percentageFormater(data?.properties["(%) Proposta Máxima "]?.formula?.string || 0)}</td>
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
