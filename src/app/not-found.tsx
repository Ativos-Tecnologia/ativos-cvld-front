'use client'
import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
    return (
        <div className="font-satoshi flex flex-col items-center h-dvh p-5">
            <Image
                src={"/images/404.svg"}
                alt={"página não encontrada"}
                width={600}
                height={200}
                className="mt-10 mb-15"
            />
            <div className="text-center">
                <h1 className="text-[clamp(24px,4vw,48px)] font-bold mb-4">PÁGINA NÃO ENCONTRADA</h1>
                <p>Parece que a página que você procura não existe ou foi removida.</p>
                <Link href={"/"} className="mt-15 inline-flex items-center justify-center rounded-md py-3 px-6 text-center font-medium text-snow uppercase bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
                    voltar para home
                </Link>
            </div>
        </div>
    )
}
