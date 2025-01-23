import React from 'react';
import CustomSkeleton from '../CrmUi/CustomSkeleton';

const GoalChartSkeleton = () => {
    return (
        <section className="flex min-h-fit w-full flex-col justify-between gap-2 rounded-md bg-white py-2 pl-4 dark:bg-boxdark lg:flex-row">
            <CustomSkeleton type="content" className="size-60 rounded-full" />
            <CustomSkeleton type="content" className="size-60 rounded-full" />
            <CustomSkeleton type="content" className="size-60 rounded-full" />
        </section>
    );
};

export default GoalChartSkeleton;
