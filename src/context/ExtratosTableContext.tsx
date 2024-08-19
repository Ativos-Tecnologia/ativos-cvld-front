"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import api from "@/utils/api";
import { PaginatedResponse } from "@/components/TaskElements";
import { CVLDResultProps } from "@/interfaces/IResultCVLD";
import statusOficio from "@/enums/statusOficio.enum";
import tipoOficio from "@/enums/tipoOficio.enum";
import { toast } from "sonner";
import { AxiosResponse } from "axios";
import useUpdateOficio from "@/hooks/useUpdateOficio";
import { NotionResponse } from "@/interfaces/INotion";
import { UserInfoAPIContext } from "./UserInfoContext";
import { QueryClient } from "@tanstack/react-query";

// types
export type ActiveState = "ALL" | "PRECATÓRIO" | "R.P.V" | "CREDITÓRIO";

export type Tabs = 'GERAL' | 'ARQUIVADOS' | 'WORKSPACE NOTION';

export type LocalExtractViewProps = {
    type: string;
}

export type LocalShowOptionsProps = {
    key: string;
    active: boolean;
}

export type ModalOptionsProps = {
    open: boolean,
    items: CVLDResultProps[] | never[]
}

// main interface
export interface IExtratosTable {
    /*  ====> states <===== */
    data: PaginatedResponse<CVLDResultProps>;
    setData: React.Dispatch<React.SetStateAction<PaginatedResponse<CVLDResultProps>>>;
    auxData: PaginatedResponse<CVLDResultProps>;
    setAuxData: React.Dispatch<React.SetStateAction<PaginatedResponse<CVLDResultProps>>>;
    statusSelectValue: statusOficio | null;
    setStatusSelectValue: React.Dispatch<React.SetStateAction<statusOficio | null>>;
    oficioSelectValue: tipoOficio | null;
    setOficioSelectValue: React.Dispatch<React.SetStateAction<tipoOficio | null>>;
    activeFilter: ActiveState;
    setActiveFilter: React.Dispatch<React.SetStateAction<ActiveState>>;
    activedTab: Tabs;
    setActivedTab: React.Dispatch<React.SetStateAction<Tabs>>;
    editableLabel: string | null;
    setEditableLabel: React.Dispatch<React.SetStateAction<string | null>>;
    item: any;
    setItem: React.Dispatch<React.SetStateAction<any>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    viewOption: LocalExtractViewProps;
    setViewOption: React.Dispatch<React.SetStateAction<LocalExtractViewProps>>;
    responseStatus: string;
    setResponseStatus: React.Dispatch<React.SetStateAction<string>>;
    checkedList: CVLDResultProps[] | never[];
    setCheckedList: React.Dispatch<React.SetStateAction<CVLDResultProps[] | never[]>>;
    localShowOptions: LocalShowOptionsProps[];
    setLocalShowOptions: React.Dispatch<React.SetStateAction<LocalShowOptionsProps[]>>;
    showModalMessage: boolean;
    setShowModalMessage: React.Dispatch<React.SetStateAction<boolean>>;
    openDetailsDrawer: boolean;
    setOpenDetailsDrawer: React.Dispatch<React.SetStateAction<boolean>>;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    modalOptions: ModalOptionsProps
    setModalOptions: React.Dispatch<React.SetStateAction<ModalOptionsProps>>;
    notionWorkspaceData: NotionResponse;
    setNotionWorkspaceData: React.Dispatch<React.SetStateAction<NotionResponse>>;
    fetchNotionData : () => Promise<any>;
    listQuery: {};
    setListQuery: React.Dispatch<React.SetStateAction<{}>>;
    tanstackRefatch: any
    setTanstackRefatch: React.Dispatch<React.SetStateAction<any>>;



    /* ====> refs <==== */
    mainRef: any;

    /*  ====> functions <===== */
    handleOficio: (id: string, tipo: tipoOficio, page_id?: string) => void,
    handleStatus: (id: string, status: statusOficio, page_id?: string) => void,
    fetchData: (query: string, username?: string) => Promise<void>;
    fetchDelete: (ids: string[]) => Promise<void>;
    fetchDataById: (id: string) => Promise<void>;
    fetchStateFromLocalStorage: () => void;
    onPageChange: (page: number) => Promise<void>;
    handleRestoreData: () => Promise<void>;
    handleUnarchiveExtrato: () => Promise<void>;
    handleArchiveExtrato: () => Promise<void>;
    handleSelectAllRows: () => void;
    handleDeleteExtrato: () => void;
    handleSelectRow: (item: CVLDResultProps) => void;
    updateCreditorName: (id: string, value: string, page_id?: string) => Promise<void>;
    setDontShowAgainDeleteExtractAlert: (key: string) => void;
    setExtractListView: (type: string) => void;
    callScrollTop: (ref: HTMLDivElement | null) => void;

}

/* ===================> Context <================== */
export const ExtratosTableContext = createContext<IExtratosTable>({
    /*  ====> states <===== */
    data: { results: [], count: 0, next: "", previous: "" },
    setData: () => { },
    auxData: { results: [], count: 0, next: "", previous: "" },
    setAuxData: () => { },
    statusSelectValue: null,
    setStatusSelectValue: () => { },
    oficioSelectValue: null,
    setOficioSelectValue: () => { },
    activeFilter: "ALL",
    setActiveFilter: () => { },
    activedTab: "GERAL",
    setActivedTab: () => { },
    editableLabel: null,
    setEditableLabel: () => { },
    item: {},
    setItem: () => { },
    loading: false,
    setLoading: () => { },
    viewOption: { type: "table" },
    setViewOption: () => { },
    responseStatus: "",
    setResponseStatus: () => { },
    checkedList: [],
    setCheckedList: () => { },
    localShowOptions: [],
    setLocalShowOptions: () => { },
    showModalMessage: true,
    setShowModalMessage: () => { },
    openDetailsDrawer: false,
    setOpenDetailsDrawer: () => { },
    currentPage: 1,
    setCurrentPage: () => { },
    modalOptions: {
        open: false,
        items: []
    },
    setModalOptions: () => { },
    notionWorkspaceData: {
        object: "list",
        results: []
    },
    setNotionWorkspaceData: () => { },
    fetchNotionData: (): Promise<any> => { return new Promise(() => { }) },
    listQuery: {},
    setListQuery: () => { },
    tanstackRefatch: () => { },
    setTanstackRefatch: () => { },



    mainRef: null,

    /*  ====> functions <===== */
    handleOficio: () => { },
    handleStatus: () => { },
    fetchData: async () => { },
    fetchDelete: async () => { },
    fetchDataById: async () => { },
    fetchStateFromLocalStorage: () => { },
    onPageChange: async () => { },
    handleRestoreData: async () => { },
    handleUnarchiveExtrato: async () => { },
    handleArchiveExtrato: async () => { },
    handleSelectAllRows: () => { },
    handleDeleteExtrato: () => { },
    handleSelectRow: () => { },
    updateCreditorName: async () => { },
    setDontShowAgainDeleteExtractAlert: () => { },
    setExtractListView: () => { },
    callScrollTop: () => { },
});

export const ExtratosTableProvider = ({ children }: { children: React.ReactNode }) => {

    const {
        data: { user }
    } = useContext(UserInfoAPIContext);

    /*  ====> states <===== */
    const [data, setData] = useState<PaginatedResponse<CVLDResultProps>>({ results: [], count: 0, next: "", previous: "" });
    const [auxData, setAuxData] = useState<PaginatedResponse<CVLDResultProps>>({ results: [], count: 0, next: "", previous: "" });
    const [statusSelectValue, setStatusSelectValue] = useState<statusOficio | null>(null);
    const [oficioSelectValue, setOficioSelectValue] = useState<tipoOficio | null>(null);
    const [activeFilter, setActiveFilter] = useState<ActiveState>('ALL');
    const [activedTab, setActivedTab] = useState<Tabs>('WORKSPACE NOTION');
    const [editableLabel, setEditableLabel] = useState<string | null>(null);
    const [item, setItem] = useState<CVLDResultProps | {}>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [viewOption, setViewOption] = useState<LocalExtractViewProps>({
        type: 'table'
    });
    const [responseStatus, setResponseStatus] = useState<string>('');
    const [checkedList, setCheckedList] = useState<CVLDResultProps[] | never[]>([]);
    const [localShowOptions, setLocalShowOptions] = useState<LocalShowOptionsProps[]>([]);
    const [showModalMessage, setShowModalMessage] = useState<boolean>(true);
    const [openDetailsDrawer, setOpenDetailsDrawer] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [modalOptions, setModalOptions] = useState<{ open: boolean, items: CVLDResultProps[] | never[] }>({
        open: false,
        items: []
    });
    const [notionWorkspaceData, setNotionWorkspaceData] = useState<NotionResponse>({
        object: "list",
        results: []
    });
    const [listQuery, setListQuery] = useState<object>({});
    const [tanstackRefatch, setTanstackRefatch] = useState<any>();





    const { updateOficioStatus, updateOficioTipo } = useUpdateOficio(data, setData);

    /* ====> refs <==== */
    const mainRef = useRef<any>(null);

    /* ====> functions <==== */

    /* função que capta todos os extratos do backend e os coloca em um estado (data e auxData) */
    const fetchData = async (query: string, username?: string) => {
        setLoading(true);
        const response = await api.get(`api/extratos/${query}`);
        setData(response.data);
        setAuxData(response.data);
        setLoading(false);
    }

    const fetchNotionData =
        async () => {
            const t = await api.post(`api/notion-api/list/`, user && listQuery)
            return t.data
    }

    /* função que busca um extrato único para drawer de detalhes */
    const fetchDataById = async (id: string) => {
        setLoading(true);
        setItem((await api.get(`api/extrato/${id}/`)).data);
        setLoading(false);
    }


    /* função que deleta uma lista (ou item único) da tabela de extratos */
    const fetchDelete = async (ids: string[]) => {
        try {
            setLoading(true);
            const response = await api.post(`api/extrato/bulk-action/?action=delete`, {
                ids: ids
            });

            if (showModalMessage) {
                setResponseStatus('ok');
            } else {
                toast(`${ids.length > 1 ? 'Extratos deletados com sucesso!' : 'Extrato deletado com sucesso!'}`, {
                    classNames: {
                        toast: "dark:bg-form-strokedark",
                        title: "dark:text-snow",
                        description: "dark:text-snow",
                        actionButton: "!bg-slate-100 dark:bg-form-strokedark"
                    },
                    action: {
                        label: "Desfazer",
                        onClick: () => handleRestoreData()
                    }
                })
            }

            fetchData('');
            setCheckedList([]);

        } catch (error) {
            if (showModalMessage) {
                setResponseStatus('error');
            } else {
                toast('Houve um erro ao excluir o extrato', {
                    classNames: {
                        toast: "dark:bg-form-strokedark",
                        title: "dark:text-snow",
                        description: "dark:text-snow",
                        actionButton: "!bg-slate-100 dark:bg-form-strokedark"
                    },
                    action: {
                        label: "Fechar",
                        onClick: () => console.log('ok')
                    }
                })
            }
        } finally {
            setLoading(false);
        }
    }

    /* função que puxa do LocalStorage um estado de configuração para mostrar
    ou não o modal de alerta de exclusão/arquivamento */
    const fetchStateFromLocalStorage = () => {
        const configs = localStorage.getItem("dont_show_again_configs");
        if (configs !== null) {
            const parsedValue = JSON.parse(configs);
            setLocalShowOptions(parsedValue);
            localShowOptions.forEach(element => {
                if (element.key === "show_delete_extract_alert") {
                    setShowModalMessage(!element.active)
                }
            });
        }

        // fetching the view mode configs
        const viewMode = localStorage.getItem("extract_list_view_mode");
        if (viewMode !== null) {
            const parsedValue = JSON.parse(viewMode);
            setViewOption(parsedValue);
        }
    }

    /* função que faz a mudança de página no componente de pagination */
    const onPageChange = async (page: number) => {
        if (page === currentPage) return;
        setLoading(true);
        const response = await api.get(`api/extratos/?page=${page}`);
        setData(response.data);
        setLoading(false);
    }

    /* função que desfaz uma ação de exclusão/arquivamento de ofícios */
    const handleRestoreData = async () => {
        const response = await api.post(`api/extrato/bulk-action/?action=restore-delete`, {
            ids: checkedList.map(item => item.id)
        });

        if (response.status !== 200) {
            console.log('houve um erro ao tentar restaurar os dados');
            return;
        }

        fetchData('');

        if (showModalMessage) {
            setModalOptions({
                open: false,
                items: []
            });
            setResponseStatus('');
            setCheckedList([]);
        }
    }

    /* função que realiza o desarquivamento do(s) extrato(s) */
    const handleUnarchiveExtrato = async () => {
        const response = await api.post(`api/extrato/bulk-action/?action=restore-archive`, {
            ids: checkedList.map(item => item.id)
        });

        if (response.status !== 200) {
            console.log('houve um erro ao tentar desarquivar os dados');
            return;
        }

        if (activedTab === "GERAL") {
            fetchData('');
        } else {

            toast(`${checkedList.length > 1 ? 'Extratos desarquivados!' : 'Extrato desarquivado!'}`, {
                classNames: {
                    toast: "dark:bg-form-strokedark",
                    title: "dark:text-snow",
                    description: "dark:text-snow",
                    actionButton: "!bg-slate-100 dark:bg-form-strokedark"
                },
                description: `${checkedList.length > 1 ? 'Os extratos retornaram para a aba GERAL.' : 'O extrato retornou para a aba GERAL.'}`,
                action: {
                    label: "Desfazer",
                    onClick: () => handleUnarchiveExtrato()
                }
            })

            fetchData('?showMode=archived');
        }
        setCheckedList([]);
    }

    /* função que realiza o arquivamento do(s) extrato(s) */
    const handleArchiveExtrato = async () => {
        try {

            const response = await api.post('api/extrato/bulk-action/?action=archive', {
                ids: checkedList.map(item => item.id)
            });

            toast(`${checkedList.length > 1 ? 'Extratos movidos para guia arquivados!' : 'Extrato movido para guia arquivados!'}`, {
                classNames: {
                    toast: "dark:bg-form-strokedark",
                    title: "dark:text-snow",
                    description: "dark:text-snow",
                    actionButton: "!bg-slate-100 dark:bg-form-strokedark"
                },
                action: {
                    label: "Desfazer",
                    onClick: () => handleUnarchiveExtrato()
                }
            })

            fetchData('');
            setCheckedList([]);

        } catch (error) {
            console.log('error');
        }
    }

    /* função que seleciona todos os extratos da paginação */
    const handleSelectAllRows = () => {
        setCheckedList(data.results.map((item: CVLDResultProps) => item))
    }

    /* função que realiza a exclusão do(s) extrato(s) */
    const handleDeleteExtrato = () => {
        if (showModalMessage) {
            if (checkedList && checkedList.length >= 1) {
                setModalOptions({
                    open: true,
                    items: checkedList
                });
            }
        } else {
            if (checkedList && checkedList.length >= 1) {
                fetchDelete(checkedList.map(item => item.id))
            }
        }
    }

    /* função que seleciona somente um extrato */
    const handleSelectRow = (item: CVLDResultProps) => {

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

    const handleOficio = (id: string, tipo: tipoOficio, page_id?: string) => {

        updateOficioTipo(id, tipo, page_id);
        const newAuxData = auxData.results.map(item => {
            if (item.id === id) {
                item.tipo_do_oficio = tipo;
            }
            return item;
        });
        setAuxData({ ...auxData, results: newAuxData });

    }

    const handleStatus = async (id: string, status: statusOficio, page_id?: string) => {

        updateOficioStatus(id, status, page_id);



        const newAuxData = auxData.results.map(item => {
            if (item.id === id) {
                item.status = status;
            }
            return item;
        });
        setAuxData({ ...auxData, results: newAuxData });

    }

    /* função que manipula a troca de nome do credor em todas as views */
    const updateCreditorName = async (id: string, value: string, page_id?: string) => {

        setEditableLabel(null);


        // if (page_id) {
        //     const resNotion = await api.patch(`api/notion-api/update/${page_id}/`, {
        //         "Credor": {
        //             "id": "title",
        //             "type": "title",
        //             "title": [
        //                 {
        //                     "type": "text",
        //                     "text": {
        //                         "content": `${value}`
        //                     },
        //                     "plain_text": `${value}`
        //                 }
        //             ]
        //         }
        //     });
        //     if (resNotion.status !== 202) {
        //         console.log('houve um erro ao salvar os dados no notion');
        //     }

        // }

        const res = await api.patch(`/api/extrato/update/credor/${id}/`, {
            credor: value
        })



        if (res.status === 200) {
            const newResults = data.results.map((item: CVLDResultProps) => {
                if (item.id === id) {
                    return {
                        ...item,
                        credor: value
                    }
                }
                return item;
            })

            setData({
                ...data,
                results: newResults
            });
        } else {
            toast(`houve um erro inesperado ao salvar os dados. Erro ${res.status}`, {
                classNames: {
                    toast: "dark:bg-form-strokedark",
                    title: "dark:text-snow",
                    description: "dark:text-snow",
                    actionButton: "!bg-slate-100 dark:bg-form-strokedark"
                },
                action: {
                    label: "Fechar",
                    onClick: () => console.log('done')
                }
            })
        }

    }

    /* função que faz o toggle entre true e false da opção de mostrar ou não
    o modal de alerta de exclusão/arquivamento */
    const setDontShowAgainDeleteExtractAlert = (key: string): void => {
        /* setting key on localStorage if don't exist.
          if exist, update localOptions w/ preferences value
        */
        if (!localStorage.getItem("dont_show_again_configs")) {
            const config = {
                key: key,
                active: true
            }
            localStorage.setItem("dont_show_again_configs", JSON.stringify([config]));
            const configs = localStorage.getItem("dont_show_again_configs");
            if (configs !== null) {
                const parsedValue = JSON.parse(configs);
                setLocalShowOptions(parsedValue);
            }
        } else {
            const configs = localStorage.getItem("dont_show_again_configs");
            if (configs !== null) {
                const parsedValue = JSON.parse(configs);
                parsedValue.forEach((item: LocalShowOptionsProps) => {
                    if (item.key === key) {
                        item.active = item.active ? false : true;
                    }
                })
                localStorage.setItem("dont_show_again_configs", JSON.stringify(parsedValue));
                setLocalShowOptions(parsedValue);
            }
        }
    }

    /* função que altera o modo de visualização da extratos table (table/cards) */
    const setExtractListView = (type: string): void => {
        if (!localStorage.getItem("extract_list_view_mode")) {

            const config: LocalExtractViewProps = {
                type: type
            }
            localStorage.setItem("extract_list_view_mode", JSON.stringify(config));
            const configs = localStorage.getItem("extract_list_view_mode");
            if (configs !== null) {
                const parsedValue = JSON.parse(configs);
                setViewOption(parsedValue);
            }

        } else {

            const configs = localStorage.getItem("extract_list_view_mode");
            if (configs !== null) {
                const parsedValue = JSON.parse(configs);
                parsedValue.type = type;
                localStorage.setItem("extract_list_view_mode", JSON.stringify(parsedValue));
                setViewOption(parsedValue);
            }

        }
    }

    /* função que realiza o scroll Y da tela quando há paginação */
    const callScrollTop = (ref: HTMLDivElement | null) => {
        if (ref) {
            ref.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    /* ====> useEffects <===== */

    /* sempre que o componente for montado, puxa os dados do back e do
    localStorage */
    useEffect(() => {
        fetchData('', user);
        fetchStateFromLocalStorage();
    }, []);

    /* altera o estado no localStorage do modal de alerta para
    exclusão/arquivamento */
    useEffect(() => {
        if (localShowOptions.length <= 0) return;

        localShowOptions.forEach(element => {
            if (element.key === "show_delete_extract_alert") {
                setShowModalMessage(!element.active)
            }
        });
    }, [localShowOptions]);

    /* altera o auxData se ele for vazio (sempre que o componente é remontado) */
    useEffect(() => {
        if (auxData.results.length === 0 && data.results.length > 0) {
            setAuxData(data)
        }
    }, [data]);

    /* verifica se o usuário pressionou a tecla DELETE
    para deletar um ou mais extratos selecionados */
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (keyCode !== 46) return;

            if (checkedList.length >= 1) {
                fetchDelete(checkedList.map(item => item.id))
            }

        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    return (
        <ExtratosTableContext.Provider value={{
            /*  ====> states <===== */
            data, setData,
            auxData, setAuxData,
            statusSelectValue, setStatusSelectValue,
            oficioSelectValue, setOficioSelectValue,
            activeFilter, setActiveFilter,
            activedTab, setActivedTab,
            editableLabel, setEditableLabel,
            item, setItem,
            loading, setLoading,
            viewOption, setViewOption,
            responseStatus, setResponseStatus,
            checkedList, setCheckedList,
            localShowOptions, setLocalShowOptions,
            showModalMessage, setShowModalMessage,
            openDetailsDrawer, setOpenDetailsDrawer,
            currentPage, setCurrentPage,
            modalOptions, setModalOptions,
            notionWorkspaceData, setNotionWorkspaceData,
            fetchNotionData,
            setListQuery,
            listQuery,
            tanstackRefatch,
            setTanstackRefatch,

            /* ====> refs <==== */
            mainRef,

            /* ====> functions <==== */
            fetchData,
            fetchDelete,
            fetchDataById,
            fetchStateFromLocalStorage,
            onPageChange,
            handleRestoreData,
            handleUnarchiveExtrato,
            handleArchiveExtrato,
            handleSelectAllRows,
            handleDeleteExtrato,
            handleSelectRow,
            handleOficio,
            handleStatus,
            updateCreditorName,
            setDontShowAgainDeleteExtractAlert,
            setExtractListView,
            callScrollTop
        }}>
            {children}
        </ExtratosTableContext.Provider>
    );

}
