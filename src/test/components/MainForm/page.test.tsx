import MainForm from "@/components/MainForm";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
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
  //Dificilmente voce verá uma variavel global sendo usada em um teste, mas aqui é um caso especial.
  var dataCallback = jest.fn();
  var setCalcStep = jest.fn();
  var setDataToAppend = jest.fn();

  render(
    <QueryClientProvider client={(global as any).queryClient}>
      <MainForm dataCallback={dataCallback} setCalcStep={setCalcStep} setDataToAppend={setDataToAppend} />
    </QueryClientProvider>,
  );
});

describe("Teste dos Headers do Formulário", () => {
  it("Teste para carregar o header do formulário", async () => {
    const cabecalho = await screen.findByText("Celer");
    expect(cabecalho).toBeInTheDocument();

    const header = await screen.findByRole("heading", {
      name: "Celer",
      level: 2,
    });
    expect(header).toBeInTheDocument();

    const imagem = await screen.findByRole("img", {
      name: "Celler IA Engine",
    });
    expect(imagem).toBeInTheDocument();

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

    const datareq = await screen.findByText("Data de Requisição / Recebimento");
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

  it("Teste dos checkboxes do Formulário", async () => {
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

  it("Teste dos inputs do formulário com ambas as opções de Natureza", async () => {
    /**
   * Caso em alguns tests voce não consiga testar o ShadSelect, tente essa alternatva.
   * import userEvent from "@testing-library/user-event";

      userEvent.click(select);
      const option = await screen.findByText("Tributária");
      userEvent.click(option);
      expect(select).toHaveValue("TRIBUTÁRIA");
   */
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

    const valorPrincipalInput = await screen.findAllByTestId("valor_principal");
    expect(valorPrincipalInput[0]).toBeInTheDocument();

    fireEvent.change(valorPrincipalInput[0], {
      target: { value: "R$ 1.000" },
    });
    expect(valorPrincipalInput[0]).toHaveValue("R$ 1.000");

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

    const databaseInput = await screen.findAllByTestId("data_base") as HTMLInputElement[];
    expect(databaseInput[0]).toBeInTheDocument();
    fireEvent.change(databaseInput[0], { target: { value: "2024-01-01" } });
    expect(databaseInput[0]).toHaveValue("2024-01-01");

    const datareq = await screen.findAllByText(/Data de Requisição \/ Recebimento/i);
    expect(datareq[0]).toBeInTheDocument();
    expect(datareq[0]).toHaveAttribute("for", "data_requisicao");
    expect(datareq[0]).toHaveClass(
      "font-nexa",
      "text-xs",
      "font-semibold",
      "uppercase",
      "text-meta-5",
    );

    const datareqInput = await screen.findAllByTestId("data_requisicao") as HTMLInputElement[];
    expect(datareqInput[0]).toBeInTheDocument();
    fireEvent.change(datareqInput[0], { target: { value: "2024-01-01" } });
    expect(datareqInput[0]).toHaveValue("2024-01-01");

  });

  it("Teste se o valor de Natureza for Tributária", async () => { 
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

    const select =
      document.querySelector('[aria-labelledby="natureza"]') ||
      document.querySelector('[name="natureza"]');
    expect(select).toBeInTheDocument();
    
    if (!select) {
      throw new Error("Select não encontrado.");
    }

    fireEvent.mouseDown(select as HTMLElement);
    fireEvent.change(select, { target: { value: "TRIBUTÁRIA" } });

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

    const valorPrincipalInput = await screen.findAllByTestId("valor_principal");
    expect(valorPrincipalInput[0]).toBeInTheDocument();

    fireEvent.change(valorPrincipalInput[0], {
      target: { value: "R$ 1.000" },
    });
    expect(valorPrincipalInput[0]).toHaveValue("R$ 1.000");

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
    const databaseInput = (await screen.findAllByTestId(
      "data_base",
    )) as HTMLInputElement[];
    expect(databaseInput[0]).toBeInTheDocument();
    fireEvent.change(databaseInput[0], { target: { value: "2024-01-01" } });
    expect(databaseInput[0]).toHaveValue("2024-01-01");

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
    expect(dataAtualizadaAte).toHaveAttribute("for", "data_limite_de_atualizacao");
    expect(dataAtualizadaAte).toHaveClass(
      "font-nexa",
      "text-xs",
      "font-semibold",
      "uppercase",
      "text-meta-5",
    );

    const dataAtualizadaAteInput = await screen.findByTestId("data_limite_de_atualizacao");
    expect(dataAtualizadaAteInput).toBeInTheDocument();
    fireEvent.change(dataAtualizadaAteInput, { target: { value: "2024-01-01" } });
    expect(dataAtualizadaAteInput).toHaveValue("2024-01-01");
  });

  it("Teste do botão de Calcular", async () => { 
    const botaoCalcular = await screen.findByRole("button", {
      name: "Calcular",
    }) as HTMLButtonElement;
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
      "focus:z-0"
    );
    fireEvent.click(botaoCalcular);
  });

});
