"use client";
import api from "@/utils/api";
import { QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import DashbrokersCard from "../Cards/DashbrokersCard";
import { useState } from "react";
import BrokerCardSkeleton from "../Skeletons/BrokerCardSkeleton";
import { Fade } from "react-awesome-reveal";
import Image from "next/image";

const Broker: React.FC = () => {

  const [editModalId, setEditModalId] = useState<string | null>(null);

  const fetchBrokerList = async () => {
    const response = await api.get("api/notion-api/broker/list"
    );
    if (response !== null) {
      return response.data;
    }
  };
  const queryClient = useQueryClient();

  const { isPending, data: notionData, error, isFetching, refetch } = useQuery({
    queryKey: ["broker_list"],
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: 60000,
    staleTime: 13000,
    queryFn: fetchBrokerList,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="grid grid-cols-2 gap-5 items-center w-full mt-15">
        {isPending ? (
          <Fade cascade damping={0.1} triggerOnce>
            {[...Array(4)].map((_, index: number) =>
              <BrokerCardSkeleton key={index} />
            )}
          </Fade>
        ) : (
          <>
            {notionData?.results.length > 0 ? (
              <Fade cascade damping={0.1} triggerOnce>
                {notionData?.results.map((oficio: any, index: number) => (
                  <DashbrokersCard
                    oficio={oficio}
                    key={index}
                    setEditModalId={setEditModalId}
                    editModalId={editModalId}
                  />
                ))}
              </Fade>
            ) : (
              <div className="my-10 flex flex-col items-center justify-center gap-5 col-span-2">
                <Image
                  src="/images/documents.svg"
                  alt="documentos com botão de adicionar"
                  width={210}
                  height={210}
                />
                <p className="text-center font-medium tracking-wider">
                  Sem registros de ofício para exibir.
                </p>
              </div>
            )}
          </>

        )}
      </div>
    </QueryClientProvider>
  );
};
export default Broker;
