import { Metadata } from "next";
import React from "react";

// Esse layout foi uma solução para uso do metadata em páginas que não precisam de um layout específico.

export const metadata: Metadata = {
  title: "Celer | Comece",
  applicationName: "CelerApp",
  description:
    "Sua solução one-stop-shop para precatórios. Acompanhe, gerencie e invista em precatórios de forma simples e segura.",
  category: "Login Page",
  openGraph: {
    title: "Celer | Comece",
    description:
      "Sua solução one-stop-shop para precatórios. Acompanhe, gerencie e invista em precatórios de forma simples e segura.",
    images: [
      {
        url: "https://i.ibb.co/fC9QRJx/Captura-de-tela-2024-11-08-100409.png",
        width: 1200,
        height: 630,
        alt: "Tela de login do CelerApp",
      },
    ],
  },
  twitter: {
    title: "Celer | Comece",
    description:
      "Sua solução one-stop-shop para precatórios. Acompanhe, gerencie e invista em precatórios de forma simples e segura.",
    images: [
      {
        url: "https://i.ibb.co/fC9QRJx/Captura-de-tela-2024-11-08-100409.png",
        width: 1200,
        height: 630,
        alt: "Tela de login do CelerApp",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
