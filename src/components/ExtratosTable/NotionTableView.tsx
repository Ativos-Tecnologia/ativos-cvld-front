import { Badge, CustomFlowbiteTheme, Flowbite, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import numberFormat from "@/functions/formaters/numberFormat";
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { BiLoader, BiSolidDockLeft } from 'react-icons/bi';
import { LiaCoinsSolid } from "react-icons/lia";
import { IoDocumentTextOutline, IoReload } from "react-icons/io5";
import { PiCursorClick } from "react-icons/pi";
import { CVLDResultProps } from '@/interfaces/IResultCVLD';
import statusOficio from '@/enums/statusOficio.enum';
import tipoOficio from '@/enums/tipoOficio.enum';
import MarvelousPagination from '../MarvelousPagination';
import { ImCopy, ImTable } from 'react-icons/im';
import { ENUM_OFICIOS_LIST, ENUM_TIPO_OFICIOS_LIST } from '@/constants/constants';
import { AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import { toast } from 'sonner';
import { ActiveState, ExtratosTableContext } from '@/context/ExtratosTableContext';
import { RiNotionFill } from 'react-icons/ri';
import { NotionPage } from '@/interfaces/INotion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserInfoAPIContext } from '@/context/UserInfoContext';
import api from '@/utils/api';
import StatusFilter from '../Filters/StatusFilter';
import { MdOutlineFilterAltOff } from 'react-icons/md';
import { MiniMenu } from './MiniMenu';
import { LucideChevronsUpDown } from 'lucide-react';
import { customFlowBiteTheme } from '@/themes/FlowbiteThemes';
import MakeFirstContact from '../TablesNotion/MakeFirstContact';
import { OfficeTypeAndValue } from '../TablesNotion/OfficeTypeAndValue';
import { SendProposal } from '../TablesNotion/SendProposal';


const notionViews: string[] = [
    'Realizar 1º Contato',
    'Juntar Ofício/Valor Líquido',
    'Enviar Proposta/Negociação',
    'Proposta Aceita'
]


const updateNotionCreditorName = async (page_id: string, value: string) => {
    try {
        const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
            "Credor": {
                "title": [
                    {
                        "text": {
                            "content": value
                        }
                    }
                ]
            }
        });
        if (resNotion.status !== 202) {
            console.log('houve um erro ao salvar os dados no notion');
        }
    } catch (error) {
        console.log(error);
    }
}

const updateNotionPhoneNumber = async (page_id: string, type: string, value: string) => {
    try {
        const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
            [type]: {
                "phone_number": value
            }
        });
        if (resNotion.status !== 202) {
            console.log('houve um erro ao salvar os dados no notion');
        }
    } catch (error) {
        console.log(error);
    }
}

const updateNotionEmail = async (page_id: string, value: string) => {
    try {
        const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
            "Contato de E-mail": {
                "email": value
            }
        });
        if (resNotion.status !== 202) {
            console.log('houve um erro ao salvar os dados no notion');
        }
    } catch (error) {
        console.log(error);
    }
}

type NotionTableViewProps = {
    count?: number;
    setExtratosTableToNotionDrawersetId: React.Dispatch<React.SetStateAction<string>>;
    setNotionDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}


const updateNotionProposalPrice = async (page_id: string, value: number) => {
    try {
        const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
            "Preço Proposto": {
                "number": value
            }
        });
        if (resNotion.status !== 202) {
            console.log('houve um erro ao salvar os dados no notion');
        }
    } catch (error) {
        console.log(error);
    }
}

const NotionTableView = ({ count, setExtratosTableToNotionDrawersetId, setNotionDrawer }: NotionTableViewProps) => {

    const [notionView, setNotionView] = useState<string>('geral');
    const [selectedStatusValue] = React.useState<statusOficio | null>(null);
    const [checkedList, setCheckedList] = React.useState<NotionPage[]>([]);
    const [openStatusPopover, setOpenStatusPopover] = useState<boolean>(false);
    const [openTipoOficioPopover, setOpenTipoOficioPopover] = useState<boolean>(false);
    const [filteredValues, setFilteredValues] = useState<statusOficio[]>(ENUM_OFICIOS_LIST);
    const searchRef = useRef<HTMLInputElement | null>(null);
    const selectStatusRef = useRef<any>(null);
    const selectTipoOficioRef = useRef<any>(null);


    const handleNotionDrawer = (id: string) => {
        setExtratosTableToNotionDrawersetId(id)
        setNotionDrawer(true);
    }


    const handleSelectRow = (item: NotionPage) => {

        if (checkedList.length === 0) {
            setCheckedList([item]);
            return;
        }

        const alreadySelected = checkedList.some(target => target.id === item.id);

        if (alreadySelected) {
            setCheckedList(checkedList.filter(target => target.id !== item.id));
        } else {
            setCheckedList([...checkedList, item]);
        }
    }

    const {
        setOpenDetailsDrawer,
        editableLabel, setEditableLabel
    } = useContext(ExtratosTableContext);
    const { data: { user } } = useContext(UserInfoAPIContext);

    const [currentQuery, setCurrentQuery] = useState({});

    const [statusSelectValue, setStatusSelectValue] = useState<statusOficio | null>(null);
    const [oficioSelectValue, setOficioSelectValue] = useState<tipoOficio | null>(null);
    const [activeFilter, setActiveFilter] = useState<ActiveState>('ALL');
    const [listQuery, setListQuery] = useState<object>({
        "property": "Usuário",
        "multi_select": {
            "contains": user
        }
    },);


    const fetchNotionData = async () => {
        const t = await api.post(`api/notion-api/list/`, user && listQuery)
        return t.data
    }

    const queryClient = useQueryClient()
    const { isPending, data, error, isFetching, refetch } = useQuery(
        {
            queryKey: ['notion_list'],
            refetchOnReconnect: true,
            refetchOnWindowFocus: true,
            queryFn: fetchNotionData,
        },
    );

    const updateStatusAtNotion = async (page_id: string, status: statusOficio) => {

        try {
            const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
                "Status": {
                    "status": {
                        "name": `${status}`
                    }
                }
            });
            if (resNotion.status !== 202) {
                console.log('houve um erro ao salvar os dados no notion');
            }

            queryClient.invalidateQueries({ queryKey: ['notion_list'] });
        } catch (error) {
            console.log(error);
        }
    }

    const updateTipoAtNotion = async (page_id: string, tipo: tipoOficio) => {

        queryClient.invalidateQueries({ queryKey: ['notion_list'] });
        const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
            "Tipo": {
                "select": {
                    "name": `${tipo}`
                }
            },
        });

        if (resNotion.status !== 202) {
            console.log('houve um erro ao salvar os dados no notion');
        }
    }

    // refs
    // setNotionWorkspaceData(data)
    const inputRefs = useRef<HTMLInputElement[] | null>([]);

    const handleCopyValue = (index: number) => {

        navigator.clipboard.writeText(numberFormat(data.results[index].properties['Valor Líquido'].formula?.number || 0));

        toast("Valor copiado para área de transferência.", {
            classNames: {
                toast: "dark:bg-form-strokedark",
                title: "dark:text-snow",
                description: "dark:text-snow",
                actionButton: "!bg-slate-100 dark:bg-form-strokedark"
            },
            action: {
                label: "Fechar",
                onClick: () => {
                    toast.dismiss();
                }
            }
        })
    }

    const handleEditInput = (index: number, refList: HTMLInputElement[] | null) => {
        if (refList) {
            refList[index].focus();
        }
    }

    const handleChangeCreditorName = async (value: string, index: number, page_id: string, refList: HTMLInputElement[] | null) => {
        try {
            refList![index].blur();
            setEditableLabel(null);
            await updateNotionCreditorName(page_id, value);
        } catch (error) {
            console.log(error);
        } finally {
            // queryClient.invalidateQueries({ queryKey: ['notion_list'] });
        }
    }

    const handleChangePhoneNumber = async (page_id: string, type: string, value: string, index: number, refList: HTMLInputElement[] | null) => {
        try {
            refList![index].blur();
            await updateNotionPhoneNumber(page_id, type, value);
        } catch (error) {
            console.log(error);

        } finally {
            // queryClient.invalidateQueries({ queryKey: ['notion_list'] });
        }
    }

    const handleChangeEmail = async (page_id: string, value: string, index: number, refList: HTMLInputElement[] | null) => {
        refList![index].blur();
        await updateNotionEmail(page_id, value);
    }

    const handleChangeProposalPrice = async (page_id: string, value: string, index: number, refList: HTMLInputElement[] | null) => {
        refList![index].blur();
        const formatedValue = value.replace(/[^0-9,]/g, '');
        const valueToNumber = parseFloat(formatedValue);
        await updateNotionProposalPrice(page_id, valueToNumber);
    }

    const buildQuery = useCallback(() => {
        return {
            "and": [
                {
                    "property": "Usuário",
                    "multi_select": {
                        "contains": user
                    }
                },
                {
                    "property": "Status",
                    "status": {
                        "equals": statusSelectValue || ''
                    }
                },
                {
                    "property": "Tipo",
                    "select": {
                        "equals": oficioSelectValue || ''
                    }
                }
            ]
        };
    }, [user, statusSelectValue, oficioSelectValue]);

    useEffect(() => {
        const updatedQuery = buildQuery();
        setCurrentQuery(updatedQuery);
        setListQuery(updatedQuery);

        if (Object.keys(updatedQuery).length > 0) {
            refetch();
        }
    }, [user, statusSelectValue, oficioSelectValue, buildQuery, refetch]);

    const handleFilterByTipoOficio = (oficio: tipoOficio) => {
        setOficioSelectValue(oficio);
        setOpenTipoOficioPopover(false);
        setListQuery({
            "and": [
                {
                    "property": "Usuário",
                    "multi_select": {
                        "contains": user
                    }
                },
                {
                    "property": "Tipo",
                    "select": {
                        "equals": oficio
                    }
                },
                {
                    "property": "Status",
                    "status": {
                        "equals": statusSelectValue || ''
                    }
                }
            ]
        });
    }

    const handleCleanStatusFilter = () => {
        setStatusSelectValue(null);
        setOficioSelectValue(null);
        setActiveFilter('ALL');
        setListQuery({
            "property": "Usuário",
            "multi_select": {
                "contains": user
            }
        });
    }

    const searchStatus = (value: string) => {
        if (!value) {
            setFilteredValues(ENUM_OFICIOS_LIST);
            return;
        }
        setFilteredValues(ENUM_OFICIOS_LIST.filter((status) => status.toLowerCase().includes(value.toLowerCase())));
    }

    const handleSelectStatus = (status: statusOficio) => {
        setOpenStatusPopover(false);
        setFilteredValues(ENUM_OFICIOS_LIST);
        setStatusSelectValue(status);
        searchRef.current!.value = '';
        setListQuery({
            "and": [
                {
                    "property": "Usuário",
                    "multi_select": {
                        "contains": user
                    }
                },
                {
                    "property": "Status",
                    "status": {
                        "equals": status
                    }
                },
                {
                    "property": "Tipo",
                    "select": {
                        "equals": oficioSelectValue || ''
                    }
                }
            ]
        });

    }

    const handleChangeViews = (view: string) => {

        console.log(view);

        switch (view) {
            case "Realizar 1º Contato":
                displayViewFirstContact();
                break;

            case "Geral":
                displayViewDefault()
                break;

            default:
                break;
        }

    }

    const displayViewDefault = () => {
        setStatusSelectValue(null);
        setOficioSelectValue(null);
        setNotionView("GERAL");
        setListQuery(
            {
                "property": "Usuário",
                "multi_select": {
                    "contains": user
                }
            }
        )
    }

    const displayViewFirstContact = async () => {
        setNotionView("REALIZAR 1º CONTATO");
        setListQuery(
            {

                "and":
                    [
                        {
                            "property": "Usuário",
                            "multi_select": {
                                "contains": user
                            }
                        },
                        {
                            "or":
                                [
                                    {
                                        "property": "Status",
                                        "status": {
                                            "equals": "Realizar Primeiro Contato"
                                        }
                                    },
                                    {
                                        "property": "Status",
                                        "status": {
                                            "equals": "1º Contato não alcançado"
                                        }
                                    },
                                    {
                                        "property": "Status",
                                        "status": {
                                            "equals": "2º Contato não alcançado"
                                        }
                                    },
                                    {
                                        "property": "Status",
                                        "status": {
                                            "equals": "3º Contato não alcançado"
                                        }
                                    }
                                ]
                        }
                    ]
            }
        );
    }

    const displayViewOfficeType = async () => {
        setNotionView("juntar ofício/valor líquido");
        setListQuery(
            {

                "and":
                    [
                        {
                            "property": "Usuário",
                            "multi_select": {
                                "contains": user
                            }
                        },
                        {
                            "or":
                                [
                                    {
                                        "property": "Status",
                                        "status": {
                                            "equals": "Juntar Ofício ou Memória de Cálculo"
                                        }
                                    },
                                    {
                                        "property": "Status",
                                        "status": {
                                            "equals": "Calcular Valor Líquido"
                                        }
                                    }
                                ]
                        }
                    ]
            }
        )
    };

    useEffect(() => {
        if (Object.keys(listQuery).length > 0) {
            refetch();
        }
    }, [notionView])

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }: MouseEvent) => {
            if (openStatusPopover || openTipoOficioPopover) {
                if (
                    selectStatusRef?.current?.contains(target) ||
                    selectTipoOficioRef?.current?.contains(target)
                ) return;
                setOpenStatusPopover(false);
                setOpenTipoOficioPopover(false);
            };
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (!openStatusPopover || !openTipoOficioPopover || keyCode !== 27) return;
            setOpenStatusPopover(false);
            setOpenTipoOficioPopover(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    return (
        <>
            <div className="flex gap-3 flex-1 items-center">
                <div
                    onClick={() => handleChangeViews('Geral')}
                    className={`flex items-center justify-center gap-2 py-1 font-semibold px-2 text-xs hover:bg-slate-100 uppercase dark:hover:bg-form-strokedark rounded-md transition-colors duration-200 cursor-pointer ${notionView === "GERAL" && 'bg-slate-100 dark:bg-form-strokedark'}`}>
                    <ImTable />
                    <span>todos</span>
                </div>
                {/* {
                ENUM_TIPO_OFICIOS_LIST.map((oficio) => (
                    <div
                        key={oficio}
                        onClick={() => handleOficioStatus(oficio)}
                        className={`flex items-center justify-center gap-2 py-1 font-semibold px-2 text-xs hover:bg-slate-100 uppercase dark:hover:bg-form-strokedark rounded-md transition-colors duration-200 cursor-pointer ${activeFilter === oficio && 'bg-slate-100 dark:bg-form-strokedark'}`}>
                        <ImTable />
                        <span>{oficio}</span>
                    </div>
                ))
            } */}
                {
                    notionViews.map((view) => (
                        <div
                            key={view}
                            onClick={() => handleChangeViews(view)}
                            className={`flex items-center justify-center gap-2 py-1 font-semibold px-2 text-xs hover:bg-slate-100 uppercase dark:hover:bg-form-strokedark rounded-md transition-colors duration-200 cursor-pointer ${notionView === view.toUpperCase() && 'bg-slate-100 dark:bg-form-strokedark'}`}>
                            <ImTable />
                            <span>{view}</span>
                        </div>
                    ))
                }
            </div>

            {/* Filtros estilo select */}
            <div className='flex items-center gap-2 mt-3'>
                <div className='flex items-center justify-center gap-1'>
                    <div className='relative'>
                        <div className='flex items-center justify-center'>
                            <div
                                onClick={() => setOpenStatusPopover(!openStatusPopover)}
                                className={`min-w-48 flex items-center justify-between gap-1 border border-stroke dark:border-strokedark text-xs font-semibold py-1 px-2 hover:bg-slate-100 uppercase dark:hover:bg-slate-700 ${openStatusPopover && 'bg-slate-100 dark:bg-slate-700'} rounded-md transition-colors duration-200 cursor-pointer`}>
                                <span>
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
                                        ref={searchRef}
                                        type="text"
                                        placeholder='Pesquisar'
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
                                className={`absolute mt-3 w-[230px] z-20 p-3 rounded-md bg-white dark:bg-form-strokedark shadow-1 border border-stroke dark:border-strokedark ${openTipoOficioPopover ? 'opacity-100 visible animate-in fade-in-0 zoom-in-95' : ' animate-out fade-out-0 zoom-out-95 invisible opacity-0'} transition-opacity duration-500`}>
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
                    {oficioSelectValue && (
                        <div
                            title='limpar filtro de status'
                            className={`${oficioSelectValue ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-y-5'} relative w-6 h-6 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-all duration-500 cursor-pointer`}
                            onClick={handleCleanStatusFilter}
                        >
                            <MdOutlineFilterAltOff />
                        </div>
                    )}
                </div>
            </div>
            {/* End Filtros estilo select */}

            <MiniMenu count={data?.results.length || 0} />

            <div className='w-full flex justify-end items-right'>
                {
                    <div className='w-full mb-2 h-4 flex justify-end items-center'>
                        <div className={`${isFetching ? "opacity-100 visible" : "opacity-0 invisible"} text-center flex justify-center items-center transition-all duration-300`}>
                            <span className='text-xs mr-2 text-meta-4'>
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

            {notionView === 'GERAL' && (
                <Flowbite theme={{ theme: customFlowBiteTheme }}>
                    <Table>
                        <TableHead>

                            <TableHeadCell className="w-[120px]">
                                <div className='flex gap-2 items-center'>
                                    <IoDocumentTextOutline className='text-base' />
                                    Oficio
                                </div>
                            </TableHeadCell>
                            <TableHeadCell>
                                <div className='flex gap-2 items-center'>
                                    <AiOutlineUser className='text-base' />
                                    Nome do Credor
                                </div>
                            </TableHeadCell>
                            <TableHeadCell className="w-[180px]">
                                <div className="flex gap-2 items-center">
                                    <LiaCoinsSolid className='text-base' />
                                    Valor Líquido
                                </div>
                            </TableHeadCell>
                            <TableHeadCell className="w-[0px]">
                                <div className="flex gap-2 items-center">
                                    <BiLoader className='text-base' />
                                    Status
                                </div>
                            </TableHeadCell>

                        </TableHead>
                        <TableBody className=''>
                            {isPending ? (
                                null
                            ) : (
                                <React.Fragment>
                                    {data?.results?.length > 0 && (
                                        <>
                                            {data?.results.map((item: NotionPage, index: number) => (

                                                <TableRow key={item.id} className={`${checkedList!.some(target => target.id === item.id) && 'bg-blue-50 dark:bg-form-strokedark'} hover:shadow-3 dark:hover:shadow-body group`}>


                                                    <TableCell className="text-center whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                        <div className='flex items-center justify-center gap-3'>
                                                            <input
                                                                type="checkbox"
                                                                checked={checkedList!.some(target => target.id === item.id)}
                                                                className={`opacity-50 w-[15px] group-hover:opacity-100 ${checkedList!.some(target => target.id === item.id) && '!opacity-100'} h-[15px] bg-transparent focus-within:ring-0 selection:ring-0 duration-100 border-2 border-body dark:border-bodydark rounded-[3px] cursor-pointer`}
                                                                onChange={() => handleSelectRow(item)}
                                                            />
                                                            <Badge color="indigo" size="sm" className="max-w-full text-[12px]">
                                                                <select className="text-[12px] bg-transparent border-none py-0 focus-within:ring-0" onChange={(e) => updateTipoAtNotion(item.id, e.target.value as tipoOficio)}>
                                                                    {item.properties.Tipo.select?.name && (
                                                                        <option value={item.properties.Tipo.select?.name} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                            {item.properties.Tipo.select?.name}
                                                                        </option>
                                                                    )}
                                                                    {ENUM_TIPO_OFICIOS_LIST.filter((status) => status !== item.properties.Tipo.select?.name).map((status) => (
                                                                        <option key={status} value={status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                            {status}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell title={item.properties.Credor?.title[0].text.content || ''}
                                                        className="relative h-full  flex items-center gap-2 font-semibold text-[12px]"
                                                    >
                                                        <input
                                                            type="text"
                                                            ref={(input) => { if (input) inputRefs.current![index] = input; }}
                                                            defaultValue={item.properties.Credor?.title[0].text.content || ''}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                                    handleChangeCreditorName(e.currentTarget.value, index, item.id, inputRefs.current)
                                                                }
                                                            }}
                                                            onBlur={(e) => handleChangeCreditorName(e.currentTarget.value, index, item.id, inputRefs.current)}
                                                            className={`${editableLabel === item.id && '!border-1 !border-blue-700'} w-full pl-1 focus-within:ring-0 text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                                        />
                                                        {/* absolute div that covers the entire cell */}
                                                        {editableLabel !== item.id && (
                                                            <div className='absolute inset-0 rounded-md flex items-center transition-all duration-200'>
                                                                {editableLabel === null && (
                                                                    <React.Fragment>
                                                                        <div className='flex-1 h-full flex items-center select-none cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200'
                                                                            onClick={() => {
                                                                                setEditableLabel!(item.id)
                                                                                handleEditInput(index, inputRefs.current);
                                                                            }}>
                                                                            {item.properties.Credor?.title[0].plain_text?.length === 0 && (
                                                                                <div className='flex gap-1 pl-4 text-slate-400'>
                                                                                    <PiCursorClick className='text-base' />
                                                                                    <span>Clique para adicionar nome</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div
                                                                            title='Abrir'
                                                                            className='py-1 px-2 mr-1 flex items-center justify-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                                                                            onClick={() => {
                                                                                handleNotionDrawer(item.id)
                                                                            }}>
                                                                            <BiSolidDockLeft className='text-lg'
                                                                            />
                                                                            <span className='text-xs'>Abrir</span>
                                                                        </div>
                                                                        {item.url && (
                                                                            <a href={item.url} target='_blank' rel='referrer'
                                                                                title='Abrir no Notion'
                                                                                className='py-1 px-2 mr-1 flex items-center justify-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                                                                            >
                                                                                <RiNotionFill className='text-lg'
                                                                                />
                                                                                <span className='text-xs'>Notion</span>
                                                                            </a>)}
                                                                    </React.Fragment>
                                                                )}
                                                            </div>
                                                        )}

                                                    </TableCell>
                                                    <TableCell className=" font-semibold text-[14px]">
                                                        <div className="relative">
                                                            {numberFormat(item.properties['Valor Líquido'].formula?.number || 0)}
                                                            <ImCopy
                                                                title='Copiar valor'
                                                                onClick={() => handleCopyValue(index)}
                                                                className='absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center items-center ">
                                                        <Badge color="teal" size="sm" className="text-center text-[12px]">
                                                            <select className="text-[12px] w-44 text-ellipsis overflow-x-hidden whitespace-nowrap bg-transparent border-none py-0 focus-within:ring-0 uppercase" onChange={(e) => {
                                                                updateStatusAtNotion(item.id, e.target.value as statusOficio)
                                                            }}>
                                                                {item.properties.Status.status?.name && (
                                                                    <option value={item.properties.Status.status?.name} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                        {selectedStatusValue || item.properties.Status.status?.name}
                                                                    </option>
                                                                )}
                                                                {ENUM_OFICIOS_LIST.filter((status) => status !== item.properties.Status.status?.name).map((status) => (
                                                                    <option key={status} value={status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                        {status}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </Badge>
                                                    </TableCell>

                                                </TableRow>
                                            ))}
                                        </>
                                    )}
                                </React.Fragment>
                            )}
                        </TableBody>
                    </Table>
                </Flowbite>
            )}


            {notionView === 'REALIZAR 1º CONTATO' &&
                <MakeFirstContact
                    isFetching={isFetching}
                    data={data}
                    checkedList={checkedList}
                    editableLabel={editableLabel}
                    setEditableLabel={setEditableLabel}
                    selectStatusValue={statusSelectValue}
                    setStatusSelectValue={setStatusSelectValue}
                    handleSelectRow={handleSelectRow}
                    handleChangeCreditorName={handleChangeCreditorName}
                    handleEditInput={handleEditInput}
                    handleChangePhoneNumber={handleChangePhoneNumber}
                    handleChangeEmail={handleChangeEmail}
                    updateStatusAtNotion={updateStatusAtNotion}
                />
            }

            {notionView === 'juntar ofício/valor líquido' &&
                <OfficeTypeAndValue
                    isFetching={isFetching}
                    data={data}
                    checkedList={checkedList}
                    editableLabel={editableLabel}
                    setEditableLabel={setEditableLabel}
                    statusSelectValue={statusSelectValue}
                    oficioSelectValue={oficioSelectValue}
                    numberFormat={numberFormat}
                    handleSelectRow={handleSelectRow}
                    handleChangeCreditorName={handleChangeCreditorName}
                    handleEditInput={handleEditInput}
                    updateStatusAtNotion={updateStatusAtNotion}
                    updateTipoAtNotion={updateTipoAtNotion}
                    handleCopyValue={handleCopyValue}
                />
            }

            {notionView === 'enviar proposta/negociação' &&
                <SendProposal
                    isFetching={isFetching}
                    data={data}
                    checkedList={checkedList}
                    editableLabel={editableLabel}
                    setEditableLabel={setEditableLabel}
                    statusSelectValue={statusSelectValue}
                    oficioSelectValue={oficioSelectValue}
                    numberFormat={numberFormat}
                    handleSelectRow={handleSelectRow}
                    handleChangeCreditorName={handleChangeCreditorName}
                    handleEditInput={handleEditInput}
                    updateStatusAtNotion={updateStatusAtNotion}
                    handleChangeProposalPrice={handleChangeProposalPrice}
                    handleCopyValue={handleCopyValue}
                />
            }

            {isFetching &&
                <p className='text-center p-10 text-'>Carregando dados do notion...</p>
            }

        </>

    )
}

export default NotionTableView
