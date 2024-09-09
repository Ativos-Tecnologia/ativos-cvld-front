import { ENUM_TIPO_OFICIOS_LIST } from '@/constants/constants';
import { UserInfoAPIContext } from '@/context/UserInfoContext';
import tipoOficio from '@/enums/tipoOficio.enum';
import api from '@/utils/api';
import { LucideChevronsUpDown } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { BiLoader, BiSolidCategoryAlt, BiSolidDockLeft, BiSolidWallet, BiUpArrowAlt } from 'react-icons/bi';
import { MdOutlineFilterAltOff } from 'react-icons/md';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from './TableDefault';
import { AiOutlineUser } from 'react-icons/ai';
import { PiCursorClick, PiHash, PiListBulletsBold } from 'react-icons/pi';
import { BsCalendar3 } from 'react-icons/bs';
import { LiaCoinsSolid } from 'react-icons/lia';
import { CgMathPercent } from 'react-icons/cg';
import { GiChoice } from "react-icons/gi";
import Title from '../CrmUi/Title';
import { NotionPage } from '@/interfaces/INotion';
import CustomCheckbox from '../CrmUi/Checkbox';
import { RiNotionFill } from 'react-icons/ri';
import { LuBarChart4 } from 'react-icons/lu';
import { IWalletResponse } from '@/interfaces/IWallet';
import numberFormat from '@/functions/formaters/numberFormat';

export interface ITableWalletProps {
    data: any;
    isPending: boolean;
    setVlData: React.Dispatch<React.SetStateAction<IWalletResponse>>
}

const TableWallet = ({ data, isPending, setVlData }: ITableWalletProps) => {

    /* =====> states <====== */
    const [editableLabel, setEditableLabel] = useState<string | null>(null);
    const [openTipoOficioPopover, setOpenTipoOficioPopover] = useState<boolean>(false);
    const [openUsersPopover, setOpenUsersPopover] = useState<boolean>(false)
    const [oficioSelectValue, setOficioSelectValue] = useState<tipoOficio | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [usersList, setUsersList] = useState<string[]>([]);
    const [checkedList, setCheckedList] = useState<any[]>([])
    const { data: { user, role } } = useContext(UserInfoAPIContext)

    console.log(data)

    /* =====> refs <====== */
    const selectTipoOficioRef = useRef<any>(null);
    const selectUserRef = useRef<any>(null);
    const inputCredorRefs = useRef<HTMLInputElement[] | null>([]);

    /* =====> functions <===== */
    const fetchUpdatedVL = async (oficio: NotionPage) => {
        console.log('a')
        // Essa função recebe um objeto do tipo NotionPage e retorna um objeto do tipo IWalletResponse com os valores atualizados
        try {
            const response = await api.post('/api/extrato/wallet/', {
                oficio
            });
            if (response.data) {
                setVlData(response.data);
            }

        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    const handleFilterByTipoOficio = (oficio: tipoOficio) => {
        setOficioSelectValue(oficio);
        setOpenTipoOficioPopover(false);
        // setListQuery(
        //     {
        //         "and": [
        //             {
        //                 "property": selectedUser && data2?.sub_role === 'coordenador' ? "Usuário" : "Coordenadores",
        //                 "multi_select": {
        //                     "contains": selectedUser && data2?.sub_role === 'coordenador' ? selectedUser : ""
        //                 }
        //             },
        //             data2?.sub_role === 'coordenador' ? {
        //                 "property": "Coordenadores",
        //                 "multi_select": {
        //                     "contains": data2?.user
        //                 }
        //             } : {
        //                 "property": "Usuário",
        //                 "multi_select": {
        //                     "contains": selectedUser || data2?.user
        //                 }
        //             },
        //             {
        //                 "property": "Status",
        //                 "status": {
        //                     "equals": statusSelectValue || ''
        //                 }
        //             },
        //             {
        //                 "property": "Tipo",
        //                 "select": {
        //                     "equals": oficio
        //                 }
        //             },
        //             secondaryDefaultFilterObject
        //         ]
        //     }
        // );
    }

    const handleFilterByUser = (user: string) => {
        setOpenUsersPopover(false)
        setSelectedUser(user);
        // setListQuery({
        //     "and": [
        //         {
        //             "property": selectedUser && data2?.sub_role === 'coordenador' ? "Usuário" : "Coordenadores",
        //             "multi_select": {
        //                 "contains": selectedUser && data2?.sub_role === 'coordenador' ? user : ""
        //             }
        //         },
        //         data2?.sub_role === 'coordenador' ? {
        //             "property": "Coordenadores",
        //             "multi_select": {
        //                 "contains": data2?.user
        //             }
        //         } : {
        //             "property": "Usuário",
        //             "multi_select": {
        //                 "contains": user
        //             }
        //         },
        //         {
        //             "property": "Status",
        //             "status": {
        //                 "equals": statusSelectValue || ''
        //             }
        //         },
        //         {
        //             "property": "Tipo",
        //             "select": {
        //                 "equals": oficioSelectValue || ''
        //             }
        //         },
        //         secondaryDefaultFilterObject
        //     ]
        // });
    }

    const handleCleanAllFilters = () => {
        setOficioSelectValue(null);
        setSelectedUser(null);
        // setListQuery(defaultFilterObject);
    }

    /* =====> effects <===== */
    // seta a lista de usuários de a role do usuário for ativos
    useEffect(() => {
        const fetchData = async () => {
            if (role === "ativos") {
                const [usersList] = await Promise.all([api.get("/api/notion-api/list/users/")]);
                if (usersList.status === 200) {
                    setUsersList(usersList.data);
                }
            };
        };

        fetchData();
    }, [role]);

    // close on click outside filters
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (openTipoOficioPopover || openUsersPopover) {
                if (
                    selectTipoOficioRef?.current?.contains(target) ||
                    selectUserRef?.current?.contains(target)
                ) return;
                setOpenTipoOficioPopover(false);
                setOpenUsersPopover(false);
            };
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    /* atribui os valores de nomes dos credores aos inputs */
    useEffect(() => {
        if (inputCredorRefs.current) {
            data?.results?.forEach((item: NotionPage, index: number) => {
                const ref = inputCredorRefs.current![index];
                if (ref) {
                    ref.value = item.properties.Credor?.title[0]?.text.content || '';
                }
            });
        }

    }, [data]);

    return (
        <div className='col-span-12 bg-white dark:bg-boxdark border-stroke dark:border-strokedark p-[30px] rounded-sm shadow-default'>
            <div className='mb-3 flex gap-3 border-b border-zinc-300 dark:border-form-strokedark text-xs font-semibold'>
                <div
                    className={`py-1 px-2 min-w-30 flex items-center justify-start gap-2 border-b-2 text-blue-700 dark:text-blue-500 border-blue-700 dark:border-blue-500`}
                >
                    <BiSolidWallet className='text-sm' />
                    <span>WORKSPACE NOTION</span>
                </div>
            </div>

            {/* Filtros estilo select */}
            <div className={`flex items-center justify-between mt-3 ${isPending && 'pointer-events-none'}`}>
                <div className='flex items-center gap-2'>

                    {/* ====== select de tipoOficio ====== */}
                    <>
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
                                        className={`absolute mt-3 w-[230px] z-20 p-3 rounded-md bg-white dark:bg-form-strokedark shadow-1 border border-stroke dark:border-strokedark ${openTipoOficioPopover ? 'opacity-100 visible animate-in fade-in-0 zoom-in-95' : ' animate-out fade-out-0 zoom-out-95 invisible opacity-0'} transition-opacity duration-500`}>
                                        <div className='flex flex-col max-h-49 overflow-y-scroll gap-1'>
                                            {ENUM_TIPO_OFICIOS_LIST.map((tipoOficio) => (
                                                <span
                                                    key={tipoOficio}
                                                    className='cursor-pointer text-sm p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-700'
                                                    onClick={() => handleFilterByTipoOficio(tipoOficio)}>
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
                    {/* ====== finaliza select de tipoOficio ====== */}

                    {role === 'ativos' && (
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
                                                {selectedUser || user}
                                            </span>
                                            <LucideChevronsUpDown className='w-4 h-4' />
                                        </div>
                                    </div>
                                    {/* ==== popover ==== */}

                                    {openUsersPopover && (

                                        <div
                                            ref={selectUserRef}
                                            className={`absolute mt-3 w-[230px] z-20 p-3 rounded-md bg-white dark:bg-form-strokedark shadow-1 border border-stroke dark:border-strokedark ${openUsersPopover ? 'opacity-100 visible animate-in fade-in-0 zoom-in-95' : ' animate-out fade-out-0 zoom-out-95 invisible opacity-0'} transition-opacity duration-500`}>
                                            {/* <div className='flex gap-1 items-center justify-center border-b border-stroke dark:border-bodydark2'>
                                    <AiOutlineSearch className='text-lg' />
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        placeholder='Pesquisar status...'
                                        className='w-full border-none focus-within:ring-0 bg-transparent dark:placeholder:text-bodydark2'
                                        onKeyUp={(e) => searchStatus(e.currentTarget.value)}
                                    />
                                </div> */}
                                            <div className='flex flex-col max-h-49 overflow-y-scroll gap-1'>
                                                {usersList.filter(user => user !== data.user).map((user) => (
                                                    <span
                                                        key={user}
                                                        className='cursor-pointer text-sm p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-700'
                                                        onClick={() => handleFilterByUser(user)}>
                                                        {user}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {/* ==== end popover ==== */}
                                </div>
                                {(oficioSelectValue || selectedUser) && (
                                    <div
                                        title='limpar filtro de status'
                                        className={`${oficioSelectValue || selectedUser ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-y-5'} relative w-6 h-6 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-all duration-500 cursor-pointer`}
                                        onClick={handleCleanAllFilters}
                                    >
                                        <MdOutlineFilterAltOff />
                                    </div>
                                )}
                            </div>
                            {/* ====== finaliza select de user ====== */}
                        </React.Fragment>
                    )}

                </div>
                <div className='w-full flex justify-end items-right'>
                    {
                        <div className='w-full mb-2 h-4 flex justify-end items-center'>
                            <div className={`${isPending ? "opacity-100 visible" : "opacity-0 invisible"} text-center flex justify-center items-center transition-all duration-300`}>
                                <span className='text-xs mr-2 text-meta-4 dark:text-bodydark'>
                                    {
                                        isPending ? {
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
            {/* End Filtros estilo select */}

            <div className='max-w-full overflow-x-scroll pb-5'>
                {/* TABLE */}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell className='min-w-100'>
                                <div className='flex gap-2'>
                                    <AiOutlineUser className='text-base' />
                                    <span>Nome do Credor</span>
                                </div>
                            </TableHeadCell>
                            <TableHeadCell className='max-w-50'>
                                <Title text='Valor de Aquisição (Wallet)'>
                                    <div className='flex gap-2'>
                                        <PiHash className='text-base' />
                                        <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>Valor de Aquisição (Wallet)</span>
                                    </div>
                                </Title>
                            </TableHeadCell>
                            <TableHeadCell className='max-w-50'>
                                <div className='flex gap-2'>
                                    <PiHash className='text-base' />
                                    <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>Valor Projetado</span>
                                </div>
                            </TableHeadCell>
                            <TableHeadCell className='max-w-50'>
                                <Title text='Previsão de Pagamento'>
                                    <div className='flex gap-2'>
                                        <BsCalendar3 className='text-base' />
                                        <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>Previsão de Pagamento</span>
                                    </div>
                                </Title>
                            </TableHeadCell>
                            <TableHeadCell className='max-w-50'>
                                <Title text='Valor Líquido (Com Reserva dos Honorários)'>
                                    <div className='flex gap-2'>
                                        <LiaCoinsSolid className='text-base' />
                                        <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>Valor Líquido (Com Reserva dos Honorários)</span>
                                    </div>
                                </Title>
                            </TableHeadCell>
                            <TableHeadCell className='max-w-50'>
                                <Title text='Data de aquisição do precatório'>
                                    <div className='flex gap-2'>
                                        <BsCalendar3 className='text-base' />
                                        <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>Data de aquisição do precatório</span>
                                    </div>
                                </Title>
                            </TableHeadCell>
                            <TableHeadCell className='max-w-50'>
                                <div className='flex gap-2'>
                                    <BiSolidCategoryAlt className='text-base' />
                                    <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>Natureza</span>
                                </div>
                            </TableHeadCell>
                            <TableHeadCell className='max-w-50'>
                                <div className='flex gap-2'>
                                    <BsCalendar3 className='text-base' />
                                    <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>Data de Recebimento</span>
                                </div>
                            </TableHeadCell>
                            <TableHeadCell className='max-w-50'>
                                <div className='flex gap-2'>
                                    <BsCalendar3 className='text-base' />
                                    <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>Data Base</span>
                                </div>
                            </TableHeadCell>
                            <TableHeadCell className='max-w-50'>
                                <div className='flex gap-2'>
                                    <CgMathPercent className='text-base' />
                                    <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>Juros Fixados?</span>
                                </div>
                            </TableHeadCell>
                            <TableHeadCell className='max-w-50'>
                                <div className='flex gap-2'>
                                    <LiaCoinsSolid className='text-base' />
                                    <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>PSS</span>
                                </div>
                            </TableHeadCell>
                            <TableHeadCell className='max-w-50'>
                                <div className='flex gap-2'>
                                    <BsCalendar3 className='text-base' />
                                    <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>Meses RRA</span>
                                </div>
                            </TableHeadCell>
                            <TableHeadCell className='max-w-50'>
                                <div className='flex gap-2'>
                                    <BiUpArrowAlt className='text-base' />
                                    <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>Incidência IR</span>
                                </div>
                            </TableHeadCell>
                            <TableHeadCell className='max-w-50'>
                                <div className='flex gap-2'>
                                    <LiaCoinsSolid className='text-base' />
                                    <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>Valor Principal</span>
                                </div>
                            </TableHeadCell>
                            <TableHeadCell className='max-w-50'>
                                <div className='flex gap-2'>
                                    <LiaCoinsSolid className='text-base' />
                                    <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>Valor Juros</span>
                                </div>
                            </TableHeadCell>
                            <TableHeadCell className='max-w-50'>
                                <div className='flex gap-2'>
                                    <PiListBulletsBold className='text-base' />
                                    <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>Usuário da Wallet</span>
                                </div>
                            </TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isPending ? null : (
                            <React.Fragment>
                                {
                                    data?.results?.length > 0 && (
                                        <>
                                            {
                                                data?.results?.map((item: NotionPage, index: number) => (
                                                    <TableRow

                                                        key={item.id}
                                                        className={`${checkedList!.some(target => target.id === item.id) && 'bg-blue-50 dark:bg-form-strokedark'} hover:shadow-3 dark:hover:shadow-body group relative`}
                                                    >
                                                        <div className='absolute inset-0' onClick={() => fetchUpdatedVL(item)}>

                                                        </div>
                                                        {/* credor info */}
                                                        <TableCell
                                                            title={item.properties.Credor?.title[0].text.content || ''}
                                                            className="h-full flex items-center gap-2 font-semibold text-sm"
                                                        >
                                                            {
                                                                item.properties.Credor?.title[0].text.content || ''
                                                            }
                                                        </TableCell>
                                                        <TableCell className='text-sm'>
                                                                {numberFormat(item.properties['Valor de Aquisição (Wallet)']?.number || 0)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </>
                                    )
                                }
                            </React.Fragment>
                        )}
                    </TableBody>
                </Table>
                {/* END TABLE */}
            </div>
        </div>
    )
}

export default TableWallet