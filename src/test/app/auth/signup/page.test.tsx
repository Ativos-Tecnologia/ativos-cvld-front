import SignUp from "@/app/auth/signup/page";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";

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

beforeEach(async () => {
  render(
    <QueryClientProvider client={(global as any).queryClient}>
      <SignUp />
    </QueryClientProvider>,
  );
});

describe("Testes da Página de Registro ", () => {
  describe("Teste dos Titulos do Formulário", () => {
    it("Teste carregar o titulo da página", async () => {
      // Buscando pelo título que tem quebras de linha
      const titulo = await screen.findByText(/Sua solução/i);
      expect(titulo).toBeInTheDocument();

      const titulo2 = await screen.findByText(/one-stop-shop/i);
      expect(titulo2).toBeInTheDocument();

      const titulo3 = await screen.findByText(/em precatórios/i);
      expect(titulo3).toBeInTheDocument();
    });

    it("Teste carregar o titulo do formulário", async () => {
      const tituloDoFormulário = await screen.findByRole("heading", {
        name: "Cadastre-se para começar",
        level: 2,
      });
      expect(tituloDoFormulário).toBeInTheDocument();
    });

    it("Teste do Titulo Dados do Representante Legal", async () => {
      const selectElement = await screen.findByRole("combobox");
      expect(selectElement).toBeInTheDocument();

      const selectCPF = await screen.findByRole("option", { name: "CPF" });
      expect(selectCPF).toBeInTheDocument();

      const selectCNPJ = await screen.findByRole("option", { name: "CNPJ" });
      expect(selectCNPJ).toBeInTheDocument();

      // Testa o formulário dinâmico, onde ao selecionar o CNPJ, aparecerá novos campos.
      fireEvent.change(selectElement, { target: { value: "CNPJ" } });

      const representate = await screen.findByRole("heading", {
        name: "Dados do Representante Legal",
        level: 3,
      });
      expect(representate).toBeInTheDocument();
    });
  });

  describe("Teste das informações de Usuário do Formulário", () => {
    it("Teste do campo de Usuário", async () => {
      const nomeUsuario = await screen.findByText("Nome de usuário");
      expect(nomeUsuario).toBeInTheDocument();
      expect(nomeUsuario).toHaveTextContent("Nome de usuário");
      expect(nomeUsuario).toHaveClass(
        "mb-2.5",
        "block",
        "font-medium",
        "text-black",
      );
      expect(nomeUsuario).toHaveAttribute("for", "username");
    });

    it("Teste do campo de Email", async () => {
      const email = await screen.findByText("Email");
      expect(email).toBeInTheDocument();
      expect(email).toHaveTextContent("Email");
      expect(email).toHaveClass("mb-2.5", "block", "font-medium", "text-black");
      expect(email).toHaveAttribute("for", "email");
    });

    it("Teste do campo de Nome Completo", async () => {
      const nomeCompleto = await screen.findByText("Nome Completo");
      expect(nomeCompleto).toBeInTheDocument();
      expect(nomeCompleto).toHaveTextContent("Nome Completo");
      expect(nomeCompleto).toHaveClass(
        "mb-2.5",
        "block",
        "font-medium",
        "text-black",
      );
      expect(nomeCompleto).toHaveAttribute("for", "nome_completo");
    });

    it("Teste do campo CPF", async () => {
      const selectElement = await screen.findByRole("combobox");
      expect(selectElement).toBeInTheDocument();
      expect(selectElement).toHaveAttribute("id", "select");
      expect(selectElement).toHaveClass(
        "w-full",
        "rounded-lg",
        "border",
        "border-stroke",
        "bg-transparent",
        "py-2",
        "pl-4",
        "pr-10",
        "text-sm",
        "text-black",
        "outline-none",
        "focus:border-primary",
        "focus-visible:shadow-none",
        "sm:w-1/4",
      );

      const selectCPF = await screen.findByRole("option", { name: "CPF" });
      expect(selectCPF).toBeInTheDocument();
    });

    it("Teste do campo CNPJ", async () => {
      const selectElement = await screen.findByRole("combobox");
      expect(selectElement).toBeInTheDocument();
      expect(selectElement).toHaveAttribute("id", "select");
      expect(selectElement).toHaveClass(
        "w-full",
        "rounded-lg",
        "border",
        "border-stroke",
        "bg-transparent",
        "py-2",
        "pl-4",
        "pr-10",
        "text-sm",
        "text-black",
        "outline-none",
        "focus:border-primary",
        "focus-visible:shadow-none",
        "sm:w-1/4",
      );

      const selectCNPJ = await screen.findByRole("option", { name: "CNPJ" });
      expect(selectCNPJ).toBeInTheDocument();
    });

    it("Teste do campo Nome Completo do Representante Legal", async () => {
      const selectElement = await screen.findByRole("combobox");
      expect(selectElement).toBeInTheDocument();

      const selectCPF = await screen.findByRole("option", { name: "CPF" });
      expect(selectCPF).toBeInTheDocument();

      const selectCNPJ = await screen.findByRole("option", { name: "CNPJ" });
      expect(selectCNPJ).toBeInTheDocument();

      // Testa o formulário dinâmico, onde ao selecionar o CNPJ, aparecerá novos campos.
      fireEvent.change(selectElement, { target: { value: "CNPJ" } });

      const representate = await screen.findByRole("heading", {
        name: "Dados do Representante Legal",
        level: 3,
      });
      expect(representate).toBeInTheDocument();

      const nomeCompletoRepresentante =
        await screen.findAllByText(/Nome Completo/i);
      expect(nomeCompletoRepresentante[1]).toBeInTheDocument();
      expect(nomeCompletoRepresentante[1]).toHaveClass(
        "mb-2.5",
        "block",
        "font-medium",
        "text-black",
      );
    });

    it("Teste do campo CPF do Representante Legal", async () => {
      const selectElement = await screen.findByRole("combobox");
      expect(selectElement).toBeInTheDocument();

      const selectCPF = await screen.findByRole("option", { name: "CPF" });
      expect(selectCPF).toBeInTheDocument();

      const selectCNPJ = await screen.findByRole("option", { name: "CNPJ" });
      expect(selectCNPJ).toBeInTheDocument();

      // Testa o formulário dinâmico, onde ao selecionar o CNPJ, aparecerá novos campos.
      fireEvent.change(selectElement, { target: { value: "CNPJ" } });

      const representate = await screen.findByRole("heading", {
        name: "Dados do Representante Legal",
        level: 3,
      });
      expect(representate).toBeInTheDocument();

      const nomeCompletoRepresentante =
        await screen.findAllByText(/Nome Completo/i);
      expect(nomeCompletoRepresentante[1]).toBeInTheDocument();

      const cpfRepresentante = await screen.findAllByText(/CPF/i);
      expect(cpfRepresentante[1]).toBeInTheDocument();
      expect(cpfRepresentante[1]).toHaveClass(
        "mb-2.5",
        "block",
        "font-medium",
        "text-black",
      );
    });

    it("Teste do campo WhatsApp", async () => {
      const zap = await screen.findByText("Whatsapp");
      expect(zap).toBeInTheDocument();
      expect(zap).toHaveTextContent("Whatsapp");
      expect(zap).toHaveClass("mb-2.5", "block", "font-medium", "text-black");
      expect(zap).toHaveAttribute("for", "phone");
    });
  });

  describe("Teste das informações de Senha do Formulário", () => {
    it("Teste do campo Senha", async () => {
      const senha = await screen.findByText("Senha");
      expect(senha).toBeInTheDocument();
      expect(senha).toHaveTextContent("Senha");
      expect(senha).toHaveClass("text-black", "dark:text-white");
    });

    it("Teste do campo Confirmar Senha", async () => {
      const confirmSenha = await screen.findByText("Confirmar senha");
      expect(confirmSenha).toBeInTheDocument();
      expect(confirmSenha).toHaveTextContent("Confirmar senha");
      expect(confirmSenha).toHaveClass("text-black", "dark:text-white");
    });
  });

  describe("Teste dos Checboxes do Formulário", () => {
    it("Teste deve marcar e desmarcar o checkbox", () => {
      const checkbox = screen.getByRole("checkbox");

      // Verifica se o checkbox está desmarcado inicialmente
      expect(checkbox).not.toBeChecked();

      // Simula marcar o checkbox
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe("Teste dos inputs do Formulário", () => {
    const renderForm = () => {
      const Wrapper = () => {
        const methods = useForm();
        return (
          <FormProvider {...methods}>
            <SignUp />
          </FormProvider>
        );
      };
      return render(
        <QueryClientProvider client={(global as any).queryClient}>
          <Wrapper />
        </QueryClientProvider>,
      );
    };

    beforeEach(() => {
      renderForm();
    });

    it("Teste para preencher o campo de Usuário", async () => {
      const inputUsuario = screen.getByLabelText(
        /Nome de usuário/i,
      ) as HTMLInputElement;

      fireEvent.change(inputUsuario, { target: { value: "usuarioTest" } });
      expect(inputUsuario.value).toBe("usuarioTest");
    });

    it("Teste para preencher o campo de Email", async () => {
      const inputEmail = screen.getByLabelText(/Email/i) as HTMLInputElement;

      fireEvent.change(inputEmail, { target: { value: "email@email.com" } });
      expect(inputEmail.value).toBe("email@email.com");
    });

    it("Teste para preencher o campo de Nome Completo", async () => {
      const inputNomeCompleto = screen.getByLabelText(
        /Nome Completo/i,
      ) as HTMLInputElement;

      fireEvent.change(inputNomeCompleto, {
        target: { value: "Bruce Dickinson" },
      });
      expect(inputNomeCompleto.value).toBe("Bruce Dickinson");
    });

    it("Teste para preencher os campos de CPF e CNPJ", async () => {
      const selectOption = screen.getByLabelText(
        /Selecione uma opção/i,
      ) as HTMLSelectElement;
      fireEvent.change(selectOption, { target: { value: "CNPJ" } });

      const inputCNPJ = (await screen.findByPlaceholderText(
        /Digite seu CNPJ/i,
      )) as HTMLInputElement;

      fireEvent.change(inputCNPJ, { target: { value: "15486587000142" } });
      expect(inputCNPJ).toHaveValue("15.486.587/0001-42");

      fireEvent.change(selectOption, { target: { value: "CPF" } });

      const inputCPF = (
        await screen.findAllByPlaceholderText(/Digite seu CPF/i)
      )[0] as HTMLInputElement;

      fireEvent.change(inputCPF, { target: { value: "04521478963" } });
      expect(inputCPF).toHaveValue("045.214.789-63");
    });

    it("Teste para preencher o campo de WhatsApp", async () => {
      const inputWhatsApp = (await screen.findAllByPlaceholderText(
        /Whatsapp/i,
      )) as HTMLInputElement[];

      fireEvent.change(inputWhatsApp[0], { target: { value: "21999999999" } });
      expect(inputWhatsApp[0].value).toBe("21.99999-9999");
    });
  });

  describe("Teste dos botões do Formulário", () => {
    it("Teste deve registrar o usuário", async () => {
      const createAccount = screen.getByText(/Criar conta/i);

      expect(createAccount).toBeInTheDocument();
      await userEvent.click(createAccount);
    });

    it("Teste deve conectar o usuário", async () => {
      const conecte = screen.getByText(/Conecte-se/i);

      expect(conecte).toBeInTheDocument();
      await userEvent.click(conecte);
    });
  });

  describe("Teste dos links do Formulário", () => {
    it("Teste para redirecionar para termos e condições", async () => {
      const link = screen.getByText(/termos e condições/i);

      expect(link).toBeInTheDocument();
      await userEvent.click(link);
      expect(link).toHaveAttribute("href", "/termos-e-condicoes");
    });

    it("Teste para redicionar para o Conecte-se para a página de login", async () => {
      const link = screen.getByText(/Conecte-se/i);

      expect(link).toBeInTheDocument();
      await userEvent.click(link);
      expect(link).toHaveAttribute("href", "/auth/signin");
    });
  });
});
