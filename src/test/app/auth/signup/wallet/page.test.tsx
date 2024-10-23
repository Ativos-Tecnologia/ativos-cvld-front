import SignUpWallet from "@/app/auth/signup/wallet/page";
import { beforeEach } from "@jest/globals";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";

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
      <SignUpWallet/>
    </QueryClientProvider>,
  );
});

describe("Teste de Formulário de Cadastro na Wallet", () => {
  it("Carregar titulos da página de registro", async () => {
    const titulo = await screen.findByText(/Sua solução/i);
    expect(titulo).toBeInTheDocument();

    const titulo2 = await screen.findByText(/one-stop-shop/i);
    expect(titulo2).toBeInTheDocument();

    const titulo3 = await screen.findByText(/em precatórios/i);
    expect(titulo3).toBeInTheDocument();
  })

  it("Verficar titulo do formulário", async () => {
    const tituloDoFormulário = await screen.findByRole("heading", {
      name: "Cadastre-se na Wallet",
      level: 2,
    });
    expect(tituloDoFormulário).toBeInTheDocument();
  })

  it("Carregar labels do formulário", async () => {
    const nomeUsuario = await screen.findByText("Nome de usuário");
    expect(nomeUsuario).toBeInTheDocument();

    const email = await screen.findByText("Email");
    expect(email).toBeInTheDocument();

    const nomeCompletoRepresentante1 = await screen.findAllByText(/Nome Completo/i)
    expect(nomeCompletoRepresentante1[0]).toBeInTheDocument();

    const selectElement = await screen.findByRole("combobox");
    expect(selectElement).toBeInTheDocument();

    const selectCPF = await screen.findByRole("option", { name: "CPF" });
    expect(selectCPF).toBeInTheDocument();

    const selectCNPJ = await screen.findByRole("option", { name: "CNPJ" });
    expect(selectCNPJ).toBeInTheDocument();

    // Testa o formulário dinâmico, onde ao selecionar o CNPJ, aparecerá novos campos.
    fireEvent.change(selectElement, { target: { value: "CNPJ" } });

    const representate = await screen.findByRole("heading", {
      name: "Dados do Representante Legal", level: 3,
    });
    expect(representate).toBeInTheDocument();

    const nomeCompletoRepresentante2 = await screen.findAllByText(/Nome Completo/i)
    expect(nomeCompletoRepresentante2[1]).toBeInTheDocument();

    const cpfRepresentante = await screen.findAllByText(/CPF/i);
    expect(cpfRepresentante[1]).toBeInTheDocument();

    const zap = await screen.findByText("Whatsapp");
    expect(zap).toBeInTheDocument();

    const banco = await screen.findByText("Banco");
    expect(banco).toBeInTheDocument();

    const agencia = await screen.findByText("Agência");
    expect(agencia).toBeInTheDocument();

    const contaCorrente = await screen.findByText("Conta Corrente");
    expect(contaCorrente).toBeInTheDocument();

    const pix = await screen.findByText("Pix");
    expect(pix).toBeInTheDocument();

    const senha = await screen.findAllByText(/Senha/i);
    expect(senha[0]).toBeInTheDocument();

    const confirmSenha = await screen.findByText("Confirmar senha");
    expect(confirmSenha).toBeInTheDocument();
  });
})
