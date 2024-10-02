
"use client";

import { Footer } from "flowbite-react";
import Image from "next/image";
import { BiWorld } from "react-icons/bi";
import { BsInstagram, BsLinkedin } from "react-icons/bs";

export function MainFooter() {
  return (
    <div className="text-gray-500 dark:text-gray-400 p-8 rounded-lg shadow-lg bg-white dark:bg-boxdark">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div className="min-w-fit sm:max-w-none sm:flex">
            <div className="flex items-center space-x-4">
            <div className="dark:hidden flex flex-col items-center gap-3 bg">
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
                      width={148}
                      height={32}
                      title="CelerApp"
                    />
                  </div>
            <div className="hidden dark:flex flex-col items-center gap-3 bg">
                    <Image
                      src={"/images/logo/celer-app-logo-dark.svg"}
                      alt="Logo do CelerApp em sua versão somente com o ícone do aplicativo em um fundo branco e na cor azul"
                      width={80}
                      height={80}
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
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-2 sm:gap-6">
            {
            //#TODO: Implementar a seção "Sobre" no footer quando os dados estiverem disponíveis
            /* <div>
              <Footer.Title title="Sobre" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Ativos</Footer.Link>
                <Footer.Link href="#">Missão</Footer.Link>
                <Footer.Link href="#">Visão</Footer.Link>
                <Footer.Link href="#">Contato</Footer.Link>
              </Footer.LinkGroup>
            </div> */}
            <div>
              <Footer.Title title="Produtos" />
              <Footer.LinkGroup col>
                <Footer.Link href="/">CelerApp</Footer.Link>
                <Footer.Link href="/automated-proposal">Lead Magnet</Footer.Link>
                <Footer.Link href="/recalculate-trf1">Recalculador do TRF1</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link aria-disabled href="#">Política de Privacidade</Footer.Link>
                <Footer.Link href="#">Termos e Condições</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
            <span className="block text-sm text-center text-gray-500 sm:text-left sm:block">
          &copy; {new Date().getFullYear()} - CelerApp™ é uma marca <span className="font-semibold">Ativos</span>
          </span>
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="https://www.instagram.com/ativosprecatorios/" icon={BsInstagram} target="_blank" title="Instagram" />
            <Footer.Icon href="https://www.linkedin.com/company/ativosprecatorios/" icon={BsLinkedin} target="_blank" title="LinkedIn" />
            <Footer.Icon href="https://ativostax.com.br/" icon={BiWorld} target="_blank" title="Ativos Tax" />
          </div>
        </div>
      </div>
    </div>
  );
}
