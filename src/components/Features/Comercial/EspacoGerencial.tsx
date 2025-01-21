'use client';
import { DataTable } from '@/app/comercial/espaco/table/data-table';
import { columns } from '@/app/comercial/espaco/table/columns';
import { ITabelaGerencialResponse } from '@/interfaces/ITabelaGerencialResponse';
import api from '@/utils/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { PaginationState } from '@tanstack/react-table';
import React, { useState } from 'react';

async function fetchData() {
    const response = await api.get(`/api/comercial/coordenador/BeatrizRodolfo/`);
    return response.data;
}

function EspacoGerencial() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['espaco-gerencial'],
        queryFn: () => fetchData(),
        placeholderData: keepPreviousData,
    });

    // const pageCount = Math.ceil((mockData.results.length || 1) / pagination.pageSize);

    return (
        <>
            <div className="flex w-full flex-col rounded-md bg-white py-2 pl-4 dark:bg-boxdark">
                <h1>Espaço Gerencial</h1>
                <p>Ecossistema de gestão da esteira comercial de ofícios da Ativos.</p>
            </div>
            <section className="mt-6 flex flex-col rounded-md bg-white dark:bg-boxdark">
                <DataTable columns={columns} data={data?.results || []} loading={isLoading} />
            </section>
        </>
    );
}

export default EspacoGerencial;
