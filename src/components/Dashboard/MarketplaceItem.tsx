"use client"
import React, { Suspense, useState } from 'react'
import CardDataStats from '../ui/CardDataStats';
import AnimatedNumber from '../ui/AnimatedNumber';
import { useQuery } from "@tanstack/react-query";
import api from '@/utils/api';
import { NotionPage } from '@/interfaces/INotion';
import { TbMoneybag } from 'react-icons/tb';
import CardDataStatsSkeleton from '../ui/CardDataStatsSkeleton';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { IoCalendar } from 'react-icons/io5';
import { LuDownloadCloud } from 'react-icons/lu';
import ProjectedProfitabilityChart from '../Charts/ProjectedProfitabilityChart';
import { Fade } from 'react-awesome-reveal';
import numberFormat from '@/functions/formaters/numberFormat';
import { IWalletResponse } from '@/interfaces/IWallet';
import { Button } from '../Button';
import OfficeInfo from '../Modals/OfficeInfo';

type MarketplaceItemProps = {
    id: string;
}

export default function MarketplaceItem({ id }: MarketplaceItemProps) {

    const [confirmPurchaseModalOpen, setConfirmPurchaseModalOpen] = useState(false);

    const fetchMarketplaceItem = async () => {
        const response = await api.get(`/api/notion-api/list/page/${id}/`);
        return response.data;
    };

    const fetchUpdatedVlMarketplaceItem = async () => {
        const response = await api.post('/api/extrato/wallet/', {
            oficio: data,
            from_today: true
        });

        return response.data;
    };

    const { data } = useQuery(
        {
            queryKey: ['notion_marketplace_item', id],
            queryFn: fetchMarketplaceItem,
        }
    );

    const { data: updatedVlData } = useQuery(
        {
            queryKey: ['updated_vl_marketplace_item', data],
            queryFn: fetchUpdatedVlMarketplaceItem,
            enabled: !!data
        }
    );

    console.log("data: ", data);
    console.log("vldata: ", updatedVlData);

    function handleTotalInvested(data: NotionPage) {
        let totalInvested = 0;
        if (data.properties["Valor de Aquisição (Wallet)"].number) {
            totalInvested += Number(data?.properties["Valor de Aquisição (Wallet)"]?.number) || 0;
        }
        return totalInvested;
    }

    function handleValorProjetado(data: NotionPage) {
        let totalProjected = 0;
        if (data?.properties["Valor Projetado"]?.number) {
            totalProjected += Number(data?.properties["Valor Projetado"].number) || 0;
        }
        return totalProjected;
    }

    function handlePrevisaoDePagto(data: NotionPage) {
        if (data.properties["Previsão de pagamento"].date) {
            const date = new Date(data.properties["Previsão de pagamento"].date.start);
            const day = date.getUTCDate().toString().padStart(2, '0');
            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
            const year = date.getUTCFullYear();
            return `${day}/${month}/${year}`;
        }
    }

    function handleTotalProfitValue(updatedVlData: IWalletResponse) {
        if (updatedVlData !== undefined) {

            let totalProfit = 0;
            const totalProjected = updatedVlData?.["valor_projetado"] || 0;
            const updatedTotalLiquid = updatedVlData?.result[updatedVlData.result.length - 1].valor_liquido_disponivel || 0;
            const totalInvested = updatedVlData?.["valor_investido"] || 0;
            totalProfit += (updatedTotalLiquid - totalInvested) + (totalProjected - updatedTotalLiquid);

            return totalProfit;
        }
    }


    return (
        <div>
            <div
                className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <Fade cascade damping={0.1} triggerOnce>
                    {
                        data ?
                            <CardDataStats
                                title="Valor de Aquisição"
                                total={data && <AnimatedNumber value={data && handleTotalInvested(data)} />}
                            >
                                <TbMoneybag className="w-[18px] h-[18px]" />
                            </CardDataStats>
                            : <CardDataStatsSkeleton />
                    }
                    {data ?
                        <CardDataStats
                            title="Valor Projetado"
                            total={data && <AnimatedNumber value={data && handleValorProjetado(data)} />}
                            levelUp
                            rate={updatedVlData && numberFormat(handleTotalProfitValue(updatedVlData) || 0)}
                        >
                            <MdOutlineAttachMoney className="w-[18px] h-[18px]" />
                        </CardDataStats> : <CardDataStatsSkeleton />
                    }
                    {data ?
                        <CardDataStats
                            title="Previsão de pagamento"
                            total={data && handlePrevisaoDePagto(data)}
                        >
                            <IoCalendar className="w-[18px] h-[18px]" />
                        </CardDataStats> : <CardDataStatsSkeleton />}

                    {
                        data ?
                            <CardDataStats
                                title="Doc. relacionada"
                                elementHtml={
                                    <div className="flex items-center gap-2 text-black dark:text-white">
                                        <span className="text-md font-medium">Baixar PDF</span>
                                    </div>
                                }
                            >
                                <LuDownloadCloud className="w-[18px] h-[18px]" />
                            </CardDataStats> : <CardDataStatsSkeleton />}
                </Fade>
            </div>
            <Fade cascade damping={0.1} triggerOnce>
                <div className=" grid grid-cols-12 mt-4 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                    <ProjectedProfitabilityChart data={updatedVlData} />
                </div>
            </Fade>
            <Fade cascade damping={0.1} triggerOnce>
                <div className=" grid grid-cols-12 mt-4 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-12">
                        <Button
                            onClick={() => setConfirmPurchaseModalOpen(true)}
                            className='uppercase text-sm font-medium'>
                            adquirir este ativo
                        </Button>
                    </div>
                </div>
            </Fade>

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
    )
}
