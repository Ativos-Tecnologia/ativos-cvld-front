"use client"
import { NotionResponse } from '@/interfaces/INotion';
import api from '@/utils/api';
import React, { useEffect, useMemo, useState } from 'react';
import MarketplaceCardSkeleton from '../Skeletons/MarketplaceCardSkeleton';
import { Fade } from 'react-awesome-reveal';
import Card from '../Cards/marketplaceCard';
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from 'next/image';
import { Button } from '../Button';
import { AiOutlineLoading } from 'react-icons/ai';
import queryClient from '@/utils/queryClient';


const Marketplace: React.FC = () => {

  const { push } = useRouter();

  const [marketPlaceItems, setMarketPlaceItems] = useState<NotionResponse>({
    object: "list",
    next_cursor: null,
    has_more: false,
    results: []
  });
  // const [backendResults, setBackendResults] = useState<NotionPage[]>([]);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  function handleRedirect(id: string) {
    push(`/dashboard/marketplace/${id}`);
  }

  const fetchMarketplaceList = async () => {
    const response = await api.post("api/notion-api/marketplace/available/");
    return response.data;
  };

  const { data, isFetching } = useQuery<NotionResponse>(
    {
      queryKey: ['notion_marketplace_list'],
      refetchOnReconnect: true,
      refetchInterval: 60000,
      queryFn: fetchMarketplaceList,
      initialData: marketPlaceItems
    }
  );

  const updatedData = useMemo(() => {
    let customResults = {
      next_cursor: marketPlaceItems.next_cursor,
      has_more: marketPlaceItems.has_more,
      results: [...(data?.results || []), ...(marketPlaceItems.results) || []]
    }

    return customResults;
  }, [data?.next_cursor, data?.has_more, data?.results, marketPlaceItems]);

  async function loadMore() {
    setLoading(true);
    const response = await api.post("api/notion-api/marketplace/available/", {
      next_cursor: data?.next_cursor || null
    });

    if (response.status === 200) {
      setMarketPlaceItems(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (data.results.length > 0) {
      setFirstLoad(false);
      setMarketPlaceItems((old) => {
        return {
          ...old,
          has_more: data.has_more,
          next_cursor: data.next_cursor
        }
      })
    }
  }, [data])

  return (
    <div className='flex flex-col gap-5'>
      <div className='md:px-3 xl:p-0'>
        <Fade className='font-semibold 2xsm:text-3xl 2xsm:mb-4 xsm:text-4xl md:mb-2 dark:text-snow' cascade damping={0.1} triggerOnce>
          Explore investimentos
        </Fade>
        <Fade delay={2200} damping={0.1} triggerOnce>
          <p className="font-white 2xsm:text-sm lg:text-base">
            Aproveite oportunidades exclusivas de ativos judiciais e maximize seus retornos com segurança e credibilidade.
          </p>
        </Fade>
      </div>

      <ul className='grid md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 my-5'>
        {(isFetching && firstLoad) ? (
          <>
            <Fade cascade damping={0.1} triggerOnce>

              {[...Array(6)].map((_, index: number) => (
                <MarketplaceCardSkeleton key={index} />
              ))}
            </Fade>
          </>
        ) : (
          <>
            {updatedData.results.length > 0 ? (
              <Fade cascade damping={0.1} triggerOnce>
                {updatedData!.results?.map((oficio) => (
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

      {(updatedData.has_more && updatedData.results.length > 0) && (
        <div className='flex items-center justify-center w-full'>
          <Button
            onClick={loadMore}
            variant='outlined'
            className='flex items-center gap-2'>
            {loading ? (
              <>
              <AiOutlineLoading className="animate-spin" />
              <span>Carregando...</span>
              </>
            ) : "Carregar mais"}
          </Button>
        </div>
      )}

    </div>
  );
};

export default Marketplace;