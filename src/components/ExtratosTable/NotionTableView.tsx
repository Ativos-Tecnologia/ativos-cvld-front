import { Badge, CustomFlowbiteTheme, Flowbite, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import numberFormat from "@/functions/formaters/numberFormat";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BiLoader, BiSolidDockLeft } from 'react-icons/bi';
import statusOficio from '@/enums/statusOficio.enum';
import tipoOficio from '@/enums/tipoOficio.enum';
import { ImCopy, ImTable } from 'react-icons/im';
import { ENUM_OFICIOS_LIST, ENUM_TIPO_OFICIOS_LIST } from '@/constants/constants';
import { AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import { toast } from 'sonner';
import { ActiveState, ExtratosTableContext } from '@/context/ExtratosTableContext';
import { NotionPage } from '@/interfaces/INotion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UserInfoAPIContext } from '@/context/UserInfoContext';
import api from '@/utils/api';
import { MdOutlineFilterAltOff } from 'react-icons/md';
import { MiniMenu } from './MiniMenu';
import { LucideChevronsUpDown } from 'lucide-react';
import MakeFirstContact from '../TablesNotion/MakeFirstContact';
import { OfficeTypeAndValue } from '../TablesNotion/OfficeTypeAndValue';
import { SendProposal } from '../TablesNotion/SendProposal';
import { ProposalAccepted } from '../TablesNotion/ProposalAccepted';
import GeneralView from '../TablesNotion/GeneralView';


const notionViews: string[] = [
    'realizar 1º contato',
    'juntar ofício/valor líquido',
    'enviar proposta/negociação',
    'proposta aceita'
]

type NotionTableViewProps = {
    count?: number;
    setExtratosTableToNotionDrawersetId: React.Dispatch<React.SetStateAction<string>>;
    setNotionDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotionTableView = ({ count, setExtratosTableToNotionDrawersetId, setNotionDrawer }: NotionTableViewProps) => {

    const [notionView, setNotionView] = useState<string>('geral');
    const [checkedList, setCheckedList] = React.useState<NotionPage[]>([]);
    const [openStatusPopover, setOpenStatusPopover] = useState<boolean>(false);
    const [openTipoOficioPopover, setOpenTipoOficioPopover] = useState<boolean>(false);
    const [openUsersPopover, setOpenUsersPopover] = useState<boolean>(false);
    const [filteredValues, setFilteredValues] = useState<statusOficio[]>(ENUM_OFICIOS_LIST);
    const [fetchingValue, setFetchingValue] = useState<string | null>(null);
    const searchRef = useRef<HTMLInputElement | null>(null);
    const selectStatusRef = useRef<any>(null);
    const selectTipoOficioRef = useRef<any>(null);
    const selectUserRef = useRef<any>(null);

    const secondaryDefaultFilterObject = useMemo(() => {
        return {
            "and":
                [
                    {
                        "property": "Status",
                        "status": {
                            "does_not_equal": "Já vendido"
                        }
                    },
                    {
                        "property": "Status",
                        "status": {
                            "does_not_equal": "Considerou Preço Baixo"
                        }
                    },
                    {
                        "property": "Status",
                        "status": {
                            "does_not_equal": "Contato inexiste"
                        }
                    },
                    {
                        "property": "Status",
                        "status": {
                            "does_not_equal": "Ausência de resposta"
                        }
                    },
                    {
                        "property": "Status",
                        "status": {
                            "does_not_equal": "Transação Concluída"
                        }
                    },
                    {
                        "property": "Status",
                        "status": {
                            "does_not_equal": "Ausência de resposta"
                        }
                    }
                ]
        }
    }, []);



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
    const { data: { user, role } } = useContext(UserInfoAPIContext);

    const defaultFilterObject = {
        "and":
            [
                {
                    "property": "Usuário",
                    "multi_select": {
                        "contains": user
                    }
                },
                secondaryDefaultFilterObject
            ]
    }

    const [currentQuery, setCurrentQuery] = useState({});

    const [statusSelectValue, setStatusSelectValue] = useState<statusOficio | null>(null);
    const [oficioSelectValue, setOficioSelectValue] = useState<tipoOficio | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [activeFilter, setActiveFilter] = useState<ActiveState>('ALL');
    const [usersList, setUsersList] = useState<string[]>([])
    const [listQuery, setListQuery] = useState<object>(defaultFilterObject);


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
            // refetchInterval: 1000 * 15, // 15 seconds
            staleTime: 1000 * 5, // 5 seconds
            queryFn: fetchNotionData,
        },
    );

    const archiveNotionPage = async (page_id: string, choice = true) => { // choice = true to archive, false to unarchive
        try {
            const resNotion = await api.patch(`notion-api/archive/<str:page_id>/${page_id}/`, {
                "archived": choice
            });
            if (resNotion.status !== 202) {
                console.log('houve um erro ao salvar os dados no notion');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateStatusAtNotion = async (page_id: string, status: statusOficio) => {

        setFetchingValue(page_id);
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
        } catch (error) {
            console.log(error)
        } finally {
            setFetchingValue(null);
        }
    }

    const updateTipoAtNotion = async (page_id: string, tipo: tipoOficio) => {

        setFetchingValue(page_id);
        try {
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
        } catch (error) {
            console.log(error)
        } finally {
            setFetchingValue(null);
        }

    }

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

    const updateNotionProposalPrice = async (page_id: string, value: number) => {
        setFetchingValue(page_id);
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
        } finally {
            setFetchingValue(null);
        }
    }

    const updateNotionFupDate = async (page_id: string, value: string, type: string, index: number) => {

        try {

            let responseStatus: number = 0;

            if (data.results[index].properties[type].date === null) {

                const dateObject = {
                    end: null,
                    start: value,
                    time_zone: null
                }

                const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
                    [type]: {
                        "date": dateObject
                    }
                });

                responseStatus = resNotion.status;

            } else {
                const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
                    [type]: {
                        "date": {
                            "start": value
                        }
                    }
                });

                responseStatus = resNotion.status;
            }

            if (responseStatus !== 202) {
                console.log('houve um erro ao salvar os dados no notion');
            }
        } catch (error) {
            console.log(error);
        }
    }

    // refs
    // setNotionWorkspaceData(data)

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

    const handleEditStatus = async (page_id: string, status: statusOficio) => {
        await updateStatusAtNotion(page_id, status);
        queryClient.invalidateQueries({ queryKey: ['notion_list'] });
    }

    const handleEditTipoOficio = async (page_id: string, oficio: tipoOficio) => {
        await updateTipoAtNotion(page_id, oficio);
        queryClient.invalidateQueries({ queryKey: ['notion_list'] });
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
        queryClient.invalidateQueries({ queryKey: ['notion_list'] });
    }

    const handleChangeFupDate = async (page_id: string, value: string, type: string, index: number) => {

        if (/^[0-9/]{10}$/.test(value)) {

            const parsedValue = value.split('/').reverse().join('-');
            await updateNotionFupDate(page_id, parsedValue, type, index);

        } else {
            console.log('um campo de data precisa de 8 caracteres');
        }
    }

    const buildQuery = useCallback(() => {
        return {
            "and": [
                {
                    "property": "Usuário",
                    "multi_select": {
                        "contains": selectedUser || user
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
                },
                secondaryDefaultFilterObject
            ]
        };
    }, [user, statusSelectValue, oficioSelectValue, secondaryDefaultFilterObject, selectedUser]);

    useEffect(() => {
        const updatedQuery = buildQuery();
        setCurrentQuery(updatedQuery);
        setListQuery(updatedQuery);

        if (Object.keys(updatedQuery).length > 0) {
            refetch();
        }
    }, [user, statusSelectValue, oficioSelectValue, selectedUser, buildQuery, refetch]);

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

    const handleFilterByUser = (user: string) => {
        setOpenUsersPopover(false)
        setSelectedUser(user);
        setListQuery({
            "property": "Usuário",
            "multi_select": {
                "contains": user
            }
        });
    }

    const handleCleanAllFilters = () => {
        setStatusSelectValue(null);
        setOficioSelectValue(null);
        setSelectedUser(null);
        setListQuery(defaultFilterObject);
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

        switch (view) {
            case "geral":
                displayViewDefault()
                break;
            case 'realizar 1º contato':
                displayViewFirstContact();
                break;
            case 'juntar ofício/valor líquido':
                displayViewOfficeType();
                break;
            case 'enviar proposta/negociação':
                displayViewNegociation();
                break;
            case 'proposta aceita':
                displayViewProposalAccepted();
                break;

            default:
                break;
        }

    }

    const displayViewDefault = () => {
        setStatusSelectValue(null);
        setOficioSelectValue(null);
        setNotionView("geral");
        setListQuery(
            {

                "and":
                    [
                        {
                            "property": "Usuário",
                            "multi_select": {
                                "contains": selectedUser || user
                            }
                        },
                        {
                            "and":
                                [
                                    {
                                        "property": "Status",
                                        "status": {
                                            "does_not_equal": "Já vendido"
                                        }
                                    },
                                    {
                                        "property": "Status",
                                        "status": {
                                            "does_not_equal": "Considerou Preço Baixo"
                                        }
                                    },
                                    {
                                        "property": "Status",
                                        "status": {
                                            "does_not_equal": "Contato inexiste"
                                        }
                                    },
                                    {
                                        "property": "Status",
                                        "status": {
                                            "does_not_equal": "Ausência de resposta"
                                        }
                                    },
                                    {
                                        "property": "Status",
                                        "status": {
                                            "does_not_equal": "Transação Concluída"
                                        }
                                    },
                                    {
                                        "property": "Status",
                                        "status": {
                                            "does_not_equal": "Ausência de resposta"
                                        }
                                    }
                                ]
                        }
                    ]
            }
        )
    }

    const displayViewFirstContact = async () => {
        setNotionView('realizar 1º contato');
        setListQuery(
            {

                "and":
                    [
                        {
                            "property": "Usuário",
                            "multi_select": {
                                "contains": selectedUser || user
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
                                "contains": selectedUser || user
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

    const displayViewNegociation = async () => {
        setNotionView("enviar proposta/negociação");
        setListQuery({

            "and":
                [
                    {
                        "property": "Usuário",
                        "multi_select": {
                            "contains": selectedUser || user
                        }
                    },
                    {
                        "or":
                            [
                                {
                                    "property": "Status",
                                    "status": {
                                        "equals": "Enviar proposta"
                                    }
                                },
                            ]
                    }
                ]
        });
    }

    const displayViewProposalAccepted = async () => {
        setNotionView('proposta aceita');
        setListQuery(
            {
                "and":
                    [
                        {
                            "property": "Usuário",
                            "multi_select": {
                                "contains": selectedUser || user
                            }
                        },
                        {
                            "or":
                                [
                                    {
                                        "property": "Status",
                                        "status": {
                                            "equals": "Proposta aceita"
                                        }
                                    }
                                ]
                        }
                    ]
            }
        )
    }

    useEffect(() => {
        if (Object.keys(listQuery).length > 0) {
            refetch();
        }
    }, [notionView])

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

    // close on click outside
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
                    onClick={() => handleChangeViews('geral')}
                    className={`flex items-center justify-center gap-2 py-1 font-semibold px-2 text-xs hover:bg-slate-100 uppercase dark:hover:bg-form-strokedark rounded-md transition-colors duration-200 cursor-pointer ${notionView === "geral" && 'bg-slate-100 dark:bg-form-strokedark'}`}>
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
                            className={`flex items-center justify-center gap-2 py-1 font-semibold px-2 text-xs hover:bg-slate-100 uppercase dark:hover:bg-form-strokedark rounded-md transition-colors duration-200 cursor-pointer ${notionView === view && 'bg-slate-100 dark:bg-form-strokedark'}`}>
                            <ImTable />
                            <span>{view}</span>
                        </div>
                    ))
                }
            </div>

            {/* Filtros estilo select */}
            <div className='flex items-center justify-between mt-3'>
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
                    </div>
                    {/* ====== select de statusOficio ====== */}

                    {/* ====== select de tipoOficio ====== */}
                    {(notionView === 'geral' || notionView === notionViews[1]) && (
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
                            </div>
                        </>
                    )}
                    {/* ====== finaliza select de tipoOficio ====== */}

                    {(role === 'ativos' && notionView === 'geral') && (
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
                            {/* ====== finaliza select de user ====== */}
                        </React.Fragment>
                    )}

                </div>
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
            </div>
            {/* End Filtros estilo select */}

            <MiniMenu count={data?.results.length || 0} />

            {notionView === 'geral' && (
                <GeneralView
                    isPending={isPending}
                    data={data}
                    checkedList={checkedList}
                    fetchingValue={fetchingValue}
                    handleSelectRow={handleSelectRow}
                    handleEditTipoOficio={handleEditTipoOficio}
                    handleChangeCreditorName={handleChangeCreditorName}
                    editableLabel={editableLabel}
                    setEditableLabel={setEditableLabel}
                    handleEditInput={handleEditInput}
                    handleNotionDrawer={handleNotionDrawer}
                    handleCopyValue={handleCopyValue}
                    handleEditStatus={handleEditStatus}
                    statusSelectValue={statusSelectValue}
                />
            )}


            {notionView === 'realizar 1º contato' &&
                <MakeFirstContact
                    isPending={isPending}
                    data={data}
                    checkedList={checkedList}
                    editableLabel={editableLabel}
                    setEditableLabel={setEditableLabel}
                    selectStatusValue={statusSelectValue}
                    handleNotionDrawer={handleNotionDrawer}
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
                    isPending={isPending}
                    data={data}
                    checkedList={checkedList}
                    editableLabel={editableLabel}
                    setEditableLabel={setEditableLabel}
                    statusSelectValue={statusSelectValue}
                    oficioSelectValue={oficioSelectValue}
                    handleNotionDrawer={handleNotionDrawer}
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
                    isPending={isPending}
                    data={data}
                    checkedList={checkedList}
                    editableLabel={editableLabel}
                    setEditableLabel={setEditableLabel}
                    statusSelectValue={statusSelectValue}
                    fetchingValue={fetchingValue}
                    handleNotionDrawer={handleNotionDrawer}
                    handleSelectRow={handleSelectRow}
                    handleChangeCreditorName={handleChangeCreditorName}
                    handleEditInput={handleEditInput}
                    handleEditStatus={handleEditStatus}
                    handleChangeProposalPrice={handleChangeProposalPrice}
                    handleCopyValue={handleCopyValue}
                    handleChangeFupDate={handleChangeFupDate}
                />
            }

            {notionView === 'proposta aceita' &&
                <ProposalAccepted
                    isPending={isPending}
                    data={data}
                    checkedList={checkedList}
                    editableLabel={editableLabel}
                    setEditableLabel={setEditableLabel}
                    statusSelectValue={statusSelectValue}
                    fetchingValue={fetchingValue}
                    numberFormat={numberFormat}
                    handleNotionDrawer={handleNotionDrawer}
                    handleSelectRow={handleSelectRow}
                    handleChangeCreditorName={handleChangeCreditorName}
                    handleEditInput={handleEditInput}
                    updateStatusAtNotion={updateStatusAtNotion}
                    updateTipoAtNotion={updateTipoAtNotion}
                    handleCopyValue={handleCopyValue}
                />
            }
            {/* {isPending &&
                <p className='text-center p-10 text-'>Carregando dados do Notion...</p>
            } */}
        </>

    )
}

export default NotionTableView
