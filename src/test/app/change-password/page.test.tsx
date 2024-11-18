import ChangePassword from "@/app/change-password/page";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
      <ChangePassword />
    </QueryClientProvider>,
  );
});

describe("Testes na Redefinição de Senha", () => {
	describe("Teste do titulo da página", () => {
		it("Teste carregar o título da página", async () => {
      const titulo = await screen.findByText(/Redefinição de senha/i);
      expect(titulo).toBeInTheDocument();
		});
		
		it("Teste carregar o título do formulário", async () => {
      const tituloDoFormulario = await screen.findByRole("heading", {
        name: "Redefinição de senha",
        level: 2,
      });
      expect(tituloDoFormulario).toBeInTheDocument();
    });
	})
	
	describe("Teste para carregar as labels do formulário", () => { 
		it("Teste para carregar Nova Senha", async () => {
      const senha = await screen.findByText("Nova senha");
      expect(senha).toBeInTheDocument();
		});
		
		it("Teste para carregar Repita Nova Senha", async () => {
			const confirmarSenha = await screen.findByText("Repita a nova senha");
      expect(confirmarSenha).toBeInTheDocument();
		 });

	});
	
	describe("Teste do botão do formulário", () => { 
		it("Teste para carregar o botão de redefinir senha", async () => {
      const botao = await screen.findByRole("button", {
        name: "Confirmar",
      });
      expect(botao).toBeInTheDocument();
    });
	});

	describe("Teste de sucesso do input do formulário", () => { 
		it("Teste para inserir e redefinir a senha", async () => {
      const inputSenha = screen.getAllByLabelText(
        /Nova senha/i,
      ) as HTMLInputElement[];
      const inputConfirmarSenha = screen.getAllByLabelText(
        /Repita a nova senha/i,
      ) as HTMLInputElement[];
      const botao = screen.getByRole("button", {
        name: "Confirmar",
      });

      fireEvent.change(inputSenha[0], { target: { value: "testeNovaSenha" } });
      expect(inputSenha[0].value).toBe("testeNovaSenha");

      fireEvent.change(inputConfirmarSenha[0], {
        target: { value: "testeNovaSenha" },
      });
      expect(inputConfirmarSenha[0].value).toBe("testeNovaSenha");

      expect(inputSenha[0]).toBeInTheDocument();
      expect(inputConfirmarSenha[0]).toBeInTheDocument();
      expect(botao).toBeInTheDocument();

      expect(inputSenha[0].value).toBe("testeNovaSenha");
      expect(inputConfirmarSenha[0].value).toBe("testeNovaSenha");
    });
	});

	describe("Teste de erro do input do formulário", () => { 
		it("Teste para inserir e redefinir a senha", async () => {
      const inputSenha = screen.getAllByLabelText(
        /Nova senha/i,
      ) as HTMLInputElement[];
  
      const botao = screen.getByRole("button", {
        name: "Confirmar",
			});
			expect(botao).toBeInTheDocument();

      fireEvent.change(inputSenha[0], { target: { value: 123 } });
			expect(inputSenha[0].value).toBe("123");
      await userEvent.click(botao);
    });
	});

 });