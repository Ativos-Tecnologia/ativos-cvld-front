import React from 'react'
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';

type CustomCheckboxProps = {
    check?: boolean | undefined | null;
    callbackFunction?: any;
    id?: string;
    className?: string;
    register?: any;
} & React.InputHTMLAttributes<HTMLInputElement>;


const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ check, callbackFunction, id, className, register, ...props }) => {

    return (
        <React.Fragment>
            <label className={`relative w-6 h-6 flex items-center justify-center`}>
                <input
                    checked={register ? undefined : check}
                    onChange={callbackFunction}
                    type="checkbox"
                    id={id || ''}
                    className='absolute z-1 inset-0 w-full h-full opacity-0 cursor-pointer'
                    {...register}
                    {...props}
                />

                <div
                    className={cn(`${check === true && '!border-l-transparent !border-t-transparent !w-2 !h-4 !border-b-[#1E90FF] !border-r-[#1E90FF] dark:border-white !rounded-none rotate-[45deg] ml-1 -mt-1.5'} w-[15px] h-[15px] bg-transparent dark:bg-transparent border-2 border-body dark:border-bodydark rounded-[3px] cursor-pointer transition-all duration-300`, className)}
                ></div>
            </label>
        </React.Fragment>
    )
}

export default CustomCheckbox
