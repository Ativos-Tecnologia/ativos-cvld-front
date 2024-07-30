"use client";
import { ENUM_OFICIOS_LIST } from '@/constants/constants';
import statusOficio from '@/enums/statusOficio.enum';
import { LucideChevronsUpDown } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { IFilterProps } from '.';

const StatusFilter: React.FC<IFilterProps> = ({ filterData, statusSelectValue, setStatusSelectValue }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [filteredValues, setFilteredValues] = useState<statusOficio[]>(ENUM_OFICIOS_LIST);
    const searchRef = useRef<HTMLInputElement | null>(null);

    const searchStatus = (value: string) => {
        if (!value) {
            setFilteredValues(ENUM_OFICIOS_LIST);
            return;
        }
        setFilteredValues(ENUM_OFICIOS_LIST.filter((status) => status.toLowerCase().includes(value.toLowerCase())));
    }

    const handleSelectStatus = (status: statusOficio) => {
        filterData('status', status);
        setOpen(false);
        setFilteredValues(ENUM_OFICIOS_LIST);
        setStatusSelectValue(status);
        searchRef.current!.value = '';
    }

    return (
        <div className='relative'>
            <div
                onClick={() => setOpen(!open)}
                className={`flex items-center justify-center gap-2 text-xs font-semibold py-1 px-2 hover:bg-slate-100 uppercase dark:hover:bg-slate-700 ${open && 'bg-slate-100 dark:bg-slate-700'} rounded-md transition-colors duration-200 cursor-pointer`}>
                <span>
                    {statusSelectValue || 'Status'}
                </span>
                <LucideChevronsUpDown className='w-4 h-4' />
            </div>
            {/* ==== popover ==== */}

            {open && (

                <div className={`absolute mt-3 w-[230px] z-3 p-3 rounded-md bg-white dark:bg-form-strokedark shadow-1 border border-stroke dark:border-strokedark ${open ? 'opacity-100 visible animate-in fade-in-0 zoom-in-95' : ' animate-out fade-out-0 zoom-out-95 invisible opacity-0'} transition-opacity duration-500`}>
                    <div className='flex gap-1 items-center justify-center border-b border-stroke dark:border-bodydark2'>
                        <AiOutlineSearch className='text-lg' />
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder='Pesquisar status...'
                            className='w-full border-none focus-within:ring-0 bg-transparent dark:placeholder:text-bodydark2'
                            onKeyUp={(e) => searchStatus(e.currentTarget.value)}
                        />
                    </div>
                    <div className='flex flex-col max-h-49 overflow-y-scroll gap-1 mt-3'>
                        {filteredValues.map((status) => (
                            <span
                                key={status}
                                className='cursor-pointer text-sm p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-700'
                                onClick={() => handleSelectStatus(status)}>
                                {status}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* ==== end popover ==== */}
        </div>
    )
}

export default StatusFilter