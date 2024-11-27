import { MainFooter } from "@/components/Footer";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      pathname: "/",
      route: "/",
      asPath: "/",
      query: {},
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "/";
  },
}));

beforeEach(async () => {
		render(
			<QueryClientProvider client={(global as any).queryClient}>
				<MainFooter />
			</QueryClientProvider>,
		);
	});

describe("Teste do componente MainFooter", () => { 
		describe("Teste do titulo do footer", () => { 
			it("Deve renderizar o titulo do footer", async () => { 
        const title = await screen.getByText("sobre a Ativos");
				expect(title).toBeInTheDocument();
			});
		});
	describe("Teste do texto do footer", () => { 
		it("Deve renderizar o texto do footer", async () => { 
			const text = await screen.getByText("Presente em todo Brasil, a Ativos é sua empresa ideal que promove o desenvolvimento de novas tecnologias para compra e venda de precatórios, gestão de ativos judiciais, segurança jurídica e novos negócios.");
			expect(text).toBeInTheDocument();
		});
	});

	describe("Teste do bloco Sobre", () => { 
		it("Deve renderizar o bloco Sobre", async () => { 
			const block = await screen.getByText("Sobre");
			expect(block).toBeInTheDocument();
			expect(block).toHaveClass("text-snow");
		});

		it("Deve renderizar o link Ativos", async () => { 
			const ativos = await screen.getAllByText("Ativos");
			expect(ativos[0]).toBeInTheDocument();
		});

		it("Deve renderizar o link Missão", async () => { 
			const missao = await screen.getAllByText("Missão");
			expect(missao[0]).toBeInTheDocument();
		});

		it("Deve renderizar o link Visão", async () => { 
			const visao = await screen.getAllByText("Visão");
			expect(visao[0]).toBeInTheDocument();
		});

		it("Deve renderizar o link Contato", async () => { 
			const contato = await screen.getAllByText("Contato");
			expect(contato[0]).toBeInTheDocument();
		});
	});

	describe("Teste do bloco Produtos", () => { 

		it("Deve renderizar o bloco Produtos", async () => { 
			const block = await screen.getByText("Produtos");
			expect(block).toBeInTheDocument();
			expect(block).toHaveClass("text-snow");
		});

		it("Deve renderizar o link do CelerApp", async () => { 
			const cellerApp = await screen.getAllByText("CelerApp");
			expect(cellerApp[0]).toBeInTheDocument();
		});

		it("Deve renderizar o link do Lead Magnet", async () => { 
			const leadMagnet = await screen.getAllByText("Lead Magnet");
			expect(leadMagnet[0]).toBeInTheDocument();
		});

		it("Deve renderizar o link do Recalculador", async () => { 
			const recalculador = await screen.getAllByText("Recalculador do TRF1");
			expect(recalculador[0]).toBeInTheDocument();
		});

	});

	describe("Teste do bloco Contato", () => { 

		it("Deve renderizar o bloco Contato", async () => { 
			const contato = await screen.getAllByText("Contato");
			expect(contato[0]).toBeInTheDocument();
		});

		it("Deve renderizar o titulo de Atendimento ao Investidor", async () => { 
			const title = await screen.getByRole("heading", { name: "Atendimento ao Investidor", level: 3 });
			expect(title).toBeInTheDocument();
		});

		it("Deve renderizar o link de WhatsApp", async () => {
			const zap = await screen.getAllByText("Acesse o WhatsApp");
			expect(zap[0]).toBeInTheDocument();
		});

		it("Deve renderizar o link de Horario de Atendimento", async () => { 
			const horario = await screen.getAllByText("Das 9h ás 18h (dias úteis)");
			expect(horario[0]).toBeInTheDocument();
		});

		it("Deve renderizar oo titulo de Email", async () => { 
			const email = await screen.getByText("Email");
			expect(email).toBeInTheDocument();
		});

		it("Deve renderizar o link de Email", async () => {
			const link = await screen.getByText("contato@ativosprecatorios.com.br");
			expect(link).toBeInTheDocument();
		});

		it("Deve renderizar onde nos encontrar", async () => { 
			const title = await screen.getByText("Onde nos encontrar");
			expect(title).toBeInTheDocument();
		});

		it("Deve renderizar o link de Endereço", async () => {
			const link = await screen.getByText("Av. Fernando Simões Barbosa, 266, 8º andar, sala 308 - Boa Viagem");
			expect(link).toBeInTheDocument();
		});
	});

	});