'use client';
import React, { useContext, useState } from 'react';
import MainForm from '../MainForm';
import CVLDResult, { ApiResponse } from '../ResultCVLD';
import ResultCVLDSkeleton from '../Skeletons/ResultCVLDSkeleton';
import { TableNotionProvider } from '@/context/NotionTableContext';
import { UserInfoAPIContext } from '@/context/UserInfoContext';

const ECommerce: React.FC = () => {
    const [data, setData] = useState<ApiResponse>({ result: [], setData: () => {} });
    const [dataToAppend, setDataToAppend] = useState<ApiResponse>({
        result: [],
        setData: () => {},
    });
    const [calcStep, setCalcStep] = useState<string | null>(null);
    const { data: userInfo } = useContext(UserInfoAPIContext);

    return (
        <TableNotionProvider>
            <div className="mt-0 grid w-full grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
                {userInfo.product === 'global' && (
                    <>
                        <MainForm
                            dataCallback={setData}
                            setCalcStep={setCalcStep}
                            setDataToAppend={setDataToAppend}
                        />
                        {calcStep === 'calculating' ? (
                            <ResultCVLDSkeleton />
                        ) : (
                            <CVLDResult result={data.result} setData={setData} />
                        )}
                    </>
                )}
                {/* <div className="col-span-12">
          <ExtratosTableProvider>
          <ExtratosTable newItem={dataToAppend.result} />
          </ExtratosTableProvider>
          </div> */}
            </div>
        </TableNotionProvider>
    );
};

export default ECommerce;
