import AutomatedProposal from "@/app/automated-proposal/page";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, within } from "@testing-library/react";

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
      <AutomatedProposal />
    </QueryClientProvider>,
  );
});

describe("Testes da Página de Proposta Automatizada", () => {
  describe("Teste para verificar os titulos do formulário", () => {
    it("Teste para carregar o titulo da página", async () => {
      const titulo = await screen.findAllByText(/Expanda suas/i);
      expect(titulo[0]).toBeInTheDocument();

      const titulo2 = await screen.findAllByText(/vendas/i);
      expect(titulo2[0]).toBeInTheDocument();

      const titulo3 = await screen.findAllByText(/de precatórios/i);
      expect(titulo3[0]).toBeInTheDocument();
    });

    it("Teste para mostrar paragrafo da página", async () => {
      const paragrafo1 = await screen.findByText(
        /Conduza mais negociações de precatórios/i,
      );
      expect(paragrafo1).toBeInTheDocument();

      const paragrafo2 = await screen.findByText(
        /e converta mais antecipações./i,
      );
      expect(paragrafo2).toBeInTheDocument();
    });

    it("Teste para mostrar botão clique aqui", async () => {
      const botao = await screen.findByText(
        /clique aqui para ir ao formulário/i,
      );
      expect(botao).toBeInTheDocument();
    });
  });
  describe("Testes das labels e classes do Formulário", () => {
    it("Teste para carregar label do titulo da página", async () => {
      const titulo = await screen.findAllByText(/Expanda suas/i);
      expect(titulo[0]).toBeInTheDocument();
      expect(titulo[0]).toHaveClass(
        "pt-15",
        "text-center",
        "font-manyChat",
        "text-7xl",
        "tracking-wide",
        "text-snow",
        "2xsm:hidden",
        "md:block",
        "md:text-5xl",
        "lg:text-7xl",
      );
      const titulo2 = await screen.findAllByText(/vendas/i);
      expect(titulo2[0]).toBeInTheDocument();
      expect(titulo2[0]).toHaveClass(
        "pt-15",
        "text-center",
        "font-manyChat",
        "text-7xl",
        "tracking-wide",
        "text-snow",
        "2xsm:hidden",
        "md:block",
        "md:text-5xl",
        "lg:text-7xl",
      );

      const titulo3 = await screen.findAllByText(/de precatórios/i);
      expect(titulo3[0]).toBeInTheDocument();
      expect(titulo3[0]).toHaveClass(
        "pt-15",
        "text-center",
        "font-manyChat",
        "text-7xl",
        "tracking-wide",
        "text-snow",
        "2xsm:hidden",
        "md:block",
        "md:text-5xl",
        "lg:text-7xl",
      );
    });

    it("Teste para mostrar paragrafo da página", async () => {
      const paragrafo1 = await screen.findByText(
        /Conduza mais negociações de precatórios/i,
      );
      expect(paragrafo1).toBeInTheDocument();
      expect(paragrafo1).toHaveClass(
        "pt-10",
        "text-center",
        "font-rooftop",
        "text-base",
        "font-bold",
        "text-slate-500",
        "2xsm:text-2xl",
      );

      const paragrafo2 = await screen.findByText(
        /e converta mais antecipações./i,
      );
      expect(paragrafo2).toBeInTheDocument();
      expect(paragrafo2).toHaveClass(
        "pt-10",
        "text-center",
        "font-rooftop",
        "text-base",
        "font-bold",
        "text-slate-500",
        "2xsm:text-2xl",
      );
    });

    it("Teste para mostrar botão clique aqui", async () => {
      const botao = await screen.findByText(
        /clique aqui para ir ao formulário/i,
      );
      expect(botao).toBeInTheDocument();
    });

    it("Teste para mostrar titulo do formulário", async () => {
      const tituloDoFormulario = await screen.findByRole("heading", {
        name: "Preencha o formulário abaixo",
        level: 2,
      });
      expect(tituloDoFormulario).toBeInTheDocument();
    });

    it("Teste para mostrar Tipo de Oficio", async () => {
      const selectLabel = await screen.findByText(/tipo/i);
      expect(selectLabel).toBeInTheDocument();
      expect(selectLabel).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });

    it("Teste para mostrar Natureza", async () => {
      const natureza = await screen.findByText(/Natureza/i);
      expect(natureza).toBeInTheDocument();
      expect(natureza).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });

    it("Teste para mostrar Esfera", async () => {
      const selectLabel = await screen.findByText(/Esfera/i);
      expect(selectLabel).toBeInTheDocument();
      expect(selectLabel).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });

    it("Teste para mostrar Regime", async () => {
      const esfera = await screen.findByText(/Esfera/i);
      expect(esfera).toBeInTheDocument();

      const select = document.querySelector(
        '[name="esfera"]',
      ) as HTMLInputElement;
      expect(select).toBeInTheDocument();

      //Essa validação é opcional pois o select é obrigatório no teste.
      if (!select) throw new Error("Select não encontrado");

      fireEvent.change(select, { target: { value: "FEDERAL" } });
      expect(select.value).toBe("FEDERAL");

      fireEvent.change(select, { target: { value: "ESTADUAL" } });
      expect(select.value).toBe("ESTADUAL");

      const regime = await screen.findByText(/Regime/i);
      expect(regime).toBeInTheDocument();
      expect(regime).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });

    it("Teste para mostrar todos os Tribunais", async () => {
      const tribunais = await screen.findAllByText(/Tribunal/i);
      expect(tribunais[0]).toBeInTheDocument();
      expect(tribunais[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });

    it("Teste para mostrar valor principal", async () => {
      const valorPrincipal = (await screen.findByText(
        "Valor Principal",
      )) as HTMLInputElement;
      expect(valorPrincipal).toBeInTheDocument();
      expect(valorPrincipal).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });

    it("Teste para mostrar Valor de Juros", async () => {
      const valorJuros = await screen.findAllByText(/Juros/i);
      expect(valorJuros[0]).toBeInTheDocument();
      expect(valorJuros[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });

    it("Teste para mostrar Data Base", async () => {
      const dataBase = (await screen.findByLabelText(
        /Data Base/i,
      )) as HTMLInputElement;
      expect(dataBase).toBeInTheDocument();
      expect(dataBase).toHaveClass(
        "w-full",
        "rounded-md",
        "border",
        "border-strokedark",
        "bg-form-input",
        "px-3",
        "py-2",
        "text-sm",
        "font-medium",
        "text-bodydark",
      );
    });

    it("Teste para mostrar Data de Requisição / Recebimento", async () => {
      const dataRequisicaoRecebimento = (await screen.getByLabelText(
        "Data de Requisição / Recebimento",
      )) as HTMLInputElement;
      expect(dataRequisicaoRecebimento).toBeInTheDocument();
      expect(dataRequisicaoRecebimento).toHaveClass(
        "w-full",
        "rounded-md",
        "border",
        "border-strokedark",
        "bg-form-input",
        "px-3",
        "py-2",
        "text-sm",
        "font-medium",
        "text-bodydark",
      );
    });
  });

  describe("Testes dos Inputs do Formulário", () => {
    it("Teste do input de Natureza", async () => {
      const natureza = await screen.findByText(/Natureza/i);
      expect(natureza).toBeInTheDocument();

      const select = document.querySelector(
        '[name="natureza"]',
      ) as HTMLInputElement;
      expect(select).toBeInTheDocument();

      //Essa validação é opcional pois o select é obrigatório no teste.
      if (!select) throw new Error("Select não encontrado");

      fireEvent.change(select, { target: { value: "NÃO TRIBUTÁRIA" } });
      expect(select.value).toBe("NÃO TRIBUTÁRIA");

      fireEvent.change(select, { target: { value: "TRIBUTÁRIA" } });
      expect(select.value).toBe("TRIBUTÁRIA");
    });

    it("Teste do input de Esfera", async () => {
      const selectLabel = await screen.findByText(/Esfera/i);
      expect(selectLabel).toBeInTheDocument();

      const select = document.querySelector(
        '[name="esfera"]',
      ) as HTMLInputElement;
      expect(select).toBeInTheDocument();

      //Essa validação é opcional pois o select é obrigatório no teste.
      if (!select) throw new Error("Select não encontrado");

      fireEvent.change(select, { target: { value: "FEDERAL" } });
      expect(select.value).toBe("FEDERAL");

      fireEvent.change(select, { target: { value: "ESTADUAL" } });
      expect(select.value).toBe("ESTADUAL");

      fireEvent.change(select, { target: { value: "MUNICIPAL" } });
      expect(select.value).toBe("MUNICIPAL");
    });

    it("Teste do input de Regime ao selecionar Estadual", async () => {
      const selectLabel = await screen.findByText(/Esfera/i);
      expect(selectLabel).toBeInTheDocument();

      const select = document.querySelector(
        '[name="esfera"]',
      ) as HTMLInputElement;
      expect(select).toBeInTheDocument();

      if (!select) throw new Error("Select não encontrado");

      fireEvent.change(select, { target: { value: "FEDERAL" } });
      expect(select.value).toBe("FEDERAL");

      fireEvent.change(select, { target: { value: "ESTADUAL" } });
      expect(select.value).toBe("ESTADUAL");

      const regime = await screen.findByText(/Regime/i);
      expect(regime).toBeInTheDocument();

      const selectRegime = document.querySelector(
        '[name="regime"]',
      ) as HTMLInputElement;
      expect(selectRegime).toBeInTheDocument();

      if (!selectRegime) throw new Error("Select não encontrado");

      fireEvent.change(selectRegime, { target: { value: "GERAL" } });
      expect(selectRegime.value).toBe("GERAL");

      fireEvent.change(selectRegime, { target: { value: "ESPECIAL" } });
      expect(selectRegime.value).toBe("ESPECIAL");
    });

    it("Teste do input de todos os Tribunais", async () => {
      const tribunais = await screen.findAllByText(/Tribunal/i);
      expect(tribunais[0]).toBeInTheDocument();

      const select = document.querySelector(
        '[name="tribunal"]',
      ) as HTMLInputElement;
      expect(select).toBeInTheDocument();

      fireEvent.change(select, { target: { value: "TRF1" } });
      expect(select.value).toBe("TRF1");

      fireEvent.change(select, { target: { value: "TRF2" } });
      expect(select.value).toBe("TRF2");

      fireEvent.change(select, { target: { value: "TRF3" } });
      expect(select.value).toBe("TRF3");

      fireEvent.change(select, { target: { value: "TRF4" } });
      expect(select.value).toBe("TRF4");

      fireEvent.change(select, { target: { value: "TRF5" } });
      expect(select.value).toBe("TRF5");

      fireEvent.change(select, { target: { value: "TRF6" } });
      expect(select.value).toBe("TRF6");
    });

    it("Teste do input de Valor Principal", async () => {
      const valorPrincipal = (await screen.findByText(
        "Valor Principal",
      )) as HTMLInputElement;
      expect(valorPrincipal).toBeInTheDocument();

      const input = (await screen.findAllByDisplayValue(
        "R$ 0",
      )) as HTMLInputElement[];
      expect(input[0]).toBeInTheDocument();

      fireEvent.change(input[0], { target: { value: "1000" } });
      expect(input[0].value).toBe("R$ 1.000");
    });

    it("Teste do input de Valor de Juros", async () => {
      const valorJuros = await screen.findAllByText(/Juros/i);
      expect(valorJuros[0]).toBeInTheDocument();

      const input = (await screen.findAllByDisplayValue(
        "R$ 0",
      )) as HTMLInputElement[];
      expect(input[1]).toBeInTheDocument();

      fireEvent.change(input[1], { target: { value: "1000" } });
      expect(input[1].value).toBe("R$ 1.000");
    });

    it("Teste do input de Data Base", async () => {
      const dataBase = (await screen.findByLabelText(
        /Data Base/i,
      )) as HTMLInputElement;
      expect(dataBase).toBeInTheDocument();

      const input = (await screen.findByTestId(
        "data-base",
      )) as HTMLInputElement;
      expect(input).toBeInTheDocument();

      fireEvent.change(input, { target: { value: "2022-12-31" } });
      expect(input.value).toBe("2022-12-31");
    });

    it("Teste do input de Data de Requisição / Recebimento", async () => {
      const dataRequisicaoRecebimento = (await screen.getByLabelText(
        "Data de Requisição / Recebimento",
      )) as HTMLInputElement;
      expect(dataRequisicaoRecebimento).toBeInTheDocument();

      const input = (await screen.findByTestId(
        "data_requisicao",
      )) as HTMLInputElement;
      expect(input).toBeInTheDocument();

      fireEvent.change(input, { target: { value: "2022-12-31" } });
      expect(input.value).toBe("2022-12-31");
    });
  });

  describe("Testes dos Checkbox do Formulário", () => {
    it("Testar checkbox de Aquisição Total", async () => {
      const checkbox = (await screen.getByLabelText(
        "Aquisição total",
      )) as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();

      // O checkbox deve estar marcado inicialmente quando carregamos a página.
      expect(checkbox).toBeChecked();

      //Simulo o click do checkbox desmarcando para analisar a funcionalidade.
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();

      // Marco ele novamente.
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("Testar Percentual de aquisição", async () => {
      const checkbox = (await screen.getByLabelText(
        "Aquisição total",
      )) as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();

      const percentualAquisicao = await screen.findByText(
        /Percentual de aquisição/i,
      );
      expect(percentualAquisicao).toBeInTheDocument();

      const input = (await screen.findByTestId(
        "percentual-aquisicao",
      )) as HTMLInputElement;
      expect(input).toBeInTheDocument();

      fireEvent.change(input, { target: { value: "100" } });
      expect(input.value).toBe("100");
    });

    it("Testar checkbox de Juros de Mora fixados em sentença", async () => {
      const checkbox = (await screen.getByLabelText(
        "Juros de Mora fixados em sentença",
      )) as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();

      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("Testar checkbox de Incidência de IR", async () => {
      const checkbox = (await screen.getByLabelText(
        "Incidência de IR",
      )) as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();

      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("Testar checkbox de IR incidente sobre RRA?", async () => {
      const checkbox = (await screen.getByLabelText(
        "IR incidente sobre RRA?",
      )) as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();

      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("Testar Numero de meses", async () => {
      const checkbox = (await screen.getByLabelText(
        "IR incidente sobre RRA?",
      )) as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      const NumeroDeMeses = await screen.findByText(/Número de meses/i);
      expect(NumeroDeMeses).toBeInTheDocument();

      const input = (await screen.findByTestId(
        "numero_de_meses",
      )) as HTMLInputElement;
      expect(input).toBeInTheDocument();

      fireEvent.change(input, { target: { value: "100" } });
      expect(input.value).toBe("100");
    });

    it("Testar checkbox de Incide PSS?", async () => {
      const checkbox = (await screen.getByLabelText(
        "Incide PSS?",
      )) as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();

      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("Testar checkbox de Incide ISS?", async () => {
      const checkbox = (await screen.getByLabelText(
        "Incide PSS?",
      )) as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();

      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("Testar PSS", async () => {
      const checkbox = (await screen.getByLabelText(
        "Incide PSS?",
      )) as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      const container = screen
        .getByLabelText("PSS")
        .closest("div") as HTMLInputElement;
      const input = within(container).getByRole("textbox") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "1200" } });
      expect(input.value).toBe("R$ 1.200");
    });

    it("Teste do Destaque de Honorários", async () => {
      const checkbox = (await screen.getByLabelText(
        "Já possui destaque de honorários?",
      )) as HTMLInputElement;

      expect(checkbox).toBeInTheDocument();

      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it("Teste de Percentual", async () => {
      const checkbox = (await screen.getByLabelText(
        "Já possui destaque de honorários?",
      )) as HTMLInputElement;

      expect(checkbox).toBeInTheDocument();

      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();

      const percentual = await screen.findByText(/Percentual/i);
      expect(percentual).toBeInTheDocument();

      const input = (await screen.findByTestId(
        "percentual_de_honorarios",
      )) as HTMLInputElement;
      expect(input).toBeInTheDocument();

      fireEvent.change(input, { target: { value: "100" } });
      expect(input.value).toBe("100");
    });
  });
});
