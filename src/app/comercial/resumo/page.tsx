"use client";

import * as React from "react";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { IResumoComercial } from "@/interfaces/IResumoComercial";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { ICelerResponse } from "@/interfaces/ICelerResponse";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

async function fetchData() {
  const response = await api.get(`/api/comercial/resumo`);
  return response.data;
}

export function ResumoWrapperPage() {
    const { data, isLoading } = useQuery<ICelerResponse<IResumoComercial>>({
    queryKey: ["resumo"],
    queryFn: fetchData,
});

  return (
    <div className="w-full">
      <DefaultLayout>
        <div className="flex w-full flex-col">
          <h1 className="text-3xl font-semibold text-black dark:text-white">
            Resumo
          </h1>
        </div>
        <section className="mt-6 flex flex-col rounded-md bg-white dark:bg-boxdark">
          <DataTable columns={columns} data={data?.results || []} />
        </section>
      </DefaultLayout>
    </div>
  );
}

export default ResumoWrapperPage;
