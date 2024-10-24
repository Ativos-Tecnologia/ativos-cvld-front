"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface IUnloggedHeaderProps {
  logoPath: string;
  theme?: "light" | "dark";
}

const themeClasses = {

}

const UnloggedHeader = ({ logoPath, theme }: IUnloggedHeaderProps) => {

  const [isHeaderFixed, setIsHeaderFixed] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      const isFixedPosition = scrollPosition > windowHeight ? true : false;
      setIsHeaderFixed(isFixedPosition);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  })

  return (
    <>
      {/* ----> headers <---- */}

      <div className={`fixed z-10 ${isHeaderFixed ? "translate-y-full" : "-translate-y-full"} -top-11 left-1/2 -translate-x-1/2 rounded-full bg-gray-400 bg-opacity-10 bg-clip-padding backdrop-blur-sm backdrop-filter 2xsm:w-11/12 xl:w-4/5 3xl:w-3/5 py-3 px-5 flex items-center justify-between transition-all duration-500`}>
        <Link
          href="/auth/signin"
          className="overflow-hidden">
          {/* desktop */}
          <Image
            src={logoPath}
            // src={"/images/logo/new-logo-text-dark.png"}
            alt="logo do header"
            width={100}
            height={100}
          />
        </Link>
        <nav className="hidden items-center font-nexa text-snow sm:flex sm:gap-5 xl:gap-10">
          <Link
            href={"/auth/signup/wallet"}
            className="relative group hover:text-bodydark1 transition-colors duration-200"
          >
            <span>Investir</span>
            <span className="hidden lg:inline"> em Precatórios</span>
            <span
              className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 ease-in-out group-hover:w-full"
            />
          </Link>
          <Link
            href={"/auth/signup"}
            className="relative group hover:text-bodydark1 transition-colors duration-200"
          >
            <span>Seja Broker</span>
            <span
              className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 ease-in-out group-hover:w-full"
            />
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/signin/"
            className="transition-translate rounded-full  p-2 font-semibold text-blue-400 duration-300 hover:text-blue-500"
          >
            <span>Entrar</span>
          </Link>
          <Link
            href="/auth/signup/"
            className="rounded-full bg-blue-500 p-2 font-semibold text-snow transition-all duration-300 hover:bg-blue-600"
          >
            <span>Cadastrar</span>
          </Link>
        </div>
      </div>

      <div className={`absolute z-10 top-5 left-1/2 -translate-x-1/2 rounded-full bg-gray-400 bg-opacity-10 bg-clip-padding backdrop-blur-sm backdrop-filter 2xsm:w-11/12 xl:w-4/5 3xl:w-3/5 py-3 px-5 flex items-center justify-between transition-all duration-200`}>
        <Link
          href="/auth/signin"
          className="overflow-hidden">
          {/* desktop */}
          <Image
            src={"/images/logo/new-logo-text-dark.png"}
            alt="teste"
            width={100}
            height={100}
          />
        </Link>
        <nav className="hidden items-center text-snow sm:flex sm:gap-5 xl:gap-10">
          {/* <Link
                                href={"/"}
                                className="relative group hover:text-bodydark1 transition-colors duration-200"
                            >
                                <span>Vender Precatório</span>
                                <span
                                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 ease-in-out group-hover:w-full"
                                />
                            </Link> */}
          <Link
            href={"/auth/signup/wallet"}
            className="relative group hover:text-bodydark1 transition-colors duration-200"
          >
            <span>Investir</span>
            <span className="hidden lg:inline"> em Precatórios</span>
            <span
              className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 ease-in-out group-hover:w-full"
            />
          </Link>
          <Link
            href={"/auth/signup"}
            className="relative group hover:text-bodydark1 transition-colors duration-200"
          >
            <span>Seja Broker</span>
            <span
              className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 ease-in-out group-hover:w-full"
            />
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/signin/"
            className="transition-translate rounded-full  p-2 font-semibold text-blue-400 duration-300 hover:text-blue-500"
          >
            <span>Entrar</span>
          </Link>
          <Link
            href="/auth/signup/"
            className="rounded-full bg-blue-500 p-2 font-semibold text-snow transition-all duration-300 hover:bg-blue-600"
          >
            <span>Cadastrar</span>
          </Link>
        </div>
      </div>
      {/* ----> end header <---- */}
    </>
  );
};

export default UnloggedHeader;
