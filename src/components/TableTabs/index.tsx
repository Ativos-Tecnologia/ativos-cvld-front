import React from 'react'
import { BiArchive } from 'react-icons/bi'
import { PiClipboardText } from 'react-icons/pi'
import { PaginatedResponse } from '@/components/TaskElements';
import { CVLDResultProps } from '@/interfaces/IResultCVLD';
import statusOficio from '@/enums/statusOficio.enum';
import { useFilter } from '@/hooks/useFilter';
import { ActiveState } from '../Filters';

interface ITableTabsProps {
    fetchData: (query: string) => Promise<void>,
    data: PaginatedResponse<CVLDResultProps>,
    setData: React.Dispatch<React.SetStateAction<PaginatedResponse<CVLDResultProps>>>,
    setStatusSelectValue: React.Dispatch<React.SetStateAction<statusOficio | null>>,
    setOficioSelectValue: React.Dispatch<React.SetStateAction<string | null>>,
    auxData: PaginatedResponse<CVLDResultProps>,
    statusSelectValue: statusOficio | null,
    oficioSelectValue: string | null
    setActiveFilter: React.Dispatch<React.SetStateAction<ActiveState>>;
}

type Tabs = 'GERAL' | 'ARQUIVADOS';

export const TableTabs = ({
    fetchData,
    data,
    setData,
    setStatusSelectValue,
    setOficioSelectValue,
    auxData,
    statusSelectValue,
    oficioSelectValue,
    setActiveFilter
}: ITableTabsProps) => {

    const { resetFilters } = useFilter(data, setData, setStatusSelectValue, setOficioSelectValue, auxData, statusSelectValue, oficioSelectValue);
    const [activedTab, setActivedTab] = React.useState<Tabs>('GERAL');

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
