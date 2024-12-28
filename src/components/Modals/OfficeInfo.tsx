import dateFormater from "@/functions/formaters/dateFormater";
import numberFormat from "@/functions/formaters/numberFormat";
import {
  handleMesesAteOPagamento,
  handleRentabilidadeAM,
} from "@/functions/wallet/rentability";
import { NotionPage } from "@/interfaces/INotion";
import { IWalletResponse } from "@/interfaces/IWallet";
import api from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { AiOutlineLoading } from "react-icons/ai";
import { toast } from "sonner";
import { Button } from "../Button";
import ConfettiEffect from "../Effects/ConfettiEffect";

const OfficeInfoModal = ({
  setConfirmPurchaseModalOpen,
  data,
  updatedVlData,
  id,
}: {
  setConfirmPurchaseModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: NotionPage;
  updatedVlData: IWalletResponse;
  id: string;
}) => {
  const [purchaseProcess, setPurchaseProcess] = useState<
    "processing" | "done" | null
  >(null);
  const [confetti, setConfetti] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const backButtonRef = useRef<HTMLButtonElement | null>(null);

  function handleTotalProfitValue(updatedVlData: IWalletResponse) {
    if (updatedVlData !== undefined) {
      let totalProfit = 0;
      const totalProjected = updatedVlData?.["valor_projetado"] || 0;
      const updatedTotalLiquid =
        updatedVlData?.result[updatedVlData.result.length - 1]
          .valor_liquido_disponivel || 0;
      const totalInvested = updatedVlData?.["valor_investido"] || 0;
      totalProfit +=
        updatedTotalLiquid -
        totalInvested +
        (totalProjected - updatedTotalLiquid);

      return totalProfit;
    }
  }

  function handleCloseModal() {
    setConfirmPurchaseModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["notion_marketplace_item"] });
    queryClient.invalidateQueries({
      queryKey: ["updated_vl_marketplace_item", data],
    });
  }

  async function buyItem(itemID: string) {
    setPurchaseProcess("processing");
    try {
      const response = await api.patch(
        `/api/notion-api/marketplace/buy/${id}/`,
      );
      if (response.status === 202) {
        setPurchaseProcess("done");
        setConfetti(true);
        queryClient.invalidateQueries({
          queryKey: ["marketplace_active_items"],
        });
      }
    } catch (error) {
      toast.error(
        "Houve um erro ao confirmar a compra. Tente novamente mais tarde.",
      );
      setPurchaseProcess(null);
    }
  }

  // OBS: não apague esse código comentado

  // useEffect(() => {
  //     const handleMouseMove = (e: MouseEvent) => {
  //         const mouseX = e.clientX;
  //         const mouseY = e.clientY;
  //         const screenWidth = window.innerWidth
  //         const screenHeight = window.innerHeight

  //         if (backButtonRef.current) {
  //             const button = backButtonRef.current.getBoundingClientRect()
  //             const buttonX = button.x
  //             const buttonY = button.y
  //             const buttonWidth = button.width
  //             const buttonHeight = button.height

  //             if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth && mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
  //                 backButtonRef.current.style.position = "absolute"
  //                 backButtonRef.current.style.top = `${Math.floor(Math.random() * (screenHeight - buttonHeight))}px`
  //                 backButtonRef.current.style.left = `${Math.floor(Math.random() * (screenWidth - buttonWidth))}px`
  //             }
  //         }
  //     };

  //     window.addEventListener("mousemove", handleMouseMove);

  //     // Limpeza do evento ao desmontar o componente
  //     return () => {
  //         window.removeEventListener("mousemove", handleMouseMove);
  //     };
  // }, [])

  return (
    <div
      className={`max-w-screen fixed left-0 top-0 z-999999 flex h-screen min-w-full items-center justify-center bg-black-2 bg-opacity-30 bg-clip-padding backdrop-blur-[2px] backdrop-filter transition-all duration-300 ease-in-out`}
    >
      <Fade damping={0.1}>
        <div className="h-fit rounded-sm border border-stroke bg-white p-5 dark:border-strokedark dark:bg-boxdark  2xsm:w-80 2xsm:text-sm md:min-w-125 md:max-w-[450px] md:text-base">
          <div className="flex "></div>
          <h2 className="text-center text-xl font-semibold uppercase text-black-2 dark:text-snow">
            {purchaseProcess === "done"
              ? "Agora é com a gente!"
              : "Revise as informações do Ativo"}
          </h2>

          {purchaseProcess === "done" ? (
            <Fade damping={0.1}>
              <div className="mt-8 flex flex-col gap-5">
                <Image
                  src="/images/order_confirmed.svg"
                  alt="mulher ao lado de um telefone com compra confirmada"
                  width={200}
                  height={200}
                  className="mx-auto"
                />

                <p className="text-center">
                  O seu ativo agora encontra-se disponível em sua carteira. Para
                  acessá-lo, basta ir para: Wallet / Em liquidação, onde o mesmo
                  estára em processo que tem tempo limite de até 24horas.
                </p>

                <Button
                  className="mx-auto mt-10 block font-medium uppercase"
                  onClick={handleCloseModal}
                >
                  Voltar
                </Button>

                {confetti && <ConfettiEffect handleTrigger={setConfetti} />}
              </div>
            </Fade>
          ) : (
            <>
              <ul className="my-8 flex flex-col gap-2">
                <li className="flex items-center justify-between">
                  <p className="flex-1">Ente Devedor:</p>
                  <p
                    title={
                      (data && data.properties["Ente Devedor"].select?.name) ||
                      "Não informado"
                    }
                    className="max-w-[330px] overflow-hidden text-ellipsis whitespace-nowrap font-medium"
                  >
                    {(data && data.properties["Ente Devedor"].select?.name) ||
                      "Não informado"}
                  </p>
                </li>
                <li className="flex items-center justify-between">
                  <p className="flex-1">Esfera:</p>
                  <p className="font-medium">
                    {(data && data.properties["Esfera"].select?.name) ||
                      "Não informada"}
                  </p>
                </li>
                <li className="flex items-center justify-between">
                  <p className="flex-1">Valor atualizado:</p>
                  <p className="font-medium">
                    {updatedVlData?.result[updatedVlData.result.length - 1][
                      "valor_liquido_disponivel"
                    ] &&
                      numberFormat(
                        updatedVlData?.result[updatedVlData.result.length - 1][
                          "valor_liquido_disponivel"
                        ] || 0,
                      )}
                  </p>
                </li>
                <li className="flex items-center justify-between">
                  <p className="flex-1">Rentabilidade Mensal:</p>
                  <p className="font-medium">
                    {(
                      handleRentabilidadeAM(data.properties["Rentabilidade Anual"].number || 0) * 100
                    )
                      .toFixed(2)
                      .replace(".", ",") + "%"}
                  </p>
                </li>
                <li className="flex items-center justify-between">
                  <p className="flex-1">Rentabilidade Anual:</p>
                  <p className="font-medium">
                    {(
                      (data.properties["Rentabilidade Anual"].number || 0) * 100
                    )
                      .toFixed(2)
                      .replace(".", ",") + "%"}
                  </p>
                </li>
                <li className="flex items-center justify-between">
                  <p className="flex-1">Data prevista pgto:</p>
                  <p className="font-medium">
                    {(data &&
                      dateFormater(
                        data.properties["Previsão de pagamento"].date?.start,
                      )) ||
                      "não informada"}
                  </p>
                </li>
                <li className="flex items-center justify-between">
                  <p className="flex-1">Valor de aquisição:</p>
                  <p className="font-medium">
                    {data &&
                      numberFormat(
                        data.properties["Desembolso All-In"]?.formula?.number || 0,
                      )}
                  </p>
                </li>
                <li className="flex items-center justify-between">
                  <p className="flex-1">Valor projetado:</p>
                  <p className="font-medium">
                    {data &&
                      numberFormat(
                        data.properties["Valor Projetado"].number || 0,
                      )}
                  </p>
                </li>
                <li className="flex items-center justify-between">
                  <p className="flex-1">Ganhos estimados:</p>
                  <p className="font-medium text-green-500 dark:text-green-400">
                    {updatedVlData &&
                      numberFormat(handleTotalProfitValue(updatedVlData) || 0)}
                  </p>
                </li>
              </ul>
              <div className="flex items-center justify-between 2xsm:flex-col 2xsm:gap-2 md:flex-row md:gap-0">
                <p>Deseja confirmar a compra?</p>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => buyItem(id)}
                    className="flex items-center gap-2 text-sm font-medium uppercase"
                  >
                    {purchaseProcess === "processing" && (
                      <AiOutlineLoading className="animate-spin text-lg" />
                    )}
                    <span>confirmar</span>
                  </Button>
                  <Button
                    onClick={() => setConfirmPurchaseModalOpen(false)}
                    variant="ghost"
                    className="text-sm font-medium uppercase"
                  >
                    voltar
                  </Button>
                  {/* OBS: Não apague esse código comentado */}
                  {/* <button
                                        onClick={() => setConfirmPurchaseModalOpen(false)}
                                        ref={backButtonRef}
                                        className='relative bg-red-500 border-transparent w-fit cursor-pointer rounded-lg border px-4 py-2 transition hover:bg-opacity-90 text-snow uppercase'>
                                        voltar
                                    </button> */}
                </div>
              </div>
            </>
          )}
        </div>
      </Fade>
    </div>
  );
};

export default OfficeInfoModal;
