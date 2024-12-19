"use client";

import React, { useContext } from "react";
import DataStats from "../DataStats/DataStats";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { FaBalanceScale, FaFileAlt } from "react-icons/fa";
import {
  UserInfoAPIContext,
  UserInfoContextType,
} from "@/context/UserInfoContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import MarketplaceCardSkeleton from "../Skeletons/MarketplaceCardSkeleton";
import { AiOutlineLoading } from "react-icons/ai";
import api from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import GridCardsWrapper from "../CrmUi/Wrappers/GridCardsWrapper";
import HoverCard from "../CrmUi/Wrappers/HoverCard";
import { imgPaths } from "@/constants/tribunais";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { BiSolidCoinStack } from "react-icons/bi";
import numberFormat from "@/functions/formaters/numberFormat";
import { LiquidationTimeCounter } from "../TimerCounter/LiquidationTimeCounter";
import { DueDiligenceCounter } from "../TimerCounter/DueDiligenceCounter";

enum navItems {
  TODOS = "Todos",
  DUE_DILIGENCE = "Due Diligence",
  EM_LIQUIDACAO = "Em liquidação",
  EM_CESSAO = "Em cessão",
  REGISTRO_DE_CESSAO = "Registro de cessão",
  ATOS_PROCESSUAIS = "Atos processuais",
  AGUARDAR_PGTO = "Aguardar pagamento",
}

type cardProps = {
  id: number;
  title: string;
  tipo: string;
};

export type SimpleNotionData = {
  id: string,
  credor: string,
  status: string,
  status_diligencia: string,
  valor_liquido_disponivel: number,
  tribunal: string,
  tipo: {
    color: string,
    id: string,
    name: string
  },
  prazo_final_due: string,
}

type SimpleDataProps = {
  results: Array<SimpleNotionData>
}

export const iconsConfig = {
  PRECATÓRIO: {
    bgColor: "#0332ac",
    icon: <FaFileAlt className="text-[22px] text-snow" />,
  },
  CREDITÓRIO: {
    bgColor: "#056216",
    icon: <FaFileInvoiceDollar className="text-[22px] text-snow" />,
  },
  "R.P.V.": {
    bgColor: "#810303",
    icon: <BiSolidCoinStack className="text-[22px] text-snow" />,
  },
};

const Juridico = () => {
  const {
    data: { first_name },
  } = useContext<UserInfoContextType>(UserInfoAPIContext);

  const [activeTab, setActiveTab] = React.useState<string>(navItems.TODOS);
  const [simpleData, setSimpleData] = React.useState<SimpleDataProps>({ results: [] });
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchAllPrecatoryWithSimpleData = React.useCallback(async () => {
    setLoading(true);
    const response = await api.get(activeTab === navItems.TODOS ? "/api/legal/" : `/api/legal/?status_diligencia=${activeTab}`);
    setSimpleData(response.data);
    setLoading(false);
  }, [activeTab]);

  React.useEffect(() => {
    fetchAllPrecatoryWithSimpleData();
  }, [activeTab, fetchAllPrecatoryWithSimpleData]);

  console.log(simpleData)

  return (
    <div className="w-full">
      <div className="mb-4 flex w-full items-end justify-end gap-5 rounded-md">
        <Breadcrumb
          customIcon={<FaBalanceScale className="h-[32px] w-[32px]" />}
          altIcon="Espaço de trabalho do time jurídico"
          pageName="Jurídico"
          title={`Olá, ${first_name}`}
        />
      </div>
      <div className="mt-2 grid w-full grid-cols-1 gap-5 md:grid-cols-2">
        <DataStats data={simpleData.results} isLoading={loading} />
      </div>
      <div className="my-4">
        <Tabs defaultValue={navItems.TODOS} className="w-full">
          <TabsList>
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
                  className={`absolute left-0 top-full flex w-full items-center justify-center py-1transition-all duration-300 ${loading && item === activeTab ? "translate-y-[-100%]" : "translate-y-0"}`}
                >
                  <AiOutlineLoading className="h-5 w-5 animate-spin text-current" />
                </span>

                <span
                  className={`transition-all duration-300 ${loading && item === activeTab ? "translate-y-[114%]" : "translate-y-0"}`}
                >
                  {item}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          {loading ? (
            <GridCardsWrapper.List className="gap-4">
              {Array.from({ length: 12 }, (_, i) => (
                <MarketplaceCardSkeleton key={i} />
              ))}
            </GridCardsWrapper.List>
          ) : (
            Object.values(navItems).map((item, index) => (
              <TabsContent key={index} value={item}>
                <GridCardsWrapper.List className="gap-4">
                  {simpleData.results.length > 0 && (
                    simpleData.results.map((item) => {

                      let deadlineSituation: string; // define a situação do prazo

                      const currentDate = +new Date();
                      const itemDueDate = +new Date(item.prazo_final_due);

                      // calcula quantas horas faltam para o prazo expirar
                      const hoursRemaining = (itemDueDate - currentDate) / (1000 * 60 * 60);

                      if (hoursRemaining >= 96) {
                        deadlineSituation = "good";
                      } else if (hoursRemaining < 96 && hoursRemaining >= 48) {
                        deadlineSituation = "warning";
                      } else {
                        deadlineSituation = "danger";
                      }

                      return (
                        <HoverCard key={item.id} className="h-55 relative">

                          {(deadlineSituation === "danger" && item.prazo_final_due) && (
                            <>
                              <div className="absolute z-0 inset-0 w-90 left-3.5 bg-red-500 rounded-md opacity-60 animate-celer-ping" />
                              <div className="absolute z-0 inset-0 w-90 left-3.5 bg-red-500 delay-300 rounded-md opacity-60 animate-celer-ping" />
                            </>
                          )}

                          <HoverCard.Container backgroundImg={imgPaths[item.tribunal as keyof typeof imgPaths]}>
                            <HoverCard.Content
                              className={`${item.prazo_final_due && "outline outline-[3px]"} 
                              ${deadlineSituation === "good" && "outline-green-400"} 
                              ${deadlineSituation === "warning" && "outline-yellow-500"} 
                              ${deadlineSituation === "danger" && "outline-red-500"}
                                `}
                            >
                              <HoverCard.TribunalBadge tribunal={item.tribunal} />
                              <HoverCard.Icon
                                icon={iconsConfig[item.tipo.name as keyof typeof iconsConfig].icon}
                                // bgColor={iconsConfig[item.tipo as keyof typeof iconsConfig].bgColor}
                                bgColor="#000000"
                                className="group-hover:opacity-0"
                              />

                              <div className="group-hover:opacity-0">
                                <h2 className="mb-2 w-fit border-b border-snow pr-2 text-sm font-semibold uppercase text-snow">
                                  {item.credor}
                                </h2>
                                <p className="text-gray-300">
                                  {numberFormat(item.valor_liquido_disponivel)}
                                </p>
                              </div>

                            </HoverCard.Content>

                            <HoverCard.HiddenContent className="group-hover:h-55 items-center justify-evenly gap-5">
                              <DueDiligenceCounter dueDate={item?.prazo_final_due || ""} />
                              <span>Clique para detalhes</span>
                            </HoverCard.HiddenContent>
                          </HoverCard.Container>
                        </HoverCard>
                      )
                    })
                  )}
                </GridCardsWrapper.List>
                {
                  simpleData.results.length === 0 && (
                    <div className="flex items-center justify-center h-96 -my-">
                      <div className="mb-20">
                        <Image src="/images/illustration/illustration-01.svg" alt="Nenhum resultado encontrado" width={300} height={300} />
                        <p className="text-lg font-semibold text-center">Nenhum resultado encontrado</p>

                      </div>
                    </div>
                  )
                }
              </TabsContent>
            ))
          )}
        </Tabs>
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
