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

  //  it("Teste para mostrar Tipo de Oficio", async () => {
  //    // verificando se o select tipo está sendo exibido. 
  //    const selectContainer = await screen.findByText(/tipo/i);
  //    expect(selectContainer).toBeInTheDocument();

  //    // Testando se o valor default é "PRECATÓRIO"
  //    const selectTipoLabel = await screen.findByLabelText(/tipo/i);
  //    expect(selectTipoLabel).toHaveValue("PRECATÓRIO");

  //    // Teste para selecionar componentes do tipo select
  //    const selectComponent = await screen.findByRole("combobox", {
  //      name: /tipo/i,
  //    });
  //    expect(selectComponent).toBeInTheDocument();

  //    // Testando os valores enumerados
  //    const expectedOptions = ["PRECATÓRIO", "RPV", "CREDITÓRIO", "PRE-RPV"];
  
  //    expectedOptions.forEach((option) => {
  //      expect(ENUM_TIPO_OFICIOS_LIST).toContain(option);
  //    });
  //    // Testando se o valor do ShadSelect é do tipo oficio
  //    const selectTipo = await screen.findByLabelText(/tipo/i);
  //     expect(selectTipo).toBeInTheDocument();

  //    expect(selectTipo).toHaveAttribute("name", "tipo_do_oficio");
     
  //    // Testando classes CSS
  //    expect(selectTipo).toHaveClass(
  //      "font-nexa",
  //      "border-strokedark",
  //      "bg-form-input",
  //      "text-bodydark",
  //    );

  //    const selectTipo2 = screen.getByRole("combobox", { name: /tipo/i });
  //    expect(selectTipo2).toHaveValue(ENUM_TIPO_OFICIOS_LIST[0]);
     
  //  });

});
