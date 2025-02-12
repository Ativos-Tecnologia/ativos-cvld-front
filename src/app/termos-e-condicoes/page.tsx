"use client"
import { AppTerms } from "@/components/AppTerms";
import { MainFooter } from "@/components/Footer";
import UnloggedHeader from "@/components/Header/UnloggedHeader";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { BiChevronUp } from "react-icons/bi";
import { BsChevronCompactDown } from "react-icons/bs";

export default function Terms() {

    const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
    const [isHeaderFixed, setIsHeaderFixed] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const termsRef = useRef<HTMLElement | null>(null);

    function scrollTo(ref: HTMLElement | HTMLDivElement | null) {
        if (ref) {
            ref.scrollIntoView({
                behavior: "smooth"
            })
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
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    })

    return (
        <div className="relative font-nexa min-h-screen bg-[#050505]">

            {/* ----> ornaments <---- */}
            <div className="absolute top-0 right-0">
                <Image
                    src={"/images/ornaments/right-vector-home.svg"}
                    alt={"ornamento a direita"}
                    width={400}
                    height={200}
                />
            </div>

            <div className="absolute opacity-50 2xsm:bottom-[1000px] sm:bottom-[800px] lg:bottom-[720px] lg:opacity-100 xl:bottom-[570px] left-0">
                <Image
                    src={"/images/ornaments/left-vector-home.svg"}
                    alt={"ornamento a esquerda"}
                    width={400}
                    height={200}
                />
            </div>
            {/* ----> end ornaments <---- */}

            <div ref={containerRef} className="sm:w-10/12 lg:w-3/4 xl:w-8/12 mx-auto">

                <UnloggedHeader
                    theme="darkMode"
                />

                <section className="pt-34 min-h-screen grid justify-between">
                    <div className="flex my-10">
                        <div className="flex 3xl:flex-1 items-center">
                            <Fade direction="left" delay={500} triggerOnce>
                                <h1 className="text-snow uppercase font-medium 2xsm:text-center 2xsm:text-5xl xsm:text-6xl sm:text-7xl xl:text-left">
                                    Termos &amp; Condições
                                </h1>
                            </Fade>
                        </div>
                        <Fade
                            direction="up"
                            triggerOnce
                            className="hidden xl:flex items-center justify-center"
                        >
                            <div className="blob-element overflow-hidden max-w-[700px] max-h-[467px]">
                                <img
                                    src="/images/contract.jpg"
                                    alt="teste"
                                    className="w-full bg-center"
                                />
                            </div>
                        </Fade>
                    </div>
                    <div className="flex items-end justify-center">
                        <BsChevronCompactDown
                            onClick={() => scrollTo(termsRef.current)}
                            className="animate-upforward text-7xl text-bodydark2 cursor-pointer" />
                    </div>
                </section>

                <section ref={termsRef} className="min-h-screen pt-15 pb-10">
                    <Fade
                        direction="up"
                        delay={100}
                        triggerOnce
                        className="mb-5"
                    >
                        <h2 className="text-4xl text-snow font-medium uppercase text-center">
                            sobre o uso da plataforma celer
                        </h2>

                    </Fade>

                    <div className="grid gap-3 pt-17 mx-auto 2xsm:w-10/12 xl:w-2/3">
                        <AppTerms />
                    </div>
                </section>

                {/* ----> back to top button <---- */}
                <button
                    onClick={() => scrollTo(containerRef.current)}
                    className={`fixed bottom-10 2xsm:right-5 sm:right-10 lg:right-20 w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 bg-opacity-10 bg-clip-padding backdrop-blur-sm backdrop-filter ${isButtonVisible ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"} transition-all duration-500`}>
                    <BiChevronUp className="animate-upforward text-4xl text-snow" />
                </button>
            </div>
            {/* ----> footer <---- */}
            <MainFooter />
            {/* ----> end footer <---- */}
        </div>
    )
}
