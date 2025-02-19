'use client';

import React, { lazy, Suspense, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/constants';
import UseMySwal from '@/hooks/useMySwal';
import api from '@/utils/api';
import Image from 'next/image';
import Link from 'next/link';
import { Fade } from 'react-awesome-reveal';
import { Button } from '@/components/Button';
import usePassword from '@/hooks/usePassword';
import { ValidateSignIn } from '@/validation/singin/singin.validation';
import { BiLockAlt, BiUser, BiX } from 'react-icons/bi';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { MultiStepLoginLoader } from '@/components/ui/multi-step-loader-login';
import './index.css';
import CelerLoginPage from './_hosts/celer-login';
import DevLoginPage from './_hosts/dev-login';

const ForgotPassword = lazy(() => import('@/components/Modals/ForgotPassword'));

export type SignInInputs = {
    username: string;
    password: string;
};

const loadingStates = ['Iniciando', 'Enviando Dados', 'Verificando Credenciais', 'Finalizado'];

interface SignInClientProps {
    host: string;
}

const SignIn: React.FC<SignInClientProps> = ({ host }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignInInputs>();

    const passwordInput = watch('password');
    const { loading, setLoading, hide, setHide } = usePassword(passwordInput);
    const [reqStatus, setReqStatus] = useState<'success' | 'failure' | null>(null);
    const [loginError, setLoginError] = useState<string | undefined>(undefined);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [showLoginForm, setShowLoginForm] = useState<boolean>(false);

    const nextRouter = useRouter();

    async function checkUserInfo(): Promise<{
        product: string;
        staff_approvation: boolean;
        is_confirmed: boolean;
    }> {
        try {
            const response = await api.get('/api/profile/');
            return {
                product: response.data.product,
                staff_approvation: response.data.staff_approvation,
                is_confirmed: response.data.is_confirmed,
            };
        } catch (error) {
            throw new Error('Ocorreu um erro ao tentar buscar o produto do usuário');
        }
    }

    async function handleRedirect() {
        const userInfo = await checkUserInfo();
        const userProduct = userInfo.product;
        const userApprovation = userInfo.staff_approvation;
        const userConfirmation = userInfo.is_confirmed;

        setLoading(false);
        ValidateSignIn({ userProduct, userApprovation, userConfirmation }, nextRouter);
    }

    const onSubmit: SubmitHandler<SignInInputs> = async (data) => {
        setLoading(true);
        try {
            const res = await api.post('/api/token/', data);

            if (res.status === 200) {
                localStorage.setItem(`ATIVOS_${ACCESS_TOKEN}`, res.data.access);
                localStorage.setItem(`ATIVOS_${REFRESH_TOKEN}`, res.data.refresh);
                setReqStatus('success');
            } else {
                throw new Error(`Erro ao tentar efetuar login: ${res.status} - ${res.statusText}`);
            }
        } catch (error: any) {
            setReqStatus('failure');
            setLoginError(error.response.data.error);
        }
    };

    return (
        <>
            {host === 'celer' ? (
                <CelerLoginPage
                    register={register}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    setLoading={setLoading}
                    hide={hide}
                    setHide={setHide}
                    reqStatus={reqStatus}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    showLoginForm={showLoginForm}
                    setShowLoginForm={setShowLoginForm}
                    onSubmit={onSubmit}
                    handleRedirect={handleRedirect}
                    errors={errors}
                    loginError={loginError!}
                    loadingStates={loadingStates}
                />
            ) : (
                <DevLoginPage
                    register={register}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    setLoading={setLoading}
                    hide={hide}
                    setHide={setHide}
                    reqStatus={reqStatus}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    showLoginForm={showLoginForm}
                    setShowLoginForm={setShowLoginForm}
                    onSubmit={onSubmit}
                    handleRedirect={handleRedirect}
                    errors={errors}
                    loginError={loginError!}
                    loadingStates={loadingStates}
                />
            )}
        </>
    );
};

export default SignIn;
