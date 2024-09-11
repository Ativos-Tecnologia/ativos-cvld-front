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
import { IWalletResponse, IWalletResults } from "@/interfaces/IWallet";
import TableWallet from "../Tables/TableWallet";
import { TbMoneybag } from "react-icons/tb";
import { MdOutlineAttachMoney } from "react-icons/md";
import { IoMdTrendingUp } from "react-icons/io";
import { LuShoppingBag } from "react-icons/lu";
import numberFormat from "@/functions/formaters/numberFormat";

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
    data?.results?.forEach((result) => {
      if (result.properties["Valor de Aquisição (Wallet)"]?.number) {
        totalInvested += Number(result.properties["Valor de Aquisição (Wallet)"].number) || 0;
      }
    });
    return totalInvested;
  }

  function handleTotalLiquid(data: [IWalletResults[]]) {
    let totalLiquid = 0;

    data?.forEach((result) => {
      result.forEach((item: any, index) => {
        if (index === 1) {
          totalLiquid += item.valor_liquido_disponivel || 0;
        }
      });
    });

    return totalLiquid;
  }

  function handleTotalLiquidUntilBuy(data: [IWalletResults[]]) {
    let totalLiquid = 0;

    data?.forEach((result) => {
      result.forEach((item: any, index) => {
        if (index === 0) {
          totalLiquid += item.valor_liquido_disponivel || 0;
        }
      });
    });

    return totalLiquid;
  }

  function handleTotalLiquidUntilAcquisition(result: [
    NotionResponse,
    IWalletResults[]
  ]) {

    let vldDataDaCompra = 0;
    let vldAtualizado = 0;

    result[1].forEach((item: any) => {
      item.forEach((item: any, index: number) => {
        if(index === 0) {
          vldDataDaCompra += item.valor_liquido_disponivel || 0;
        } else {
          vldAtualizado += item.valor_liquido_disponivel || 0;
        }

      });
    });
    return vldAtualizado - vldDataDaCompra
  }

  function handleTotalProducts(data: NotionResponse) {
    return data?.results.length || 0;
  }

  function handleProfit(data: any) {
    const liquid = handleTotalLiquid(data?.[1]);
    const invested = handleTotalInvested(data?.[0]);

    return liquid - invested;
  }

  function handleLiquidUpdatedAMountLucroPercent(data: any) {
    return handleTotalLiquidUntilAcquisition(data) / handleTotalLiquidUntilBuy(data?.[1]);
  }

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['notion_wallet_list'] });
  }, [defaultFilterObject])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {data ? <CardDataStats title="Total Investido" total={
            data && <AnimatedNumber value={data && handleTotalInvested(data?.response[0])} />
          } >
            <TbMoneybag className="w-[18px] h-[18px]" />
          </CardDataStats> : <CardDataStatsSkeleton />}
          {data ?
            <CardDataStats title="Total Atualizado" total={
              data && <AnimatedNumber value={data && handleTotalLiquid(data?.response[1])}  />
            } rate={
              data && percentageFormater(handleLiquidUpdatedAMountLucroPercent(data.response)) || 0
            } levelUp>
              <MdOutlineAttachMoney className="w-[18px] h-[18px]" />
            </CardDataStats> : <CardDataStatsSkeleton />}
          {data ?
            <CardDataStats title="Ágio" total={
              data && <AnimatedNumber value={data && handleProfit(data?.response)} />
            } rate={
              data && numberFormat(handleTotalLiquidUntilAcquisition(data.response)) || 0
            } levelUp>
              <IoMdTrendingUp className="w-[18px] h-[18px]" />
            </CardDataStats> : <CardDataStatsSkeleton />}
          {
            data ?
              <CardDataStats title="Total de Precatórios" total={
                data && <AnimatedNumber value={data && handleTotalProducts(data?.response[0])} isNotCurrency={true} />
              }>
                <LuShoppingBag className="w-[18px] h-[18px]" />
              </CardDataStats> : <CardDataStatsSkeleton />}
        </div>

        <div className="scroll-mt-26 grid grid-cols-12 mt-4 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5" ref={mainRef}
        >
          <ProfitChart title={"Performance de Lucro"} data={vlData} />
          <DistributionChart title={"Distribuição da Carteira"} response={data?.response} />
          <RentabilityChart data={vlData} />
          {/* <MapOne /> */}
          {/* <DataStatsFour /> */}
        </div>
        <div className="mt-4 grid grid-cols-12 md:mt-6 2xl:mt-7.5">
          <TableWallet
            ref={mainRef}
            data={data?.response[0]}
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
