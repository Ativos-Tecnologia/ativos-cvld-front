"use client";

import * as React from "react";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { IResumoComercial } from "@/interfaces/IResumoComercial";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { ICelerResponse } from "@/interfaces/ICelerResponse";
import { PaginationState } from "@tanstack/react-table";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

async function fetchData(options: {
    pageIndex: number
    pageSize?: number
  }) {
  const response = await api.get(`/api/comercial/resumo${options.pageIndex === 0 ? `?page_size=${options.pageSize}` : `?page=${options.pageIndex + 1}&page_size=${options.pageSize}`}`);
  
  return response.data;
}

export function ResumoWrapperPage() {
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 20,
    })

    const { data, isLoading, refetch  } = useQuery<ICelerResponse<IResumoComercial>>({
    queryKey: ["resumo", pagination],
    queryFn: () => fetchData(pagination),
    placeholderData: keepPreviousData,
});

const pageCount = Math.round((data?.count ?? 0) / pagination.pageSize);

  return (
    <div className="w-full">
      <DefaultLayout>
        <div className="flex w-full flex-col">
          <h1 className="text-3xl font-semibold text-black dark:text-white">
            Resumo
          </h1>
        </div>
        <section className="mt-6 flex flex-col rounded-md bg-white dark:bg-boxdark">
          <DataTable columns={columns} data={data?.results || []} pagination={pagination} setPagination={setPagination} loading={isLoading} pageCount={ pageCount } refetch={refetch} />
        </section>
      </DefaultLayout>
    </div>
  );
}

export default ResumoWrapperPage;
