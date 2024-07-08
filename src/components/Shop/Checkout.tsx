'use client'
import React from 'react'
import Image from 'next/image';
import { BiDollar } from 'react-icons/bi';
import { TbClipboardList } from 'react-icons/tb';
import ConfettiEffect from '../Effects/ConfettiEffect';
import { ShopProps } from '.';

export type TriggerProps = {
    box: boolean,
    confetti: boolean
}

const Checkout = ({ data, setState }: {
    data: ShopProps | undefined,
    setState: React.Dispatch<React.SetStateAction<boolean>>
}) => {

    const [trigger, setTrigger] = React.useState<TriggerProps>({
        box: false,
        confetti: false
    });

    const whatsappRedirection = () => {
        if (data) {
            const phoneNumber = '5581996871762';
            const message = `Olá ✌️ , fiz um pedido de um pacote e gostaria de realizar o pagamento.
            
Nome completo: ${data.user_info.full_name}
CPF/CNPJ: ${data.user_info.CPF}

Detalhes do pedido:
- Número de ordem: #000001
- Pacote: ${data.plan.title.toLocaleLowerCase()}
- Créditos: ${data.plan.features[0].split(' ')[0]}
- Cálculos: ${data.plan.features[1].split(' ')[0]}
- Tipo do suporte: ${data.plan.features[2].split(' ')[1]}

Valor total do pedido: ${data.plan.price}

Aguardo instruções para realizar o pagamento.

Agradeço desde já!`;
            window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, '_blank');
            setState(false);
        }
    }

    React.useEffect(() => {
        const trigger = setTimeout(() => {
            setTrigger({
                box: true,
                confetti: true
            });
        }, 1000);
        return () => clearTimeout(trigger);
    }, [])

    return (
        <React.Fragment>
            <div className='max-w-203 h-90 mx-auto p-3 overflow-y-auto'>
                <h1 className='text-2xl w-full font-bold text-center'>
                    Agradecemos a sua compra!
                </h1>
                <div className='grid place-items-center h-29 md:mb-5 md:mt-10 p-5'>
                    {trigger.box ? (
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
                    {trigger.confetti && <ConfettiEffect handleTrigger={setTrigger} />}
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
                    <button onClick={whatsappRedirection} className='flex items-center text-snow gap-1 py-2 px-3 rounded-md bg-green-400 hover:bg-green-500 transition-all duration-200'>
                        <span>Realizar pagamento</span>
                        <BiDollar />
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Checkout
