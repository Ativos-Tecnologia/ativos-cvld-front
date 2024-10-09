"use client"
import React from 'react'
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

type MarketplaceItemProps = {
    id: string;
}

export default function MarketplaceItem({ id }: MarketplaceItemProps) {
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

    function handleTotalInvested(data: NotionPage) {
        let totalInvested = 0;
        if (data.properties["Valor de Aquisição (Wallet)"].number) {
            totalInvested += Number(data?.properties["Valor de Aquisição (Wallet)"]?.number) || 0;
        }
        return totalInvested;
    }

    function handleValorProjetado(data: NotionPage) {
        let totalInvested = 0;
        if (data?.properties["Valor Projetado"]?.number) {
            totalInvested += Number(data?.properties["Valor Projetado"].number) || 0;
        }
        return totalInvested;
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


    return (
        <div>
            <div
                className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                    <Fade cascade damping={0.1} triggerOnce>
                {
                data ? <CardDataStats title="Valor de Aquisição" total={
                    data && <AnimatedNumber value={data && handleTotalInvested(data)} />
                } >
                    <TbMoneybag className="w-[18px] h-[18px]" />
                </CardDataStats> : <CardDataStatsSkeleton />}
                {data ?
                    <CardDataStats title="Valor Projetado" total={
                        data && <AnimatedNumber value={data && handleValorProjetado(data)} />
                    }

                        levelUp>
                        <MdOutlineAttachMoney className="w-[18px] h-[18px]" />
                    </CardDataStats> : <CardDataStatsSkeleton />
                }
                {data ?
                    <CardDataStats title="Previsão de pagamento" total={
                        data && handlePrevisaoDePagto(data)}
                    >
                        <IoCalendar className="w-[18px] h-[18px]" />
                    </CardDataStats> : <CardDataStatsSkeleton />}

                {
                data ?
                    <CardDataStats title="Doc. relacionada" elementHtml={
                        <div className="flex items-center gap-2">
                            <span className="text-md font-medium">Baixar PDF</span>
                        </div>
                    }>
                        <LuDownloadCloud className="w-[18px] h-[18px]" />
                    </CardDataStats> : <CardDataStatsSkeleton />}
                    </Fade>
            </div>
                <Fade cascade damping={0.1} triggerOnce>
            <div className=" grid grid-cols-12 mt-4 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                    <ProjectedProfitabilityChart data={updatedVlData} />

            </div>
                </Fade>
            <div className=" grid grid-cols-12 mt-4 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                {/*
                Botão de realizar investimento
                */}
                </div>
        </div>
    )
}
