"use client";
import api from "@/utils/api";
import { QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";

const Broker: React.FC = () => {

  const fetchBrokerList = async () => {
    const response = await api.get("api/notion-api/broker/list"
    );
    if (response !== null) {
      return response.data;
    }
  };
  const queryClient = useQueryClient();

  const { isPending, data, error, isFetching, refetch } = useQuery({
    queryKey: ["broker_list"],
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
    staleTime: 13000,
    queryFn: fetchBrokerList,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <h1>Broker</h1>
      </div>
    </QueryClientProvider>
  );
};
export default Broker;
