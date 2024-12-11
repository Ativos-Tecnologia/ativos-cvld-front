"use client"

import { PrintPDF } from "@/components/PrintPDF";
import { useRef } from "react";
import { useReactToPrint } from 'react-to-print';

/***
 * @name PagePDF
 * @description Componente para gerar PDF
 * Esse Componente é responsável por gerar um PDF a partir do componente PrintPDF,
 * você deve gerar essa print pelo ref do componente PrintPDF encapsulado em uma div
 * com o ref={documentRef} e passar esse ref para o useReactToPrint.
 * Para funcionar corretamente, a função que faz o print deve ser chamada na mesma página do Componente.
 */

const PagePDF = () => {

  const documentRef = useRef<HTMLDivElement>(null);
  
  const GeneratePDF = useReactToPrint({
    contentRef: documentRef,
    documentTitle: "Proposta",
    onPrintError: (errorLocation, error) => {
      console.error("Erro na geração do PDF:", errorLocation, error);
    }
  });

  return (
    <div>
      {/* <button onClick={() => GeneratePDF()}>Gerar PDF</button> */}
      <div ref={documentRef} className="bg-[#F4F4F4]">
        <PrintPDF
          nome_do_credor="Nome do Credor"
          valor_da_proposta="8000"
          nome_do_broker="Nome do Broker"
          foto_do_broker="/images/user/user-01.png"
        />
      </div>
    </div>
  );
};

export default PagePDF;
