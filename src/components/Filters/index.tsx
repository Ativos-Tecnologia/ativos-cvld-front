"use client";
import { ENUM_TIPO_OFICIOS_LIST } from '@/constants/constants'
import React, { useState } from 'react'
import { ImTable } from 'react-icons/im'
import statusOficio from '@/enums/statusOficio.enum';
import StatusFilter from './StatusFilter';

export interface IFilterProps {
    resetFilters?: () => void;
    filterData: (type: string, status: string) => void;
    statusSelectValue: statusOficio | null;
    setStatusSelectValue: React.Dispatch<React.SetStateAction<statusOficio | null>>;
    setOficioSelectValue?: React.Dispatch<React.SetStateAction<string | null>>;
}

type ActiveState = "ALL" | "PRECATÓRIO" | "R.P.V" | "CREDITÓRIO";

const Filters: React.FC<IFilterProps> = ({ resetFilters, filterData, statusSelectValue, setStatusSelectValue, setOficioSelectValue }) => {

    const [active, setActive] = useState<ActiveState>('ALL');

    const handleOficioStatus = (oficio: string) => {
        filterData('tipo_do_oficio', oficio)
        setActive(oficio as ActiveState)
        setOficioSelectValue!(oficio);
    }

    return (
        <div className="flex gap-3 flex-1 items-center max-w-230">
            <div
                onClick={() => {
                    resetFilters!();
                    setActive('ALL');
                }}
                className={`flex items-center justify-center gap-2 py-1 font-semibold px-2 text-xs hover:bg-slate-100 uppercase dark:hover:bg-slate-700 rounded-md transition-colors duration-200 cursor-pointer ${active === "ALL" && 'bg-slate-100 dark:bg-slate-700'}`}>
                <ImTable />
                <span>todos</span>
            </div>
            {
                ENUM_TIPO_OFICIOS_LIST.map((oficio) => (
                    <div
                        key={oficio}
                        onClick={() => handleOficioStatus(oficio)}
                        className={`flex items-center justify-center gap-2 py-1 font-semibold px-2 text-xs hover:bg-slate-100 uppercase dark:hover:bg-slate-700 rounded-md transition-colors duration-200 cursor-pointer ${active === oficio && 'bg-slate-100 dark:bg-slate-700'}`}>
                        <ImTable />
                        <span>{oficio}</span>
                    </div>
                ))
            }

            {/* separator */}
            <div className="w-px mx-1 h-5 bg-zinc-300 dark:bg-form-strokedark"></div>
            {/* separator */}

            <StatusFilter filterData={filterData} statusSelectValue={statusSelectValue} setStatusSelectValue={setStatusSelectValue} />
        </div>
    )
}

export default Filters