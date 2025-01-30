import React from 'react';
import CustomSkeleton from '../CrmUi/CustomSkeleton';

const ComercialBrokersChartSkeleton = () => {
    return (
        <div className="grid w-full gap-5 p-5">
            <CustomSkeleton type="title" className="h-8 w-[250px]" />

            <div className="grid gap-3 2xsm:w-[280px]">
                <CustomSkeleton type="content" className="h-80 w-full" />
                <div className="flex items-center justify-center gap-4">
                    <CustomSkeleton type="title" className="h-5 w-28" />
                    <CustomSkeleton type="title" className="h-5 2xsm:w-28 xsm:hidden md:block" />
                    <CustomSkeleton type="title" className="h-5 md:hidden xsm:w-25" /> 
                    <CustomSkeleton type="title" className="h-5 w-25 hidden xsm:block" /> 
                    {/* MD */}
                    <CustomSkeleton type="title" className="h-5 w-28 hidden md:block" />
                    <CustomSkeleton type="title" className="h-5 w-28 hidden md:block" />
                    <CustomSkeleton type="title" className="h-5 w-28 hidden md:block" />
                    {/* LG */}
                    <CustomSkeleton type="title" className="h-5 w-28 hidden lg:block" />
                    <CustomSkeleton type="title" className="h-5 w-28 hidden lg:block" />
                    {/* XL */}
                    <CustomSkeleton type="title" className="h-5 w-28 hidden xl:block" />
                    <CustomSkeleton type="title" className="h-5 w-28 hidden xl:block" />
                    <CustomSkeleton type="title" className="h-5 w-28 hidden xl:block" />
                </div>
            </div>
        </div>
    );
};

export default ComercialBrokersChartSkeleton;
