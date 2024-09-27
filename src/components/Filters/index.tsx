"use client";
import { ENUM_OFICIOS_LIST, ENUM_TIPO_OFICIOS_LIST } from '@/constants/constants'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { MdOutlineFilterAltOff } from 'react-icons/md';
import { BiLoader } from 'react-icons/bi';
import { LucideChevronsUpDown } from 'lucide-react';
import { AiOutlineSearch } from 'react-icons/ai';
import { TableNotionContext } from '@/context/NotionTableContext';
import statusOficio from '@/enums/statusOficio.enum';
import { UserInfoAPIContext } from '@/context/UserInfoContext';


const Filters = ({ currentNotionView, notionViews }: { currentNotionView: string, notionViews: string[] }) => {

    /* ====> states <==== */
    const {
        isFetching,
        setIsEditing,
        statusSelectValue,
        oficioSelectValue,
        handleFilterByStatus,
        handleFilterByTipoOficio,
        usersList,
        filteredUsersList,
        setFilteredUsersList,
        selectedUser,
        handleFilterByUser,
        handleCleanAllFilters
    } = useContext(TableNotionContext);

    const [openStatusPopover, setOpenStatusPopover] = useState<boolean>(false);
    const [openTipoOficioPopover, setOpenTipoOficioPopover] = useState<boolean>(false);
    const [openUsersPopover, setOpenUsersPopover] = useState<boolean>(false);
    const [filteredStatusValues, setFilteredStatusValues] = useState<statusOficio[]>(ENUM_OFICIOS_LIST);

    /* ====> constants <==== */
    const { data: userData } = useContext(UserInfoAPIContext);

    /*  ====> refs <==== */
    const searchStatusRef = useRef<HTMLInputElement | null>(null);
    const searchUserRef = useRef<HTMLInputElement | null>(null);
    const selectStatusRef = useRef<any>(null);
    const selectTipoOficioRef = useRef<any>(null);
    const selectUserRef = useRef<any>(null);

    /* ====> functions <==== */
    const searchStatus = (value: string) => {
        if (!value) {
            setFilteredStatusValues(ENUM_OFICIOS_LIST);
            return;
        }
        setFilteredStatusValues(ENUM_OFICIOS_LIST.filter((status) => status.toLowerCase().includes(value.toLowerCase())));
    };

    const searchUser = (value: string) => {
        if (!value) {
            setFilteredUsersList(usersList);
            return;
        }
        setFilteredUsersList(usersList.filter((user) => user.toLowerCase().includes(value.toLowerCase())));
    };

    /* ====> effects <==== */
    // fecha filtros quando clicado fora da sua área
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (openStatusPopover || openTipoOficioPopover || openUsersPopover) {
                if (
                    selectStatusRef?.current?.contains(target) ||
                    selectTipoOficioRef?.current?.contains(target) ||
                    selectUserRef?.current?.contains(target)
                ) return;
                setOpenStatusPopover(false);
                setOpenTipoOficioPopover(false);
                setOpenUsersPopover(false);
            };
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // bloqueia as queries automáticas se algum select estiver aberto
    useEffect(() => {
        if (openStatusPopover || openTipoOficioPopover || openUsersPopover) {
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    }, [openStatusPopover, openTipoOficioPopover, openUsersPopover]);


    return (
        <div className={`flex items-center justify-between mt-3 ${isFetching && 'pointer-events-none'}`}>
            <div className='flex items-center gap-2'>
                {/* ====== select de statusOficio ====== */}
                <div className='flex items-center justify-center gap-1'>
                    <div className='relative'>
                        <div className='flex items-center justify-center'>
                            <div
                                onClick={() => setOpenStatusPopover(!openStatusPopover)}
                                className={`w-48 flex items-center justify-between gap-1 border border-stroke dark:border-strokedark text-xs font-semibold py-1 px-2 hover:bg-slate-100 uppercase dark:hover:bg-slate-700 ${openStatusPopover && 'bg-slate-100 dark:bg-slate-700'} rounded-md transition-colors duration-200 cursor-pointer`}>
                                <span className="w-full text-ellipsis overflow-hidden whitespace-nowrap">
                                    {statusSelectValue || 'Status'}
                                </span>
                                <LucideChevronsUpDown className='w-4 h-4' />
                            </div>
                        </div>
                        {/* ==== popover ==== */}

                        {openStatusPopover && (

                            <div
                                ref={selectStatusRef}
                                className={`absolute mt-3 w-[230px] z-20 p-3 -left-4 rounded-md bg-white dark:bg-form-strokedark shadow-1 border border-stroke dark:border-strokedark ${openStatusPopover ? 'opacity-100 visible animate-in fade-in-0 zoom-in-95' : ' animate-out fade-out-0 zoom-out-95 invisible opacity-0'} transition-opacity duration-500`}>
                                <div className='flex gap-1 items-center justify-center border-b border-stroke dark:border-bodydark2'>
                                    <AiOutlineSearch className='text-lg' />
                                    <input
                                        ref={searchStatusRef}
                                        type="text"
                                        placeholder='Pesquisar'
                                        className='w-full border-none focus-within:ring-0 bg-transparent dark:placeholder:text-bodydark2'
                                        onKeyUp={(e) => searchStatus(e.currentTarget.value)}
                                    />
                                </div>
                                <div className='flex flex-col max-h-49 overflow-y-scroll gap-1 mt-3'>
                                    {filteredStatusValues.map((status) => (
                                        <span
                                            key={status}
                                            className='cursor-pointer text-sm p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-700'
                                            onClick={() => {
                                                setOpenStatusPopover(false);
                                                handleFilterByStatus(status);
                                            }}>
                                            {status}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* ==== end popover ==== */}
                    </div>
                </div>
                {/* ====== select de statusOficio ====== */}

                {/* ====== select de tipoOficio ====== */}
                {(currentNotionView === 'geral' || currentNotionView === notionViews[2]) && (
                    <>
                        {/* separator */}
                        <div className="w-px mx-1 h-5 bg-zinc-300 dark:bg-form-strokedark"></div>
                        {/* separator */}

                        <div className='flex items-center justify-center gap-1'>
                            <div className='relative'>
                                <div className='flex items-center justify-center'>
                                    <div
                                        onClick={() => setOpenTipoOficioPopover(!openTipoOficioPopover)}
                                        className={`min-w-48 flex items-center justify-between gap-1 border border-stroke dark:border-strokedark text-xs font-semibold py-1 px-2 hover:bg-slate-100 uppercase dark:hover:bg-slate-700 ${openTipoOficioPopover && 'bg-slate-100 dark:bg-slate-700'} rounded-md transition-colors duration-200 cursor-pointer`}>
                                        <span>
                                            {oficioSelectValue || 'Tipo do Ofício'}
                                        </span>
                                        <LucideChevronsUpDown className='w-4 h-4' />
                                    </div>
                                </div>
                                {/* ==== popover ==== */}

                                {openTipoOficioPopover && (

                                    <div
                                        ref={selectTipoOficioRef}
                                        className={`absolute mt-3 w-[230px] z-20 p-3 rounded-md bg-white dark:bg-form-strokedark shadow-1 border border-stroke dark:border-strokedark ${openTipoOficioPopover ? 'opacity-100 visible animate-in fade-in-0 zoom-in-95' : ' animate-out fade-out-0 zoom-out-95 invisible opacity-0'} transition-opacity duration-500`}
                                    >

                                        <div className='flex flex-col max-h-49 overflow-y-scroll gap-1'>
                                            {ENUM_TIPO_OFICIOS_LIST.map((tipoOficio) => (
                                                <span
                                                    key={tipoOficio}
                                                    className='cursor-pointer text-sm p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-700'
                                                    onClick={() => {
                                                        setOpenTipoOficioPopover(false);
                                                        handleFilterByTipoOficio(tipoOficio);
                                                    }}>
                                                    {tipoOficio}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* ==== end popover ==== */}
                            </div>
                        </div>
                    </>
                )}
                {/* ====== finaliza select de tipoOficio ====== */}

                {(userData.role === 'ativos' && currentNotionView === 'geral') && (
                    <React.Fragment>
                        {/* separator */}
                        <div className="w-px mx-1 h-5 bg-zinc-300 dark:bg-form-strokedark"></div>
                        {/* separator */}

                        {/* ====== select de user ====== */}
                        <div className='flex items-center justify-center gap-1'>
                            <div className='relative'>
                                <div className='flex items-center justify-center'>
                                    <div
                                        onClick={() => setOpenUsersPopover(!openUsersPopover)}
                                        className={`min-w-48 flex items-center justify-between gap-1 border border-stroke dark:border-strokedark text-xs font-semibold py-1 px-2 hover:bg-slate-100 uppercase dark:hover:bg-slate-700 ${openUsersPopover && 'bg-slate-100 dark:bg-slate-700'} rounded-md transition-colors duration-200 cursor-pointer`}>
                                        <span>
                                            {selectedUser || userData?.user}
                                        </span>
                                        <LucideChevronsUpDown className='w-4 h-4' />
                                    </div>
                                </div>
                                {/* ==== popover ==== */}

                                {openUsersPopover && (

                                    <div
                                        ref={selectUserRef}
                                        className={`absolute mt-3 w-[230px] z-20 p-3 rounded-md bg-white dark:bg-form-strokedark shadow-1 border border-stroke dark:border-strokedark ${openUsersPopover ? 'opacity-100 visible animate-in fade-in-0 zoom-in-95' : ' animate-out fade-out-0 zoom-out-95 invisible opacity-0'} transition-opacity duration-500`}>

                                        <div className='flex gap-1 items-center justify-center border-b border-stroke dark:border-bodydark2'>
                                            <AiOutlineSearch className='text-lg' />
                                            <input
                                                ref={searchUserRef}
                                                type="text"
                                                placeholder='Pesquisar usuário...'
                                                className='w-full border-none focus-within:ring-0 bg-transparent dark:placeholder:text-bodydark2'
                                                onKeyUp={(e) => searchUser(e.currentTarget.value)}
                                            />
                                        </div>

                                        <div className='flex flex-col mt-3 max-h-49 overflow-y-scroll gap-1'>
                                            {filteredUsersList.length > 0 && filteredUsersList.filter(user => user !== userData.user).map((user) => (
                                                <span
                                                    key={user}
                                                    className='cursor-pointer text-sm p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-700'
                                                    onClick={() => {
                                                        setOpenUsersPopover(false);
                                                        handleFilterByUser(user);
                                                    }}>
                                                    {user}
                                                </span>
                                            ))}
                                        </div>

                                    </div>
                                )}
                                {/* ==== end popover ==== */}
                            </div>
                        </div>
                        {/* ====== finaliza select de user ====== */}
                    </React.Fragment>
                )}

                {(statusSelectValue || oficioSelectValue || selectedUser) && (
                    <div
                        title='limpar filtro de status'
                        className={`${statusSelectValue || oficioSelectValue || selectedUser ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-y-5'} relative w-6 h-6 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-all duration-500 cursor-pointer`}
                        onClick={handleCleanAllFilters}
                    >
                        <MdOutlineFilterAltOff />
                    </div>
                )}

            </div>
            <div className='w-full flex justify-end items-right'>
                {
                    <div className='w-full mb-2 h-4 flex justify-end items-center'>
                        <div className={`${isFetching ? "opacity-100 visible" : "opacity-0 invisible"} text-center flex justify-center items-center transition-all duration-300`}>
                            <span className='text-xs mr-2 text-meta-4 dark:text-bodydark'>
                                {
                                    isFetching ? {
                                        0: 'Carregando...',
                                        1: 'Sincronizando bases de dados...',
                                        2: 'Atualizando...'
                                    }[Math.floor(Math.random() * 3)] : ''
                                }
                            </span>
                            <BiLoader className="animate-spin h-5 w-5" />
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Filters