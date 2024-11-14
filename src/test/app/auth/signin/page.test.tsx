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

describe("Teste do Login", () => {
  describe("Teste do Titulo da Página", () => {
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
  });

  describe("Teste de acesso ao Login", () => {
    it("Teste acessar sua conta com botão inicial", async () => {
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);
      //Verifico se o botão existe pelo texto.
      expect(acessarSuaConta).toBeInTheDocument();
      // Se ele existir, será feito o teste do clique.
      await userEvent.click(acessarSuaConta);
      // Verifico se o modal irá abrir após o clique.
      const modal = await waitFor(() => screen.getByRole("dialog"));
      expect(modal).toBeInTheDocument();
    });
  });

  describe("Teste de das labels e classes do formulário", () => {
    it("Teste acessar sua conta com botão inicial", async () => {
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

      expect(acessarSuaConta).toBeInTheDocument();
      expect(acessarSuaConta).toHaveClass("relative", "z-20", "text-white");
    });

    it("Teste da label do campo de Usuário", async () => {
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

      expect(acessarSuaConta).toBeInTheDocument();
      expect(acessarSuaConta).toHaveClass("relative", "z-20", "text-white");

      await userEvent.click(acessarSuaConta);

      const modal = await waitFor(() => screen.getByRole("dialog"));
      expect(modal).toBeInTheDocument();

      const usuario = await screen.findByPlaceholderText("Digite o usuário");
      expect(usuario).toBeInTheDocument();
      expect(usuario).toHaveClass(
        "w-full",
        "rounded-lg",
        "border",
        "border-stroke",
        "bg-transparent",
        "py-2.5",
        "pl-4",
        "pr-10",
        "text-black",
        "outline-none",
        "focus:border-primary",
        "focus-visible:shadow-none",
      );

    });

    it("Teste da label do campo de Senha", async () => {
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

      expect(acessarSuaConta).toBeInTheDocument();
      expect(acessarSuaConta).toHaveClass("relative", "z-20", "text-white");

      await userEvent.click(acessarSuaConta);

      const modal = await waitFor(() => screen.getByRole("dialog"));
      expect(modal).toBeInTheDocument();

      const senha = await screen.findByPlaceholderText("Digite a sua senha");
      expect(senha).toBeInTheDocument();
      expect(senha).toHaveClass(
        "w-full",
        "rounded-lg",
        "border",
        "border-stroke",
        "bg-transparent",
        "py-2.5",
        "pl-4",
        "pr-10",
        "text-black",
        "outline-none",
        "focus:border-primary",
        "focus-visible:shadow-none",
      );
    });

    it("Teste da label Não possui conta", async () => {
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

      expect(acessarSuaConta).toBeInTheDocument();
      expect(acessarSuaConta).toHaveClass("relative", "z-20", "text-white");

      await userEvent.click(acessarSuaConta);

      const modal = await waitFor(() => screen.getByRole("dialog"));
      expect(modal).toBeInTheDocument();

      const possuiConta = screen.getByText(/Ainda não possui conta?/i);
      expect(possuiConta).toBeInTheDocument();
    });

    it("Teste da label Crie a sua conta.", async () => {
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

      expect(acessarSuaConta).toBeInTheDocument();
      expect(acessarSuaConta).toHaveClass("relative", "z-20", "text-white");

      await userEvent.click(acessarSuaConta);

      const modal = await waitFor(() => screen.getByRole("dialog"));
      expect(modal).toBeInTheDocument();

      const crieConta = screen.getByText(/Crie uma conta agora/i);
      expect(crieConta).toBeInTheDocument();
      expect(crieConta).toHaveClass("text-[#0838bb]");
    });

    it("Verificar Label Esqueci a senha", async () => {
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
  });

  describe("Teste de input dos Login", () => {
    it("Teste do input de Usuário", async () => {
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

      expect(acessarSuaConta).toBeInTheDocument();

      await userEvent.click(acessarSuaConta);

      const modal = await waitFor(() => screen.getByRole("dialog"));
      expect(modal).toBeInTheDocument();

      const usuario = await screen.findByPlaceholderText("Digite o usuário");
      expect(usuario).toBeInTheDocument();
    });

    it("Teste do input de Senha", async () => {
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

      expect(acessarSuaConta).toBeInTheDocument();

      await userEvent.click(acessarSuaConta);

      const modal = await waitFor(() => screen.getByRole("dialog"));
      expect(modal).toBeInTheDocument();

      const senha = await screen.findByPlaceholderText("Digite a sua senha");
      expect(senha).toBeInTheDocument();
    });
  });

  describe("Teste de acesso ao Login", () => {
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

  describe("Teste de validação do Login", () => {  
    it("Verificar validação de Usuário", async () => { 
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

      expect(acessarSuaConta).toBeInTheDocument();

      await userEvent.click(acessarSuaConta);

      const modalLogin = await waitFor(() => screen.getByRole("dialog"));
      expect(modalLogin).toBeInTheDocument();

      const inputUsuario = (await screen.findByPlaceholderText(
        "Digite o usuário",
      )) as HTMLInputElement;

      fireEvent.change(inputUsuario, { target: { value: "usuario erro" } });
      expect(inputUsuario.value).toBeInvalid;
    });

    it("Verificar Erro quando Usuário logar com campo vazio de Username", async () => { 
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

      expect(acessarSuaConta).toBeInTheDocument();

      await userEvent.click(acessarSuaConta);

      const modalLogin = await waitFor(() => screen.getByRole("dialog"));
      expect(modalLogin).toBeInTheDocument();

      const inputUsuario = (await screen.findByPlaceholderText(
        "Digite o usuário",
      )) as HTMLInputElement;

      fireEvent.change(inputUsuario, { target: { value: " " } });
      expect(inputUsuario.value).toBeInvalid;
    });

    it("Verificar validação de Senha", async () => { 
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

      expect(acessarSuaConta).toBeInTheDocument();

      await userEvent.click(acessarSuaConta);

      const modalLogin = await waitFor(() => screen.getByRole("dialog"));
      expect(modalLogin).toBeInTheDocument();

      const inputSenha = (await screen.getByPlaceholderText(
        "Digite a sua senha",
      )) as HTMLInputElement;

      fireEvent.change(inputSenha, { target: { value: "123" } });
      expect(inputSenha.value).toBeInvalid;
    });

    it("Verificar validação de Senha caso o Usuário tente entrar com o campo vazio", async () => { 
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

      expect(acessarSuaConta).toBeInTheDocument();

      await userEvent.click(acessarSuaConta);

      const modalLogin = await waitFor(() => screen.getByRole("dialog"));
      expect(modalLogin).toBeInTheDocument();

      const inputSenha = (await screen.getByPlaceholderText(
        "Digite a sua senha",
      )) as HTMLInputElement;

      fireEvent.change(inputSenha, { target: { value: " " } });
      expect(inputSenha.value).toBeInvalid;
    });
  })

  describe("Teste do Footer do Login", () => {
    it("Verificar o Lead Magnet do Footer", async () => {
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

      expect(acessarSuaConta).toBeInTheDocument();

      await userEvent.click(acessarSuaConta);

      const modalLogin = await waitFor(() => screen.getByRole("dialog"));
      expect(modalLogin).toBeInTheDocument();

      const leadMagnet = screen.getByText(/Lead Magnet/i);
      expect(leadMagnet).toBeInTheDocument();
      expect(leadMagnet).toHaveClass(
        "group",
        "relative",
        "transition-colors",
        "duration-200",
        "hover:text-bodydark1",
      );
      expect(leadMagnet).toHaveAttribute("href", "/automated-proposal");
      expect(leadMagnet).toHaveAttribute("target", "_blank");
    });

    it("Verificar o Recalculador do TRF1 do Footer", async () => {
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

      expect(acessarSuaConta).toBeInTheDocument();

      await userEvent.click(acessarSuaConta);

      const modalLogin = await waitFor(() => screen.getByRole("dialog"));
      expect(modalLogin).toBeInTheDocument();

      const recalculadorTrf1 = screen.getByText(/Recalculador do TRF1/i);
      expect(recalculadorTrf1).toBeInTheDocument();
      expect(recalculadorTrf1).toHaveClass(
        "group",
        "relative",
        "transition-colors",
        "duration-200",
        "hover:text-bodydark1",
      );
      expect(recalculadorTrf1).toHaveAttribute("href", "/retification");
      expect(recalculadorTrf1).toHaveAttribute("target", "_blank");
    });

    it("Verificar o Politica de Privacidade do Footer", async () => {
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

      expect(acessarSuaConta).toBeInTheDocument();

      await userEvent.click(acessarSuaConta);

      const modalLogin = await waitFor(() => screen.getByRole("dialog"));
      expect(modalLogin).toBeInTheDocument();

      const politica = screen.getByText(/Política de Privacidade/i);
      expect(politica).toBeInTheDocument();
      expect(politica).toHaveClass(
        "group",
        "relative",
        "transition-colors",
        "duration-200",
        "hover:text-bodydark1",
      );
      expect(politica).toHaveAttribute("href", "/politica-de-privacidade");
      expect(politica).toHaveAttribute("target", "_blank");
    });

    it("Verificar o Termos e Condições do Footer", async () => {
      const acessarSuaConta = screen.getByText(/Acesse sua conta/i);

      expect(acessarSuaConta).toBeInTheDocument();

      await userEvent.click(acessarSuaConta);

      const modalLogin = await waitFor(() => screen.getByRole("dialog"));
      expect(modalLogin).toBeInTheDocument();

      const termos = screen.getByText(/Termos e Condições/i);
      expect(termos).toBeInTheDocument();
      expect(termos).toHaveClass(
        "group",
        "relative",
        "transition-colors",
        "duration-200",
        "hover:text-bodydark1",
      );
      expect(termos).toHaveAttribute("href", "/termos-e-condicoes");
      expect(termos).toHaveAttribute("target", "_blank");
    });
  });

});
