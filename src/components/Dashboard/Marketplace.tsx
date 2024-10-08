"use client"
import { NotionResponse } from '@/interfaces/INotion';
import api from '@/utils/api';
import React, { useEffect, useState } from 'react';
import MarketplaceCardSkeleton from '../Skeletons/MarketplaceCardSkeleton';
import { Fade } from 'react-awesome-reveal';
import Card from '../Cards/marketplaceCard';

const Marketplace: React.FC = () => {

  const [marketPlaceItems, setMarketPlaceItems] = useState<NotionResponse>({
    object: "list",
    results: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get("api/notion-api/marketplace/available/");

      if (response.status === 200) {
        setMarketPlaceItems(response.data);
      }
    }
    fetchData()
  }, []);

  return (
    <div className='flex flex-col gap-5'>
      {/* title */}
      <div>
        <h1 className='text-4xl font-semibold mb-2 text-snow'>Explore investimentos</h1>
        <p className="font-white">
          Aproveite oportunidades exclusivas de ativos judiciais e maximize seus retornos com segurança e credibilidade.
        </p>
      </div>

      {/* content */}
      <div className='grid grid-cols-3 my-5'>
        {marketPlaceItems.results.length > 0 ? (
          <Fade cascade damping={0.1}>
            {marketPlaceItems.results.map((oficio) => (
              <Card key={oficio.id} oficio={oficio} />
            ))}
          </Fade>
        ) : (
          <>
            {[...Array(6)].map((_, index: number) => (
              <MarketplaceCardSkeleton />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Marketplace;