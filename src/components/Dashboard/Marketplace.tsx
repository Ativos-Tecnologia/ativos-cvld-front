"use client"
import { NotionResponse } from '@/interfaces/INotion';
import api from '@/utils/api';
import React, { useEffect, useState } from 'react';
import MarketplaceCardSkeleton from '../Skeletons/MarketplaceCardSkeleton';
import { Fade } from 'react-awesome-reveal';
import Card from '../Cards/marketplaceCard';
import { useRouter } from "next/navigation";
import { QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";


const Marketplace: React.FC = () => {

  const { push } = useRouter();

  const [marketPlaceItems] = useState<NotionResponse>({
    object: "list",
    results: []
  });

  function handleRedirect(id: string) {
    push(`/dashboard/marketplace/${id}`);
  }

  const fetchMarketplaceList = async () => {
    const response = await api.get("api/notion-api/marketplace/available/");
    return response.data;
  };

  const { data } = useQuery<NotionResponse>(
    {
      queryKey: ['notion_marketplace_list'],
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: 60000,
      queryFn: fetchMarketplaceList,
      initialData: marketPlaceItems
    }
  );

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <h1 className='text-4xl font-semibold mb-2 text-snow'>Explore investimentos</h1>
        <p className="font-white">
          Aproveite oportunidades exclusivas de ativos judiciais e maximize seus retornos com segurança e credibilidade.
        </p>
      </div>

      {/* content */}
      <ul className='grid grid-cols-3 my-5'>
        {data.results.length > 0 ? (
          <Fade cascade damping={0.1}>
            {data!.results?.map((oficio) => (
                <Card key={oficio.id} oficio={oficio} onClickFn={() => handleRedirect(oficio.id)} />
            ))}
          </Fade>
        ) : (
          <>
                    <Fade cascade damping={0.1}>

            {[...Array(6)].map((_, index: number) => (
              <MarketplaceCardSkeleton key={index} />
            ))}
            </Fade>
          </>
        )}
      </ul>
    </div>
  );
};

export default Marketplace;