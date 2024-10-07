"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface IUnloggedHeaderProps {
  logoPath: string;
  theme?: "light" | "dark";
}

const UnloggedHeader = ({ logoPath, theme }: IUnloggedHeaderProps) => {
  const [headerType, setHeaderType] = useState<"smooth" | "glass" | "solid">(
    theme === "light" ? "solid" : "smooth",
  );

  useEffect(() => {
    const watchWindowScroll = () => {
      if (window.scrollY > 200) {
        setHeaderType("glass");
      } else {
        setHeaderType(theme === "light" ? "solid" : "smooth");
      }
    };
    window.addEventListener("scroll", watchWindowScroll);
    return () => window.removeEventListener("scroll", watchWindowScroll);
  });

  return (
    <>
      {/* header */}
      <div
        className={`fixed top-0 z-1 w-full ${headerType === "smooth" ? "bg-transparent" : headerType === "solid" ? "bg-gray-200" : "bg-boxdark-2 bg-opacity-10 bg-clip-padding backdrop-blur-sm backdrop-filter"} py-6 transition-colors duration-500 2xsm:px-5 lg:px-10`}
      >
        <div className="mx-auto flex max-w-270 items-center justify-between">
          <Image
            className="2xsm:hidden md:block"
            src={logoPath}
            alt="Logo"
            width={176}
            height={32}
          />
          <Image
            className="md:hidden"
            src={"/images/logo/celer-app-logo-dark.svg"}
            alt="Logo"
            width={50}
            height={32}
          />
          <div className="flex items-center gap-4 2xsm:text-[13px] md:text-[18px]">
            {theme === "light" ? (
              <>
                <Link
                  href="/auth/signin/"
                  className="transition-translate rounded-md border border-black-2 px-6 py-3 text-black-2 duration-300 hover:-translate-y-1 hover:border-black-2 hover:bg-black-2 hover:text-snow"
                >
                  <span>Entrar</span>
                </Link>
                <Link
                  href="/auth/signup/"
                  className="rounded-md border border-black-2 bg-black-2 px-6 py-3 text-snow transition-all duration-300 hover:-translate-y-1 hover:border-black-2"
                >
                  <span>Cadastrar</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin/"
                  className="transition-translate rounded-md border border-snow px-6 py-3 font-semibold text-snow duration-300 hover:-translate-y-1 hover:border-snow hover:bg-snow hover:text-black-2"
                >
                  <span>Entrar</span>
                </Link>
                <Link
                  href="/auth/signup/"
                  className="rounded-md border border-snow bg-snow px-6 py-3 font-semibold text-black-2 transition-all duration-300 hover:-translate-y-1 hover:border-snow"
                >
                  <span>Cadastrar</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {/* end header */}
    </>
  );
};

export default UnloggedHeader;
