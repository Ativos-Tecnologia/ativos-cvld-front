import MainForm from "@/components/MainForm";
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
  const dataCallback = jest.fn();
  const setCalcStep = jest.fn();
  const setDataToAppend = jest.fn();
  const Wrapper = () => {
    const methods = useForm();
    return (
      <FormProvider {...methods}>
        <MainForm
          dataCallback={dataCallback}
          setCalcStep={setCalcStep}
          setDataToAppend={setDataToAppend}
        />
      </FormProvider>
    );
  };
  render(
    <QueryClientProvider client={(global as any).queryClient}>
      <Wrapper />
    </QueryClientProvider>,
  );
});

describe("Teste do Formulário da Calculadora", () => {
  describe("Teste do Header dos Formulários", () => {
    it("Teste para carregar o header do formulário", async () => {
      const cabecalho = await screen.findByText("Celer");
      expect(cabecalho).toBeInTheDocument();

      const header = await screen.findByRole("heading", {
        name: "Celer",
        level: 2,
      });
      expect(header).toBeInTheDocument();
    });

    it("Teste para verificar imagem da logo", async () => {
      const imagem = await screen.findByRole("img", {
        name: "Celler IA Engine",
      });
      expect(imagem).toBeInTheDocument();
    });

    it("Teste para verificar subtitulo do formulário", async () => {
      const subtitulo = await screen.findByText(
        "Nosso modelo de atualização de valores de precatórios e RPVs",
      );
      expect(subtitulo).toBeInTheDocument();
      expect(subtitulo).toHaveClass(
        "apexcharts-legend-text",
        "mt-0",
        "text-center",
        "text-sm",
        "font-normal",
      );
    });
  });

  describe("Teste das labels do formulário", () => {
    it("Teste das labels do formulário", async () => {
      const natureza = await screen.findAllByText("Natureza");
      expect(natureza[0]).toBeInTheDocument();
      expect(natureza[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
      expect(natureza[0]).toHaveAttribute("for", "natureza");

      const valorPrincipal = await screen.findByText("Valor Principal");
      expect(valorPrincipal).toBeInTheDocument();
      expect(valorPrincipal).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
      expect(valorPrincipal).toHaveAttribute("for", "valor_principal");

      const juros = await screen.findByText("Juros");
      expect(juros).toBeInTheDocument();
      expect(juros).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
      expect(juros).toHaveAttribute("for", "valor_juros");

      const database = await screen.findByText("Data Base");
      expect(database).toBeInTheDocument();
      expect(database).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
      expect(database).toHaveAttribute("for", "data_base");

      const datareq = await screen.findByText(
        "Data de Requisição / Recebimento",
      );
      expect(datareq).toBeInTheDocument();
      expect(datareq).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
      expect(datareq).toHaveAttribute("for", "data_requisicao");
    });
  });

  describe("Teste dos checkboxed do formulário", () => {
    it("Teste de Aquisição total", async () => {
      const aquisicaoTotalLabel = await screen.findAllByText("Aquisição total");
      const aquisicaoTotal = (await screen.findByLabelText(
        "Aquisição total",
      )) as HTMLInputElement;
      expect(aquisicaoTotal).toBeInTheDocument();
      expect(aquisicaoTotal).toBeChecked();
      fireEvent.click(aquisicaoTotal);
      expect(aquisicaoTotal).not.toBeChecked();
      expect(aquisicaoTotalLabel[0]).toHaveAttribute(
        "for",
        "valor_aquisicao_total",
      );
      expect(aquisicaoTotal).toHaveAttribute("id", "valor_aquisicao_total");
      expect(aquisicaoTotalLabel[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });
    it("Teste do checkbox de Juros de Mora Fixados em Sentença", async () => {
      const jurosDeMoraLabel = await screen.findAllByText(
        "Juros de Mora fixados em sentença",
      );
      const jurosDeMora = (await screen.findByLabelText(
        "Juros de Mora fixados em sentença",
      )) as HTMLInputElement;
      expect(jurosDeMora).toBeInTheDocument();
      expect(jurosDeMora).toBeChecked();
      fireEvent.click(jurosDeMora);
      expect(jurosDeMora).not.toBeChecked();
      expect(jurosDeMoraLabel[0]).toHaveAttribute(
        "for",
        "incidencia_juros_moratorios",
      );
      expect(jurosDeMora).toHaveAttribute("id", "incidencia_juros_moratorios");
      expect(jurosDeMoraLabel[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });

    it("Teste do checkbox de Incidência de IR", async () => {
      const incidenciaIrLabel = await screen.findAllByText("Incidência de IR");
      const incidenciaIr = (await screen.findByLabelText(
        "Incidência de IR",
      )) as HTMLInputElement;
      expect(incidenciaIr).toBeInTheDocument();
      expect(incidenciaIr).toBeChecked();
      fireEvent.click(incidenciaIr);
      expect(incidenciaIr).not.toBeChecked();
      expect(incidenciaIrLabel[0]).toHaveAttribute("for", "incidencia_rra_ir");
      expect(incidenciaIr).toHaveAttribute("id", "incidencia_rra_ir");
      expect(incidenciaIrLabel[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });

    it("Teste de checkbox do IR Incidente sobre RRA", async () => {
      const irIncidentesSobreRraLabel = await screen.findAllByText(
        "IR incidente sobre RRA?",
      );
      const irIncidentesSobreRra = (await screen.findByLabelText(
        "IR incidente sobre RRA?",
      )) as HTMLInputElement;
      expect(irIncidentesSobreRra).toBeInTheDocument();
      expect(irIncidentesSobreRra).not.toBeChecked();
      fireEvent.click(irIncidentesSobreRra);
      expect(irIncidentesSobreRra).toBeChecked();
      expect(irIncidentesSobreRraLabel[0]).toHaveAttribute(
        "for",
        "ir_incidente_rra",
      );
      expect(irIncidentesSobreRra).toHaveAttribute("id", "ir_incidente_rra");
      expect(irIncidentesSobreRraLabel[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });

    it("Teste de checkbox para verificar Incide PSS", async () => {
      const incidePss = (await screen.findByLabelText(
        "Incide PSS?",
      )) as HTMLInputElement;
      expect(incidePss).toBeInTheDocument();
      expect(incidePss).not.toBeChecked();
      fireEvent.click(incidePss);
      expect(incidePss).toBeChecked();
      const incidePssLabel = await screen.findAllByText("Incide PSS?");
      expect(incidePssLabel[0]).toHaveAttribute("for", "incidencia_pss");
      expect(incidePss).toHaveAttribute("id", "incidencia_pss");
      expect(incidePssLabel[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });

    it("Teste no checkbox do Atualizar para a Data Passada", async () => {
      const atualizarDataPassada = (await screen.findByLabelText(
        "Atualizar para data passada?",
      )) as HTMLInputElement;
      expect(atualizarDataPassada).toBeInTheDocument();
      expect(atualizarDataPassada).not.toBeChecked();
      fireEvent.click(atualizarDataPassada);
      expect(atualizarDataPassada).toBeChecked();
      const atualizarDataPassadaLabel = await screen.findAllByText(
        "Atualizar para data passada?",
      );
      expect(atualizarDataPassadaLabel[0]).toHaveAttribute(
        "for",
        "data_limite_de_atualizacao_check",
      );
      expect(atualizarDataPassada).toHaveAttribute(
        "id",
        "data_limite_de_atualizacao_check",
      );
      expect(atualizarDataPassadaLabel[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });

    it("Teste do checkbox de Salvar Informações de Ofício e Recálculo", async () => {
      const salvarInfoOficio = (await screen.findByLabelText(
        "Salvar informações de ofício e recálculo?",
      )) as HTMLInputElement;
      expect(salvarInfoOficio).toBeInTheDocument();
      expect(salvarInfoOficio).not.toBeChecked();
      fireEvent.click(salvarInfoOficio);
      expect(salvarInfoOficio).toBeChecked();
      const salvarInfoOficioLabel = await screen.findAllByText(
        "Salvar informações de ofício e recálculo?",
      );
      expect(salvarInfoOficioLabel[0]).toHaveAttribute("for", "gerar_cvld");
      expect(salvarInfoOficio).toHaveAttribute("id", "gerar_cvld");
      expect(salvarInfoOficioLabel[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });
  });

  describe("Teste dos inputs do formulário", () => {
    it("Teste do input de Natureza", async () => {
      /**
    * Caso em alguns tests voce não consiga testar o ShadSelect, tente essa alternatva.
    * import userEvent from "@testing-library/user-event";
 
       userEvent.click(select);
       const option = await screen.findByText("Tributária");
       userEvent.click(option);
       expect(select).toHaveValue("TRIBUTÁRIA");
    */

      // Verifique o label pelo texto e pelo atributo "for"
      const label = screen.getAllByText("Natureza")[0];
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("for", "natureza");

      // Localize o ShadSelect pelo atributo "aria-labelledby" ou "name"
      const select =
        document.querySelector('[aria-labelledby="natureza"]') ||
        document.querySelector('[name="natureza"]');
      expect(select).toBeInTheDocument();

      // Condicional necessária para garantir que o select foi encontrado
      if (!select) {
        throw new Error("Select não encontrado.");
      }

      expect(select).toHaveValue("NÃO TRIBUTÁRIA");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, { target: { value: "TRIBUTÁRIA" } });

      expect(select).toHaveValue("TRIBUTÁRIA");

      fireEvent.mouseDown(select);
      fireEvent.change(select, { target: { value: "NÃO TRIBUTÁRIA" } });
      expect(select).toHaveValue("NÃO TRIBUTÁRIA");
    });
    it("Teste do input de Valor Principal", async () => {
      const valorPrincipal = await screen.findAllByText(/Valor Principal/i);
      expect(valorPrincipal[0]).toBeInTheDocument();
      expect(valorPrincipal[0]).toHaveAttribute("for", "valor_principal");
      expect(valorPrincipal[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );

      const valorPrincipalInput =
        await screen.findAllByTestId("valor_principal");
      expect(valorPrincipalInput[0]).toBeInTheDocument();

      fireEvent.change(valorPrincipalInput[0], {
        target: { value: "R$ 1.000" },
      });
      expect(valorPrincipalInput[0]).toHaveValue("R$ 1.000");
    });

    it("Teste do input de Juros", async () => {
      const juros = await screen.findAllByText(/Juros/i);
      expect(juros[0]).toBeInTheDocument();
      expect(juros[0]).toHaveAttribute("for", "valor_juros");
      expect(juros[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );

      const jurosInput = await screen.findAllByTestId("valor_juros");
      expect(jurosInput[0]).toBeInTheDocument();
      fireEvent.change(jurosInput[0], { target: { value: "R$ 1.000" } });
      expect(jurosInput[0]).toHaveValue("R$ 1.000");

      const database = await screen.findAllByText(/Data Base/i);
      expect(database[0]).toBeInTheDocument();
      expect(database[0]).toHaveAttribute("for", "data_base");
      expect(database[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });

    it("Teste do input de Data Base", async () => {
      const databaseInput = (await screen.findAllByTestId(
        "data_base",
      )) as HTMLInputElement[];
      expect(databaseInput[0]).toBeInTheDocument();
      fireEvent.change(databaseInput[0], { target: { value: "2024-01-01" } });
      expect(databaseInput[0]).toHaveValue("2024-01-01");
    });

    it("Teste do input de Data Requisição / Recebimento", async () => {
      const datareq = await screen.findAllByText(
        /Data de Requisição \/ Recebimento/i,
      );
      expect(datareq[0]).toBeInTheDocument();
      expect(datareq[0]).toHaveAttribute("for", "data_requisicao");
      expect(datareq[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );

      const datareqInput = (await screen.findAllByTestId(
        "data_requisicao",
      )) as HTMLInputElement[];
      expect(datareqInput[0]).toBeInTheDocument();
      fireEvent.change(datareqInput[0], { target: { value: "2024-01-01" } });
      expect(datareqInput[0]).toHaveValue("2024-01-01");
    });
  });

  describe("Teste de condicionais do checkbox do formulário", () => {
    it("Teste se o checkbox de Aquisição Total foi clicado", async () => {
      const aquisicaoTotalLabel = await screen.findAllByText("Aquisição total");
      const aquisicaoTotal = (await screen.findByLabelText(
        "Aquisição total",
      )) as HTMLInputElement;
      expect(aquisicaoTotal).toBeInTheDocument();
      expect(aquisicaoTotal).toBeChecked();
      fireEvent.click(aquisicaoTotal);
      expect(aquisicaoTotal).not.toBeChecked();
      expect(aquisicaoTotalLabel[0]).toHaveAttribute(
        "for",
        "valor_aquisicao_total",
      );
      expect(aquisicaoTotal).toHaveAttribute("id", "valor_aquisicao_total");
      expect(aquisicaoTotalLabel[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );

      const percentual = await screen.findByText("Percentual de aquisição (%)");
      expect(percentual).toBeInTheDocument();
      expect(percentual).toHaveAttribute("for", "percentual_a_ser_adquirido");
      expect(percentual).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
      const percentualInput = await screen.findByTestId(
        "percentual_a_ser_adquirido",
      );
      expect(percentualInput).toBeInTheDocument();
      fireEvent.change(percentualInput, { target: { value: 100 } });
      expect(percentualInput).toHaveValue(100);
    });

    it("Teste se o valor de checkbox foi Ir Incidente Sobre RRA?", async () => {
      const irIncidentesSobreRraLabel = await screen.findAllByText(
        "IR incidente sobre RRA?",
      );
      const irIncidentesSobreRra = (await screen.findByLabelText(
        "IR incidente sobre RRA?",
      )) as HTMLInputElement;
      expect(irIncidentesSobreRra).toBeInTheDocument();
      expect(irIncidentesSobreRra).not.toBeChecked();
      fireEvent.click(irIncidentesSobreRra);
      expect(irIncidentesSobreRra).toBeChecked();
      expect(irIncidentesSobreRraLabel[0]).toHaveAttribute(
        "for",
        "ir_incidente_rra",
      );
      expect(irIncidentesSobreRra).toHaveAttribute("id", "ir_incidente_rra");
      expect(irIncidentesSobreRraLabel[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );

      const numeroMesesLabel = await screen.findByText("Número de meses");
      expect(numeroMesesLabel).toBeInTheDocument();
      expect(numeroMesesLabel).toHaveAttribute("for", "numero_de_meses");
      expect(numeroMesesLabel).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
      const numeroMesesInput = await screen.findByTestId("numero_de_meses");
      expect(numeroMesesInput).toBeInTheDocument();
      fireEvent.change(numeroMesesInput, { target: { value: 12 } });
      expect(numeroMesesInput).toHaveValue(12);
    });

    it("Teste se o checkbox se IR incidente sobre RRA for marcado. ", async () => {
      const irIncidentesSobreRraLabel = await screen.findAllByText(
        "IR incidente sobre RRA?",
      );
      const irIncidentesSobreRra = (await screen.findByLabelText(
        "IR incidente sobre RRA?",
      )) as HTMLInputElement;
      expect(irIncidentesSobreRra).toBeInTheDocument();
      expect(irIncidentesSobreRra).not.toBeChecked();
      fireEvent.click(irIncidentesSobreRra);
      expect(irIncidentesSobreRra).toBeChecked();
      expect(irIncidentesSobreRraLabel[0]).toHaveAttribute(
        "for",
        "ir_incidente_rra",
      );
      expect(irIncidentesSobreRra).toHaveAttribute("id", "ir_incidente_rra");
      expect(irIncidentesSobreRraLabel[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );

      const numeroMesesLabel = await screen.findByText("Número de meses");
      expect(numeroMesesLabel).toBeInTheDocument();
      expect(numeroMesesLabel).toHaveAttribute("for", "numero_de_meses");
      expect(numeroMesesLabel).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
      const numeroMesesInput = await screen.findByTestId("numero_de_meses");
      expect(numeroMesesInput).toBeInTheDocument();
      fireEvent.change(numeroMesesInput, { target: { value: 12 } });
      expect(numeroMesesInput).toHaveValue(12);
    });

    it("Teste se o checkbox de Incide PSS foi clicado", async () => {
      const incidePss = (await screen.findByLabelText(
        "Incide PSS?",
      )) as HTMLInputElement;
      expect(incidePss).toBeInTheDocument();
      expect(incidePss).not.toBeChecked();
      fireEvent.click(incidePss);
      expect(incidePss).toBeChecked();
      const incidePssLabel = await screen.findAllByText("Incide PSS?");
      expect(incidePssLabel[0]).toHaveAttribute("for", "incidencia_pss");
      expect(incidePss).toHaveAttribute("id", "incidencia_pss");
      expect(incidePssLabel[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );

      const pss = await screen.findByText("PSS");
      expect(pss).toBeInTheDocument();
      expect(pss).toHaveAttribute("for", "valor_pss");
      expect(pss).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
      const pssInput = await screen.findByTestId("valor_pss");
      expect(pssInput).toBeInTheDocument();
      fireEvent.change(pssInput, { target: { value: "R$ 1.000" } });
      expect(pssInput).toHaveValue("R$ 1.000");
    });

    it("Teste se o checkbox de Atualizar para data passada foi clicado", async () => {
      const atualizarDataPassada = (await screen.findByLabelText(
        "Atualizar para data passada?",
      )) as HTMLInputElement;
      expect(atualizarDataPassada).toBeInTheDocument();
      expect(atualizarDataPassada).not.toBeChecked();
      fireEvent.click(atualizarDataPassada);
      expect(atualizarDataPassada).toBeChecked();
      const atualizarDataPassadaLabel = await screen.findAllByText(
        "Atualizar para data passada?",
      );
      expect(atualizarDataPassadaLabel[0]).toHaveAttribute(
        "for",
        "data_limite_de_atualizacao_check",
      );
      expect(atualizarDataPassada).toHaveAttribute(
        "id",
        "data_limite_de_atualizacao_check",
      );
      expect(atualizarDataPassadaLabel[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );

      const dataAtualizadaAte = await screen.findByText("Atualizado até:");
      expect(dataAtualizadaAte).toBeInTheDocument();
      expect(dataAtualizadaAte).toHaveAttribute(
        "for",
        "data_limite_de_atualizacao",
      );
      expect(dataAtualizadaAte).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );

      const dataAtualizadaAteInput = await screen.findByTestId(
        "data_limite_de_atualizacao",
      );
      expect(dataAtualizadaAteInput).toBeInTheDocument();
      fireEvent.change(dataAtualizadaAteInput, {
        target: { value: "2024-01-01" },
      });
      expect(dataAtualizadaAteInput).toHaveValue("2024-01-01");
    });
  });

  describe("Teste do Botão de calcular", () => {
    it("Teste do botão de Calcular", async () => {
      const botaoCalcular = (await screen.findByRole("button", {
        name: "Calcular",
      })) as HTMLButtonElement;
      expect(botaoCalcular).toBeInTheDocument();
      expect(botaoCalcular).toHaveClass(
        "my-8",
        "flex",
        "cursor-pointer",
        "items-center",
        "justify-center",
        "rounded-lg",
        "bg-blue-700",
        "px-5",
        "py-3",
        "text-sm",
        "text-white",
        "transition-all",
        "duration-200",
        "hover:bg-blue-800",
        "focus:z-0",
      );
      fireEvent.click(botaoCalcular);
    });
  });

  describe("Teste de habilitar o salvamento do oficio", () => {
    it("Teste para abrir o formulário para salvar dados do oficio", async () => {
      const salvarInfoOficio = (await screen.findByLabelText(
        "Salvar informações de ofício e recálculo?",
      )) as HTMLInputElement;
      expect(salvarInfoOficio).toBeInTheDocument();
      expect(salvarInfoOficio).not.toBeChecked();
      fireEvent.click(salvarInfoOficio);
      expect(salvarInfoOficio).toBeChecked();
      const salvarInfoOficioLabel = await screen.findAllByText(
        "Salvar informações de ofício e recálculo?",
      );
      expect(salvarInfoOficioLabel[0]).toHaveAttribute("for", "gerar_cvld");
      expect(salvarInfoOficio).toHaveAttribute("id", "gerar_cvld");
      expect(salvarInfoOficioLabel[0]).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );
    });
  });

  describe("Teste do formulário para salvar dados do oficio", () => {
    beforeEach(async () => {
      const salvarInfoOficio = (await screen.findByLabelText(
        "Salvar informações de ofício e recálculo?",
      )) as HTMLInputElement;
      expect(salvarInfoOficio).toBeInTheDocument();
      expect(salvarInfoOficio).not.toBeChecked();
      fireEvent.click(salvarInfoOficio);
      expect(salvarInfoOficio).toBeChecked();
    });

    describe("Teste para verificar titulos do segundo Formulário", () => {
      it("Teste verificar o titulo do Formulário", async () => {
        const titulo = await screen.findByText("Dados de Identificação");
        expect(titulo).toBeInTheDocument();
        expect(titulo).toHaveClass(
          "text-md",
          "w-full",
          "self-center",
          "font-semibold",
        );
      });

      it("Teste para verificar titulo Dados do Processo", async () => {
        const dadosProcesso = await screen.findByText("Dados do Processo");
        expect(dadosProcesso).toBeInTheDocument();
        expect(dadosProcesso).toHaveClass(
          "text-md",
          "w-full",
          "self-center",
          "font-semibold",
        );
      })

      it("Teste para verificar titulo do Contato", async () => {
        const contato = await screen.findByText("Contato");
        expect(contato).toBeInTheDocument();
        expect(contato).toHaveClass(
          "mt-8",
          "text-lg",
          "font-semibold"
        );
      })

    });

    describe("Teste das labels do Formulário Dados de Identificação", () => {
      it("Teste da label de formulário de Nome/Razão Social", async () => {
        const nome = await screen.findByText("Nome/Razão Social");
        expect(nome).toBeInTheDocument();
        expect(nome).toHaveAttribute("for", "credor");
        expect(nome).toHaveClass(
          "font-nexa",
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-meta-5",
        );
      });

      it("Teste da label de formulário de CPF/CNPJ", async () => {
        const cpfCnpj = await screen.findByText("CPF/CNPJ");
        expect(cpfCnpj).toBeInTheDocument();
        expect(cpfCnpj).toHaveAttribute("for", "cpf_cnpj");
        expect(cpfCnpj).toHaveClass(
          "font-nexa",
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-meta-5",
        );
      });

      it("Teste para verificar se a label Espécie está corretamente no formulário", async () => {
        const especie = await screen.findByText("Espécie");
        expect(especie).toBeInTheDocument();
        expect(especie).toHaveAttribute("for", "especie");
        expect(especie).toHaveClass(
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-meta-5",
        );
      });
    });

    describe("Teste das labels do Formulário Dados do Processo", () => {
      it("Teste da label do formulário de NPU Requisitório", async () => {
        const npu = await screen.findByText("NPU (requisitório)");
        expect(npu).toBeInTheDocument();
        expect(npu).toHaveAttribute("for", "npu");
        expect(npu).toHaveClass(
          "font-nexa",
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-meta-5",
        );
      });

      it("Teste da label do formulário NPU Originario", async () => {
        const npuOriginario = await screen.findByText("NPU (originario)");
        expect(npuOriginario).toBeInTheDocument();
        expect(npuOriginario).toHaveAttribute("for", "npu_originario");
        expect(npuOriginario).toHaveClass(
          "font-nexa",
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-meta-5",
        );
      })

      it("Teste da label do formulário de Esfera", async () => { 
        const esfera = await screen.findByText("Esfera");
        expect(esfera).toBeInTheDocument();
        expect(esfera).toHaveAttribute("for", "esfera");
        expect(esfera).toHaveClass(
          "font-nexa",
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-meta-5",
        );
      });

      it("Teste da label do formulário Ente Devedor", async () => {
        const enteDevedor = await screen.findByText("Ente Devedor");
        expect(enteDevedor).toBeInTheDocument();
        expect(enteDevedor).toHaveAttribute("for", "ente_devedor");
        expect(enteDevedor).toHaveClass(
          "font-nexa",
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-meta-5",
        );
      })

      it("Teste da label do formulário de Juízo/Vara", async () => {
        const juizoVara = await screen.findByText("Juízo/Vara");
        expect(juizoVara).toBeInTheDocument();
        expect(juizoVara).toHaveAttribute("for", "juizo_vara");
        expect(juizoVara).toHaveClass(
          "font-nexa",
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-meta-5",
        );
      })

      it("Teste da label do formulário do Tribunal", async () => {
        const tribunal = await screen.findByText("Tribunal");
        expect(tribunal).toBeInTheDocument();
        expect(tribunal).toHaveAttribute("for", "tribunal");
        expect(tribunal).toHaveClass(
          "font-nexa",
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-meta-5",
        );
      })

      it("Teste da label do tipo de Precatório", async () => { 
        const tipoPrecatorio = await screen.findByText("Tipo");
        expect(tipoPrecatorio).toBeInTheDocument();
        expect(tipoPrecatorio).toHaveAttribute("for", "tipo");
        expect(tipoPrecatorio).toHaveClass(
          "font-nexa",
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-meta-5",
        );
      });

      it("Teste da label do tipo de Status", async () => {
        const status = await screen.findByText("Status");
        expect(status).toBeInTheDocument();
        expect(status).toHaveAttribute("for", "status");
        expect(status).toHaveClass(
          "font-nexa",
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-meta-5",
        );
      })

      it("Teste da label do formulário de Regime", async () => {

        const esfera = await screen.findByText("Esfera");
        expect(esfera).toBeInTheDocument();
        fireEvent.click(esfera);

        const select =
          document.querySelector('[aria-labelledby="natureza"]') ||
          document.querySelector('[name="esfera"]');
        expect(select).toBeInTheDocument();

        if (!select) {
          throw new Error("Select não encontrado.");
        }
        expect(select).toHaveValue("FEDERAL");

        fireEvent.mouseDown(select as HTMLElement);
        fireEvent.change(select, { target: { value: "ESTADUAL" } });

        expect(select).toHaveValue("ESTADUAL");

        const regime = await screen.findByText("Regime");
        expect(regime).toBeInTheDocument();
        expect(regime).toHaveAttribute("for", "natureza");
        expect(regime).toHaveClass(
          "font-nexa",
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-meta-5",
        );
      })

      it("Teste da label do formulário de Estado do Ente Devedor", async () => {

         const esfera = await screen.findByText("Esfera");
         expect(esfera).toBeInTheDocument();
         fireEvent.click(esfera);

         const select =
           document.querySelector('[aria-labelledby="natureza"]') ||
           document.querySelector('[name="esfera"]');
         expect(select).toBeInTheDocument();

         if (!select) {
           throw new Error("Select não encontrado.");
         }
         expect(select).toHaveValue("FEDERAL");

         fireEvent.mouseDown(select as HTMLElement);
         fireEvent.change(select, { target: { value: "ESTADUAL" } });

         expect(select).toHaveValue("ESTADUAL");

        const estadoEnteDevedor = await screen.findByText("Estado do Ente Devedor");
        expect(estadoEnteDevedor).toBeInTheDocument();
        expect(estadoEnteDevedor).toHaveAttribute("for", "estado_ente_devedor");
        expect(estadoEnteDevedor).toHaveClass(
          "font-nexa",
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-meta-5",
        );
      });
    });

    describe("Teste das labels do Formulário Contato", () => {
      it("Teste da label de formulário de Email de Contato", async () => {
        const email = await screen.findByText("Email de Contato");
        expect(email).toBeInTheDocument();
        expect(email).toHaveAttribute("for", "email_contato");
        expect(email).toHaveClass(
          "font-nexa",
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-meta-5",
        );
      });

      it("Teste da label de formulário de Telefone", async () => {
        const telefone = await screen.findByText("Telefone de Contato");
        expect(telefone).toBeInTheDocument();
        expect(telefone).toHaveAttribute("for", "telefone_contato");
        expect(telefone).toHaveClass(
          "font-nexa",
          "text-xs",
          "font-semibold",
          "uppercase",
          "text-meta-5",
        );
      })
    });
  });

  describe("Teste do input do Formulário Dados de Identificação", () => {

    beforeEach(async () => {
      const salvarInfoOficio = (await screen.findByLabelText(
        "Salvar informações de ofício e recálculo?",
      )) as HTMLInputElement;
      expect(salvarInfoOficio).toBeInTheDocument();
      expect(salvarInfoOficio).not.toBeChecked();
      fireEvent.click(salvarInfoOficio);
      expect(salvarInfoOficio).toBeChecked();
    });
    
     it("Teste do input de Nome/Razão Social", async () => { 
       const nomeRazaoSocial = await screen.findByText("Nome/Razão Social");
       expect(nomeRazaoSocial).toBeInTheDocument();

       const input = await screen.findByTestId("credor");
       fireEvent.change(input, { target: { value: "Paul Di'Anno" } });
       expect(input).toHaveValue("Paul Di'Anno");
     });
    
    it("Teste do input de CPF/CNPJ", async () => {
      const cpfCnpj = await screen.findByText("CPF/CNPJ");
      expect(cpfCnpj).toBeInTheDocument();

      const input = await screen.findByTestId("cpf_cnpj");
      fireEvent.change(input, { target: { value: "123.456.789-10" } });
      expect(input).toHaveValue("123.456.789-10");
    });
    
    it("Teste do Select de Espécie", async () => {
      const especie = await screen.findByText("Espécie");
      expect(especie).toBeInTheDocument();

      const select = document.querySelector('[name="especie"]') 
       expect(select).toBeInTheDocument();

      if (!select || select === undefined) throw new Error("Select não encontrado.");

       expect(select).toHaveValue("PRINCIPAL");

       fireEvent.mouseDown(select as HTMLElement);
       fireEvent.change(select, {
         target: { value: "HONORARIOS_CONTRATUAIS" },
       });

      expect(select).toHaveValue("HONORARIOS_CONTRATUAIS");
      
      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "HONORARIOS_SUCUMBENCIAs" },
      });

      expect(select).toHaveValue("HONORARIOS_SUCUMBENCIAs");
    });

    it("Teste do checbox de Dados de Identificação", async () => {
      const checkbox = await screen.findByLabelText(
        "Já possui destacamento de honorários?",
      );
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeChecked();
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();

      const percentual = await screen.findByText("Percentual");
      expect(percentual).toBeInTheDocument();
      expect(percentual).toHaveAttribute("for", "percentual_de_honorarios");
      expect(percentual).toHaveClass(
        "font-nexa",
        "text-xs",
        "font-semibold",
        "uppercase",
        "text-meta-5",
      );

      const input = await screen.findByTestId("percentual_de_honorarios");
      expect(input).toBeInTheDocument();
      fireEvent.change(input, { target: { value: 30 } });
      expect(input).toHaveValue(30);
    });
  });

  describe("Teste do input do Formulário Dados do Processo", () => { 

    beforeEach(async () => {
      const salvarInfoOficio = (await screen.findByLabelText(
        "Salvar informações de ofício e recálculo?",
      )) as HTMLInputElement;
      expect(salvarInfoOficio).toBeInTheDocument();
      expect(salvarInfoOficio).not.toBeChecked();
      fireEvent.click(salvarInfoOficio);
      expect(salvarInfoOficio).toBeChecked();
    });

    it("Teste do input de NPU Requisitório", async () => {
      
      const npu = await screen.findByText("NPU (requisitório)");
      expect(npu).toBeInTheDocument();

      const input = await screen.findByTestId("npu");
      await userEvent.type(input, "0000000000000000000000");

      // Verifica se o valor foi formatado corretamente
      expect(input).toHaveValue("0000000-00.0000.0.00.0000");
    });

    it("Teste do input de NPU Originário", async () => {

      const npu = await screen.findByText("NPU (originario)");
      expect(npu).toBeInTheDocument();

      const input = await screen.findByTestId("npu_originario");
      await userEvent.type(input, "0000000000000000000000");

      expect(input).toHaveValue("0000000-00.0000.0.00.0000");
    });

    it("Teste do Select de Esfera", async () => {
      const esfera = await screen.findByText("Esfera");
      expect(esfera).toBeInTheDocument();

      const select = document.querySelector('[name="esfera"]');
      expect(select).toBeInTheDocument();

      if (!select || select === undefined)
        throw new Error("Select não encontrado.");

      expect(select).toHaveValue("FEDERAL");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "ESTADUAL" },
      });

      expect(select).toHaveValue("ESTADUAL");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "MUNICIPAL" },
      });

      expect(select).toHaveValue("MUNICIPAL");
    });

    it("Teste do select de Regime", async () => {
      const esfera = await screen.findByText("Esfera");
      expect(esfera).toBeInTheDocument();

      const select = document.querySelector('[name="esfera"]');
      expect(select).toBeInTheDocument();

      if (!select || select === undefined)
        throw new Error("Select não encontrado.");

      expect(select).toHaveValue("FEDERAL");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "ESTADUAL" },
      });

      expect(select).toHaveValue("ESTADUAL");

      const regime = await screen.findByText("Regime");
      expect(regime).toBeInTheDocument();

      const regimeSelect = document.querySelector('[name="regime"]');
      expect(regimeSelect).toBeInTheDocument();

      if (!regimeSelect || regimeSelect === undefined)
        throw new Error("Select não encontrado.");

      expect(regimeSelect).toHaveValue("GERAL");

      fireEvent.mouseDown(regimeSelect as HTMLElement);
      fireEvent.change(regimeSelect, {
        target: { value: "ESPECIAL" },
      });
    })

    it("Teste de input do Estado do Ente Devedor", async () => {
      
      const esfera = await screen.findByText("Esfera");
      expect(esfera).toBeInTheDocument();

      const select = document.querySelector('[name="esfera"]');
      expect(select).toBeInTheDocument();

      if (!select || select === undefined)
        throw new Error("Select não encontrado.");

      expect(select).toHaveValue("FEDERAL");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "ESTADUAL" },
      });

      expect(select).toHaveValue("ESTADUAL");

      const estadoEnteDevedor = await screen.findByText(
        "Estado do Ente Devedor",
      );
      expect(estadoEnteDevedor).toBeInTheDocument();

      const selectEnteDevedor = document.querySelector(
        '[name="estado_ente_devedor"]',
      );
      expect(selectEnteDevedor).toBeInTheDocument();

      if (!selectEnteDevedor || selectEnteDevedor === undefined)
        throw new Error("Select não encontrado.");
      
      fireEvent.mouseDown(selectEnteDevedor as HTMLElement);
      fireEvent.change(selectEnteDevedor, {
        target: { value: "PE" },
      });

      expect(selectEnteDevedor).toHaveValue("PE");

      fireEvent.mouseDown(selectEnteDevedor as HTMLElement);
      fireEvent.change(selectEnteDevedor, {
        target: { value: "SP" },
      });

      expect(selectEnteDevedor).toHaveValue("SP");
    });

    it("Teste do input Ente Devedor", async () => {
      const enteDevedor = await screen.findByText("Ente Devedor");
      expect(enteDevedor).toBeInTheDocument();

      const input = await screen.findByTestId("ente_devedor");
      fireEvent.change(input, { target: { value: "Governo do Estado de São Paulo" } });
      expect(input).toHaveValue("Governo do Estado de São Paulo");
    });

    it("Teste do input de Juízo/Vara", async () => {
      const juizoVara = await screen.findByText("Juízo/Vara");
      expect(juizoVara).toBeInTheDocument();

      const input = await screen.findByTestId("juizo_vara");
      fireEvent.change(input, { target: { value: "Vara de Execução Fiscal" } });
      expect(input).toHaveValue("Vara de Execução Fiscal");
    });
    
    it("Teste do input de Tribunal", async () => {
      const tribunal = await screen.findByText("Tribunal");
      expect(tribunal).toBeInTheDocument();

       const selectTribunal = document.querySelector(
         '[name="tribunal"]',
       );
       expect(selectTribunal).toBeInTheDocument();

       if (!selectTribunal || selectTribunal === undefined)
        throw new Error("Select não encontrado.");
      
      fireEvent.mouseDown(selectTribunal as HTMLElement);
      fireEvent.change(selectTribunal, {
        target: { value: "TRF1" },
      });

      expect(selectTribunal).toHaveValue("TRF1");

      fireEvent.mouseDown(selectTribunal as HTMLElement);
      fireEvent.change(selectTribunal, {
        target: { value: "STF" },
      });
      expect(selectTribunal).toHaveValue("STF");
    });

    it("Teste de Tipo de Precatório", async () => { 
      const tipoPrecatorio = await screen.findByText("Tipo");
      expect(tipoPrecatorio).toBeInTheDocument();

      const select = document.querySelector('[name="tipo_do_oficio"]');
      expect(select).toBeInTheDocument();

      if (!select || select === undefined) throw new Error("Select não encontrado.");

      expect(select).toHaveValue("PRECATÓRIO");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "RPV" },
      });

      expect(select).toHaveValue("RPV");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "CREDITÓRIO" },
      });

      expect(select).toHaveValue("CREDITÓRIO");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "PRE-RPV" },
      });

      expect(select).toHaveValue("PRE-RPV");
    });

    it("Teste do input de Status", async () => {
      const status = await screen.findByText("Status");
      expect(status).toBeInTheDocument();

      const select = document.querySelector('[name="status"]');
      expect(select).toBeInTheDocument();


      if (!select || select === undefined)
        throw new Error("Select não encontrado.");

      expect(select).toHaveValue("Realizar Primeiro Contato");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "1º Contato não alcançado" },
      });

      expect(select).toHaveValue("1º Contato não alcançado");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "2º Contato não alcançado" },
      });

      expect(select).toHaveValue("2º Contato não alcançado");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "3º Contato não alcançado" },
      });

      expect(select).toHaveValue("3º Contato não alcançado");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "Calcular Valor Líquido" },
      });

      expect(select).toHaveValue("Calcular Valor Líquido");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "Juntar Ofício ou Memória de Cálculo" },
      });

      expect(select).toHaveValue("Juntar Ofício ou Memória de Cálculo");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "Enviar proposta" },
      });

      expect(select).toHaveValue("Enviar proposta");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "Negociação em Andamento" },
      });

      expect(select).toHaveValue("Negociação em Andamento");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "Proposta aceita" },
      });

      expect(select).toHaveValue("Proposta aceita");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "Já vendido" },
      });

      expect(select).toHaveValue("Já vendido");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "Contato inexistente" },
      });

      expect(select).toHaveValue("Contato inexistente");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "Ausência de resposta" },
      });

      expect(select).toHaveValue("Ausência de resposta");

      fireEvent.mouseDown(select as HTMLElement);
      fireEvent.change(select, {
        target: { value: "Demonstrou falta de interesse" },
      });

      expect(select).toHaveValue("Demonstrou falta de interesse");

    });

  });

  describe("Teste do input do Formulário Contato", () => { 

    beforeEach(async () => {
      const salvarInfoOficio = (await screen.findByLabelText(
        "Salvar informações de ofício e recálculo?",
      )) as HTMLInputElement;
      expect(salvarInfoOficio).toBeInTheDocument();
      expect(salvarInfoOficio).not.toBeChecked();
      fireEvent.click(salvarInfoOficio);
      expect(salvarInfoOficio).toBeChecked();
    });

    it("Teste do input de Email de Contato", async () => { 
      const email = await screen.findByText("Email de Contato");
      expect(email).toBeInTheDocument();

      const input = await screen.findByPlaceholderText("ada@lovelace.com");
      expect(input).toBeInTheDocument();

      fireEvent.change(input, { target: { value: "jameshetfield@email.com" } });
      expect(input).toHaveValue("jameshetfield@email.com");
    });

    it("Teste do input de Telefone de Contato", async () => {
      const telefone = await screen.findByText("Telefone de Contato");
      expect(telefone).toBeInTheDocument();

      const input = await screen.findByPlaceholderText("(00) 00000-0000");
      expect(input).toBeInTheDocument();

      fireEvent.change(input, { target: { value: "(11) 99999-9999" } });
      expect(input).toHaveValue("(11) 99999-9999");
    });

    it("Teste do botão de adicionar Telefone de Contato", async () => {
      const adicionarTelefone = await screen.findByTestId(
        "add-telefone-contato",
      );
      expect(adicionarTelefone).toBeInTheDocument();
      expect(adicionarTelefone).toHaveClass(
        "absolute",
        "right-2",
        "top-0",
        "flex",
        "h-4",
        "w-4",
        "cursor-pointer",
        "items-center",
        "justify-center",
        "rounded-sm",
        "bg-slate-200",
        "hover:bg-slate-300",
        "dark:bg-slate-600",
        "dark:hover:bg-slate-700",
      );
      fireEvent.click(adicionarTelefone);
    });

    it("Teste do botão de remover Telefone de Contato", async () => { 
      const adicionarTelefone = await screen.findByTestId(
        "add-telefone-contato",
      );
      expect(adicionarTelefone).toBeInTheDocument();
      expect(adicionarTelefone).toHaveClass(
        "absolute",
        "right-2",
        "top-0",
        "flex",
        "h-4",
        "w-4",
        "cursor-pointer",
        "items-center",
        "justify-center",
        "rounded-sm",
        "bg-slate-200",
        "hover:bg-slate-300",
        "dark:bg-slate-600",
        "dark:hover:bg-slate-700",
      );
      fireEvent.click(adicionarTelefone);

      const removerTelefone = await screen.findByTestId(
        "remove-telefone-contato",
      );
      expect(removerTelefone).toBeInTheDocument();
      expect(removerTelefone).toHaveClass(
        "absolute",
        "right-2",
        "top-0",
        "flex",
        "h-4",
        "w-4",
        "cursor-pointer",
        "items-center",
        "justify-center",
        "rounded-sm",
        "bg-slate-200",
        "hover:bg-slate-300",
        "dark:bg-slate-600",
        "dark:hover:bg-slate-700",
      );
      fireEvent.click(removerTelefone);

    });

  });

});
