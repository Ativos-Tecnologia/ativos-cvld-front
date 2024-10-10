"use client"
import { NotionResponse } from '@/interfaces/INotion';
import api from '@/utils/api';
import React, { useEffect, useState } from 'react';
import MarketplaceCardSkeleton from '../Skeletons/MarketplaceCardSkeleton';
import { Fade } from 'react-awesome-reveal';
import Card from '../Cards/marketplaceCard';
import { useRouter } from "next/navigation";
import { QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from 'next/image';


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

  const { data, isFetching } = useQuery<NotionResponse>(
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
      <Fade className='text-4xl font-semibold mb-2 dark:text-snow' cascade damping={0.1}>
        Explore investimentos
      </Fade>
      <Fade delay={2100} damping={0.1}>
        <p className="font-white">
          Aproveite oportunidades exclusivas de ativos judiciais e maximize seus retornos com segurança e credibilidade.
        </p>
        </Fade>
      </div>

      <ul className='grid grid-cols-3 3xl:grid-cols-4 my-5'>
        {isFetching ? (
          <>
            <Fade cascade damping={0.1}>

              {[...Array(6)].map((_, index: number) => (
                <MarketplaceCardSkeleton key={index} />
              ))}
            </Fade>
          </>
        ) : (
          <>
            {data.results.length > 0 ? (
              <Fade cascade damping={0.1}>
                {data!.results?.map((oficio) => (
                  <Card key={oficio.id} oficio={oficio} onClickFn={() => handleRedirect(oficio.id)} />
                ))}
              </Fade>
            ) : (
              <div className='flex flex-col gap-5 my-10 items-center justify-center col-span-3'>
                <Image
                  src="/images/empty_cart.svg"
                  alt="homem com lista em mãos e carrinho vazio"
                  width={280}
                  height={280}
                />
                <p className='tracking-wider font-medium'>Ainda não temos opções de investimentos disponíveis.</p>
              </div>
            )}
          </>
        )}
      </ul>
    </div>
  );
};

export default Marketplace;