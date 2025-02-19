import Image from 'next/image';
import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { BiLockAlt, BiUser, BiX } from 'react-icons/bi';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { Button } from '@/components/Button';
import Link from 'next/link';
import ForgotPassword from '@/components/Modals/ForgotPassword';
import { MultiStepLoginLoader } from '@/components/ui/multi-step-loader-login';
import { TenantSignInPageProps } from '@/interfaces/ISignInPageProps';

const DevLoginPage: React.FC<TenantSignInPageProps> = ({
    showLoginForm,
    setShowLoginForm,
    loading,
    handleRedirect,
    loginError,
    errors,
    register,
    handleSubmit,
    onSubmit,
    setHide,
    hide,
    loadingStates,
    reqStatus,
    setLoading,
    setOpenModal,
    openModal,
}) => {
    return (
        <div className="relative flex items-center justify-center overflow-hidden font-nexa xl:min-h-screen">
            <main className="h-screen flex-1 overflow-hidden shadow-2 3xl:h-[700px] 3xl:max-w-[75%] 3xl:rounded-md">
                <Fade className="h-full">
                    <div className="new_hero_login flex h-full w-full overflow-hidden">
                        <div className="absolute inset-0 z-2 h-full w-full bg-cover bg-center">
                            <Image
                                src={'/images/ornaments/vector-1.svg'}
                                alt="ornamento inferior direito de faixas azuis"
                                width={900}
                                height={200}
                                className="absolute 2xsm:-right-5 2xsm:bottom-0 2xsm:opacity-30 md:-bottom-5 md:right-10 md:w-[700px] lg:-right-10 lg:bottom-0 lg:opacity-100 xl:w-[900px]"
                            />
                            <Image
                                src={'/images/ornaments/vector-2.svg'}
                                alt="ornamento superior esquerdo gradiente azul"
                                width={950}
                                height={200}
                                className="absolute 2xsm:-left-12 2xsm:-top-10 2xsm:h-[200px] md:-left-15 md:-top-10 md:h-fit md:w-[620px] lg:-top-10 lg:left-0 lg:w-[750px] xl:-left-5 xl:w-[950px]"
                            />
                        </div>
                        <div className="new_hero_login_overlap absolute inset-0 z-3 h-full w-full animate-wiggle">
                            {/* Outras imagens ou elementos */}
                        </div>
                        <div className="container-grid relative z-[4] min-h-screen 2xsm:w-full 2xsm:p-3 md:ml-10 md:w-115 md:p-0 lg:ml-20 xl:ml-50 3xl:ml-40">
                            <Image
                                src="/images/logo/celer-app-text-dark.svg"
                                alt="logo da ativos"
                                width={300}
                                height={32}
                                draggable={false}
                                className="self-end 2xsm:mb-5 2xsm:ml-5 2xsm:w-[150px] md:mx-15 md:mb-0 md:w-[230px] lg:mx-auto lg:mb-2 lg:w-[280px] xl:mb-5 xl:w-[300px]"
                            />

                            {showLoginForm ? (
                                <Fade className="self-center">
                                    <div className="rounded-lg bg-snow p-5 2xsm:mx-auto 2xsm:mb-5 2xsm:w-94 md:mx-0 md:mb-0 md:mt-8 md:w-100 lg:mt-5 lg:w-115">
                                        <div className="mb-6 flex items-center justify-between rounded-lg">
                                            <h2 className={`text-2xl font-semibold text-[#083b88]`}>
                                                Acesse sua conta
                                            </h2>
                                            <button
                                                className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:bg-slate-700"
                                                onClick={() => setShowLoginForm(false)}
                                            >
                                                <BiX className="text-2xl transition-colors duration-300 group-hover:text-white" />
                                            </button>
                                        </div>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="relative mb-5">
                                                <input
                                                    id="usuario"
                                                    type="text"
                                                    placeholder="Digite o usuário"
                                                    className={`${errors.username && 'border-2 !border-rose-400 !ring-0'} w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none`}
                                                    {...register('username', {
                                                        required: 'Campo obrigatório',
                                                    })}
                                                    aria-invalid={
                                                        errors.username ? 'true' : 'false'
                                                    }
                                                />
                                                {errors.username && (
                                                    <span className="absolute -bottom-4.5 left-1 text-xs text-red">
                                                        Campo obrigatório
                                                    </span>
                                                )}
                                                <span className="absolute right-4 top-2.5 h-[22px] w-[22px]">
                                                    <BiUser
                                                        style={{
                                                            width: '22px',
                                                            height: '22px',
                                                            fill: '#BAC1CB',
                                                        }}
                                                    />
                                                </span>
                                            </div>

                                            <div className="relative mb-7">
                                                <input
                                                    id="senha"
                                                    type={hide.password ? 'password' : 'text'}
                                                    placeholder="Digite a sua senha"
                                                    className={`${errors.password && 'border-2 !border-rose-400 !ring-0'} w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none`}
                                                    {...register('password', {
                                                        required: 'Campo obrigatório',
                                                    })}
                                                    aria-invalid={
                                                        errors.password ? 'true' : 'false'
                                                    }
                                                />
                                                {errors.password && (
                                                    <span className="absolute -bottom-4.5 left-1 text-xs text-red">
                                                        Campo obrigatório
                                                    </span>
                                                )}
                                                <span
                                                    className="absolute right-11 top-2.5 cursor-pointer"
                                                    onClick={() =>
                                                        setHide({
                                                            ...hide,
                                                            password: !hide.password,
                                                        })
                                                    }
                                                >
                                                    {!hide.password ? (
                                                        <BsEye
                                                            style={{
                                                                width: '22px',
                                                                height: '22px',
                                                                fill: '#BAC1CB',
                                                            }}
                                                        />
                                                    ) : (
                                                        <BsEyeSlash
                                                            style={{
                                                                width: '22px',
                                                                height: '22px',
                                                                fill: '#BAC1CB',
                                                            }}
                                                        />
                                                    )}
                                                </span>
                                                <span className="absolute right-4 top-2.5">
                                                    <BiLockAlt
                                                        style={{
                                                            width: '22px',
                                                            height: '22px',
                                                            fill: '#BAC1CB',
                                                        }}
                                                    />
                                                </span>
                                            </div>

                                            <div className="mb-5 flex items-center justify-center gap-3 md:flex-row">
                                                <Button
                                                    type="submit"
                                                    isLoading={loading}
                                                    style={{
                                                        boxShadow:
                                                            '2px 2px 4px rgba(0, 0, 0, 0.35)',
                                                    }}
                                                    className="flex h-8 w-full flex-1 items-center justify-center text-lg uppercase tracking-widest"
                                                >
                                                    <span className="flex">Acessar</span>
                                                </Button>
                                                <Button
                                                    onClick={() => setOpenModal(true)}
                                                    variant="ghost"
                                                    size="default"
                                                    className="h-8 text-[#0838bb]"
                                                >
                                                    Esqueci a senha
                                                </Button>
                                            </div>

                                            <div className="flex items-center justify-center gap-2 text-[13px] md:text-sm">
                                                <p>Ainda não possui conta?</p>
                                                <Link
                                                    href="/auth/signup"
                                                    className="text-[#0838bb]"
                                                >
                                                    Crie uma conta agora
                                                </Link>
                                            </div>
                                        </form>
                                    </div>
                                </Fade>
                            ) : (
                                <div className="flex flex-col self-center 2xsm:gap-15 md:mt-10 md:gap-10">
                                    <h1
                                        className="translate-x-25 animate-fade-right text-left font-rooftop font-bold text-snow opacity-0 delay-300 2xsm:text-4xl md:text-5xl"
                                        style={{
                                            filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.50))',
                                        }}
                                    >
                                        Área de Acesso do time de desenvolvimento da Ativos
                                    </h1>
                                    <button
                                        onClick={() => setShowLoginForm(true)}
                                        className={`group relative w-fit animate-fade-right cursor-pointer overflow-hidden rounded-lg bg-blue-700 px-4 py-2 text-xl opacity-0 delay-700 md:text-2xl`}
                                    >
                                        <p className="relative z-20 text-white">Acesse sua conta</p>
                                        <span className="absolute left-1/2 top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-blue-800 transition-all duration-500 ease-in-out group-hover:scale-[20]"></span>
                                    </button>
                                </div>
                            )}

                            <div className="flex flex-col 2xsm:justify-end 2xsm:gap-8 md:mt-7 md:gap-5 xl:gap-8">
                                <Image
                                    src={'/images/logo/new-logo-text-dark.svg'}
                                    alt={'logo da ativos (texto)'}
                                    width={100}
                                    height={50}
                                    draggable={false}
                                    className="2xsm:w-[90px] md:w-25"
                                />
                                <ul className="font grid max-w-[362px] gap-x-5 gap-y-2 text-sm text-snow 2xsm:grid-cols-2 md:grid-cols-2 xl:gap-y-5">
                                    <li className="col-span-1">
                                        <Link
                                            target="_blank"
                                            href={'/automated-proposal'}
                                            className="group relative transition-colors duration-200 hover:text-bodydark1"
                                        >
                                            Lead Magnet
                                            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-snow transition-all duration-300 ease-in-out group-hover:w-full" />
                                        </Link>
                                    </li>
                                    <li className="col-span-1">
                                        <Link
                                            target="_blank"
                                            href={'/retification'}
                                            className="group relative transition-colors duration-200 hover:text-bodydark1"
                                        >
                                            Recalculador do TRF1
                                            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-snow transition-all duration-300 ease-in-out group-hover:w-full" />
                                        </Link>
                                    </li>
                                    <li className="col-span-1">
                                        <Link
                                            target="_blank"
                                            href={'/politica-de-privacidade'}
                                            className="group relative transition-colors duration-200 hover:text-bodydark1"
                                        >
                                            Política de Privacidade
                                            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-snow transition-all duration-300 ease-in-out group-hover:w-full" />
                                        </Link>
                                    </li>
                                    <li className="col-span-1">
                                        <Link
                                            target="_blank"
                                            href={'/termos-e-condicoes'}
                                            className="group relative transition-colors duration-200 hover:text-bodydark1"
                                        >
                                            Termos e Condições
                                            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-snow transition-all duration-300 ease-in-out group-hover:w-full" />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Fade>
            </main>
            <ForgotPassword state={openModal} setState={setOpenModal} />
            {loading && (
                <MultiStepLoginLoader
                    loadingStates={loadingStates}
                    reqStatus={reqStatus}
                    handleRedirect={handleRedirect}
                    handleClose={() => setLoading(false)}
                    loginError={loginError}
                />
            )}
        </div>
    );
};

export default DevLoginPage;
