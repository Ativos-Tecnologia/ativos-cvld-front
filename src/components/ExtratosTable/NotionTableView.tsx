import { Badge, CustomFlowbiteTheme, Flowbite, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import numberFormat from "@/functions/formaters/numberFormat";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BiLoader } from 'react-icons/bi';
import statusOficio from '@/enums/statusOficio.enum';
import tipoOficio from '@/enums/tipoOficio.enum';
import { ImTable } from 'react-icons/im';
import { ENUM_OFICIOS_LIST, ENUM_TIPO_OFICIOS_LIST } from '@/constants/constants';
import { AiOutlineSearch } from 'react-icons/ai';
import { toast } from 'sonner';
import { ExtratosTableContext } from '@/context/ExtratosTableContext';
import { TableNotionContext } from '@/context/NotionTableContext';
import { NotionPage } from '@/interfaces/INotion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UserInfoAPIContext } from '@/context/UserInfoContext';
import api from '@/utils/api';
import { MdOutlineFilterAltOff } from 'react-icons/md';
import { LucideChevronsUpDown } from 'lucide-react';
import MakeFirstContact from '../TablesNotion/MakeFirstContact';
import { OfficeTypeAndValue } from '../TablesNotion/OfficeTypeAndValue';
import { SendProposal } from '../TablesNotion/SendProposal';
import { ProposalAccepted } from '../TablesNotion/ProposalAccepted';
import GeneralView from '../TablesNotion/GeneralView';
import Filters from '../Filters';

const existentQueries = [
    ['notion_list'],
    ['notion_list', 'general'],
    ['notion_list', 'first_contact'],
    ['notion_list', 'office_type'],
    ['notion_list', 'proposal_accepted'],
    ['notion_list', 'send_proposal']
]

const notionViews: string[] = [
    'geral',
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
    
    const [currentNotionView, setCurrentNotionView] = useState<string>('geral');
    // const [checkedList, setCheckedList] = React.useState<NotionPage[]>([]);
    const [openStatusPopover, setOpenStatusPopover] = useState<boolean>(false);
    const [openTipoOficioPopover, setOpenTipoOficioPopover] = useState<boolean>(false);
    const [openUsersPopover, setOpenUsersPopover] = useState<boolean>(false);
    const [filteredStatusValues, setFilteredStatusValues] = useState<statusOficio[]>(ENUM_OFICIOS_LIST);
    const [filteredUsersList, setFilteredUsersList] = useState<string[]>(ENUM_OFICIOS_LIST);
    const [updateState, setUpdateState] = useState<string | null>(null);
    const [editLock, setEditLock] = useState<boolean>(false);
    const [archiveStatus, setArchiveStatus] = useState<boolean>(false);
    const [archivedOficios, setArchivedOficios] = useState<NotionPage[]>([]);
    const searchStatusRef = useRef<HTMLInputElement | null>(null);
    const searchUserRef = useRef<HTMLInputElement | null>(null);
    const selectStatusRef = useRef<any>(null);
    const selectTipoOficioRef = useRef<any>(null);
    const selectUserRef = useRef<any>(null);

    const { data: { role } } = useContext(UserInfoAPIContext);

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

    // const handleSelectRow = (item: NotionPage) => {

    //     if (checkedList.length === 0) {
    //         setCheckedList([item]);
    //         return;
    //     }

    //     const alreadySelected = checkedList.some(target => target.id === item.id);

    //     if (alreadySelected) {
    //         setCheckedList(checkedList.filter(target => target.id !== item.id));
    //     } else {
    //         setCheckedList([...checkedList, item]);
    //     }
    // }

    // const handleSelectAllRows = (list: any) => {
    //     setCheckedList(list.map((item: NotionPage) => item))
    // }

    //NOTA: Começo da Área de Mutations

    /*AVISO: essa área de mutations sofreu uma alteração de queries dinâmicas para uma query
    estática. Qualquer problema causado por essa mudança, favor, alterar somente o conteúdo referente
    a queryKey de ['notion_list'] para paramsObj.queryKeyList, para que esta volte a ser dinâmica. */

    // const deleteMutation = useMutation({
    //     mutationFn: async (paramsObj: { pageIds: string[], queryKeyList: string[] }) => {
    //         const response = await api.patch('api/notion-api/page/bulk-action/visibility/', {
    //             page_ids: paramsObj.pageIds,
    //             archived: true
    //         });

    //         if (response.status !== 202) {
    //             throw new Error('Houve um erro ao tentar arquivar os dados');
    //         }
    //         return response.data;
    //     },
    //     onMutate: async (paramsObj: { pageIds: string[], queryKeyList: any[] }) => {
    //         await queryClient.cancelQueries({ queryKey: ['notion_list'] });
    //         const previousData: any = queryClient.getQueryData(['notion_list']);
    //         queryClient.setQueryData(['notion_list'], (old: any) => {
    //             return { ...old, results: old.results.filter((item: any) => !paramsObj.pageIds.includes(item.id)) };
    //         });
    //         setArchivedOficios(previousData?.results.filter((item: any) => paramsObj.pageIds.includes(item.id)))
    //         return { previousData };
    //     },
    //     onError: (err, paramsObj, context) => {
    //         queryClient.setQueryData(['notion_list'], context?.previousData);
    //         toast.error('Erro ao arquivar os dados');
    //     },
    //     onSuccess: (data, paramsObj) => {
    //         toast(`${paramsObj.pageIds.length > 1 ? `${paramsObj.pageIds.length} extratos arquivados!` : 'Extrato arquivado!'}`, {
    //             classNames: {
    //                 toast: "dark:bg-form-strokedark",
    //                 title: "dark:text-snow",
    //                 description: "dark:text-snow",
    //                 actionButton: "!bg-slate-100 dark:bg-form-strokedark"
    //             },
    //             action: {
    //                 label: "Desfazer",
    //                 onClick: () => {
    //                     handleUnarchiveExtrato(['notion_list'])
    //                 },
    //             }
    //         });
    //         setCheckedList([])
    //     }
    // });

    // const undeleteMutation = useMutation({
    //     mutationFn: async (paramsObj: { pageIds: string[], queryKeyList: any[] }) => {
    //         const response = await api.patch('api/notion-api/page/bulk-action/visibility/', {
    //             page_ids: paramsObj.pageIds,
    //             archived: false
    //         });

    //         if (response.status !== 202) {
    //             throw new Error('Houve um erro ao tentar arquivar os dados');
    //         }
    //         return response.data;
    //     },
    //     onMutate: async (paramsObj) => {
    //         await queryClient.cancelQueries({ queryKey: ['notion_list'] });
    //         const previousData: any = queryClient.getQueryData(['notion_list']);
    //         queryClient.setQueryData(['notion_list'], (old: any) => {
    //             return { ...old, results: [...archivedOficios, ...old.results] }
    //         })
    //         return { previousData };
    //     },
    //     onError: (error, paramsObj, context) => {
    //         queryClient.setQueryData(['notion_list'], context?.previousData);
    //         toast.error('Erro ao desarquivar os dados');
    //     },
    //     onSuccess: (data, paramsObj) => {
    //         toast(`${paramsObj.pageIds.length > 1 ? `${paramsObj.pageIds.length} extratos desarquivados!` : 'Extrato desarquivado!'}`, {
    //             classNames: {
    //                 toast: "dark:bg-form-strokedark",
    //                 title: "dark:text-snow",
    //                 description: "dark:text-snow",
    //                 actionButton: "!bg-slate-100 dark:bg-form-strokedark"
    //             },
    //             action: {
    //                 label: "Fechar",
    //                 onClick: () => {
    //                     toast.dismiss();
    //                 },
    //             }
    //         });
    //         setArchivedOficios([]);
    //     }
    // });

    // const statusMutation = useMutation({
    //     mutationFn: async (paramsObj: { page_id: string, status: statusOficio, queryKeyList: any[] }) => {
    //         const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
    //             "Status": {
    //                 "status": {
    //                     "name": `${paramsObj.status}`
    //                 }
    //             }
    //         });
    //         if (response.status !== 202) {
    //             throw new Error('Houve um erro ao alterar o status');
    //         }
    //         return response.data
    //     },
    //     onMutate: async (paramsObj: { page_id: string, status: statusOficio, queryKeyList: any[] }) => {
    //         await queryClient.cancelQueries({ queryKey: ['notion_list'] });
    //         const previousData: any = queryClient.getQueryData(['notion_list']);
    //         queryClient.setQueryData(['notion_list'], (old: any) => {
    //             return {
    //                 ...old, results: old.results.map((item: any) => {
    //                     if (item.id === paramsObj.page_id) {
    //                         item.properties.Status.status.name = paramsObj.status
    //                     }
    //                     return item
    //                 })
    //             }
    //         })
    //         return { previousData }
    //     },
    //     onError: (error, paramsObj, context) => {
    //         queryClient.setQueryData(['notion_list'], context?.previousData)
    //         toast.error('Erro ao alterar o status do ofício')
    //     },
    //     onSuccess: (data, paramsObj) => {
    //         queryClient.invalidateQueries({ queryKey: ['notion_list'] })
    //     }
    // });

    // const tipoMutation = useMutation({
    //     mutationFn: async (paramsObj: { page_id: string, oficio: tipoOficio, queryKeyList: any[] }) => {
    //         const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
    //             "Tipo": {
    //                 "select": {
    //                     "name": `${paramsObj.oficio}`
    //                 }
    //             },
    //         });

    //         if (response.status !== 202) {
    //             throw new Error('houve um erro ao salvar os dados no notion');
    //         }
    //         return response.data;
    //     },
    //     onMutate: async (paramsObj: { page_id: string, oficio: tipoOficio, queryKeyList: any[] }) => {
    //         await queryClient.cancelQueries({ queryKey: ['notion_list'] });
    //         const previousData: any = queryClient.getQueryData(['notion_list']);
    //         queryClient.setQueryData(['notion_list'], (old: any) => {
    //             return {
    //                 ...old, results: old.results.map((item: any) => {
    //                     if (item.id === paramsObj.page_id) {
    //                         item.properties.Tipo.select = {
    //                             name: paramsObj.oficio
    //                         }
    //                     }
    //                     return item
    //                 })
    //             }
    //         })
    //         return { previousData }
    //     },
    //     onError: (error, paramsObj, context) => {
    //         queryClient.setQueryData(['notion_list'], context?.previousData);
    //         toast.error('Erro ao alterar o tipo do ofício');
    //     },
    //     onSuccess: (data, paramsObj) => {
    //         queryClient.invalidateQueries({ queryKey: ['notion_list'] })
    //     }
    // });

    // const creditorNameMutation = useMutation({
    //     mutationFn: async (paramsObj: { page_id: string, value: string, queryKeyList: any[] }) => {
    //         const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
    //             "Credor": {
    //                 "title": [
    //                     {
    //                         "text": {
    //                             "content": paramsObj.value
    //                         }
    //                     }
    //                 ]
    //             }
    //         });
    //         if (response.status !== 202) {
    //             throw new Error('houve um erro ao salvar os dados no notion');
    //         }
    //         return response.data
    //     },
    //     onMutate: async (paramsObj) => {
    //         setUpdateState('pending');
    //         setEditLock(true);
    //         await queryClient.cancelQueries({ queryKey: ['notion_list'] });
    //         const previousData: any = queryClient.getQueryData(['notion_list']);
    //         queryClient.setQueryData(['notion_list'], (old: any) => {
    //             return {
    //                 ...old, results: old.results.map((item: any) => {
    //                     if (item.id === paramsObj.page_id) {
    //                         item.properties.Credor.title[0].text.content = paramsObj.value
    //                     }
    //                     return item
    //                 })
    //             }
    //         }
    //         )
    //         return { previousData }
    //     },
    //     onError: (error, paramsObj, context) => {
    //         queryClient.setQueryData(['notion_list'], context?.previousData)
    //         toast.error('Erro ao alterar o nome do credor');
    //         setUpdateState('error');
    //     },
    //     onSuccess: () => {
    //         setUpdateState('success');
    //         queryClient.invalidateQueries({ queryKey: ['notion_list'] })
    //     },
    //     onSettled: () => {
    //         const timeOut = setTimeout(() => {
    //             setEditableLabel(prevObj => {
    //                 return {
    //                     ...prevObj,
    //                     id: '',
    //                     nameCredor: false
    //                 }
    //             });
    //             setUpdateState(null);
    //             setEditLock(false);
    //         }, 1500);
    //         return () => clearTimeout(timeOut);
    //     }
    // });

    // const phoneNumberMutation = useMutation({
    //     mutationFn: async (paramsObj: { page_id: string, type: string, value: string, queryKeyList: any[] }) => {
    //         const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
    //             [paramsObj.type]: {
    //                 "phone_number": paramsObj.value
    //             }
    //         });
    //         if (response.status !== 202) {
    //             console.log('houve um erro ao salvar os dados no notion');
    //         }
    //         return response.data
    //     },
    //     onMutate: async (paramsObj) => {
    //         setUpdateState('pending');
    //         setEditLock(true);
    //         await queryClient.cancelQueries({ queryKey: ['notion_list'] });
    //         const previousData: any = queryClient.getQueryData(['notion_list']);
    //         return { previousData }
    //     },
    //     onError: (error, paramsObj, context) => {
    //         queryClient.setQueryData(['notion_list'], context?.previousData);
    //         toast.error('Erro ao alterar o contato');
    //         setUpdateState('error');
    //     },
    //     onSuccess: () => {
    //         setUpdateState('success');
    //     },
    //     onSettled: () => {
    //         const timeOut = setTimeout(() => {
    //             setEditableLabel(prevObj => {
    //                 return {
    //                     ...prevObj,
    //                     id: '',
    //                     phone: {
    //                         one: false,
    //                         two: false,
    //                         three: false,
    //                     }
    //                 }
    //             });
    //             setUpdateState(null);
    //             setEditLock(false);
    //         }, 1500);
    //         return () => clearTimeout(timeOut);
    //     }
    // });

    // const emailMutation = useMutation({
    //     mutationFn: async (paramsObj: { page_id: string, value: string, queryKeyList: any[] }) => {
    //         const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
    //             "Contato de E-mail": {
    //                 "email": paramsObj.value
    //             }
    //         });
    //         if (response.status !== 202) {
    //             console.log('houve um erro ao salvar os dados no notion');
    //         }
    //         return response.data
    //     },
    //     onMutate: async (paramsObj) => {
    //         setEditLock(true);
    //         setUpdateState('pending');
    //         await queryClient.cancelQueries({ queryKey: ['notion_list'] });
    //         const previousData: any = queryClient.getQueryData(['notion_list']);
    //         return { previousData }
    //     },
    //     onError: (error, paramsObj, context) => {
    //         setUpdateState('error');
    //         queryClient.setQueryData(['notion_list'], context?.previousData);
    //         toast.error('Erro ao alterar o email');
    //     },
    //     onSuccess: () => {
    //         setUpdateState('success');
    //     },
    //     onSettled: () => {
    //         const timeOut = setTimeout(() => {
    //             setEditableLabel(prevObj => {
    //                 return {
    //                     ...prevObj,
    //                     id: '',
    //                     email: false
    //                 }
    //             });
    //             setUpdateState(null);
    //             setEditLock(false);
    //         }, 1500);
    //         return () => clearTimeout(timeOut);
    //     }
    // });

    // const proposalPriceMutation = useMutation({
    //     mutationFn: async (paramsObj: { page_id: string, value: number, queryKeyList: any[] }) => {
    //         const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
    //             "Preço Proposto": {
    //                 "number": paramsObj.value
    //             }
    //         });
    //         if (response.status !== 202) {
    //             throw new Error('houve um erro ao salvar os dados no notion');
    //         }
    //         return response.data
    //     },
    //     onMutate: async (paramsObj) => {
    //         setUpdateState('pending');
    //         setEditLock(true);
    //         await queryClient.cancelQueries({ queryKey: ['notion_list'] });
    //         const previousData: any = queryClient.getQueryData(['notion_list']);
    //         return { previousData }
    //     },
    //     onError: (error, paramsObj, context) => {
    //         setUpdateState('error');
    //         queryClient.setQueryData(['notion_list'], context?.previousData);
    //         toast.error('Erro ao alterar o preço proposto');
    //     },
    //     onSuccess: (paramsObj) => {
    //         setUpdateState('success');
    //         queryClient.invalidateQueries({ queryKey: ['notion_list'] });
    //     },
    //     onSettled: () => {
    //         const timeOut = setTimeout(() => {
    //             setEditableLabel(prevObj => {
    //                 return {
    //                     ...prevObj,
    //                     id: '',
    //                     proposalPrice: false
    //                 }
    //             });
    //             setUpdateState(null);
    //             setEditLock(false);
    //         }, 1500);
    //         return () => clearTimeout(timeOut);
    //     }
    // });

    // const fupDateMutation = useMutation({
    //     mutationFn: async (paramsObj: { page_id: string, value: string, type: string, queryKeyList: any[] }) => {
    //         const dateObject = {
    //             end: null,
    //             start: paramsObj.value,
    //             time_zone: null
    //         }

    //         const response = await api.patch(`api/notion-api/update/${paramsObj.page_id}/`, {
    //             [paramsObj.type]: {
    //                 "date": dateObject
    //             }
    //         });

    //         if (response.status !== 202) {
    //             throw new Error('houve um erro ao salvar os dados no notion');
    //         }

    //         return response.data
    //     },
    //     onMutate: async (paramsObj) => {
    //         setUpdateState('pending');
    //         setEditLock(true)
    //         await queryClient.cancelQueries({ queryKey: ['notion_list'] });
    //         const previousData: any = queryClient.getQueryData(['notion_list']);
    //         return { previousData }
    //     },
    //     onError: (error, paramsObj, context) => {
    //         setUpdateState('error');
    //         queryClient.setQueryData(['notion_list'], context?.previousData);
    //         toast.error('Erro ao alterar a data de follow up');
    //     },
    //     onSuccess: () => {
    //         setUpdateState('success');
    //     },
    //     onSettled: () => {
    //         const timeOut = setTimeout(() => {
    //             setEditableLabel(prevObj => {
    //                 return {
    //                     ...prevObj,
    //                     id: '',
    //                     fup: {
    //                         first: false,
    //                         second: false,
    //                         third: false,
    //                         fourth: false,
    //                         fifth: false
    //                     }
    //                 }
    //             });
    //             setUpdateState(null);
    //             setEditLock(false);
    //         }, 1500);
    //         return () => clearTimeout(timeOut);
    //     }
    // });

    // fim da Área de mutations

    //TODO: mover essas funções de fetch para um hook
    const fetchUser = async () => {
        const t = await api.get("/api/profile/")

        return t.data
    }

    const { data: userData } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
    })

    const defaultFilterObject = {
        "and":
            [
                {
                    "property": userData?.sub_role === 'coordenador' ? "Coordenadores" : "Usuário",
                    "multi_select": {
                        "contains": userData?.user
                    }
                },
                secondaryDefaultFilterObject
            ]
    }

    // const [currentQuery, setCurrentQuery] = useState({});

    const [statusSelectValue, setStatusSelectValue] = useState<statusOficio | null>(null);
    const [oficioSelectValue, setOficioSelectValue] = useState<tipoOficio | null>(null);
    // const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState<boolean>(false);
    // const [listQuery, setListQuery] = useState<object>({});

    //TODO: mover essas funções de fetch para um hook
    // const fetchNotionData = async () => {
    //     const t = await api.post(`api/notion-api/list/`, !!userData?.user && listQuery)
    //     return t.data
    // }

    const queryClient = useQueryClient()
    const { data, isFetching, editableLabel, setEditableLabel,
        handleSelectRow, handleSelectAllRows, selectedUser,
        handleCopyValue, handleEditInput, handleArchiveExtrato,
        handleEditStatus, handleEditTipoOficio, handleChangeCreditorName,
        handleChangePhoneNumber, handleChangeEmail, handleChangeProposalPrice,
        handleChangeFupDate, setListQuery, checkedList, setCheckedList
    } = useContext(TableNotionContext);

    // const { isPending, data, error, isFetching, refetch } = useQuery(
    //     {
    //         queryKey: ['notion_list'],
    //         refetchOnReconnect: true,
    //         refetchOnWindowFocus: true,
    //         refetchInterval: 15000,
    //         staleTime: 13000,
    //         queryFn: fetchNotionData,
    //         enabled: !!userData?.user && !isEditing // only fetch if user is defined after context is loaded and is not editing any table label
    //     },
    // );

    //NOTA: Área das funções do tipo handle
    // const handleCopyValue = (index: number) => {

    //     navigator.clipboard.writeText(numberFormat(data.results[index].properties['Valor Líquido'].formula?.number || 0));

    //     toast("Valor copiado para área de transferência.", {
    //         classNames: {
    //             toast: "dark:bg-form-strokedark",
    //             title: "dark:text-snow",
    //             description: "dark:text-snow",
    //             actionButton: "!bg-slate-100 dark:bg-form-strokedark"
    //         },
    //         action: {
    //             label: "Fechar",
    //             onClick: () => {
    //                 toast.dismiss();
    //             }
    //         }
    //     })
    // }

    // const handleEditInput = (index: number, refList: HTMLDivElement[] | null) => {
    //     if (refList) {
    //         refList[index].focus();
    //     }
    // }

    // const handleArchiveExtrato = async (queryKeyList: any[]) => {
    //     setArchiveStatus(true);
    //     const pageIds = checkedList.map(notionPage => notionPage.id);
    //     await deleteMutation.mutateAsync({
    //         pageIds,
    //         queryKeyList
    //     });
    //     setArchiveStatus(false);
    // };

    /* ======================= remover depois ============================= */
    // const handleUnarchiveExtrato = async (queryKeyList: any[]) => {
    //     const pageIds = archivedOficios.map(notionPage => notionPage.id);
    //     await undeleteMutation.mutateAsync({
    //         pageIds,
    //         queryKeyList
    //     });
    // }

    // const handleEditStatus = async (page_id: string, status: statusOficio, queryKeyList: any[]) => {
    //     await statusMutation.mutateAsync({
    //         page_id,
    //         status,
    //         queryKeyList
    //     })
    // }

    // const handleEditTipoOficio = async (page_id: string, oficio: tipoOficio, queryKeyList: any[]) => {
    //     await tipoMutation.mutateAsync({
    //         page_id,
    //         oficio,
    //         queryKeyList
    //     });
    // }

    // const handleChangeCreditorName = async (value: string, page_id: string, queryKeyList: any[]) => {
    //     await creditorNameMutation.mutateAsync({
    //         page_id,
    //         value,
    //         queryKeyList
    //     });
    // }

    // const handleChangePhoneNumber = async (page_id: string, type: string, value: string, queryKeyList: any[]) => {
    //     await phoneNumberMutation.mutateAsync({
    //         page_id,
    //         type,
    //         value,
    //         queryKeyList
    //     });
    // }

    // const handleChangeEmail = async (page_id: string, value: string, queryKeyList: any[]) => {
    //     await emailMutation.mutateAsync({
    //         page_id,
    //         value,
    //         queryKeyList
    //     });
    // }

    // const handleChangeProposalPrice = async (page_id: string, value: string, queryKeyList: any[]) => {
    //     const formatedValue = value.replace(/[^0-9,]/g, '');
    //     const valueToNumber = parseFloat(formatedValue);
    //     await proposalPriceMutation.mutateAsync({
    //         page_id,
    //         value: valueToNumber,
    //         queryKeyList
    //     });
    // }

    // const handleChangeFupDate = async (page_id: string, value: string, type: string, queryKeyList: any[]) => {

    //     if (/^[0-9/]{10}$/.test(value)) {

    //         const parsedValue = value.split('/').reverse().join('-');
    //         await fupDateMutation.mutateAsync({
    //             page_id,
    //             value: parsedValue,
    //             type,
    //             queryKeyList
    //         })

    //     } else {
    //         console.log('um campo de data precisa de 8 caracteres');
    //     }
    // }

    // const buildQuery = useCallback(() => {

    //     return {
    //         "and": [
    //             // {
    //             //     "property": selectedUser && userData?.sub_role  === 'coordenador' ? "Usuário" : "Coordenadores",
    //             //     "multi_select": {
    //             //     "contains": selectedUser && userData?.sub_role  === 'coordenador' ? selectedUser : ""
    //             //     }
    //             // },
    //             userData?.sub_role === 'coordenador' ? {
    //                 "property": "Coordenadores",
    //                 "multi_select": {
    //                     "contains": userData?.user
    //                 }
    //             } : {
    //                 "property": "Usuário",
    //                 "multi_select": {
    //                     "contains": selectedUser || userData?.user
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
    //                     "equals": oficioSelectValue || ''
    //                 }
    //             },
    //             secondaryDefaultFilterObject
    //         ]
    //     };
    // }, [userData?.sub_role, userData?.user, selectedUser, statusSelectValue, oficioSelectValue, secondaryDefaultFilterObject]);

    // useEffect(() => {
    //     const updatedQuery = buildQuery();
    //     setCurrentQuery(updatedQuery);
    //     setListQuery(updatedQuery);

    //     if (Object.keys(updatedQuery).length > 0) {
    //         refetch();
    //     }
    // }, [userData?.user, statusSelectValue, oficioSelectValue, selectedUser, buildQuery, refetch]);

    // const handleFilterByTipoOficio = (oficio: tipoOficio) => {
    //     setOficioSelectValue(oficio);
    //     setOpenTipoOficioPopover(false);
    //     setListQuery(
    //         {
    //             "and": [
    //                 {
    //                     "property": selectedUser && userData?.sub_role === 'coordenador' ? "Usuário" : "Coordenadores",
    //                     "multi_select": {
    //                         "contains": selectedUser && userData?.sub_role === 'coordenador' ? selectedUser : ""
    //                     }
    //                 },
    //                 userData?.sub_role === 'coordenador' ? {
    //                     "property": "Coordenadores",
    //                     "multi_select": {
    //                         "contains": userData?.user
    //                     }
    //                 } : {
    //                     "property": "Usuário",
    //                     "multi_select": {
    //                         "contains": selectedUser || userData?.user
    //                     }
    //                 },
    //                 {
    //                     "property": "Status",
    //                     "status": {
    //                         "equals": statusSelectValue || ''
    //                     }
    //                 },
    //                 {
    //                     "property": "Tipo",
    //                     "select": {
    //                         "equals": oficio
    //                     }
    //                 },
    //                 secondaryDefaultFilterObject
    //             ]
    //         }
    //     );
    // }

    // const handleFilterByUser = (user: string) => {
    //     setOpenUsersPopover(false)
    //     setSelectedUser(user);
    //     setFilteredUsersList(usersList);
    //     searchUserRef.current!.value = ''
    //     setListQuery({
    //         "and": [
    //             {
    //                 "property": selectedUser && userData?.sub_role === 'coordenador' ? "Usuário" : "Coordenadores",
    //                 "multi_select": {
    //                     "contains": selectedUser && userData?.sub_role === 'coordenador' ? user : ""
    //                 }
    //             },
    //             userData?.sub_role === 'coordenador' ? {
    //                 "property": "Coordenadores",
    //                 "multi_select": {
    //                     "contains": userData?.user
    //                 }
    //             } : {
    //                 "property": "Usuário",
    //                 "multi_select": {
    //                     "contains": user
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
    //                     "equals": oficioSelectValue || ''
    //                 }
    //             },
    //             secondaryDefaultFilterObject
    //         ]
    //     });
    // }

    // const handleCleanAllFilters = () => {
    //     setStatusSelectValue(null);
    //     setOficioSelectValue(null);
    //     setSelectedUser(null);
    //     setListQuery(defaultFilterObject);
    // }

    // const searchStatus = (value: string) => {
    //     if (!value) {
    //         setFilteredStatusValues(ENUM_OFICIOS_LIST);
    //         return;
    //     }
    //     setFilteredStatusValues(ENUM_OFICIOS_LIST.filter((status) => status.toLowerCase().includes(value.toLowerCase())));
    // }

    // const searchUser = (value: string) => {
    //     if (!value) {
    //         setFilteredUsersList(usersList);
    //         return;
    //     }
    //     setFilteredUsersList(usersList.filter((user) => user.toLowerCase().includes(value.toLowerCase())));
    // }

    // const handleSelectStatus = (status: statusOficio) => {
    //     setOpenStatusPopover(false);
    //     setFilteredStatusValues(ENUM_OFICIOS_LIST);
    //     setStatusSelectValue(status);
    //     searchStatusRef.current!.value = '';
    //     setListQuery({
    //         "and": [
    //             {
    //                 "property": selectedUser && userData?.sub_role === 'coordenador' ? "Usuário" : "Coordenadores",
    //                 "multi_select": {
    //                     "contains": selectedUser && userData?.sub_role === 'coordenador' ? selectedUser : ""
    //                 }
    //             },
    //             userData?.sub_role === 'coordenador' ? {
    //                 "property": "Coordenadores",
    //                 "multi_select": {
    //                     "contains": userData?.user
    //                 }
    //             } : {
    //                 "property": "Usuário",
    //                 "multi_select": {
    //                     "contains": selectedUser || userData?.user
    //                 }
    //             },
    //             {
    //                 "property": "Status",
    //                 "status": {
    //                     "equals": status
    //                 }
    //             },
    //             {
    //                 "property": "Tipo",
    //                 "select": {
    //                     "equals": oficioSelectValue || ''
    //                 }
    //             },
    //             secondaryDefaultFilterObject
    //         ]
    //     });

    // }

    const clearQueries = async () => {
        existentQueries.forEach((query: string[]) => queryClient.removeQueries({ queryKey: query }))
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

    const displayViewDefault = async () => {
        await clearQueries()
        setStatusSelectValue(null);
        setOficioSelectValue(null);
        setCurrentNotionView("geral");
        setListQuery(
            {

                "and":
                    [
                        {
                            "property": userData?.sub_role === 'coordenador' ? "Coordenadores" : "Usuário",
                            "multi_select": {
                                "contains": selectedUser || userData?.user
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
        await clearQueries()
        setCurrentNotionView('realizar 1º contato');
        setListQuery(
            {

                "and":
                    [
                        {
                            "property": userData?.sub_role === 'coordenador' ? "Coordenadores" : "Usuário",
                            "multi_select": {
                                "contains": selectedUser || userData?.user
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
        await clearQueries()
        setCurrentNotionView("juntar ofício/valor líquido");
        setListQuery(
            {

                "and":
                    [
                        {
                            "property": userData?.sub_role === 'coordenador' ? "Coordenadores" : "Usuário",
                            "multi_select": {
                                "contains": selectedUser || userData?.user
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
        await clearQueries()
        setCurrentNotionView("enviar proposta/negociação");
        setListQuery({

            "and":
                [
                    {
                        "property": userData?.sub_role === 'coordenador' ? "Coordenadores" : "Usuário",
                        "multi_select": {
                            "contains": selectedUser || userData?.user
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
        await clearQueries()
        setCurrentNotionView('proposta aceita');
        setListQuery(
            {
                "and":
                    [
                        {
                            "property": userData?.sub_role === 'coordenador' ? "Coordenadores" : "Usuário",
                            "multi_select": {
                                "contains": selectedUser || userData?.user
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

    /* verifica se o usuário pressionou a tecla DELETE
    para deletar um ou mais extratos selecionados */
    // useEffect(() => {
    //     const keyHandler = ({ keyCode }: KeyboardEvent) => {
    //         if (keyCode !== 46) return;

    //         if (checkedList.length >= 1) {
    //             handleArchiveExtrato()
    //         }

    //     };
    //     document.addEventListener("keydown", keyHandler);
    //     return () => document.removeEventListener("keydown", keyHandler);
    // });

    // useEffect(() => {
    //     if (Object.keys(listQuery).length > 0) {
    //         refetch();
    //     }
    // }, [notionView])

    // seta a lista de usuários se a role do usuário for ativos
    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (role === "ativos") {
    //             const [usersList] = await Promise.all([api.get("/api/notion-api/list/users/")]);
    //             if (usersList.status === 200) {
    //                 setUsersList(usersList.data);
    //                 setFilteredUsersList(usersList.data);
    //             }
    //         };
    //     };

    //     fetchData();
    // }, [role]);

    // close on click outside
    // useEffect(() => {
    //     const clickHandler = ({ target }: MouseEvent) => {
    //         if (openStatusPopover || openTipoOficioPopover || openUsersPopover) {
    //             if (
    //                 selectStatusRef?.current?.contains(target) ||
    //                 selectTipoOficioRef?.current?.contains(target) ||
    //                 selectUserRef?.current?.contains(target)
    //             ) return;
    //             setOpenStatusPopover(false);
    //             setOpenTipoOficioPopover(false);
    //             setOpenUsersPopover(false);
    //         };
    //     };
    //     document.addEventListener("click", clickHandler);
    //     return () => document.removeEventListener("click", clickHandler);
    // });

    // close the select filters if the esc key is pressed
    // useEffect(() => {
    //     const keyHandler = ({ keyCode }: KeyboardEvent) => {
    //         if (!openStatusPopover || !openTipoOficioPopover || keyCode !== 27) return;
    //         setOpenStatusPopover(false);
    //         setOpenTipoOficioPopover(false);
    //     };
    //     document.addEventListener("keydown", keyHandler);
    //     return () => document.removeEventListener("keydown", keyHandler);
    // });

    // arquiva os extratos da tabela por meio da tecla delete
    useEffect(() => {
        const keyHandler = ({ keyCode }: KeyboardEvent) => {
            if (checkedList.length <= 0 && keyCode !== 46) return;
            handleArchiveExtrato(['notion_list'])
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    return (
        <>
            <div className="flex gap-3 flex-1 items-center">
                {
                    notionViews.map((view) => (
                        <div
                            key={view}
                            onClick={() => handleChangeViews(view)}
                            className={`flex items-center justify-center gap-2 py-1 font-semibold px-2 text-xs hover:bg-slate-100 uppercase dark:hover:bg-form-strokedark rounded-md transition-colors duration-200 cursor-pointer ${currentNotionView === view && 'bg-slate-100 dark:bg-form-strokedark'} ${isFetching && 'pointer-events-none !cursor-not-allowed'}`}>
                            <ImTable />
                            <span>{view}</span>
                        </div>
                    ))
                }
            </div>

            <Filters currentNotionView={currentNotionView} notionViews={notionViews} />

            {/* <MiniMenu
                archiveStatus={archiveStatus}
                handleArchiveExtrato={handleArchiveExtrato}
                handleSelectAllRows={handleSelectAllRows}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
                count={data?.results?.length || 0}
            /> */}

            {currentNotionView === 'geral' && (
                <GeneralView
                    handleNotionDrawer={handleNotionDrawer}
                />
            )}


            {currentNotionView === 'realizar 1º contato' &&
                <MakeFirstContact
                    data={data}
                    userInfo={userData}
                    setIsEditing={setIsEditing}
                    updateState={updateState}
                    editLock={editLock}
                    checkedList={checkedList}
                    editableLabel={editableLabel}
                    setEditableLabel={setEditableLabel}
                    handleNotionDrawer={handleNotionDrawer}
                    handleSelectRow={handleSelectRow}
                    handleChangeCreditorName={handleChangeCreditorName}
                    handleEditInput={handleEditInput}
                    handleChangePhoneNumber={handleChangePhoneNumber}
                    handleChangeEmail={handleChangeEmail}
                    handleEditStatus={handleEditStatus}
                    archiveStatus={archiveStatus}
                    handleSelectAllRows={handleSelectAllRows}
                    handleArchiveExtrato={handleArchiveExtrato}
                    setCheckedList={setCheckedList}
                />
            }

            {currentNotionView === 'juntar ofício/valor líquido' &&
                <OfficeTypeAndValue
                    data={data}
                    userInfo={userData}
                    setIsEditing={setIsEditing}
                    checkedList={checkedList}
                    editableLabel={editableLabel}
                    updateState={updateState}
                    setEditableLabel={setEditableLabel}
                    handleNotionDrawer={handleNotionDrawer}
                    handleSelectRow={handleSelectRow}
                    handleChangeCreditorName={handleChangeCreditorName}
                    handleEditInput={handleEditInput}
                    handleEditStatus={handleEditStatus}
                    handleEditTipoOficio={handleEditTipoOficio}
                    handleCopyValue={handleCopyValue}
                    archiveStatus={archiveStatus}
                    handleArchiveExtrato={handleArchiveExtrato}
                    handleSelectAllRows={handleSelectAllRows}
                    setCheckedList={setCheckedList}
                />
            }

            {currentNotionView === 'enviar proposta/negociação' &&
                <SendProposal
                    data={data}
                    userInfo={userData}
                    setIsEditing={setIsEditing}
                    checkedList={checkedList}
                    editableLabel={editableLabel}
                    updateState={updateState}
                    editLock={editLock}
                    setEditableLabel={setEditableLabel}
                    handleNotionDrawer={handleNotionDrawer}
                    handleSelectRow={handleSelectRow}
                    handleChangeCreditorName={handleChangeCreditorName}
                    handleEditInput={handleEditInput}
                    handleEditStatus={handleEditStatus}
                    handleChangeProposalPrice={handleChangeProposalPrice}
                    handleCopyValue={handleCopyValue}
                    handleChangeFupDate={handleChangeFupDate}
                    archiveStatus={archiveStatus}
                    handleArchiveExtrato={handleArchiveExtrato}
                    handleSelectAllRows={handleSelectAllRows}
                    setCheckedList={setCheckedList}
                />
            }

            {currentNotionView === 'proposta aceita' &&
                <ProposalAccepted
                    data={data}
                    userInfo={userData}
                    setIsEditing={setIsEditing}
                    checkedList={checkedList}
                    updateState={updateState}
                    editableLabel={editableLabel}
                    setEditableLabel={setEditableLabel}
                    numberFormat={numberFormat}
                    handleNotionDrawer={handleNotionDrawer}
                    handleSelectRow={handleSelectRow}
                    handleChangeCreditorName={handleChangeCreditorName}
                    handleEditInput={handleEditInput}
                    handleEditStatus={handleEditStatus}
                    handleCopyValue={handleCopyValue}
                    archiveStatus={archiveStatus}
                    handleArchiveExtrato={handleArchiveExtrato}
                    handleSelectAllRows={handleSelectAllRows}
                    setCheckedList={setCheckedList}
                />
            }
            {/* {isPending &&
                <p className='text-center p-10 text-'>Carregando dados do Notion...</p>
            } */}
        </>

    )
}

export default NotionTableView
