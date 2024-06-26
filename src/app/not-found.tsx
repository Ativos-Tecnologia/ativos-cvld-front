'use client'
import Link from "next/link"

export default function NotFound () {
    return (
        <div>
            <h1>Página não encontrada</h1>
            <Link href={"/"}>
                voltar para home
            </Link>
        </div>
    )
}
