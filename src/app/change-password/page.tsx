"use client";
import React from 'react'
import Image from 'next/image'
import { BsCheck2 } from "react-icons/bs";
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, Tooltip } from 'flowbite-react';
import { AiOutlineLoading } from 'react-icons/ai';
import LabelPassword from '@/components/InputLabels/LabelPassword';
import { ChangePasswordProps } from '@/types/form';
import LabelConfirmPassword from '@/components/InputLabels/LabelConfirmPassword';
import usePassword from '@/hooks/usePassword';
import { BiArrowBack } from 'react-icons/bi';
import Link from 'next/link';
import UseMySwal from '@/hooks/useMySwal';
import { redirect } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';

const ChangePassword = () => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        clearErrors
    } = useForm<ChangePasswordProps>();

    // form
    const passwordInput = watch('password');
    const confirmPasswordInput = watch('confirm_password');

    const router = useRouter();
    const MySwal = UseMySwal();

    const { loading,
        setLoading,
        passwordsMatch,
        passwordStr,
        strengthColor,
        barWidth,
        passwordRequirements } = usePassword(passwordInput, confirmPasswordInput);

    const onSubmit: SubmitHandler<ChangePasswordProps> = async (data) => {
        setLoading(true);
    }

    const redirectToLogin = () => {
        router.push('/auth/signin');
        MySwal.fire({
            position: "bottom-end",
            icon: 'warning',
            title: "Alteração cancelada!",
            showConfirmButton: false,
            timer: 2000,
            toast: true,
            timerProgressBar: true,
        });
    }

    return (
        <div className='bg-slate-200 mx-auto flex justify-center items-center min-h-screen max-w-screen-2xl p-4 md:p-6 2xl:p-10'>
            <div className='relative min-w-96 w-[500px] min-h-[550px] py-5 px-6 flex flex-col items-center bg-white border border-stroke shadow-1'>
                <div className='absolute top-8 left-5 transition-all duration-200 hover:text-primary'>
                    <span onClick={redirectToLogin} title='Voltar para o login'>
                        <BiArrowBack className='h-6 w-6 dark:text-white cursor-pointer' />
                    </span>
                </div>
                <span className="mb-12 flex flex-col justify-center
               items-center">
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
                </span>
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
                        passwordRequirements={passwordRequirements}
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