import dateFormater from "@/functions/formaters/dateFormater";
import factorFormater from "@/functions/formaters/factorFormater";
import linkAdapter from "@/functions/formaters/linkFormater";
import numberFormat from "@/functions/formaters/numberFormat";
import { Button, Drawer, Table} from "flowbite-react";
import { useState } from "react";
import { BiDownload } from "react-icons/bi";
import { MdAddChart } from "react-icons/md";

export function AwesomeDrawer({ data }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="flex items-center justify-center">
        <Button gradientDuoTone="purpleToBlue" onClick={() => setIsOpen(true)}>Detalhes</Button>
      </div>
      <Drawer open={isOpen} onClose={handleClose} style={{
        boxShadow: "2px 0 2px 0 rgba(0, 0, 0, 0.1)"
      }} className="min-w-48 sm:w-115">
        <Drawer.Header title="Detalhes" onClose={handleClose} titleIcon={MdAddChart} className="mb-4" />
        <Drawer.Items>
          <div className="overflow-x-auto">
            <Table className="min-w-full table-auto border-collapse">
                {
                  data.recalc_flag === "after_12_2021" ? (
                    <tr className="bg-gradient-to-r from-purple-300 to-blue-400">
                      <td className="border border-stroke px-4 py-2 text-left  text-white">Regra de Cálculo</td>
                      <td className="border border-stroke px-4 py-2 text-white">Após 12/2021</td>
                    </tr>
                  ) : data.recalc_flag === "before_12_2021" ? (
                    <tr className="bg-gradient-to-r from-purple-300 to-blue-400">
                      <td className="border border-stroke px-4 py-2 text-left text-white">Regra de Cálculo</td>
                      <td className="border border-stroke px-4 py-2 text-white">Antes 12/2021</td>
                    </tr>
                  ) : (
                    <tr className="bg-gradient-to-r from-purple-300 to-blue-400">
                      <td className="border border-stroke px-4 py-2 text-left text-white">Regra de Cálculo</td>
                      <td className="border border-stroke px-4 py-2 text-white">Tributário</td>
                    </tr>
                  )
                }
                {
                  data.npu === "00000000000000000000" || !data.link_cvld ? (
                    null
                  ) : (
                    <tr>
                      <td className="border border-stroke px-4 py-2 text-left">NPU</td>
                      <td className="border border-stroke px-4 py-2 text-white">{data.npu}</td>
                    </tr>
                  )
                }
                {
                  data.nome_credor && (
                    <tr>
                      <td className="border border-stroke px-4 py-2 text-left">Nome do credor</td>
                      <td className="border border-stroke px-4 py-2 text-white">{data.nome_credor}</td>
                    </tr>
                  )
                }
                {
                  data.cpf_cnpj_credor && (
                    <tr>
                      <td className="border border-stroke px-4 py-2 text-left">CPF/CNPJ do credor</td>
                      <td className="border border-stroke px-4 py-2 text-white">{data.cpf_cnpj_credor}</td>
                    </tr>
                  )
                }
                <tr className="bg-gradient-to-r from-purple-300 to-blue-400">
                  <td className="border border-stroke px-4 py-2 text-left text-white">Valor Principal</td>
                  <td className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_principal)}</td>
                </tr>
                {
                  data.valor_juros ? (
                    <tr className="bg-gradient-to-r from-purple-300 to-blue-400">
                      <td className="border border-stroke px-4 py-2 text-left text-white">Valor Juros</td>
                      <td className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_juros)}</td>
                    </tr>
                  ) : (
                    <tr className="bg-gradient-to-r from-purple-300 to-blue-400">
                      <td className="border border-stroke px-4 py-2 text-left text-white">Valor Juros</td>
                      <td className="border border-stroke px-4 py-2 text-white">Não Informado</td>
                    </tr>
                  )
                }
                <tr className="bg-gradient-to-r from-purple-300 to-blue-400">
                  <td className="border border-stroke px-4 py-2 text-left text-white">Valor Inscrito</td>
                  <td className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_inscrito)}</td>
                </tr>
                {
                  data.valor_pss !== 0 && data.valor_pss && (
                    <tr className="bg-gradient-to-r from-purple-300 to-blue-400">
                      <td className="border border-stroke px-4 py-2 text-left text-white">Valor PSS</td>
                      <td className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_pss)}</td>
                    </tr>
                  )
                }
                <tr className="bg-gradient-to-r from-purple-300 to-blue-400">
                  <td className="border border-stroke px-4 py-2 text-left text-white">Data Base</td>
                  <td className="border border-stroke px-4 py-2 text-white">{dateFormater(data.data_base)}</td>
                </tr>
                <tr className="bg-gradient-to-r from-purple-300 to-blue-400">
                  <td className="border border-stroke px-4 py-2 text-left text-white">Data Requisição</td>
                  <td className="border border-stroke px-4 py-2 text-white">{dateFormater(data?.data_requisicao)}</td>
                </tr>
                <tr className="bg-gradient-to-r from-purple-300 to-blue-400">
                  <td className="border border-stroke px-4 py-2 text-left text-white">Atualizado até</td>
                  <td className="border border-stroke px-4 py-2 text-white">{dateFormater(data.data_limite_de_atualizacao)}</td>
                </tr>
                {
                  data.fator_correcao_ipca_e && (
                    <tr className="bg-gradient-to-r from-purple-400 to-blue-500">
                      <td className="border border-stroke px-4 py-2 text-left text-white">Fator IPCA-E até 12/2021</td>
                      <td className="border border-stroke px-4 py-2 text-white">{factorFormater(data.fator_correcao_ipca_e)}</td>
                    </tr>
                  )
                }
                {
                  data.recalc_flag === "before_12_2021" && (
                    <>
                      <tr className="bg-gradient-to-r from-purple-400 to-blue-500">
                        <td className="border border-stroke px-4 py-2 text-left text-white">Principal Atualizado até 12/2021</td>
                        <td className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_atualizado_principal)}</td>
                      </tr>
                      <tr className="bg-gradient-to-r from-purple-400 to-blue-500">
                        <td className="border border-stroke px-4 py-2 text-left text-white">Juros Atualizado até 12/2021</td>
                        <td className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_atualizado_juros)}</td>
                      </tr>
                    </>
                  )
                }
                {
                  data.recalc_flag && (
                    <tr className="bg-gradient-to-r from-purple-500 to-blue-600">
                      <td className="border border-stroke px-4 py-2 text-left text-white">Fator SELIC</td>
                      <td className="border border-stroke px-4 py-2 text-white">{factorFormater(data.fator_correcao_selic)}</td>
                    </tr>
                  )
                }
                {
                  data.principal_atualizado_requisicao && (
                    <tr className="bg-gradient-to-r from-purple-500 to-blue-600">
                      <td className="border border-stroke px-4 py-2 text-left text-white">Principal Atualizado até a Requisição</td>
                      <td className="border border-stroke px-4 py-2 text-white">{numberFormat(data.principal_atualizado_requisicao)}</td>
                    </tr>
                  )
                }
                {
                  String(data.juros_atualizados_requisicao) && (
                    <tr className="bg-gradient-to-r from-purple-500 to-blue-600">
                      <td className="border border-stroke px-4 py-2 text-left text-white">Juros Atualizados até a Requisição</td>
                      <td className="border border-stroke px-4 py-2 text-white">{numberFormat(data.juros_atualizados_requisicao)}</td>
                    </tr>
                  )
                }
                {
                  data.fator_periodo_graca_ipca_e && (
                    <tr className="bg-gradient-to-r from-purple-600 to-blue-700">
                      <td className="border border-stroke px-4 py-2 text-left text-white">Fator Período de Graça IPCA-E</td>
                      <td className="border border-stroke px-4 py-2 text-white">{factorFormater(data.fator_periodo_graca_ipca_e)}</td>
                    </tr>
                  )
                }
                {
                  data.recalc_flag === "before_12_2021" && (
                    <tr className="bg-gradient-to-r from-purple-600 to-blue-700">
                      <td className="border border-stroke px-4 py-2 text-white text-left">Valor Principal Atualizado Final</td>
                      <td className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_principal_ipca_e)}</td>
                    </tr>
                  )
                }
                {
                  data.recalc_flag === "before_12_2021" && (
                    <tr className="bg-gradient-to-r from-purple-600 to-blue-700">
                      <td className="border border-stroke px-4 py-2 text-white text-left">Valor Juros Atualizado Final</td>
                      <td className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_juros_ipca_e)}</td>
                    </tr>
                  )
                }
                  {
                    data.valor_bruto_atualizado_final && (
                      <tr className="bg-gradient-to-r from-purple-600 to-blue-700">
                        <td className="border border-stroke px-4 py-2 text-white text-left">Valor Bruto Atualizado Final</td>
                        <td className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_bruto_atualizado_final)}</td>
                      </tr>
                    )
                  }
                <tr className="bg-gradient-to-r from-rose-300 to-red">
                  <td className="border border-stroke px-4 py-2 text-white text-left">Imposto de Renda (3%)</td>
                  <td className="border border-stroke px-4 py-2 text-white">{numberFormat(data.imposto_de_renda)}</td>
                </tr>
                {
                  data.link_memoria_de_calculo_rra && (
                    <tr className="bg-gradient-to-r from-rose-300 to-red">
                      <td className="border border-stroke px-4 py-2 text-white text-left">IR/RRA</td>
                      <td className="border border-stroke px-4 py-2 text-white">{numberFormat(data.rra) ? numberFormat(data.rra) : "Não Informado"}</td>
                    </tr>
                  )
                }

                  {
                    data.recalc_flag === "before_12_2021" && data.pss_atualizado !== 0 && (
                      <tr className="bg-gradient-to-r from-rose-300 to-red">
                        <td className="border border-stroke px-4 py-2 text-white text-left">PSS Atualizado</td>
                        <td className="border border-stroke px-4 py-2 text-white">{numberFormat(data.pss_atualizado)}</td>
                      </tr>
                    )
                  }
                <tr className="bg-gradient-to-r from-green-300 to-green-400 text-white">
                  <td className="border border-stroke px-4 py-2 text-left">Valor Líquido Disponível</td>
                  <td className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_liquido_disponivel)}</td>
                </tr>
              </Table>
            <ul>
              <hr className="border border-stroke dark:border-strokedark my-4" />
              <li className="text-sm flex text-gray-500 dark:text-gray-400 w-full py-1">
                <Button as={'a'} href={linkAdapter(data.link_memoria_de_calculo_simples)} gradientDuoTone="purpleToBlue" className="w-full text-center px-4 text-sm font-semibold text-white rounded-md hover:opacity-90">
                  <span className="text-[16px] font-medium">
                    Memória de Cálculo Simples
                  </span>
                  <BiDownload style={{
                    width: "22px",
                    height: "22px",
                  }} className="ml-2" />
                </Button>
              </li>
              {
                data.link_memoria_de_calculo_rra && (
                  <li className="text-sm flex text-gray-500 dark:text-gray-400 w-full py-1">
                    <Button as={'a'} href={linkAdapter(data.link_memoria_de_calculo_rra)} gradientDuoTone="purpleToBlue" className="w-full text-center px-4 text-sm font-semibold text-white rounded-md hover:opacity-90">
                      <span className="text-[16px] font-medium">
                        Memória de Cálculo RRA
                      </span>
                      <BiDownload style={{
                        width: "22px",
                        height: "22px",
                      }} className="ml-2" />
                    </Button>
                  </li>
                )
              }
              {
                data.link_cvld && (
                  <li className="text-sm flex text-gray-500 dark:text-gray-400 w-full py-1">
                    <Button as={'a'} href={linkAdapter(data.link_cvld)} gradientDuoTone="purpleToBlue" className="w-full text-center px-4 text-sm font-semibold text-white rounded-md hover:opacity-90">
                      <span className="text-[16px] font-medium">
                        Baixar CVLD
                      </span>
                      <BiDownload style={{
                        width: "22px",
                        height: "22px",
                      }} className="ml-2" />
                    </Button>
                  </li>
                )
              }
            </ul>

          </div>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
