'use client'
import React, { useState } from 'react'
import { LabelProps } from '@/types/form';
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';

const LabelConfirmPassword = ({ title, errors, register, field, passwordsMatch }: LabelProps) => {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleToggleHidde = (): void => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="mb-11 mt-6">
            <label className="mb-2.5 block font-medium text-graydark dark:text-white">
                {title}
            </label>
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua nova senha novamente"
                    className={`${errors[field] && '!border-rose-400 !ring-0'} w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    id="confirm_password"
                    {
                    ...register("confirm_password", {
                        required: "Campo obrigatório",
                    })
                    }
                    
                />

                <ErrorMessage errors={errors} field='confirm_password' />

                {!passwordsMatch && (
                    <div style={{ color: 'red' }} className="w-full mt-1 pr-1 text-sm text-right flex flex-col gap-1">
                        As senhas não conferem
                    </div>
                )}

                <span className='absolute top-4 right-2 cursor-pointer'
                    onClick={handleToggleHidde}
                >
                    {showPassword ? <BsEye style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} /> : <BsEyeSlash style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} />}
                </span>
            </div>
        </div>
    )
}

export default LabelConfirmPassword