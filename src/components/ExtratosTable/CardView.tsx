import numberFormat from "@/functions/formaters/numberFormat";
import { ExtractTableProps } from '@/types/extractTable';
import React from 'react';
import { BiListUl, BiTask } from 'react-icons/bi';
import { CVLDResultProps } from '@/interfaces/IResultCVLD';
import { BsFillTrashFill } from 'react-icons/bs';
import { Badge } from "flowbite-react";

const CardView = ({ className, data, showModalMessage, loading, setModalOptions, fetchDelete, setOpenDrawer, fetchDataById }: ExtractTableProps) => {
    return (
        <div className={className}>
            {data?.length > 0 ? (
                <>
                    {data.map((item: CVLDResultProps) => (
                        <div key={item.id} className="relative flex-1 xsm:w-full md:max-w-[332px] lg:max-w-[315px] xl:max-w-90 bg-white border border-stroke shadow-3 grid gap-5 p-4 rounded-md dark:bg-gray-900 dark:border-strokedark">
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
                            <div>
                                <h4 className="max-w-55 max-h-21 text-xl overflow-hidden dark:text-snow font-semibold mb-2">
                                    {item?.credor || "Nome não informado"}
                                    {item.credor &&item?.credor.length >= 55 && ' ...'}
                                </h4>
                                <p>
                                    {numberFormat(item.valor_liquido_disponivel)}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Badge color="indigo" size="sm" className="max-w-full text-[10px]">
                                    {item.tipo_do_oficio.toUpperCase()}
                                </Badge>
                                <Badge color="teal" size="sm" className="max-w-max text-center text-[10px]">
                                    {item.status}
                                </Badge>
                            </div>
                            <div className="flex gap-4 justify-center mt-3">
                                <button className="flex flex-1 gap-2 items-center justify-center py-2 px-6 bg-[#6afcbf] text-black rounded-md hover:shadow-2 hover:shadow-[#6afcbf] transition-all duration-200">
                                    <span>tarefa</span>
                                    <BiTask className="w-3 h-3" />
                                </button>
                                <button onClick={() => {
                                    setOpenDrawer(true);
                                    fetchDataById(item.id);
                                }} className="flex flex-1 gap-2 items-center justify-center py-2 px-6 bg-prussianBlue text-snow rounded-md hover:shadow-2 hover:shadow-blue-800 transition-all duration-200">
                                    <span>detalhes</span>
                                    <BiListUl className="w-3 h-3" />
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
    )
}

export default CardView