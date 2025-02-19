"use client";
import React from "react";
import ReactDOM from "react-dom";
import { BrokersContext } from '@/context/BrokersContext';
import { useContext, useEffect, useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { BiX } from 'react-icons/bi';
import { TiWarning } from 'react-icons/ti';
import { IdentificationType } from '../BrokersCedente';
import PFdocs from './PFdocs';
import PJdocs from './PJdocs';
import { UserInfoProvider } from '@/context/UserInfoContext';

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

    return ReactDOM.createPortal (
      <div
        role="dialog"
        className="fixed left-0 top-0 z-999 flex h-screen w-screen animate-fade items-center justify-center bg-[#00000040] bg-opacity-10 bg-clip-padding backdrop-blur-sm backdrop-filter transition-all duration-300 ease-in-out"
      >
        <div className="relative h-fit rounded-lg border border-stroke bg-snow dark:border-strokedark dark:bg-boxdark-2 2xsm:w-11/12 2xsm:py-8 2xsm:px-5 md:w-4/5 md:p-10 lg:w-10/12 3xl:w-10/12">
          <button className="group absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:bg-slate-700">
            <BiX
              className="text-2xl transition-colors duration-300 group-hover:text-white"
              onClick={() => setDocModalInfo(null)}
            />
          </button>

          {credorIdentificationType === "CPF" ? (
                            <UserInfoProvider>

            <PFdocs
              cedenteId={
                docModalInfo!.properties["Cedente PF"].relation?.[0]?.id || null
              }
              idPrecatorio={docModalInfo!.id}
              tipoDoOficio={docModalInfo!.properties["Tipo"]?.select?.name ?? "Não informado"}
            />
            </UserInfoProvider>
          ) : (
            <>
              {credorIdentificationType === "CNPJ" ? (
                <UserInfoProvider>
                <PJdocs
                  idPrecatorio={docModalInfo!.id}
                  cedenteId={
                    docModalInfo!.properties["Cedente PJ"].relation?.[0]?.id ||
                    null
                  }
                  tipoDoOficio={docModalInfo!.properties["Tipo"]?.select?.name ?? "Não informado"}
                />
                </UserInfoProvider>
              ) : (
                <Fade duration={700} triggerOnce>
                  <div className="flex flex-col items-center justify-center gap-4">
                    <TiWarning className="text-5xl text-amber-300" />
                    <p className="text-center">
                      Para juntar documentos, é necessário ter o cedente
                      vinculado no ofício.
                    </p>
                  </div>
                </Fade>
              )}
            </>
          )}
        </div>
      </div>,
      document.body
    );
}

export default DocForm
