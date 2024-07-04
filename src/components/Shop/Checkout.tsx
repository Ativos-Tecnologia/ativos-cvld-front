'use client'
import React from 'react'
import confetti, { Options } from 'canvas-confetti';
import Image from 'next/image';
import { BiChevronRight } from 'react-icons/bi';
import { TbClipboardList } from 'react-icons/tb';

const Checkout = () => {

    const [boxOpen, setBoxOpen] = React.useState<boolean>(false);

    const showConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: {
                y: 0.53,
                x: 0.58
            }
        });
    }

    React.useEffect(() => {
        const trigger = setTimeout(() => {
            setBoxOpen(true);
            showConfetti();
        }, 1000);
        return () => clearTimeout(trigger);
    }, [])

    return (
        <React.Fragment>
            <div className='max-w-203 h-90 mx-auto p-3 overflow-y-auto'>
                <h1 className='text-2xl w-full font-bold text-center'>
                    Agradecemos a sua compra!
                </h1>
                <div className='grid place-items-center h-29 mb-5 mt-10 p-5'>
                    {boxOpen ? (
                        <Image
                            src="/images/open_box.webp"
                            alt="closed_box"
                            width={75}
                            height={75}
                        />
                    ) : (
                        <Image
                            src="/images/closed_box.webp"
                            alt="closed_box"
                            width={75}
                            height={75}
                        />
                    )}
                </div>
                <div className='mb-5'>
                    <p className='text-center max-w-150 mx-auto'>
                        O número do seu pedido é o <b>#000001</b>. Ao clicar no botão abaixo, você será redirecionado para o whatsapp, onde será efetuada toda a parte de pagamento.
                    </p>
                </div>
                <div className='flex gap-3 items-center justify-center'>
                    <button disabled={true} className='flex items-center gap-1 py-2 px-3 bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 rounded-md transition-all duration-200'>
                        <span>Meus pedidos</span>
                        <TbClipboardList />
                    </button>
                    <button className='flex items-center text-snow gap-1 py-2 px-3 rounded-md bg-green-400 hover:bg-green-500 transition-all duration-200'>
                        <span>Finalizar</span>
                        <BiChevronRight />
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Checkout
