"use client";

import { Footer } from "flowbite-react";
import Image from "next/image";
import React from "react";
import { BsInstagram, BsLinkedin } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { IoLogoYoutube } from "react-icons/io";

export function MainFooter() {
  const whatsAppNumber = "5581996871762";
  const message =
    "Olá! Estou entrando em contato através do CellerApp e preciso tirar uma dúvida.";

  const whatsappLink = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;
  return (
    <div className="rounded-lg bg-white p-8 text-gray-500 shadow-lg dark:bg-boxdark dark:text-gray-400 md:mx-auto md:w-full md:max-w-7xl ">
      <div className="w-full">
        <div className="flex w-full justify-between 2xsm:flex-col 2xsm:gap-0 lg:gap-5 xl:flex-row">
          <div className="md:p-0 lg:col-span-2 lg:p-5">
            <Footer.Title title="Ativos" />
            <div className="md:max-w-full xl:max-w-[600px]">
              <p className="font-satoshi">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Praesentium debitis asperiores ipsum iure alias veniam qui omnis
                nostrum ea quam ad delectus quisquam sit, doloremque modi
                dolorem dignissimos maiores sapiente.
              </p>
            </div>
          </div>
          <div className="lg:hidden">
            <Footer.Divider />
          </div>
          <div className="grid w-full gap-2 2xsm:grid-cols-1 md:mt-4 md:grid-cols-8 lg:grid-cols-8 lg:gap-3">
            <div className="md:col-span-1">
              <Footer.Title title="Sobre" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Ativos</Footer.Link>
                <Footer.Link href="#">Missão</Footer.Link>
                <Footer.Link href="#">Visão</Footer.Link>
                <Footer.Link href="#">Contato</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="md:col-span-2">
              <Footer.Title title="Produtos" />
              <Footer.LinkGroup col>
                <Footer.Link href="/">CelerApp</Footer.Link>
                <Footer.Link href="/automated-proposal">
                  Lead Magnet
                </Footer.Link>
                <Footer.Link href="/recalculate-trf1">
                  Recalculador do TRF1
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="md:col-span-3">
              <Footer.Title title="Contato" />
              <Footer.LinkGroup col>
                <div>
                  <h3 className="font-medium">Atendimento ao Investidor</h3>
                  <div className="flex items-center gap-2">
                    <Footer.Link
                      href={whatsappLink}
                      target="_blank"
                      className="!m-0 w-fit"
                    >
                      <span>Acesse o WhatsApp</span>
                    </Footer.Link>
                    <FaWhatsapp />
                  </div>
                  <p>Das 9h ás 18h (dias úteis)</p>
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <Footer.Link href="mailto:precatoriosativos@gmail.com">
                    precatoriosativos@gmail.com
                  </Footer.Link>
                </div>

                <div>
                  <h3 className="font-medium">Onde nos encontrar</h3>
                  <Footer.Link
                    href="https://maps.app.goo.gl/PLjD95FpCywaRiFz5"
                    target="_blank"
                  >
                    Av. Fernando Simões Barbosa, 266, 8º andar, sala 308 - Boa
                    Viagem
                  </Footer.Link>
                </div>
              </Footer.LinkGroup>
            </div>
            <div className="md:col-span-2">
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link aria-disabled href="#">
                  Política de Privacidade
                </Footer.Link>
                <Footer.Link href="#">Termos e Condições</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        {/* Parte final do Footer */}
        <div>
          <Footer.Divider />

          {/* Versão Laptop e Desktop da Logo */}
          <div className="min-w-fit items-center justify-center 2xsm:hidden sm:hidden sm:max-w-none md:flex">
            <div className="flex items-center space-x-4 md:gap-18">
              <div className="bg flex flex-col items-center justify-center gap-3 dark:hidden">
                <Image
                  src={"/images/logo/celer-app-logo.svg"}
                  alt="Logo do CelerApp em sua versão somente com o ícone do aplicativo em um fundo branco e na cor azul"
                  width={80}
                  height={80}
                  title="Ícone CelerApp"
                />
                <Image
                  src={"/images/logo/celer-app-text.svg"}
                  alt="Logotipo do CelerApp em um fundo branco e na cor azul"
                  width={178}
                  height={32}
                  title="CelerApp"
                />
              </div>
              <div className="bg hidden flex-col items-center gap-3 dark:flex">
                <Image
                  src={"/images/logo/celer-app-logo-dark.svg"}
                  alt="Logo do CelerApp em sua versão somente com o ícone do aplicativo em um fundo branco e na cor azul"
                  width={50}
                  height={50}
                  title="Ícone CelerApp"
                />
                <Image
                  src={"/images/logo/celer-app-text-dark.svg"}
                  alt="Logotipo do CelerApp em um fundo branco e na cor azul"
                  width={148}
                  height={32}
                  title="CelerApp"
                />
              </div>
              <div className="md:mx-auto md:max-w-md lg:max-w-3xl">
                <p className="font-satoshi">
                  Este sistema, é gerido e operado pela Ativos Exchange
                  Tecnologia Ltda, CNPJ 51.221.966/0001-90, sociedade integrante
                  do grupo Ativos, com atuação EXCLUSIVA em desenvolvimento e
                  licenciamento de sistemas computacionais bem como a produção e
                  divulgação de conteúdos de cunho informativo e educacional. A
                  Ativos Exchange Tecnologia NÃO é uma instituição financeira e
                  NÃO realiza empréstimos empresariais. A Ativos Exchange
                  Tecnologia NÃO atua como empresa de investimentos e NÃO
                  realiza nenhuma espécie de oferta ou recomendação de Títulos e
                  Valores Mobiliários. A Ativos Exchange Tecnologia NÃO está
                  autorizada e NÃO atua na administração e gestão de recursos de
                  terceiros.
                </p>
              </div>
            </div>
          </div>

          {/* Versão Mobile das logos */}
          <div className="flex min-w-fit items-center justify-center sm:flex sm:max-w-none md:hidden">
            <div className="flex items-center space-x-4 ">
              <div className="bg flex flex-col items-center justify-center gap-3 dark:hidden">
                <Image
                  src={"/images/logo/celer-app-logo.svg"}
                  alt="Logo do CelerApp em sua versão somente com o ícone do aplicativo em um fundo branco e na cor azul"
                  width={50}
                  height={50}
                  title="Ícone CelerApp"
                />
                <Image
                  src={"/images/logo/celer-app-text.svg"}
                  alt="Logotipo do CelerApp em um fundo branco e na cor azul"
                  width={120}
                  height={32}
                  title="CelerApp"
                />
              </div>
              <div className="bg hidden flex-col items-center gap-3 dark:flex">
                <Image
                  src={"/images/logo/celer-app-logo-dark.svg"}
                  alt="Logo do CelerApp em sua versão somente com o ícone do aplicativo em um fundo branco e na cor azul"
                  width={50}
                  height={50}
                  title="Ícone CelerApp"
                />
                <Image
                  src={"/images/logo/celer-app-text-dark.svg"}
                  alt="Logotipo do CelerApp em um fundo branco e na cor azul"
                  width={148}
                  height={32}
                  title="CelerApp"
                />
              </div>
            </div>
          </div>
          <Footer.Divider />
          <div className="mt-3 flex items-center justify-center space-x-6 2xsm:flex sm:mt-0 sm:justify-center ">
            <div className="border-gradient-to-r flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 from-boxdark-2 to-boxdark">
              <Footer.Icon
                href="https://www.instagram.com/ativosprecatorios/"
                icon={BsInstagram}
                target="_blank"
                title="Instagram"
              />
            </div>

            <div className="border-gradient-to-r flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 from-boxdark-2 to-boxdark">
              <Footer.Icon
                href="https://www.linkedin.com/company/ativosprecatorios/"
                icon={BsLinkedin}
                target="_blank"
                title="LinkedIn"
              />
            </div>
            <div className="border-gradient-to-r flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 from-boxdark-2 to-boxdark">
              <Footer.Icon
                href="https://www.youtube.com/@Ativosprecatorios"
                icon={IoLogoYoutube}
                target="_blank"
                title="Canal no Youtube"
              />
            </div>
            <div className="border-gradient-to-r flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 from-boxdark-2 to-boxdark">
              <Footer.Icon
                href="https://ativostax.com.br/"
                icon={GiTakeMyMoney}
                target="_blank"
                title="Ativos Tax"
              />
            </div>
          </div>

          <Footer.Divider />
          <div className="w-full sm:flex sm:items-center sm:justify-between md:flex md:items-center md:justify-center">
            <span className="block text-center text-sm text-gray-500 sm:block sm:text-left">
              &copy; {new Date().getFullYear()} - CelerApp™ é uma marca{" "}
              <span className="font-semibold">Ativos</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
