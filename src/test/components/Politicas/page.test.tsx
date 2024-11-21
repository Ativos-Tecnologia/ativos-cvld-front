import { Politicas } from "@/components/Politicas";
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
      <Politicas />
    </QueryClientProvider>,
  );
});

describe("Teste dos códigos da pagina de Politicas de Privaciade", () => {
  describe("Teste dos titulos das Politicas de Privacidade", () => {
    it("Verifica se possui o titulo de INTRODUÇÃO", async () => {
      const title = await screen.findByRole("heading", {
        name: /1. INTRODUÇÃO/i,
        level: 3,
      });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        "scroll-mt-25",
        "text-xl",
        "font-medium",
        "uppercase",
        "text-snow",
        "underline",
      );
      expect(title).toHaveAttribute("id", "introducao");
    });

    it("Verifica se possui o titulo de COLETA E USO DE DADOS PESSOAIS", async () => {
      const title = await screen.findByRole("heading", {
        name: /2. COLETA E USO DE DADOS PESSOAIS/i,
        level: 3,
      });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        "scroll-mt-25",
        "text-xl",
        "font-medium",
        "uppercase",
        "text-snow",
        "underline",
      );
      expect(title).toHaveAttribute("id", "coleta");
    });

    it("Verifica se possui o titulo de FINALIDADE DO TRATAMENTO DE DADOS", async () => {
      const title = await screen.findByRole("heading", {
        name: /3. FINALIDADE DO TRATAMENTO DE DADOS/i,
        level: 3,
      });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        "scroll-mt-25",
        "text-xl",
        "font-medium",
        "uppercase",
        "text-snow",
        "underline",
      );
      expect(title).toHaveAttribute("id", "dados");
    });
    
    it("Verifica se possui o titulo de BASE LEGAL PARA O TRATAMENTO DE DADOS", async () => {
      const title = await screen.findByRole("heading", {
        name: /4. BASE LEGAL PARA O TRATAMENTO DE DADOS/i,
        level: 3,
      });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        "scroll-mt-25",
        "text-xl",
        "font-medium",
        "uppercase",
        "text-snow",
        "underline",
      );
      expect(title).toHaveAttribute("id", "base");
    });

    it("Verifica se possui o titulo de COMPARTILHAMENTO DE DADOS PESSOAIS", async () => {
      const title = await screen.findByRole("heading", {
        name: /5. COMPARTILHAMENTO DE DADOS PESSOAIS/i,
        level: 3,
      });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        "scroll-mt-25",
        "text-xl",
        "font-medium",
        "uppercase",
        "text-snow",
        "underline",
      );
      expect(title).toHaveAttribute("id", "compartilhamento");
    });

    it("Verifica se possui o titulo de ETENÇÃO DE DADOS PESSOAIS", async () => {
      const title = await screen.findByRole("heading", {
        name: /6. RETENÇÃO DE DADOS PESSOAIS/i,
        level: 3,
      });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        "scroll-mt-25",
        "text-xl",
        "font-medium",
        "uppercase",
        "text-snow",
        "underline",
      );
      expect(title).toHaveAttribute("id", "retencao");
    });

    it("Verifica se possui o titulo de DIREITOS DOS TITULARES DE DADOS", async () => {
      const title = await screen.findByRole("heading", {
        name: /7. DIREITOS DOS TITULARES DE DADOS/i,
        level: 3,
      });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        "scroll-mt-25",
        "text-xl",
        "font-medium",
        "uppercase",
        "text-snow",
        "underline",
      );
      expect(title).toHaveAttribute("id", "direitos");
    });

    it("Verifica se possui o titulo de COOKIES E TECNOLOGIAS DE RASTREAMENTO", async () => {
      const title = await screen.findByRole("heading", {
        name: /8. COOKIES E TECNOLOGIAS DE RASTREAMENTO/i,
        level: 3,
      });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        "scroll-mt-25",
        "text-xl",
        "font-medium",
        "uppercase",
        "text-snow",
        "underline",
      );
      expect(title).toHaveAttribute("id", "cookies");
    });

    it("Verifica se possui o titulo de TRANSFERÊNCIA INTERNACIONAL DE DADOS", async () => {
      const title = await screen.findByRole("heading", {
        name: /9. TRANSFERÊNCIA INTERNACIONAL DE DADOS/i,
        level: 3,
      });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        "scroll-mt-25",
        "text-xl",
        "font-medium",
        "uppercase",
        "text-snow",
        "underline",
      );
      expect(title).toHaveAttribute("id", "transferencia");
    });
    
    it("Verifica se possui o titulo de ALTERAÇÕES NA POLÍTICA DE PRIVACIDADE", async () => {
      const title = await screen.findByRole("heading", {
        name: /10. ALTERAÇÕES NA POLÍTICA DE PRIVACIDADE/i,
        level: 3,
      });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        "scroll-mt-25",
        "text-xl",
        "font-medium",
        "uppercase",
        "text-snow",
        "underline",
      );
      expect(title).toHaveAttribute("id", "alteracoes");
    });

    it("Verifica se possui o titulo de INFORMAÇÕES DE CONTATO", async () => {
      const title = await screen.findByRole("heading", {
        name: /11. INFORMAÇÕES DE CONTATO/i,
        level: 3,
      });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        "scroll-mt-25",
        "text-xl",
        "font-medium",
        "uppercase",
        "text-snow",
        "underline",
      );
      expect(title).toHaveAttribute("id", "contato");
    });

    it("Verifica se possui o titulo de DISPOSIÇÕES GERAIS", async () => {
      const title = await screen.findByRole("heading", {
        name: /12. DISPOSIÇÕES GERAIS/i,
        level: 3,
      });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass(
        "scroll-mt-25",
        "text-xl",
        "font-medium",
        "uppercase",
        "text-snow",
        "underline",
      );
      expect(title).toHaveAttribute("id", "disposicoes");
    });

  });

  describe("Teste das listas de Políticas de Privacidade", () => {
    it("Verifica se existe uma lista não ordenada", async () => {
      const list = await screen.findAllByRole("list");
      expect(list[0]).toBeInTheDocument();
      expect(list[0]).toHaveClass("flex",
        "list-disc",
        "flex-col",
        "gap-3",
        "text-justify",
        "text-bodydark",
        "2xsm:pl-5",
        "sm:pl-10"
      );
    });

    it("Verifica se os itens da lista estão presentes", async () => {
      const listItems = await screen.findAllByRole("listitem");
      expect(listItems).toHaveLength(69);

      listItems.forEach((item) => {
        expect(item).toBeInTheDocument();
      });
    });
  });
});
