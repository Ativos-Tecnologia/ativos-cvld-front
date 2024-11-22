import Privacy from "@/app/politica-de-privacidade/page";
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
      <Privacy />
    </QueryClientProvider>,
  );
});

describe("Testes na Política de Privacidade", () => {
    it("Teste carregar o Título da página", async () => {
      const titulo = await screen.findByText("POLÍTICA DE PRIVACIDADE");
      expect(titulo).toBeInTheDocument();
      expect(titulo).toHaveClass(
        "font-medium",
        "uppercase",
        "text-snow",
        "2xsm:text-center",
        "2xsm:text-5xl",
        "xsm:text-6xl",
        "sm:text-7xl",
        "xl:text-left",
      );
    });
    it("Teste carregar o Subtítulo da página", async () => {
			const subtitulo = await screen.findByText("POLÍTICA DE PRIVACIDADE DE DADOS DA ATIVOS EXCHANGE TECNOLOGIA LTDA (51.221.966/0001-90)");
      expect(subtitulo).toBeInTheDocument();
      expect(subtitulo).toHaveClass(
        "text-center",
        "text-4xl",
        "font-medium",
        "uppercase",
        "text-snow",
      );
    });

    it("Teste do Titulo da Data Efetiva", async () => {
      const dataEfetiva = await screen.findByText("DATA EFETIVA: 29 DE OUTUBRO DE 2024");
      expect(dataEfetiva).toBeInTheDocument();
      expect(dataEfetiva).toHaveClass("2xsm:text-sm", "md:text-base");
    });
  });
