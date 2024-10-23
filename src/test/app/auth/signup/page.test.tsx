import SignUp from "@/app/auth/signup/page";
import { beforeEach } from "@jest/globals";
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
}));

beforeEach(async () => {
  render(
    <QueryClientProvider client={(global as any).queryClient}>
      <SignUp />
    </QueryClientProvider>,
  );
});

describe("Teste dos Headers do registro", () => {
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
      name: "Cadastre-se para começar",
      level: 2,
    });
    expect(tituloDoFormulário).toBeInTheDocument();
  });

  it("Carregar labels do formulário", async () => {
    const nomeUsuario = await screen.findByText("Nome de usuário");
    expect(nomeUsuario).toBeInTheDocument();

    const email = await screen.findByText("Email");
    expect(email).toBeInTheDocument();

    const selectElement = await screen.findByRole("combobox");
    expect(selectElement).toBeInTheDocument();

    const selectCPF = await screen.findByRole("option", { name: "CPF" });
    expect(selectCPF).toBeInTheDocument();

    const selectCNPJ = await screen.findByRole("option", { name: "CNPJ" });
    expect(selectCNPJ).toBeInTheDocument();

    const senha = await screen.findAllByText(/Senha/i);
    expect(senha[0]).toBeInTheDocument();

    const confirmSenha = await screen.findByText("Confirmar senha");
    expect(confirmSenha).toBeInTheDocument();
  });

  it("Deve marcar e desmarcar o checkbox", () => {
    const checkbox = screen.getByRole("checkbox");

    // Verifica se o checkbox está desmarcado inicialmente
    expect(checkbox).not.toBeChecked();

    // Simula marcar o checkbox
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("Deve preencher o registro de usuário", async () => {
    const renderForm = () => {
      const Wrapper = () => {
        const methods = useForm();
        return (
          <FormProvider {...methods}>
            <SignUp />
          </FormProvider>
        );
      };
      return render(<Wrapper />);
    };

    renderForm();

    const inputUsuario = screen.getByLabelText(
      /Nome de usuário/i,
    ) as HTMLInputElement;

    fireEvent.change(inputUsuario, { target: { value: "usuarioTest" } });
    expect(inputUsuario.value).toBe("usuarioTest");

    const inputEmail = screen.getByLabelText(/Email/i) as HTMLInputElement;

    fireEvent.change(inputEmail, { target: { value: "email@email.com" } });
    expect(inputEmail.value).toBe("email@email.com");

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

  it("Deve registrar o usuário", async () => {
    const createAccount = screen.getByText(/Criar conta/i);

    expect(createAccount).toBeInTheDocument();
    await userEvent.click(createAccount);
  });

  it("Deve conectar o usuário", async () => {
    const conecte = screen.getByText(/Conecte-se/i);

    expect(conecte).toBeInTheDocument();
    await userEvent.click(conecte);
  });
});
