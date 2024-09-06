import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from '../Tables/TableDefault'
import { AiOutlineLoading, AiOutlineUser } from 'react-icons/ai'
import { BiLoader, BiSolidDockLeft } from 'react-icons/bi'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { LiaCoinsSolid } from 'react-icons/lia'
import { NotionPage } from '@/interfaces/INotion'
import { PiCursorClick } from 'react-icons/pi'
import { RiNotionFill } from 'react-icons/ri'
import statusOficio from '@/enums/statusOficio.enum'
import { Badge, Button } from 'flowbite-react'
import tipoOficio from '@/enums/tipoOficio.enum'
import { ENUM_OFICIOS_LIST, ENUM_TIPO_OFICIOS_LIST } from '@/constants/constants'
import { ImCopy } from 'react-icons/im'
import numberFormat from '@/functions/formaters/numberFormat'
import { UserInfoAPIContext } from '@/context/UserInfoContext'
import CustomCheckbox from '../CrmUi/Checkbox'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/utils/api'
import { MiniMenu } from '../ExtratosTable/MiniMenu'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

export const OfficeTypeAndValue = ({ isPending, checkedList, editableLabel, setEditableLabel, statusSelectValue, oficioSelectValue, handleSelectRow, handleNotionDrawer,
    handleChangeCreditorName, handleEditInput, handleEditStatus, handleEditTipoOficio, handleCopyValue, archiveStatus, handleArchiveExtrato, handleSelectAllRows, setCheckedList
}:
    {
        isPending: boolean,
        checkedList: NotionPage[],
        editableLabel: string | null;
        setEditableLabel: React.Dispatch<React.SetStateAction<string | null>>;
        statusSelectValue: statusOficio | null;
        oficioSelectValue: tipoOficio | null;
        handleNotionDrawer: (id: string) => void;
        handleSelectRow: (item: NotionPage) => void;
        handleChangeCreditorName: (value: string, page_id: string, queryKeyList: any[]) => Promise<void>;
        handleEditInput: (index: number, refList: HTMLInputElement[] | null) => void;
        handleEditStatus: (page_id: string, status: statusOficio, queryKeyList: any[]) => Promise<void>;
        handleEditTipoOficio: (page_id: string, status: tipoOficio, queryKeyList: any[]) => Promise<void>;
        handleCopyValue: (index: number) => void;
        archiveStatus: boolean,
        handleArchiveExtrato: (queryList: any[]) => Promise<void>,
        handleSelectAllRows: (list: any) => void,
        setCheckedList: React.Dispatch<React.SetStateAction<NotionPage[]>>
    }
) => {

    /* ========> states <======== */
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState({ credor: '' });
    const [sort, setSort] = useState({ field: null, direction: 'asc' });
    const [backendResults, setBackendResults] = useState<NotionPage[]>([]);
    const [firstLoad, setFirstLoad] = useState(true);

    /* ----> refs <----- */
    const inputCredorRefs = useRef<HTMLInputElement[] | null>([]);

    const { data: { user, role, sub_role } } = useContext(UserInfoAPIContext);

    const secondaryDefaultFilterObject = useMemo(() => {
        return {
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
    }, []);

    const defaultFilterObject = {
        "and":
            [
                {
                    "property": sub_role === 'coordenador' ? "Coordenadores" : "Usuário",
                    "multi_select": {
                        "contains": user
                    }
                },
                secondaryDefaultFilterObject
            ]
    }

    const fetchNotionData = async () => {
        const t = await api.post(`api/notion-api/list/`, defaultFilterObject)
        return t.data
    }
    const { isPending: isPendingData, data, error, isFetching, refetch } = useQuery(
        {
            queryKey: ['notion_list', 'office_type'],
            refetchOnReconnect: true,
            refetchOnWindowFocus: true,
            refetchInterval: 1000 * 13,
            staleTime: 1000 * 13,
            queryFn: fetchNotionData,
            enabled: !!user // only fetch if user is defined after context is loaded
        },
    );
    const [nextCursor, setNextCursor] = useState<string | null>();
    const [hasMore, setHasMore] = useState<boolean>();

    /* função que faz uma requisição ao backend para retornar resultados que contenham
    a determinada palavra-chave e adiciona a nova linha filtrada para os resultados já 
    existentes (caso haja) */
    const fetchByName = async (name: string) => {
        const response = await api.post("/api/notion-api/list/search/", {
            "username": user,
            "creditor_name": name
        });

        setBackendResults(response.data.results);
        setNextCursor(response.data.next_cursor);
        setHasMore(response.data.has_more);
    };

    /* função que verifica se há mais dados no backend para serem puxados para a tabela.
    se existir, faz o fetch e atualiza a tabela com os dados novos */
    const fetchNextCursor = async () => {
        if (!hasMore || !nextCursor) return;

        try {
            const response = await api.post(`/api/notion-api/list/database/next-cursor/${nextCursor}/`, {
                "username": user
            });

            setNextCursor(response.data.next_cursor);
            setHasMore(response.data.has_more);
            setBackendResults(prevResults => [...prevResults, ...response.data.results]);
        } catch (error) {
            console.error(error);
        }
    };

    const { refetch: refetchByName, isFetching: isFetchingByName } = useQuery({
        queryKey: ['notion_list_creditor_name', filters.credor],
        queryFn: () => fetchByName(filters.credor),
        enabled: false,
    });

    const { refetch: refetchNextCursor, isFetching: isFetchingNextCursor } = useQuery({
        queryKey: ['notion_list_next_cursor', nextCursor],
        queryFn: fetchNextCursor,
        enabled: false,
    });

    /* variável responsável por processar os dados puros que vem do notion, de forma que
    serve para classificar por ordem alfabética ou filtrar algum dado específico */
    const processedData = React.useMemo(() => {
        let customResults = {
            next_cursor: backendResults.length === 0 ? data?.next_cursor : nextCursor,
            has_more: backendResults.length > 0 ? hasMore : data?.has_more,
            results: [...(data?.results || []), ...(backendResults) || []]
        }

        /* o método reduce neste caso é para eliminar possíveis duplicatas no array original */
        customResults.results = customResults.results.reduce((acc: any, item: NotionPage) => {
            if (!acc.some((target: NotionPage) => target.id === item.id)) {
                acc.push(item);
            }
            return acc;
        }, []);

        /* aqui os dados são filtrados para retornar somente o(s) credor(es) que estiverem na propriedade
        credor do filters. Se por um acaso a string for vazia, nada é filtrado e o array retornado é igual ao original */
        customResults.results = customResults.results.filter((item: NotionPage) =>
            item.properties.Credor?.title[0]?.text.content.toLowerCase().includes(filters.credor.toLowerCase())
        );

        /* aqui os dados são ordenados de acordo com a ordem alfabética e são baseados no
        nome do credor e na direção do estado sort */
        customResults.results = customResults.results.sort((a: any, b: any) => {
            const compareResult = a.properties.Credor?.title[0]?.text.content.localeCompare(b.properties.Credor?.title[0]?.text.content);
            return sort.direction === 'asc' ? compareResult : -compareResult;
        });

        return customResults.results
    }, [backendResults, nextCursor, data?.next_cursor, data?.has_more, data?.results, hasMore, sort.direction, filters.credor]);

    /* função que seta a ordenação de mostragem dos dados da tabela (padrão ordem
    alfabética) */
    const handleSort = (field: any) => {
        setSort(prev => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    /* função que seta o valor do filtro, se existir mais de um valor, somente
    o especificado em field será modificado */
    const handleFilterChange = useCallback((field: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
        // setShouldFetchExternally(true);
    }, []);

    /* função que é responsável por carregar mais ofícios para a tabela, caso existam mais */
    const loadMore = () => {
        if (hasMore && !isFetchingNextCursor) {
            refetchNextCursor();
        }
    };

    /* efeito disparado para que verificar a cada 0.5s se o valor da prop credor
    do filtro bate com algum credor elemento do processedData */
    useEffect(() => {
        if (filters.credor/* && shouldFetchExternally*/) {
            const timer = setTimeout(() => {
                const hasMatch = processedData.some((item: NotionPage) =>
                    item.properties.Credor?.title[0]?.text.content.toLowerCase().includes(filters.credor.toLowerCase())
                );

                if (!hasMatch) {
                    queryClient.cancelQueries({ queryKey: ['notion_list'] });
                    refetchByName();
                }
                // setShouldFetchExternally(false);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [filters, queryClient, refetchByName, processedData /*shouldFetchExternally*/]);

    /* atribui os valores de nomes dos credores aos inputs */
    useEffect(() => {
        if (inputCredorRefs.current) {
            processedData.forEach((item: NotionPage, index: number) => {
                const ref = inputCredorRefs.current![index];
                if (ref) {
                    ref.value = item.properties.Credor?.title[0]?.text.content || '';
                }
            });
        }

    }, [processedData]);

    useEffect(() => {
        if (firstLoad && data) {
            setNextCursor(data?.next_cursor);
            setHasMore(data?.has_more);
            setFirstLoad(false);
            return;
        }

        setNextCursor(nextCursor);
        setHasMore(hasMore);

    }, [data, data?.has_more, data?.next_cursor, firstLoad, hasMore, nextCursor]);

    return (
        <div className='max-w-full overflow-x-scroll pb-5'>

            <MiniMenu
                queryKey={['notion_list', 'office_type']}
                processedData={processedData}
                archiveStatus={archiveStatus}
                handleArchiveExtrato={handleArchiveExtrato}
                handleSelectAllRows={handleSelectAllRows}
                checkedList={checkedList}
                setCheckedList={setCheckedList}
                count={processedData?.length || 0}
            />

            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Filtrar por nome"
                    value={filters.credor}
                    onChange={(e) => handleFilterChange('credor', e.target.value)}
                    className="max-w-md rounded-md border border-stroke bg-white px-3 py-2 text-sm font-medium dark:border-strokedark dark:bg-boxdark-2"
                />
                {isFetchingByName && (
                    <div className="flex flex-row text-center text-gray-500 dark:text-gray-400 ml-2 py-2">
                        <AiOutlineLoading className="animate-spin w-5 h-5" />
                    </div>
                )}

            </div>

            <Table>
                <TableHead>
                    <TableHeadCell className='w-[400px]'>
                        <div className='flex gap-2 items-center'>
                            <button
                                className='flex gap-2 items-center uppercase'
                                onClick={() => handleSort('Credor')}>
                                <AiOutlineUser className='text-base' /> Nome do Credor
                                {sort.field === 'Credor' ? (
                                    sort.direction === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                                ) : (
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="w-[216px]">
                        <div className="flex gap-2 items-center">
                            <BiLoader className='text-base' />
                            Status
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="w-[150px]">
                        <div className='flex gap-2 items-center'>
                            <IoDocumentTextOutline className='text-base' />
                            Oficio
                        </div>
                    </TableHeadCell>
                    <TableHeadCell className="min-w-[180px]">
                        <div className="flex gap-2 items-center">
                            <LiaCoinsSolid className='text-base' />
                            Valor Líquido (Com reserva dos honorários)
                        </div>
                    </TableHeadCell>
                </TableHead>

                <TableBody>
                    {isPending ? null : (
                        <React.Fragment>
                            {data?.results?.length > 0 && (
                                <>
                                    {processedData?.map((item: NotionPage, index: number) => (

                                        <TableRow key={item.id} className={`${checkedList!.some(target => target.id === item.id) && 'bg-blue-50 dark:bg-form-strokedark'} hover:shadow-3 dark:hover:shadow-body group`}>

                                            {/* credor info */}
                                            <TableCell title={item.properties.Credor?.title[0].text.content || ''}
                                                className="h-full flex items-center gap-2 font-semibold text-[12px]"
                                            >
                                                <div className='relative w-full flex items-center gap-3'>

                                                    <CustomCheckbox
                                                        check={checkedList!.some(target => target.id === item.id)}
                                                        callbackFunction={() => handleSelectRow(item)}
                                                    />

                                                    <div className="relative w-full">
                                                        <input
                                                            type="text"
                                                            ref={(input) => { if (input) inputCredorRefs.current![index] = input; }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                                    if (inputCredorRefs.current) {
                                                                        inputCredorRefs.current[index].blur()
                                                                    }
                                                                    handleChangeCreditorName(e.currentTarget.value, item.id, ['notion_list', 'office_type'])
                                                                }
                                                            }}
                                                            className={`${editableLabel === item.id && '!border-1 !border-blue-700'} w-full pl-1 focus-within:ring-0 text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                                        />
                                                        {/* absolute div that covers the entire cell */}
                                                        {editableLabel !== item.id && (
                                                            <div className='absolute inset-0 rounded-md flex items-center transition-all duration-200'>

                                                                <React.Fragment>
                                                                    {item.properties.Credor?.title[0].plain_text?.length === 0 ? (
                                                                        <div className='flex-1 h-full flex items-center select-none cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200'
                                                                            onClick={() => {
                                                                                setEditableLabel!(item.id)
                                                                                handleEditInput(index, inputCredorRefs.current);
                                                                            }}>
                                                                            <div className='flex gap-1 pl-4 text-slate-400'>
                                                                                <PiCursorClick className='text-base' />
                                                                                <span>Clique para adicionar nome</span>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className='flex-1 h-full flex items-center select-none cursor-pointer opacity-0 text-sm
                                                                    font-semibold pl-[21px]'
                                                                            onClick={() => {
                                                                                setEditableLabel!(item.id)
                                                                                handleEditInput(index, inputCredorRefs.current);
                                                                            }}>
                                                                            <span>
                                                                                {item.properties.Credor?.title[0].text.content}
                                                                            </span>
                                                                        </div>
                                                                    )}

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
                                                                    {(item.url && role === 'ativos') && (
                                                                        <a href={item.url} target='_blank' rel='referrer'
                                                                            title='Abrir no Notion'
                                                                            className='py-1 px-2 mr-1 flex items-center justify-center gap-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                                                                        >
                                                                            <RiNotionFill className='text-lg'
                                                                            />
                                                                            <span className='text-xs'>Notion</span>
                                                                        </a>)}
                                                                </React.Fragment>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                            </TableCell>

                                            {/* status select */}
                                            <TableCell className="text-center items-center">
                                                <Badge color="teal" size="sm" className="text-center text-[12px] w-full">
                                                    <select className="text-[12px] w-full text-ellipsis overflow-x-hidden whitespace-nowrap bg-transparent border-none py-0 focus-within:ring-0 uppercase" onChange={(e) => {
                                                        handleEditStatus(item.id, e.target.value as statusOficio, ['notion_list', 'office_type'])
                                                    }}>
                                                        {item.properties.Status.status?.name && (
                                                            <option value={item.properties.Status.status?.name} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                {statusSelectValue || item.properties.Status.status?.name}
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

                                            {/* Ofício tipo */}
                                            <TableCell className="text-center whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                <Badge color="indigo" size="sm" className="max-w-full text-[12px]">
                                                    <select className="text-[12px] bg-transparent border-none py-0 focus-within:ring-0" onChange={(e) => handleEditTipoOficio(item.id, e.target.value as tipoOficio, ['notion_list', 'office_type'])}>
                                                        {item.properties.Tipo.select?.name && (
                                                            <option value={item.properties.Tipo.select?.name} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                {oficioSelectValue || item.properties.Tipo.select?.name}
                                                            </option>
                                                        )}
                                                        {ENUM_TIPO_OFICIOS_LIST.filter((status) => status !== item.properties.Tipo.select?.name).map((status) => (
                                                            <option key={status} value={status} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </Badge>
                                            </TableCell>

                                            {/* Valor líquido com reserva dos honorários */}
                                            <TableCell className="font-semibold text-[14px]">
                                                <div className="relative">
                                                    {numberFormat(item.properties['Valor Líquido (Com Reserva dos Honorários)'].formula?.number || 0)}
                                                    <ImCopy
                                                        title='Copiar valor'
                                                        onClick={() => handleCopyValue(index)}
                                                        className='absolute top-1/2 -translate-y-1/2 left-28 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                                                    />
                                                </div>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </>
                            )
                            }
                        </React.Fragment>
                    )}
                </TableBody>
            </Table>

            {hasMore && (
                <Button onClick={loadMore} disabled={isFetchingNextCursor} className='mt-5'>
                    {isFetchingNextCursor ? 'Carregando...' : 'Carregar mais'}
                </Button>
            )}

        </div>
    )
}
