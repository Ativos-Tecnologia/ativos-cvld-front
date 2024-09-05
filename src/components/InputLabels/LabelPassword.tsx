"use client";
import React, { useState } from 'react'
import { LabelProps } from '@/types/form';
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Popover } from 'flowbite-react';
import { BiCheck, BiInfoCircle, BiLockAlt, BiX } from 'react-icons/bi';


const LabelPassword = ({ title, errors, register, field, passwordInput, strengthColor, barWidth, passwordStr, passwordRequirements }: LabelProps) => {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleToggleHide = (): void => {
        setShowPassword(!showPassword);
    }

    return (
        <div className='mb-11'>
            <label className="mb-2.5 flex items-center gap-3 font-medium">
                <span className="text-black dark:text-white">{title}</span>
                {/* popover for password hint */}
                {passwordRequirements && (
                    <Popover
                        aria-labelledby="default-popover"
                        trigger="hover"
                        placement="right"
                        content={
                            <div className="w-64 text-sm">
                                <div className="border-b border-stroke bg-gray-100 px-3 py-2 dark:border-strokedark dark:bg-boxdark-2">
                                    <h3 id="default-popover" className="font-semibold text-gray-900 dark:text-white">A senha deve conter:</h3>
                                </div>
                                <div className="px-3 py-2 flex flex-col dark:text-white dark:bg-boxdark">
                                    <div className="flex items-center gap-2">
                                        {passwordRequirements.minLength ?
                                            <BiCheck className="w-6 h-6 fill-meta-3" /> :
                                            <BiX className="w-6 h-6 fill-meta-1" />}
                                        <span className="text-slate-500">No mínimo 6 caracteres</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {passwordRequirements.lowercase ?
                                            <BiCheck className="w-6 h-6 fill-meta-3" /> :
                                            <BiX className="w-6 h-6 fill-meta-1" />}
                                        <span className="text-slate-500">Uma letra minúscula</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {passwordRequirements.uppercase ?
                                            <BiCheck className="w-6 h-6 fill-meta-3" /> :
                                            <BiX className="w-6 h-6 fill-meta-1" />}
                                        <span className="text-slate-500">Uma letra maiúscula</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {passwordRequirements.number ?
                                            <BiCheck className="w-6 h-6 fill-meta-3" /> :
                                            <BiX className="w-6 h-6 fill-meta-1" />}
                                        <span className="text-slate-500">Um número</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {passwordRequirements.specialCharacter ?
                                            <BiCheck className="w-6 h-6 fill-meta-3" /> :
                                            <BiX className="w-6 h-6 fill-meta-1" />}
                                        <span className="text-slate-500">Um caractere especial <br /> (ex: @, $, !, %, *, #, ?, &)</span>
                                    </div>
                                </div>
                            </div>
                        }
                    >
                        <button type="button" className="relative">
                            {!passwordRequirements.filled && <span className="absolute z-0 inline-flex h-full w-full top-0 left-0 animate-ping rounded-full bg-meta-1 opacity-75"></span>}

                            <BiInfoCircle className={`${!passwordRequirements.filled && 'text-meta-1'} text-black dark:text-white h-3.5 w-3.5 cursor-pointer`} />
                        </button>
                    </Popover>
                )}
                {/* end popover for password hint */}
            </label>

            <div className="relative">
                <input
                    minLength={6}
                    maxLength={30}
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite a senha"
                    className={`${errors.password && '!border-rose-400 !ring-0 border-2 dark:!border-meta-1'} w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
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
                {passwordInput && passwordInput.length <= 0 && <ErrorMessage errors={errors} field={field} />}

                {/* password strength message */}
                {passwordInput && (
                    <div className="absolute w-full left-0 top-17 text-sm text-slate-400 flex flex-col gap-1">
                        <div className="w-full h-2 border-none rounded">
                            <div style={{ 
                                backgroundColor: `${strengthColor}`, 
                                width: `${barWidth}`
                                }} className={`h-full rounded transition-all duration-300`}></div>
                        </div>
                        <div>
                            Força da senha: <span style={{ color: `${strengthColor}` }}>{passwordStr}</span>
                        </div>
                    </div>
                )}

                <span className='absolute top-4.5 right-2 cursor-pointer'
                    onClick={handleToggleHide}
                >
                    {showPassword ? <BsEye style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} /> : <BsEyeSlash style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} />}
                </span>
            </div>
        </div>
    )
}

export default LabelPassword