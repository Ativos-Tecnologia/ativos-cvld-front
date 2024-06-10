import React, { useContext } from "react";
import { Popover } from "flowbite-react";
import { BiChevronRight } from "react-icons/bi";
import { BsCoin } from "react-icons/bs";
import { UserInfoAPIContext, UserInfoContextType } from "@/context/UserInfoContext";
import Link from "next/link";

export const Balance = () => {

    const { subscriptionData, credits } = useContext<UserInfoContextType>(UserInfoAPIContext);
    const todayDate = new Date();
    const expireCreditsDate = new Date(subscriptionData[0].end_date);
    const diffTime = expireCreditsDate.getTime() - todayDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return (
        <React.Fragment>
            {/* view desktop/tablets */}
            <Popover
                trigger="click"
                placement="bottom"
                aria-labelledby="default-popover"
                content={
                    <div className="w-64 text-sm">
                        <div className="border-b border-gray bg-slate-100 px-3 py-2 dark:bg-meta-4 dark:border-strokedark">
                            <h3 id="default-popover" className="font-semibold text-black dark:text-white">
                                {subscriptionData[0].plan === 'FREE' ? 'VERSÃO GRATUITA' : 'VERSÃO PREMIUM'}
                            </h3>
                        </div>
                        <div className="px-3 py-2 flex flex-col justify-center dark:bg-form-strokedark dark:text-white">
                            <p>
                                Você está usando uma <strong>versão gratuita</strong>, {diffDays > 0 ? `e seus créditos irão expirar em ${diffDays} dias.` : 'seus créditos expiraram.'} Adquira créditos para continuar usando a nossa plataforma.
                            </p>
                            <Link href='#' className="group text-primary opacity-80 hover:opacity-100 text-base mt-2 font-semibold dark:text-white">
                                Nossos planos
                                <BiChevronRight style={{
                                    width: "22px",
                                    height: "22px",
                                }} className="inline-block ml-1 transition-all duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                }
            >
                <a href="#" className="hidden sm:flex relative items-center justify-center rounded-full text-sm px-2 border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:text-bodydark2">
                    <span
                        className={`absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1`}
                    >
                        {credits.available_credits <= 10 && (
                            <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
                        )}

                    </span>
                    <p>Créditos: {credits.available_credits}</p>
                </a>
            </Popover>
            {/* end view desktop/tablets */}

            {/* view mobile */}
            <Popover
                trigger="click"
                placement="bottom"
                aria-labelledby="default-popover"
                content={
                    <div className="w-64 text-sm">
                        <div className="border-b border-gray bg-slate-100 px-3 py-2 dark:bg-meta-4 dark:border-strokedark">
                            <h3 id="default-popover" className="font-semibold text-black dark:text-white">
                                {subscriptionData[0].plan === 'FREE' ? 'VERSÃO GRATUITA' : 'VERSÃO PREMIUM'}
                            </h3>
                        </div>
                        <div className="px-3 py-2 flex flex-col justify-center dark:bg-form-strokedark dark:text-white">
                            <p>
                                Você está usando uma <strong>versão gratuita</strong>, {diffDays > 0 ? `e seus créditos irão expirar em ${diffDays} dias.` : 'seus créditos expiraram.'} Adquira créditos para continuar usando a nossa plataforma.
                            </p>
                            <Link href='#' className="group text-primary opacity-80 hover:opacity-100 text-base mt-2 font-semibold dark:text-white">
                                Nossos planos
                                <BiChevronRight style={{
                                    width: "22px",
                                    height: "22px",
                                }} className="inline-block ml-1 transition-all duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                }
            >
                <a href="#" className="sm:hidden flex relative items-center justify-center rounded-full text-sm px-2 py-1 border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:text-bodydark2">
                    <span
                        className={`absolute -bottom-1.5 w-[29px] -right-1.5 z-1 p-[3px] rounded-full text-white bg-meta-1 text-xs`}
                    >
                        {credits.available_credits <= 10 && (<span className="absolute -z-1 inline-flex h-full w-full top-0 left-0 animate-ping rounded-full bg-meta-1 opacity-75"></span>)}
                        <p className="text-center">
                            {credits.available_credits <= 99 ? credits.available_credits : '99+'}
                        </p>
                    </span>
                    <BsCoin style={{
                        width: "26px",
                        height: "26px",
                    }} />
                </a>
            </Popover>
            {/* end view mobile */}
        </React.Fragment>

    )
}
