import CustomSkeleton from '../CrmUi/CustomSkeleton';

export const TotalLiquidAvailableChartSkeleton = () => {
    return (
        <div className="grid w-full gap-5 p-5">
            <div className="flex w-full justify-between pb-2">
                <CustomSkeleton type="title" className="h-8 w-[250px]" />
                <CustomSkeleton type="title" className="h-8 w-[250px]" />
            </div>

            <CustomSkeleton type="content" className="h-80 w-full" />
        </div>
    );
};
