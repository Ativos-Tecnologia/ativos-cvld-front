import AutomatedProposal from "@/app/automated-proposal/page";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
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

it("Teste para verificar Regime", async () => {
  const regimeOption = {
    GERAL: "GERAL",
    ESPECIAL: "ESPECIAL",
  };

  const esfera = await screen.findByText(/Esfera/i);
  expect(esfera).toBeInTheDocument();

  const selectEsfera = await screen.findByTestId("esfera-select");
  selectEsfera.click();

  // selectEsfera.click();
  userEvent.click(screen.getByText("ESTADUAL"));

  // const selectLabel = await screen.findByText(/Regime/i);
  // expect(selectLabel).toBeInTheDocument();

  // for (const value of Object.values(regimeOption)) {
  //   const option = await screen.findByText(value);
  //   expect(option).toBeInTheDocument();
  // }
});

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
   }) ;

});
