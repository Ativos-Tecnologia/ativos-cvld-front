import React, { useContext } from 'react'
import { BiArchive } from 'react-icons/bi'
import { PiClipboardText } from 'react-icons/pi';
import { ExtratosTableContext, Tabs } from '@/context/ExtratosTableContext';

export const TableTabs = ({ resetFilters }: { resetFilters: () => void }) => {

    const {
        setActiveFilter,
        activedTab, setActivedTab,
        fetchData
    } = useContext(ExtratosTableContext);


    function handleChangeTab(tab: Tabs, query: string) {
        resetFilters();
        fetchData(query)
        setActivedTab(tab)
        setActiveFilter('ALL')
    }

    return (
        <div className='mb-3 flex gap-3 border-b border-zinc-300 dark:border-form-strokedark text-xs font-semibold'>
            <div
                onClick={() => handleChangeTab('GERAL', '')}
                className={`py-1 px-2 min-w-30 flex items-center justify-start gap-2 border-b-2 border-transparent ${activedTab === 'GERAL' && 'text-blue-700 dark:text-blue-500 !border-blue-700 dark:!border-blue-500'} cursor-pointer`}>
                <PiClipboardText className='text-sm' />
                <span>GERAL</span>
            </div>

            <div
                onClick={() => handleChangeTab('ARQUIVADOS', '?showMode=archived')}
                className={`py-1 px-2 min-w-30 flex items-center gap-2 justify-start border-b-2 border-transparent ${activedTab === 'ARQUIVADOS' && 'text-blue-700 dark:text-blue-500 !border-blue-700 dark:!border-blue-500'} cursor-pointer`}>
                <BiArchive className='text-sm' />
                <span>ARQUIVADOS</span>
            </div>
        </div>
    )
}
