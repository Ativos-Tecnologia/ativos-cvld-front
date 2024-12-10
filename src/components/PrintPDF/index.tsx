import Image from "next/image";
interface IPrintPDFProps { 
	nome_do_credor: string;
	nome_do_broker: string;
	profissao: string;
	foto_do_broker: string;
	valor_da_proposta: string;
	phone?: string;
}


export function PrintPDF({ nome_do_credor, profissao, foto_do_broker: foto, valor_da_proposta, nome_do_broker, phone }: IPrintPDFProps) {
	
	 const whatsAppNumber = phone ? phone : "5581996871762";
	 const message = "Olá! Estou entrando em contato através do CellerApp e preciso tirar uma dúvida.";
	 const whatsappLink = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;
	
	
  return (
    <div className="col-span-2 mx-80 flex flex-col items-center bg-[#F4F4F4]">
      {/* Header com a imagem e logo da Ativos */}
		<header className="relative h-[440px] w-[1270px] bg-cover bg-no-repeat overflow-hidden" style={{ backgroundImage: "url('/images/brokersPDF/broker_header.webp" }}>
			<Image
				src={"/images/logo/new-logo-text-dark.svg"}
				alt="logo da ativos"
				width={200}
				height={50}
				className="relative z-10 -bottom-50 left-[600px]"
			/>
			<Image
				src={"/images/brokersPDF/borda_do_header.webp"}
				alt="borda do header"
				width={800}
				height={20}
				className="absolute left-0 -bottom-80 opacity-50 min-h-[550px]  w-full"
			/>
			<div className="absolute inset-0 bg-black-2 bg-opacity-50"></div>
		</header>

      {/* Nome do Broker */}
      <div className=" uppercase items-center text-center text-[55px] font-bold text- text-[#171717] justify-center p-10">
				<h1>{ nome_do_broker }</h1>
			</div>
			
		{/* Card */}
		<div className="flex flex-row justify-center items-center">
      {/* Proposta */}
			<div className="grid grid-cols-2 relative">	
					<div className="relative z-10">
						<div className="flex absolute bottom-9 left-[525px] justify-center items-center h-screen">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 800 80</section>0"
								fill="currentColor"
								className="w-8 h-8 rotate-90 text-[#022062]"
							>
								<path d="m303.98,466.17c14.83,4.82,29.95,8.94,44.33,14.85,4.75,1.95,7.62,8.5,11.34,12.94-4.66,3.6-8.85,9.32-14.05,10.47-31.56,6.95-63.55,11.98-95.01,19.31-59.32,13.83-118.28,29.25-177.63,42.95-15.35,3.54-31.59,3.82-47.46,4.21-5.76.14-12.23-2.81-17.31-6.03-11.34-7.16-10.74-16.92.87-23.6,2.91-1.67,6.08-3.1,9.32-3.93,84.73-21.87,169.45-43.77,254.28-65.28,9.72-2.46,20.03-2.62,30.07-3.84.42-.68.84-1.37,1.26-2.05ZM139.01,135.58c-1.92,3.79,2.36,12.48,6.16,17.09,12.31,14.91,26.19,28.52,38.54,43.39,39.27,47.27,77.48,95.43,117.52,142.03,11.99,13.96,27.85,25.16,43.52,35.13,5.81,3.69,17.24,2.4,23.99-.91,3.24-1.59,2.61-13.31,1.77-20.2-.6-4.93-3.64-10.16-6.97-14.09-49.73-58.66-99.33-117.44-149.92-175.36-9.98-11.43-23.64-19.85-36.27-28.7-5.72-4.01-13.09-5.67-21.65-9.19-5.72,3.39-14.07,5.65-16.69,10.81Zm389.72,103.48c-.58-3.81-1.11-7.63-1.75-11.43-8.43-49.99-16.58-100.02-25.44-149.93-3.53-19.88-7.6-39.79-13.33-59.12-4.26-14.35-18.48-20.86-32.26-17.88-15.31,3.31-12.79,15.46-11.75,25.53,5.91,57.6,11.95,115.21,19.02,172.68,2.37,19.3,2.52,39.47,16.45,56.07,9.02,10.75,19.37,21.79,32.42,14.87,9.1-4.82,13.37-18.72,19.8-28.57-1.05-.74-2.1-1.49-3.16-2.23ZM198.48,780.62c52.65-33.61,104.97-67.73,157.35-101.76,3.63-2.36,7.23-4.98,10.21-8.09,8.54-8.9,7.44-16.99-2.87-24.04-11.94-8.17-27.39-8.07-40.9,1.19-54.32,37.22-108.64,74.47-162.53,112.31-5.5,3.86-12.83,14.7-11.24,17.22,4.32,6.85,12.97,10.96,20.23,16.4,11.54-5.04,21.43-7.9,29.76-13.22Z" />
							</svg>
						</div>
						<p className="text-title-sm2 text-[#171717]">*Proposta válida por 5 dias.</p>
						<Image
						src={"/images/brokersPDF/broker_section.webp"}
						alt="imagem ilustrativa do cedente"
						width={300}
						height={150}
						/>
				</div>

			{/* Dados do Cedente */}
			<div className="text-center p-2 gap-5 bg-cover rounded-xl max-w-[500px] h-fit relative -left-10" style={{ backgroundImage: "url('/images/brokersPDF/bg-form.webp')" }}>
					<h2 className="p-10 text-[70px] text-center font-extrabold text-[#022062]">
								receba
								<br />
								agora:
					</h2>
					{/* Input com o nome do Cedente */}
					<div>
						<input type="text" className="bg-[#D1E1F5] w-[280px] h-[50px] text-3xl tracking-[0.5rem] rounded-lg text-center" value={valor_da_proposta} disabled />
							<p className="uppercase text-title-md justify-center items-center p-5 font-bold text-[#022062]"> Em Até 5 Dias </p>
							<hr className="bg-[#8AD8EF] h-[5px] -mr-2 "/>
							<p className="uppercase text-title-lg justify-center items-center p-5 font-bold text-[#022062]" >Próximos Passos:</p>
						<div className="flex flex-col gap-4 p-5">
						<span className="uppercase text-sm justify-center items-center font-bold text-[#F4F4F4]">Aceite e envio da documentação</span>
							<div className="flex justify-center items-center">
								<Image
									src={"/images/brokersPDF/seta.png"}
									alt="seta indicando o próximo passo"
									width={20}
									height={20}
									className="rotate-90"
								/>
							</div>
						<span className="uppercase text-sm justify-center items-center font-bold text-[#F4F4F4]">Assinatura do Contrato</span>
						<div className="flex justify-center items-center">
									<Image
										src={"/images/brokersPDF/seta.png"}
										alt="seta indicando o próximo passo"
										width={20}
										height={20}
										className="rotate-90"
									/>
								</div>
							<span className="uppercase text-sm justify-center items-center font-bold text-[#F4F4F4]">Recebimento Instantâneo!</span>
						</div>		
					</div>
				</div>
			</div>	
		</div>
			
    {/* Card com Nome e Profissão com a Foto do Perfil do Broker */}
	<div className="p-20 flex gap-5 items-center justify-center">
		<div className="w-35 h-35 rounded-full">
					<Image
						src={ foto }
						alt="foto de perfil do broker"
						width={130}
						height={130}
					/>
					<Image
						src={"/images/brokersPDF/ok.webp"}
						alt="seta indicando o próximo passo"
						width={30}
						height={20}
						className="relative -top-33 left-25"
					/>
		</div>
		<div className="flex flex-col font-bold text-[#171717] text-title-sm uppercase">
				<span>{ nome_do_credor }</span>
				<span>{ profissao }</span>
		</div>
	</div>

      {/* Segunda Página do PDF */}
  <section className=" bg-cover mx-auto" style={{ backgroundImage: "url('/images/brokersPDF/bg-brokers.webp')" }} >
				
			<div className=" m-10 flex flex-col mt-15 mb-15.5 rounded-[50px] border-b-black-2 bg-[#F4F4F4]">
					
					<div className="flex justify-center relative">
						<Image
							src={"/images/brokersPDF/logo-brokers.webp"}
							alt="logo da Ativos"
							width={900}
							height={500}
							className=" absolute h-fit -top-30 object-cover object-center"
						/>
			</div>

      <h1 className="text-center text-[58px] mt-50 text-[#263DBF]">O que você <b className="font-bold ">poderá fazer:</b> </h1>

			<div className="flex flex-col">
						
        <div className="flex flex-col-2 p-8 gap-2">
          <div>
            <Image
							src={"/images/brokersPDF/carro-brokers.webp"}
							alt="representando a compra de um carro"
							width={300}
							height={50}
							className="rounded-lg"
						/>
          </div>
          <div className=" justify-center items-center p-5">
            <h2 className="text-[#263DBF] font-bold text-[28px]">Um carro novo!</h2>
            <p className="text-title-sm text-[#171717]">
              Um carro novo é o conforto e <span className="font-bold">segurança</span> que você e sua
              familia precisa para aproveitar a vida!
            </p>
          </div>
					</div>
					
       <div className="flex flex-col-2 p-8 gap-2">
          <div>
            <Image
							src={"/images/brokersPDF/viagem-brokers.webp"}
							alt="representando viagem"
							width={300}
								height={50}
								className="rounded-lg"
						/>
          </div>
          <div className=" justify-center items-center p-5">
            <h2 className="text-[#263DBF] font-bold text-[28px]">Uma viagem dos sonhos!</h2>
            <p className="text-title-sm text-[#171717]">
              Sabe aquele lugar que você sempre teve vontade de viajar? Faça as
              malas, <span className="font-bold">agora você pode!</span>
            </p>
          </div>
						</div>
						
        <div className="flex flex-col-2 p-8 gap-2">
          <div>
            <Image
							src={"/images/brokersPDF/investir-brokers.webp"}
							alt="representando investimentos"
							width={315}
							height={50}
							className="rounded-lg"
						/>
          </div>
          <div className=" justify-center items-center p-5">
            <h2 className="text-[#263DBF] font-bold text-[28px]">Investir em um novo negócio!</h2>
            <p className="text-title-sm text-[#171717]">
              <span className="font-bold">Multiplique o valor</span> antecipado do seu precatório
              começando um novo negócio local para você!
            </p>
          </div>
				</div>
				<div className="flex flex-col-2 p-8 gap-2">
					<div>
						<Image
							src={"/images/brokersPDF/qualidade-brokers.webp"}
							alt="representando investimentos"
							width={285}
							height={50}
							className="rounded-lg"
						/>
					</div>
					<div className="justify-center items-center p-5">
						<h2 className="text-[#263DBF] font-bold text-[28px]">Qualidade de vida!</h2>
						<p className="text-title-sm text-[#171717] whitespace-normal break-words">
							Ajudar parentes, melhorar a educação dos seus filhos, quitar uma
							divida,
						</p>
						<p className="text-title-sm text-[#171717] whitespace-normal break-words">
							enfim, <span className="font-bold">ganhe paz e dê qualidade de vida</span> para
							a sua familia!
						</p>
					</div>
				</div>
						
			</div>
			<a href={whatsappLink} className="w-full flex items-center p-10 justify-center">
				<Image
						src={"/images/brokersPDF/zap-brokers.webp"}
						alt="Whatssapp"
						width={90}
						height={30}
						className=" items-center"
					/>
				<Image
						src={"/images/brokersPDF/hand-brokers.webp"}
						alt="hand"
						width={40}
						height={30}
						className="items-center relative -left-5"
					/>
				</a>
		  </div>
				<footer className="flex w-full justify-center items-center text-center ">
					<span className=" mb-10 text-[28px] text-[#F4F4F4] tracking-[0.2em] font-bold">ativosprecatorios.com.br</span>
				</footer>
  </section>
    </div>
  );
}