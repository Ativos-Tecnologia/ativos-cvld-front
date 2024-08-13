"use client";
import { ENUM_OFICIOS_LIST } from '@/constants/constants';
import statusOficio from '@/enums/statusOficio.enum';
import { LucideChevronsUpDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

const StatusFilter = ({ filterData, statusSelectValue, setStatusSelectValue } : { filterData: () => void, statusSelectValue: statusOficio | null, setStatusSelectValue: React.Dispatch<React.SetStateAction<statusOficio | null>> }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [filteredValues, setFilteredValues] = useState<statusOficio[]>(ENUM_OFICIOS_LIST);
    const searchRef = useRef<HTMLInputElement | null>(null);

    // refs
    const selectStatusRef = useRef<any>(null);

    const searchStatus = (value: string) => {
        if (!value) {
            setFilteredValues(ENUM_OFICIOS_LIST);
            return;
        }
        setFilteredValues(ENUM_OFICIOS_LIST.filter((status) => status.toLowerCase().includes(value.toLowerCase())));
    }

    const handleSelectStatus = (status: statusOficio) => {
        setOpen(false);
        setFilteredValues(ENUM_OFICIOS_LIST);
        setStatusSelectValue(status);
        searchRef.current!.value = '';
    }

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!open) return;
            if (selectStatusRef?.current?.contains(target)) return;
            setOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!open || keyCode !== 27) return;
            setOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    useEffect(() => {

        if (statusSelectValue !== null) {
            filterData();
        }

    }, [statusSelectValue])

    return (
        <div className='relative'>
            <div className='flex items-center justify-center'>
                <div
                    onClick={() => setOpen(!open)}
                    className={`min-w-48 flex items-center justify-between gap-1 border border-stroke dark:border-strokedark text-xs font-semibold py-1 px-2 hover:bg-slate-100 uppercase dark:hover:bg-slate-700 ${open && 'bg-slate-100 dark:bg-slate-700'} rounded-md transition-colors duration-200 cursor-pointer`}>
                    <span>
                        {statusSelectValue || 'Status'}
                    </span>
                    <LucideChevronsUpDown className='w-4 h-4' />
                </div>
            </div>
            {/* ==== popover ==== */}

            {open && (

                <div
                    ref={selectStatusRef}
                    className={`absolute mt-3 w-[230px] z-20 p-3 rounded-md bg-white dark:bg-form-strokedark shadow-1 border border-stroke dark:border-strokedark ${open ? 'opacity-100 visible animate-in fade-in-0 zoom-in-95' : ' animate-out fade-out-0 zoom-out-95 invisible opacity-0'} transition-opacity duration-500`}>
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