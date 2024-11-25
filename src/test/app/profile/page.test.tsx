import Profile from "@/app/profile/page";
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
      <Profile />
    </QueryClientProvider>,
  );
});

describe("Testes na Página de Perfil", () => {
  describe("Teste para carregar o titulo da página", () => {
    it("Deve exibir o titulo da página", () => {
      expect(screen.getAllByText("Perfil")[0]).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
	});
	
	describe("Teste para carregar as informações de Perfil", () => {
		it("Teste para carregar todas as labels das informações de Perfil", async () => { 
			const nome = await screen.findAllByLabelText(/Nome/i) as HTMLInputElement[];
			expect(nome[0]).toBeInTheDocument();
			expect(nome[0]).toHaveClass(
        "w-full",
        "rounded",
        "border",
        "border-stroke",
        "bg-gray",
        "px-4.5",
        "py-3",
        "text-black",
        "focus:border-primary",
        "focus-visible:outline-none",
        "dark:border-strokedark",
        "dark:bg-meta-4",
        "dark:text-white",
        "dark:focus:border-primary",
      );
			expect(nome[0]).toHaveAttribute("id", "first_name");

			const sobrenome = (await screen.findAllByLabelText(
        /Sobrenome/i,
      )) as HTMLInputElement[];
			expect(sobrenome[0]).toBeInTheDocument();
			expect(sobrenome[0]).toHaveClass(
        "w-full",
        "rounded",
        "border",
        "border-stroke",
        "bg-gray",
        "px-4.5",
        "py-3",
        "text-black",
        "focus:border-primary",
        "focus-visible:outline-none",
        "dark:border-strokedark",
        "dark:bg-meta-4",
        "dark:text-white",
        "dark:focus:border-primary",
      );
			expect(sobrenome[0]).toHaveAttribute("id", "last_name");
    });
    it("Teste do Titulo de Informações de Perfil", () => {
      const titulo = screen.getByText(/Título/i);
      expect(titulo).toBeInTheDocument();
      expect(titulo).toHaveClass("mb-3", "block", "text-sm");
     });

    it("Teste para carregar a Bio", async () => { 
      const bio = screen.getByText(/Bio/i) as HTMLInputElement;
      expect(bio).toBeInTheDocument();
      expect(bio).toHaveClass("mb-3", "block", "text-sm");
    });

	 });

});
