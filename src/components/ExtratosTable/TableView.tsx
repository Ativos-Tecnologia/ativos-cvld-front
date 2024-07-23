import { Badge, CustomFlowbiteTheme, Flowbite, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import numberFormat from "@/functions/formaters/numberFormat";
import { ExtractTableProps } from '@/types/extractTable';
import React, { useRef, useState } from 'react';
import { BiCheck, BiLoader, BiSolidDockLeft, BiTask, BiX } from 'react-icons/bi';
import { CVLDResultProps } from '@/interfaces/IResultCVLD';
import { BsFillTrashFill } from 'react-icons/bs';
import statusOficio from '@/enums/statusOficio.enum';
import tipoOficio from '@/enums/tipoOficio.enum';
import useUpdateOficio from '@/hooks/useUpdateOficio';
import MarvelousPagination from '../MarvelousPagination';
import Loader from '../common/Loader';
import api from '@/utils/api';
import { ImSpinner2 } from 'react-icons/im';

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
                base: "bg-zinc-200  text-black px-4 py-3 group-first/head:first:rounded-tl-sm group-first/head:last:rounded-tr-sm dark:bg-meta-4 dark:text-white dark:border-b dark:border-strokedark"
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
    const [editLabelState, setEditLabelState] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const inputRefs = useRef<HTMLInputElement[] | null>([]);

    const handleTask = (id: string) => {
        setOpenTaskDrawer(true);
        setExtractId(id);
    }

    const handleEditInput = (index: number) => {
        if (inputRefs.current) {
            inputRefs.current[index].focus();
        }
    }

    const handleChangeCreditorName = async (index: number, id: string, value: string) => {

        setIsLoading(true);
        await api.patch(`/api/extrato/update/credor/${id}/`, {
            credor: value
        }).then(response => {

            if (response.status === 200) {
                setEditLabelState('success');
                setTimeout(() => {
                    setEditableLabel(null);
                    setEditLabelState('');
                    inputRefs.current![index].blur();
                }, 1500);
            } else {
                setEditLabelState('error');
                setTimeout(() => {
                    setEditableLabel(null);
                    setEditLabelState('');
                    inputRefs.current![index].blur();
                }, 1500);
            }

        });
        setIsLoading(false);

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

                        {data.results?.length > 0 ? (
                            <>
                                {data.results.map((item: CVLDResultProps, index: number) => (

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
                                        <TableCell title={item?.credor || 'NOME NÃO INFORMADO'} className="relative h-full flex items-center gap-2 font-semibold text-[12px]">
                                            <input
                                                type="text"
                                                ref={(input) => { if (input) inputRefs.current![index] = input; }}
                                                defaultValue={item?.credor || ''}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleChangeCreditorName(index, item.id, e.currentTarget.value)
                                                    }
                                                }}
                                                className={`${editableLabel === item.id && '!border-1 !border-blue-700'} w-10/12 focus-within:ring-0 text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                            />

                                            <div title='Confirmar Edição' className={`${editableLabel === item.id ? 'opacity-100 visible' : 'opacity-0 invisible'} ${editLabelState === 'success' && 'animate-jump !bg-green-500 !text-white'} ${editLabelState === 'error' && 'animate-jump !bg-meta-1 !text-white'} w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-500 cursor-pointer group`}>
                                                {isLoading ?
                                                    <ImSpinner2 className={`${editableLabel === item.id ? 'opacity-100 visible animate-spin' : 'opacity-0 invisible'} text-2xl`}
                                                    /> :

                                                    <>
                                                        {editLabelState === '' && <BiCheck onClick={(e) => {
                                                            const target = e.target as HTMLElement;
                                                            const value = target.parentElement?.parentElement?.querySelector("input")?.value as string;
                                                            handleChangeCreditorName(index, item.id, value);
                                                        }} className='text-2xl group-hover:text-black dark:group-hover:text-white transition-all duration-200' />}
                                                        {editLabelState === 'success' && <BiCheck className='text-2xl' />}
                                                        {editLabelState === 'error' && <BiX className='text-2xl' />}
                                                    </>
                                                }
                                            </div>

                                            {/* absolute div that covers the entire cell */}
                                            {editableLabel !== item.id && (
                                                <div className='absolute inset-0 rounded-md flex items-center cursor-pointer transition-all duration-200 group'>

                                                    <div className='flex-1 h-full'
                                                        onClick={() => {
                                                            setEditableLabel(item.id)
                                                            handleEditInput(index);
                                                        }}></div>

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
                        ) : <Loader />}
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
                <div className='w-full flex-col justify-center items-center'>
                    {
                        <div className='w-full mt-4 h-4 flex justify-center items-center'>
                            <div className={`${loading ? "opacity-100 visible" : "opacity-0 invisible"} text-center flex justify-center items-center transition-all duration-300`}>
                                <span className='text-sm mr-2 text-meta-4'>
                                    Buscando informações
                                </span>
                                <BiLoader className="animate-spin h-5 w-5" />
                            </div>
                        </div>
                    }

                    <MarvelousPagination counter={count} page_size={20} currentPage={currentPage} onPageChange={onPageChange} setCurrentPage={setCurrentPage} loading={loading} />
                </div>
            </div></>
    )
}

export default TableView