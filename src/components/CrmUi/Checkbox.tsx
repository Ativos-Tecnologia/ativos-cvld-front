import React from 'react'
import { cn } from '@/lib/utils';

const CustomCheckbox = ({ check, callbackFunction, className }:
    {
        check: boolean | undefined | null;
        callbackFunction: any;
        className: string;
    }
) => {
    return (
        <React.Fragment>
            <div className={`w-6 h-6 flex items-center justify-center`}>
                <div
                    onClick={callbackFunction}
                    className={cn(`${check === true && '!border-l-0 !border-t-0 !w-2 !h-4 !border-green-600 dark:border-white !rounded-none rotate-[45deg] ml-1 -mt-1.5'} w-[15px] h-[15px] bg-transparent dark:bg-transparent border-2 border-body dark:border-bodydark rounded-[3px] cursor-pointer transition-transform duration-300`, className)}
                ></div>
            </div>
        </React.Fragment>
    )
}

export default CustomCheckbox