import React from 'react';
import CustomSkeleton from '../CrmUi/CustomSkeleton';

const GoalChartSkeleton = () => {
    return (
        <section className="flex min-h-fit w-full flex-col justify-between gap-2 rounded-md bg-white p-5 dark:bg-boxdark lg:flex-row">
            <div className="flex flex-col items-center gap-2">
                <CustomSkeleton type="content" className="size-60 rounded-full" />
                <CustomSkeleton type="title" className="h-7 w-36" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <CustomSkeleton type="content" className="size-60 rounded-full" />
                <CustomSkeleton type="title" className="h-7 w-36" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <CustomSkeleton type="content" className="size-60 rounded-full" />
                <CustomSkeleton type="title" className="h-7 w-36" />
            </div>
        </section>
    );
};

export default GoalChartSkeleton;
