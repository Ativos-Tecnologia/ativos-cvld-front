'use client';

import React, { useContext } from 'react';
import DataStats from '../DataStats/DataStats';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { FaBalanceScale, FaFileAlt } from 'react-icons/fa';
import { UserInfoAPIContext, UserInfoContextType } from '@/context/UserInfoContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import MarketplaceCardSkeleton from '../Skeletons/MarketplaceCardSkeleton';
import { AiOutlineLoading } from 'react-icons/ai';
import api from '@/utils/api';
import Image from 'next/image';
import GridCardsWrapper from '../CrmUi/Wrappers/GridCardsWrapper';
import HoverCard from '../CrmUi/Wrappers/HoverCard';
import { imgPaths } from '@/constants/tribunais';
import { FaFileInvoiceDollar } from 'react-icons/fa6';
import { BiSolidCoinStack } from 'react-icons/bi';
import numberFormat from '@/functions/formaters/numberFormat';
import { DueDiligenceCounter } from '../TimerCounter/DueDiligenceCounter';
import { useRouter } from 'next/navigation';
import '../../css/scrollbar.css';

enum navItems {
    TODOS = 'Todos',
    REVISAO_VALOR_LOA = 'Revisão Valor/LOA',
    PRE_DUE_ATIVO = 'Pré-Due Ativo',
    PRE_DUE_CEDENTE = 'Pré-Due Cedente',
    DUE_DILIGENCE = 'Due Diligence',
    DUE_EM_ANDAMENTO = 'Due em Andamento',
    REVISAO_DE_DUE = 'Revisão de Due Diligence',
    EM_LIQUIDACAO = 'Em liquidação',
    EM_CESSAO = 'Em cessão',
    REPACTUACAO = 'Repactuação',
}

export type SimpleNotionData = {
    id: string;
    credor: string;
    status: string;
    loa: number;
    regime: string;
    status_diligencia: string;
    esfera: string;
    valor_liquido_disponivel: number;
    tribunal: string;
    tipo: {
        color: string;
        id: string;
        name: string;
    };
    prazo_final_due: string;
    proposta_escolhida: number;
    comissao: number;
};

type SimpleDataProps = {
    results: Array<SimpleNotionData>;
};

export const iconsConfig = {
    PRECATÓRIO: {
        bgColor: '#0332ac',
        icon: <FaFileAlt className="text-[22px] text-snow" />,
    },
    CREDITÓRIO: {
        bgColor: '#056216',
        icon: <FaFileInvoiceDollar className="text-[22px] text-snow" />,
    },
    'R.P.V.': {
        bgColor: '#810303',
        icon: <BiSolidCoinStack className="text-[22px] text-snow" />,
    },
};

const Juridico = () => {
    const {
        data: { first_name, user },
    } = useContext<UserInfoContextType>(UserInfoAPIContext);

    const [activeTab, setActiveTab] = React.useState<string>(navItems.TODOS);
    const [simpleData, setSimpleData] = React.useState<SimpleDataProps>({ results: [] });
    const [loading, setLoading] = React.useState<boolean>(false);
    const router = useRouter();

    const fetchAllPrecatoryWithSimpleData = React.useCallback(async () => {
        setLoading(true);
        const response = await api.get(
            activeTab === navItems.TODOS
                ? '/api/legal/'
                : `/api/legal/?status_diligencia=${activeTab}`,
        );
        setSimpleData(response.data);
        setLoading(false);
    }, [activeTab]);

    React.useEffect(() => {
        fetchAllPrecatoryWithSimpleData();
    }, [activeTab, fetchAllPrecatoryWithSimpleData]);

    return (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 flex w-full items-end justify-end gap-5 rounded-md">
                <Breadcrumb
                    customIcon={<FaBalanceScale className="h-[32px] w-[32px]" />}
                    altIcon="Espaço de trabalho do time jurídico"
                    pageName="Jurídico"
                    title={`Olá, ${first_name}`}
                />
            </div>
            <div className="col-span-12 grid w-full grid-cols-1 gap-5 md:grid-cols-2">
                <DataStats data={simpleData.results} isLoading={loading} />
            </div>
            <div className="col-span-12">
                <Tabs defaultValue={navItems.TODOS} className="w-full">
                    <TabsList className="tabs-scrollbar justify-normal overflow-x-auto overflow-y-hidden md:max-w-[calc(100vw-1rem)] xl:max-w-[1130px] 2xl:w-fit 2xl:max-w-full">
                        {Object.values(navItems).map((item, index) => (
                            <TabsTrigger
                                key={index}
                                value={item}
                                disabled={loading}
                                className="relative flex items-center justify-center overflow-hidden rounded-md transition-all duration-300 disabled:cursor-not-allowed"
                                onClick={() => {
                                    setActiveTab(item);
                                }}
                            >
                                <span
                                    className={`absolute left-0 top-full flex w-full items-center justify-center py-1.5 duration-300 first-line:transition-all ${loading && item === activeTab ? 'translate-y-[-100%]' : 'translate-y-0'}`}
                                >
                                    <AiOutlineLoading className="h-5 w-5 animate-spin text-current" />
                                </span>

                                <span
                                    className={`transition-all duration-300 ${loading && item === activeTab ? 'translate-y-[114%]' : 'translate-y-0'}`}
                                >
                                    {item}
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
                {loading ? (
                    <GridCardsWrapper.List className="gap-4">
                        {Array.from({ length: 12 }, (_, i) => (
                            <MarketplaceCardSkeleton key={i} />
                        ))}
                    </GridCardsWrapper.List>
                ) : (
                    <>
                        <GridCardsWrapper.List className="gap-4">
                            {simpleData.results.length > 0 &&
                                simpleData.results.map((item) => {
                                    let deadlineSituation: string; // define a situação do prazo

                                    const currentDate = +new Date();
                                    const itemDueDate = +new Date(item.prazo_final_due);
                                    const timeZone = 3;

                                    // calcula quantas horas faltam para o prazo expirar
                                    const hoursRemaining =
                                        (itemDueDate - currentDate) / (1000 * 60 * 60) - timeZone;

                                    if (hoursRemaining >= 48) {
                                        deadlineSituation = 'good';
                                    } else if (hoursRemaining < 48 && hoursRemaining >= 24) {
                                        deadlineSituation = 'warning';
                                    } else {
                                        deadlineSituation = 'danger';
                                    }

                                    return (
                                        <HoverCard
                                            onClick={() =>
                                                router.push(`/dashboard/juridico/${item.id}`)
                                            }
                                            key={item.id}
                                            className="relative h-65"
                                        >
                                            {deadlineSituation === 'danger' &&
                                                item.prazo_final_due && (
                                                    <>
                                                        <div className="absolute inset-0 z-0 animate-celer-ping rounded-md bg-red-500 opacity-60 xsm:left-2 xsm:max-w-[370px] md:left-3 md:max-w-[340px] lg:left-[15px] lg:max-w-115 xl:max-w-[334px] 3xl:max-w-80" />
                                                        <div className="absolute inset-0 z-0 animate-celer-ping rounded-md bg-red-500 opacity-60 delay-300 xsm:left-2 xsm:max-w-[370px] md:left-3 md:max-w-[340px] lg:left-[15px] lg:max-w-115 xl:max-w-[334px] 3xl:max-w-80" />
                                                    </>
                                                )}

                                            <HoverCard.Container
                                                className="h-65"
                                                backgroundImg={
                                                    imgPaths[item.tribunal as keyof typeof imgPaths]
                                                }
                                                backgroundColorFill="strong"
                                            >
                                                <HoverCard.Content
                                                    className={`${item.prazo_final_due && 'outline outline-[3px]'} 
                              ${deadlineSituation === 'good' && 'outline-green-400'} 
                              ${deadlineSituation === 'warning' && 'outline-yellow-500'} 
                              ${deadlineSituation === 'danger' && 'outline-red-500'}
                                `}
                                                >
                                                    <HoverCard.TribunalBadge
                                                        tribunal={item.tribunal}
                                                    />
                                                    <HoverCard.Icon
                                                        icon={
                                                            iconsConfig[
                                                                item.tipo
                                                                    .name as keyof typeof iconsConfig
                                                            ]?.icon
                                                        }
                                                        // bgColor={iconsConfig[item.tipo as keyof typeof iconsConfig].bgColor}
                                                        bgColor={
                                                            iconsConfig[
                                                                item.tipo
                                                                    .name as keyof typeof iconsConfig
                                                            ]?.bgColor
                                                        }
                                                        className="group-hover:opacity-0"
                                                    />

                                                    <div className="text-snow group-hover:opacity-0">
                                                        <HoverCard.InfoList>
                                                            <HoverCard.ListItem className="col-span-2 mt-2 border-0">
                                                                {/* <p className="text-[10px] text-gray-300">CREDOR</p> */}
                                                                <p className="max-w-[230px] overflow-hidden text-ellipsis whitespace-nowrap text-sm uppercase">
                                                                    {item.credor}
                                                                </p>
                                                            </HoverCard.ListItem>

                                                            <HoverCard.ListItem className="border-0">
                                                                <p className="text-[10px] text-gray-300">
                                                                    VALOR LÍQUIDO
                                                                </p>
                                                                <p className="text-sm">
                                                                    {numberFormat(
                                                                        item.valor_liquido_disponivel,
                                                                    )}
                                                                </p>
                                                            </HoverCard.ListItem>

                                                            <HoverCard.ListItem className="border-0">
                                                                <p className="text-[10px] text-gray-300">
                                                                    REGIME
                                                                </p>
                                                                <p className="text-sm">
                                                                    {item.regime}
                                                                </p>
                                                            </HoverCard.ListItem>

                                                            <HoverCard.ListItem className="border-0">
                                                                <p className="text-[10px] text-gray-300">
                                                                    LOA
                                                                </p>
                                                                <p className="text-sm">
                                                                    {item.loa || 'Não possui'}
                                                                </p>
                                                            </HoverCard.ListItem>

                                                            <HoverCard.ListItem className="border-0">
                                                                <p className="text-[10px] text-gray-300">
                                                                    ESFERA
                                                                </p>
                                                                <p className="text-sm">
                                                                    {item.esfera}
                                                                </p>
                                                            </HoverCard.ListItem>

                                                            <HoverCard.ListItem className="col-span-2">
                                                                <p className="text-[10px] text-gray-300">
                                                                    Status da Diligência
                                                                </p>
                                                                <p className="text-xs">
                                                                    {item.status_diligencia ||
                                                                        'Não possui'}
                                                                </p>
                                                            </HoverCard.ListItem>

                                                            <HoverCard.ListItem className="col-span-2 mt-2 border-0">
                                                                <p className="text-[10px] text-gray-300">
                                                                    PRAZO FINAL
                                                                </p>
                                                                <DueDiligenceCounter
                                                                    dueDate={
                                                                        item?.prazo_final_due || ''
                                                                    }
                                                                />
                                                            </HoverCard.ListItem>
                                                        </HoverCard.InfoList>
                                                    </div>
                                                </HoverCard.Content>

                                                <HoverCard.HiddenContent className="h-65 items-center justify-evenly gap-5">
                                                    <span>Clique para detalhes</span>
                                                </HoverCard.HiddenContent>
                                            </HoverCard.Container>
                                        </HoverCard>
                                    );
                                })}
                        </GridCardsWrapper.List>
                        {simpleData.results.length === 0 && (
                            <div className="-my- flex h-96 items-center justify-center">
                                <div className="mb-20">
                                    <Image
                                        src="/images/illustration/illustration-01.svg"
                                        alt="Nenhum resultado encontrado"
                                        width={300}
                                        height={300}
                                    />
                                    <p className="text-center text-lg font-semibold">
                                        Nenhum resultado encontrado
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            {/* <div className="flex gap-5 item-center bg-white dark:bg-boxdark my-4 p-5 rounded-md">
            {
                Object.values(navItems).map((item, index) => (
                    <Button size="sm" key={index} variant="secondary" onClick={() => console.log(item)}>
                        {item}
                    </Button>
                ))
            }
        </div> */}
        </div>
    );
};

export default Juridico;
