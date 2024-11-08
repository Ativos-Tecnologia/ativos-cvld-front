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
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);

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
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="relative flex font-nexa items-center justify-center overflow-hidden xl:min-h-screen">
        <main className="flex-1 overflow-hidden shadow-2 xl:h-screen 3xl:h-[700px] 3xl:max-w-[75%] 3xl:rounded-md">
          <Fade className="h-full">
            <div className="new_hero_login h-full overflow-hidden flex">

              {/* ornaments */}
              <div className="absolute z-2 inset-0 w-full h-full bg-cover bg-center">
                <Image
                  src={"/images/ornaments/vector-1.svg"}
                  alt="ornamento inferior direito de faixas azuis"
                  width={900}
                  height={200}
                  className="absolute bottom-0 right-0"
                />

                <Image
                  src={"/images/ornaments/vector-2.svg"}
                  alt="ornamento inferior direito de faixas azuis"
                  width={950}
                  height={200}
                  className="absolute -top-10 left-0"
                />
              </div>
              {/* end ornaments */}

              {/* other image */}
              <div className="new_hero_login_overlap z-3">
                {/* <Image
                src={"/images/hero_login_man_smiling.png"}
                alt="homem com celular sorrindo"
                width={1060}
                height={500}
              /> */}
              </div>

              {/* container */}
              <div className="relative z-[4] container-grid ml-50 w-115  3xl:ml-40">
                <Image
                  src="/images/logo/celer-app-text-dark.svg"
                  alt="logo da ativos"
                  width={300}
                  height={32}
                  className="self-end mb-5 mx-auto"
                />

                {showLoginForm ? (
                  <Fade>
                    <div className="p-5 bg-snow rounded-lg w-115 mt-5">
                      <h2 className="text-2xl font-semibold text-[#083b88] mb-6">Acesse sua conta</h2>
                      <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="relative mb-5">
                          <input
                            id="usuario"
                            type="text"
                            placeholder="Digite o usuário"
                            className={`${errors.username && "border-2 !border-rose-400 !ring-0"} w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none`}
                            {...register("username", {
                              required: "Campo obrigatório",
                            })}
                            aria-invalid={errors.username ? "true" : "false"}
                          />
                          {/* <ErrorMessage errors={errors} field="username" /> */}

                          {errors.username && <span className="absolute left-1 -bottom-4.5 text-red text-xs">Campo obrigatório</span>}

                          <span className="absolute right-4 top-2.5 h-[22px] w-[22px]">
                            <BiUser
                              style={{ width: "22px", height: "22px", fill: "#BAC1CB" }}
                            />
                          </span>
                        </div>


                        <div className="relative mb-5">
                          <input
                            id="senha"
                            type={hide.password ? "password" : "text"}
                            placeholder="Digite a sua senha"
                            className={`${errors.password && "border-2 !border-rose-400 !ring-0"} w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none`}
                            {...register("password", {
                              required: "Campo obrigatório",
                            })}
                            aria-invalid={errors.password ? "true" : "false"}
                          />
                          {/* <ErrorMessage errors={errors} field="password" /> */}

                          {errors.password && <span className="absolute left-1 -bottom-4.5 text-red text-xs">Campo obrigatório</span>}

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

                        <div className="flex gap-3 mb-4">

                          <Button
                            type="submit"
                            style={{
                              boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.35)"
                            }}
                            className="text-lg flex-1 tracking-widest uppercase flex gap-2 items-center justify-center">
                            {loading ? (
                              <>
                                <AiOutlineLoading className="animate-spin" />
                                <span>Entrando...</span>
                              </>
                            ) : "Acessar"}
                          </Button>

                          <Button
                            onClick={() => setOpenModal(true)}
                            variant="ghost"
                            className="text-[#0838bb]"
                          >
                            Esqueci a senha
                          </Button>

                        </div>

                        <div className="flex gap-2 items-center justify-center">

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
                  <div className="grid gap-10 self-start mt-10">
                    <h1
                      className="translate-x-25 animate-fade-right delay-500 text-left text-5xl font-bold text-snow opacity-0 2xsm:hidden md:block"
                      style={{
                        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.50))",
                      }}
                    >
                      Sua solução <br /> one-stop-shop <br /> em precatórios
                    </h1>

                    <button onClick={() => setShowLoginForm(true)} className="group text-2xl relative overflow-hidden w-fit cursor-pointer rounded-lg px-4 py-2 bg-blue-700">
                      <p
                        className="relative z-20 text-white"
                      >
                        Acesse sua conta
                      </p>
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-5 h-5 scale-0 bg-blue-800 rounded-full group-hover:scale-[20] transition-all duration-500 ease-in-out"></span>
                    </button>
                  </div>
                )}

                {/* footer */}
                <div className="flex flex-col gap-8 mt-5">

                  <Image
                    src={"/images/logo/new-logo-text-dark.svg"}
                    alt={"logo da ativos (texto)"}
                    width={100}
                    height={50}
                  />

                  <ul className="flex flex-wrap max-w-[362px] text-sm font text-snow gap-5">
                    <li>
                      <Link href={"#"}>
                        Lead Magnet
                      </Link>
                    </li>
                    <li>
                      <Link href={"#"}>
                        Recalculador do TRF1
                      </Link>
                    </li>
                    <li>
                      <Link href={"#"}>
                        Política de Privacidade
                      </Link>
                    </li>
                    <li>
                      <Link href={"#"}>
                        Termos e Condições
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              {/* end container */}

            </div>
          </Fade>
          {/* {(window.location.pathname === "/auth/signin" ||
            window.location.pathname === "/auth/signup" ||
            window.location.pathname === "/auth/signup/wallet") && (
            <LiteFooter />
          )} */}
        </main>
        <ForgotPassword state={openModal} setState={setOpenModal} />
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
};

export default SignIn;
