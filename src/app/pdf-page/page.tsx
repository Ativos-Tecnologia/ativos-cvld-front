"use client"

import { PrintPDF } from "@/components/PrintPDF";
import { useRef } from "react";
import { useReactToPrint } from 'react-to-print';

const PagePDF = () => {

  const documentRef = useRef<HTMLDivElement>(null);
  
  const GeneratePDF = useReactToPrint({
    contentRef: documentRef,
    documentTitle: "Proposta de Broker",
    onPrintError: (errorLocation, error) => {
      console.error("Erro na impressão:", errorLocation, error);
      console.log("Elemento de impressão:", documentRef.current);
    }
  });

  return (
    <div>
      <button onClick={() => GeneratePDF()}>Gerar PDF</button>
      <div ref={documentRef}>
        <PrintPDF
          nome_do_credor="Nome do Credor"
          valor_da_proposta="8000"
          profissao="Profissão do Broker"
          nome_do_broker="Nome do Broker"
          foto_do_broker="/images/user/user-01.png"
        />
      </div>
    </div>
  );
};

export default PagePDF;
