"use client"
import React, { useState } from "react";
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

const TwoStepVerification: React.FC = () => {

  const [colorMode, setColorMode] = useColorMode();
  const [value, setValue] = useState("");

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
                    Digite os 4 digitos enviados para o seu e-mail cadastrado
                  </p>

                  <form>
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

                    <Button className="flex w-full justify-center rounded-md bg-blue-700 hover:bg-blue-800 p-[13px] font-bold text-snow">
                      Confirmar
                    </Button>

                    <span className="mt-5 block text-red text-sm">
                      Não compartile seu código com ninguém!
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
