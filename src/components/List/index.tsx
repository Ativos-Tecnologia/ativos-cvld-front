'use client';
import { ENUM_OFICIOS_LIST } from '@/constants/constants'
import statusOficio from '@/enums/statusOficio.enum';
import tipoOficio from '@/enums/tipoOficio.enum';
import notionColorResolver from '@/functions/formaters/notionColorResolver'
import React, { useEffect } from 'react'

export const DynamicList = ({ label, listType, data, open, setOpen, callback }:
    {
        label: any;
        listType: any[];
        data: any,
        open: boolean,
        setOpen: React.Dispatch<React.SetStateAction<string | null>>,
        callback: any
    }
) => {

    const listRef = React.useRef<HTMLDivElement>(null);

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (!open) return;
            if (listRef?.current?.contains(target as Node)) return;
            setOpen(null);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    return (
        <>
            {
                open && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        ref={listRef}
                        className={`absolute w-full z-3 scroll text-xs bg-white dark:bg-boxdark shadow-2 -top-10 left-0 rounded-md border border-gray-300 dark:border-form-strokedark cursor-default ${open ? 'opacity-100 visible animate-in fade-in-0 zoom-in-95' : ' animate-out fade-out-0 zoom-out-95 invisible opacity-0'} transition-opacity duration-500`}>

                        {label !== null && (
                            <div className='w-full py-2 px-2 bg-[#f5f5f5] grid place-items-center dark:bg-graydark rounded-se-md rounded-ss-md border-b border-gray-300 dark:border-form-strokedark'>
                                <span className=" px-2 py-1 rounded-md text-black-2" style={{
                                    backgroundColor: notionColorResolver(label?.color || 'default'),
                                }}>{label?.name || ""}</span>
                            </div>
                        )}

                        <div className="flex flex-col max-h-[350px] overflow-y-scroll my-2">
                            {label !== null ? (
                                <>
                                    {listType.filter((item) => item !== label?.name).map((item) => (
                                        <span
                                            onClick={() => {
                                                setOpen(null);
                                                callback(data.id, item)
                                            }}
                                            key={item}
                                            className="p-2 bg-transparent hover:bg-slate-200 dark:hover:bg-graydark transition-colors duration-200">
                                            {item}
                                        </span>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {listType.map((item) => (
                                        <span
                                            onClick={() => {
                                                setOpen(null);
                                                callback(data.id, item)
                                            }}
                                            key={item}
                                            className="p-2 bg-transparent hover:bg-slate-200 dark:hover:bg-graydark transition-colors duration-200">
                                            {item}
                                        </span>
                                    ))}
                                </>
                            )}

                        </div>
                    </div>
                )
            }
        </>
    )
}
