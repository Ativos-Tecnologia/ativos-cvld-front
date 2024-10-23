import SignUpWallet from "@/app/auth/signup/wallet/page";
import { beforeEach } from "@jest/globals";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm } from "react-hook-form";

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
  it("Teste carregar titulos da página de registro", async () => {
    const titulo = await screen.findByText(/Sua solução/i);
    expect(titulo).toBeInTheDocument();

    const titulo2 = await screen.findByText(/one-stop-shop/i);
    expect(titulo2).toBeInTheDocument();

    const titulo3 = await screen.findByText(/em precatórios/i);
    expect(titulo3).toBeInTheDocument();
  })

  it("Teste verficar titulo do formulário", async () => {
    const tituloDoFormulário = await screen.findByRole("heading", {
      name: "Cadastre-se na Wallet",
      level: 2,
    });
    expect(tituloDoFormulário).toBeInTheDocument();
  })

  it("Teste carregar labels do formulário", async () => {
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

  it("Teste de Registro na Wallet", async () => {
    const renderForm = () => {
      const Wrapper = () => {
        const methods = useForm();
        return (
          <FormProvider {...methods}>
            <SignUpWallet />
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

    const inpuNomeCompleto =
      await screen.getByLabelText(/Nome Completo/i);
    fireEvent.change(inpuNomeCompleto, {
      target: { value: "John Doe" },
    });
    expect(inpuNomeCompleto).toHaveValue("John Doe");

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

    const inpuNomeCompletoRepresentante = await screen.getByLabelText(/Nome Completo/i);
    fireEvent.change(inpuNomeCompletoRepresentante, {
      target: { value: "John Doe" }
    });
    expect(inpuNomeCompletoRepresentante).toHaveValue("John Doe");

    const inputCPFRepresentante = (await screen.findAllByPlaceholderText(
      /Digite seu CPF/i,
    ))[1] as HTMLInputElement;
    fireEvent.change(inputCPFRepresentante, {
      target: { value: "04521478966" }
    }) 
    expect(inputCPFRepresentante).toHaveValue("045.214.789-66");

    const zap = (
      await screen.findAllByPlaceholderText(/Whatsapp/i))[0] as HTMLInputElement;
    fireEvent.change(zap, { target: { value: "81999999999" } });
    expect(zap).toHaveValue("81.99999-9999");

    const banco = (
      await screen.findAllByPlaceholderText(/Banco/i))[0] as HTMLInputElement;
    fireEvent.change(banco, { target: { value: "256" } });
    expect(banco).toHaveValue("256");

    const agencia = (
      await screen.findAllByPlaceholderText(/Agência/i))[0] as HTMLInputElement;
    fireEvent.change(agencia, { target: { value: "42123" } });
    expect(agencia).toHaveValue("4212-3");

    const contaCorrente = (
      await screen.findAllByPlaceholderText(/Conta Corrente/i))[0] as HTMLInputElement;
    fireEvent.change(contaCorrente, { target: { value: "44444444" } });
    expect(contaCorrente).toHaveValue("4444444-4");

    const pix = (
      await screen.findAllByPlaceholderText(/Pix/i))[0] as HTMLInputElement;
    fireEvent.change(pix, { target: { value: "216549846513546846852132" } });
    expect(pix).toHaveValue("216549846513546846852132");

  })

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
})
