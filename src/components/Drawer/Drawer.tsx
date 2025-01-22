import dateFormater from "@/functions/formaters/dateFormater";
import factorFormater from "@/functions/formaters/factorFormater";
import linkAdapter from "@/functions/formaters/linkFormater";
import numberFormat from "@/functions/formaters/numberFormat";
import { customFlowBiteTheme } from "@/themes/FlowbiteThemes";
import { Button, Drawer, Flowbite, Table } from "flowbite-react";
import React, { useContext, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { BiDownload, BiX } from "react-icons/bi";
import { CgDetailsMore } from "react-icons/cg";
import { LinkedTasks } from "../TaskElements/LinkedTasks";
import { ExtratosTableContext } from "@/context/ExtratosTableContext";

export function AwesomeDrawer() {

  const {
    item, setItem, loading,
    openDetailsDrawer, setOpenDetailsDrawer,
    editableLabel, setEditableLabel,
    updateCreditorName
  } = useContext(ExtratosTableContext);

  const [openTaskDrawer, setOpenTaskDrawer] = useState<boolean>(false);
  const [openSubTask, setOpenSubTask] = useState<string | null>(null);
  const [editableTaskInput, setEditableTaskInput] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClose = () => {
    setOpenDetailsDrawer(false);
    setOpenTaskDrawer(false);
    setOpenSubTask(null);
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
        item["valor_principal"] && (
          <Flowbite theme={{ theme: customFlowBiteTheme }}>
            <Drawer open={openDetailsDrawer} onClose={handleClose} style={{
              boxShadow: "2px 0 2px 0 rgba(0, 0, 0, 0.1)"
            }} className="min-w-48 sm:w-115 flex flex-col" backdrop={true}>
              {loading ? (
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
                          defaultValue={item.credor || 'Sem título'}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                              handleChangeCreditorName(item.id, e.currentTarget.value)
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
                  </div>
                  <Drawer.Items>
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

                  </Drawer.Items>
                  <Drawer.Items>
                    <div className="overflow-x-auto">
                      <Table className="min-w-full table-auto border-collapse">
                        <tbody>
                          <tr className="bg-blue-700">
                            <td className="text-white px-4 py-2">
                              Valores de Entrada
                            </td>
                            <td className="text-boxdark px-4 py-2">
                              &nbsp;
                            </td>
                          </tr>
                          {
                            item.recalc_flag === "after_12_2021" ? (
                              <tr className="bg-gray dark:bg-boxdark-2/80">
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Regra de Cálculo</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">Após 12/2021</td>
                              </tr>
                            ) : item.recalc_flag === "before_12_2021" ? (
                              <tr className="bg-gray dark:bg-boxdark-2/80">
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Regra de Cálculo</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">Antes 12/2021</td>
                              </tr>
                            ) : (
                              <tr className="bg-gray dark:bg-boxdark-2/80">
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Regra de Cálculo</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">Tributário</td>
                              </tr>
                            )
                          }
                          {
                            item.npu === "00000000000000000000" || !item.link_cvld ? (
                              null
                            ) : (
                              <tr className="bg-gray dark:bg-boxdark-2/80">
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">NPU</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{item.npu}</td>
                              </tr>
                            )
                          }
                          {
                            item.nome_credor && (
                              <tr className="bg-gray dark:bg-boxdark-2/80">
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">Nome do credor</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{item.nome_credor}</td>
                              </tr>
                            )
                          }
                          {
                            item.cpf_cnpj_credor && (
                              <tr className="bg-gray dark:bg-boxdark-2/80">
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left">CPF/CNPJ do credor</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{item.cpf_cnpj_credor}</td>
                              </tr>
                            )
                          }
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Valor Principal</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.valor_principal)}</td>
                          </tr>
                          {
                            item.valor_juros ? (
                              <tr className="bg-gray dark:bg-boxdark-2/80">
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Valor Juros</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.valor_juros)}</td>
                              </tr>
                            ) : (
                              <tr className="bg-gray dark:bg-boxdark-2/80">
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Valor Juros</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">Não Informado</td>
                              </tr>
                            )
                          }
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Valor Inscrito</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.valor_inscrito)}</td>
                          </tr>
                          {
                            item.valor_pss !== 0 && item.valor_pss && (
                              <tr className="bg-gray dark:bg-boxdark-2/80">
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Valor PSS</td>
                                <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{numberFormat(item.valor_pss)}</td>
                              </tr>
                            )
                          }
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Data Base</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{dateFormater(item?.data_base)}</td>
                          </tr>
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Data Requisição</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{dateFormater(item?.data_requisicao)}</td>
                          </tr>
                          <tr className="bg-gray dark:bg-boxdark-2/80">
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-left text-boxdark">Atualizado até</td>
                            <td className="border border-stroke dark:border-strokedark dark:text-snow px-4 py-2 text-boxdark">{dateFormater(item?.data_limite_de_atualizacao)}</td>
                          </tr>
                          {
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
                          }
                          <tr className="bg-blue-700">
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
                          }

                          <tr className="bg-blue-700">
                            <td className="text-white px-4 py-2">
                              Deduções
                            </td>
                            <td className="text-boxdark px-4 py-2">
                              &nbsp;
                            </td>
                          </tr>
                          <tr className="bg-rose-300">
                            <td className="border border-stroke px-4 py-2 text-boxdark text-left">Imposto de Renda (3%)</td>
                            <td className="border border-stroke px-4 py-2 text-boxdark">{numberFormat(item.imposto_de_renda)}</td>
                          </tr>
                          {
                            item.link_memoria_de_calculo_rra && (
                              <tr className="bg-rose-300">
                                <td className="border border-stroke px-4 py-2 text-boxdark text-left">IR/RRA</td>
                                <td className="border border-stroke px-4 py-2 text-boxdark">{numberFormat(item.rra) ? numberFormat(item.rra) : "Não Informado"}</td>
                              </tr>
                            )
                          }
                          {
                            item.recalc_flag === "before_12_2021" && item.pss_atualizado !== 0 && (
                              <tr className="bg-rose-300">
                                <td className="border border-stroke px-4 py-2 text-boxdark text-left">PSS Atualizado</td>
                                <td className="border border-stroke px-4 py-2 text-boxdark">{numberFormat(item.pss_atualizado)}</td>
                              </tr>
                            )
                          }
                          <tr className="">
                            <td className="text-boxdark px-1">
                              &nbsp;
                            </td>
                            <td className="text-boxdark px-1">
                              &nbsp;
                            </td>
                          </tr>
                          <tr className="bg-green-300 text-boxdark">
                            <td className="border border-stroke px-4 py-2 text-left font-semibold">Valor Líquido Disponível</td>
                            <td className="border border-stroke px-4 py-2 text-boxdark font-semibold">{numberFormat(item.valor_liquido_disponivel)}</td>
                          </tr>
                        </tbody>
                      </Table>
                      <ul>
                        <hr className="border border-stroke dark:border-strokedark my-4" />
                        <li className="text-sm flex text-gray dark:text-gray-400 w-full py-1">
                          <a href={linkAdapter(item.link_memoria_de_calculo_simples)} target='_blank' className="w-full text-center py-3 flex items-center justify-center text-sm font-semibold text-white rounded-md bg-blue-700 hover:bg-blue-800">
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
                              <a href={linkAdapter(item.link_memoria_de_calculo_rra)} target='_blank' className="w-full text-center py-3 flex items-center justify-center text-sm font-semibold text-white rounded-md bg-blue-700 hover:bg-blue-800">
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
                      </ul>

                    </div>
                  </Drawer.Items>
                </React.Fragment>
              )}
            </Drawer>
          </Flowbite>
        )
      }
    </>
  );
}
