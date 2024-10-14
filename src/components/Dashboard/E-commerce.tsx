"use client";
import React, { useState } from "react";
import MainForm from "../MainForm";
import CVLDResult, { ApiResponse } from "../ResultCVLD";
import { ExtratosTable } from "../ExtratosTable/ExtratosTable";
import ResultCVLDSkeleton from "../Skeletons/ResultCVLDSkeleton";
import MapOne from "../Maps/MapOne";
import { ExtratosTableProvider } from "@/context/ExtratosTableContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TableNotionProvider } from "@/context/NotionTableContext";

const queryClient = new QueryClient();


const ECommerce: React.FC = () => {
  const [data, setData] = useState<ApiResponse>({ result: [], setData: () => { } });
  const [dataToAppend, setDataToAppend] = useState<ApiResponse>({ result: [], setData: () => { } });

  const [calcStep, setCalcStep] = useState<string | null>(null);

  return (
    <div className="w-full mt-0 grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
      <MainForm dataCallback={setData} setCalcStep={setCalcStep} setDataToAppend={setDataToAppend} />
      {calcStep === 'calculating' ? (
        <ResultCVLDSkeleton />
      ) : <CVLDResult result={data.result} setData={setData} />}
      <div className="col-span-12">
        <TableNotionProvider>
          <ExtratosTableProvider>
            <ExtratosTable newItem={dataToAppend.result} />
          </ExtratosTableProvider>
        </TableNotionProvider>
      </div>
    </div>
  );
};

export default ECommerce;
