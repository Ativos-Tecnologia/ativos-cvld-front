import SignIn from "@/app/auth/signin/page";
import { beforeEach } from "@jest/globals";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Coloca como padrão e sobrescreve cada método de teste.
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
}));

// Antes de cada teste, o componente principal da UI será rendizado
beforeEach(async () => {
  render(
    <QueryClientProvider client={(global as any).queryClient}>
      <SignIn />
    </QueryClientProvider>,
  );
});

describe("Teste dos Headers do Login", () => {
  it("Carregar o titulo da página", async () => {
    // Buscando pelo título que tem quebras de linha
    const titulo = await screen.findByText(/Sua solução/i);
    expect(titulo).toBeInTheDocument();

    const titulo2 = await screen.findByText(/one-stop-shop/i);
    expect(titulo2).toBeInTheDocument();

    const titulo3 = await screen.findByText(/em precatórios/i);
    expect(titulo3).toBeInTheDocument();
  });

  it("Carregar o titulo do formulário", async () => {
    const tituloDoFormulário = await screen.findByRole("heading", {
      name: "Acesse sua conta",
      level: 2,
    });
    expect(tituloDoFormulário).toBeInTheDocument();
  });

  it("Carregar labels do formulário", async () => {
    const usuario = await screen.findByText("Usuário");
    expect(usuario).toBeInTheDocument();

    const senha = await screen.findByText("Senha");
    expect(senha).toBeInTheDocument();
  });

  it("Verificar o Esqueci a senha", async () => {
    const esqueciSenha = screen.getByText(/Esqueci a senha/i);
    //Verifico se o botão existe pelo texto.
    expect(esqueciSenha).toBeInTheDocument();
    // Se ele existir, será feito o teste do clique.
    await userEvent.click(esqueciSenha);
    // Verifico se o modal irá abrir após o clique.
    const modal = await waitFor(() => screen.getByRole("dialog"));
    expect(modal).toBeInTheDocument();
  });

  it("Verificar o acesso para aplicação", async () => {
    const inputUsuario = screen.getByLabelText(/Usuário/i) as HTMLInputElement;

    fireEvent.change(inputUsuario, { target: { value: "usuarioTest" } });
    expect(inputUsuario.value).toBe("usuarioTest");

    const inputSenha = screen.getByLabelText(/Senha/i) as HTMLInputElement;

    fireEvent.change(inputSenha, { target: { value: "senhaTest" } });
    expect(inputSenha.value).toBe("senhaTest");

    const acessar = screen.getByText(/Acessar/i);

    expect(acessar).toBeInTheDocument();
    await userEvent.click(acessar);
  });
});
