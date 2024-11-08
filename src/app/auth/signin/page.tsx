"use client";
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

import { Button } from "@/components/Button";
import ForgotPassword from "@/components/Modals/ForgotPassword";
import usePassword from "@/hooks/usePassword";
import { useQueryClient } from "@tanstack/react-query";
import { AiOutlineLoading } from "react-icons/ai";
import { BiLockAlt, BiUser, BiX } from "react-icons/bi";
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
      throw new Error(
        `Erro ao tentar verificar aprovação do usuário ${console.error(e)}`,
      );
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
        } else if (userProduct === "wallet" && userApprovation === false) {
          router.push(APP_ROUTES.private.marketplace.name);
        } else if (userProduct === "crm") {
          router.push(APP_ROUTES.private.broker.name);
        } else {
          router.push(APP_ROUTES.private.dashboard.name);
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
      <div className="relative flex items-center justify-center overflow-hidden font-nexa xl:min-h-screen">
        <main className="flex-1 overflow-hidden shadow-2 h-screen 3xl:h-[700px] 3xl:max-w-[75%] 3xl:rounded-md">
          <Fade className="h-full">
            <div className="new_hero_login flex h-full w-full overflow-hidden">
              {/* ornaments */}
              <div className="absolute inset-0 z-2 h-full w-full bg-cover bg-center">
                <Image
                  src={"/images/ornaments/vector-1.svg"}
                  alt="ornamento inferior direito de faixas azuis"
                  width={900}
                  height={200}
                  className="absolute 2xsm:bottom-0 2xsm:-right-5 2xsm:opacity-30 md:w-[700px] md:right-10 md:-bottom-5 lg:opacity-100 lg:bottom-0 lg:-right-10 xl:w-[900px]"
                />

                <Image
                  src={"/images/ornaments/vector-2.svg"}
                  alt="ornamento superior esquerdo gradiente azul"
                  width={950}
                  height={200}
                  className="absolute 2xsm:h-[200px] 2xsm:-top-10 2xsm:-left-12 md:h-fit md:-top-10 md:-left-15 md:w-[620px] lg:w-[750px] lg:-top-10 lg:left-0 xl:w-[950px] xl:-left-5"
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
              <div className="container-grid min-h-screen relative z-[4] 2xsm:w-full 2xsm:p-3 md:p-0 md:w-115 md:ml-10 lg:ml-20 xl:ml-50 3xl:ml-40">
                <Image
                  src="/images/logo/celer-app-text-dark.svg"
                  alt="logo da ativos"
                  width={300}
                  height={32}
                  draggable={false}
                  className="self-end 2xsm:w-[150px] 2xsm:mb-5 2xsm:ml-5 md:w-[230px] md:mb-0 md:mx-15 lg:w-[280px] lg:mx-auto lg:mb-2 xl:mb-5 xl:w-[300px]"
                />

                {showLoginForm ? (
                  <Fade className="self-center">
                    <div className="rounded-lg bg-snow p-5 2xsm:w-94 2xsm:mx-auto 2xsm:mb-5 md:mb-0 md:mx-0 md:w-100 md:mt-8 lg:w-115 lg:mt-5">
                      <div className="flex items-center justify-between rounded-lg mb-6">
                        <h2 className="text-2xl font-semibold text-[#083b88]">
                          Acesse sua conta
                        </h2>
                        <button className="group flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:bg-slate-700">
                          <BiX
                            className="text-2xl transition-colors duration-300 group-hover:text-white"
                            onClick={() => setShowLoginForm(false)}
                          />
                        </button>
                      </div>
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

                          {errors.username && (
                            <span className="absolute -bottom-4.5 left-1 text-xs text-red">
                              Campo obrigatório
                            </span>
                          )}

                          <span className="absolute right-4 top-2.5 h-[22px] w-[22px]">
                            <BiUser
                              style={{
                                width: "22px",
                                height: "22px",
                                fill: "#BAC1CB",
                              }}
                            />
                          </span>
                        </div>

                        <div className="relative mb-7">
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
                                  width: "22px",
                                  height: "22px",
                                  fill: "#BAC1CB",
                                }}
                              />
                            ) : (
                              <BsEyeSlash
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  fill: "#BAC1CB",
                                }}
                              />
                            )}
                          </span>

                          <span className="absolute right-4 top-2.5">
                            <BiLockAlt
                              style={{
                                width: "22px",
                                height: "22px",
                                fill: "#BAC1CB",
                              }}
                            />
                          </span>
                        </div>

                        <div className="flex flex-col items-center justify-center md:flex-row gap-3 mb-5">
                          <Button
                            type="submit"
                            style={{
                              boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.35)",
                            }}
                            className="flex flex-1 items-center justify-center w-full gap-2 text-lg uppercase tracking-widest"
                          >
                            {loading ? (
                              <>
                                <AiOutlineLoading className="animate-spin" />
                                <span>Entrando...</span>
                              </>
                            ) : (
                              "Acessar"
                            )}
                          </Button>

                          <Button
                            onClick={() => setOpenModal(true)}
                            variant="ghost"
                            className="text-[#0838bb]"
                          >
                            Esqueci a senha
                          </Button>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-[13px] md:text-sm">
                          <p>Ainda não possui conta?</p>

                          <Link href="/auth/signup" className="text-[#0838bb]">
                            Crie uma conta agora
                          </Link>
                        </div>
                      </form>
                    </div>
                  </Fade>
                ) : (
                  <div className="flex flex-col 2xsm:gap-15 md:mt-10 md:gap-10 self-center">
                    <h1
                      className="translate-x-25 animate-fade-right text-left font-bold text-snow opacity-0 delay-300 2xsm:text-4xl md:text-5xl"
                      style={{
                        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.50))",
                      }}
                    >
                      Sua solução <br /> one-stop-shop <br /> em precatórios
                    </h1>

                    <button
                      onClick={() => setShowLoginForm(true)}
                      className="group relative animate-fade-right opacity-0 delay-700 w-fit cursor-pointer overflow-hidden rounded-lg bg-blue-700 px-4 py-2 text-xl md:text-2xl"
                    >
                      <p className="relative z-20 text-white">
                        Acesse sua conta
                      </p>
                      <span className="absolute left-1/2 top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-blue-800 transition-all duration-500 ease-in-out group-hover:scale-[20]"></span>
                    </button>
                  </div>
                )}

                {/* footer */}
                <div className="flex flex-col 2xsm:justify-end 2xsm:gap-8 md:gap-5 md:mt-7 xl:gap-8">
                  <Image
                    src={"/images/logo/new-logo-text-dark.svg"}
                    alt={"logo da ativos (texto)"}
                    width={100}
                    height={50}
                    draggable={false}
                    className="2xsm:w-[90px] md:w-25"
                  />

                  <ul className="font grid gap-x-5 gap-y-2 max-w-[362px] text-sm text-snow 2xsm:grid-cols-2 md:grid-cols-2 xl:gap-y-5">
                    <li className="col-span-1">
                      <Link
                        target="_blank"
                        href={"/automated-proposal"}
                        className="group relative transition-colors duration-200 hover:text-bodydark1"
                      >
                        Lead Magnet
                        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-snow transition-all duration-300 ease-in-out group-hover:w-full" />
                      </Link>
                    </li>
                    <li className="col-span-1">
                      <Link
                        target="_blank"
                        href={"/retification"}
                        className="group relative transition-colors duration-200 hover:text-bodydark1"
                      >
                        Recalculador do TRF1
                        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-snow transition-all duration-300 ease-in-out group-hover:w-full" />
                      </Link>
                    </li>
                    <li className="col-span-1">
                      <Link
                        target="_blank"
                        href={"/politica-de-privacidade"}
                        className="group relative transition-colors duration-200 hover:text-bodydark1"
                      >
                        Política de Privacidade
                        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-snow transition-all duration-300 ease-in-out group-hover:w-full" />
                      </Link>
                    </li>
                    <li className="col-span-1">
                      <Link
                        target="_blank"
                        href={"/termos-e-condicoes"}
                        className="group relative transition-colors duration-200 hover:text-bodydark1"
                      >
                        Termos e Condições
                        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-snow transition-all duration-300 ease-in-out group-hover:w-full" />
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
