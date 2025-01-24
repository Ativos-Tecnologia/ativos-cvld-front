import dateFormater from '@/functions/formaters/dateFormater';
import factorFormater from '@/functions/formaters/factorFormater';
import linkAdapter from '@/functions/formaters/linkFormater';
import numberFormat from '@/functions/formaters/numberFormat';
import { customFlowBiteTheme } from '@/themes/FlowbiteThemes';
import { Button, Drawer, Flowbite, Table } from 'flowbite-react';
import React, { useContext, useRef, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { BiDownload, BiX } from 'react-icons/bi';
import { CgDetailsMore } from 'react-icons/cg';
import { ExtratosTableContext } from '@/context/ExtratosTableContext';

export function AwesomeDrawer() {
    const {
        item,
        setItem,
        loading,
        openDetailsDrawer,
        setOpenDetailsDrawer,
        editableLabel,
        setEditableLabel,
        updateCreditorName,
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
            credor: value,
        });
    };

    return (
        <>
            {item['valor_principal'] && (
                <Flowbite theme={{ theme: customFlowBiteTheme }}>
                    <Drawer
                        open={openDetailsDrawer}
                        onClose={handleClose}
                        style={{
                            boxShadow: '2px 0 2px 0 rgba(0, 0, 0, 0.1)',
                        }}
                        className="flex min-w-48 flex-col sm:w-115"
                        backdrop={true}
                    >
                        {loading ? (
                            <div className="mx-auto flex h-full w-fit flex-col items-center justify-center gap-8">
                                <AiOutlineLoading className="h-10 w-10 animate-spin fill-blue-700" />
                                <p className="text-center text-sm">
                                    Carregando dados do extrato
                                    <span className="typewriter">...</span>
                                </p>
                            </div>
                        ) : (
                            <React.Fragment>
                                {/* <Drawer.Header title={data.credor || 'Sem título'} onClose={handleClose} titleIcon={CgDetailsMore} className="mb-1 border-b dark:border-form-strokedark" /> */}
                                <div className="mb-1 border-b dark:border-form-strokedark">
                                    <div className="mb-4 flex items-center gap-3 text-2xl font-semibold">
                                        <CgDetailsMore />
                                        <div className="relative flex-1">
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                defaultValue={item.credor || 'Sem título'}
                                                onKeyDown={(e) => {
                                                    if (
                                                        e.key === 'Enter' ||
                                                        e.key === 'Tab' ||
                                                        e.key === 'Escape'
                                                    ) {
                                                        handleChangeCreditorName(
                                                            item.id,
                                                            e.currentTarget.value,
                                                        );
                                                    }
                                                }}
                                                onBlur={(e) =>
                                                    handleChangeCreditorName(
                                                        item.id,
                                                        e.currentTarget.value,
                                                    )
                                                }
                                                className={`${editableLabel === item.id && '!border-1 !border-blue-700'} w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-md border-transparent bg-transparent pl-1 text-2xl focus-within:ring-0`}
                                            />
                                            {editableLabel === item.id && (
                                                <div
                                                    onClick={() => setEditableLabel!(item.id)}
                                                    className="absolute inset-0"
                                                ></div>
                                            )}
                                        </div>
                                        <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-lg transition-all duration-200 hover:bg-slate-300 dark:hover:bg-form-strokedark">
                                            <BiX onClick={handleClose} />
                                        </div>
                                    </div>
                                </div>

                                <Drawer.Items>
                                    <div className="overflow-x-auto">
                                        <Table className="min-w-full table-auto border-collapse">
                                            <tbody>
                                                <tr className="bg-blue-700">
                                                    <td className="px-4 py-2 text-white">
                                                        Valores de Entrada
                                                    </td>
                                                    <td className="px-4 py-2 text-boxdark">
                                                        &nbsp;
                                                    </td>
                                                </tr>
                                                {item.recalc_flag === 'after_12_2021' ? (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                            Regra de Cálculo
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            Após 12/2021
                                                        </td>
                                                    </tr>
                                                ) : item.recalc_flag === 'before_12_2021' ? (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                            Regra de Cálculo
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            Antes 12/2021
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                            Regra de Cálculo
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            Tributário
                                                        </td>
                                                    </tr>
                                                )}
                                                {item.npu === '00000000000000000000' ||
                                                !item.link_cvld ? null : (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left dark:border-strokedark dark:text-snow">
                                                            NPU
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            {item.npu}
                                                        </td>
                                                    </tr>
                                                )}
                                                {item.nome_credor && (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left dark:border-strokedark dark:text-snow">
                                                            Nome do credor
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            {item.nome_credor}
                                                        </td>
                                                    </tr>
                                                )}
                                                {item.cpf_cnpj_credor && (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left dark:border-strokedark dark:text-snow">
                                                            CPF/CNPJ do credor
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            {item.cpf_cnpj_credor}
                                                        </td>
                                                    </tr>
                                                )}
                                                <tr className="bg-gray dark:bg-boxdark-2/80">
                                                    <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                        Valor Principal
                                                    </td>
                                                    <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                        {numberFormat(item.valor_principal)}
                                                    </td>
                                                </tr>
                                                {item.valor_juros ? (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                            Valor Juros
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            {numberFormat(item.valor_juros)}
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                            Valor Juros
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            Não Informado
                                                        </td>
                                                    </tr>
                                                )}
                                                <tr className="bg-gray dark:bg-boxdark-2/80">
                                                    <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                        Valor Inscrito
                                                    </td>
                                                    <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                        {numberFormat(item.valor_inscrito)}
                                                    </td>
                                                </tr>
                                                {item.valor_pss !== 0 && item.valor_pss && (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                            Valor PSS
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            {numberFormat(item.valor_pss)}
                                                        </td>
                                                    </tr>
                                                )}
                                                <tr className="bg-gray dark:bg-boxdark-2/80">
                                                    <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                        Data Base
                                                    </td>
                                                    <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                        {dateFormater(item?.data_base)}
                                                    </td>
                                                </tr>
                                                <tr className="bg-gray dark:bg-boxdark-2/80">
                                                    <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                        Data Requisição
                                                    </td>
                                                    <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                        {dateFormater(item?.data_requisicao)}
                                                    </td>
                                                </tr>
                                                <tr className="bg-gray dark:bg-boxdark-2/80">
                                                    <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                        Atualizado até
                                                    </td>
                                                    <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                        {dateFormater(
                                                            item?.data_limite_de_atualizacao,
                                                        )}
                                                    </td>
                                                </tr>
                                                {item.fator_correcao_ipca_e && (
                                                    <>
                                                        <tr className="bg-blue-700">
                                                            <td className="px-4 py-2 text-white">
                                                                IPCA-E
                                                            </td>
                                                            <td className="px-4 py-2 text-boxdark">
                                                                &nbsp;
                                                            </td>
                                                        </tr>
                                                        <tr className="bg-gray dark:bg-boxdark-2/80">
                                                            <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                                Fator IPCA-E até 12/2021
                                                            </td>
                                                            <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                                {factorFormater(
                                                                    item.fator_correcao_ipca_e,
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </>
                                                )}
                                                {item.recalc_flag === 'before_12_2021' && (
                                                    <>
                                                        <tr className="bg-gray dark:bg-boxdark-2/80">
                                                            <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                                Principal Atualizado até 12/2021
                                                            </td>
                                                            <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                                {numberFormat(
                                                                    item.valor_atualizado_principal,
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr className="bg-gray dark:bg-boxdark-2/80">
                                                            <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                                Juros Atualizado até 12/2021
                                                            </td>
                                                            <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                                {numberFormat(
                                                                    item.valor_atualizado_juros,
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </>
                                                )}
                                                <tr className="bg-blue-700">
                                                    <td className="px-4 py-2 text-white">SELIC</td>
                                                    <td className="px-4 py-2 text-boxdark">
                                                        &nbsp;
                                                    </td>
                                                </tr>
                                                {item.recalc_flag && (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                            Fator SELIC
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            {factorFormater(
                                                                item.fator_correcao_selic,
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                                {item.principal_atualizado_requisicao && (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                            Principal Atualizado até a Requisição
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            {numberFormat(
                                                                item.principal_atualizado_requisicao,
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                                {String(item.juros_atualizados_requisicao) && (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                            Juros Atualizados até a Requisição
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            {numberFormat(
                                                                item.juros_atualizados_requisicao,
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                                <tr className="bg-blue-700">
                                                    <td className="px-4 py-2 text-white">
                                                        Período de Graça IPCA-E
                                                    </td>
                                                    <td className="px-4 py-2 text-boxdark">
                                                        &nbsp;
                                                    </td>
                                                </tr>
                                                {item.fator_periodo_graca_ipca_e && (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                            Fator Período de Graça IPCA-E
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            {factorFormater(
                                                                item.fator_periodo_graca_ipca_e,
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                                {item.recalc_flag === 'before_12_2021' && (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                            Valor Principal Atualizado Final
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            {numberFormat(
                                                                item.valor_principal_ipca_e,
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                                {item.recalc_flag === 'before_12_2021' && (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                            Valor Juros Atualizado Final
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            {numberFormat(item.valor_juros_ipca_e)}
                                                        </td>
                                                    </tr>
                                                )}
                                                {item.valor_bruto_atualizado_final && (
                                                    <tr className="bg-gray dark:bg-boxdark-2/80">
                                                        <td className="border border-stroke px-4 py-2 text-left text-boxdark dark:border-strokedark dark:text-snow">
                                                            Valor Bruto Atualizado Final
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark dark:border-strokedark dark:text-snow">
                                                            {numberFormat(
                                                                item.valor_bruto_atualizado_final,
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}

                                                <tr className="bg-blue-700">
                                                    <td className="px-4 py-2 text-white">
                                                        Deduções
                                                    </td>
                                                    <td className="px-4 py-2 text-boxdark">
                                                        &nbsp;
                                                    </td>
                                                </tr>
                                                <tr className="bg-rose-300">
                                                    <td className="border border-stroke px-4 py-2 text-left text-boxdark">
                                                        Imposto de Renda (3%)
                                                    </td>
                                                    <td className="border border-stroke px-4 py-2 text-boxdark">
                                                        {numberFormat(item.imposto_de_renda)}
                                                    </td>
                                                </tr>
                                                {item.link_memoria_de_calculo_rra && (
                                                    <tr className="bg-rose-300">
                                                        <td className="border border-stroke px-4 py-2 text-left text-boxdark">
                                                            IR/RRA
                                                        </td>
                                                        <td className="border border-stroke px-4 py-2 text-boxdark">
                                                            {numberFormat(item.rra)
                                                                ? numberFormat(item.rra)
                                                                : 'Não Informado'}
                                                        </td>
                                                    </tr>
                                                )}
                                                {item.recalc_flag === 'before_12_2021' &&
                                                    item.pss_atualizado !== 0 && (
                                                        <tr className="bg-rose-300">
                                                            <td className="border border-stroke px-4 py-2 text-left text-boxdark">
                                                                PSS Atualizado
                                                            </td>
                                                            <td className="border border-stroke px-4 py-2 text-boxdark">
                                                                {numberFormat(item.pss_atualizado)}
                                                            </td>
                                                        </tr>
                                                    )}
                                                <tr className="">
                                                    <td className="px-1 text-boxdark">&nbsp;</td>
                                                    <td className="px-1 text-boxdark">&nbsp;</td>
                                                </tr>
                                                <tr className="bg-green-300 text-boxdark">
                                                    <td className="border border-stroke px-4 py-2 text-left font-semibold">
                                                        Valor Líquido Disponível
                                                    </td>
                                                    <td className="border border-stroke px-4 py-2 font-semibold text-boxdark">
                                                        {numberFormat(
                                                            item.valor_liquido_disponivel,
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <ul>
                                            <hr className="my-4 border border-stroke dark:border-strokedark" />
                                            <li className="flex w-full py-1 text-sm text-gray dark:text-gray-400">
                                                <a
                                                    href={linkAdapter(
                                                        item.link_memoria_de_calculo_simples,
                                                    )}
                                                    target="_blank"
                                                    className="flex w-full items-center justify-center rounded-md bg-blue-700 py-3 text-center text-sm font-semibold text-white hover:bg-blue-800"
                                                >
                                                    <span className="text-[16px] font-medium text-gray">
                                                        Memória de Cálculo Simples
                                                    </span>
                                                    <BiDownload
                                                        style={{
                                                            width: '22px',
                                                            height: '22px',
                                                        }}
                                                        className="ml-2 text-gray"
                                                    />
                                                </a>
                                            </li>
                                            {item.link_memoria_de_calculo_rra && (
                                                <li className="flex w-full py-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <a
                                                        href={linkAdapter(
                                                            item.link_memoria_de_calculo_rra,
                                                        )}
                                                        target="_blank"
                                                        className="flex w-full items-center justify-center rounded-md bg-blue-700 py-3 text-center text-sm font-semibold text-white hover:bg-blue-800"
                                                    >
                                                        <span className="text-[16px] font-medium">
                                                            Memória de Cálculo RRA
                                                        </span>
                                                        <BiDownload
                                                            style={{
                                                                width: '22px',
                                                                height: '22px',
                                                            }}
                                                            className="ml-2  text-gray"
                                                        />
                                                    </a>
                                                </li>
                                            )}
                                            {item.link_cvld && (
                                                <li className="flex w-full py-1 text-sm text-gray-500 dark:text-gray-400">
                                                    <Button
                                                        as={'a'}
                                                        href={linkAdapter(item.link_cvld)}
                                                        gradientDuoTone="purpleToBlue"
                                                        className="w-full rounded-md px-4 text-center text-sm font-semibold text-boxdark hover:opacity-90"
                                                    >
                                                        <span className="text-[16px] font-medium">
                                                            Baixar CVLD
                                                        </span>
                                                        <BiDownload
                                                            style={{
                                                                width: '22px',
                                                                height: '22px',
                                                            }}
                                                            className="ml-2  text-gray"
                                                        />
                                                    </Button>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </Drawer.Items>
                            </React.Fragment>
                        )}
                    </Drawer>
                </Flowbite>
            )}
        </>
    );
}
