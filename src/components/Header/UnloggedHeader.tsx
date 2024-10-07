"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface IUnloggedHeaderProps {
    logoPath: string;
    theme?: "light" | "dark";
}

const UnloggedHeader = ({ logoPath, theme }: IUnloggedHeaderProps) => {

    const [headerType, setHeaderType] = useState<'smooth' | 'glass' | 'solid'>(theme === 'light' ? 'solid' : 'smooth');

    useEffect(() => {
        const watchWindowScroll = () => {
            if (window.scrollY > 200) {
                setHeaderType('glass');
            } else {
                setHeaderType(theme === 'light' ? 'solid' : 'smooth');
            }
        }
        window.addEventListener('scroll', watchWindowScroll);
        return () => window.removeEventListener('scroll', watchWindowScroll);
    }, [])

    return (
        <>
            {/* header */}
            <div className={`fixed top-0 w-full z-1 ${headerType === 'smooth' ? 'bg-transparent' : headerType === 'solid' ? 'bg-gray-200' : 'bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 bg-boxdark-2'} py-6 xsm:px-5 lg:px-10 transition-colors duration-500`}>
                <div className='max-w-270 mx-auto flex items-center justify-between'>
                    <Image
                        className="block"
                        src={logoPath}
                        alt="Logo"
                        width={176}
                        height={32}
                    />
                    <div className='flex items-center gap-4'>
                        {theme === 'light' ? (
                            <>
                                <Link href='/auth/signin/' className='px-6 py-3 border border-black-2 rounded-md text-black-2 hover:-translate-y-1 hover:bg-black-2 hover:border-black-2 hover:text-snow transition-translate duration-300'>
                                    <span>Entrar</span>
                                </Link>
                                <Link href='/auth/signup/' className='px-6 py-3 bg-black-2 border border-black-2 text-snow rounded-md hover:-translate-y-1 hover:border-black-2 transition-all duration-300'>
                                    <span>Cadastrar</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href='/auth/signin/' className='px-6 py-3 border border-snow rounded-md text-snow hover:-translate-y-1 hover:bg-snow hover:border-snow hover:text-black-2 transition-translate duration-300'>
                                    <span>Entrar</span>
                                </Link>
                                <Link href='/auth/signup/' className='px-6 py-3 bg-snow border border-snow text-black-2 rounded-md hover:-translate-y-1 hover:border-snow transition-all duration-300'>
                                    <span>Cadastrar</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/* end header */}
        </>
    )
}

export default UnloggedHeader