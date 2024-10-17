"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import InputMask from 'react-input-mask';
import api from "@/utils/api";
import { APP_ROUTES } from "@/constants/app-routes";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/constants";
import UseMySwal from "@/hooks/useMySwal";
import { BiEnvelope, BiUser, BiLockAlt, BiIdCard, BiInfoCircle, BiX, BiCheck, BiQuestionMark } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { Popover } from "flowbite-react";



import { Metadata } from "next";
import UnloggedLayout from "@/components/Layouts/UnloggedLayout";
import { ErrorMessage } from "@/components/ErrorMessage/ErrorMessage";
import { HiOutlineArrowRight } from "react-icons/hi";
import { AiOutlineLoading } from "react-icons/ai";
import usePassword from "@/hooks/usePassword";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Terms from "@/components/Modals/Terms_and_Conditions";
import CustomCheckbox from "@/components/CrmUi/Checkbox";
import { Fade } from "react-awesome-reveal";
import { Button } from "@/components/Button";

export type SignUpInputs = {
  username: string;
  email: string;
  select: string;
  cpf_cnpj: string;
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
  const passwordInput = watch('password');
  const confirmPasswordInput = watch('confirm_password');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const { loading, setLoading, passwordsMatch, passwordStr, strengthColor, barWidth, passwordRequirements, hide, setHide } = usePassword(passwordInput, confirmPasswordInput);

  const MySwal = UseMySwal();
  const selectOption = watch('select');

  const onSubmit: SubmitHandler<SignUpInputs> = async (data) => {
    setLoading(true);
    if (data.password === data.confirm_password && passwordRequirements.filled) {

      const formData = {
        username: data.username,
        email: data.email,
        password: data.password,
        cpf_cnpj: data.cpf_cnpj
      }

      try {
        const response = await api.post("api/user/register/", formData).then((res) => {
          if (res.status === 201) {
            localStorage.setItem(`ATIVOS_${ACCESS_TOKEN}`, res.data.accessToken);
            localStorage.setItem(`ATIVOS_${REFRESH_TOKEN}`, res.data.refreshToken);
            MySwal.fire({
              title: "Sucesso!",
              text: "Cadastro realizado com sucesso! Em até 5 minutos, um e-mail de confirmação será enviado para o e-mail cadastrado.",
              icon: "success",
              showConfirmButton: true,
              confirmButtonColor: '#1A56DB',
              confirmButtonText: 'Voltar para Login',
            }).then((result) => {
              if (result.isConfirmed) {
                router.push(APP_ROUTES.public.login.name);
              }
            });
          }
        })
      } catch (error) {
        MySwal.fire({
          title: "Ok, Houston...Temos um problema!",
          text: "Email ou usuário já cadastrado. Por favor, tente novamente com outras credenciais.",
          icon: "error",
          showConfirmButton: true,
        })
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

    const localAccess = localStorage.getItem('ATIVOS_access');
    const localRefresh = localStorage.getItem('ATIVOS_refresh');

    if (localAccess === 'undefined' || localRefresh === 'undefined') {
      localStorage.removeItem('ATIVOS_access');
      localStorage.removeItem('ATIVOS_refresh');
    }

  }, [])

  return (
    <UnloggedLayout>
      <div className="relative flex 3xl:max-h-[610px] h-full">
        <div className="w-full hidden py-8 px-20 flex-col text-center justify-evenly hero_login md:min-h-[900px] md:flex xl:w-[65%] xl:min-h-full">
          <div className="2xsm:hidden xl:block">
            {/* logo */}
            <div className="mb-10 flex flex-col justify-center items-center relative">
              <Fade triggerOnce>
                <div className="flex flex-col items-center gap-3">
                  <Image
                    src={"/images/logo/celer-app-logo-dark.svg"}
                    alt="Logo"
                    width={160}
                    height={32}
                    className="antialiased"
                    style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
                  />
                  <Image
                    src={"/images/logo/celer-app-text-dark.svg"}
                    alt="Logo"
                    width={200}
                    height={32}
                    style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.40))' }}

                  />
                </div>
              </Fade>
            </div>
            {/* end logo */}

            <h1 className="text-left translate-x-25 animate-fade-right pt-8 text-5xl font-bold text-snow opacity-0 2xsm:hidden md:block md:text-4xl lg:text-6xl" style={{
              filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.50))',
            }}>
              Sua solução <br /> one-stop-shop <br /> em precatórios
            </h1>
          </div>
        </div>

        {/* form */}
        <div className="w-full border-stroke bg-snow sm:py-12.5 sm:px-8 2xsm:p-8 md:top-1/2 md:-translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:w-3/4 md:absolute md:rounded-md md:h-fit lg:h-fit lg:max-h-[850px] xl:w-[35%] xl:h-full lg:overflow-y-scroll xl:static xl:translate-y-0 xl:translate-x-0 xl:py-5.5">
          {/* Mobile visible logo */}
          <div className="block w-full xl:hidden">
            <Link className="flex flex-col justify-center items-center mb-8" href="#">
              <div className="flex flex-col items-center gap-3 bg">
                <Image
                  src={"/images/logo/celer-app-logo.svg"}
                  alt="Logo"
                  width={0}
                  height={0}
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
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Cadastre-se para começar
            </h2>
          </Fade>

          <form className="grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Nome de usuário
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Usuário"
                  className={`${errors.username && '!border-rose-400 !ring-0 border-2 dark:!border-meta-1'} text-sm w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary`}
                  id="username"
                  {
                  ...register("username", {
                    required: "Campo obrigatório",
                    minLength: {
                      value: 4,
                      message: "O nome deve conter no mínimo 4 caracteres",
                    },
                    maxLength: {
                      value: 30,
                      message: "O nome deve conter no máximo 30 caracteres"
                    },
                    pattern: {
                      value: /^[a-zA-Z]+$/, // Regex para permitir apenas letras (maiúsculas e minúsculas)
                      message: "O nome deve conter apenas letras e não deve ter espaços ou caracteres especiais"
                    }
                  })
                  }
                />

                <ErrorMessage errors={errors} field='username' />

                <span className="absolute right-4 top-2.5">
                  <BiUser style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} />
                </span>
              </div>
            </div>

            <div className="mb-2">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Digite seu email"
                  className={`${errors.email && '!border-rose-400 !ring-0 border-2 dark:!border-meta-1'} text-sm w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary`}
                  id="email"
                  {
                  ...register("email", {
                    required: "Campo obrigatório",
                  })
                  }
                />

                <ErrorMessage errors={errors} field='email' />

                <span className="absolute right-4 top-2.5">
                  <BiEnvelope style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} />
                </span>
              </div>
            </div>

            {/* cpf/cnpj field */}
            <div className="mb-3 sm:col-span-2">
              <label className="mb-1 block font-medium text-black dark:text-white">
                Selecione uma opção abaixo:
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  id='select'
                  className={`w-full sm:w-1/4 rounded-lg border border-stroke bg-transparent text-sm py-2 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary`}
                  {
                  ...register("select", {
                    required: "Campo obrigatório"
                  })
                  }
                  defaultValue={"CPF"}
                >
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                </select>

                <div className="relative flex-1">
                  {selectOption === 'CNPJ' ? (
                    <React.Fragment>
                      <Controller
                        name="cpf_cnpj"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Campo obrigatório",
                          pattern: {
                            value: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                            message: "CNPJ inválido"
                          }
                        }}
                        render={({ field }) => (
                          <InputMask
                            {...field}
                            mask="99.999.999/9999-99"
                            placeholder="Digite seu CNPJ"
                            className={`${errors.cpf_cnpj && '!border-rose-400 !ring-0 border-2 dark:!border-meta-1'} text-sm w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary`}
                          />
                        )}
                      />

                      <ErrorMessage errors={errors} field='cpf_cnpj' />
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
                            message: "CPF inválido"
                          }
                        }}
                        render={({ field }) => (
                          <InputMask
                            {...field}
                            mask="999.999.999-99"
                            placeholder="Digite seu CPF"
                            className={`${errors.cpf_cnpj && '!border-rose-400 !ring-0 border-2 dark:!border-meta-1'} text-sm w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary`}
                          />
                        )}
                      />

                      <ErrorMessage errors={errors} field='cpf_cnpj' />
                    </React.Fragment>
                  )}


                  <span className="absolute right-4 top-2.5">
                    <BiIdCard style={{ width: '22px', height: '22px', fill: 'rgb(186, 193, 203)' }} />
                  </span>
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
                        <h3 id="default-popover" className="font-semibold text-gray-900 dark:text-white">A senha deve conter:</h3>
                      </div>
                      <div className="px-3 py-2 flex flex-col gap-2 dark:text-white dark:bg-boxdark">
                        <div className="flex items-center gap-2">
                          {passwordRequirements.minLength ?
                            <BiCheck className="w-6 h-6 fill-meta-3" /> :
                            <BiX className="w-6 h-6 fill-meta-1" />}
                          <span className="text-slate-500">No mínimo 6 caracteres</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordRequirements.lowercase ?
                            <BiCheck className="w-6 h-6 fill-meta-3" /> :
                            <BiX className="w-6 h-6 fill-meta-1" />}
                          <span className="text-slate-500">Uma letra minúscula</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordRequirements.uppercase ?
                            <BiCheck className="w-6 h-6 fill-meta-3" /> :
                            <BiX className="w-6 h-6 fill-meta-1" />}
                          <span className="text-slate-500">Uma letra maiúscula</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordRequirements.number ?
                            <BiCheck className="w-6 h-6 fill-meta-3" /> :
                            <BiX className="w-6 h-6 fill-meta-1" />}
                          <span className="text-slate-500">Um número</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordRequirements.specialCharacter ?
                            <BiCheck className="w-6 h-6 fill-meta-3" /> :
                            <BiX className="w-6 h-6 fill-meta-1" />}
                          <span className="text-slate-500">Um caractere especial <br /> (ex: @, $, !, %, *, #, ?, &)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordRequirements.veryStrong ?
                            <BiCheck className="w-6 h-6 fill-meta-3" /> :
                            <BiQuestionMark className="w-6 h-6 fill-meta-6" />}
                          <span className="text-slate-500 text-xs">Mínimo de 12 caracteres para <br /> senha mais forte (opcional)</span>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <button type="button" className="relative">
                    {!passwordRequirements.filled && <span className="absolute z-0 inline-flex h-full w-full top-0 left-0 animate-ping rounded-full bg-meta-1 opacity-75"></span>}

                    <BiInfoCircle className={`${!passwordRequirements.filled && 'text-meta-1'} text-black dark:text-white h-3.5 w-3.5 cursor-pointer`} />
                  </button>
                </Popover>
                {/* end popover for password hint */}
              </label>

              <div className="relative">
                <input
                  minLength={6}
                  maxLength={30}
                  type={hide.password ? 'password' : 'text'}
                  placeholder="Digite a senha"
                  className={`${errors.password && '!border-rose-400 !ring-0 border-2 dark:!border-meta-1'} text-sm w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:text-white dark:focus:border-primary`}
                  id="password"
                  {
                  ...register("password", {
                    required: "Campo obrigatório",
                    minLength: {
                      value: 6,
                      message: "Mínimo de 6 caracteres",
                    },
                    maxLength: {
                      value: 30,
                      message: "Máximo de 30 caracteres"
                    },
                    // pattern: {
                    //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
                    //   message: "Mínimo de 6 caracteres, 1 letra (maiúscula e minúscula), 1 número e 1 caractere especial",
                    // }
                  })
                  }
                />
                {passwordInput?.length <= 0 && <ErrorMessage errors={errors} field='password' />}

                {/* password strength message */}
                {passwordInput && (
                  <div className="absolute w-full left-0 top-17 text-sm text-slate-400 flex flex-col gap-1">
                    <div className="w-full h-2 border-none rounded">
                      <div style={{
                        backgroundColor: `${strengthColor}`,
                        width: `${barWidth}`
                      }} className={`h-full rounded transition-all duration-300`}></div>
                    </div>
                    <div>
                      Força da senha: <span style={{ color: `${strengthColor}` }}>{passwordStr}</span>
                    </div>
                  </div>
                )}

                <span className='absolute top-2.5 right-10 cursor-pointer'
                  onClick={() => setHide({
                    ...hide,
                    password: !hide.password
                  })}
                >
                  {hide.password ? <BsEyeSlash style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} /> : <BsEye style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} />}
                </span>

                <span className="absolute right-4 top-2.5">
                  <BiLockAlt style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} />
                </span>
              </div>
            </div>

            <div className="mb-2">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  minLength={6}
                  maxLength={30}
                  type={hide.confirmPassword ? 'password' : 'text'}
                  placeholder="Confirme sua senha"
                  className={`${errors.confirm_password && '!border-rose-400 !ring-0 border-2 dark:!border-meta-1'} text-sm w-full rounded-lg border border-stroke bg-transparent py-2 pl-4 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
                  {
                  ...register("confirm_password", {
                    required: "Confirme a sua senha",
                  })
                  }
                />

                {!passwordsMatch && (
                  <div className="absolute text-red dark:text-meta-1 w-full left-0 top-17 text-sm flex flex-col gap-1">
                    As senhas não conferem.
                  </div>
                )}

                {passwordsMatch && <ErrorMessage errors={errors} field='confirm_password' />}

                <span className='absolute top-2.5 right-10 cursor-pointer'
                  onClick={() => setHide({
                    ...hide,
                    confirmPassword: !hide.confirmPassword
                  })}
                >
                  {hide.confirmPassword ? <BsEyeSlash style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} /> : <BsEye style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} />}
                </span>

                <span className="absolute right-4 top-2.5">
                  <BiLockAlt style={{ width: '22px', height: '22px', fill: '#BAC1CB' }} />
                </span>
              </div>
            </div>

            <div className="mt-4 text-sm sm:col-span-2 flex gap-2 items-center">
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
              <p>
                Aceitar nossos <span onClick={() => setOpenModal(true)} className="text-blue-700 hover:underline cursor-pointer dark:text-blue-400">
                  termos e condições</span>
              </p>
            </div>

            <div className="mb-2 sm:col-span-2">
              <Button type="submit" disabled={!termsAccepted} className="w-full py-3 flex items-center justify-center bg-blue-700 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-700 transition-all duration-200">
                <span className="text-[16px] font-medium" aria-disabled={loading}>
                  {loading ? "Cadastrando usuário..." : "Criar conta"}
                </span>
                {
                  !loading ? (<HiOutlineArrowRight className="mt-[0.2rem] ml-2 h-4 w-4" />) : (<AiOutlineLoading className="mt-[0.2rem] ml-2 h-4 w-4 animate-spin" />)
                }
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

            {/* <button disabled className="flex w-full items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray p-4 sm:col-span-2 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50 disabled:opacity-50 cursor-not-allowed">

                    <span>
                      <FcGoogle style={{ width: '22px', height: '22px' }} />
                    </span>
                    Entrar com o Google
                  </button> */}

            <div className=" text-center sm:col-span-2 text-sm">
              <p>
                Já tem uma conta?{" "}
                <Link href="/auth/signin" className="text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-500">
                  Conecte-se
                </Link>
              </p>
            </div>
          </form>
        </div>
          <Terms state={openModal} setState={setOpenModal} />
      </div>
    </UnloggedLayout>
  );
};

export default SignUp;
