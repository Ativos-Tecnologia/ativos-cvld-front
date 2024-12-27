import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { Metadata } from 'next';
import React from 'react'
import { LegalDetails } from '@/components/Juridico/Details';
import { BrokersProvider } from '@/context/BrokersContext';

interface JuridicoItemProps {
  id: string;
}

export const metadata: Metadata = {
    title: "CelerApp | Jurídico",
    description:
        "Ecossistema de amostragem e manipulação dos precatórios por parte do time jurídico da Ativos.",
  };

export default function DetailsPage({ params }: { params: JuridicoItemProps }) {
  return (
    <DefaultLayout>
      <BrokersProvider>
        <LegalDetails id={params.id} />
      </BrokersProvider>
    </DefaultLayout>
  )
}