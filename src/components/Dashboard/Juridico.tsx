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
  tipo: string,
  data_e_hora_de_aquisicao: string,
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

  console.dir(simpleData);

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
                    simpleData.results.map((item) => (

                      <HoverCard key={item.id} className="h-55">
                        <HoverCard.Container backgroundImg={imgPaths[item.tribunal as keyof typeof imgPaths]}>
                          <HoverCard.TribunalBadge tribunal={item.tribunal} className="group-hover:opacity-100" />
                          <HoverCard.Icon
                            icon={iconsConfig[item.tipo as keyof typeof iconsConfig].icon}
                            // bgColor={iconsConfig[item.tipo as keyof typeof iconsConfig].bgColor}
                            bgColor="#000"
                          />
                        </HoverCard.Container>
                      </HoverCard>

                      // <Link href={`juridico/${item.id}`}
                      //   key={item.id}
                      //   className={`mb-4 h-65 max-w-full cursor-pointer rounded-md bg-white p-5 font-nexa opacity-50 dark:bg-boxdark xsm:min-w-95 xsm:px-2 md:min-w-[350px] md:px-3 lg:px-4`}
                      // >
                      //   <p className="text-lg font-semibold">{item.credor}</p>
                      //   <p className="text-sm">{item.tipo}</p>
                      //   <p className="text-sm">{item.status_diligencia}</p>
                      // </Link>
                    ))
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
