import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";
import Image from "next/image";

export function LiteFooter() {
  return (
    <div className="dark:bg-gray-800 rounded-lg bg-white text-gray-500 shadow-lg dark:text-gray-400 2xsm:p-6 md:p-8">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <div className="min-w-fit sm:flex sm:max-w-none">
            <div className="flex items-center space-x-4 2xsm:items-center 2xsm:justify-center">
              <div className="bg flex flex-col items-center gap-3 dark:hidden">
                <Image
                  src={"/images/logo/logo-ativos.svg"}
                  alt="Logotipo do CelerApp em um fundo branco e na cor azul"
                  width={104}
                  height={32}
                  title="CelerApp"
                />
              </div>
            </div>
          </div>
          <FooterLinkGroup className="grid 2xsm:w-full 2xsm:grid-cols-2 2xsm:items-center 2xsm:justify-center 2xsm:gap-5 2xsm:p-2 2xsm:text-center md:flex md:grid-cols-none md:flex-row">
            <Footer.Link href="/automated-proposal">Lead Magnet</Footer.Link>
            <Footer.Link href="/recalculate-trf1">
              Recalculador do TRF1
            </Footer.Link>
            <Footer.Link href="#">Política de Privacidade</Footer.Link>
            <Footer.Link href="#">Termos e Condições</Footer.Link>
          </FooterLinkGroup>
        </div>
        <FooterDivider className="-mb-8" />
        <span className="-my-4 block text-center text-sm text-gray-500 sm:block sm:text-left">
          &copy; {new Date().getFullYear()} - CelerApp é uma marca{" "}
          <span className="font-semibold">Ativos</span>
        </span>
      </div>
    </div>
  );
}
