import { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import React from "react";

// Esse layout foi uma solução para uso do metadata em páginas que não precisam de um layout específico.

export const metadata: Metadata = {
  title: "Celer | Lead Magnet",
  applicationName: "CelerApp",
  description:
    "Expanda suas vendas de precatórios. Conduza mais negociações de precatórios e converta mais antecipações.",
  category: "Lead Magnet",
  openGraph: {
    title: "Celer | Lead Magnet",
    description:
      "Expanda suas vendas de precatórios. Conduza mais negociações de precatórios e converta mais antecipações.",
    images: [
      {
        url: "https://i.ibb.co/cFZCvjb/lead-magnet-image.png",
        width: 1200,
        height: 630,
        alt: "Tela de login do CelerApp",
      },
    ],
  },
  twitter: {
    title: "Celer | Lead Magnet",
    description:
      "Expanda suas vendas de precatórios. Conduza mais negociações de precatórios e converta mais antecipações.",
    images: [
      {
        url: "https://i.ibb.co/cFZCvjb/lead-magnet-image.png",
        width: 1200,
        height: 630,
        alt: "Tela de login do CelerApp",
      },
    ],
  },
  keywords: [
    "CelerApp",
    "Lead Magnet",
    "Precatórios",
    "Vendas",
    "Negociações",
    "Antecipações",
    "Gerador de Propostas",
    "Propostas de Antecipação",
    "Propostas de Venda",
    "Propostas de Compra",
    "Propostas de Negociação",
    "Propostas de Precatórios",
    "Propostas de Antecipação de Precatórios",
    "Propostas de Venda de Precatórios",
    "Propostas de Compra de Precatórios",
    "Propostas de Negociação de Precatórios",
  ],
};

export default function LeadMagnetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="pt-BR">
        <head>
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1135417794408497');
              fbq('track', 'PageView');
            `,
            }}
          />
          <Script
            id="microsoft-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "oufxljqs7w");
            `,
            }}
          />
          <noscript>
            <Image
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=1135417794408497&ev=PageView&noscript=1"
              alt="Facebook Pixel"
            />
          </noscript>
        </head>
        <body>{children}</body>
      </html>
    </>
  );
}
