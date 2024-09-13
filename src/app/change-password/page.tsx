"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import { BsCheck2 } from "react-icons/bs";
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { AiOutlineLoading } from 'react-icons/ai';
import LabelPassword from '@/components/InputLabels/LabelPassword';
import { ChangePasswordProps } from '@/types/form';
import LabelConfirmPassword from '@/components/InputLabels/LabelConfirmPassword';
import usePassword from '@/hooks/usePassword';
import { BiArrowBack } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import useColorMode from '@/hooks/useColorMode';
import api from '@/utils/api';
import UseMySwal from '@/hooks/useMySwal';

const ChangePassword = () => {

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
        clearErrors
    } = useForm<ChangePasswordProps>();
    const [colorMode, setColorMode] = useColorMode()

    // form
    const passwordInput = watch('password');
    const confirmPasswordInput = watch('confirm_password');

    const router = useRouter();
    const MySwal = UseMySwal();
    const [loading, setLoading] = useState<boolean>(false);

    const {
        passwordsMatch,
        passwordStr,
        strengthColor,
        barWidth,
        passwordRequirements } = usePassword(passwordInput, confirmPasswordInput);

    const onSubmit: SubmitHandler<ChangePasswordProps> = async (data) => {
        setLoading(true);

        const userToken = window.location.href.split('password')[1]
        
        const response = await api.post(`/api/reset-password/${userToken}`, {
            new_password: data.password
        })
        
        if (response.status === 200) {
            reset();
            MySwal.fire({
                icon: "success",
                title: "Tudo certo",
                text: "Sua senha foi alterada com sucesso!",
                showConfirmButton: true,
                confirmButtonText: "Ir para LogIn",
                confirmButtonColor: "#1A56DB"
            })
        } else {
            console.error('Ocorreu um erro ao redefinir a senha');
            MySwal.fire({
                icon: "error",
                title: "Oops!",
                text: "Algo deu errado ao alterar a sua senha.",
                showConfirmButton: true,
                confirmButtonColor: "#1A56DB"
            })
        }

        setLoading(false);
    }

    const redirectToLogin = () => {
        router.push('/auth/signin');
    }

    return (
        <div className='bg-gray dark:bg-boxdark-2 mx-auto flex justify-center items-center min-h-screen max-w-screen-2xl p-4 md:p-6 2xl:p-10'>
            <div className='relative min-w-96 w-[500px] min-h-[550px] py-5 px-6 flex flex-col items-center rounded-md bg-white dark:bg-boxdark border border-stroke dark:border-strokedark shadow-1'>
                <div className='absolute top-8 left-5 transition-all duration-200 hover:text-primary'>
                    <span onClick={redirectToLogin} title='Voltar para o login'>
                        <BiArrowBack className='h-6 w-6 dark:text-white cursor-pointer' />
                    </span>
                </div>
                <span className="mb-12 flex flex-col justify-center
               items-center">
                    <div className="hidden dark:flex items-center gap-3 bg">
                        <Image
                            src={"/images/logo/celer-app-text-dark.svg"}
                            alt="Logo"
                            width={180}
                            height={32}
                        />
                    </div>
                    <div className="dark:hidden flex flex-col items-center gap-3 bg">
                        <Image
                            src={"/images/logo/celer-app-text.svg"}
                            alt="Logo"
                            width={180}
                            height={32}
                        />
                    </div>
                    <h2 className="2xsm:px-20 mt-6 text-2xl text-graydark font-bold dark:text-white" aria-selected="false">
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

                    <Button disabled={!passwordsMatch} type='submit' className={`${status === 'request_success' && 'bg-green-500 hover:bg-green-600'} flex items-center justify-center w-full cursor-pointer rounded-lg py-8 text-white hover:bg-opacity-90 disabled:opacity-50`}>
                        <span className="text-[16px] font-medium">
                            {loading ? "Alterando senha" : "Confirmar"}
                        </span>
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword