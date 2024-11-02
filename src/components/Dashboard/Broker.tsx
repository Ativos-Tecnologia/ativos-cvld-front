"use client";
import api from "@/utils/api";
import { QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import DashbrokersCard from "../Cards/DashbrokersCard";
import { useState } from "react";

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
        {isPending ? null : (
          <>
            {notionData?.results.map((oficio: any, index: number) => (
              <DashbrokersCard
                oficio={oficio}
                key={index}
                setEditModalId={setEditModalId}
                editModalId={editModalId}
              />
            ))}
          </>
        )}
      </div>
    </QueryClientProvider>
  );
};
export default Broker;
