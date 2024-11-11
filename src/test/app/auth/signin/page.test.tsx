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
  usePathname() {
    return "/";
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

/**
 * No contexto atual dos testes, o formulário para ser testado, é necessário que clique no botão de "Acesse sua conta".
 */

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
    const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

    expect(acessarSuaConta).toBeInTheDocument();

    await userEvent.click(acessarSuaConta);

    const modal = await waitFor(() => screen.getByRole("dialog"));
    expect(modal).toBeInTheDocument();

    const tituloDoFormulário = await screen.findByRole("heading", {
      name: "Acesse sua conta",
      level: 2,
    });
    expect(tituloDoFormulário).toBeInTheDocument();
  });

  it("Teste acessar sua conta com botão inicial", async () => {
    const acessarSuaConta = screen.getByText(/Acesse sua conta/i);
    //Verifico se o botão existe pelo texto.
    expect(acessarSuaConta).toBeInTheDocument();
    // Se ele existir, será feito o teste do clique.
    await userEvent.click(acessarSuaConta);
    // Verifico se o modal irá abrir após o clique.
    const modal = await waitFor(() => screen.getByRole("dialog"));
    expect(modal).toBeInTheDocument();
  })

  it("Carregar labels do formulário", async () => {
    const acessarSuaConta = screen.getByText(/Acesse sua conta/i);
 
    expect(acessarSuaConta).toBeInTheDocument();
    
    await userEvent.click(acessarSuaConta);
 
    const modal = await waitFor(() => screen.getByRole("dialog"));
    expect(modal).toBeInTheDocument();

    const usuario = await screen.findByPlaceholderText("Digite o usuário");
    expect(usuario).toBeInTheDocument();

    const senha = await screen.findByPlaceholderText("Digite a sua senha");
    expect(senha).toBeInTheDocument();

    const possuiConta = screen.getByText(/Ainda não possui conta?/i);
    expect(possuiConta).toBeInTheDocument();

    const crieConta = screen.getByText(/Crie uma conta agora/i);
    expect(crieConta).toBeInTheDocument();
  });

  it("Verificar o Esqueci a senha", async () => {

    const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

    expect(acessarSuaConta).toBeInTheDocument();

    await userEvent.click(acessarSuaConta);

    const modalLogin = await waitFor(() => screen.getByRole("dialog"));
    expect(modalLogin).toBeInTheDocument();

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

    const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

    expect(acessarSuaConta).toBeInTheDocument();

    await userEvent.click(acessarSuaConta);

    const modalLogin = await waitFor(() => screen.getByRole("dialog"));
    expect(modalLogin).toBeInTheDocument();
    
    const inputUsuario = (await screen.findByPlaceholderText(
      "Digite o usuário",
    )) as HTMLInputElement;

    fireEvent.change(inputUsuario, { target: { value: "usuarioTest" } });
    expect(inputUsuario.value).toBe("usuarioTest");

    const inputSenha = (await screen.getByPlaceholderText(
      "Digite a sua senha",
    )) as HTMLInputElement;

    fireEvent.change(inputSenha, { target: { value: "senhaTest" } });
    expect(inputSenha.value).toBe("senhaTest");

    const acessar = screen.getByText(/Acessar/i);

    expect(acessar).toBeInTheDocument();
    await userEvent.click(acessar);
  });
});
