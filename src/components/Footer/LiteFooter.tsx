
import { Footer, FooterBrand, FooterCopyright, FooterDivider, FooterLink, FooterLinkGroup } from "flowbite-react";
import Image from "next/image";

export function LiteFooter() {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 p-8 rounded-lg shadow-lg">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
        <div className="min-w-fit sm:max-w-none sm:flex">
            <div className="flex items-center space-x-4">
            <div className="dark:hidden flex flex-col items-center gap-3 bg">
                    <Image
                      src={"/images/logo/celer-app-text.svg"}
                      alt="Logotipo do CelerApp em um fundo branco e na cor azul"
                      width={104}
                      height={32}
                      title="CelerApp"
                    />
                  </div>
            </div>
          </div>
          <FooterLinkGroup>
            <Footer.Link href="/">CelerApp</Footer.Link>
            <Footer.Link href="/automated-proposal">Lead Magnet</Footer.Link>
            <Footer.Link href="/recalculate-trf1">Recalculador do TRF1</Footer.Link>
            <Footer.Link href="#">Política de Privacidade</Footer.Link>
            <Footer.Link href="#">Termos e Condições</Footer.Link>
          </FooterLinkGroup>
        </div>
        <FooterDivider className="-mb-8" />
        <span className="block text-sm text-center text-gray-500 sm:text-left sm:block -my-4">
          &copy; {new Date().getFullYear()} - CelerApp™ é uma marca <span className="font-semibold">Ativos</span>
          </span>
      </div>
    </div>
  );
}
