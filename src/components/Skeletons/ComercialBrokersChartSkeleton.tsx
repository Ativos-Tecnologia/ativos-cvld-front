import React from 'react';
import CustomSkeleton from '../CrmUi/CustomSkeleton';

const ComercialBrokersChartSkeleton = () => {
    return (
        <div className="grid w-full gap-5 p-5">
            <CustomSkeleton type="title" className="h-8 w-[250px]" />

            <div className="grid gap-3">
                <CustomSkeleton type="content" className="h-80 w-full" />
                <div className="flex items-center justify-center gap-4">
                    <CustomSkeleton type="title" className="h-5 w-28" />
                    <CustomSkeleton type="title" className="h-5 w-28" />
                    <CustomSkeleton type="title" className="h-5 w-28" />
                    <CustomSkeleton type="title" className="h-5 w-28" />
                    <CustomSkeleton type="title" className="h-5 w-28" />
                    <CustomSkeleton type="title" className="h-5 w-28" />
                    <CustomSkeleton type="title" className="h-5 w-28" />
                    <CustomSkeleton type="title" className="h-5 w-28" />
                    <CustomSkeleton type="title" className="h-5 w-28" />
                </div>
            </div>
        </div>
    );
};

export default ComercialBrokersChartSkeleton;
