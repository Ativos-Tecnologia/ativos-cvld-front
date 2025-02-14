"use client";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import ReactDOM from 'react-dom'
import { AiOutlineLoading } from "react-icons/ai";
import { IoCloseCircleSharp, IoRadioButtonOff } from "react-icons/io5";
import { Button } from "../Button";

type MessageTypes = "success_with_pendency" | "success_without_pendency" | "failure" | "proposal_declined"

const returnMessages = {
    success_with_pendency: {
        title: "Proposta aceita!",
        text: "Porém ainda há pontos pendentes para a conclusão da diligência."
    },
    success_without_pendency: {
        title: "Agora é com a gente! 🎉",
        text: "Nosso setor jurídico dará inicio ao processo de Due Diligence."
    },
    proposal_declined: {
        title: "Proposta cancelada!",
        text: "Você pode registrar o motivo no campo de observação."
    },
    failure: {
        title: "Ops!",
        text: "Houve um problema ao completar a requisição. Tente novamente."
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
        <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
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
                                    {(value === loadingStates.length - 1 || value === loadingStates.length - 2) && 
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
                                    {(value === index && !reqStatus || value < loadingStates.length - 2) && (
                                        <AiOutlineLoading className="w-6 h-6 animate-spin text-black dark:text-white" />
                                    )}
                                </>
                            )}
                            {/* {(index <= value && reqStatus) && (
                                <>
                                    {reqStatus === "failure" && (
                                        <IoCloseCircleSharp
                                            className={cn(
                                                "text-black dark:text-white",
                                                value === index &&
                                                "text-red opacity-100"
                                            )}
                                        />
                                    )}
                                    {reqStatus === "success" && (
                                        <CheckFilled
                                            className={cn(
                                                "text-black dark:text-white",
                                                value === index &&
                                                "text-black dark:text-lime-500 opacity-100"
                                            )}
                                        />
                                    )}
                                </>
                            )} */}
                        </div>
                        <span
                            className={`text-black dark:text-white 
                                ${value > index && "text-green-400 dark:!text-lime-500 opacity-100"} 
                                ${(value === index && value === loadingStates.length - 1 && reqStatus === "failure") && "text-red dark:!text-red opacity-100"} 
                                ${(value === loadingStates.length - 1 || value === loadingStates.length - 2) && 
                                    reqStatus === "success" && "text-green-400 dark:!text-lime-500 opacity-100"}`}
                        >
                            {state}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
};

export const MultiStepLoader = ({
    loadingStates,
    duration = 2000,
    reqStatus,
    reqType,
    handleClose,
    hasEffect = false
}: {
    loadingStates: string[];
    duration?: number;
    reqStatus: "success" | "failure" | null;
    reqType: "accept" | "decline" | null;
    handleClose?: () => void;
    hasEffect: boolean | null
}) => {
    const [currentState, setCurrentState] = useState(0);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [messageType, setMessageType] = useState<MessageTypes>("success_with_pendency");

    useEffect(() => {
        // if (!loading) {
        //     setCurrentState(0);
        //     return;
        // }

        if (currentState >= loadingStates.length - 1 && reqStatus) {
            if (reqStatus === "success") {
                if (reqType === "accept") {
                    if (hasEffect) {
                        confetti({
                            spread: 180,
                            particleCount: 300,
                            origin: {
                                y: 0.5,
                            },
                        });
                        setMessageType("success_without_pendency");
                    } else {
                        setMessageType("success_with_pendency");
                    } 
                } else {
                    setMessageType("proposal_declined");
                }
            } else {
                setMessageType("failure");
            }

            setTimeout(() => {
                setIsFinished(true)
            }, 1500)
            return;
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
                    <div className="relative z-50 flex items-center justify-center">
                        <div className="h-96  relative">
                            <LoaderCore value={currentState} loadingStates={loadingStates} reqStatus={reqStatus} />
                        </div>

                        <div className={`${isFinished && "py-2 px-20 max-w-fit"} min-h-80 max-w-0 transition-all duration-500 ease-in-out overflow-hidden`}>
                            <h2 className="text-[clamp(1.5rem,5vw,3rem)] mb-5 text-black-2 dark:text-snow font-medium">
                                {returnMessages[messageType as keyof typeof returnMessages].title}
                            </h2>
                            <p className="text-black-2 dark:text-gray-300">
                            {returnMessages[messageType as keyof typeof returnMessages].text}
                            </p>
                            <Button
                                className="mt-5"
                                onClick={handleClose}>
                                Fechar
                            </Button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-white dark:bg-[#000] h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]" />
                </motion.div>
            </AnimatePresence>,
            document.body
        )

    );
};
