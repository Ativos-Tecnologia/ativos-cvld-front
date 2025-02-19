"use client"
import React, { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import UnloggedLayout from "@/components/Layouts/UnloggedLayout";
import useColorMode from "@/hooks/useColorMode";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button";
import api from "@/utils/api";
import { APP_ROUTES } from "@/constants/app-routes";
import { useRouter } from "next/navigation";
import UseMySwal from "@/hooks/useMySwal";
import { SweetAlertResult } from "sweetalert2";

const TwoStepVerification: React.FC = () => {

  const router = useRouter();
  const MySwal = UseMySwal();
  const [colorMode, setColorMode] = useColorMode();
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [value, setValue] = useState("");

  const submitData = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsValidating(true);
    try {
      
      const response = await api.post('/api/confirm-user', {
        "confirmation_code": value
      })

      if (response.status === 200) {
        MySwal.fire({
          icon: "success",
          title: "Tudo certo",
          text: "A sua conta foi confirmada! Agora você já pode usar o nosso sistema.",
          showConfirmButton: true,
          confirmButtonText: "Ir para LogIn",
          confirmButtonColor: "#1A56DB",
        }).then((result: SweetAlertResult<any>) => {
          if (result.isConfirmed) {
            router.push(APP_ROUTES.public.login.name)
          }
        });
      } else {
        MySwal.fire({
          icon: "error",
          title: "Oops!",
          text: "Parece que houve um problema ao confirmar a sua conta, tente novamente.",
          showConfirmButton: true,
          confirmButtonColor: "#1A56DB",
        });
      }

    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "Oops!",
        text: "Parece que houve um problema ao confirmar a sua conta, tente novamente.",
        showConfirmButton: true,
        confirmButtonColor: "#1A56DB",
      });
    } finally {
      setIsValidating(false);
    }
  }

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
      <div className="overflow-hidden px-4 dark:bg-boxdark-2 sm:px-8">
        <div className="flex h-screen flex-col items-center justify-center overflow-hidden">
          <div className="no-scrollbar overflow-y-auto py-20">
            <div className="mx-auto w-full max-w-[480px]">
              <div className="text-center">
                <Link href="/" className="mx-auto mb-10 inline-flex">
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
                </Link>

                <div className="rounded-xl bg-white p-4 shadow-14 dark:bg-boxdark lg:p-7.5 xl:p-12.5">
                  <h1 className="mb-2.5 text-3xl font-black leading-[48px] text-black-2 dark:text-white">
                    Confirme Sua Conta
                  </h1>

                  <p className="mb-7.5 font-medium">
                    Digite os 4 números enviados para o seu e-mail cadastrado
                  </p>

                  <form onSubmit={(e) => submitData(e)}>
                    <div className="flex items-center justify-center gap-4.5 mb-7.5">
                      <InputOTP
                        maxLength={4}
                        value={value}
                        onChange={(value) => setValue(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSeparator />
                          <InputOTPSlot index={1} />
                          <InputOTPSeparator />
                          <InputOTPSlot index={2} />
                          <InputOTPSeparator />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    <Button
                    className={`bg-blue-700 hover:bg-blue-800 flex w-full justify-center rounded-md p-[13px] font-bold text-snow transition-all duration-200`}>
                      {isValidating ? 'Validando código...' : 'Confirmar'}
                    </Button>

                    <span className="mt-5 block text-red text-sm">
                      Não compartilhe seu código com ninguém!
                    </span>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </UnloggedLayout >
  );
};

export default TwoStepVerification;
