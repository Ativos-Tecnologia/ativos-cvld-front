import AutomatedProposal from "@/app/automated-proposal/page";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";

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

  /**
   * Esse teste precisa ser revisado com detalhes, pois houve alguns conflitos semânticos de HTML.
   */

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
    const selectLabel = await screen.findByText(/Natureza/i);
    expect(selectLabel).toBeInTheDocument();

    const naoTributaria = await screen.findAllByText(/Não Tributária/i);
    expect(naoTributaria[0]).toBeInTheDocument();

    const tributaria = await screen.findAllByText(/Tributária/i);
    expect(tributaria[0]).toBeInTheDocument();
  })

});
