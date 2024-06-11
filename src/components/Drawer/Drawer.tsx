import dateFormater from "@/functions/formaters/dateFormater";
import factorFormater from "@/functions/formaters/factorFormater";
import linkAdapter from "@/functions/formaters/linkFormater";
import numberFormat from "@/functions/formaters/numberFormat";
import { Button, Drawer, Table, TableBody, TableCell, TableHead, TableRow } from "flowbite-react";
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
              <TableHead className="bg-gray-200">
                <TableRow>
                  <th className="sr-only px-4 py-2 text-white">Chave</th>
                  <th className="sr-only px-4 py-2 text-white">Valor</th>
                </TableRow>
              </TableHead>
              <Table>
                {
                  data.recalc_flag === "after_12_2021" ? (
                    <TableRow className="bg-gradient-to-r from-purple-300 to-blue-400">
                      <TableCell className="border border-stroke px-4 py-2 text-left  text-white">Regra de Cálculo</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">Após 12/2021</TableCell>
                    </TableRow>
                  ) : data.recalc_flag === "before_12_2021" ? (
                    <TableRow className="bg-gradient-to-r from-purple-300 to-blue-400">
                      <TableCell className="border border-stroke px-4 py-2 text-left text-white">Regra de Cálculo</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">Antes 12/2021</TableCell>
                    </TableRow>
                  ) : (
                    <TableRow className="bg-gradient-to-r from-purple-300 to-blue-400">
                      <TableCell className="border border-stroke px-4 py-2 text-left text-white">Regra de Cálculo</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">Tributário</TableCell>
                    </TableRow>
                  )
                }
                {
                  data.npu === "00000000000000000000" || !data.link_cvld ? (
                    null
                  ) : (
                    <TableRow>
                      <TableCell className="border border-stroke px-4 py-2 text-left">NPU</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">{data.npu}</TableCell>
                    </TableRow>
                  )
                }
                {
                  data.nome_credor && (
                    <TableRow>
                      <TableCell className="border border-stroke px-4 py-2 text-left">Nome do credor</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">{data.nome_credor}</TableCell>
                    </TableRow>
                  )
                }
                {
                  data.cpf_cnpj_credor && (
                    <TableRow>
                      <TableCell className="border border-stroke px-4 py-2 text-left">CPF/CNPJ do credor</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">{data.cpf_cnpj_credor}</TableCell>
                    </TableRow>
                  )
                }
                <TableRow className="bg-gradient-to-r from-purple-300 to-blue-400">
                  <TableCell className="border border-stroke px-4 py-2 text-left text-white">Valor Principal</TableCell>
                  <TableCell className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_principal)}</TableCell>
                </TableRow>
                {
                  data.valor_juros ? (
                    <TableRow className="bg-gradient-to-r from-purple-300 to-blue-400">
                      <TableCell className="border border-stroke px-4 py-2 text-left text-white">Valor Juros</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_juros)}</TableCell>
                    </TableRow>
                  ) : (
                    <TableRow className="bg-gradient-to-r from-purple-300 to-blue-400">
                      <TableCell className="border border-stroke px-4 py-2 text-left text-white">Valor Juros</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">Não Informado</TableCell>
                    </TableRow>
                  )
                }
                <TableRow className="bg-gradient-to-r from-purple-300 to-blue-400">
                  <TableCell className="border border-stroke px-4 py-2 text-left text-white">Valor Inscrito</TableCell>
                  <TableCell className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_inscrito)}</TableCell>
                </TableRow>
                {
                  data.valor_pss !== 0 && data.valor_pss && (
                    <TableRow className="bg-gradient-to-r from-purple-300 to-blue-400">
                      <TableCell className="border border-stroke px-4 py-2 text-left text-white">Valor PSS</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_pss)}</TableCell>
                    </TableRow>
                  )
                }
                <TableRow className="bg-gradient-to-r from-purple-300 to-blue-400">
                  <TableCell className="border border-stroke px-4 py-2 text-left text-white">Data Base</TableCell>
                  <TableCell className="border border-stroke px-4 py-2 text-white">{dateFormater(data.data_base)}</TableCell>
                </TableRow>
                <TableRow className="bg-gradient-to-r from-purple-300 to-blue-400">
                  <TableCell className="border border-stroke px-4 py-2 text-left text-white">Data Requisição</TableCell>
                  <TableCell className="border border-stroke px-4 py-2 text-white">{dateFormater(data?.data_requisicao)}</TableCell>
                </TableRow>
                <TableRow className="bg-gradient-to-r from-purple-300 to-blue-400">
                  <TableCell className="border border-stroke px-4 py-2 text-left text-white">Atualizado até</TableCell>
                  <TableCell className="border border-stroke px-4 py-2 text-white">{dateFormater(data.data_limite_de_atualizacao)}</TableCell>
                </TableRow>
                {
                  data.fator_correcao_ipca_e && (
                    <TableRow className="bg-gradient-to-r from-purple-400 to-blue-500">
                      <TableCell className="border border-stroke px-4 py-2 text-left text-white">Fator IPCA-E até 12/2021</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">{factorFormater(data.fator_correcao_ipca_e)}</TableCell>
                    </TableRow>
                  )
                }
                {
                  data.recalc_flag === "before_12_2021" && (
                    <>
                      <TableRow className="bg-gradient-to-r from-purple-400 to-blue-500">
                        <TableCell className="border border-stroke px-4 py-2 text-left text-white">Principal Atualizado até 12/2021</TableCell>
                        <TableCell className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_atualizado_principal)}</TableCell>
                      </TableRow>
                      <TableRow className="bg-gradient-to-r from-purple-400 to-blue-500">
                        <TableCell className="border border-stroke px-4 py-2 text-left text-white">Juros Atualizado até 12/2021</TableCell>
                        <TableCell className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_atualizado_juros)}</TableCell>
                      </TableRow>
                    </>
                  )
                }
                {
                  data.recalc_flag && (
                    <TableRow className="bg-gradient-to-r from-purple-500 to-blue-600">
                      <TableCell className="border border-stroke px-4 py-2 text-left text-white">Fator SELIC</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">{factorFormater(data.fator_correcao_selic)}</TableCell>
                    </TableRow>
                  )
                }
                {
                  data.principal_atualizado_requisicao && (
                    <TableRow className="bg-gradient-to-r from-purple-500 to-blue-600">
                      <TableCell className="border border-stroke px-4 py-2 text-left text-white">Principal Atualizado até a Requisição</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">{numberFormat(data.principal_atualizado_requisicao)}</TableCell>
                    </TableRow>
                  )
                }
                {
                  String(data.juros_atualizados_requisicao) && (
                    <TableRow className="bg-gradient-to-r from-purple-500 to-blue-600">
                      <TableCell className="border border-stroke px-4 py-2 text-left text-white">Juros Atualizados até a Requisição</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">{numberFormat(data.juros_atualizados_requisicao)}</TableCell>
                    </TableRow>
                  )
                }
                {
                  data.fator_periodo_graca_ipca_e && (
                    <TableRow className="bg-gradient-to-r from-purple-600 to-blue-700">
                      <TableCell className="border border-stroke px-4 py-2 text-left text-white">Fator Período de Graça IPCA-E</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">{factorFormater(data.fator_periodo_graca_ipca_e)}</TableCell>
                    </TableRow>
                  )
                }
                {
                  data.recalc_flag === "before_12_2021" && (
                    <TableRow className="bg-gradient-to-r from-purple-600 to-blue-700">
                      <TableCell className="border border-stroke px-4 py-2 text-white text-left">Valor Principal Atualizado Final</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_principal_ipca_e)}</TableCell>
                    </TableRow>
                  )
                }
                {
                  data.recalc_flag === "before_12_2021" && (
                    <TableRow className="bg-gradient-to-r from-purple-600 to-blue-700">
                      <TableCell className="border border-stroke px-4 py-2 text-white text-left">Valor Juros Atualizado Final</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_juros_ipca_e)}</TableCell>
                    </TableRow>
                  )
                }
                  {
                    data.valor_bruto_atualizado_final && (
                      <TableRow className="bg-gradient-to-r from-purple-600 to-blue-700">
                        <TableCell className="border border-stroke px-4 py-2 text-white text-left">Valor Bruto Atualizado Final</TableCell>
                        <TableCell className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_bruto_atualizado_final)}</TableCell>
                      </TableRow>
                    )
                  }
                <TableRow className="bg-gradient-to-r from-rose-300 to-red">
                  <TableCell className="border border-stroke px-4 py-2 text-white text-left">Imposto de Renda (3%)</TableCell>
                  <TableCell className="border border-stroke px-4 py-2 text-white">{numberFormat(data.imposto_de_renda)}</TableCell>
                </TableRow>
                {
                  data.link_memoria_de_calculo_rra && (
                    <TableRow className="bg-gradient-to-r from-rose-300 to-red">
                      <TableCell className="border border-stroke px-4 py-2 text-white text-left">IR/RRA</TableCell>
                      <TableCell className="border border-stroke px-4 py-2 text-white">{numberFormat(data.rra) ? numberFormat(data.rra) : "Não Informado"}</TableCell>
                    </TableRow>
                  )
                }

                  {
                    data.recalc_flag === "before_12_2021" && data.pss_atualizado !== 0 && (
                      <TableRow className="bg-gradient-to-r from-rose-300 to-red">
                        <TableCell className="border border-stroke px-4 py-2 text-white text-left">PSS Atualizado</TableCell>
                        <TableCell className="border border-stroke px-4 py-2 text-white">{numberFormat(data.pss_atualizado)}</TableCell>
                      </TableRow>
                    )
                  }
                <TableRow className="bg-gradient-to-r from-green-300 to-green-400 text-white">
                  <TableCell className="border border-stroke px-4 py-2 text-left">Valor Líquido Disponível</TableCell>
                  <TableCell className="border border-stroke px-4 py-2 text-white">{numberFormat(data.valor_liquido_disponivel)}</TableCell>
                </TableRow>
              </Table>
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
