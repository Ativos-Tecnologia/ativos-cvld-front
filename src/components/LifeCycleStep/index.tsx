import React from 'react';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { FaSearchDollar } from 'react-icons/fa';
import { FaCircleCheck, FaUserClock } from 'react-icons/fa6';
import { IoDocumentAttachOutline } from 'react-icons/io5';
import { MdOutlineContentPasteSearch, MdOutlineHandshake } from 'react-icons/md';
import "./styles.css";

type LifeCycleStepProps = {
    status: string;
};

const steps = [
    { label: "Prospecção", alias: "Prospecção", icon: <FaSearchDollar className="text-2xl" /> },
    { label: "Negociação em andamento", alias: "Negociação", icon: <FaUserClock className="text-2xl" /> },
    {
        label: "Proposta",
        alias: "Proposta",
        subLabels: [
            "Repactuação",
            "Pendência a Sanar",
            "Juntar Documentos"
        ],
        icon: <MdOutlineHandshake className="text-2xl" />
    },
    {
        label: "Due Diligence",
        alias: "Due",
        subLabels: [
            "Due em Andamento",
            "Revisão de Due Diligence"
        ],
        icon: <MdOutlineContentPasteSearch className="text-2xl" />
    },
    { label: "Em liquidação", alias: "Liquidação", icon: <BiMoneyWithdraw className="text-2xl" /> },
    {
        label: "Cessão", alias: "Cessão",
        subLabels: [
            "Em cessão",
            "Registro de cessão"
        ],
        icon: <IoDocumentAttachOutline className="text-2xl" />
    },
    { label: "Concluído", alias: "Concluído", icon: <FaCircleCheck className="text-2xl" /> },
];

const LifeCycleStep = ({ status }: LifeCycleStepProps) => {
    const currentIndex = steps.findIndex(step => step.label === status || step.subLabels?.includes(status));

    return (
        <div className="main-container dark:bg-boxdark bg-white rounded-md">

            {/* title */}
            <div className="title-container">
                <h1>Progresso atual ({status === "Repactuação" ? "Proposta" : status})</h1>
            </div>

            <div className="steps-container">
                {steps.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isInProgress = index === currentIndex;
                    const isPrevStepInProgress = index === currentIndex - 1;

                    return (
                        <React.Fragment key={step.label}>
                            <div className={`step ${isCompleted ? 'completed' : ''} ${isInProgress ? 'in-progress' : ''}`}>
                                {isCompleted && (
                                    <svg className='stepIcon' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                                    </svg>
                                )}
                                {isInProgress && <div className="preloader"></div>}
                                <div className={`label ${isCompleted ? 'completed' : isInProgress ? 'loading' : ''}`}>
                                    {step.alias}
                                </div>
                                <div className={`icon ${isCompleted ? 'completed' : isInProgress ? 'in-progress' : ''}`}>
                                    {step.icon}
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`line ${isCompleted ? 'completed' : ''} ${isInProgress ? 'prev-step-in-progress' : ''
                                        } ${isPrevStepInProgress ? 'next-step-in-progress' : ''}`}
                                ></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default LifeCycleStep;
