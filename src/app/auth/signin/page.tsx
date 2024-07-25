"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import UnloggedLayout from "@/components/Layouts/UnloggedLayout";
import api from "@/utils/api";
import { APP_ROUTES } from "@/constants/app-routes";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/constants";
import UseMySwal from "@/hooks/useMySwal";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage";

import { HiOutlineArrowRight } from "react-icons/hi"

import { BiLockAlt, BiUser } from "react-icons/bi";
import { AiOutlineLoading } from "react-icons/ai";
import ForgotPassword from "@/components/Modals/ForgotPassword";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import usePassword from "@/hooks/usePassword";
import { Button } from "@/components/ui/button";


// export const metadata: Metadata = {
//   title: "CVLD Simulator - Login",
//   description: "Faça login para começar a utilizar o CVLD Simulator",
// };

export type SignInInputs = {
  username: string;
  password: string;
};

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignInInputs>()
  const passwordInput = watch("password");

  const {
    loading,
    setLoading,
    hide,
    setHide
  } = usePassword(passwordInput)

  const [openModal, setOpenModal] = useState<boolean>(false);
  const router = useRouter();
  const MySwal = UseMySwal();

  const onSubmit: SubmitHandler<SignInInputs> = async (data) => {
    setLoading(true);

    const checkIsUserFirstLogin = async (): Promise<boolean> => {
      try {
        const response = await api.get("/api/check-first-login/");

        if (response.data.is_first_login === true) {
          return true;
        }

        return false;

      } catch (error) {
        console.error(error);
        return false;
      }
    }


    try {
      const res = await api.post("/api/token/", data);
      if (res.status === 200) {
        localStorage.setItem(`ATIVOS_${ACCESS_TOKEN}`, res.data.access);
        localStorage.setItem(`ATIVOS_${REFRESH_TOKEN}`, res.data.refresh);


        if (await checkIsUserFirstLogin()) {
          router.push(APP_ROUTES.private.profile.name);
          MySwal.fire({
            position: "bottom-end",
            icon: "info",
            title: "Seja bem-vindo ao CVLD Simulator",
            text: "Para uma melhor experiência em nossa plataforma, por favor, complete seu cadastro",
            showConfirmButton: true,
          });
        } else {
          router.push(APP_ROUTES.private.dashboard.name);
          MySwal.fire({
            position: "bottom-end",
            icon: "success",
            title: "Bem-vindo de volta!",
            showConfirmButton: false,
            timer: 2000,
            toast: true,
            timerProgressBar: true,
          });
        }

      } else {
        router.push(APP_ROUTES.public.login.name);
      }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Erro ao efetuar login",
        text: "Verifique suas credenciais e tente novamente",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <UnloggedLayout>
      <div className="p-4">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-wrap items-center">
            {/* Bloco Desktop */}
            <div className="hidden w-full xl:block xl:w-1/2">
              <div className="px-26 py-17.5 text-center">
                <Link className="mb-12 flex flex-col justify-center
               items-center" href="/">
                  <div className="hidden dark:flex flex-col items-center gap-3 bg">
                    <Image
                      src={"/images/logo/celer-app-logo-dark.svg"}
                      alt="Logo"
                      width={160}
                      height={32}
                    />
                    <Image
                      src={"/images/logo/celer-app-text-dark.svg"}
                      alt="Logo"
                      width={200}
                      height={32}
                    />
                  </div>
                  <div className="dark:hidden flex flex-col items-center gap-3 bg">
                    <Image
                      src={"/images/logo/celer-app-logo.svg"}
                      alt="Logo"
                      width={160}
                      height={32}
                    />
                    <Image
                      src={"/images/logo/celer-app-text.svg"}
                      alt="Logo"
                      width={200}
                      height={32}
                    />
                  </div>
                </Link>
                <p className="2xl:px-10 text-lg font-medium">
                  Atualização inteligente dos valores de precatórios com base na legislação vigente
                </p>
              </div>
            </div>
            {/* Fim do bloco desktop */}

            {/* Bloco Mobile */}

            <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
              <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                <div className="block w-full xl:hidden xl:w-1/2">
                  <div className="sm:px-26 pt-5 text-center">
                    <Link className="flex flex-col justify-center items-center mb-15" href="/">
                      <div className="hidden dark:flex flex-col items-center gap-3 bg">
                        <Image
                          src={"/images/logo/celer-app-logo-dark.svg"}
                          alt="Logo"
                          width={0}
                          height={0}
                          className="2xsm:w-20 md:w-28"
                        />
                        <Image
                          src={"/images/logo/celer-app-text-dark.svg"}
                          alt="Logo"
                          width={0}
                          height={0}
                          className="2xsm:w-45"
                        />
                      </div>
                      <div className="dark:hidden flex flex-col items-center gap-3 bg">
                        <Image
                          src={"/images/logo/celer-app-logo.svg"}
                          alt="Logo"
                          width={0}
                          height={0}
                          className="2xsm:w-20 md:w-28"
                        />
                        <Image
                          src={"/images/logo/celer-app-text.svg"}
                          alt="Logo"
                          width={0}
                          height={0}
                          className="2xsm:w-45"
                        />
                      </div>
                    </Link>
                  </div>
                </div>
                {/* <span className="xl:mb-1.5 mb-10 block font-medium xl:text-2xl xl:text-left text-center text-lg">
                  Celer App
                </span> */}
                <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                  Acesse sua conta
                </h2>

                {/* Fim do Bloco Mobile */}


                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-11">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Usuário
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Digite o usuário"
                        className={`${errors.username && '!border-rose-400 !ring-0 border-2 dark:!border-meta-1'} w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                        {
                        ...register("username", {
                          required: "Campo obrigatório",
                        })
                        }
                        aria-invalid={errors.username ? "true" : "false"}
                      />
                      <ErrorMessage errors={errors} field='username' />
                      {/* {
                      errors.username && (
                        <span role="alert" className="absolute right-4 top-4 text-red pr-8 text-sm">
                          {errors.username.message}
                        </span>
                      )
                    } */}

                      <span className="absolute right-4 top-4 w-[22px] h-[22px]">
                        <BiUser style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} />
                      </span>
                    </div>
                  </div>

                  <div className="mb-11">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={hide.password ? "password" : "text"}
                        placeholder="Digite a sua senha"
                        className={`${errors.password && '!border-rose-400 !ring-0 border-2 dark:!border-meta-1'} w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                        {
                        ...register("password", {
                          required: "Campo obrigatório",
                        })
                        }
                        aria-invalid={errors.password ? "true" : "false"}
                      />
                      <ErrorMessage errors={errors} field='password' />

                      <span className='absolute top-4 right-10 cursor-pointer'
                        onClick={() => setHide({
                          ...hide,
                          password: !hide.password
                        })}
                      >
                        {!hide.password ? <BsEye style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} /> : <BsEyeSlash style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} />}
                      </span>

                      <span className="absolute right-4 top-4">
                        <BiLockAlt style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} />
                      </span>
                    </div>
                  </div>

                  <p onClick={() => setOpenModal(true)} className="text-blue-700 hover:text-blue-800 max-w-fit text-sm font-medium mb-6 cursor-pointer dark:text-blue-400 dark:hover:text-blue-500">
                    Esqueci a senha
                  </p>

                  <div className="mb-5">
                    <Button className="w-full py-8 flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white transition-all duration-200">
                      <span className="text-[16px] font-medium" aria-disabled={loading}>
                        {loading ? "Fazendo login..." : "Acessar"}
                      </span>
                      {
                        !loading ? (<HiOutlineArrowRight className="mt-[0.2rem] ml-2 h-4 w-4" />) : (<AiOutlineLoading className="mt-[0.2rem] ml-2 h-4 w-4 animate-spin" />)
                      }
                    </Button>
                    {/* <button type='submit' className='flex items-center justify-center w-full cursor-pointer rounded-lg p-6 text-white bg-blue-700 hover:bg-blue-800 transition-all duration-200'>
                      <span className="text-[16px] font-medium" aria-disabled={loading}>
                        {loading ? "Fazendo login..." : "Acessar"}
                      </span>
                      {
                        !loading ? (<HiOutlineArrowRight className="mt-[0.2rem] ml-2 h-4 w-4" />) : (<AiOutlineLoading className="mt-[0.2rem] ml-2 h-4 w-4 animate-spin" />)
                      }
                    </button> */}
                  </div>

                  {/* <button data-tooltip-target="tooltip-default" disabled className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50 disabled:cursor-not-allowed disabled:opacity-50">
                    <span>
                      <FcGoogle style={{ width: '22px', height: '22p' }} />
                    </span>
                    Login com o Google
                  </button> */}

                  <div className="mt-6 text-center">
                    <p>
                      Ainda não possui uma conta?{" "}
                      <Link aria-disabled href="/auth/signup" className="text-blue-700 hover:text-blue-800 font-medium dark:text-blue-400 dark:hover:text-blue-500">
                        Cadastre-se
                      </Link>
                    </p>
                  </div>
                </form>
                <ForgotPassword state={openModal} setState={setOpenModal} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UnloggedLayout>
  );
};

export default SignIn;
