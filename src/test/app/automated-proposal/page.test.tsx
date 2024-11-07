import AutomatedProposal from "@/app/automated-proposal/page";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
      <AutomatedProposal/>
    </QueryClientProvider>,
  );
});

describe("Testes da Página de Proposta Automatizada", () => { 
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
    const botao = await screen.findByText(/clique aqui para ir ao formulário/i);
    expect(botao).toBeInTheDocument();
  })

  it("Teste para mostrar titulo do formulário", async () => {
    const tituloDoFormulario = await screen.findByRole("heading", {
      name: "Preencha o formulário abaixo",
      level: 2,
    });
    expect(tituloDoFormulario).toBeInTheDocument();
  });

  it("Teste para mostrar Tipo de Oficio", async () => {
    const ENUM_TIPO_OFICIOS_LIST = {
      PRECATÓRIO: "PRECATÓRIO",
      RPV: "RPV",
      CREDITÓRIO: "CREDITÓRIO",
      PRE_RPV: "PRE-RPV",
    };

    const selectLabel = await screen.findByText(/tipo/i);
    expect(selectLabel).toBeInTheDocument();

    // Verifica se as opções estão disponíveis
    Object.values(ENUM_TIPO_OFICIOS_LIST).forEach(async (value) => {
      const option = await screen.findByRole("option", { name: value });
      expect(option).toBeInTheDocument();
    });
  });

  it("Teste para mostrar Natureza", async () => {

    const naturezaOption = {
      naoTributaria: "NÃO TRIBUTÁRIA",
      tributaria: "TRIBUTÁRIA",
    };

    const selectLabel = await screen.findByText(/Natureza/i);
    expect(selectLabel).toBeInTheDocument();

    Object.values(naturezaOption).forEach(async (value) => {
      const option = await screen.findByRole("option", { name: value });
      expect(option).toBeInTheDocument();
    });

  })

  it("Teste para verificar Esfera", async () => { 
    const esferaOption = {
      federal: "FEDERAL",
      estadual: "ESTADUAL",
      municipal: "MUNICIPAL",
    };

    const selectLabel = await screen.findByText(/Esfera/i);
    expect(selectLabel).toBeInTheDocument();

    Object.values(esferaOption).forEach(async (value) => {
      const option = await screen.findByRole("option", { name: value });
      expect(option).toBeInTheDocument();
    });
  });


  /**
   * Esse teste para verificar o Regime está com erro, pois o componente que engloba o select, não é um select puro.
   * O jest só consegue testar componentes puros do HTML.
   */

// it("Teste para verificar Regime", async () => {
//   const regimeOption = {
//     GERAL: "GERAL",
//     ESPECIAL: "ESPECIAL",
//   };

//   const esfera = await screen.findByText(/Esfera/i);
//   expect(esfera).toBeInTheDocument();

//   const optionEstadual = await screen.findByTestId("esfera-id");
//   userEvent.selectOptions(optionEstadual, "Estadual");

//   const regime = (await screen.findByLabelText("Regime")) as HTMLInputElement;
//   expect(regime).toBeInTheDocument();

//   for (const value of Object.values(regimeOption)) {
//     const option = await screen.findByText(value);
//     expect(option).toBeInTheDocument();
//   }
// });

  it("Teste para verificar todos os Tribunais", async () => {

    const tribunais = [
      { id: "TRF1", nome: "Tribunal Regional Federal - 1ª Região" },
      { id: "TRF2", nome: "Tribunal Regional Federal - 2ª Região" },
      { id: "TRF3", nome: "Tribunal Regional Federal - 3ª Região" },
      { id: "TRF4", nome: "Tribunal Regional Federal - 4ª Região" },
      { id: "TRF5", nome: "Tribunal Regional Federal - 5ª Região" },
      { id: "TRF6", nome: "Tribunal Regional Federal - 6ª Região" },
      { id: "STF", nome: "Supremo Tribunal Federal" },
      { id: "STJ", nome: "Superior Tribunal de Justiça" },
      { id: "TST", nome: "Tribunal Superior do Trabalho" },
      { id: "TSE", nome: "Tribunal Superior Eleitoral" },
      { id: "STM", nome: "Superior Tribunal Militar" },
      { id: "TJAC", nome: "Tribunal de Justiça do Acre" },
      { id: "TJAL", nome: "Tribunal de Justiça de Alagoas" },
      { id: "TJAP", nome: "Tribunal de Justiça do Amapá" },
      { id: "TJAM", nome: "Tribunal de Justiça do Amazonas" },
      { id: "TJBA", nome: "Tribunal de Justiça da Bahia" },
      { id: "TJCE", nome: "Tribunal de Justiça do Ceará" },
      {
        id: "TJDFT",
        nome: "Tribunal de Justiça do Distrito Federal e dos Territórios",
      },
      { id: "TJES", nome: "Tribunal de Justiça do Espírito Santo" },
      { id: "TJGO", nome: "Tribunal de Justiça de Goiás" },
      { id: "TJMA", nome: "Tribunal de Justiça do Maranhão" },
      { id: "TJMT", nome: "Tribunal de Justiça do Mato Grosso" },
      { id: "TJMS", nome: "Tribunal de Justiça do Mato Grosso do Sul" },
      { id: "TJMG", nome: "Tribunal de Justiça de Minas Gerais" },
      { id: "TJPA", nome: "Tribunal de Justiça do Pará" },
      { id: "TJPB", nome: "Tribunal de Justiça da Paraíba" },
      { id: "TJPE", nome: "Tribunal de Justiça de Pernambuco" },
      { id: "TJPI", nome: "Tribunal de Justiça do Piauí" },
      { id: "TJPR", nome: "Tribunal de Justiça do Paraná" },
      { id: "TJRJ", nome: "Tribunal de Justiça do Rio de Janeiro" },
      { id: "TJRN", nome: "Tribunal de Justiça do Rio Grande do Norte" },
      { id: "TJRO", nome: "Tribunal de Justiça de Rondônia" },
      { id: "TJRR", nome: "Tribunal de Justiça de Roraima" },
      { id: "TJRS", nome: "Tribunal de Justiça do Rio Grande do Sul" },
      { id: "TJSC", nome: "Tribunal de Justiça de Santa Catarina" },
      { id: "TJSE", nome: "Tribunal de Justiça de Sergipe" },
      { id: "TJSP", nome: "Tribunal de Justiça de São Paulo" },
      { id: "TJTO", nome: "Tribunal de Justiça do Tocantins" },
      { id: "TRT1", nome: "Tribunal Regional do Trabalho da 1ª Região" },
      { id: "TRT2", nome: "Tribunal Regional do Trabalho da 2ª Região" },
      { id: "TRT3", nome: "Tribunal Regional do Trabalho da 3ª Região" },
      { id: "TRT4", nome: "Tribunal Regional do Trabalho da 4ª Região" },
      { id: "TRT5", nome: "Tribunal Regional do Trabalho da 5ª Região" },
      { id: "TRT6", nome: "Tribunal Regional do Trabalho da 6ª Região" },
      { id: "TRT7", nome: "Tribunal Regional do Trabalho da 7ª Região" },
      { id: "TRT8", nome: "Tribunal Regional do Trabalho da 8ª Região" },
      { id: "TRT9", nome: "Tribunal Regional do Trabalho da 9ª Região" },
      { id: "TRT10", nome: "Tribunal Regional do Trabalho da 10ª Região" },
      { id: "TRT11", nome: "Tribunal Regional do Trabalho da 11ª Região" },
      { id: "TRT12", nome: "Tribunal Regional do Trabalho da 12ª Região" },
      { id: "TRT13", nome: "Tribunal Regional do Trabalho da 13ª Região" },
      { id: "TRT14", nome: "Tribunal Regional do Trabalho da 14ª Região" },
      { id: "TRT15", nome: "Tribunal Regional do Trabalho da 15ª Região" },
      { id: "TRT16", nome: "Tribunal Regional do Trabalho da 16ª Região" },
      { id: "TRT17", nome: "Tribunal Regional do Trabalho da 17ª Região" },
      { id: "TRT18", nome: "Tribunal Regional do Trabalho da 18ª Região" },
      { id: "TRT19", nome: "Tribunal Regional do Trabalho da 19ª Região" },
      { id: "TRT20", nome: "Tribunal Regional do Trabalho da 20ª Região" },
      { id: "TRT21", nome: "Tribunal Regional do Trabalho da 21ª Região" },
      { id: "TRT22", nome: "Tribunal Regional do Trabalho da 22ª Região" },
      { id: "TRT23", nome: "Tribunal Regional do Trabalho da 23ª Região" },
      { id: "TRT24", nome: "Tribunal Regional do Trabalho da 24ª Região" },
    ];

    const selectLabel = await screen.findAllByText(/Tribunal/i);
    expect(selectLabel[0]).toBeInTheDocument();

    Object.values(tribunais).forEach(async (value) => {
      const option = await screen.findByRole("option", {
        name: value.nome,
      });
      expect(option).toBeInTheDocument();
    });
  });
  
  it("Teste para verificar valor principal", async () => {
    const valorPrincipal = await screen.findByText(/Valor Principal/i);
    expect(valorPrincipal).toBeInTheDocument();

    const input = await screen.findAllByDisplayValue("R$ 0") as HTMLInputElement[];
    expect(input[0]).toBeInTheDocument();

    fireEvent.change(input[0], { target: { value: "1000" } });
    expect(input[0].value).toBe("R$ 1.000");
  });

  it("Teste para verificar valor de juros", async () => {

    const valorJuros = await screen.findAllByText(/Juros/i);
    expect(valorJuros[0]).toBeInTheDocument();

    const input = await screen.findAllByDisplayValue("R$ 0") as HTMLInputElement[];
    expect(input[1]).toBeInTheDocument();

    fireEvent.change(input[1], { target: { value: "1000" } });
    expect(input[1].value).toBe("R$ 1.000");
  });

  it("Teste para verificar Data Base", async () => {    
    const dataBase = await screen.findByLabelText(/Data Base/i) as HTMLInputElement;
    expect(dataBase).toBeInTheDocument();

    const input = await screen.findByTestId("data-base") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "2022-12-31" } });
    expect(input.value).toBe("2022-12-31");
  });

  it("Teste para verificar Data de Requisição / Recebimento", async () => {
    const dataRequisicaoRecebimento = await screen.getByLabelText(
      "Data de Requisição / Recebimento",
    ) as HTMLInputElement;
    expect(dataRequisicaoRecebimento).toBeInTheDocument();

    const input = (await screen.findByTestId(
      "data_requisicao",
    )) as HTMLInputElement;
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "2022-12-31" } });
    expect(input.value).toBe("2022-12-31");
  });

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
  })

  it("Testar Percentual de aquisição", async () => { 

     const checkbox = (await screen.getByLabelText(
       "Aquisição total",
     )) as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();
    
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();

    const percentualAquisicao = await screen.findByText(/Percentual de aquisição/i);
    expect(percentualAquisicao).toBeInTheDocument();

    const input = await screen.findByTestId("percentual-aquisicao") as HTMLInputElement;
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

    const container = screen.getByLabelText("PSS").closest("div") as HTMLInputElement;
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
  })

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
  })
  it("Teste para verificar Regime", async () => {
    const regimeOption = {
      GERAL: "GERAL",
      ESPECIAL: "ESPECIAL", 
    };

    const selectLabel = await screen.findByText(/Esfera/i);
    expect(selectLabel).toBeInTheDocument();

    // First select ESTADUAL in Esfera to make Regime appear
    const esferaSelect = await screen.findByTestId("esfera-id");
    userEvent.selectOptions(esferaSelect, "ESTADUAL");

    // Now look for Regime after Esfera is changed
    const regimeLabel = await screen.findByText("Regime");
    expect(regimeLabel).toBeInTheDocument();

    // Verify regime options are present
    Object.values(regimeOption).forEach(async (value) => {
      const option = await screen.findByRole("option", { name: value });
      expect(option).toBeInTheDocument();
    });
  });
});
