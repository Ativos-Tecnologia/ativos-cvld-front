'use client'
import UnloggedLayout from "@/components/Layouts/UnloggedLayout";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react"
import { BiChevronDown } from "react-icons/bi";

const AutomatedProposal = () => {

    const headerRef = useRef<HTMLDivElement | null>(null)

    return (
        <UnloggedLayout>
            {/* header */}
            <div ref={headerRef} className="absolute t-0 w-full z-1 py-6 px-16 flex items-center justify-between lg:px-8 bg-boxdark-2/35">
                <Image
                    className="block"
                    src={"/images/logo/celer-app-logo-text.svg"}
                    alt="Logo"
                    width={176}
                    height={32}
                />
                {/* <nav className='flex items-center text-strokedark justify-center gap-12'>
                    <Link href="#">Home</Link>
                    <Link href="#" className='flex items-center gap-1'>
                        <span>Produtos</span>
                        <BiChevronDown />
                    </Link>
                    <Link href="#" className='flex items-center gap-1'>
                        <span>Recursos</span>
                        <BiChevronDown />
                    </Link>
                    <Link href="#">Sobre nós</Link>
                </nav> */}
                <div className='flex items-center gap-4'>
                    <Link href='/auth/signin/' className='px-6 py-3 border border-snow rounded-md text-snow hover:-translate-y-1 hover:bg-snow hover:border-snow hover:text-black-2 transition-translate duration-300'>
                        <span>Entrar</span>
                    </Link>
                    <Link href='/auth/signup/' className='px-6 py-3 bg-snow border border-snow text-black-2 rounded-md hover:-translate-y-1 hover:border-snow transition-all duration-300'>
                        <span>Cadastrar</span>
                    </Link>
                </div>
            </div>
            {/* end header */}
            <div className="relative">
                <img
                    src="/images/hero-image.jfif"
                    alt="homem com terno e notebook"
                    className="h-full"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.7)_10%,transparent_90%)] flex flex-col items-center justify-center">
                    <h1>
                        Automatização de propostas
                    </h1>
                </div>
            </div>
        </UnloggedLayout>
    )
}

export default AutomatedProposal;
