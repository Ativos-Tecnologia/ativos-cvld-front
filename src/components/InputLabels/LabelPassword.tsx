"use client";
import React, { useState } from 'react'
import { LabelProps } from '@/types/form';
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';


const LabelPassword = ({ title, errors, register, field, passwordInput, strengthColor, barWidth, passwordStr }: LabelProps) => {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleToggleHidde = (): void => {
        setShowPassword(!showPassword);
    }

    return (
        <div>
            <label className="mb-2.5 block font-medium text-graydark dark:text-white">
                {title}
            </label>
            <div className="relative group">
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua nova senha"
                    className={`${errors[field] && '!border-rose-400 !ring-0'} block w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                    id="password"
                    {
                    ...register("password", {
                        required: "Campo obrigatório",
                        minLength: {
                            value: 6,
                            message: "Mínimo de 6 caracteres",
                        },
                        maxLength: {
                            value: 30,
                            message: "Máximo de 30 caracteres"
                        },
                        pattern: {
                            value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
                            message: "Mínimo de 6 caracteres, 1 letra, 1 número e 1 caractere especial",
                        }
                    })
                    }
                    
                />

                <ErrorMessage errors={errors} field='password' />

                {/* password strength message */}
                {passwordInput && (
                    <div className="w-full mt-7 ml-1 text-sm text-slate-400 flex flex-col">
                        <div className="w-full h-1.5 border-none rounded">
                            <div style={{ backgroundColor: `${strengthColor}` }} className={`${barWidth} h-full rounded transition-all duration-300`}></div>
                        </div>
                        <div>
                            Força da senha: <span style={{ color: `${strengthColor}` }}>{passwordStr}</span>
                        </div>
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

export default LabelPassword