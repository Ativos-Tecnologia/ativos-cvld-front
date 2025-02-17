'use client';
import { AppTerms } from '@/components/AppTerms';
import { MainFooter } from '@/components/Footer';
import UnloggedHeader from '@/components/Header/UnloggedHeader';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { BiChevronUp } from 'react-icons/bi';
import { BsChevronCompactDown } from 'react-icons/bs';
import contract from '../../../public/images/contract.jpg';

export default function Terms() {
    const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
    const [isHeaderFixed, setIsHeaderFixed] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const termsRef = useRef<HTMLElement | null>(null);

    function scrollTo(ref: HTMLElement | HTMLDivElement | null) {
        if (ref) {
            ref.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const scrollPosition = window.scrollY;

            if (scrollPosition > windowHeight) {
                setIsButtonVisible(true);
                setIsHeaderFixed(true);
            } else {
                setIsButtonVisible(false);
                setIsHeaderFixed(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });

    return (
        <div className="relative min-h-screen bg-[#050505] font-nexa">
            {/* ----> ornaments <---- */}
            <div className="absolute right-0 top-0">
                <Image
                    src={'/images/ornaments/right-vector-home.svg'}
                    alt={'ornamento a direita'}
                    width={400}
                    height={200}
                />
            </div>

            <div className="absolute left-0 opacity-50 2xsm:bottom-[1000px] sm:bottom-[800px] lg:bottom-[720px] lg:opacity-100 xl:bottom-[570px]">
                <Image
                    src={'/images/ornaments/left-vector-home.svg'}
                    alt={'ornamento a esquerda'}
                    width={400}
                    height={200}
                />
            </div>
            {/* ----> end ornaments <---- */}

            <div ref={containerRef} className="mx-auto sm:w-10/12 lg:w-3/4 xl:w-8/12">
                <UnloggedHeader theme="darkMode" />

                <section className="grid min-h-screen justify-between pt-34">
                    <div className="my-10 flex">
                        <div className="flex items-center 3xl:flex-1">
                            <Fade direction="left" delay={500} triggerOnce>
                                <h1 className="font-medium uppercase text-snow 2xsm:text-center 2xsm:text-5xl xsm:text-6xl sm:text-7xl xl:text-left">
                                    Termos &amp; Condições
                                </h1>
                            </Fade>
                        </div>
                        <Fade
                            direction="up"
                            triggerOnce
                            className="hidden items-center justify-center xl:flex"
                        >
                            <div className="blob-element max-h-[467px] max-w-[700px] overflow-hidden">
                                <Image src={contract} alt="teste" className="w-full bg-center" />
                            </div>
                        </Fade>
                    </div>
                    <div className="flex items-end justify-center">
                        <BsChevronCompactDown
                            onClick={() => scrollTo(termsRef.current)}
                            className="animate-upforward cursor-pointer text-7xl text-bodydark2"
                        />
                    </div>
                </section>

                <section ref={termsRef} className="min-h-screen pb-10 pt-15">
                    <Fade direction="up" delay={100} triggerOnce className="mb-5">
                        <h2 className="text-center text-4xl font-medium uppercase text-snow">
                            sobre o uso da plataforma celer
                        </h2>
                    </Fade>

                    <div className="mx-auto grid gap-3 pt-17 2xsm:w-10/12 xl:w-2/3">
                        <AppTerms />
                    </div>
                </section>

                {/* ----> back to top button <---- */}
                <button
                    onClick={() => scrollTo(containerRef.current)}
                    className={`fixed bottom-10 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 bg-opacity-10 bg-clip-padding backdrop-blur-sm backdrop-filter 2xsm:right-5 sm:right-10 lg:right-20 ${isButtonVisible ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'} transition-all duration-500`}
                >
                    <BiChevronUp className="animate-upforward text-4xl text-snow" />
                </button>
            </div>
            {/* ----> footer <---- */}
            <MainFooter />
            {/* ----> end footer <---- */}
        </div>
    );
}
