import dateFormater from '@/functions/formaters/dateFormater'
import numberFormat from '@/functions/formaters/numberFormat'
import { handleMesesAteOPagamento, handleRentabilidadeAM, handleRentabilidadeTotal, handleRentabilideAA } from '@/functions/wallet/rentability'
import { NotionPage } from '@/interfaces/INotion'
import api from '@/utils/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import React from 'react'
import { BiSolidCoinStack } from 'react-icons/bi'
import { FaFileAlt, FaFileInvoiceDollar } from 'react-icons/fa'
import CustomSkeleton from '../CrmUi/CustomSkeleton'

const imgPaths: Record<string, string> = {
    "TRF1": "/images/card_TRF1.jpg",
    "TRF2": "/images/card_TRF2.jpg",
    "TRF3": "/images/card_TRF3.jpg",
    "TRF4": "/images/card_TRF4.jpg",
    "TRF5": "/images/card_TRF5.jpg",
    "TRF6": "/images/card_TRF6.jpg",
    "TJSP": "/images/card_TJSP.jpg",
}

export const iconsConfig = {
    "PRECATÓRIO": {
        bgColor: "#0332ac",
        icon: <FaFileAlt className='text-[22px] text-snow' />
    },
    "CREDITÓRIO": {
        bgColor: "#056216",
        icon: <FaFileInvoiceDollar className='text-[22px] text-snow' />
    },
    "R.P.V.": {
        bgColor: "#810303",
        icon: <BiSolidCoinStack className='text-[22px] text-snow' />
    },
}

const Card = ({ oficio, onClickFn }: { oficio: NotionPage, onClickFn: () => void }) => {

    const fetchOficioDataFromWallet = async () => {
        const response = await api.post('/api/extrato/wallet/', {
            oficio,
            from_today: true
        });
        return response.data;
    }

    const { data } = useQuery(
        {
            queryKey: ['notion_marketplace_item', { item_id: oficio.id }],
            staleTime: 5 * 1000,
            queryFn: fetchOficioDataFromWallet
        },
    );

    return (
        <li className='h-65 mb-4 font-nexa xsm:min-w-95 xsm:px-2 md:px-3 md:min-w-[350px] lg:px-4 max-w-full' onClick={onClickFn}>
            <div className='relative group h-55'>
                <div className='absolute z-0 inset-0 overflow-hidden rounded-md'>
                    <Image
                        src={imgPaths[oficio.properties["Tribunal"].select?.name as keyof typeof imgPaths]}
                        alt="Card Image"
                        width={380}
                        height={220}
                        className="group-hover:scale-105 transition-all duration-500"
                    />
                    <div className='absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_20%,rgba(0,0,0,0.2)_80%)]'></div>
                </div>
                <div
                    className='relative group cursor-pointer rounded-md p-4 h-full bg-center bg-cover flex flex-col justify-between'
                >
                    {/* badge */}
                    <div className='group-hover:opacity-0 absolute right-1 -top-1 flex items-center justify-center z-3'>
                        <Image
                            src="/images/badge-tribunal.svg"
                            alt="badge onde mostra o tribunal referente"
                            width={70}
                            height={75}
                        />
                        <span className='absolute top-5 font-bold text-black-2'>
                            {oficio.properties["Tribunal"].select?.name}
                        </span>
                    </div>
                    {/* end badge */}

                    {/* icon */}
                    <span
                        style={{ backgroundColor: iconsConfig[oficio.properties["Tipo"].select?.name as keyof typeof iconsConfig].bgColor }}
                        className='flex items-center justify-center rounded-lg p-3 w-10 h-10'
                    >
                        {iconsConfig[oficio.properties["Tipo"].select?.name as keyof typeof iconsConfig].icon}
                    </span>
                    {/* end icon */}

                    {/* info */}
                    <div className='flex items-center justify-between group-hover:opacity-0'>
                        <div>
                            <p className='text-snow font-semibold uppercase text-sm border-b border-snow w-fit pr-2 mb-2'>
                                {oficio.properties["Estado do Ente Devedor"].select?.name}
                                {" - "}
                                {oficio.properties["Tipo"].select?.name || "Sem tipo"}
                            </p>
                            <h2 className='text-gray-300'>
                                {data?.result[data.result.length - 1]["valor_liquido_disponivel"] ? numberFormat(data?.result[data.result.length - 1]["valor_liquido_disponivel"] || 0) : (
                                    <CustomSkeleton className="h-6" />
                                )}
                            </h2>
                        </div>
                        {oficio.properties["Destaque"]?.checkbox && (
                            <div className='flex gap-2 items-center'>
                                <Image
                                    src={"/images/higher-investor.svg"}
                                    alt="badge de ativo em destaque"
                                    width={28}
                                    height={28}
                                />
                            </div>
                        )}
                    </div>
                    {/* end info */}


                </div>

                {/* hover info */}
                <div
                    title='clique para acessar o ativo'
                    className='absolute inset-0 z-2 flex flex-col p-4 cursor-pointer justify-between h-55 opacity-0 group-hover:opacity-100 group-hover:h-65 transition-all duration-300 ease-in-out bg-[linear-gradient(to_top,#000000_20%,rgba(17,17,17,0.5)_80%)] rounded-md'>

                    {/* hovered icon */}
                    <span
                        title={oficio.properties["Tipo"].select?.name || "sem tipo"}
                        className='flex items-center justify-center rounded-lg p-3 w-10 h-10 bg-[#1b1b1b]'
                    >
                        {iconsConfig[oficio.properties["Tipo"].select?.name as keyof typeof iconsConfig].icon}
                    </span>
                    {/* end hovered icon */}

                    {/* hovered info */}
                    <div>
                        <div className='grid grid-cols-2'>
                            <div className='col-span-2 uppercase pb-[2px] mb-1 border-b border-snow'>
                                <p className='text-[10px] text-gray-400'>ENTE DEVEDOR</p>
                                <p
                                    title={oficio.properties["Ente Devedor"].select?.name || "Não informado"}
                                    className='text-sm text-snow max-w-[316px] text-ellipsis overflow-hidden whitespace-nowrap'
                                >
                                    {oficio.properties["Ente Devedor"].select?.name || "Não informado"}
                                </p>
                            </div>
                            <div className='col-span-1 uppercase pb-[2px] mb-1 border-b border-snow'>
                                <p className='text-[10px] text-gray-400'>esfera</p>
                                <p className='text-sm text-snow'>
                                    {oficio.properties["Esfera"].select?.name || "Não informada"}
                                </p>
                            </div>
                            <div className='col-span-1 uppercase pb-[2px] mb-1 border-b border-snow'>
                                <p className='text-[10px] text-gray-400'>valor líquido atualizado</p>
                                <p className='text-sm text-snow'>
                                    {data?.result[data.result.length - 1]["valor_liquido_disponivel"] ? numberFormat(data?.result[data.result.length - 1]["valor_liquido_disponivel"] || 0) : (
                                        <CustomSkeleton className="h-6" />
                                    )}
                                </p>
                            </div>
                            <div className='col-span-1 uppercase pb-[2px] mb-1 border-b border-snow'>
                                <p className='text-[10px] text-gray-400'>rentabilidade A.A.</p>
                                <p className='text-sm text-snow'>
                                    {
                                        (handleRentabilideAA(handleRentabilidadeTotal(data), handleMesesAteOPagamento(data)) * 100).toFixed(2).replace('.', ',') + "%"
                                    }
                                </p>
                            </div>
                            <div className='col-span-1 uppercase pb-[2px] mb-1 border-b border-snow'>
                                <p className='text-[10px] text-gray-400'>data de previsão pgto</p>
                                <p className='text-sm text-snow'>
                                    {dateFormater(oficio.properties["Previsão de pagamento"].date?.start) || "não informada"}
                                </p>
                            </div>
                            <div className='col-span-1 uppercase pb-[2px] mb-1 border-b border-snow'>
                                <p className='text-[10px] text-gray-400'>valor da aquisição</p>
                                <p className='text-sm text-snow'>
                                    {numberFormat(oficio.properties["Valor de Aquisição (Wallet)"]?.number || 0)}
                                </p>
                            </div>
                            <div className='col-span-1 uppercase pb-[2px] mb-1 border-b border-snow'>
                                <p className='text-[10px] text-gray-400'>valor projetado</p>
                                <p className='text-sm text-snow'>
                                    {numberFormat(oficio.properties["Valor Projetado"].number || 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* end hovered info */}

                </div>
                {/* end hover info */}
            </div>
        </li>
    )
}

export default Card