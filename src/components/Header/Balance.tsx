import React, { useContext, useState } from "react";
import { BiChevronRight, BiDollarCircle } from "react-icons/bi";
import { BsExclamation } from "react-icons/bs";
import { UserInfoAPIContext, UserInfoContextType } from "@/context/UserInfoContext";
import PricingModal from "../Shop/PricingModal";
import ShopModal from "../Shop";
import { Popover } from "flowbite-react";

export const Balance = () => {

    const { subscriptionData, credits, loading } = useContext<UserInfoContextType>(UserInfoAPIContext);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const todayDate = new Date();
    const expireCreditsDate = new Date(subscriptionData.end_date);
    const diffTime = expireCreditsDate.getTime() - todayDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return (
        <React.Fragment>
            {/* view desktop/tablets */}
            {loading ? (
                <div role="status" className="animate-pulse">
                    <div className="h-[22px] w-[90px] rounded-full bg-gray-200 dark:bg-boxdark"></div>
                </div>
            ) : (
                <Popover
                    trigger="click"
                    placement="bottom"
                    aria-labelledby="default-popover"
                    content={
                        <div className="w-64 text-sm">
                            <div className="border-b border-gray bg-slate-100 px-3 py-2 dark:bg-meta-4 dark:border-strokedark">
                                <h3 id="default-popover" className="font-semibold text-black dark:text-white">
                                    {subscriptionData.plan === 'FREE' ? 'VERSÃO GRATUITA' : 'VERSÃO PREMIUM'}
                                </h3>
                            </div>
                            <div className="px-3 py-2 flex flex-col justify-center dark:bg-form-strokedark dark:text-white">
                                <p>
                                    {subscriptionData.plan === 'FREE' && (
                                        <>Você está usando a <strong>versão gratuita</strong>.</>
                                    )}
                                    {diffDays > 0 && credits.available_credits > 0 && ` Seus créditos irão expirar em ${diffDays} dias.`}
                                    {diffDays <= 0 && 'Seus créditos expiraram.'}
                                </p>
                                {credits.available_credits <= 10 && credits.available_credits > 0 && (
                                    <p className="my-3 text-sm">
                                        <span className="text-meta-1 dark:text-meta-7">Alerta: </span>
                                        <span>
                                            Seu saldo está acabando. Recarregue para continuar utilizando a nossa plataforma.
                                        </span>
                                    </p>
                                )}
                                {credits.available_credits === 0 && (
                                    <p className="my-3 text-sm">
                                        <span className="text-meta-1 dark:text-meta-7">Alerta: </span>
                                        <span>
                                            Seu saldo acabou. Recarregue para continuar utilizando a nossa plataforma.
                                        </span>
                                    </p>
                                )}

                                <button onClick={() => setModalOpen(true)} className="group self-start text-blue-700 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-600 text-sm mt-5 font-semibold">
                                    Adquirir Créditos
                                    <BiChevronRight style={{
                                        width: "22px",
                                        height: "22px",
                                    }} className="inline-block ml-1 transition-all duration-300 group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    }
                >

                    <a href="#" className="flex relative items-center justify-center rounded-full text-sm px-2 py-[2px] border-[0.5px] border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white">

                        {credits.available_credits <= 10 && (
                            <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full flex items-center justify-center bg-meta-1">
                                <BsExclamation className="w-4 h-4 text-white animate-wiggle transition-all duration-300" />
                            </div>
                        )}
                        <BiDollarCircle className="w-6 h-6 text-yellow-300" />
                        <p className="font-medium ml-1 pl-1 border-l border-stroke dark:border-form-strokedark">
                            {credits.available_credits <= 9999 ? credits.available_credits : '9999+'}
                        </p>
                    </a>
                </Popover>
            )}

            {modalOpen && <ShopModal state={modalOpen} setState={setModalOpen} />}
            {/* end view desktop/tablets */}

            {/* view mobile */}
            {/* {loading ? (
                <div role="status" className="animate-pulse">
                    <div className="h-[36px] w-[44px] rounded-full bg-gray-200 dark:bg-boxdark"></div>
                </div>
            ) : (
                <Popover
                    trigger="click"
                    placement="bottom"
                    aria-labelledby="default-popover"
                    content={
                        <div className="w-64 text-sm">
                            <div className="border-b border-gray bg-slate-100 px-3 py-2 dark:bg-meta-4 dark:border-strokedark">
                                <h3 id="default-popover" className="font-semibold text-black dark:text-white">
                                    {subscriptionData.plan === 'FREE' ? 'VERSÃO GRATUITA' : 'VERSÃO PREMIUM'}
                                </h3>
                            </div>
                            <div className="px-3 py-2 flex flex-col justify-center dark:bg-form-strokedark dark:text-white">

                                <p>
                                    {subscriptionData.plan === 'FREE' && (
                                        <>Você está usando a <strong>versão gratuita</strong>.</>
                                    )}
                                    {diffDays > 0 && credits.available_credits > 0 && ` Seus créditos irão expirar em ${diffDays} dias.`}
                                    {diffDays <= 0 && 'Seus créditos expiraram.'}
                                </p>
                                {credits.available_credits <= 10 && credits.available_credits > 0 && (
                                    <p className="my-3 text-sm">
                                        <span className="text-meta-1 dark:text-meta-7">Alerta: </span>
                                        <span>
                                            Seu saldo está acabando. Recarregue para continuar utilizando a nossa plataforma.
                                        </span>
                                    </p>
                                )}
                                {credits.available_credits === 0 && (
                                    <p className="my-3 text-sm">
                                        <span className="text-meta-1 dark:text-meta-7">Alerta: </span>
                                        <span>
                                            Seu saldo acabou. Recarregue para continuar utilizando a nossa plataforma.
                                        </span>
                                    </p>
                                )}

                                <Link href='#' className="group text-primary opacity-80 hover:opacity-100 text-base mt-2 font-semibold dark:text-white">
                                    Adquirir créditos
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
            )} */}
            {/* end view mobile */}
        </React.Fragment>

    )
}
