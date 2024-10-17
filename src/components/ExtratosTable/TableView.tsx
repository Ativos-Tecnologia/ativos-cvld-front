import { Badge, CustomFlowbiteTheme, Flowbite, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import numberFormat from "@/functions/formaters/numberFormat";
import React, { useContext, useRef } from 'react';
import { BiLoader, BiSolidDockLeft } from 'react-icons/bi';
import { LiaCoinsSolid } from "react-icons/lia";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiCursorClick } from "react-icons/pi";
import { CVLDResultProps } from '@/interfaces/IResultCVLD';
import statusOficio from '@/enums/statusOficio.enum';
import tipoOficio from '@/enums/tipoOficio.enum';
import MarvelousPagination from '../MarvelousPagination';
import { ImCopy } from 'react-icons/im';
import { ENUM_OFICIOS_LIST, ENUM_TIPO_OFICIOS_LIST } from '@/constants/constants';
import { AiOutlineUser } from 'react-icons/ai';
import { toast } from 'sonner';
import { ExtratosTableContext } from '@/context/ExtratosTableContext';
import { RiNotionFill } from 'react-icons/ri';

const customTheme: CustomFlowbiteTheme = {
    table: {
        root: {
            base: "relative w-full text-left text-sm",
            shadow: "absolute left-0 top-0 -z-10 h-full w-full rounded-sm bg-white drop-shadow-md dark:bg-black",
            wrapper: "relative"
        },
        body: {
            base: "group/body",
            cell: {
                base: "px-3 py-1.5 bg-transparent dark:bg-transparent group-first/body:group-first/row:first:rounded-tl-sm group-first/body:group-first/row:last:rounded-tr-sm group-last/body:group-last/row:first:rounded-bl-sm group-last/body:group-last/row:last:rounded-br-sm"
            }
        },
        head: {
            base: "group/head text-xs uppercase text-gray-700",
            cell: {
                base: "bg-zinc-200 text-black px-4 py-3 group-first/head:first:rounded-tl-sm group-first/head:last:rounded-tr-sm dark:bg-meta-4 dark:text-white"
            }
        },
        row: {
            base: "group/row",
            hovered: "hover:bg-slate-50 dark:hover:bg-slate-50",
            striped: "odd:bg-white even:bg-green-300 odd:dark:bg-white even:dark:bg-snow"
        }
    }
}

const TableView = ({ count }: { count: number }) => {
    const {
        data, fetchDataById,
        loading, setOpenDetailsDrawer,
        handleOficio, handleStatus,
        onPageChange, currentPage, setCurrentPage,
        callScrollTop, editableLabel, setEditableLabel,
        handleSelectRow, checkedList, updateCreditorName,
    } = useContext(ExtratosTableContext);

    // refs
    const inputRefs = useRef<HTMLInputElement[] | null>([]);

    const handleCopyValue = (index: number) => {

        navigator.clipboard.writeText(numberFormat(data.results[index].valor_liquido_disponivel));

        toast("Valor copiado para área de transferência.", {
            classNames: {
                toast: "dark:bg-form-strokedark",
                title: "dark:text-snow",
                description: "dark:text-snow",
                actionButton: "!bg-slate-100 dark:bg-form-strokedark"
            },
            action: {
                label: "Fechar",
                onClick: () => {}
            }
        })
    }

    const handleEditInput = (index: number) => {
        if (inputRefs.current) {
            inputRefs.current[index].focus();
        }
    }

    const handleChangeCreditorName = async (id: string, value: string, index: number, page_id?: string) => {

        inputRefs.current![index].blur();
        await updateCreditorName(id, value, page_id);

    }

    return (
        <><div className='relative'>

            <Flowbite theme={{ theme: customTheme }}>
                <Table>
                    <TableHead>
                        {/* <TableHeadCell className="text-center w-10 px-1">
                            <span className="sr-only text-center ">Checkbox</span>
                        </TableHeadCell> */}
                        <TableHeadCell className="w-[120px]">
                            <div className='flex gap-2 items-center'>
                                <IoDocumentTextOutline className='text-base' />
                                Oficio
                            </div>
                        </TableHeadCell>
                        <TableHeadCell>
                            <div className='flex gap-2 items-center'>
                                <AiOutlineUser className='text-base' />
                                Nome do Credor
                            </div>
                        </TableHeadCell>
                        <TableHeadCell className="w-[180px]">
                            <div className="flex gap-2 items-center">
                                <LiaCoinsSolid className='text-base' />
                                Valor Líquido
                            </div>
                        </TableHeadCell>
                        <TableHeadCell className="w-[0px]">
                            <div className="flex gap-2 items-center">
                                <BiLoader className='text-base' />
                                Status
                            </div>
                        </TableHeadCell>
                        {/* <TableHeadCell className="text-center w-[120px]">
                            <span className="sr-only text-center">Tarefas</span>
                        </TableHeadCell> */}
                        {/* <TableHeadCell className="text-center w-[40px]">
                            <span className="sr-only text-center">Detalhes</span>
                        </TableHeadCell> */}
                    </TableHead>
                    <TableBody className=''>

                        {data.results?.length > 0 && (
                            <>
                                {data.results.map((item: CVLDResultProps, index: number) => (

                                    <TableRow key={item.id} className={`${checkedList!.some(target => target.id === item.id) && 'bg-blue-50 dark:bg-form-strokedark'} hover:shadow-3 dark:hover:shadow-body group`}>

                                        {/* <TableCell className="px-1 text-center ">
                                            <input
                                                type="checkbox"
                                                checked={checkedList!.includes(item.id)}
                                                className={`opacity-50 w-[15px] group-hover:opacity-100 ${checkedList!.includes(item.id) && '!opacity-100'} h-[15px] bg-transparent focus-within:ring-0 selection:ring-0 duration-100 border-2 border-body dark:border-bodydark rounded-[3px] cursor-pointer`}
                                                onChange={() => handleSelectRow(item.id)}
                                            />
                                        </TableCell> */}

                                        <TableCell className="text-center whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            <div className='flex items-center justify-center gap-3'>
                                                <input
                                                    type="checkbox"
                                                    checked={checkedList!.some(target => target.id === item.id)}
                                                    className={`opacity-50 w-[15px] group-hover:opacity-100 ${checkedList!.some(target => target.id === item.id) && '!opacity-100'} h-[15px] bg-transparent focus-within:ring-0 selection:ring-0 duration-100 border-2 border-body dark:border-bodydark rounded-[3px] cursor-pointer`}
                                                    onChange={() => handleSelectRow(item)}
                                                />
                                                <Badge color="indigo" size="sm" className="max-w-full text-[12px]">
                                                    <select className="text-[12px] bg-transparent border-none py-0 focus-within:ring-0" onChange={(e) => handleOficio(item.id, e.target.value as tipoOficio, item.notion_link?.slice(-32))}>
                                                        {item.tipo_do_oficio && (
                                                            <option value={item.tipo_do_oficio} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                {item.tipo_do_oficio}
                                                            </option>
                                                        )}
                                                        {ENUM_TIPO_OFICIOS_LIST.filter((status) => status !== item.tipo_do_oficio).map((status) => (
                                                            <option key={status} value={status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell title={item?.credor || ''}
                                            className="relative h-full  flex items-center gap-2 font-semibold text-[12px]"
                                        >
                                            {/* <input
                                                type="text"
                                                ref={(input) => { if (input) inputRefs.current![index] = input; }}
                                                defaultValue={item?.credor || ''}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                        handleChangeCreditorName(item.id, e.currentTarget.value, index, item.notion_link?.slice(-32))
                                                    }
                                                }}
                                                onBlur={(e) => handleChangeCreditorName(item.id, e.currentTarget.value, index, item.notion_link?.slice(-32))}
                                                className={`${editableLabel === item.id && '!border-1 !border-blue-700'} w-full pl-1 focus-within:ring-0 text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                            /> */}

                                            {/* =====> confirm edition old button <===== */}

                                            {/* <div title='Confirmar Edição' className={`${editableLabel === item.id ? 'opacity-100 visible' : 'opacity-0 invisible'} ${editLabelState === 'success' && 'animate-jump !bg-green-500 !text-white'} ${editLabelState === 'error' && 'animate-jump !bg-meta-1 !text-white'} w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 transition-all duration-500 cursor-pointer group`}>
                                                {isLoading ?
                                                    <ImSpinner2 className={`${editableLabel === item.id ? 'opacity-100 visible animate-spin' : 'opacity-0 invisible'} text-2xl`}
                                                    /> :

                                                    <>
                                                        {editLabelState === '' &&
                                                            <BiCheck onClick={(e) => {
                                                                const target = e.target as HTMLElement;
                                                                const value = target.parentElement?.parentElement?.querySelector("input")?.value as string;
                                                                handleChangeCreditorName(index, item.id, value);
                                                            }}
                                                                className='text-2xl group-hover:text-black dark:group-hover:text-white transition-all duration-200' />}
                                                        {editLabelState === 'success' &&
                                                            <BiCheck className='text-2xl' />}
                                                        {editLabelState === 'error' &&
                                                            <BiX className='text-2xl' />}
                                                    </>
                                                }
                                            </div> */}
                                            {/* ====> end confirm old button <==== */}


                                            {/* absolute div that covers the entire cell */}
                                            {/* {editableLabel !== item.id && (
                                                <div className='absolute inset-0 rounded-md flex items-center transition-all duration-200'>

                                                    {editableLabel === null && (
                                                        <React.Fragment>
                                                            <div className='flex-1 h-full flex items-center select-none cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200'
                                                                onClick={() => {
                                                                    setEditableLabel!(item.id)
                                                                    handleEditInput(index);
                                                                }}>
                                                                {item?.credor?.length === 0 && (
                                                                    <div className='flex gap-1 pl-4 text-slate-400'>
                                                                        <PiCursorClick className='text-base' />
                                                                        <span>Clique para adicionar nome</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div
                                                                title='Abrir'
                                                                className='py-1 px-2 mr-1 flex items-center justify-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                                                                onClick={() => {
                                                                    setOpenDetailsDrawer(true);
                                                                    fetchDataById(item.id);
                                                                }}>
                                                                <BiSolidDockLeft className='text-lg'
                                                                />
                                                                <span className='text-xs'>Abrir</span>
                                                            </div>
                                                            {item.notion_link && (
                                                            <a  href={item.notion_link} target='_blank' rel='referrer'
                                                                title='Abrir no Notion'
                                                                className='py-1 px-2 mr-1 flex items-center justify-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                                                                >
                                                                <RiNotionFill className='text-lg'
                                                                />
                                                                <span className='text-xs'>Notion</span>
                                                            </a>)}

                                                        </React.Fragment>
                                                    )}
                                                </div>
                                            )} */}

                                        </TableCell>
                                        <TableCell className=" font-semibold text-[14px]">
                                            <div className="relative">
                                                {numberFormat(item.valor_liquido_disponivel)}
                                                <ImCopy
                                                    title='Copiar valor'
                                                    onClick={() => handleCopyValue(index)}
                                                    className='absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center items-center ">
                                            <Badge color="teal" size="sm" className="text-center text-[12px]">
                                                <select className="text-[12px] w-44 text-ellipsis overflow-x-hidden whitespace-nowrap bg-transparent border-none py-0 focus-within:ring-0 uppercase" onChange={(e) => handleStatus(item.id, e.target.value as statusOficio, item.notion_link?.slice(-32))}>
                                                    {item.status && (
                                                        <option value={item.status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                            {item.status}
                                                        </option>
                                                    )}
                                                    {ENUM_OFICIOS_LIST.filter((status) => status !== item.status).map((status) => (
                                                        <option key={status} value={status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                            {status}
                                                        </option>
                                                    ))}

                                                </select>
                                            </Badge>
                                        </TableCell>
                                        {/* <TableCell className="text-center">
                                            <Badge onClick={() => handleTask(item.id)} size="sm" color="yellow" className="hover:bg-yellow-200 dark:hover:bg-yellow-300 transition-all duration-300 justify-center px-2 py-1 cursor-pointer">
                                                <div className="flex flex-row w-full justify-between align-middle gap-2">
                                                    <span className="text-[12px] font-bold transition-all duration-200">
                                                        TAREFAS
                                                    </span>
                                                    <BiTask className="h-4 w-4 self-center transition-all duration-200" />
                                                </div>
                                            </Badge>

                                        </TableCell> */}
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

                                        {/* <TableCell className="text-center ">
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
                                        </TableCell> */}

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

                    <MarvelousPagination counter={count} page_size={20} currentPage={currentPage} onPageChange={onPageChange} setCurrentPage={setCurrentPage} callScrollTop={callScrollTop} loading={loading} />
                </div>
            </div></>
    )
}

export default TableView