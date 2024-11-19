import RecalculateTrf1 from "@/app/retification/page";
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
  const Wrapper = () => {
    const methods = useForm();
    return (
      <FormProvider {...methods}>
        <RecalculateTrf1 />
      </FormProvider>
    );
  };
  render(
    <QueryClientProvider client={(global as any).queryClient}>
      <Wrapper />
    </QueryClientProvider>,
  );
});

describe("Teste da Página de Retificação de Valor Disponível nos TRF's 1 e 6", () => {
  describe("Teste dos titulos da página", () => {
    it("Teste para exibir o titulo da página", async () => {
      const titulo1 = await screen.findByText(/Retificação de/i);
      expect(titulo1).toBeInTheDocument();
      expect(titulo1).toHaveClass(
        "block",
        "translate-x-25",
        "animate-fade-right",
        "pt-44",
        "text-6xl",
        "font-bold",
        "text-[#222]",
        "opacity-0",
      );

      const titulo2 = await screen.findByText(/Valor Disponível/i);
      expect(titulo2).toBeInTheDocument();
      expect(titulo2).toHaveClass(
        "block",
        "translate-x-25",
        "animate-fade-right",
        "pt-44",
        "text-6xl",
        "font-bold",
        "text-[#222]",
        "opacity-0",
      );

      const titulo3 = await screen.findByText(/Nos TRFs 1 e 6/i);
      expect(titulo3).toBeInTheDocument();
      expect(titulo3).toHaveClass(
        "block",
        "translate-x-25",
        "animate-fade-right",
        "pt-44",
        "text-6xl",
        "font-bold",
        "text-[#222]",
        "opacity-0",
      );
    });

    it("Teste para exibir o subtitulo da página", async () => {
      const numero = await screen.findByText(/Nº 2024.0000.000.000000/i);
      expect(numero).toBeInTheDocument();
      expect(numero).toHaveClass("text-lg", "font-bold");

      const status = await screen.findByText(/Status:/i);
      expect(status).toBeInTheDocument();

      const statusDescricao = await screen.findByText(
        /5 - Requisição Cadastrado Concluído/i,
      );
      expect(statusDescricao).toBeInTheDocument();
    });
  });

  describe("Teste do titulo do Tribunal", () => {
    it("Teste para exibir o titulo do Tribunal", async () => {
      const poderJudiciario = await screen.findByText(/poder judiciário/i);
      expect(poderJudiciario).toBeInTheDocument();
      expect(poderJudiciario).toHaveClass("text-sm", "uppercase");

      const tribunal = await screen.findByText(
        /tribunal regional federal 1ª região/i,
      );
      expect(tribunal).toBeInTheDocument();
      expect(tribunal).toHaveClass("text-sm", "uppercase");

      const pagamento = await screen.findByRole("heading", {
        name: "Requisição de Pagamento",
        level: 2,
      });
      expect(pagamento).toBeInTheDocument();
      expect(pagamento).toHaveClass("font-medium", "underline");

      const precatorio = await screen.findByText("Precatório");
      expect(precatorio).toBeInTheDocument();
      expect(precatorio).toHaveClass("font-medium", "text-sm");
    });

    it("Teste do titulo Beneficiário", async () => {
      const beneficiario = await screen.findByRole("heading", {
        name: "BENEFICIÁRIO(S)",
        level: 3,
      });
      expect(beneficiario).toBeInTheDocument();
    });
  });

  describe("Teste da Requisisão da Natureza", () => {
    it("Teste para exibir a requisição da natureza", async () => {
      const natureza = await screen.findByText(/Natureza:/i);
      expect(natureza).toBeInTheDocument();
      expect(natureza).toHaveClass("text-sm");

      const dataDeCadastroReq = await screen.findByText(
        /Data de Cadastro da Req:/i,
      );
      expect(dataDeCadastroReq).toBeInTheDocument();
    });
  });

  describe("Teste de Requisição da Natureza", () => {
    it("Teste para enviar dados da requisição da Natureza que ficam no topo da página", async () => {
      const natureza = await screen.findByText(/Natureza:/i);
      expect(natureza).toBeInTheDocument();
      expect(natureza).toHaveClass("text-sm");

      const select = (await screen.findByRole("combobox")) as HTMLSelectElement;
      expect(select).toBeInTheDocument();

      fireEvent.change(select, { target: { value: "NÃO TRIBUTÁRIA" } });
      expect(select).toHaveValue("NÃO TRIBUTÁRIA");

      fireEvent.change(select, { target: { value: "TRIBUTÁRIA" } });
      expect(select).toHaveValue("TRIBUTÁRIA");

      const dataDeCadastroReq = await screen.findByText(
        /Data de Cadastro da Req:/i,
      );
      expect(dataDeCadastroReq).toBeInTheDocument();

      const data = (await screen.findByTestId(
        "data_requisicao",
      )) as HTMLInputElement;
      expect(data).toBeInTheDocument();

      fireEvent.change(data, { target: { value: "19-11-2024" } });
      expect(data).toHaveValue("19/11/2024");
    });
  });

  describe("Teste do Formulário de Beneficiário", () => {
    it("Teste para exibir titulo do Formulário de Beneficiário", async () => {
      const beneficiario = await screen.findByText(/beneficiário principal/i);
      expect(beneficiario).toBeInTheDocument();
    });

    it("Teste para inserir Labels do Formulario de Beneficiário", async () => {
      const nome = await screen.findByText(/Nome completo/i);
      expect(nome).toBeInTheDocument();
      expect(nome).toHaveClass(
        "col-span-4",
        "flex",
        "items-center",
        "justify-center",
        "py-[2px]",
        "text-xs",
        "uppercase",
      );

      const cpf_cnpj = await screen.findByText("cpf/cnpj");
      expect(cpf_cnpj).toBeInTheDocument();
      expect(cpf_cnpj).toHaveClass(
        "col-span-2",
        "flex",
        "items-center",
        "justify-center",
        "py-[2px]",
        "text-xs",
        "uppercase",
      );

      const situacao = await screen.findByText("situação");
      expect(situacao).toBeInTheDocument();
      expect(situacao).toHaveClass(
        "col-span-2",
        "flex",
        "items-center",
        "justify-center",
        "py-[2px]",
        "text-xs",
        "uppercase",
      );
      const expressaRenuncia = await screen.findByText("expressa renúncia");
      expect(expressaRenuncia).toBeInTheDocument();
      expect(expressaRenuncia).toHaveClass(
        "col-span-1",
        "flex",
        "items-center",
        "justify-center",
        "py-[2px]",
        "text-xs",
        "uppercase",
      );
      const dataBase = await screen.findByText("data base");
      expect(dataBase).toBeInTheDocument();
      expect(dataBase).toHaveClass(
        "col-span-1",
        "flex",
        "items-center",
        "justify-center",
        "py-[2px]",
        "text-xs",
        "uppercase",
      );
    });

    it("Teste das labels dos Calculos do Formulário de Beneficiário", async () => {
      const principal = await screen.findByText("principal (R$)");
      expect(principal).toBeInTheDocument();
      expect(principal).toHaveClass(
        "col-span-2",
        "flex",
        "items-center",
        "justify-center",
        "py-[2px]",
        "text-xs",
        "uppercase",
      );

      const jurosSelic = await screen.findByText("juros/selic (R$)");
      expect(jurosSelic).toBeInTheDocument();
      expect(jurosSelic).toHaveClass(
        "col-span-2",
        "flex",
        "items-center",
        "justify-center",
        "py-[2px]",
        "text-xs",
        "uppercase",
      );

      const jurosCompensatorio = await screen.findByText(
        "juros compensatório (R$)",
      );
      expect(jurosCompensatorio).toBeInTheDocument();
      expect(jurosCompensatorio).toHaveClass(
        "col-span-2",
        "flex",
        "items-center",
        "justify-center",
        "py-[2px]",
        "text-xs",
        "uppercase",
      );

      const encargoLegal = await screen.findByText("encargo legal (R$)");
      expect(encargoLegal).toBeInTheDocument();
      expect(encargoLegal).toHaveClass(
        "col-span-2",
        "flex",
        "items-center",
        "justify-center",
        "py-[2px]",
        "text-xs",
        "uppercase",
      );

      const valorPSS = await screen.findByText("Valor PSS:");
      expect(valorPSS).toBeInTheDocument();
      expect(valorPSS).toHaveClass(
        "ml-2",
        "text-xs",
        "font-medium",
        "uppercase",
        "text-black-2",
      );
    });
  });

  describe("Teste dos checkboxs do Formulário de Beneficiário", () => {
    it("Teste para saber a quantidade de checkboxs do Formulário de Beneficiário", async () => {
      const checkboxs = await screen.findAllByRole("checkbox");
      expect(checkboxs).toHaveLength(2);
    });

    it("Teste de funcionalidades do checkbox do Formulário de Beneficiário", async () => {
      const checkboxs = await screen.findAllByRole("checkbox");
      const checkboxJurosMora = checkboxs[0];
      const checkboxPossuiIR = checkboxs[1];

      expect(checkboxJurosMora).toBeChecked();
      expect(checkboxPossuiIR).not.toBeChecked();

      fireEvent.click(checkboxJurosMora);
      expect(checkboxJurosMora).not.toBeChecked();
      expect(checkboxPossuiIR).not.toBeChecked();

      fireEvent.click(checkboxPossuiIR);
      expect(checkboxJurosMora).not.toBeChecked();
      expect(checkboxPossuiIR).toBeChecked();
    });
  });

  describe("Teste do formulário de Indicação da Apuração e Tributação de Rendimentos Recebidos Acumuladamente - RRA", () => {
    it("Teste para exibir o titulo do formulário de Indicação da Apuração e Tributação de Rendimentos Recebidos Acumuladamente - RRA", async () => {
      const checkboxs = await screen.findAllByRole("checkbox");
      const checkboxPossuiIR = checkboxs[1];
      fireEvent.click(checkboxPossuiIR);
      expect(checkboxPossuiIR).toBeChecked();

      const titulo = await screen.findByText(
        "Indicação da Apuração e Tributação de Rendimentos Recebidos Acumuladamente - RRA",
      );
      expect(titulo).toBeInTheDocument();
    });

    it("Teste para exibir os labels do formulário de Indicação da Apuração e Tributação de Rendimentos Recebidos Acumuladamente - RRA", async () => {
      const checkboxs = await screen.findAllByRole("checkbox");
      const checkboxPossuiIR = checkboxs[1];
      fireEvent.click(checkboxPossuiIR);
      expect(checkboxPossuiIR).toBeChecked();

      const titulo = await screen.findByText(
        "Indicação da Apuração e Tributação de Rendimentos Recebidos Acumuladamente - RRA",
      );
      expect(titulo).toBeInTheDocument();
      expect(titulo).toHaveClass(
        "mb-2",
        "border",
        "border-slate-600",
        "bg-gray-300",
        "py-1",
        "text-center",
        "text-sm",
        "font-medium",
        "text-black-2",
      );

      const valorTotal = await screen.findByText(
        "Valor Total do Beneficiário:",
      );
      expect(valorTotal).toBeInTheDocument();
      expect(valorTotal).toHaveClass("text-black-2");

      const QtdParcelas = await screen.findByText(
        "Quantidade de Parcelas dos Exercícios Anteriores:",
      );
      expect(QtdParcelas).toBeInTheDocument();
      expect(QtdParcelas).toHaveClass("text-black-2");
    });
  });

  describe("Teste do botão do formulário", () => {
    it("Teste para exibir o botão de calcular do formulário", async () => {
      const button = await screen.findByRole("button", { name: "Calcular" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass(
        "mb-8",
        "mt-10",
        "flex",
        "cursor-pointer",
        "items-center",
        "justify-center",
        "gap-2",
        "rounded-lg",
        "bg-blue-700",
        "px-8",
        "py-3",
        "text-sm",
        "text-white",
        "transition-all",
        "duration-200",
        "hover:bg-blue-800",
        "focus:z-0",
      );
      userEvent.click(button);
    });
  });
});
