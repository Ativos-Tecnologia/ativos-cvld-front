import React from 'react';
import CustomSkeleton from '../CrmUi/CustomSkeleton';

const ComercialBrokersChartSkeleton = () => {
    return (
        <div className="grid w-full gap-5 p-5">
            <CustomSkeleton type="title" className="h-8 w-[250px]" />

            <div className="grid w-full gap-3">
                <CustomSkeleton type="content" className="h-80 w-full" />
                <div className="flex items-center justify-center gap-4">
                    <CustomSkeleton type="title" className="h-5 w-28" />
                    <CustomSkeleton type="title" className="h-5 2xsm:w-28 xsm:hidden md:block" />
                    <CustomSkeleton type="title" className="h-5 xsm:w-25 md:hidden" />
                    <CustomSkeleton type="title" className="hidden h-5 w-25 xsm:block" />
                    {/* MD */}
                    <CustomSkeleton type="title" className="hidden h-5 w-28 md:block" />
                    <CustomSkeleton type="title" className="hidden h-5 w-28 md:block" />
                    {/* LG */}
                    <CustomSkeleton type="title" className="hidden h-5 w-28 lg:block" />
                    <CustomSkeleton type="title" className="hidden h-5 w-28 lg:block" />
                    {/* XL */}
                    <CustomSkeleton type="title" className="hidden h-5 w-28 xl:block" />
                    <CustomSkeleton type="title" className="hidden h-5 w-28 xl:block" />
                    <CustomSkeleton type="title" className="hidden h-5 w-28 xl:block" />
                </div>
            </div>
        </div>
    );
};

export default ComercialBrokersChartSkeleton;
