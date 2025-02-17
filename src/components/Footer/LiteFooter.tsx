import { Footer, FooterLinkGroup } from 'flowbite-react';
import Image from 'next/image';

export function LiteFooter() {
    return (
        <div className="bg-snow text-gray-500 shadow-lg 2xsm:border-t 2xsm:border-gray-300 2xsm:p-4 md:border-none md:px-6 md:py-3">
            <div className="flex w-full flex-col gap-3 text-center">
                <div className="w-full justify-between 2xsm:gap-3 sm:flex sm:items-center sm:justify-between md:gap-0">
                    <div className="min-w-fit 2xsm:mb-5 sm:mb-0 sm:flex sm:max-w-none">
                        <div className="flex items-center space-x-4 2xsm:items-center 2xsm:justify-center">
                            <div className="bg flex flex-col items-center gap-3">
                                <Image
                                    src={'/images/logo/new-logo-text-light.svg'}
                                    alt="Logotipo do CelerApp em um fundo branco e na cor azul"
                                    width={60}
                                    height={60}
                                    title="CelerApp"
                                />
                            </div>
                        </div>
                    </div>
                    <FooterLinkGroup className="grid !text-body 2xsm:w-full 2xsm:grid-cols-2 2xsm:items-center 2xsm:justify-center 2xsm:gap-5 2xsm:p-2 2xsm:text-center md:flex md:grid-cols-none md:flex-row md:justify-end">
                        <Footer.Link href="/automated-proposal" className="m-0">
                            Lead Magnet
                        </Footer.Link>
                        <Footer.Link href="/retification" className="m-0">
                            Recalculador do TRF1
                        </Footer.Link>
                        <Footer.Link
                            href="/politica-de-privacidade"
                            target="_blank"
                            className="m-0"
                        >
                            Política de Privacidade
                        </Footer.Link>
                        <Footer.Link href="/termos-e-condicoes" target="_blank" className="m-0">
                            Termos e Condições
                        </Footer.Link>
                    </FooterLinkGroup>
                </div>
                <hr className="border-gray-200" />
                <span className="block text-center text-xs text-gray-500 sm:block sm:text-left">
                    &copy; {new Date().getFullYear()} - CelerApp é uma marca{' '}
                    <span className="font-semibold">Ativos</span>
                </span>
            </div>
        </div>
    );
}
