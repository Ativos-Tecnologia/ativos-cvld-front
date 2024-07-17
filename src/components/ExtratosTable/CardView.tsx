import numberFormat from "@/functions/formaters/numberFormat";
import { ExtractTableProps } from '@/types/extractTable';
import React from 'react';
import { BiListUl, BiTask } from 'react-icons/bi';
import { CVLDResultProps } from '@/interfaces/IResultCVLD';
import { BsFillTrashFill } from 'react-icons/bs';
import { Badge } from "flowbite-react";
import statusOficio from "@/enums/statusOficio.enum";
import tipoOficio from "@/enums/tipoOficio.enum";
import useUpdateOficio from "@/hooks/useUpdateOficio";

const CardView = ({ className, data, showModalMessage, loading, setData, setModalOptions, fetchDelete, setOpenDetailsDrawer, setOpenTaskDrawer, setExtractId, fetchDataById }: ExtractTableProps) => {

    const enumOficiosList = Object.values(statusOficio);
    const enumTipoOficiosList = Object.values(tipoOficio);

    const { updateOficioStatus, updateOficioTipo } = useUpdateOficio(data, setData);

    const handleTask = (id: string) => {
        setOpenTaskDrawer(true);
        setExtractId(id);
    }

    return (
        <div className={className}>
            <div className="flex gap-4 flex-wrap">

                {data.results?.length > 0 ? (
                    <>
                        {data.results.map((item: CVLDResultProps) => (
                            <div key={item.id} className="relative flex-1 flex flex-col justify-between xsm:w-full md:max-w-[332px] lg:max-w-[305px] xl:max-w-90 bg-white border border-stroke shadow-3 gap-5 p-4 rounded-md dark:bg-black/60 dark:border-slate-600">
                                <div className="absolute top-6 right-4">
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
                                </div>
                                <div className="h-29">
                                    <h4 className="max-w-55 max-h-21 text-xl overflow-hidden dark:text-snow font-semibold mb-2">
                                        {item?.credor || "NOME NÃO INFORMADO"}
                                        {item.credor && item?.credor.length >= 55 && ' ...'}
                                    </h4>
                                    <p>
                                        {numberFormat(item.valor_liquido_disponivel)}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <div>
                                        <p className="text-[10px]">TIPO</p>
                                        <Badge color="indigo" size="sm" className="w-fit text-[10px]">
                                            <select className="text-[10px] w-full bg-transparent border-none py-0 !pl-2 !pr-8" onChange={(e) => updateOficioTipo(item.id, e.target.value as tipoOficio)}>
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
                                    </div>
                                    <div>
                                        <p className="text-[10px]">STATUS</p>
                                        <Badge color="teal" size="sm" className="max-w-max text-center text-[10px]">
                                            <select className="text-[10px] w-full bg-transparent border-none py-0 !pl-2 !pr-8" onChange={(e) => updateOficioStatus(item.id, e.target.value as statusOficio)}>
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
                                    </div>
                                </div>
                                <div className="flex w-full gap-4 justify-center">
                                    <button onClick={() => handleTask(item.id)} className="flex flex-1 gap-2 max-h-9 items-center justify-center py-2 px-6 border border-blue-700 text-blue-700 rounded-md hover:bg-blue-800 hover:border-blue-800 hover:text-snow hover:-translate-y-1 transition-all duration-300">
                                        <span className="text-sm font-medium">TAREFA</span>
                                        <BiTask className="w-4 h-4" />
                                    </button>
                                    {/* <button className="flex flex-1 gap-2 max-h-9 items-center justify-center py-2 px-6 bg-[#4dbce9] text-black rounded-md hover:bg-[#26ade4] hover:text-snow transition-all duration-200">
                                        <span className="text-sm font-medium">TAREFA</span>
                                        <BiTask className="w-4 h-4" />
                                    </button> */}
                                    <button onClick={() => {
                                        setOpenDetailsDrawer(true);
                                        fetchDataById(item.id);
                                    }} className="flex flex-1 gap-2 max-h-9 items-center justify-center py-2 px-6 border border-blue-700 text-blue-700 rounded-md hover:bg-blue-800 hover:border-blue-800 hover:text-snow hover:-translate-y-1 transition-all duration-300">
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
        </div>
    )
}

export default CardView