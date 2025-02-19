import React from 'react'
import { cn } from '@/lib/utils';
import { IoIosCheckmark } from 'react-icons/io';

type CustomRadioProps = {
    check?: boolean | undefined | null;
    callbackFunction?: any;
    id?: string;
    className?: string;
    register?: any;
    value?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;


const CustomRadio: React.FC<CustomRadioProps> = ({ check, callbackFunction, id, className, register, value, ...props }) => {

    return (
        <React.Fragment>
            <label className={cn(`relative w-[15px] h-[15px] flex items-center justify-center bg-transparent dark:bg-transparent border-2 ${check ? 'border-white': 'border-body dark:border-bodydark'} rounded-full overflow-hidden cursor-pointer`, className)}>
                <input
                    checked={register ? undefined : check}
                    onChange={callbackFunction}
                    type="radio"
                    id={id || ''}
                    className='z-1 inset-0 sr-only cursor-pointer'
                    value={value}
                    {...register}
                    {...props}
                />

                <div
                    className={`w-3 h-3 rounded-full bg-meta-5 flex items-center justify-center transition-all duration-200 ${check ? 'scale-100' : 'scale-0'}`}
                >
                    {/* <IoIosCheckmark className={`${check ? 'opacity-100' : 'opacity-0'} duration-150 transition-opacity delay-500 text-white w-4 h-4`}/> */}
                </div>
            </label>
        </React.Fragment>
    )
}

export default CustomRadio;
