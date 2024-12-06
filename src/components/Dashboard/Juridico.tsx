"use client";

import React, { useContext } from "react";
import DataStats from "../DataStats/DataStats";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import { FaBalanceScale } from "react-icons/fa";
import {
  UserInfoAPIContext,
  UserInfoContextType,
} from "@/context/UserInfoContext";
import { Button } from "../Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import BrokerCardSkeleton from "../Skeletons/BrokerCardSkeleton";
import MarketplaceCardSkeleton from "../Skeletons/MarketplaceCardSkeleton";
import { AiOutlineLoading } from "react-icons/ai";

enum navItems {
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

const Juridico = () => {
  const {
    data: { first_name },
  } = useContext<UserInfoContextType>(UserInfoAPIContext);
  const [activeTab, setActiveTab] = React.useState<string>(navItems.DUE_DILIGENCE);
  const [cardData, setCardData] = React.useState<cardProps[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const mockData = (tipo: string) =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      title: `Item ${i}`,
      tipo: tipo,
    }));

  const simulateFetch = async () => {
    setLoading(true);
    setTimeout(() => {
      Promise.resolve(setCardData(mockData(activeTab)));
      setLoading(false);
    }, 2000);
  };

  React.useEffect(() => {
    simulateFetch();
  }, [activeTab]);

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
        <DataStats />
      </div>
      <div className="my-4">
        <Tabs defaultValue={navItems.DUE_DILIGENCE} className="w-full">
          <TabsList>
            {Object.values(navItems).map((item, index) => (
              <TabsTrigger
                key={index}
                value={item}
                disabled={loading}
                className="relative flex 
        items-center 
        justify-center 
        overflow-hidden 
        rounded-md 
        transition-all 
        duration-300 
        disabled:cursor-not-allowed"
                onClick={() => {
                  setActiveTab(item);
                }}
              >
                <span
                  className={`
            absolute 
          left-0 
          top-full 
          flex 
          w-full 
          items-center 
          justify-center 
          py-1
          transition-all 
          duration-300
          ${loading && item === activeTab ? "translate-y-[-100%]" : "translate-y-0"}
        `}
                >
                  <AiOutlineLoading className="h-5 w-5 animate-spin text-current" />
                </span>

                <span
                  className={`
          transition-all
          duration-300
          ${loading && item === activeTab ? "translate-y-[114%]" : "translate-y-0"}
        `}
                >
                  {item}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          {/* <p className="text-muted-foreground text-sm font-satoshi font-medium">
            {loading
              ? "Carregando..."
              : `Exibindo ${cardData.length} resultados`}
          </p> */}
          {loading ? (
            <ul className="my-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
              {Array.from({ length: 12 }, (_, i) => (
                <li
                  key={i}
                  className="mb-4 h-65 max-w-full cursor-pointer rounded-md bg-white p-5 font-nexa opacity-50 hover:cursor-not-allowed dark:bg-boxdark xsm:min-w-95 xsm:px-2 md:min-w-[350px] md:px-3 lg:px-4"
                >
                  <MarketplaceCardSkeleton />
                </li>
              ))}
            </ul>
          ) : (
            Object.values(navItems).map((item, index) => (
              <TabsContent key={index} value={item}>
                <ul className="my-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
                  {cardData.map((item) => (
                    <li
                      key={item.id}
                      className={`mb-4 h-65 max-w-full cursor-pointer rounded-md bg-white p-5 font-nexa opacity-50 hover:cursor-not-allowed dark:bg-boxdark xsm:min-w-95 xsm:px-2 md:min-w-[350px] md:px-3 lg:px-4`}
                    >
                      <p className="text-lg font-semibold">{item.title}</p>
                      <p className="text-sm">{item.tipo}</p>
                    </li>
                  ))}
                </ul>
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
