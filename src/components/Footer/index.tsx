"use client";

import { Footer } from "flowbite-react";
import Image from "next/image";
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
    <div className="rounded-tl-lg rounded-tr-lg bg-black-2 p-8 text-gray-500 shadow-lg dark:bg-boxdark dark:text-gray-400 md:mx-auto md:w-full md:max-w-full ">
      <div className="w-full">
        <div className="flex w-full justify-between 2xsm:flex-col 2xsm:gap-0 lg:gap-5 xl:flex-row">
          <div className="md:p-0 lg:col-span-2 lg:p-5">
            <Footer.Title className="text-snow" title="sobre a Ativos" />
            <div className="md:max-w-full xl:max-w-[600px]">
              <p className="font-satoshi text-bodydark text-justify">
                Presente em todo Brasil, a Ativos é sua empresa ideal que promove o desenvolvimento de novas tecnologias para compra e venda de precatórios, gestão de ativos judiciais, segurança jurídica e novos negócios.
              </p>
            </div>
          </div>
          <div className="lg:hidden">
            <Footer.Divider />
          </div>
          <div className="grid w-full gap-2 2xsm:grid-cols-1 md:mt-4 md:grid-cols-8 lg:grid-cols-8 lg:px-5 lg:gap-3">
            <div className="md:col-span-1">
              <Footer.Title className="text-snow" title="Sobre" />
              <Footer.LinkGroup className="text-bodydark" col>
                <Footer.Link href="#">Ativos</Footer.Link>
                <Footer.Link href="#">Missão</Footer.Link>
                <Footer.Link href="#">Visão</Footer.Link>
                <Footer.Link href="#">Contato</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="md:col-span-2">
              <Footer.Title className="text-snow" title="Produtos" />
              <Footer.LinkGroup className="text-bodydark" col>
                <Footer.Link href="/">CelerApp</Footer.Link>
                <Footer.Link href="/automated-proposal">
                  Lead Magnet
                </Footer.Link>
                <Footer.Link href="/retification">
                  Recalculador do TRF1
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="md:col-span-3">
              <Footer.Title className="text-snow" title="Contato" />
              <Footer.LinkGroup className="text-bodydark" col>
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
                    contato@ativosprecatorios.com.br
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
              <Footer.Title className="text-snow" title="Legal" />
              <Footer.LinkGroup className="text-bodydark" col>
                <Footer.Link aria-disabled href="#">
                  Política de Privacidade
                </Footer.Link>
                <Footer.Link href="/termos-e-condicoes">Termos e Condições</Footer.Link>
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

              {/* logo */}
              <div className="bg flex flex-col items-center justify-center gap-3 dark:hidden lg:justify-evenly">
                <Image
                  src={"/images/logo/new-logo-dark.png"}
                  alt="Logo do CelerApp em sua versão somente com o ícone do aplicativo em cor branca"
                  width={80}
                  height={80}
                  title="Ícone CelerApp"
                />
                <Image
                  src={"/images/logo/celer-app-text-dark.svg"}
                  alt="Logotipo do CelerApp em cor branca"
                  width={178}
                  height={32}
                  title="CelerApp"
                />
              </div>
              {/* fim da logo */}

              <div className="md:mx-auto md:max-w-md lg:max-w-3xl">
                <p className="font-satoshi text-bodydark text-justify">
                  Este sistema, é gerido e operado pela Ativos Exchange
                  Tecnologia Ltda, CNPJ 51.221.966/0001-90, sociedade integrante
                  do grupo Ativos, com atuação exclusiva em desenvolvimento e
                  licenciamento de sistemas computacionais bem como a produção e
                  divulgação de conteúdos de cunho informativo e educacional. A
                  Ativos Exchange Tecnologia não é uma instituição financeira e
                  não realiza empréstimos empresariais. A Ativos Exchange
                  Tecnologia não atua como empresa de investimentos e não
                  realiza nenhuma espécie de oferta ou recomendação de Títulos e
                  Valores Mobiliários. A Ativos Exchange Tecnologia não está
                  autorizada e não atua na administração e gestão de recursos de
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
                  src={"/images/logo/new-logo-dark.png"}
                  alt="Logo do CelerApp em sua versão somente com o ícone do aplicativo em cor branca"
                  width={50}
                  height={50}
                  title="Ícone CelerApp"
                />
                <Image
                  src={"/images/logo/celer-app-text-dark.svg"}
                  alt="Logotipo do CelerApp em cor branca"
                  width={120}
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
                className="text-bodydark"
              />
            </div>

            <div className="border-gradient-to-r flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 from-boxdark-2 to-boxdark">
              <Footer.Icon
                href="https://www.linkedin.com/company/ativosprecatorios/"
                icon={BsLinkedin}
                target="_blank"
                title="LinkedIn"
                className="text-bodydark"
              />
            </div>
            <div className="border-gradient-to-r flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 from-boxdark-2 to-boxdark">
              <Footer.Icon
                href="https://www.youtube.com/@Ativosprecatorios"
                icon={IoLogoYoutube}
                target="_blank"
                title="Canal no Youtube"
                className="text-bodydark"
              />
            </div>
            <div className="border-gradient-to-r flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 from-boxdark-2 to-boxdark">
              <Footer.Icon
                href="https://ativostax.com.br/"
                icon={GiTakeMyMoney}
                target="_blank"
                title="Ativos Tax"
                className="text-bodydark"
              />
            </div>
          </div>

          <Footer.Divider />
          <div className="w-full sm:flex sm:items-center sm:justify-between md:flex md:items-center md:justify-center">
            <span className="block text-center text-sm text-bodydark sm:block sm:text-left">
              &copy; {new Date().getFullYear()} - CelerApp™ é uma marca{" "}
              <span className="font-semibold">Ativos</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
