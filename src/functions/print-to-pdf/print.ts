// import { useRef } from "react";
// import { useReactToPrint } from "react-to-print";

// export function PrintComponent(document: HTMLDivElement) {
	
//   const ref = useRef<HTMLDivElement>(document);

//   const print = useReactToPrint({
//     contentRef: () => ref.current,
//     documentTitle: "Proposta de Broker",
//     onAfterPrint: () => alert("PDF gerado com sucesso!"),
//   });

//   return print;
// }