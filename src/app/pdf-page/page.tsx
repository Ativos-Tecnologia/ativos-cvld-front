import { PrintPDF } from "@/components/PrintPDF";

const PagePDF = () => { 
	return (
		<PrintPDF
			nome="Nome do Broker"
			profissao="Profissão do Broker"
			foto="/images/user/user-01.png"
		/>
	);
}

export default PagePDF;