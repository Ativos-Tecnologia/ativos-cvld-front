import MainForm from "@/components/MainForm";
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
  const dataCallback = jest.fn();
  const setCalcStep = jest.fn();
  const setDataToAppend = jest.fn();

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
      name: "Celer", level: 2
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
      "apexcharts-legend-text", "mt-0", "text-center", "text-sm", "font-normal"
    );

  });
});
