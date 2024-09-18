import numberFormat from "@/functions/formaters/numberFormat";
import React, { useContext, useRef, useState } from 'react';
import { BiCheck, BiEditAlt, BiListUl, BiLoader, BiX } from 'react-icons/bi';
import { CVLDResultProps } from '@/interfaces/IResultCVLD';
import { Badge } from "flowbite-react";
import statusOficio from "@/enums/statusOficio.enum";
import tipoOficio from "@/enums/tipoOficio.enum";
import useUpdateOficio from "@/hooks/useUpdateOficio";
import MarvelousPagination from "../MarvelousPagination";
import api from "@/utils/api";
import { ImSpinner2 } from "react-icons/im";
import { ExtratosTableContext } from "@/context/ExtratosTableContext";

const CardView = ({ count }: { count: number }) => {

    const {
        data, loading, setLoading,
        editableLabel, setEditableLabel,
        handleOficio, handleStatus,
        fetchDataById, setOpenDetailsDrawer, onPageChange,
        currentPage, setCurrentPage, callScrollTop,
        handleSelectRow, checkedList, updateCreditorName
    } = useContext(ExtratosTableContext);

    const enumOficiosList = Object.values(statusOficio);
    const enumTipoOficiosList = Object.values(tipoOficio);
    const [editLabelState, setEditLabelState] = useState<string>('');

    // page refs
    const inputRefs = useRef<HTMLTextAreaElement[] | null>([]);

    const handleEditInput = (index: number) => {
        if (inputRefs.current) {
            inputRefs.current[index].focus();
        }
    }

    const handleChangeCreditorName = async (index: number, id: string, value: string) => {

        setLoading(true);
        await updateCreditorName(id, value);
        inputRefs.current![index].blur();
        setLoading(false);
    }

    return (
        <><div>
            <div
                className="grid grid-cols-3 gap-4">

                {data.results?.length > 0 ? (
                    <>
                        {data.results.map((item: CVLDResultProps, index: number) => (
                            <div id={item.id} key={item.id} className={`${checkedList!.some(target => target.id === item.id) && '!border-blue-400'} relative flex flex-col justify-between xsm:col-span-3 md:col-span-2 xl:col-span-1 bg-white border border-stroke shadow-3 gap-5 p-4 rounded-md dark:bg-black/20 dark:border-slate-600`}>
                                <div className="relative h-29">
                                    <div className="absolute flex flex-col items-center top-2 right-0">
                                        <input
                                            type="checkbox"
                                            checked={checkedList!.some(target => target.id === item.id)}
                                            className={`w-[15px] h-[15px] bg-transparent focus-within:ring-0 selection:ring-0 duration-100 border-2 border-body dark:border-bodydark rounded-[3px] cursor-pointer`}
                                            onChange={() => handleSelectRow(item)}
                                        />
                                        <div className="relative mt-1.5 flex flex-col items-center justify-center pt-1.5 border-t border-stroke dark:border-form-strokedark">
                                            <BiEditAlt
                                                title="Editar Credor"
                                                onClick={
                                                    () => {
                                                        // setEditableLabel(item.id)
                                                        handleEditInput(index);
                                                    }
                                                }
                                                // className={`${editableLabel === item.id ? 'opacity-0 invisible duration-500' : 'opacity-100 visible duration-1000'} absolute top-0 mt-1.5 z-2 text-xl hover:opacity-80 dark:hover:text-white cursor-pointer transition-all `}
                                            />

                                            {/* {loading ? <ImSpinner2 className={`${editableLabel === item.id ? 'opacity-100 visible animate-spin' : 'opacity-0 invisible'} text-2xl`} /> :
                                                <BiCheck
                                                    title="Confirmar Edição"
                                                    onClick={(e) => {
                                                        const target = e.target as HTMLElement;
                                                        const value = target.parentElement?.parentElement?.parentElement?.parentElement?.querySelector('textarea')?.value as string;
                                                        handleChangeCreditorName(index, item.id, value);
                                                    }}
                                                    className={`${editableLabel === item.id ? 'opacity-100 visible duration-1000' : 'opacity-0 invisible'} ${editLabelState === 'success' && 'text-green-500'} text-2xl hover:opacity-80 dark:hover:text-white cursor-pointer transition-all`}
                                                />
                                            } */}

                                            {/* <BiX
                                                title="Cancelar Edição"
                                                onClick={() => {
                                                    setEditableLabel(null);
                                                    setEditLabelState('');
                                                }} className={`${editableLabel === item.id ? 'opacity-100 visible translate-y-7 duration-1000' : 'opacity-0 invisible translate-y-0 rotate-90 duration-200'} ${editLabelState === 'error' && 'text-meta-1'} absolute top-0 mt-1.5 z-1 text-2xl hover:opacity-80 dark:hover:text-white cursor-pointer transition-all`} /> */}
                                        </div>
                                    </div>
                                    <div className="relative w-55 h-22">

                                        {/* {editableLabel !== item.id && <div
                                            title={item?.credor || "NOME NÃO INFORMADO"}
                                            className="absolute inset-0 bg-transparent"></div>} */}

                                        <textarea
                                            title={item?.credor || "NOME NÃO INFORMADO"}
                                            ref={(input) => { if (input) inputRefs.current![index] = input }}
                                            defaultValue={
                                                item?.credor?.length >= 45 ? item?.credor?.slice(0, 45) + ' ...' : item?.credor || "NOME NÃO INFORMADO"}
                                            className="w-55 h-22 bg-transparent px-0 dark:text-white font-semibold border-none rounded-md overflow-hidden resize-none"
                                        />
                                    </div>

                                    <p className="font-medium">
                                        {numberFormat(item.valor_liquido_disponivel)}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <div>
                                        <p className="text-[10px]">TIPO</p>
                                        <Badge color="indigo" size="sm" className="w-fit text-[10px]">
                                            <select className="text-[10px] w-full bg-transparent border-none py-0 !pl-2 !pr-8" onChange={(e) => handleOficio(item.id, e.target.value as tipoOficio)}>
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
                                    </div>
                                    <div>
                                        <p className="text-[10px]">STATUS</p>
                                        <Badge color="teal" size="sm" className="max-w-max text-center text-[10px]">
                                            <select className="text-[10px] w-full bg-transparent border-none py-0 !pl-2 !pr-8 uppercase" onChange={(e) => handleStatus(item.id, e.target.value as statusOficio)}>
                                                {item.status && (
                                                    <option value={item.status} className="text-[12px] bg-transparent border-none font-bold">
                                                        {item.status}
                                                    </option>
                                                )}
                                                {enumOficiosList.filter((status) => status !== item.status).map((status) => (
                                                    <option key={status} value={status} className="text-[12px] bg-transparent border-none font-bold">
                                                        {status}
                                                    </option>
                                                ))}

                                            </select>
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex w-full gap-4 justify-center">
                                    <button onClick={() => {
                                        setOpenDetailsDrawer(true);
                                        fetchDataById(item.id)
                                    }} className="w-full flex flex-1 gap-2 max-h-9 items-center justify-center py-2 px-6 border border-blue-700 text-blue-700 rounded-md hover:bg-blue-800 hover:!border-blue-800 dark:border-snow dark:text-snow hover:text-snow hover:-translate-y-1 transition- duration-300">
                                        <span className="text-sm font-medium">DETALHES</span>
                                        <BiListUl className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <p className="text-center py-5 bg-white dark:bg-boxdark rounded-b-sm">
                        Não há registros para exibir
                    </p>
                )}
            </div>
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
                                <span className='text-sm mr-2'>Buscando informações </span><BiLoader className="animate-spin h-5 w-5" />
                            </div>
                        </div>
                    }

                    <MarvelousPagination counter={count} page_size={20} currentPage={currentPage} onPageChange={onPageChange} setCurrentPage={setCurrentPage} callScrollTop={callScrollTop} loading={loading} />
                </div>
            </div></>
    )
}

export default CardView