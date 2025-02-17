"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import ReactDOM from 'react-dom'
import { AiOutlineLoading } from "react-icons/ai";
import { IoCloseCircleSharp, IoRadioButtonOff } from "react-icons/io5";
import { Button } from "../Button";
import { Fade } from "react-awesome-reveal";

type MessageTypes = "success" | "failure";

const returnMessages = {
    success: {
        title: "Login efetuado com sucesso!",
        text: "Você será redirecionado em breve."
    },
    failure: {
        title: "Ops!",
        text: "Houve um problema ao fazer Login. Tente novamente."
    }
}

const CheckFilled = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={cn("w-6 h-6 ", className)}
        >
            <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
            />
        </svg>
    );
};

const LoaderCore = ({
    loadingStates,
    value = 0,
    reqStatus
}: {
    loadingStates: string[];
    value?: number;
    reqStatus?: "success" | "failure" | null
}) => {

    return (
        <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-50 lg:mt-40">
            {loadingStates.map((state, index) => {
                const distance = Math.abs(index - value);
                const opacity = Math.max(1 - distance * 0.2, 0); // Minimum opacity is 0, keep it 0.2 if you're sane.

                return (
                    <motion.div
                        key={index}
                        className={cn("text-left flex gap-2 mb-4")}
                        initial={{ opacity: 0, y: -(value * 40) }}
                        animate={{ opacity: opacity, y: -(value * 40) }}
                        transition={{ duration: 0.5 }}
                    >
                        <div>
                            {index > value && (
                                <IoRadioButtonOff className="w-6 h-6 text-black dark:text-white" />
                            )}
                            {index < value && (
                                <CheckFilled
                                    className={cn("text-green-400 dark:text-lime-500")}
                                />
                            )}
                            {index === value && (
                                <>
                                    {(value === loadingStates.length - 1) &&
                                        reqStatus === "success" && (
                                            <CheckFilled
                                                className={cn("text-green-400 dark:text-lime-500")}
                                            />
                                        )}
                                    {(value === loadingStates.length - 1 && reqStatus === "failure") && (
                                        <IoCloseCircleSharp
                                            className={cn(
                                                "w-6 h-6 text-red opacity-100"
                                            )}
                                        />
                                    )}
                                    {(value === index && !reqStatus || value <= loadingStates.length - 2) && (
                                        <AiOutlineLoading className="w-6 h-6 animate-spin text-black dark:text-white" />
                                    )}
                                </>
                            )}
                        </div>
                        <span
                            className={`text-black dark:text-white 
                                ${value > index && "text-green-400 dark:!text-lime-500 opacity-100"} 
                                ${(value === index && value === loadingStates.length - 1 && reqStatus === "failure") && "text-red dark:!text-red opacity-100"} 
                                ${(value === index && (value === loadingStates.length - 1) &&
                                    reqStatus === "success") && "text-green-400 dark:!text-lime-500 opacity-100"}`}
                        >
                            {state}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
};

export const MultiStepLoginLoader = ({
    loadingStates,
    duration = 1700,
    reqStatus,
    handleRedirect,
    handleClose,
    loginError
}: {
    loadingStates: string[];
    duration?: number;
    reqStatus: "success" | "failure" | null;
    handleRedirect: () => void;
    handleClose: () => void;
    loginError?: string;
}) => {
    const [currentState, setCurrentState] = useState(0);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [messageType, setMessageType] = useState<MessageTypes>("success");

    useEffect(() => {

        if (currentState >= loadingStates.length - 1 && reqStatus) {

            if (reqStatus === "success") {
                setIsFinished(true);
                setTimeout(() => {
                    handleRedirect();
                }, 3000)
                return;
            } else {
                setIsFinished(true)
                setMessageType("failure");
            }

        }

        const timeout = setTimeout(() => {
            if (reqStatus) {
                setCurrentState((prevState) =>
                    Math.min(prevState + 1, loadingStates.length - 1)
                );
            } else {
                setCurrentState((prevState) =>
                    Math.min(prevState + 1, loadingStates.length - 2)
                );
            }
        }, duration);

        return () => clearTimeout(timeout);
    }, [currentState, reqStatus, loadingStates.length, duration]);

    return (
        ReactDOM.createPortal(
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{
                        opacity: 0,
                    }}
                    className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl"
                >
                    <div className="relative z-50 flex flex-col items-center justify-center lg:flex-row">

                        <div className="h-80 lg:h-96  relative">
                            <LoaderCore value={currentState} loadingStates={loadingStates} reqStatus={reqStatus} />
                        </div>

                        {isFinished && (
                            <Fade direction="right" duration={500}>
                                <div className={`py-2 px-10 md:px-20 min-h-80 transition-all duration-500 ease-in-out overflow-hidden text-center lg:text-left`}>
                                    <h2 className="text-[clamp(1.8rem,5vw,3rem)] mb-5 text-black-2 dark:text-snow font-medium">
                                        {messageType === "success" ? "Login efetuado com sucesso!" : "Erro ao logar!"}
                                    </h2>
                                    <p className="text-black-2 dark:text-gray-300">
                                        {messageType === "success" ? "Você será redirecionado em breve." : loginError}
                                    </p>
                                    {messageType === "failure" && (
                                        <Button
                                            className="mt-10 lg:mt-5 mx-auto block"
                                            onClick={handleClose}>
                                            Fechar
                                        </Button>
                                    )}
                                </div>
                            </Fade>
                        )}
                    </div>

                    <div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-white/75 dark:bg-[#00000095] h-full absolute" />
                </motion.div>
            </AnimatePresence>,
            document.body
        )

    );
};
