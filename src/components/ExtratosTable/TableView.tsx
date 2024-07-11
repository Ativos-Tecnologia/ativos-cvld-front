import { Badge, CustomFlowbiteTheme, Flowbite, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import numberFormat from "@/functions/formaters/numberFormat";
import { ExtractTableProps } from '@/types/extractTable';
import React, { useState } from 'react';
import { BiPlug, BiPlus, BiTask } from 'react-icons/bi';
import { CVLDResultProps } from '@/interfaces/IResultCVLD';
import { BsFillTrashFill } from 'react-icons/bs';
import statusOficio from '@/enums/statusOficio.enum';
import tipoOficio from '@/enums/tipoOficio.enum';
import api from '@/utils/api';
import { TaskDrawer } from '../TaskElements';

const customTheme: CustomFlowbiteTheme = {
    table: {
        root: {
            base: "w-full text-left text-sm text-gray-500 dark:text-gray-400",
            shadow: "absolute left-0 top-0 -z-10 h-full w-full rounded-sm bg-white drop-shadow-md dark:bg-black",
            wrapper: "relative"
        },
        body: {
            base: "group/body",
            cell: {
                base: "px-4 py-3 group-first/body:group-first/row:first:rounded-tl-sm group-first/body:group-first/row:last:rounded-tr-sm group-last/body:group-last/row:first:rounded-bl-sm group-last/body:group-last/row:last:rounded-br-sm dark:bg-boxdark dark:text-white border-b border-gray dark:border-gray"
            }
        },
        head: {
            base: "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
            cell: {
                base: "bg-stone-300 text-black px-4 py-3 group-first/head:first:rounded-tl-sm group-first/head:last:rounded-tr-sm dark:bg-boxdark dark:text-white dark:border-b dark:border-gray"
            }
        },
        row: {
            base: "group/row",
            hovered: "hover:bg-gray-50 dark:hover:bg-gray-600",
            striped: "odd:bg-white even:bg-green-300 odd:dark:bg-gray-800 even:dark:bg-gray-700"
        }
    }
}

const TableView = ({data, showModalMessage, loading, setData, setModalOptions, fetchDelete, setOpenDrawer, fetchDataById}: ExtractTableProps) => {
    const enumOficiosList = Object.values(statusOficio);
    const enumTipoOficiosList = Object.values(tipoOficio);
    const [openTaskDrawer, setOpenTaskDrawer] = useState(false);

    const updateOficioStatus = async (id: string, status: statusOficio) => {
        try {
            const response = await api.put(`/api/extrato/update/status/${id}/`, {
                status
            });

            const updatedData = data.map((item: CVLDResultProps) => {
                if (item.id === id) {
                    return {
                        ...item,
                        status: response.data.status
                    }
                }

                return item;
            });

            setData(updatedData);
        } catch (error) {
            console.error(error);
        }
    }

    const updateOficioTipo = async (id: string, tipo: tipoOficio) => {
        try {
            const response = await api.put(`/api/extrato/update/tipo/${id}/`, {
                tipo_do_oficio: tipo
            });

            const updatedData = data.map((item: CVLDResultProps) => {
                if (item.id === id) {
                    return {
                        ...item,
                        tipo_do_oficio: response.data.tipo_do_oficio
                    }
                }

                return item;
            });

            setData(updatedData);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <Flowbite theme={{ theme: customTheme }}>
                <Table hoverable className="">
                    <TableHead>
                        <TableHeadCell className="text-center w-[120px]">Oficio</TableHeadCell>
                        <TableHeadCell className="text-center">Nome do Credor</TableHeadCell>
                        <TableHeadCell className="text-center w-[180px]">Valor Líquido</TableHeadCell>
                        <TableHeadCell className="text-center w-[100px]">Status</TableHeadCell>
                        <TableHeadCell className="text-center w-[120px]">
                            <span className="sr-only text-center">Tarefas</span>
                        </TableHeadCell>
                        <TableHeadCell className="text-center w-[40px]">
                            <span className="sr-only text-center">Detalhes</span>
                        </TableHeadCell>
                        <TableHeadCell className="text-center w-[40px]">
                            <span className="sr-only text-center ">Detalhes</span>
                        </TableHeadCell>
                    </TableHead>
                    <TableBody>
                        {data?.length > 0 && (
                            <>
                                {data.map((item: CVLDResultProps) => (

                                    <TableRow key={item.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <TableCell className="text-center whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            <Badge color="indigo" size="sm" className="max-w-full text-[12px]">
                                                <select className="text-[12px] bg-transparent border-none py-0" onChange={(e) => updateOficioTipo(item.id, e.target.value as tipoOficio)}>
                                                    {
                                                        item.tipo_do_oficio && (
                                                            <option value={item.tipo_do_oficio} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                {item.tipo_do_oficio}
                                                            </option>
                                                        )
                                                    }
                                                    {enumTipoOficiosList.filter((status) => status !== item.tipo_do_oficio).map((status) => (
                                                        <option key={status} value={status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center font-semibold text-[12px]">{item?.credor || ""}</TableCell>
                                        <TableCell className="text-center font-semibold text-[12px]">{numberFormat(item.valor_liquido_disponivel)}</TableCell>
                                        <TableCell className="text-center items-center">
                                            <Badge color="teal" size="sm" className="max-w-max text-center text-[12px]">
                                            <select className="text-[12px] bg-transparent border-none py-0" onChange={(e) => updateOficioStatus(item.id, e.target.value as statusOficio)}>
                                                {
                                                    item.status && (
                                                        <option value={item.status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                            {item.status}
                                                        </option>
                                                    )
                                                }
                                                {enumOficiosList.filter((status) => status !== item.status).map((status) => (
                                                    <option key={status} value={status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                        {status}
                                                    </option>
                                                ))}

                                            </select>
                                            </Badge>


                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge onClick={
                                                () => setOpenTaskDrawer(true)
                                            } size="sm" color="yellow" className="hover:bg-yellow-200 dark:hover:bg-yellow-400 transition-all duration-300 justify-center px-2 py-1">
                                                <div className="flex flex-row w-full justify-between align-middle gap-2">
                                                    <span className="text-[12px] font-bold
                                                     text-yellow-700 dark:text-gray-400">
                                                        TAREFAS
                                                    </span>
                                                    <BiTask className="text-green-700 hover:text-green-950 dark:text-prussianBlue dark:hover:text-stone-300 h-4 w-4 self-center transition-all duration-300" />
                                                </div>
                                            </Badge>

                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge color="blue" size="sm" style={{
                                                cursor: loading ? 'wait' : 'pointer'
                                            }} onClick={() => {
                                                setOpenDrawer(true);
                                                fetchDataById(item.id);
                                            }} className="border-none transition-all duration-300 text-primary font-medium hover:text-blue-500 dark:hover:text-white dark:text-blue-500 border border-blue-500 hover:border-transparent">
                                            <div className="flex flex-row w-full justify-between align-middle gap-2">
                                                <span className="text-[12px] font-bold">
                                                    DETALHES
                                                </span>
                                                <BiPlus className="text-blue-500 dark:text-blue-500 h-4 w-4 self-center" />
                                            </div>
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {showModalMessage ? (
                                                <button onClick={() => setModalOptions({
                                                    open: true,
                                                    extractId: item.id
                                                })} className="bg-transparent border-none flex transition-all duration-300 hover:bg-red-500 text-red-500 hover:text-white dark:hover:text-white dark:text-red-500 dark:hover:bg-red-500">
                                                    <BsFillTrashFill className="text-meta-1 hover:text-meta-7 dark:text-white dark:hover:text-stone-300 h-4 w-4 self-center" style={{ cursor: loading ? 'wait' : 'pointer' }} />
                                                </button>
                                            ) : (
                                                <button onClick={() => fetchDelete(item.id)} className="bg-transparent border-none flex transition-all duration-300 hover:bg-red-500 text-red-500 hover:text-white dark:hover:text-white dark:text-red-500 dark:hover:bg-red-500" style={{ cursor: loading ? 'wait' : 'pointer' }}>
                                                    <BsFillTrashFill className="text-meta-1 hover:text-meta-7 dark:text-white dark:hover:text-stone-300 h-4 w-4 self-center" />
                                                </button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </Flowbite>
            <TaskDrawer open={openTaskDrawer} setOpen={setOpenTaskDrawer} />
            {data?.length === 0 && (
                <p className="text-center py-5 bg-white dark:bg-boxdark rounded-b-sm">
                    Não há registros para exibir
                </p>
            )}
        </div>
    )
}

export default TableView