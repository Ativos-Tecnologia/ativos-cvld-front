// import { useRef } from "react";
// import { useReactToPrint } from "react-to-print";

// interface IPrintPDFProps { 
// 	result: {};
// }

// export function PrintPDF({ result }: IPrintPDFProps) {
// 	const componentRef = useRef();

// 	const handlePrint = useReactToPrint({
// 		contentRef: () => componentRef.current || {},
// 		// documentTitle: `${result.fullName}-resume}`,
// 		// onAfterPrint: () => alert('Print Successful!'),
// 	});

// 	// const replaceWithBr = (string) => string.replace(/\n/g, '<br />');

// 	if (JSON.stringify(result) === '{}') {
// 		return "Erro ao imprimir o PDF";
// 	}
// }