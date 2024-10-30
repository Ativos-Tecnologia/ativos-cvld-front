"use client";
import { APP_ROUTES } from "@/constants/app-routes";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/constants";
import UseMySwal from "@/hooks/useMySwal";
import api from "@/utils/api";
import { Popover } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  BiCheck,
  BiEnvelope,
  BiIdCard,
  BiInfoCircle,
  BiLockAlt,
  BiLogoWhatsapp,
  BiQuestionMark,
  BiUser,
  BiX,
} from "react-icons/bi";
import InputMask from "react-input-mask";

import { Button } from "@/components/Button";
import CustomCheckbox from "@/components/CrmUi/Checkbox";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage";
import UnloggedLayout from "@/components/Layouts/UnloggedLayout";
import usePassword from "@/hooks/usePassword";
import { Fade } from "react-awesome-reveal";
import { AiOutlineLoading } from "react-icons/ai";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { HiOutlineArrowRight } from "react-icons/hi";

export type SignUpInputs = {
  username: string;
  email: string;
  select: string;
  cpf_cnpj: string;
  complete_name: string;
  nome_representante: string;
  cpf_representante: string;
  phone: string;
  banco: string;
  agencia: string;
  conta: string;
  pix: string;
  password: string;
  confirm_password: string;
};

const SignUp: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<SignUpInputs>();
  const passwordInput = watch("password");
  const confirmPasswordInput = watch("confirm_password");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const {
    loading,
    setLoading,
    passwordsMatch,
    passwordStr,
    strengthColor,
    barWidth,
    passwordRequirements,
    hide,
    setHide,
  } = usePassword(passwordInput, confirmPasswordInput);

  const MySwal = UseMySwal();
  const selectOption = watch("select");

  const onSubmit: SubmitHandler<SignUpInputs> = async (data) => {
    setLoading(true);
    if (
      data.password === data.confirm_password &&
      passwordRequirements.filled
    ) {
      const formData = {
        username: data.username,
        email: data.email,
        complete_name: data.complete_name,
        password: data.password,
        cpf_cnpj: data.cpf_cnpj,
        nome_representante: data.nome_representante,
        cpf_representante: data.cpf_representante,
        phone: data.phone,
        banco: data.banco,
        agencia: data.agencia,
        conta: data.conta,
        pix: data.pix,
      };

      try {
        const response = await api
          .post("api/user/register/", formData)
          .then((res) => {
            if (res.status === 201) {
              localStorage.setItem(
                `ATIVOS_${ACCESS_TOKEN}`,
                res.data.accessToken,
              );
              localStorage.setItem(
                `ATIVOS_${REFRESH_TOKEN}`,
                res.data.refreshToken,
              );
              MySwal.fire({
                title: "Sucesso!",
                text: "Cadastro realizado com sucesso! Em até 5 minutos, um e-mail de confirmação será enviado para o e-mail cadastrado.",
                icon: "success",
                showConfirmButton: true,
                confirmButtonColor: "#1A56DB",
                confirmButtonText: "Voltar para Login",
              }).then((result) => {
                if (result.isConfirmed) {
                  router.push(APP_ROUTES.public.login.name);
                }
              });
            }
          });
      } catch (error) {
        MySwal.fire({
          title: "Ok, Houston...Temos um problema!",
          text: "Email ou usuário já cadastrado. Por favor, tente novamente com outras credenciais.",
          icon: "error",
          showConfirmButton: true,
        });
        console.error(error);
      }
    } else if (data.password !== data.confirm_password) {
      MySwal.fire({
        title: "Ok, Houston...Temos um problema!",
        text: "Suas senhas não coincidem. Por favor, tente novamente.",
        icon: "error",
        showConfirmButton: true,
      });
    } else if (!passwordRequirements.filled) {
      MySwal.fire({
        title: "Ok, Houston...Temos um problema!",
        text: "Sua senha não corresponde aos requisitos mínimos. Por favor, tente novamente.",
        icon: "error",
        showConfirmButton: true,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    const localAccess = localStorage.getItem("ATIVOS_access");
    const localRefresh = localStorage.getItem("ATIVOS_refresh");

    if (localAccess === "undefined" || localRefresh === "undefined") {
      localStorage.removeItem("ATIVOS_access");
      localStorage.removeItem("ATIVOS_refresh");
    }
  }, []);

  return (
    <UnloggedLayout>
      <div className="relative flex h-full 3xl:max-h-[610px]">
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
        <div className="w-full border-stroke bg-snow 2xsm:p-8 sm:px-8 sm:py-12.5 md:absolute md:left-1/2 md:top-1/2 md:max-h-[850px] md:w-3/4 md:-translate-x-1/2 md:-translate-y-1/2 md:overflow-y-scroll md:rounded-tr-md md:rounded-br-md lg:h-fit lg:max-h-[850px] xl:static xl:h-full xl:w-[35%] xl:translate-x-0 xl:translate-y-0 xl:py-5.5 3xl:max-h-[610px] 3xl:overflow-y-scroll">
          {/* Mobile visible logo */}
          <div className="block w-full xl:hidden">
            <Link
              className="mb-8 flex flex-col items-center justify-center"
              href="#"
            >
              <div className="bg flex flex-col items-center gap-3">
                <Image
                  src={"/images/logo/ativos_logo_at_default.png"}
                  alt="Logo"
                  width={90}
                  height={50}
                  className="2xsm:w-20 md:w-28 lg:w-25"
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
              Cadastre-se para começar
            </h2>
          </Fade>

          <form
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-2">
              <label
                className="mb-2.5 block font-medium text-black"
                htmlFor="username"
              >
                Nome de usuário
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Usuário"
                  className={`${errors.username && "border-2 !border-rose-400 !ring-0"} w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none`}
                  id="username"
                  {...register("username", {
                    required: "Campo obrigatório",
                    minLength: {
                      value: 4,
                      message: "O nome deve conter no mínimo 4 caracteres",
                    },
                    maxLength: {
                      value: 30,
                      message: "O nome deve conter no máximo 30 caracteres",
                    },
                    pattern: {
                      value: /^[a-zA-Z]+$/, // Regex para permitir apenas letras (maiúsculas e minúsculas)
                      message:
                        "O nome deve conter apenas letras e não deve ter espaços ou caracteres especiais",
                    },
                  })}
                />

                <ErrorMessage errors={errors} field="username" />

                <span className="absolute right-4 top-2.5">
                  <BiUser
                    style={{ width: "22px", height: "22px", fill: "#BAC1CB" }}
                  />
                </span>
              </div>
            </div>

            <div className="mb-2">
              <label
                className="mb-2.5 block font-medium text-black"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Digite seu email"
                  className={`${errors.email && "border-2 !border-rose-400 !ring-0"} w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none`}
                  id="email"
                  {...register("email", {
                    required: "Campo obrigatório",
                  })}
                />

                <ErrorMessage errors={errors} field="email" />

                <span className="absolute right-4 top-2.5">
                  <BiEnvelope
                    style={{ width: "22px", height: "22px", fill: "#BAC1CB" }}
                  />
                </span>
              </div>
            </div>

            {/* Nome Completo */}
            <div className="mb-2 grid md:col-span-2">
              <label
                className="mb-2.5 block font-medium text-black"
                htmlFor="nome_completo"
              >
                Nome Completo
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nome Completo"
                  className={`${errors.complete_name && "border-2 !border-rose-400 !ring-0"} w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none`}
                  id="nome_completo"
                  {...register("complete_name", {
                    required: "Campo obrigatório",
                    minLength: {
                      value: 4,
                      message: "O nome deve conter no mínimo 4 caracteres",
                    },
                    maxLength: {
                      value: 30,
                      message: "O nome deve conter no máximo 30 caracteres",
                    },
                  })}
                />

                <ErrorMessage errors={errors} field="nome_completo" />

                <span className="absolute right-4 top-2.5">
                  <BiUser
                    style={{ width: "22px", height: "22px", fill: "#BAC1CB" }}
                  />
                </span>
              </div>
            </div>

            {/* cpf/cnpj field */}
            <div className="mb-3 sm:col-span-2">
              <label
                className="mb-1 block font-medium text-black"
                htmlFor="select"
              >
                Selecione uma opção abaixo:
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  id="select"
                  className={`w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none sm:w-1/4`}
                  {...register("select", {
                    required: "Campo obrigatório",
                  })}
                  defaultValue={"CPF"}
                >
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                </select>

                <div className="relative flex-1">
                  {selectOption === "CNPJ" ? (
                    <React.Fragment>
                      <Controller
                        name="cpf_cnpj"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Campo obrigatório",
                          pattern: {
                            value: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                            message: "CNPJ inválido",
                          },
                        }}
                        render={({ field }) => (
                          <InputMask
                            {...field}
                            mask="99.999.999/9999-99"
                            placeholder="Digite seu CNPJ"
                            className={`${errors.cpf_cnpj && "border-2 !border-rose-400 !ring-0"} w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none`}
                          />
                        )}
                      />

                      <ErrorMessage errors={errors} field="cpf_cnpj" />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Controller
                        name="cpf_cnpj"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Campo obrigatório",
                          pattern: {
                            value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                            message: "CPF inválido",
                          },
                        }}
                        render={({ field }) => (
                          <InputMask
                            {...field}
                            mask="999.999.999-99"
                            placeholder="Digite seu CPF"
                            className={`${errors.cpf_cnpj && "border-2 !border-rose-400 !ring-0"} w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none`}
                          />
                        )}
                      />

                      <ErrorMessage errors={errors} field="cpf_cnpj" />
                    </React.Fragment>
                  )}

                  <span className="absolute right-4 top-2.5">
                    <BiIdCard
                      style={{
                        width: "22px",
                        height: "22px",
                        fill: "rgb(186, 193, 203)",
                      }}
                    />
                  </span>
                </div>
              </div>
              {selectOption === "CNPJ" ? (
                <div className="grid grid-cols-2 gap-5">
                  <h3 className="col-span-2 mt-5 block text-center font-semibold uppercase text-black">
                    Dados do Representante Legal
                  </h3>
                  <div className="col-span-2 mb-2">
                    <label
                      className="mb-2.5 block font-medium text-black"
                      htmlFor="repre_name"
                    >
                      Nome Completo
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Nome Completo"
                        className={`${errors.nome_representante && "border-2 !border-rose-400 !ring-0"} w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none`}
                        id="repre_name"
                        {...register("nome_representante", {
                          required: "Campo obrigatório",
                          minLength: {
                            value: 4,
                            message:
                              "O nome deve conter no mínimo 4 caracteres",
                          },
                          maxLength: {
                            value: 30,
                            message:
                              "O nome deve conter no máximo 30 caracteres",
                          },
                          pattern: {
                            value: /^[a-zA-Z\s]+$/, // Regex para permitir apenas letras (maiúsculas e minúsculas) e espaços.
                            message:
                              "O nome deve conter apenas letras e não deve ter espaços ou caracteres especiais",
                          },
                        })}
                      />

                      <ErrorMessage errors={errors} field="repre_name" />

                      <span className="absolute right-4 top-2.5">
                        <BiIdCard
                          style={{
                            width: "22px",
                            height: "22px",
                            fill: "rgb(186, 193, 203)",
                          }}
                        />
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 mb-2 ">
                    <label
                      className="mb-2.5 block font-medium text-black"
                      htmlFor="CPF_Repre"
                    >
                      CPF
                    </label>
                    <div className="relative">
                      <Controller
                        name="cpf_representante"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Campo obrigatório",
                          pattern: {
                            value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                            message: "CPF inválido",
                          },
                        }}
                        render={({ field }) => (
                          <InputMask
                            {...field}
                            mask="999.999.999-99"
                            placeholder="Digite seu CPF"
                            className={`${errors.cpf_representante && "border-2 !border-rose-400 !ring-0"} md:text-base2xsm:text-sm w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none`}
                          />
                        )}
                      />

                      <ErrorMessage errors={errors} field="repre_cpf" />

                      <span className="absolute right-4 top-2.5">
                        <BiIdCard
                          style={{
                            width: "22px",
                            height: "22px",
                            fill: "rgb(186, 193, 203)",
                          }}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="w-full justify-center p-3 text-center text-sm text-amber-500 font-medium">
                Aviso: os dados bancários precisam ser da mesma titularidade
                do CPF/CNPJ cadastrado.
              </div>
              {/* Dados Bancários */}
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 ">
                {/* Banco */}
                <div className="mb-2 2xsm:col-span-2 md:col-span-1 ">
                  <label
                    className="mb-2.5 block font-medium text-black"
                    htmlFor="banco"
                  >
                    Banco
                  </label>
                  <div className="relative">
                    <Controller
                      name="banco"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Campo obrigatório",
                        pattern: {
                          value: /^\d{3}$/,
                          message: "Número inválido",
                        },
                      }}
                      render={({ field }) => (
                        <InputMask
                          {...field}
                          mask="999"
                          placeholder="Banco"
                          className={`${errors.banco && "border-2 !border-rose-400 !ring-0"} md:text-base2xsm:text-sm w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none`}
                        />
                      )}
                    />

                    <ErrorMessage errors={errors} field="banco" />

                    <span className="absolute right-4 top-2.5">
                      <BiIdCard
                        style={{
                          width: "22px",
                          height: "22px",
                          fill: "rgb(186, 193, 203)",
                        }}
                      />
                    </span>
                  </div>
                </div>
                {/* Agencia */}
                <div className="mb-2 2xsm:col-span-2 md:col-span-1 ">
                  <label
                    className="mb-2.5 block font-medium text-black"
                    htmlFor="agencia"
                  >
                    Agência
                  </label>
                  <div className="relative">
                    <Controller
                      name="agencia"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Campo obrigatório",
                        pattern: {
                          value: /^\d{4}-\d{1}$/,
                          message: "Número inválido",
                        },
                      }}
                      render={({ field }) => (
                        <InputMask
                          {...field}
                          mask="9999-9"
                          placeholder="Agência"
                          className={`${errors.agencia && "border-2 !border-rose-400 !ring-0"} md:text-base2xsm:text-sm w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none`}
                        />
                      )}
                    />

                    <ErrorMessage errors={errors} field="agencia" />

                    <span className="absolute right-4 top-2.5">
                      <BiIdCard
                        style={{
                          width: "22px",
                          height: "22px",
                          fill: "rgb(186, 193, 203)",
                        }}
                      />
                    </span>
                  </div>
                </div>

                {/* Conta Corrente */}
                <div className="mb-2 2xsm:col-span-2 md:col-span-1 ">
                  <label
                    className="mb-2.5 block font-medium text-black"
                    htmlFor="conta"
                  >
                    Conta Corrente
                  </label>
                  <div className="relative">
                    <Controller
                      name="conta"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Campo obrigatório",
                        pattern: {
                          value: /^\d{7}-\d{1}$/,
                          message: "Número inválido",
                        },
                      }}
                      render={({ field }) => (
                        <InputMask
                          {...field}
                          mask="9999999-9"
                          placeholder="Conta Corrente"
                          className={`${errors.conta && "border-2 !border-rose-400 !ring-0"} md:text-base2xsm:text-sm w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none`}
                        />
                      )}
                    />

                    <ErrorMessage errors={errors} field="conta_corrente" />

                    <span className="absolute right-4 top-2.5">
                      <BiIdCard
                        style={{
                          width: "22px",
                          height: "22px",
                          fill: "rgb(186, 193, 203)",
                        }}
                      />
                    </span>
                  </div>
                </div>
                {/* Pix */}
                <div className="mb-2 2xsm:col-span-2  md:col-span-1">
                  <label
                    className="mb-2.5 block font-medium text-black"
                    htmlFor="pix"
                  >
                    Pix
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Pix"
                      className={`${errors.pix && "border-2 !border-rose-400 !ring-0"} w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none`}
                      id="pix"
                      {...register("pix", {
                        required: "Campo obrigatório",
                      })}
                    />

                    <ErrorMessage errors={errors} field="repre_name" />

                    <span className="absolute right-4 top-2.5">
                      <BiIdCard
                        style={{
                          width: "22px",
                          height: "22px",
                          fill: "rgb(186, 193, 203)",
                        }}
                      />
                    </span>
                  </div>
                </div>
                <div className="col-span-2 mb-2 ">
                  <label
                    className="mb-2.5 block font-medium text-black"
                    htmlFor="phone"
                  >
                    Whatsapp
                  </label>
                  <div className="relative">
                    <Controller
                      name="phone"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Campo obrigatório",
                        pattern: {
                          value: /^\d{2}\.\d{5}-\d{4}$/,
                          message: "Número inválido",
                        },
                      }}
                      render={({ field }) => (
                        <InputMask
                          {...field}
                          mask="99.99999-9999"
                          placeholder="Whatsapp"
                          className={`${errors.phone && "border-2 !border-rose-400 !ring-0"} md:text-base2xsm:text-sm w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none`}
                        />
                      )}
                    />

                    <ErrorMessage errors={errors} field="whatsapp" />

                    <span className="absolute right-4 top-2.5">
                      <BiLogoWhatsapp
                        style={{
                          width: "22px",
                          height: "22px",
                          fill: "rgb(186, 193, 203)",
                        }}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="mb-2.5 flex items-center gap-3 font-medium">
                <span className="text-black dark:text-white">Senha</span>
                {/* popover for password hint */}
                <Popover
                  aria-labelledby="default-popover"
                  trigger="hover"
                  placement="right"
                  content={
                    <div className="w-64 text-sm">
                      <div className="border-b border-stroke bg-gray-100 px-3 py-2 dark:border-strokedark dark:bg-boxdark-2">
                        <h3
                          id="default-popover"
                          className="font-semibold text-gray-900 dark:text-white"
                        >
                          A senha deve conter:
                        </h3>
                      </div>
                      <div className="flex flex-col gap-2 px-3 py-2 dark:bg-boxdark dark:text-white">
                        <div className="flex items-center gap-2">
                          {passwordRequirements.minLength ? (
                            <BiCheck className="h-6 w-6 fill-meta-3" />
                          ) : (
                            <BiX className="h-6 w-6 fill-meta-1" />
                          )}
                          <span className="text-slate-500">
                            No mínimo 6 caracteres
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordRequirements.lowercase ? (
                            <BiCheck className="h-6 w-6 fill-meta-3" />
                          ) : (
                            <BiX className="h-6 w-6 fill-meta-1" />
                          )}
                          <span className="text-slate-500">
                            Uma letra minúscula
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordRequirements.uppercase ? (
                            <BiCheck className="h-6 w-6 fill-meta-3" />
                          ) : (
                            <BiX className="h-6 w-6 fill-meta-1" />
                          )}
                          <span className="text-slate-500">
                            Uma letra maiúscula
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordRequirements.number ? (
                            <BiCheck className="h-6 w-6 fill-meta-3" />
                          ) : (
                            <BiX className="h-6 w-6 fill-meta-1" />
                          )}
                          <span className="text-slate-500">Um número</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordRequirements.specialCharacter ? (
                            <BiCheck className="h-6 w-6 fill-meta-3" />
                          ) : (
                            <BiX className="h-6 w-6 fill-meta-1" />
                          )}
                          <span className="text-slate-500">
                            Um caractere especial <br /> (ex: @, $, !, %, *, #,
                            ?, &)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordRequirements.veryStrong ? (
                            <BiCheck className="h-6 w-6 fill-meta-3" />
                          ) : (
                            <BiQuestionMark className="h-6 w-6 fill-meta-6" />
                          )}
                          <span className="text-xs text-slate-500">
                            Mínimo de 12 caracteres para <br /> senha mais forte
                            (opcional)
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <button type="button" className="relative">
                    {!passwordRequirements.filled && (
                      <span className="absolute left-0 top-0 z-0 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
                    )}

                    <BiInfoCircle
                      className={`${!passwordRequirements.filled && "text-meta-1"} h-3.5 w-3.5 cursor-pointer text-black dark:text-white`}
                    />
                  </button>
                </Popover>
                {/* end popover for password hint */}
              </label>

              <div className="relative">
                <input
                  minLength={6}
                  maxLength={30}
                  type={hide.password ? "password" : "text"}
                  placeholder="Digite a senha"
                  className={`${errors.password && "border-2 !border-rose-400 !ring-0 dark:!border-meta-1"} w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary`}
                  id="password"
                  {...register("password", {
                    required: "Campo obrigatório",
                    minLength: {
                      value: 6,
                      message: "Mínimo de 6 caracteres",
                    },
                    maxLength: {
                      value: 30,
                      message: "Máximo de 30 caracteres",
                    },
                  })}
                />
                {passwordInput?.length <= 0 && (
                  <ErrorMessage errors={errors} field="password" />
                )}

                {/* password strength message */}
                {passwordInput && (
                  <div className="absolute left-0 top-17 flex w-full flex-col gap-1 text-sm text-slate-400">
                    <div className="h-2 w-full rounded border-none">
                      <div
                        style={{
                          backgroundColor: `${strengthColor}`,
                          width: `${barWidth}`,
                        }}
                        className={`h-full rounded transition-all duration-300`}
                      ></div>
                    </div>
                    <div>
                      Força da senha:{" "}
                      <span style={{ color: `${strengthColor}` }}>
                        {passwordStr}
                      </span>
                    </div>
                  </div>
                )}

                <span
                  className="absolute right-10 top-2.5 cursor-pointer"
                  onClick={() =>
                    setHide({
                      ...hide,
                      password: !hide.password,
                    })
                  }
                >
                  {hide.password ? (
                    <BsEyeSlash
                      style={{ width: "22px", height: "22px", fill: "#BAC1CB" }}
                    />
                  ) : (
                    <BsEye
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

            <div className="2xsm:mb-5 2xsm:mt-10 md:mb-3 md:mt-0">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  minLength={6}
                  maxLength={30}
                  type={hide.confirmPassword ? "password" : "text"}
                  placeholder="Confirme sua senha"
                  className={`${errors.confirm_password && "border-2 !border-rose-400 !ring-0 dark:!border-meta-1"} w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-sm text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                  {...register("confirm_password", {
                    required: "Confirme a sua senha",
                  })}
                />

                {!passwordsMatch && (
                  <div className="absolute left-0 flex w-full flex-col gap-1 text-sm text-red dark:text-meta-1 2xsm:top-12 md:top-17">
                    As senhas não conferem.
                  </div>
                )}

                {passwordsMatch && (
                  <ErrorMessage errors={errors} field="confirm_password" />
                )}

                <span
                  className="absolute right-10 top-2.5 cursor-pointer"
                  onClick={() =>
                    setHide({
                      ...hide,
                      confirmPassword: !hide.confirmPassword,
                    })
                  }
                >
                  {hide.confirmPassword ? (
                    <BsEyeSlash
                      style={{ width: "22px", height: "22px", fill: "#BAC1CB" }}
                    />
                  ) : (
                    <BsEye
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

            <div className="flex items-center gap-2 text-sm 2xsm:mt-4 sm:col-span-2 md:mt-15">
              <CustomCheckbox
                check={termsAccepted}
                callbackFunction={() => setTermsAccepted(!termsAccepted)}
              />
              {/* <input
                      type="checkbox"
                      name="terms"
                      id="terms"
                      style={{ width: '14px', height: '14px' }}
                      onChange={() => setTermsAccepted(!termsAccepted)}
                    /> */}
              <p className="text-body">
                Aceitar nossos{" "}
                <Link
                  href={"/termos-e-condicoes"}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="cursor-pointer text-blue-700 hover:underline"
                >
                  termos e condições
                </Link>
              </p>
            </div>

            <div className="mb-2 sm:col-span-2">
              <Button
                type="submit"
                disabled={!termsAccepted}
                className="flex w-full items-center justify-center bg-blue-700 py-3 text-white transition-all duration-200 hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-700"
              >
                <span
                  className="text-[16px] font-medium"
                  aria-disabled={loading}
                >
                  {loading ? "Cadastrando usuário..." : "Criar conta"}
                </span>
                {!loading ? (
                  <HiOutlineArrowRight className="ml-2 mt-[0.2rem] h-4 w-4" />
                ) : (
                  <AiOutlineLoading className="ml-2 mt-[0.2rem] h-4 w-4 animate-spin" />
                )}
              </Button>
              {/* <button disabled={!termsAccepted} type='submit' className='flex items-center justify-center w-full cursor-pointer rounded-lg p-6 text-white bg-blue-700 hover:bg-blue-800 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-700'>
                      <span className="text-[16px] font-medium" aria-disabled={loading}>
                        {loading ? "Cadastrando usuário..." : "Criar conta"}
                      </span>
                      {
                        !loading ? (<HiOutlineArrowRight className="mt-[0.2rem] ml-2 h-4 w-4" />) : (<AiOutlineLoading className="mt-[0.2rem] ml-2 h-4 w-4 animate-spin" />)
                      }
                    </button> */}
            </div>

            {/* <button disabled className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 sm:col-span-2 hover:bg-opacity-50 disabled:opacity-50 cursor-not-allowed">

                    <span>
                      <FcGoogle style={{ width: '22px', height: '22px' }} />
                    </span>
                    Entrar com o Google
                  </button> */}

            <div className=" text-center text-sm sm:col-span-2">
              <p className="text-body">
                Já tem uma conta?{" "}
                <Link
                  href="/auth/signin"
                  className="text-blue-700 hover:text-blue-800"
                >
                  Conecte-se
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </UnloggedLayout>
  );
};

export default SignUp;
