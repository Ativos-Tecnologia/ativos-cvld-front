import dateFormater from '@/functions/formaters/dateFormater'
import numberFormat from '@/functions/formaters/numberFormat'
import { handleMesesAteOPagamento, handleRentabilidadeAM, handleRentabilidadeTotal, handleRentabilideAA } from '@/functions/wallet/rentability'
import { NotionPage } from '@/interfaces/INotion'
import { IWalletResponse } from '@/interfaces/IWallet'
import React, { useEffect, useRef, useState } from 'react'
import { BiX } from 'react-icons/bi'
import Image from 'next/image'
import ConfettiEffect from '../Effects/ConfettiEffect'
import { Fade } from 'react-awesome-reveal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/utils/api'
import { Button } from '../Button'

const OfficeInfoModal = ({ setConfirmPurchaseModalOpen, data, updatedVlData, id }: {
    setConfirmPurchaseModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: NotionPage,
    updatedVlData: IWalletResponse,
    id: string
}) => {

    const [purchaseProcess, setPurchaseProcess] = useState<"processing" | "done" | null>(null);
    const [confetti, setConfetti] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const backButtonRef = useRef<HTMLButtonElement | null>(null);

    function handleTotalProfitValue(updatedVlData: IWalletResponse) {
        if (updatedVlData !== undefined) {

            let totalProfit = 0;
            const totalProjected = updatedVlData?.["valor_projetado"] || 0;
            const updatedTotalLiquid = updatedVlData?.result[updatedVlData.result.length - 1].valor_liquido_disponivel || 0;
            const totalInvested = updatedVlData?.["valor_investido"] || 0;
            totalProfit += (updatedTotalLiquid - totalInvested) + (totalProjected - updatedTotalLiquid);

            return totalProfit;
        }
    }

    async function buyItem(itemID: string) {
        setPurchaseProcess("processing");
        try {
            const response = await api.patch(`/api/notion-api/marketplace/buy/${id}/`);
            if (response.status === 202) {
                setPurchaseProcess("done")
                setConfetti(true);
                queryClient.invalidateQueries({ queryKey: ["marketplace_active_items"] });
            }
        } catch (error) {
            toast.error("Houve um erro ao confirmar a compra. Tente novamente mais tarde.");
            setPurchaseProcess(null);
        }

    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const screenWidth = window.innerWidth
            const screenHeight = window.innerHeight

            if (backButtonRef.current) {
                const button = backButtonRef.current.getBoundingClientRect()
                const buttonX = button.x
                const buttonY = button.y
                const buttonWidth = button.width
                const buttonHeight = button.height

                if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth && mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
                    backButtonRef.current.style.position = "absolute"
                    backButtonRef.current.style.top = `${Math.floor(Math.random() * (screenHeight - buttonHeight))}px`
                    backButtonRef.current.style.left = `${Math.floor(Math.random() * (screenWidth - buttonWidth))}px`
                }
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Limpeza do evento ao desmontar o componente
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [])

    return (
        <div className={`fixed top-0 left-0 flex items-center justify-center min-w-full max-w-screen h-screen z-999999 bg-black-2 bg-clip-padding backdrop-filter backdrop-blur-[2px] bg-opacity-30 transition-all duration-300 ease-in-out`}>
            <Fade damping={0.1}>
                <div className='rounded-sm border border-stroke bg-white p-5 dark:border-strokedark dark:bg-boxdark min-w-125 max-w-[450px]'>

                    <div className='flex '>

                    </div>
                    <h2 className='text-center text-xl text-black-2 dark:text-snow font-semibold uppercase'>
                        {purchaseProcess === "done" ? "Agora é com a gente!" : "Revise as informações do Ativo"}
                    </h2>

                    {purchaseProcess === "done" ? (
                        <Fade damping={0.1}>
                            <div className='mt-8 flex flex-col gap-2'>
                                <Image
                                    src="/images/order_confirmed.svg"
                                    alt="mulher ao lado de um telefone com compra confirmada"
                                    width={200}
                                    height={200}
                                    className='mx-auto'
                                />

                                <p className='text-center'>O seu ativo agora encontra-se disponível em sua carteira. Para acessá-lo, basta ir para: Wallet / Em liquidação, onde o mesmo estára em processo que tem tempo limite de até 24horas</p>

                                <Button
                                    className='uppercase block mx-auto mt-10 font-medium'
                                    onClick={() => setConfirmPurchaseModalOpen(false)}
                                >
                                    Voltar
                                </Button>

                                {confetti && <ConfettiEffect handleTrigger={setConfetti} />}

                            </div>
                        </Fade>
                    ) : (
                        <>
                            <ul className='flex my-8 flex-col gap-2'>
                                <li className='flex items-center justify-between'>
                                    <p className='flex-1'>Ente Devedor:</p>
                                    <p className='font-medium'>{data && data.properties["Ente Devedor"].select?.name || 'Não informado'}</p>
                                </li>
                                <li className='flex items-center justify-between'>
                                    <p className='flex-1'>Esfera:</p>
                                    <p className='font-medium'>{data && data.properties["Esfera"].select?.name || 'Não informada'}</p>
                                </li>
                                <li className='flex items-center justify-between'>
                                    <p className='flex-1'>Valor atualizado:</p>
                                    <p className='font-medium'>{updatedVlData?.result[updatedVlData.result.length - 1]["valor_liquido_disponivel"] && numberFormat(updatedVlData?.result[updatedVlData.result.length - 1]["valor_liquido_disponivel"] || 0)}</p>
                                </li>
                                <li className='flex items-center justify-between'>
                                    <p className='flex-1'>Rentabilidade Mensal:</p>
                                    <p className='font-medium'>{(handleRentabilidadeAM(handleRentabilideAA(handleRentabilidadeTotal(updatedVlData), handleMesesAteOPagamento(updatedVlData))) * 100).toFixed(2).replace('.', ',') + "%"}</p>
                                </li>
                                <li className='flex items-center justify-between'>
                                    <p className='flex-1'>Rentabilidade Anual:</p>
                                    <p className='font-medium'>{(handleRentabilideAA(handleRentabilidadeTotal(updatedVlData), handleMesesAteOPagamento(updatedVlData)) * 100).toFixed(2).replace('.', ',') + "%"}</p>
                                </li>
                                <li className='flex items-center justify-between'>
                                    <p className='flex-1'>Data prevista pgto:</p>
                                    <p className='font-medium'>{data && dateFormater(data.properties["Previsão de pagamento"].date?.start) || "não informada"}</p>
                                </li>
                                <li className='flex items-center justify-between'>
                                    <p className='flex-1'>Valor de aquisição:</p>
                                    <p className='font-medium'>{data && numberFormat(data.properties["Valor de Aquisição (Wallet)"]?.number || 0)}</p>
                                </li>
                                <li className='flex items-center justify-between'>
                                    <p className='flex-1'>Valor projetado:</p>
                                    <p className='font-medium'>{data && numberFormat(data.properties["Valor Projetado"].number || 0)}</p>
                                </li>
                                <li className='flex items-center justify-between'>
                                    <p className='flex-1'>Ganhos estimados:</p>
                                    <p className='font-medium text-green-500 dark:text-green-400'>{updatedVlData && numberFormat(handleTotalProfitValue(updatedVlData) || 0)}</p>
                                </li>
                            </ul >
                            <div className='flex items-center justify-between'>
                                <p>Deseja confirmar a compra?</p>
                                <div className='flex items-center gap-1'>
                                    <Button
                                        onClick={() => buyItem(id)}
                                        className='font-medium uppercase text-sm'>
                                        confirmar
                                    </Button>
                                    <Button
                                        onClick={() => setConfirmPurchaseModalOpen(false)}
                                        variant="ghost"
                                        className='font-medium uppercase text-sm'>
                                        voltar
                                    </Button>
                                    {/* <button
                                        onClick={() => setConfirmPurchaseModalOpen(false)}
                                        ref={backButtonRef}
                                        className='relative bg-red-500 border-transparent w-fit cursor-pointer rounded-lg border px-4 py-2 transition hover:bg-opacity-90'>
                                        voltar
                                    </button> */}
                                </div>
                            </div>
                            {purchaseProcess === 'processing' && (
                                <Fade damping={0.2}>
                                    <div className='my-3 text-sm text-center'>
                                        Aguarde um momento enquanto finalizamos sua compra...
                                    </div>
                                </Fade>
                            )}
                        </>
                    )}

                </div >
            </Fade>
        </div >
    )
}

export default OfficeInfoModal