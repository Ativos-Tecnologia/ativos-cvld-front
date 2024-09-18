import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from '../Tables/TableDefault'
import { AiOutlineLoading, AiOutlineUser } from 'react-icons/ai'
import { BiLoader, BiPencil, BiSolidDockLeft } from 'react-icons/bi'
import { IoArrowDownCircle, IoArrowUpCircle } from 'react-icons/io5'
import { LuSigma } from "react-icons/lu";
import { NotionPage } from '@/interfaces/INotion'
import { PiCursorClick } from 'react-icons/pi'
import { RiNotionFill } from 'react-icons/ri'
import statusOficio from '@/enums/statusOficio.enum'
import { Badge, Button } from 'flowbite-react'
import { ENUM_OFICIOS_LIST } from '@/constants/constants'
import { ImCopy } from 'react-icons/im'
import numberFormat from '@/functions/formaters/numberFormat'
import { BsCalendar3 } from 'react-icons/bs'
import ReactInputMask from 'react-input-mask'
import { UserInfoAPIContext } from '@/context/UserInfoContext'
import CustomCheckbox from '../CrmUi/Checkbox'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/utils/api'
import { MiniMenu } from '../ExtratosTable/MiniMenu'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { NotionSkeletonFour } from '../Skeletons/NotionSkeletonFour'
import { IEditableLabels } from '@/context/ExtratosTableContext'
import SaveButton from '../Button/SaveButton'

export const SendProposal = ({ data, setIsEditing, checkedList, editLock, editableLabel, updateState, setEditableLabel, handleNotionDrawer, handleSelectRow, handleChangeFupDate, archiveStatus, handleArchiveExtrato, handleSelectAllRows, setCheckedList,
    handleChangeCreditorName, handleEditInput, handleEditStatus, handleCopyValue, handleChangeProposalPrice
}:
    {
        data: any,
        setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
        checkedList: NotionPage[],
        editLock: boolean,
        updateState: string | null,
        editableLabel: IEditableLabels;
        setEditableLabel: React.Dispatch<React.SetStateAction<IEditableLabels>>;
        handleNotionDrawer: (id: string) => void;
        handleSelectRow: (item: NotionPage) => void;
        handleChangeCreditorName: (value: string, page_id: string, queryKeyList: any[]) => Promise<void>;
        handleEditInput: (index: number, refList: HTMLDivElement[] | null) => void;
        handleEditStatus: (page_id: string, status: statusOficio, queryKeyList: any[]) => Promise<void>;
        handleChangeProposalPrice: (page_id: string, value: string, queryKeyList: any[]) => Promise<void>;
        handleCopyValue: (index: number) => void;
        handleChangeFupDate: (page_id: string, value: string, type: string, queryKeyList: any[]) => Promise<void>;
        archiveStatus: boolean;
        handleArchiveExtrato: (queryList: any[]) => Promise<void>;
        handleSelectAllRows: (list: any) => void;
        setCheckedList: React.Dispatch<React.SetStateAction<NotionPage[]>>;
    }
) => {

    /* ========> states <======== */
    const queryClient = useQueryClient();
    const [filters, setFilters] = useState({ credor: '' });
    const [sort, setSort] = useState({ field: null, direction: 'asc' });
    const [backendResults, setBackendResults] = useState<NotionPage[]>([]);
    const [firstLoad, setFirstLoad] = useState(true);
    const [nextCursor, setNextCursor] = useState<string | null>();
    const [hasMore, setHasMore] = useState<boolean>();

    /* ----> refs <----- */
    const inputCredorRefs = useRef<HTMLDivElement[] | null>([]);
    const inputProposalPriceRefs = useRef<HTMLInputElement[] | null>([]);
    const [maskRefsOne, setMaskRefsOne] = useState<any>();
    const [maskRefsTwo, setMaskRefsTwo] = useState<any>();
    const [maskRefsThree, setMaskRefsThree] = useState<any>();
    const [maskRefsFour, setMaskRefsFour] = useState<any>();
    const [maskRefsFive, setMaskRefsFive] = useState<any>();

    const { data: { user, role, sub_role } } = useContext(UserInfoAPIContext);

    const secondaryDefaultFilterObject = useMemo(() => {
        return {
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

    /* ----> functions <---- */

    function fupDateConveter(date: string): string {
        const convertedDate = date.split("-").reverse().join("/");
        return convertedDate;
    }

    const fetchNotionData = async () => {
        const t = await api.post(`api/notion-api/list/`, defaultFilterObject)
        return t.data
    }
    // const { isPending: isPendingData, data, error, isFetching, refetch } = useQuery(
    //     {
    //         queryKey: ['notion_list', 'send_proposal'],
    //         refetchOnReconnect: true,
    //         refetchOnWindowFocus: true,
    //         refetchInterval: 1000 * 13,
    //         staleTime: 1000 * 13,
    //         queryFn: fetchNotionData,
    //         enabled: !!user // only fetch if user is defined after context is loaded
    //     },
    // );

    // função que manuseia o início de uma edição de label
    const resetOthersEditions = () => {
        setEditableLabel({
            id: '',
            nameCredor: false,
            phone: {
                one: false,
                two: false,
                three: false
            },
            email: false,
            proposalPrice: false,
            fup: {
                first: false,
                second: false,
                third: false,
                fourth: false,
                fifth: false,
            },
            identification: false,
            npuOrig: false,
            npuPrec: false,
            court: false,
        })
    }

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
    // useEffect(() => {
    //     if (inputCredorRefs.current) {
    //         processedData.forEach((item: NotionPage, index: number) => {
    //             const ref = inputCredorRefs.current![index];
    //             if (ref) {
    //                 ref.value = item.properties.Credor?.title[0]?.text.content || '';
    //             }
    //         });
    //     }

    // }, [processedData]);

    useEffect(() => {

        setMaskRefsOne(document.querySelectorAll('.fup1'))
        setMaskRefsTwo(document.querySelectorAll('.fup2'))
        setMaskRefsThree(document.querySelectorAll('.fup3'))
        setMaskRefsFour(document.querySelectorAll('.fup4'))
        setMaskRefsFive(document.querySelectorAll('.fup5'))

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
        <div
            style={{
                boxShadow: "inset -4px 0 4px rgba(0 0 0 / 0.1)"
            }}
            className='max-w-full overflow-x-scroll pb-5'>

            <MiniMenu
                queryKey={['notion_list', 'send_proposal']}
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
                    <TableRow>

                        <TableHeadCell className='min-w-[400px]'>
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
                        <TableHeadCell className="min-w-[216px]">
                            <div className="flex gap-2 items-center">
                                <BiLoader className='text-base' />
                                Status
                            </div>
                        </TableHeadCell>
                        <TableHeadCell className="min-w-[180px]">
                            <div className='flex gap-2 items-center'>
                                <BiPencil className='text-base' />
                                Preço Proposto
                            </div>
                        </TableHeadCell>
                        <TableHeadCell className='min-w-[120px]'>
                            <div className="flex gap-2 items-center">
                                <LuSigma className='text-base' />
                                Comissão
                            </div>
                        </TableHeadCell>
                        <TableHeadCell className="min-w-50">
                            <div className="flex gap-2 items-center">
                                <IoArrowDownCircle className='text-base' />
                                (R$) Proposta Mínima
                            </div>
                        </TableHeadCell>
                        <TableHeadCell className="min-w-50">
                            <div className="flex gap-2 items-center">
                                <IoArrowUpCircle className='text-base' />
                                (R$) Proposta Máxima
                            </div>
                        </TableHeadCell>
                        <TableHeadCell className="min-w-40">
                            <div className="flex gap-2 items-center">
                                <BsCalendar3 className='text-base' />
                                1ª FUP
                            </div>
                        </TableHeadCell>
                        <TableHeadCell className="min-w-40">
                            <div className="flex gap-2 items-center">
                                <BsCalendar3 className='text-base' />
                                2ª FUP
                            </div>
                        </TableHeadCell>
                        <TableHeadCell className="min-w-40">
                            <div className="flex gap-2 items-center">
                                <BsCalendar3 className='text-base' />
                                3ª FUP
                            </div>
                        </TableHeadCell>
                        <TableHeadCell className="min-w-40">
                            <div className="flex gap-2 items-center">
                                <BsCalendar3 className='text-base' />
                                4ª FUP
                            </div>
                        </TableHeadCell>
                        <TableHeadCell className="min-w-40">
                            <div className="flex gap-2 items-center">
                                <BsCalendar3 className='text-base' />
                                5ª FUP
                            </div>
                        </TableHeadCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {firstLoad ? (
                        <>
                            {[...Array(3)].map((_, index: number) => (
                                <NotionSkeletonFour key={index} />
                            ))}
                        </>
                    ) : (
                        <React.Fragment>
                            {data?.results?.length > 0 && (
                                <>
                                    {processedData?.map((item: NotionPage, index: number) => (

                                        <TableRow key={item.id} className={`${checkedList!.some(target => target.id === item.id) && 'bg-blue-50 dark:bg-form-strokedark'} hover:shadow-3 dark:hover:shadow-body group`}>

                                            {/* credor info */}
                                            <TableCell
                                                className="h-full flex items-center gap-2 font-semibold text-[12px]"
                                            >
                                                <div
                                                    title={item.properties.Credor?.title[0].text.content || ''}
                                                    className='relative w-full flex items-center gap-3'>

                                                    <CustomCheckbox
                                                        check={checkedList!.some(target => target.id === item.id)}
                                                        callbackFunction={() => handleSelectRow(item)}
                                                    />

                                                    <div className="relative w-full">

                                                        <div className='w-full h-full flex gap-2 items-center'>
                                                            <div
                                                                title={item?.properties?.Credor?.title[0]?.text.content || ''}
                                                                dangerouslySetInnerHTML={{ __html: item?.properties?.Credor?.title[0]?.text.content || '' }}
                                                                ref={(input) => { if (input) inputCredorRefs.current![index] = input; }}
                                                                contentEditable={editableLabel.id === item.id && editableLabel.nameCredor}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                                        if (inputCredorRefs.current) {
                                                                            inputCredorRefs.current[index].blur();
                                                                            setIsEditing(false);
                                                                            handleChangeCreditorName(inputCredorRefs.current[index].innerText, item.id, ['notion_list']);
                                                                        }
                                                                    } else {
                                                                        setIsEditing(true);
                                                                        queryClient.cancelQueries({ queryKey: ['notion_list'] })
                                                                    }
                                                                }}
                                                                className='flex-1 max-w-[370px] py-2 pr-3 pl-1 focus-visible:outline-none text-sm border-transparent bg-transparent rounded-md overflow-hidden whitespace-nowrap'
                                                            ></div>

                                                            {editableLabel.id === item.id && editableLabel.nameCredor && (
                                                                <SaveButton
                                                                    onClick={() => {
                                                                        inputCredorRefs.current![index].blur();
                                                                        setIsEditing(false);
                                                                        handleChangeCreditorName(inputCredorRefs.current![index].innerText, item.id, ['notion_list'])
                                                                    }}
                                                                    status={updateState}
                                                                />
                                                            )}
                                                        </div>

                                                        {/* <input
                                                            type="text"
                                                            ref={(input) => { if (input) inputCredorRefs.current![index] = input; }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                                    if (inputCredorRefs.current) {
                                                                        inputCredorRefs.current[index].blur()
                                                                    }
                                                                    handleChangeCreditorName(e.currentTarget.value, item.id, ['notion_list', 'send_proposal'])
                                                                }
                                                            }}
                                                            className={`${editableLabel === item.id && '!border-1 !border-blue-700'} w-full pl-1 focus-within:ring-0 text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                                        /> */}
                                                        {/* absolute div that covers the entire cell */}
                                                        {(editableLabel.id !== item.id && !editableLabel.nameCredor) && (
                                                            <div className='absolute inset-0 rounded-md flex items-center transition-all duration-200'>

                                                                <React.Fragment>
                                                                    {item.properties.Credor?.title[0].plain_text?.length === 0 ? (
                                                                        <div className='flex-1 h-full flex items-center select-none cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200'
                                                                            onClick={() => {
                                                                                resetOthersEditions()
                                                                                setEditableLabel(prevObj => {
                                                                                    return {
                                                                                        ...prevObj,
                                                                                        id: item.id,
                                                                                        nameCredor: true
                                                                                    }
                                                                                })
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
                                                                                resetOthersEditions()
                                                                                setEditableLabel(prevObj => {
                                                                                    return {
                                                                                        ...prevObj,
                                                                                        id: item.id,
                                                                                        nameCredor: true
                                                                                    }
                                                                                })
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
                                                <Badge color="teal" size="sm" className="text-center h-6 text-[12px] w-full">
                                                    <select
                                                        title={item.properties.Status.status?.name}
                                                        className="text-[12px] w-full text-ellipsis overflow-x-hidden whitespace-nowrap bg-transparent border-none py-0 focus-within:ring-0 uppercase" onChange={(e) => {
                                                            handleEditStatus(item.id, e.target.value as statusOficio, ['notion_list', 'send_proposal'])
                                                        }}>
                                                        {item.properties.Status.status?.name && (
                                                            <option value={item.properties.Status.status?.name} className="text-[12px] bg-transparent border-none border-noround font-bold">
                                                                {item.properties.Status.status?.name}
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

                                            {/* preço proposto */}
                                            <TableCell className="relative font-semibold text-[14px]">
                                                <div className='relative flex gap-2 items-center'>

                                                    {editableLabel.id === item.id && editableLabel.proposalPrice ? (
                                                        <SaveButton
                                                            onClick={() => {
                                                                if (editLock) return;
                                                                inputProposalPriceRefs.current![index].blur();
                                                                setIsEditing(false);
                                                                handleChangeProposalPrice(item.id, inputProposalPriceRefs.current![index].innerText, ['notion_list'])
                                                            }}
                                                            status={updateState}
                                                        />
                                                    ) : (
                                                        <ImCopy
                                                            title='Copiar valor'
                                                            onClick={() => handleCopyValue(index)}
                                                            className='absolute top-1/2 -translate-y-1/2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer'
                                                        />
                                                    )}

                                                    {editLock && (
                                                        <div className='absolute inset-0 cursor-not-allowed'></div>
                                                    )}

                                                    <input
                                                        title={numberFormat(item.properties['Preço Proposto']?.number || 0)}
                                                        type="text"
                                                        ref={(input) => { if (input) inputProposalPriceRefs.current![index] = input; }}
                                                        defaultValue={numberFormat(item.properties['Preço Proposto']?.number || 0)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                                if (inputProposalPriceRefs.current) {
                                                                    inputProposalPriceRefs.current[index].blur();
                                                                }
                                                                handleChangeProposalPrice(item.id, e.currentTarget.value, ['notion_list', 'send_proposal'])
                                                            }
                                                        }}
                                                        onClick={() => {
                                                            resetOthersEditions()
                                                            setEditableLabel(prevObj => {
                                                                return {
                                                                    ...prevObj,
                                                                    id: item.id,
                                                                    proposalPrice: true
                                                                }
                                                            })
                                                        }}
                                                        className='text-right w-full px-0 focus-within:ring-0 focus-within:border-none text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap'
                                                    />
                                                </div>
                                            </TableCell>

                                            {/* comissão */}
                                            <TableCell className="font-semibold max-w-[180px] text-[14px] text-right">
                                                <div title={numberFormat(item.properties['Comissão'].formula?.number || 0)}
                                                    className='text-ellipsis overflow-hidden whitespace-nowrap'>
                                                    {
                                                        numberFormat(item.properties['Comissão'].formula?.number || 0)
                                                    }
                                                </div>
                                            </TableCell>

                                            {/* proposta mínima */}
                                            <TableCell className="font-semibold min-w-50 text-[14px] text-right">
                                                <div title={numberFormat(item.properties['(R$) Proposta Mínima '].formula?.number || 0)}>
                                                    {
                                                        numberFormat(item.properties['(R$) Proposta Mínima '].formula?.number || 0)
                                                    }
                                                </div>
                                            </TableCell>

                                            {/* proposta máxima */}
                                            <TableCell className="font-semibold min-w-50 text-[14px] text-right">
                                                <div title={numberFormat(item.properties['(R$) Proposta Máxima'].formula?.number || 0)}>
                                                    {
                                                        numberFormat(item.properties['(R$) Proposta Máxima'].formula?.number || 0)
                                                    }
                                                </div>
                                            </TableCell>

                                            {/* 1ª FUP */}
                                            <TableCell className="font-semibold text-[14px] text-right">

                                                <div className='relative flex gap-2 items-center'>

                                                    {editLock && (
                                                        <div className='absolute inset-0 cursor-not-allowed'></div>
                                                    )}

                                                    <ReactInputMask
                                                        mask='99/99/9999'
                                                        defaultValue={fupDateConveter(item.properties["1ª FUP"]?.date?.start || '')}
                                                        type="text"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                                handleChangeFupDate(item.id, e.currentTarget.value, '1ª FUP', ['notion_list', 'send_proposal'])
                                                            }
                                                        }}
                                                        onClick={() => {
                                                            resetOthersEditions()
                                                            setEditableLabel(prevObj => {
                                                                return {
                                                                    ...prevObj,
                                                                    id: item.id,
                                                                    fup: {
                                                                        ...prevObj.fup,
                                                                        first: true
                                                                    }
                                                                }
                                                            })
                                                        }}
                                                        className='fup1 w-full pl-1 focus-within:ring-0 focus-within:border-none text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap'
                                                    />

                                                    {editableLabel.id === item.id && editableLabel.fup.first && (
                                                        <SaveButton
                                                            onClick={() => {
                                                                if (editLock) return;
                                                                maskRefsOne[index].blur();
                                                                setIsEditing(false);
                                                                handleChangeFupDate(item.id, maskRefsOne[index].value, '1ª FUP', ['notion_list'])
                                                            }}
                                                            status={updateState}
                                                        />
                                                    )}

                                                </div>

                                            </TableCell>

                                            {/* 2ª FUP */}
                                            <TableCell className="font-semibold text-[14px] text-right">

                                                <div className='relative flex gap-2 items-center'>

                                                    {editLock && (
                                                        <div className='absolute inset-0 cursor-not-allowed'></div>
                                                    )}

                                                    <ReactInputMask
                                                        mask='99/99/9999'
                                                        defaultValue={fupDateConveter(item.properties["2ª FUP "]?.date?.start || '')}
                                                        type="text"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                                handleChangeFupDate(item.id, e.currentTarget.value, '2ª FUP ', ['notion_list', 'send_proposal'])
                                                            }
                                                        }}
                                                        onClick={() => {
                                                            resetOthersEditions()
                                                            setEditableLabel(prevObj => {
                                                                return {
                                                                    ...prevObj,
                                                                    id: item.id,
                                                                    fup: {
                                                                        ...prevObj.fup,
                                                                        second: true
                                                                    }
                                                                }
                                                            })
                                                        }}
                                                        className={`fup2 w-full pl-1 focus-within:ring-0 focus-within:border-none text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                                    />

                                                    {editableLabel.id === item.id && editableLabel.fup.second && (
                                                        <SaveButton
                                                            onClick={() => {
                                                                if (editLock) return;
                                                                maskRefsTwo[index].blur();
                                                                setIsEditing(false);
                                                                handleChangeFupDate(item.id, maskRefsTwo[index].value, '2ª FUP ', ['notion_list'])
                                                            }}
                                                            status={updateState}
                                                        />
                                                    )}

                                                </div>

                                            </TableCell>

                                            {/* 3ª FUP */}
                                            <TableCell className="font-semibold text-[14px] text-right">

                                                <div className='relative flex gap-2 items-center'>

                                                    {editLock && (
                                                        <div className='absolute inset-0 cursor-not-allowed'></div>
                                                    )}

                                                    <ReactInputMask
                                                        mask='99/99/9999'
                                                        defaultValue={fupDateConveter(item.properties["3ª FUP"]?.date?.start || '')}
                                                        type="text"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                                handleChangeFupDate(item.id, e.currentTarget.value, '3ª FUP', ['notion_list', 'send_proposal'])
                                                            }
                                                        }}
                                                        onClick={() => {
                                                            resetOthersEditions()
                                                            setEditableLabel(prevObj => {
                                                                return {
                                                                    ...prevObj,
                                                                    id: item.id,
                                                                    fup: {
                                                                        ...prevObj.fup,
                                                                        third: true
                                                                    }
                                                                }
                                                            })
                                                        }}
                                                        className={`fup3 w-full pl-1 focus-within:ring-0 focus-within:border-none text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                                    />

                                                    {editableLabel.id === item.id && editableLabel.fup.third && (
                                                        <SaveButton
                                                            onClick={() => {
                                                                if (editLock) return;
                                                                maskRefsThree[index].blur();
                                                                setIsEditing(false);
                                                                handleChangeFupDate(item.id, maskRefsThree[index].value, '3ª FUP', ['notion_list'])
                                                            }}
                                                            status={updateState}
                                                        />
                                                    )}

                                                </div>
                                            </TableCell>

                                            {/* 4ª FUP */}
                                            <TableCell className="font-semibold text-[14px] text-right">

                                                <div className='relative flex gap-2 items-center'>

                                                    {editLock && (
                                                        <div className='absolute inset-0 cursor-not-allowed'></div>
                                                    )}

                                                    <ReactInputMask
                                                        mask='99/99/9999'
                                                        defaultValue={fupDateConveter(item.properties["4ª FUP"]?.date?.start || '')}
                                                        type="text"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                                handleChangeFupDate(item.id, e.currentTarget.value, '4ª FUP', ['notion_list', 'send_proposal'])
                                                            }
                                                        }}
                                                        onClick={() => {
                                                            resetOthersEditions()
                                                            setEditableLabel(prevObj => {
                                                                return {
                                                                    ...prevObj,
                                                                    id: item.id,
                                                                    fup: {
                                                                        ...prevObj.fup,
                                                                        fourth: true
                                                                    }
                                                                }
                                                            })
                                                        }}
                                                        className={`fup4 w-full pl-1 focus-within:ring-0 focus-within:border-none text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                                    />

                                                    {editableLabel.id === item.id && editableLabel.fup.fourth && (
                                                        <SaveButton
                                                            onClick={() => {
                                                                if (editLock) return;
                                                                maskRefsFour[index].blur();
                                                                setIsEditing(false);
                                                                handleChangeFupDate(item.id, maskRefsFour[index].value, '4ª FUP', ['notion_list'])
                                                            }}
                                                            status={updateState}
                                                        />
                                                    )}

                                                </div>

                                            </TableCell>

                                            {/* 5ª FUP */}
                                            <TableCell className="font-semibold text-[14px] text-right">

                                                <div className='relative flex gap-2 items-center'>

                                                    {editLock && (
                                                        <div className='absolute inset-0 cursor-not-allowed'></div>
                                                    )}

                                                    <ReactInputMask
                                                        mask='99/99/9999'
                                                        defaultValue={fupDateConveter(item.properties["5ª FUP "]?.date?.start || '')}
                                                        type="text"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
                                                                handleChangeFupDate(item.id, e.currentTarget.value, '5ª FUP ', ['notion_list', 'send_proposal'])
                                                            }
                                                        }}
                                                        onClick={() => {
                                                            resetOthersEditions()
                                                            setEditableLabel(prevObj => {
                                                                return {
                                                                    ...prevObj,
                                                                    id: item.id,
                                                                    fup: {
                                                                        ...prevObj.fup,
                                                                        fifth: true
                                                                    }
                                                                }
                                                            })
                                                        }}
                                                        className={`fup5 w-full pl-1 focus-within:ring-0 focus-within:border-none text-sm border-transparent bg-transparent rounded-md text-ellipsis overflow-hidden whitespace-nowrap`}
                                                    />

                                                    {editableLabel.id === item.id && editableLabel.fup.fifth && (
                                                        <SaveButton
                                                            onClick={() => {
                                                                if (editLock) return;
                                                                maskRefsFive[index].blur();
                                                                setIsEditing(false);
                                                                handleChangeFupDate(item.id, maskRefsFive[index].value, '5ª FUP ', ['notion_list'])
                                                            }}
                                                            status={updateState}
                                                        />
                                                    )}

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

            {(!firstLoad && data?.results?.length === 0) && (
                <div className='flex items-center text-sm justify-center h-[42px] border border-slate-200 dark:border-slate-600'>
                    <span>Não há registros para exibir</span>
                </div>
            )}

            {hasMore && (
                <Button onClick={loadMore} disabled={isFetchingNextCursor} className='mt-5'>
                    {isFetchingNextCursor ? 'Carregando...' : 'Carregar mais'}
                </Button>
            )}

        </div>
    )
}
