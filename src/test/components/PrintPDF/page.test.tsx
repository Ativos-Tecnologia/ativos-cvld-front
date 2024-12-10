import { PrintPDF } from "@/components/PrintPDF";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      pathname: "/pdf-page",
      route: "/pdf-page",
      asPath: "/pdf-page",
      query: {},
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "/pdf-page";
  },
}));

beforeEach(async () => {
  render(
    <QueryClientProvider client={(global as any).queryClient}>
			<PrintPDF
			nome_do_credor="Nome do Credor"
			valor_da_proposta="8000"
			profissao="Profissão do Broker"
			nome_do_broker="Nome do Broker"
			foto_do_broker="/images/user/user-01.png"
			/>
    </QueryClientProvider>,
  );
});

describe("Teste da página de geração de PDF", () => { 

	describe("Teste do Header do PDF", () => { 

		it("Deve aparecer uma imagem da logo no Header do PDF", async () => { 
			const img = await screen.findAllByRole("img");
			expect(img[0]).toBeInTheDocument();
			expect(img[0]).toHaveAttribute("src", "/images/logo/new-logo-text-dark.svg");
			expect(img[0]).toHaveAttribute("alt", "logo da ativos");
		});

		it("Deve aparecer uma imagem de fundo na borda do Header do PDF", async () => { 
			const img = await screen.findAllByRole("img");
			expect(img[1]).toBeInTheDocument();
			expect(img[1]).toHaveAttribute("src", "/_next/image?url=%2Fimages%2FbrokersPDF%2Fborda_do_header.webp&w=1920&q=75");
			expect(img[1]).toHaveAttribute("alt", "borda do header");
		});

		it("Deve aparecer o nome do credor no PDF", async () => { 
			const nomeCredor = await screen.findByTestId("nome_do_credor");
			expect(nomeCredor).toBeInTheDocument();
			expect(nomeCredor).toHaveAttribute("id", "nome_do_credor");
			expect(nomeCredor).toHaveClass(
				"uppercase",
				"items-center",
				"text-center",
			)
		});

	});

	describe("Teste de exibição dos dados do Credor", () => { 
		it("Deve aparecer o nome Receba Agora", async () => { 
			const nomeReceba = await screen.findByText(/receba/i);
			expect(nomeReceba).toBeInTheDocument();

			const nomeAgora = await screen.findByText(/agora:/i);
			expect(nomeAgora).toBeInTheDocument();
		});

		it("Deve aparecer texto indicando Em Até 5 Dias", async () => {
			const texto = await screen.findByText(/Em Até 5 Dias/i);
			expect(texto).toBeInTheDocument();
			expect(texto).toHaveClass(
				"uppercase",
				"text-title-md",
				"justify-center",
				"items-center",
				"p-5",
				"text-[#022062]",
			);
		});

		it("Deve aparecer texto indicando Próximos Passos", async () => {
			const texto = await screen.findByText(/Próximos Passos:/i);
			expect(texto).toBeInTheDocument();
			expect(texto).toHaveClass(
				"uppercase",
				"text-title-lg",
				"justify-center",
				"items-center",
				"p-5",
				"text-[#022062]",
			);
		});

		it("Deve aparecer texto indicando Aceite e envio da documentação", async () => {
			const texto = await screen.findByText(/Aceite e envio da documentação/i);
			expect(texto).toBeInTheDocument();
			expect(texto).toHaveClass(
				"uppercase",
				"text-sm",
				"justify-center",
				"items-center",
				"font-bold",
				"text-[#F4F4F4]",
		 );
		});

		it("Deve aparecer texto indicando Assinatura do Contrato", async () => {
			const texto = await screen.findByText(/Assinatura do Contrato/i);
			expect(texto).toBeInTheDocument();
			expect(texto).toHaveClass(
				"uppercase",
				"text-sm",
				"justify-center",
				"items-center",
				"font-bold",
				"text-[#F4F4F4]",
			);
		});

		it("Deve aparecer texto indicando Recebimento Instantâneo!", async () => {
			const texto = await screen.findByText(/Recebimento Instantâneo!/i);
			expect(texto).toBeInTheDocument();
			expect(texto).toHaveClass(
				"uppercase",
				"text-sm",
				"justify-center",
				"items-center",
				"font-bold",
				"text-[#F4F4F4]",
			);
		});

		it('Deve aparecer o texto proposta válida', async () => {
			const texto = await screen.findByText(/Proposta válida por 5 dias./i);
			expect(texto).toBeInTheDocument();
			expect(texto).toHaveClass(
				"text-title-sm2",
				"text-[#171717]"
			);
		});

		it("Deve aparecer uma imagem de fundo nos dados do credor", async () => { 
			const img = await screen.findAllByRole("img");
			expect(img[2]).toBeInTheDocument();
			expect(img[2]).toHaveAttribute("src", "/_next/image?url=%2Fimages%2FbrokersPDF%2Fbroker_section.webp&w=640&q=75");
			expect(img[2]).toHaveAttribute("alt", "imagem ilustrativa do cedente");
		});

		it("Deve conter um campo de input", async() =>{
			const input = await screen.findAllByRole("textbox");
			expect(input[0]).toBeInTheDocument();
		});
	});

	describe("Teste da segunda página com informações", () =>{

		it("Deve aparecer a logo da Ativos no inicio da página", async () => {
			const img = await screen.findAllByRole("img");
			expect(img[5]).toBeInTheDocument();
			expect(img[5]).toHaveAttribute("src", "/_next/image?url=%2Fimages%2FbrokersPDF%2Flogo-brokers.webp&w=1920&q=75");
			expect(img[5]).toHaveAttribute("alt", "logo da Ativos");
		});

		it("Deve aparecer um texto titulo após a logo da Ativos", async () => {
			const texto1 = await screen.findByText(/O que você/i);
			expect(texto1).toBeInTheDocument();

			const texto2 = await screen.findByText(/poderá fazer:/i);
			expect(texto2).toBeInTheDocument();
		});

	})

	describe("Teste de exibição dos cards de informação", () => {

		it("Deve aparecer um card com o título 'Um carro novo!'", async () => {
			const card = await screen.findByText(/Um carro novo!/i);
			expect(card).toBeInTheDocument();
		});

		it("Deve aparecer um card com o título 'Uma viagem dos sonhos!'", async () => {
			const card = await screen.findByText(/Uma viagem dos sonhos!/i);
			expect(card).toBeInTheDocument();
		});

		it("Deve aparecer um card com o título 'Investir em um novo negócio!'", async () => {
			const card = await screen.findByText(/Investir em um novo negócio!/i);
			expect(card).toBeInTheDocument();
		});

		it("Deve aparecer um card com o título 'Qualidade de vida!'", async () => {
			const card = await screen.findByText(/Qualidade de vida!/i);
			expect(card).toBeInTheDocument();
		});

	});

});