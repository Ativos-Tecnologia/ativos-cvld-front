import React, { ReactNode } from "react";
import { AiOutlineLoading } from "react-icons/ai";



const CardDataStatsSkeleton: React.FC = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <AiOutlineLoading className="animate-spin min-h-fit max-w-fit" />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white h-8 w-32 bg-meta-2 dark:bg-meta-4 animate-pulse rounded-sm">
          </h4>
          <span className="text-sm font-medium h-8 w-24 bg-meta-2 dark:bg-meta-4 animate-pulse">
            </span>
        </div>

        <span
          className={`flex items-center gap-1 text-sm font-medium animate-pulse`}
        >
        </span>
      </div>
    </div>
  );
};

export default CardDataStatsSkeleton;
