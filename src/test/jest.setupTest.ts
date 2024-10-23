import { QueryClient } from "@tanstack/react-query";
import { cleanup } from "@testing-library/react";

/**
 * Aqui ficarão as configurações globais de testes.
 */

// Limpeza automática após cada teste
afterEach(() => {
  cleanup();
});

// Mock do IntersectionObserver
(global as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}

  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Configuração global para o QueryClient
(global as any).queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
