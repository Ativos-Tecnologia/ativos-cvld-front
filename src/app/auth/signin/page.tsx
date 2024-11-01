"use client";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage";
import UnloggedLayout from "@/components/Layouts/UnloggedLayout";
import { APP_ROUTES } from "@/constants/app-routes";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/constants";
import UseMySwal from "@/hooks/useMySwal";
import api from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Fade } from "react-awesome-reveal";
import { HiOutlineArrowRight } from "react-icons/hi";

import { Button } from "@/components/Button";
import ForgotPassword from "@/components/Modals/ForgotPassword";
import usePassword from "@/hooks/usePassword";
import { useQueryClient } from "@tanstack/react-query";
import { AiOutlineLoading } from "react-icons/ai";
import { BiLockAlt, BiUser } from "react-icons/bi";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import "./index.css";

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
  } = useForm<SignInInputs>();
  const passwordInput = watch("password");
  const queryClient = useQueryClient();

  const { loading, setLoading, hide, setHide } = usePassword(passwordInput);

  const [openModal, setOpenModal] = useState<boolean>(false);

  const router = useRouter();
  const MySwal = UseMySwal();

  async function checkUserProduct(): Promise<string> {
    try {
      const response = await api.get("/api/profile/");
      return response.data.product;
    } catch (error) {
      throw new Error("Ocorreu um erro ao tentar buscar o produto do usuário");
      // return 'error';
    }
  }

  async function checkStaffApprovation(): Promise<boolean> { 
    try {
      const response = await api.get("/api/profile/");
      return response.data.staff_approvation;
    } catch (e) {
      throw new Error(`Erro ao tentar verificar aprovação do usuário ${console.error(e)}`)
    }
  }

  const onSubmit: SubmitHandler<SignInInputs> = async (data) => {
    setLoading(true);

    try {
      const res = await api.post("/api/token/", data);
      if (res.status === 200) {
        localStorage.setItem(`ATIVOS_${ACCESS_TOKEN}`, res.data.access);
        localStorage.setItem(`ATIVOS_${REFRESH_TOKEN}`, res.data.refresh);

        const userProduct = await checkUserProduct();
        const userApprovation = await checkStaffApprovation();
      
        queryClient.removeQueries({ queryKey: ["notion_list"] });
        queryClient.removeQueries({ queryKey: ["user"] });

        if (userProduct === "wallet" && userApprovation === true) {
          router.push(APP_ROUTES.private.wallet.name);
        } else {
          router.push(APP_ROUTES.private.marketplace.name)
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
      <div className="relative flex h-full">
        <div className="hero_login hidden w-full flex-col justify-evenly px-20 py-8 text-center md:flex md:min-h-[900px] xl:min-h-full xl:w-[65%]">
          <div className="2xsm:hidden xl:block">
            {/* logo */}
            <div className="relative mb-10 flex flex-col items-center justify-center">
              <Fade triggerOnce>
                <div className="flex flex-col items-center gap-3">
                  <Image
                    src={"/images/logo/new-logo-dark.png"}
                    alt="Logo"
                    width={160}
                    height={32}
                    className="antialiased"
                    style={{
                      filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                    }}
                  />
                  <Image
                    src={"/images/logo/celer-app-text-dark.svg"}
                    alt="Logo"
                    width={200}
                    height={32}
                    style={{
                      filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.40))",
                    }}
                  />
                </div>
              </Fade>
            </div>
            {/* end logo */}

            <h1
              className="translate-x-25 animate-fade-right pt-8 text-left text-5xl font-bold text-snow opacity-0 2xsm:hidden md:block md:text-4xl lg:text-6xl"
              style={{
                filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.50))",
              }}
            >
              Sua solução <br /> one-stop-shop <br /> em precatórios
            </h1>
          </div>
        </div>

        {/* form */}
        <div className="w-full border-stroke bg-snow 2xsm:p-8 sm:px-8 sm:py-12.5 md:absolute md:left-1/2 md:top-1/2 md:w-3/4 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-md  xl:static xl:w-[35%] xl:translate-x-0 xl:translate-y-0">
          {/* Mobile visible logo */}
          <div className="block w-full xl:hidden xl:w-1/2">
            <Link
              className="mb-15 flex flex-col items-center justify-center"
              href="#"
            >
              <div className="bg flex flex-col items-center gap-3">
                <Image
                  src={"/images/logo/ativos_logo_at_default.png"}
                  alt="Logo"
                  width={90}
                  height={50}
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
          {/* End Mobile visible logo */}

          <Fade delay={1e2} damping={1e-1} cascade triggerOnce>
            <h2 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2">
              Acesse sua conta
            </h2>
          </Fade>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label
                className="mb-2.5 block font-medium text-black"
                htmlFor="usuario"
              >
                Usuário
              </label>
              <div className="relative">
                <input
                  id="usuario"
                  type="text"
                  placeholder="Digite o usuário"
                  className={`${errors.username && "border-2 !border-rose-400 !ring-0"} w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none`}
                  {...register("username", {
                    required: "Campo obrigatório",
                  })}
                  aria-invalid={errors.username ? "true" : "false"}
                />
                <ErrorMessage errors={errors} field="username" />
                {/* {
                      errors.username && (
                        <span role="alert" className="absolute right-4 top-4 text-red pr-8 text-sm">
                          {errors.username.message}
                        </span>
                      )
                    } */}

                <span className="absolute right-4 top-2.5 h-[22px] w-[22px]">
                  <BiUser
                    style={{ width: "22px", height: "22px", fill: "#BAC1CB" }}
                  />
                </span>
              </div>
            </div>

            <div className="mb-10">
              <label
                className="mb-2.5 block font-medium text-black"
                htmlFor="senha"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={hide.password ? "password" : "text"}
                  placeholder="Digite a sua senha"
                  className={`${errors.password && "border-2 !border-rose-400 !ring-0"} w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none`}
                  {...register("password", {
                    required: "Campo obrigatório",
                  })}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <ErrorMessage errors={errors} field="password" />

                <span
                  className="absolute right-10 top-2.5 cursor-pointer"
                  onClick={() =>
                    setHide({
                      ...hide,
                      password: !hide.password,
                    })
                  }
                >
                  {!hide.password ? (
                    <BsEye
                      style={{ width: "22px", height: "22px", fill: "#BAC1CB" }}
                    />
                  ) : (
                    <BsEyeSlash
                      style={{ width: "22px", height: "22px", fill: "#BAC1CB" }}
                    />
                  )}
                </span>

                <span className="absolute right-4 top-2.5">
                  <BiLockAlt
                    style={{ width: "22px", height: "22px", fill: "#BAC1CB" }}
                  />
                </span>
              </div>
            </div>

            <p
              onClick={() => setOpenModal(true)}
              className="mb-6 max-w-fit cursor-pointer text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              Esqueci a senha
            </p>

            <div className="mb-5">
              <Button
                type="submit"
                className="flex w-full items-center justify-center py-3 transition-all duration-200"
              >
                <span
                  className="text-[16px] font-medium"
                  aria-disabled={loading}
                >
                  {loading ? "Fazendo login..." : "Acessar"}
                </span>
                {!loading ? (
                  <HiOutlineArrowRight className="ml-2 mt-[0.2rem] h-4 w-4" />
                ) : (
                  <AiOutlineLoading className="ml-2 mt-[0.2rem] h-4 w-4 animate-spin" />
                )}
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

            {/* <button data-tooltip-target="tooltip-default" disabled className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 hover:bg-opacity-50 disabled:cursor-not-allowed disabled:opacity-50">
                    <span>
                      <FcGoogle style={{ width: '22px', height: '22p' }} />
                    </span>
                    Login com o Google
                  </button> */}

            <div className="mt-6 text-center 2xsm:text-sm xsm:text-base">
              <p className="text-body">
                Ainda não possui uma conta?{" "}
                <Link
                  aria-disabled
                  href="/auth/signup"
                  className="font-medium text-blue-700 hover:text-blue-800"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </form>
        </div>
        <ForgotPassword state={openModal} setState={setOpenModal} />
      </div>
    </UnloggedLayout>
  );
};

export default SignIn;
