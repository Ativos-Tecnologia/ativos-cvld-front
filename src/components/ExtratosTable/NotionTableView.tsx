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

const NotionTableView = ({ setExtratosTableToNotionDrawersetId, setNotionDrawer }: NotionTableViewProps) => {

    const [currentNotionView, setCurrentNotionView] = useState<string>('geral');

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

                ]
        }
    }, []);

    const handleNotionDrawer = (id: string) => {
        setExtratosTableToNotionDrawersetId(id)
        setNotionDrawer(true);
    }

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

    const queryClient = useQueryClient()
    const { data, isFetching, editableLabel, setEditableLabel,
        handleSelectRow, handleSelectAllRows, selectedUser,
        handleCopyValue, handleEditInput, handleArchiveExtrato,
        handleEditStatus, handleEditTipoOficio, handleChangeCreditorName,
        handleChangePhoneNumber, handleChangeEmail, handleChangeProposalPrice,
        handleChangeFupDate, setListQuery, checkedList, setCheckedList
    } = useContext(TableNotionContext);

    const clearQueries = async () => {
        existentQueries.forEach((query: string[]) => queryClient.removeQueries({ queryKey: query }));
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

            {currentNotionView === 'geral' && (
                <GeneralView
                    handleNotionDrawer={handleNotionDrawer}
                />
            )}


            {currentNotionView === 'realizar 1º contato' &&
                <MakeFirstContact
                    handleNotionDrawer={handleNotionDrawer}
                />
            }

            {currentNotionView === 'juntar ofício/valor líquido' &&
                <OfficeTypeAndValue
                    handleNotionDrawer={handleNotionDrawer}
                />
            }

            {currentNotionView === 'enviar proposta/negociação' &&
                <SendProposal
                    handleNotionDrawer={handleNotionDrawer}
                />
            }

            {currentNotionView === 'proposta aceita' &&
                <ProposalAccepted
                    handleNotionDrawer={handleNotionDrawer}
                />
            }
            {/* {isPending &&
                <p className='text-center p-10 text-'>Carregando dados do Notion...</p>
            } */}
        </>

    )
}

export default NotionTableView
