"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import RentabilityChart from "../Charts/RentabilityChart";
import DistributionChart from "../Charts/DistributionChart";
import ProfitChart from "../Charts/ProfitBarChart";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../ui/CardDataStats";
import DataStatsFour from "../DataStats/DataStatsFour";
import { QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserInfoAPIContext } from "@/context/UserInfoContext";
import api from "@/utils/api";
import { NotionPage, NotionResponse } from "@/interfaces/INotion";
import CardDataStatsSkeleton from "../ui/CardDataStatsSkeleton";
import AnimatedNumber from "../ui/AnimatedNumber";
import percentageFormater from "@/functions/formaters/percentFormater";
import { IWalletResponse } from "@/interfaces/IWallet";
import TableWallet from "../Tables/TableWallet";
import { TbMoneybag } from "react-icons/tb";
import { MdOutlineAttachMoney } from "react-icons/md";
import { IoMdTrendingUp } from "react-icons/io";
import { LuShoppingBag } from "react-icons/lu";

const Wallet: React.FC = () => {
  const { data: { user } } = useContext(UserInfoAPIContext);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [vlData, setVlData] = useState<IWalletResponse>({
    id: "",
    valor_investido: 0,
    previsao_de_pgto: "",
    result: [
      {
        data_atualizacao: "",
        valor_principal: 0,
        valor_juros: 0,
        valor_inscrito: 0,
        valor_bruto_atualizado_final: 0,
        valor_liquido_disponivel: 0,
      },
    ]
  });

  const [defaultFilterObject, setDefaultFilterObject] = useState<any>({
    "username": user
  })

  const fetchWalletNotionList = async () => {
    const response = await api.post('/api/notion-api/wallet/', defaultFilterObject);
    return response.data;
  };

  const queryClient = useQueryClient()
  const { isPending, data, error, isFetching, refetch } = useQuery(
    {
      queryKey: ['notion_wallet_list'],
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      refetchInterval: 15000,
      staleTime: 13000,
      queryFn: fetchWalletNotionList,
      enabled: !!user
    },
  );

  function handleTotalInvested(data: NotionResponse) {
    let totalInvested = 0;
    data?.results.forEach((result) => {
      if (result.properties["Valor de Aquisição (Wallet)"]?.number) {
        totalInvested += Number(result.properties["Valor de Aquisição (Wallet)"].number) || 0;
      }
    });
    return totalInvested;
  }

  function handleTotalLiquid(data: NotionResponse) {
    let totalLiquid = 0;
    data?.results.forEach((result) => {
      if (result.properties["Valor Líquido (Com Reserva dos Honorários)"]?.formula?.number) {
        totalLiquid += Number(result.properties["Valor Líquido (Com Reserva dos Honorários)"]?.formula.number) || 0;
      }
    });
    return totalLiquid;
  }

  function handleTotalProducts(data: NotionResponse) {
    return data?.results.length || 0;
  }

  function handleProfit(data: NotionResponse) {
    return handleTotalLiquid(data) - handleTotalInvested(data);
  }

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['notion_wallet_list'] });
  }, [defaultFilterObject])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div
          ref={mainRef}
          className="scroll-mt-30 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {data ? <CardDataStats title="Total Investido" total={
            data && <AnimatedNumber value={data && handleTotalInvested(data)} />
          } rate="" levelUp>
            <TbMoneybag className="w-[22px] h-[22px]" />
          </CardDataStats> : <CardDataStatsSkeleton />}
          {data ?
            <CardDataStats title="Total Líquido" total={
              data && <AnimatedNumber value={data && handleTotalLiquid(data)} />
            } rate="4.35%" levelUp>
              <MdOutlineAttachMoney className="w-[22px] h-[22px]" />
            </CardDataStats> : <CardDataStatsSkeleton />}
          {data ?
            <CardDataStats title="Lucro" total={
              data && <AnimatedNumber value={data && handleProfit(data)} />
            } rate={
              data && percentageFormater(handleProfit(data) / handleTotalInvested(data) * 100) || 0
            } {
              ...data && handleProfit(data) > 0 ? { levelUp: true } : { levelDown: true }
              }>
              <IoMdTrendingUp className="w-[22px] h-[22px]" />
            </CardDataStats> : <CardDataStatsSkeleton />}
          {
            data ?
              <CardDataStats title="Total de Produtos" total={
                data && <AnimatedNumber value={data && handleTotalProducts(data)} isNotCurrency={true} />
              } rate="2.59%" levelUp>
                <LuShoppingBag className="w-[22px] h-[22px]" />
              </CardDataStats> : <CardDataStatsSkeleton />}
        </div>

        <div className={`grid grid-cols-12 mt-4 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5`}>
          <RentabilityChart data={vlData} />
          <ProfitChart title={"Performance de Lucro"} data={vlData} />
          <DistributionChart title={"Distribuição da Carteira"} data={data} />
          {/* <MapOne /> */}
          {/* <DataStatsFour /> */}
        </div>
        <div className="mt-4 grid grid-cols-12 md:mt-6 2xl:mt-7.5">
          <TableWallet
            ref={mainRef}
            data={data}
            isPending={isPending}
            isFetching={isFetching}
            setVlData={setVlData}
            setDefaultFilterObject={setDefaultFilterObject} />
        </div>
      </QueryClientProvider>
    </>
  );
};

export default Wallet;
