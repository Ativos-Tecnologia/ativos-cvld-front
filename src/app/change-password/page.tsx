"use client";
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BsCheck2 } from "react-icons/bs";
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import { AiOutlineLoading } from 'react-icons/ai';
import LabelPassword from '@/components/InputLabels/LabelPassword';
import { ChangePasswordProps } from '@/types/form';
import LabelConfirmPassword from '@/components/InputLabels/LabelConfirmPassword';

const ChangePassword = () => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        clearErrors
    } = useForm<ChangePasswordProps>();

    const [loading, setLoading] = useState<boolean>(false);
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
    const [passwordStr, setPasswordStr] = useState<string>('');
    const [strengthColor, setStrengthColor] = useState<string>('slate-400');
    const [barWidth, setBarWidth] = useState<string>('w-0');

    // form
    const passwordInput = watch('password');
    const confirmPasswordInput = watch('confirm_password');
    console.log(passwordInput, confirmPasswordInput)

    useEffect(() => {
        const calculatePasswordStrength = (password: string): void => {
            let strength: number = 0;

            if (password) {

                // mudando força da senha de acordo com requisitos mínimos:
                if (password.length >= 6) strength += 1;
                if (/[A-Z]/.test(password)) strength += 1;
                if (/[a-z]/.test(password)) strength += 1;
                if (/[0-9]/.test(password)) strength += 1;
                if (/[@$!%*#?&]/.test(password)) strength += 1;

                // verificando força da senha para passar feedback visual:
                switch (strength) {
                    case 0:
                        break;
                    case 1:
                        setPasswordStr('muito fraca');
                        setBarWidth('w-1/5');
                        setStrengthColor('#ff0000');
                        break;
                    case 2:
                        setPasswordStr('fraca');
                        setBarWidth('w-2/5');
                        setStrengthColor('#ffa00a');
                        break;
                    case 3:
                        setPasswordStr('boa');
                        setBarWidth('w-3/5');
                        setStrengthColor('#fdec12');
                        break;
                    case 4:
                        setPasswordStr('forte');
                        setBarWidth('w-4/5');
                        setStrengthColor('#51ff2e');
                        break;
                    case 5:
                        setPasswordStr('muito forte');
                        setBarWidth('w-full');
                        setStrengthColor('#21e600');
                        break;
                    default:
                        break;
                }

            } else {
                strength = 0;
                setPasswordStr('');
                setBarWidth('w-0');
                setStrengthColor('slate-400');
            }
        }
        calculatePasswordStrength(passwordInput);
    }, [passwordInput]);

    useEffect(() => {
        const comparePasswords = (): void => {
            passwordInput === confirmPasswordInput ? setPasswordsMatch(true) : setPasswordsMatch(false);
        }
        comparePasswords();
    }, [confirmPasswordInput, passwordInput]);

    const onSubmit: SubmitHandler<ChangePasswordProps> = async (data) => {
        setLoading(true);
    }

    return (
        <div className='bg-slate-200 mx-auto flex justify-center items-center min-h-screen max-w-screen-2xl p-4 md:p-6 2xl:p-10'>
            <div className='min-w-96 w-[500px] min-h-[550px] py-5 px-6 flex flex-col items-center bg-white border border-stroke shadow-1'>
                <Link className="mb-12 flex flex-col justify-center
               items-center" href="/">
                    <Image
                        className="hidden dark:block"
                        src={"/images/logo/logo-dark.svg"}
                        alt="Logo"
                        width={176}
                        height={32}
                    />
                    <Image
                        className="dark:hidden"
                        src={"/images/logo/logo.svg"}
                        alt="Logo"
                        width={176}
                        height={32}
                    />
                    <h2 className="2xsm:px-20 mt-4 text-2xl text-graydark font-bold dark:text-white" aria-selected="false">
                        Redefinição de senha
                    </h2>
                </Link>
                <form className='w-10/12' onSubmit={handleSubmit(onSubmit)}>
                    <LabelPassword 
                        title='Nova senha'
                        errors={errors}
                        register={register}
                        clearErrors={clearErrors}
                        field='password'
                        passwordInput={passwordInput}
                        passwordStr={passwordStr}
                        strengthColor={strengthColor}
                        barWidth={barWidth}
                    />

                    <LabelConfirmPassword 
                        title='Repita a nova senha'
                        errors={errors}
                        register={register}
                        clearErrors={clearErrors}
                        field='confirm_password'
                        passwordsMatch={passwordsMatch}
                    />

                    <Button gradientDuoTone="purpleToBlue" type='submit' className='flex items-center justify-center w-full cursor-pointer rounded-lg p-4 text-white hover:bg-opacity-90 dark:border-primary dark:bg-primary dark:hover:bg-opacity-90'>
                        <span className="text-[16px] font-medium" aria-disabled={loading}>
                            {loading ? "Definindo nova senha..." : "Confirmar"}
                        </span>
                        {
                            !loading ? (<BsCheck2 className="mt-[0.2rem] ml-2 h-4 w-4" />) : (<AiOutlineLoading className="mt-[0.2rem] ml-2 h-4 w-4 animate-spin" />)
                        }
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword