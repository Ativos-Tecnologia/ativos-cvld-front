import { Badge, CustomFlowbiteTheme, Flowbite, Pagination, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import numberFormat from "@/functions/formaters/numberFormat";
import { ExtractTableProps } from '@/types/extractTable';
import React, { useState } from 'react';
import { BiListUl, BiPlug, BiPlus, BiSolidDockLeft, BiTask } from 'react-icons/bi';
import { CVLDResultProps } from '@/interfaces/IResultCVLD';
import { BsFillTrashFill } from 'react-icons/bs';
import statusOficio from '@/enums/statusOficio.enum';
import tipoOficio from '@/enums/tipoOficio.enum';
import api from '@/utils/api';
import { TaskDrawer } from '../TaskElements';
import useUpdateOficio from '@/hooks/useUpdateOficio';
import MarvelousPagination from '../MarvelousPagination';

const customTheme: CustomFlowbiteTheme = {
    table: {
        root: {
            base: "w-full text-left text-sm",
            shadow: "absolute left-0 top-0 -z-10 h-full w-full rounded-sm bg-white drop-shadow-md dark:bg-black",
            wrapper: "relative"
        },
        body: {
            base: "group/body",
            cell: {
                base: "px-4 py-3 group-first/body:group-first/row:first:rounded-tl-sm group-first/body:group-first/row:last:rounded-tr-sm group-last/body:group-last/row:first:rounded-bl-sm group-last/body:group-last/row:last:rounded-br-sm dark:bg-boxdark"
            }
        },
        head: {
            base: "group/head text-xs uppercase text-gray-700 dark:text-gray-400",
            cell: {
                base: "bg-zinc-200 text-black px-4 py-3 group-first/head:first:rounded-tl-sm group-first/head:last:rounded-tr-sm dark:bg-meta-4 dark:text-white dark:border-b dark:border-strokedark"
            }
        },
        row: {
            base: "group/row",
            hovered: "hover:bg-red dark:hover:bg-gray-600",
            striped: "odd:bg-white even:bg-green-300 odd:dark:bg-gray-800 even:dark:bg-gray-700"
        }
    }
}

const TableView = ({ data, showModalMessage, loading, setData, setModalOptions, fetchDelete, setOpenDetailsDrawer, setOpenTaskDrawer, setExtractId, fetchDataById, count, onPageChange, currentPage, setCurrentPage }: ExtractTableProps) => {
    const enumOficiosList = Object.values(statusOficio);
    const enumTipoOficiosList = Object.values(tipoOficio);

    const { updateOficioStatus, updateOficioTipo } = useUpdateOficio(data, setData);
    const [editableLabel, setEditableLabel] = useState<string | null>(null);

    const handleTask = (id: string) => {
        setOpenTaskDrawer(true);
        setExtractId(id);
    }

    return (
        <><div className=''>
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
                        {/* <TableHeadCell className="text-center w-[40px]">
                            <span className="sr-only text-center">Detalhes</span>
                        </TableHeadCell> */}
                        <TableHeadCell className="text-center w-[40px]">
                            <span className="sr-only text-center ">Deletar</span>
                        </TableHeadCell>
                    </TableHead>
                    <TableBody className='max-h-[200px] overflow-x-scroll'>
                        {data.results?.length > 0 && (
                            <>
                                {data.results.map((item: CVLDResultProps) => (

                                    <TableRow key={item.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-stroke dark:border-form-strokedark">
                                        <TableCell className="text-center whitespace-nowrap font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <Badge color="indigo" size="sm" className="max-w-full text-[12px]">
                                                <select className="text-[12px] bg-transparent border-none py-0" onChange={(e) => updateOficioTipo(item.id, e.target.value as tipoOficio)}>
                                                    {item.tipo_do_oficio && (
                                                        <option value={item.tipo_do_oficio} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                            {item.tipo_do_oficio}
                                                        </option>
                                                    )}
                                                    {enumTipoOficiosList.filter((status) => status !== item.tipo_do_oficio).map((status) => (
                                                        <option key={status} value={status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                            {status}
                                                        </option>
                                                    ))}
                                                </select>
                                            </Badge>
                                        </TableCell>
                                        <TableCell title={item?.credor || 'NOME NÃO INFORMADO'} className="relative h-full flex font-semibold text-[12px]">
                                            <input
                                                type="text"
                                                defaultValue={item?.credor || ''}
                                                className={`${editableLabel === item.id && '!border-2 !border-blue-700'} w-11/12 text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                            />

                                            <div className='w-1/12'></div>

                                            {/* absolute div that covers the entire cell */}
                                            {editableLabel !== item.id && (
                                                <div className='absolute inset-0 rounded-md flex items-center cursor-pointer transition-all duration-200 group'>

                                                    <div className='flex-1 h-full'
                                                        onClick={() => setEditableLabel(item.id)}></div>

                                                    <div 
                                                        title='Detalhes' 
                                                        className='py-1 px-2 flex items-center justify-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-200'
                                                        onClick={() => {
                                                            setOpenDetailsDrawer(true);
                                                            fetchDataById(item.id);
                                                        }}>
                                                        <BiSolidDockLeft className='text-lg cursor-pointer'
                                                        />
                                                        <span className='text-xs'>Detalhes</span>
                                                    </div>
                                                </div>
                                            )}

                                        </TableCell>
                                        <TableCell className="text-center font-semibold text-[12px]">{numberFormat(item.valor_liquido_disponivel)}</TableCell>
                                        <TableCell className="text-center items-center">
                                            <Badge color="teal" size="sm" className="max-w-max text-center text-[12px]">
                                                <select className="text-[12px] bg-transparent border-none py-0" onChange={(e) => updateOficioStatus(item.id, e.target.value as statusOficio)}>
                                                    {item.status && (
                                                        <option value={item.status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                            {item.status}
                                                        </option>
                                                    )}
                                                    {enumOficiosList.filter((status) => status !== item.status).map((status) => (
                                                        <option key={status} value={status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                            {status}
                                                        </option>
                                                    ))}

                                                </select>
                                            </Badge>


                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge onClick={() => handleTask(item.id)} size="sm" color="yellow" className="hover:bg-yellow-200 dark:hover:bg-yellow-300 transition-all duration-300 justify-center px-2 py-1 cursor-pointer group">
                                                <div className="flex flex-row w-full justify-between align-middle gap-2">
                                                    <span className="text-[12px] font-bold transition-all duration-200">
                                                        TAREFAS
                                                    </span>
                                                    <BiTask className="h-4 w-4 self-center transition-all duration-200" />
                                                </div>
                                            </Badge>

                                        </TableCell>
                                        {/* <TableCell className="text-center">
                                            <Badge color="blue" size="sm" style={{
                                                cursor: loading ? 'wait' : 'pointer'
                                            }} onClick={() => {
                                                setOpenDetailsDrawer(true);
                                                fetchDataById(item.id);
                                            }} className="border-none transition-all duration-300 text-blue-700 font-medium px-2 py-1 hover:bg-blue-200 dark:hover:bg-blue-400 group">
                                                <div className="flex flex-row w-full justify-between align-middle gap-2">
                                                    <span className="text-[12px] font-bold">
                                                        DETALHES
                                                    </span>
                                                    <BiPlus className="h-4 w-4 self-center" />
                                                </div>
                                            </Badge>
                                        </TableCell> */}
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
            {/* <TaskDrawer open={openTaskDrawer} setOpen={setOpenTaskDrawer} id={extratoId} /> */}
            {data.results?.length === 0 && (
                <p className="text-center py-5 bg-white dark:bg-boxdark rounded-b-sm">
                    Não há registros para exibir
                </p>
            )}
        </div><div className="flex overflow-x-auto sm:justify-center">
                {/* <Pagination
      layout="pagination"
      currentPage={currentPage}
      totalPages={count}
      onPageChange={(page) => {
          setCurrentPage(page);
          onPageChange(page);
          }}
      previousLabel="Go back"
      nextLabel="Go forward"
      showIcons
    /> */}

                <MarvelousPagination counter={count} page_size={20} currentPage={currentPage} onPageChange={onPageChange} setCurrentPage={setCurrentPage} />
            </div></>
    )
}

export default TableView