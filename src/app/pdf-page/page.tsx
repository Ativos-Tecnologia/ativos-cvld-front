import { PrintPDF } from "@/components/PrintPDF";

const PagePDF = () => { 
	return (
		<>
			{/* <br />
			PrintComponent() */}
		<PrintPDF
			nome_do_credor="Nome do Broker"
			valor_da_proposta="8000"
			profissao="Profissão do Broker"
			nome_do_broker="Nome do Broker"
			foto_do_broker="/images/user/user-01.png"
		/>
		</>
	);
}

export default PagePDF;