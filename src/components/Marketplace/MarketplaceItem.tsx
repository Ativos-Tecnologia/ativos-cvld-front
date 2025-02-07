'use client';
import { UserInfoAPIContext } from '@/context/UserInfoContext';
import numberFormat from '@/functions/formaters/numberFormat';
import { NotionPage } from '@/interfaces/INotion';
import { IWalletResponse } from '@/interfaces/IWallet';
import api from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { Suspense, useContext, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { IoCalendar } from 'react-icons/io5';
import { DownloadCloudIcon } from 'lucide-react';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { TbMoneybag } from 'react-icons/tb';
import { Button } from '../Button';
import ProjectedProfitabilityChart from '../Charts/ProjectedProfitabilityChart';
import OfficeInfo from '../Modals/OfficeInfo';
import AnimatedNumber from '../ui/AnimatedNumber';
import CardDataStats from '../ui/CardDataStats';
import CardDataStatsSkeleton from '../ui/CardDataStatsSkeleton';
import MarketplaceRecommendations from './MarketplaceRecommendations';
import { usePathname } from 'next/navigation';

type MarketplaceItemProps = {
    id: string;
};

export default function MarketplaceItem({ id }: MarketplaceItemProps) {
    const pathname = usePathname();
    const [confirmPurchaseModalOpen, setConfirmPurchaseModalOpen] = useState(false);

    const { data: userData } = useContext(UserInfoAPIContext);

    const fetchMarketplaceItem = async () => {
        const response = await api.get(`/api/notion-api/list/page/${id}/`);
        return response.data;
    };

    const fetchUpdatedVlMarketplaceItem = async () => {
        const response = await api.post('/api/extrato/wallet/', {
            oficio: data,
            from_today: true,
        });

        return response.data;
    };

    const { data } = useQuery({
        queryKey: ['notion_marketplace_item', id],
        queryFn: fetchMarketplaceItem,
    });

    const { data: updatedVlData } = useQuery({
        queryKey: ['updated_vl_marketplace_item', data],
        queryFn: fetchUpdatedVlMarketplaceItem,
        enabled: !!data,
    });

    function handleTotalInvested(data: NotionPage) {
        let totalInvested = 0;
        if (data.properties['Desembolso All-In']?.formula?.number) {
            totalInvested += Number(data?.properties['Desembolso All-In']?.formula?.number) || 0;
        }
        return totalInvested;
    }

    function handleValorProjetado(data: NotionPage) {
        let totalProjected = 0;
        if (data?.properties['Valor Projetado']?.number) {
            totalProjected += Number(data?.properties['Valor Projetado'].number) || 0;
        }
        return totalProjected;
    }

    function handlePrevisaoDePagto(data: NotionPage) {
        if (data.properties['Previsão de pagamento'].date) {
            const date = new Date(data.properties['Previsão de pagamento'].date.start);
            const day = date.getUTCDate().toString().padStart(2, '0');
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const year = date.getUTCFullYear();
            return `${day}/${month}/${year}`;
        }
    }

    function handleTotalProfitValue(updatedVlData: IWalletResponse) {
        if (updatedVlData !== undefined) {
            let totalProfit = 0;
            const totalProjected = updatedVlData?.['valor_projetado'] || 0;
            const updatedTotalLiquid =
                updatedVlData?.result[updatedVlData.result.length - 1].valor_liquido_disponivel ||
                0;
            const totalInvested = updatedVlData?.['valor_investido'] || 0;
            totalProfit +=
                updatedTotalLiquid - totalInvested + (totalProjected - updatedTotalLiquid);

            return totalProfit;
        }
    }

    return (
        <div className="overflow-x-visible pb-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <Fade cascade damping={0.1} triggerOnce>
                    {data ? (
                        <CardDataStats
                            title="Valor de Aquisição"
                            total={
                                data && <AnimatedNumber value={data && handleTotalInvested(data)} />
                            }
                        >
                            <TbMoneybag className="h-[18px] w-[18px]" />
                        </CardDataStats>
                    ) : (
                        <CardDataStatsSkeleton />
                    )}
                    {data ? (
                        <CardDataStats
                            title="Valor Projetado"
                            total={
                                data && (
                                    <AnimatedNumber value={data && handleValorProjetado(data)} />
                                )
                            }
                            levelUp
                            rate={
                                updatedVlData &&
                                numberFormat(handleTotalProfitValue(updatedVlData) || 0)
                            }
                        >
                            <MdOutlineAttachMoney className="h-[18px] w-[18px]" />
                        </CardDataStats>
                    ) : (
                        <CardDataStatsSkeleton />
                    )}
                    {data ? (
                        <div className="2xsm:hidden md:block">
                            <CardDataStats
                                title="Previsão de pagamento"
                                total={data && handlePrevisaoDePagto(data)}
                            >
                                <IoCalendar className="h-[18px] w-[18px]" />
                            </CardDataStats>
                        </div>
                    ) : (
                        <CardDataStatsSkeleton />
                    )}

                    {data ? (
                        <div className="2xsm:hidden md:block">
                            <CardDataStats
                                title="Due Diligence"
                                elementHtml={
                                    <a
                                        href={data?.properties['Link de Due Diligence']?.url}
                                        target="_blank"
                                        title="Acessar o link da Due Diligence"
                                        className="flex cursor-pointer items-center gap-2"
                                    >
                                        <span className="text-md font-medium underline">
                                            Ver documento
                                        </span>
                                    </a>
                                }
                            >
                                <DownloadCloudIcon className="h-[18px] w-[18px]" />
                            </CardDataStats>
                        </div>
                    ) : (
                        <CardDataStatsSkeleton />
                    )}
                    {data ? (
                        <div className="mt-[-30px] grid grid-cols-2 gap-3 md:hidden">
                            <CardDataStats
                                title="Previsão de pagamento"
                                total={data && handlePrevisaoDePagto(data)}
                            >
                                <IoCalendar className="h-[18px] w-[18px]" />
                            </CardDataStats>

                            <CardDataStats
                                title="Due Diligence"
                                elementHtml={
                                    <a
                                        href={data?.properties['Link de Due Diligence']?.url}
                                        target="_blank"
                                        title="Acessar o link da Due Diligence"
                                        className="flex cursor-pointer items-center gap-2"
                                    >
                                        <span className="text-md font-medium underline">
                                            Ver documento
                                        </span>
                                    </a>
                                }
                            >
                                <DownloadCloudIcon className="h-[18px] w-[18px]" />
                            </CardDataStats>
                        </div>
                    ) : (
                        <div className=" mt-[-30px] flex gap-3 md:hidden">
                            <CardDataStatsSkeleton />
                            <CardDataStatsSkeleton />
                        </div>
                    )}
                </Fade>
            </div>
            <Fade cascade damping={0.1} triggerOnce>
                <div className=" mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                    <ProjectedProfitabilityChart data={updatedVlData} />
                </div>
            </Fade>

            <div className="grid grid-cols-1 py-5">
                <MarketplaceRecommendations id={id} />
            </div>

            {data &&
                data.properties['Disponível Para Compra']?.checkbox &&
                data.properties['Usuário da Wallet'].multi_select[0]?.name !== userData?.user && (
                    <Fade cascade damping={0.1} triggerOnce>
                        <div className=" mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                            <div className="col-span-12 rounded-sm border 2xsm:flex 2xsm:justify-center 2xsm:border-transparent 2xsm:bg-transparent 2xsm:p-0 sm:px-7.5 md:border-stroke md:bg-white md:px-5 md:pb-5 md:pt-7.5 md:dark:border-strokedark md:dark:bg-boxdark xl:col-span-12 xl:justify-normal">
                                <Button
                                    onClick={() => setConfirmPurchaseModalOpen(true)}
                                    className="font-medium uppercase 2xsm:text-base md:text-sm"
                                >
                                    adquirir este ativo
                                </Button>
                            </div>
                        </div>
                    </Fade>
                )}

            {userData &&
                data &&
                userData.user === data.properties['Usuário da Wallet'].multi_select[0]?.name && (
                    <Fade cascade damping={0.1} triggerOnce>
                        <div className=" mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                            <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-12">
                                <div className="flex items-center gap-3">
                                    <BsFillPatchCheckFill className="text-xl text-green-500 dark:text-green-400" />
                                    <span>Você já possui este ativo em sua carteira</span>
                                </div>
                            </div>
                        </div>
                    </Fade>
                )}

            <Suspense fallback={null}>
                {/* modal */}
                {confirmPurchaseModalOpen && (
                    <OfficeInfo
                        setConfirmPurchaseModalOpen={setConfirmPurchaseModalOpen}
                        data={data}
                        updatedVlData={updatedVlData}
                        id={id}
                    />
                )}
            </Suspense>
        </div>
    );
}
