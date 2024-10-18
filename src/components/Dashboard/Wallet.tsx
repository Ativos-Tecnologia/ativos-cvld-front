"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import RentabilityChart from "../Charts/RentabilityChart";
import DistributionChart from "../Charts/DistributionChart";
import ProfitChart from "../Charts/ProfitBarChart";
import CardDataStats from "../ui/CardDataStats";
import { QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserInfoAPIContext } from "@/context/UserInfoContext";
import api from "@/utils/api";
import { NotionResponse } from "@/interfaces/INotion";
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
import { BiSolidHourglass, BiSolidWallet } from "react-icons/bi";
import TableLiquidation from "../Tables/TableLiquidation";

const Wallet: React.FC = () => {
  const { data: { user }, loading: chargeLoading } = useContext(UserInfoAPIContext);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [counter, setCounter] = useState(0);
  const [vlData, setVlData] = useState<IWalletResponse>({
    id: "",
    valor_investido: 0,
    valor_projetado: 0,
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
  });
  const [activeView, setActiveView] = useState<string>("wallet");

  const fetchWalletNotionList = async () => {
    if (!chargeLoading) {
      const response = await api.post('/api/notion-api/wallet/', { "username": user });
      return response.data;
    };
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
      enabled: !chargeLoading
    },
  );

  function handleChangeView (view: string) {
    switch (view) {
      case "wallet":
        queryClient.removeQueries({queryKey: ["notion_wallet_list"]});
        setActiveView("wallet")
        break;

      case "liquidation":
        queryClient.removeQueries({queryKey: ["liquidation_list"]});
        setActiveView("liquidation");
        break;

      default:
        break;
    }
  }

  function handleTotalInvested(data: NotionResponse) {
    let totalInvested = 0;
    data?.results?.forEach((result) => {
      if (result.properties["Desembolso All-In"]?.formula?.number) {
        totalInvested += Number(result.properties["Desembolso All-In"]?.formula?.number) || 0
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
        if (index === 0) {
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

  // useEffect(() => {
  //   queryClient.invalidateQueries({ queryKey: ['notion_wallet_list'] });
  // }, [defaultFilterObject])

  useEffect(() => {
    user !== "" && setDefaultFilterObject({ "username": user });
    setCounter(counter + 1);
  }, [user]);

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
              data && <AnimatedNumber value={data && handleTotalLiquid(data?.response[1])} />
            } rate={
              data && percentageFormater(handleLiquidUpdatedAMountLucroPercent(data.response)) || 0
            } levelUp>
              <MdOutlineAttachMoney className="w-[18px] h-[18px]" />
            </CardDataStats> : <CardDataStatsSkeleton />}
          {data ?
            <CardDataStats title="Lucro" total={
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
              </CardDataStats> : <CardDataStatsSkeleton />
            }
        </div>

        <div className=" grid grid-cols-12 mt-4 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5"
        >
          <ProfitChart title={"Performance de Lucro"} response={data?.response} />
          <DistributionChart title={"Distribuição da Carteira"} response={data?.response} />
          <div className="scroll-mt-26" ref={mainRef}></div>
          <RentabilityChart data={vlData} />
          {/* <MapOne /> */}
          {/* <DataStatsFour /> */}
        </div>
        <div className="mt-4 grid grid-cols-12 md:mt-6 2xl:mt-7.5">
          <div className='col-span-12 bg-white dark:bg-boxdark border-stroke dark:border-strokedark p-[30px] rounded-sm shadow-default'>

            <div className='mb-3 col-span-12 flex gap-3 border-b border-zinc-300 dark:border-form-strokedark text-xs font-semibold'>

              <button
                disabled={isFetching}
                onClick={() => handleChangeView("wallet")}
                className={`uppercase cursor-pointer disabled:cursor-default py-1 px-2 min-w-48 flex items-center justify-start gap-2 border-b-2 ${activeView === "wallet" && "text-blue-700 dark:text-blue-500 border-blue-700 dark:border-blue-500"}`}
              >
                <BiSolidWallet className='text-sm' />
                <span>ativos adquiridos</span>
              </button>

              <button
                disabled={isFetching}
                onClick={() => handleChangeView("liquidation")}
                className={`uppercase cursor-pointer disabled:cursor-default py-1 px-2 min-w-48 flex items-center justify-start gap-2 border-b-2 ${activeView === "liquidation" && "text-blue-700 dark:text-blue-500 border-blue-700 dark:border-blue-500"}`}
              >
                <BiSolidHourglass className="text-sm" />
                <span>em liquidação</span>
              </button>

            </div>

            {activeView === "wallet" && (
              <TableWallet
                ref={mainRef}
                data={data?.response[0]}
                isPending={isPending}
                isFetching={isFetching}
                setVlData={setVlData}
                setDefaultFilterObject={setDefaultFilterObject}
              />
            )}

            {activeView === "liquidation" && (
              <TableLiquidation
                ref={mainRef}
                setVlData={setVlData}
                setDefaultFilterObject={setDefaultFilterObject}
              />
            )}
          </div>

        </div>
      </QueryClientProvider>
    </>
  );
};

export default Wallet;
