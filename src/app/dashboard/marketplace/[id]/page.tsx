import MarketplaceItem from '@/components/Marketplace/MarketplaceItem';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Metadata } from 'next';
import React from 'react'

interface MarketplaceItemProps {
  id: string;
}

export const metadata: Metadata = {
    title: "CelerApp | Marketplace | Oportunidade de investimento",
    description:
        "Oportunidade de investimento no CelerApp",
  };

export default function MarketplaceItemPage({ params }: { params: MarketplaceItemProps }) {
  return (
    <DefaultLayout>
        <MarketplaceItem id={params.id} />
    </DefaultLayout>
  )
}