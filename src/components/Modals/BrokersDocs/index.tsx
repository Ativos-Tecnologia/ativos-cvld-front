"use client";
import { BrokersContext } from '@/context/BrokersContext'
import React, { useContext, useEffect, useState } from 'react'
import { Fade } from 'react-awesome-reveal'
import { BiX } from 'react-icons/bi'
import { TiWarning } from 'react-icons/ti'
import { IdentificationType } from '../BrokersCedente';
import PFdocs from './PFdocs';
import PJdocs from './PJdocs';

const DocForm = () => {

    const {
        setDocModalInfo, docModalInfo
    } = useContext(BrokersContext);

    /*
    
        estado que verifica o tipo do modal que vai ser aberto
        os estados podem ser CPF/CNPJ/NULL
    
    */
    const [credorIdentificationType, setCredorIdentificationType] = useState<IdentificationType>(null);


    // useEffect que dispara o conteúdo do modal (formulário)
    // a depender do dado de identificação do credor do ofício
    // CPF/CNPJ
    useEffect(() => {
        if (docModalInfo === null) return;

        // verifica o tipo de identificação do credor e formata para só obter números na string
        const credorIdent = docModalInfo.properties["CPF/CNPJ"].rich_text![0].text.content.replace(/\D/g, '');

        setCredorIdentificationType(credorIdent.length === 11 ? "CPF" : credorIdent.length === 14 ? "CNPJ" : null);
    }, [docModalInfo]);

    return (
        <div
            role="dialog"
            className="animate-fade fixed left-0 top-0 z-999 flex h-screen w-screen items-center justify-center bg-black-2/50 bg-opacity-10 bg-clip-padding backdrop-blur-sm backdrop-filter transition-all duration-300 ease-in-out"
        >
            <div
                className="relative h-fit w-1/2 rounded-lg border border-stroke bg-white p-10 dark:border-strokedark dark:bg-boxdark"
            >
                <button className='group absolute right-2 top-2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors duration-300 cursor-pointer'>
                    <BiX className="group-hover:text-white transition-colors duration-300 text-2xl" onClick={() => setDocModalInfo(null)} />
                </button>

                {credorIdentificationType === "CPF" ? (
                    <PFdocs
                        cedenteId={docModalInfo!.properties["Cedente PF"].relation?.[0]?.id || null}
                        idPrecatorio={docModalInfo!.id}
                    />
                ) : (
                    <>
                        {credorIdentificationType === "CNPJ" ? (
                            <PJdocs
                                idPrecatorio={docModalInfo!.id}
                                cedenteId={docModalInfo!.properties["Cedente PJ"].relation?.[0]?.id || null}
                            />
                        ) : (
                            <Fade duration={700} triggerOnce>
                                <div className='flex flex-col gap-4 items-center justify-center'>
                                    <TiWarning className='text-amber-300 text-5xl' />
                                    <p className='text-center'>Para juntar documentos, é necessário ter o cedente vinculado no ofício.</p>
                                </div>
                            </Fade>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default DocForm
