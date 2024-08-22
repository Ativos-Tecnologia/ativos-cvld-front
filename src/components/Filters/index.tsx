"use client";
import { ENUM_TIPO_OFICIOS_LIST } from '@/constants/constants'
import React, { useContext, useEffect } from 'react'
import { ImTable } from 'react-icons/im'
import StatusFilter from './StatusFilter';
import { MdOutlineFilterAltOff } from 'react-icons/md';
import { ActiveState, ExtratosTableContext } from '@/context/ExtratosTableContext';
import tipoOficio from '@/enums/tipoOficio.enum';


const Filters = ({ filterData, resetFilters }: { filterData: () => void, resetFilters: () => void }) => {

    const {
        statusSelectValue, setStatusSelectValue,
        oficioSelectValue, setOficioSelectValue,
        activeFilter, setActiveFilter
    } = useContext(ExtratosTableContext);

    const handleOficioStatus = (oficio: tipoOficio) => {
        setActiveFilter(oficio as ActiveState)
        setOficioSelectValue(oficio);
    }

    const handleCleanStatusFilter = () => {
        setStatusSelectValue(null);
        if (oficioSelectValue === null || oficioSelectValue === undefined) {
            resetFilters();
        }
    }

    useEffect(() => {

        if (oficioSelectValue !== null || statusSelectValue === null) {
            filterData();
        }

        if (statusSelectValue !== null) {
            filterData();
        }

    }, [oficioSelectValue, statusSelectValue])

    return (
        <div className="flex gap-3 flex-1 items-center max-w-230">
            <div
                onClick={() => {
                    resetFilters();
                    setActiveFilter('ALL');
                }}
                className={`flex items-center justify-center gap-2 py-1 font-semibold px-2 text-xs hover:bg-slate-100 uppercase dark:hover:bg-form-strokedark rounded-md transition-colors duration-200 cursor-pointer ${activeFilter === "ALL" && 'bg-slate-100 dark:bg-form-strokedark'}`}>
                <ImTable />
                <span>todos</span>
            </div>
            {
                ENUM_TIPO_OFICIOS_LIST.map((oficio) => (
                    <div
                        key={oficio}
                        onClick={() => handleOficioStatus(oficio)}
                        className={`flex items-center justify-center gap-2 py-1 font-semibold px-2 text-xs hover:bg-slate-100 uppercase dark:hover:bg-form-strokedark rounded-md transition-colors duration-200 cursor-pointer ${activeFilter === oficio && 'bg-slate-100 dark:bg-form-strokedark'}`}>
                        <ImTable />
                        <span>{oficio}</span>
                    </div>
                ))
            }

            {/* separator */}
            <div className="w-px mx-1 h-5 bg-zinc-300 dark:bg-form-strokedark"></div>
            {/* separator */}

            <div className='flex items-center justify-center gap-1'>
                <StatusFilter statusSelectValue={statusSelectValue} setStatusSelectValue={setStatusSelectValue} />

                {statusSelectValue && (
                    <div
                        title='limpar filtro de status'
                        className={`${statusSelectValue ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-y-5'} relative w-6 h-6 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-all duration-500 cursor-pointer`}
                        onClick={handleCleanStatusFilter}
                    >
                        <MdOutlineFilterAltOff />
                    </div>
                )}
            </div>

        </div>
    )
}

export default Filters