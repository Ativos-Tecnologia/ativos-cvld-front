import Image from "next/image";

export function PrintPDF() {

  return (
    <div className="col-span-2 grid p-10 items-center bg-[#F4F4F4]">
      {/* Header com a imagem e logo da Ativos */}
		<header className="relative w-full min-h-[440px] bg-cover bg-no-repeat overflow-hidden" style={{ backgroundImage: "url('/images/brokersPDF/broker_header.webp" }}>
			<Image
				src={"/images/brokersPDF/borda_do_header.webp"}
				alt="borda do header"
				width={800}
				height={20}
				className="absolute left-0 -bottom-80 opacity-50 min-h-[550px]  w-full"
				/>
			<div className="absolute inset-0 bg-black bg-opacity-30"></div>
		</header>

      {/* Nome do Broker */}
      <div className=" uppercase items-center text-center text-[55px] font-bold text- text-[#171717] justify-center p-10">
        <h1>Nome do Cedente</h1>
			</div>
			
		{/* Card */}
		<div className="flex flex-row justify-center items-center">
      {/* Proposta */}
			<div className="grid grid-cols-2 relative">	
				<div className="relative z-10">
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
						<input type="text" className="bg-[#D1E1F5] w-[280px] h-[50px] text-lg rounded-lg" />
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
						<div className="w-32 h-32 rounded-full">
								<Image
									src={"/images/user/user-01.png"}
									alt="foto de perfil do broker"
									width={128}
									height={128}
								/>
						</div>
						<div className="flex flex-col font-bold text-[#171717] text-title-sm uppercase">
							<span>Fulanto de Tal</span>
              <span>Gerente Comercial</span>
						</div>
					</div>

      {/* Segunda Página do PDF */}
      <section className=" bg-cover" style={{ backgroundImage: "url('/images/brokersPDF/bg-brokers.webp')" }} >
				<div className=" m-10 rounded-lg bg-[#F4F4F4]">
					<div className=" flex items-center justify-center">
						<Image
							src={"/images/brokersPDF/logo-brokers.webp"}
							alt="borda do header"
							width={800}
							height={20}
						/>

          </div>

        <h1 className="text-center text-[38px] -mt-20 text-[#263DBF]">O que você <b className="font-bold ">poderá fazer:</b> </h1>

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
			<div className="w-full flex items-center p-10 justify-center">
				<Image
						src={"/images/brokersPDF/zap-brokers.webp"}
						alt="Whatssapp"
						width={90}
						height={30}
						className=" items-center"
					/>
				</div>
		</div>
				<footer className="flex w-full justify-center items-center text-center ">
					<span className=" mb-10 text-[28px] text-[#F4F4F4] tracking-[0.2em] font-bold">ativosprecatorios.com.br</span>
				</footer>
      </section>
    </div>
  );
}