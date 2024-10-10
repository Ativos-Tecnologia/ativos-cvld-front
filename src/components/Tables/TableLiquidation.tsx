import { ENUM_TIPO_OFICIOS_LIST } from '@/constants/constants';
import { UserInfoAPIContext } from '@/context/UserInfoContext';
import tipoOficio from '@/enums/tipoOficio.enum';
import api from '@/utils/api';
import { LucideChevronsUpDown } from 'lucide-react';
import React, { forwardRef, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { BiLoader, BiSolidCategoryAlt, BiSolidDockLeft, BiSolidWallet, BiUpArrowAlt } from 'react-icons/bi';
import { MdOutlineFilterAltOff } from 'react-icons/md';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from './TableDefault';
import { AiOutlineLoading, AiOutlineUser } from 'react-icons/ai';
import { PiCursorClick, PiHash, PiListBulletsBold } from 'react-icons/pi';
import { BsCalendar3, BsClock } from 'react-icons/bs';
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
import notionColorResolver from '@/functions/formaters/notionColorResolver';
import { Item } from '@radix-ui/react-select';
import { Button } from '../ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { WalletTableSkeletons } from '../Skeletons/WalletTableSkeletons';
import dateFormater from '@/functions/formaters/dateFormater';
import { ITableWalletProps } from './TableWallet';
import { LiquidationTimeCounter } from '../TimerCounter/LiquidationTimeCounter';

const TableLiquidation = forwardRef<HTMLDivElement | null, ITableWalletProps>(({ setVlData, setDefaultFilterObject }, ref) => {

    /* =====> states <====== */
    const [fetchingVL, setFetchingVL] = useState<string | null>(null);
    const [openTipoOficioPopover, setOpenTipoOficioPopover] = useState<boolean>(false);
    const [openUsersPopover, setOpenUsersPopover] = useState<boolean>(false)
    const [oficioSelectValue, setOficioSelectValue] = useState<tipoOficio | null>(null);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [usersList, setUsersList] = useState<string[]>([]);
    const [filters, setFilters] = useState({ credor: '' });
    const [backendResults, setBackendResults] = useState<NotionPage[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>();
    const [hasMore, setHasMore] = useState<boolean>();
    const { data: { user, role } } = useContext(UserInfoAPIContext);
    const queryClient = useQueryClient();

    const { refetch: refetchByName, isFetching: isFetchingByName } = useQuery({
        queryKey: ['notion_wallet_creditor_name', filters.credor],
        queryFn: () => fetchByName(filters.credor),
        enabled: false,
    });

    const { refetch: refetchNextCursor, isFetching: isFetchingNextCursor } = useQuery({
        queryKey: ['notion_wallet_next_cursor', nextCursor],
        queryFn: () => fetchNextCursor,
        enabled: false,
    });

    const fetchLiquidationItems = async () => {
        const response = await api.get("/api/notion-api/marketplace/on-sale/")
        if (response.status === 200) {
            return response.data
        }
    };

    const { data, isPending, isFetching } = useQuery({
        queryKey: ["liquidation_list"],
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        refetchInterval: 15000,
        staleTime: 13000,
        queryFn: fetchLiquidationItems,
    })

    /* =====> refs <====== */
    const selectTipoOficioRef = useRef<any>(null);
    const selectUserRef = useRef<any>(null);
    const inputCredorRefs = useRef<HTMLInputElement[] | null>([]);

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

        return customResults.results
    }, [backendResults, nextCursor, data?.next_cursor, data?.has_more, data?.results, hasMore, filters.credor]);

    /* =====> functions <===== */

    const fetchUpdatedVL = async (oficio: NotionPage) => {
        setFetchingVL(oficio.id)
        // Essa função recebe um objeto do tipo NotionPage e retorna um objeto do tipo IWalletResponse com os valores atualizados
        try {
            const response = await api.post('/api/extrato/wallet/', {
                oficio
            });
            if (response.data) {
                setVlData(response.data);
                if (ref && 'current' in ref && ref.current) {
                    ref.current.scrollIntoView({
                        behavior: 'smooth'
                    })
                }
            }

        } catch (error: any) {
            throw new Error(error.message);
        } finally {
            setFetchingVL(null);
        }
    }

    const handleFilterByUser = (user: string) => {
        setOpenUsersPopover(false)
        setSelectedUser(user);
        setDefaultFilterObject({
            "username": user
        })
    }

    const handleCleanAllFilters = () => {
        setOficioSelectValue(null);
        setSelectedUser(null);
        setDefaultFilterObject({
            "username": user
        })
    }

    function dateConverter(date: string): string {
        const convertedDate = date.split("-").reverse().join("/");
        return convertedDate;
    }

    /* função que seta o valor do filtro, se existir mais de um valor, somente
    o especificado em field será modificado */
    const handleFilterChange = useCallback((field: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
        // setShouldFetchExternally(true);
    }, []);

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
        debugger
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

    /* função que é responsável por carregar mais ofícios para a tabela, caso existam mais */
    const loadMore = () => {
        if (hasMore && !isFetchingNextCursor) {
            refetchNextCursor();
        }
    };

    /* =====> effects <===== */
    /* efeito disparado para que verificar a cada 0.5s se o valor da prop credor
    do filtro bate com algum credor elemento do processedData */
    useEffect(() => {
        if (filters.credor) {
            const timer = setTimeout(() => {
                const hasMatch = processedData.some((item: NotionPage) =>
                    item.properties.Credor?.title[0]?.text.content.toLowerCase().includes(filters.credor.toLowerCase())
                );

                if (!hasMatch) {
                    queryClient.cancelQueries({ queryKey: ['notion_wallet_list'] });
                    refetchByName();
                }

            }, 500);

            return () => clearTimeout(timer);
        }
    }, [filters, processedData]);

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
        <>
            {/* Filtros estilo select */}
            <div className={`flex items-center justify-between my-3 ${isPending && 'pointer-events-none'}`}>
                <div className='flex items-center gap-2'>

                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Filtrar por nome"
                            value={filters.credor}
                            onChange={(e) => handleFilterChange('credor', e.target.value)}
                            className="max-w-md rounded-md text-sm border border-stroke bg-white px-3 py-2 font-medium dark:border-strokedark dark:bg-boxdark-2"
                        />
                        {isFetchingByName && (
                            <div className="flex flex-row text-center text-gray-500 dark:text-gray-400 ml-2 py-2">
                                <AiOutlineLoading className="animate-spin w-5 h-5" />
                            </div>
                        )}

                    </div>

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
                                            className={`min-w-48 flex items-center justify-between gap-1 border border-stroke text-sm dark:border-strokedark font-semibold py-2 px-3 hover:bg-slate-100 uppercase dark:hover:bg-slate-700 dark:bg-boxdark-2 ${openUsersPopover && 'bg-slate-100 dark:bg-slate-700'} rounded-md transition-colors duration-200 cursor-pointer`}>
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
            {/* End Filtros estilo select */}

            <div className='col-span-12 max-w-full overflow-x-scroll pb-5'>
                {/* TABLE */}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell className='max-w-[50px]'>

                            </TableHeadCell>
                            <TableHeadCell className='max-w-40'>
                                <Title text='Tempo para expirar liquidação'>
                                    <div className='flex gap-2'>
                                        <BsClock className='text-base' />
                                        <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>Tempo para expirar liquidação</span>
                                    </div>
                                </Title>
                            </TableHeadCell>
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
                                <Title text='LOA'>
                                    <div className='flex gap-2'>
                                        <LiaCoinsSolid className='text-base' />
                                        <span className='text-left w-40 text-ellipsis overflow-hidden whitespace-nowrap'>LOA</span>
                                    </div>
                                </Title>
                            </TableHeadCell>
                            {/* <TableHeadCell className='max-w-50'>
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
                            </TableHeadCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isPending ? (
                            <>
                                {[...Array(3)].map((_, index) => (
                                    <WalletTableSkeletons key={index} />
                                ))}
                            </>
                        ) : (
                            <React.Fragment>
                                {
                                    data?.results?.length > 0 && (
                                        <>
                                            {
                                                processedData?.map((item: NotionPage, index: number) => (
                                                    <TableRow
                                                        key={item.id}
                                                        className={`hover:shadow-3 dark:hover:shadow-body`}
                                                    >
                                                        {/* botão de abrir gráficos */}
                                                        <TableCell width={50}>
                                                            <button
                                                                title='Abrir gráficos'
                                                                onClick={() => fetchUpdatedVL(item)}
                                                                className='w-6 h-6 rounded-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colos duration-300 grid place-items-center'
                                                            >
                                                                {fetchingVL === item.id ? <AiOutlineLoading className='animate-spin' /> : <LuBarChart4 />}
                                                            </button>
                                                        </TableCell>

                                                        {/* Tempo de expiração */}
                                                        <TableCell className='text-sm text-right font-medium'>
                                                            <LiquidationTimeCounter
                                                                purchaseDate={item.properties["Data de aquisição do precatório"].date?.start || ''}
                                                            />
                                                            {/* {calculateTimeLeft(item.properties["Data de aquisição do precatório"].date?.start.split("T")[0] || '')} */}
                                                        </TableCell>


                                                        {/* credor info */}
                                                        <TableCell
                                                            title={item.properties.Credor?.title[0].text.content || ''}
                                                            className="h-[34.8px] flex items-center gap-2 font-semibold text-sm"
                                                        >
                                                            <div className='max-w-[366px] text-ellipsis overflow-hidden whitespace-nowrap'>
                                                                {
                                                                    item.properties.Credor?.title[0].text.content || ''
                                                                }
                                                            </div>
                                                        </TableCell>

                                                        {/* valor de aquisição */}
                                                        <TableCell className='text-sm text-right'>
                                                            {numberFormat(item.properties['Valor de Aquisição (Wallet)']?.number || 0)}
                                                        </TableCell>

                                                        {/* valor projetado */}
                                                        <TableCell className='text-sm text-right'>
                                                            {numberFormat(item.properties['Valor Projetado']?.number || 0)}
                                                        </TableCell>

                                                        {/* Previsão de pagamento */}
                                                        <TableCell className='text-sm'>
                                                            {dateConverter(item.properties['Previsão de pagamento']?.date?.start || '')}
                                                        </TableCell>

                                                        {/* Valor líquido */}
                                                        <TableCell className='text-sm text-left'>
                                                            {item.properties["LOA"].number || 0}
                                                        </TableCell>

                                                        {/* Natureza */}
                                                        {/* <TableCell className='text-sm'>
                                                            {item.properties["Natureza"].select?.name}
                                                        </TableCell> */}

                                                        {/* Data de recebimento */}
                                                        {/* <TableCell className='text-sm'>
                                                            {dateConverter(item.properties["Data do Recebimento"].date?.start || '')}
                                                        </TableCell> */}

                                                        {/* Data base */}
                                                        {/* <TableCell className='text-sm'>
                                                            {dateConverter(item.properties["Data Base"].date?.start || '')}
                                                        </TableCell> */}

                                                        {/* Juros fixados */}
                                                        {/* <TableCell className='text-sm'>
                                                            <CustomCheckbox
                                                                check={item.properties['Juros fixados?'].checkbox}
                                                                readOnly
                                                            />
                                                        </TableCell> */}

                                                        {/* PSS */}
                                                        {/* <TableCell className='text-sm text-right'>
                                                            {numberFormat(item.properties["PSS"].number || 0)}
                                                        </TableCell> */}

                                                        {/* Meses RRa */}
                                                        {/* <TableCell className='text-sm text-right'>
                                                            {item.properties["Meses RRA"].number}
                                                        </TableCell> */}

                                                        {/* Incidência de IR */}
                                                        {/* <TableCell className='text-sm'>
                                                            <CustomCheckbox
                                                                check={item.properties['Incidência IR'].checkbox}
                                                                readOnly
                                                            />
                                                        </TableCell> */}

                                                        {/* Valor Principal */}
                                                        {/* <TableCell className='text-sm text-right'>
                                                            {numberFormat(item.properties["Valor Principal"].number || 0)}
                                                        </TableCell> */}

                                                        {/* Valor Juros */}
                                                        {/* <TableCell className='text-sm text-right'>
                                                            {numberFormat(item.properties["Valor Juros"].number || 0)}
                                                        </TableCell> */}

                                                        {/* Usuário da Wallet */}
                                                        {/* <TableCell className='text-sm'>
                                                            <div
                                                                className='flex items-center gap-1 overflow-x-scroll custom-scrollbar pb-0.5'>
                                                                {item.properties["Usuário da Wallet"].multi_select?.map((user: any) => (
                                                                    <span
                                                                        key={user.id}
                                                                        style={{
                                                                            backgroundColor: notionColorResolver(user.color)
                                                                        }}
                                                                        className='px-2 py-0 text-white rounded'>
                                                                        {user.name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </TableCell> */}
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

                {data?.results?.length === 0 && (
                    <div className='flex items-center justify-center pt-5'>
                        <span>Não há registros para exibir</span>
                    </div>
                )}

                {hasMore && (
                    <Button onClick={loadMore} disabled={isFetchingNextCursor} className='mt-5'>
                        {isFetchingNextCursor ? 'Carregando...' : 'Carregar mais'}
                    </Button>
                )}
            </div>
        </>
    )
});

TableLiquidation.displayName = 'TableLiquidation';

export default TableLiquidation