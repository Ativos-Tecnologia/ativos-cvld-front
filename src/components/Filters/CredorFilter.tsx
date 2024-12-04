import { BrokersContext } from '@/context/BrokersContext'
import { NotionPage } from '@/interfaces/INotion'
import React, { useContext, useRef } from 'react'
import { BiSearchAlt2 } from 'react-icons/bi'
import { FaHandHoldingUsd } from 'react-icons/fa'

const CredorFilter = () => {

    const {
        cardsData, setCardsData
    } = useContext(BrokersContext);
    const searchRef = useRef<HTMLInputElement>(null)

    function searchCredor() {
        // if (searchRef.current) {
        //     const hasMatch = cardsData?.results.some((item: NotionPage) =>
        //         item.properties.Credor?.title[0]?.text.content.toLowerCase().includes(searchRef.current?.value.toLowerCase())
        //     );
        // }
    }

    console.log(searchRef.current && searchRef.current.value)

    return (
        <div>
            <div className='flex gap-2 items-center uppercase font-semibold text-sm mb-2'>
                <FaHandHoldingUsd />
                Filtro por credor
            </div>
            <div className='flex'>
                <input
                    ref={searchRef}
                    type="text"
                    value={"EHO"}
                    placeholder="Nome do credor"
                    className='border border-stroke dark:border-form-strokedark dark:bg-boxdark-2 h-9 text-sm uppercase rounded-tl-md rounded-bl-md focus-visible:ring-0'
                />
                <div
                    title='Pesquisar por credor'
                    className='flex items-center justify-center w-9 h-9 cursor-pointer rounded-tr-md rounded-br-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-200'>
                    <BiSearchAlt2 />
                </div>
            </div>
        </div>
    )
}

export default CredorFilter