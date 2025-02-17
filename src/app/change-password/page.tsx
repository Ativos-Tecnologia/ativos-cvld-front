'use client';
import LabelConfirmPassword from '@/components/InputLabels/LabelConfirmPassword';
import LabelPassword from '@/components/InputLabels/LabelPassword';
import { Button } from '@/components/ui/button';
import useColorMode from '@/hooks/useColorMode';
import UseMySwal from '@/hooks/useMySwal';
import usePassword from '@/hooks/usePassword';
import { ChangePasswordProps } from '@/types/form';
import api from '@/utils/api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BiArrowBack } from 'react-icons/bi';

const ChangePassword = () => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
        clearErrors,
    } = useForm<ChangePasswordProps>();
    const [colorMode, setColorMode] = useColorMode();

    // form
    const passwordInput = watch('password');
    const confirmPasswordInput = watch('confirm_password');

    const router = useRouter();
    const MySwal = UseMySwal();
    const [loading, setLoading] = useState<boolean>(false);

    const { passwordsMatch, passwordStr, strengthColor, barWidth, passwordRequirements } =
        usePassword(passwordInput, confirmPasswordInput);

    const onSubmit: SubmitHandler<ChangePasswordProps> = async (data) => {
        setLoading(true);

        const userToken = window.location.href.split('password')[1];

        const response = await api.post(`/api/reset-password/${userToken}`, {
            new_password: data.password,
        });

        if (response.status === 200) {
            reset();
            MySwal.fire({
                icon: 'success',
                title: 'Tudo certo',
                text: 'Sua senha foi alterada com sucesso!',
                showConfirmButton: true,
                confirmButtonText: 'Ir para LogIn',
                confirmButtonColor: '#1A56DB',
            });
        } else {
            console.error('Ocorreu um erro ao redefinir a senha');
            MySwal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Algo deu errado ao alterar a sua senha.',
                showConfirmButton: true,
                confirmButtonColor: '#1A56DB',
            });
        }

        setLoading(false);
    };

    const redirectToLogin = () => {
        router.push('/auth/signin');
    };

    return (
        <div className="mx-auto flex min-h-screen max-w-screen-2xl items-center justify-center bg-gray p-4 dark:bg-boxdark-2 md:p-6 2xl:p-10">
            <div className="relative flex min-h-[550px] w-[500px] min-w-96 flex-col items-center rounded-md border border-stroke bg-white px-6 py-5 shadow-1 dark:border-strokedark dark:bg-boxdark">
                <div className="absolute left-5 top-8 transition-all duration-200 hover:text-primary">
                    <span onClick={redirectToLogin} title="Voltar para o login">
                        <BiArrowBack className="h-6 w-6 cursor-pointer dark:text-white" />
                    </span>
                </div>
                <span
                    className="mb-12 flex flex-col items-center
               justify-center"
                >
                    <div className="bg hidden items-center gap-3 dark:flex">
                        <Image
                            src={'/images/logo/celer-app-text-dark.svg'}
                            alt="Logo"
                            width={180}
                            height={32}
                        />
                    </div>
                    <div className="bg flex flex-col items-center gap-3 dark:hidden">
                        <Image
                            src={'/images/logo/celer-app-text.svg'}
                            alt="Logo"
                            width={180}
                            height={32}
                        />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-graydark dark:text-white 2xsm:px-20">
                        Redefinição de senha
                    </h2>
                </span>
                <form className="w-10/12" onSubmit={handleSubmit(onSubmit)}>
                    <LabelPassword
                        title="Nova senha"
                        errors={errors}
                        register={register}
                        clearErrors={clearErrors}
                        field="password"
                        passwordInput={passwordInput}
                        passwordStr={passwordStr}
                        strengthColor={strengthColor}
                        barWidth={barWidth}
                        passwordRequirements={passwordRequirements}
                        htmlFor="password"
                    />

                    <LabelConfirmPassword
                        title="Repita a nova senha"
                        errors={errors}
                        register={register}
                        clearErrors={clearErrors}
                        field="confirm_password"
                        passwordsMatch={passwordsMatch}
                        htmlFor="confirm_password"
                    />

                    <Button
                        disabled={!passwordsMatch}
                        type="submit"
                        className={`${status === 'request_success' && 'bg-green-500 hover:bg-green-600'} flex w-full cursor-pointer items-center justify-center rounded-lg py-8 text-white hover:bg-opacity-90 disabled:opacity-50`}
                    >
                        <span className="text-[16px] font-medium">
                            {loading ? 'Alterando senha' : 'Confirmar'}
                        </span>
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
