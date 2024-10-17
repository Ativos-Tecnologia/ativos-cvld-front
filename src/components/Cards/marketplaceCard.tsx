import dateFormater from "@/functions/formaters/dateFormater";
import numberFormat from "@/functions/formaters/numberFormat";
import {
  handleMesesAteOPagamento,
  handleRentabilidadeTotal,
  handleRentabilideAA,
} from "@/functions/wallet/rentability";
import { NotionPage } from "@/interfaces/INotion";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { BiSolidCoinStack } from "react-icons/bi";
import { FaFileAlt, FaFileInvoiceDollar } from "react-icons/fa";
import CustomSkeleton from "../CrmUi/CustomSkeleton";

const imgPaths: Record<string, string> = {
  TRF1: "/images/tribunais/card_TRF1.webp",
  TRF2: "/images/tribunais/card_TRF2.webp",
  TRF3: "/images/tribunais/card_TRF3.webp",
  TRF4: "/images/tribunais/card_TRF4.webp",
  TRF5: "/images/tribunais/card_TRF5.webp",
  TRF6: "/images/tribunais/card_TRF6.webp",
  STF: "/images/tribunais/card_STF.webp",
  STJ: "/images/tribunais/card_STJ.webp",
  TST: "/images/tribunais/card_TST.webp",
  TSE: "/images/tribunais/card_TSE.webp",
  STM: "/images/tribunais/card_STM.webp",
  TJAC: "/images/tribunais/card_TJAC.webp",
  TJAL: "/images/tribunais/card_TJAL.webp",
  TJAP: "/images/tribunais/card_TJAP.webp",
  TJAM: "/images/tribunais/card_TJAM.webp",
  TJBA: "/images/tribunais/card_TJBA.webp",
  TJCE: "/images/tribunais/card_TJCE.webp",
  TJDFT: "/images/tribunais/card_TJDFT.webp",
  TJES: "/images/tribunais/card_TJES.webp",
  TJGO: "/images/tribunais/card_TJGO.webp",
  TJMA: "/images/tribunais/card_TJMA.webp",
  TJMT: "/images/tribunais/card_TJMT.webp",
  TJMS: "/images/tribunais/card_TJMS.webp",
  TJMG: "/images/tribunais/card_TJMG.webp",
  TJPA: "/images/tribunais/card_TJPA.webp",
  TJPB: "/images/tribunais/card_TJPB.webp",
  TJPE: "/images/tribunais/card_TJPE.webp",
  TJPI: "/images/tribunais/card_TJPI.webp",
  TJPR: "/images/tribunais/card_TJPR.webp",
  TJRJ: "/images/tribunais/card_TJRJ.webp",
  TJRN: "/images/tribunais/card_TJRN.webp",
  TJRO: "/images/tribunais/card_TJRO.webp",
  TJRR: "/images/tribunais/card_TJRR.webp",
  TJRS: "/images/tribunais/card_TJRS.webp",
  TJSC: "/images/tribunais/card_TJSC.webp",
  TJSE: "/images/tribunais/card_TJSE.webp",
  TJSP: "/images/tribunais/card_TJSP.webp",
  TJTO: "/images/tribunais/card_TJTO.webp",
  TRT1: "/images/tribunais/card_TRT1.webp",
  TRT2: "/images/tribunais/card_TRT2.webp",
  TRT3: "/images/tribunais/card_TRT3.webp",
  TRT4: "/images/tribunais/card_TRT4.webp",
  TRT5: "/images/tribunais/card_TRT5.webp",
  TRT6: "/images/tribunais/card_TRT6.webp",
  TRT7: "/images/tribunais/card_TRT7.webp",
  TRT8: "/images/tribunais/card_TRT8.webp",
  TRT10: "/images/tribunais/card_TRT10.webp",
  TRT11: "/images/tribunais/card_TRT11.webp",
  TRT12: "/images/tribunais/card_TRT12.webp",
  TRT13: "/images/tribunais/card_TRT13.webp",
  TRT14: "/images/tribunais/card_TRT14.webp",
  TRT15: "/images/tribunais/card_TRT15.webp",
  TRT16: "/images/tribunais/card_TRT16.webp",
  TRT17: "/images/tribunais/card_TRT17.webp",
  TRT18: "/images/tribunais/card_TRT18.webp",
  TRT19: "/images/tribunais/card_TRT19.webp",
  TRT20: "/images/tribunais/card_TRT20.webp",
  TRT21: "/images/tribunais/card_TRT21.webp",
  TRT22: "/images/tribunais/card_TRT22.webp",
  TRT23: "/images/tribunais/card_TRT23.webp",
  TRT24: "/images/tribunais/card_TRT24.webp",
};

export const iconsConfig = {
  PRECATÓRIO: {
    bgColor: "#0332ac",
    icon: <FaFileAlt className="text-[22px] text-snow" />,
  },
  CREDITÓRIO: {
    bgColor: "#056216",
    icon: <FaFileInvoiceDollar className="text-[22px] text-snow" />,
  },
  "R.P.V.": {
    bgColor: "#810303",
    icon: <BiSolidCoinStack className="text-[22px] text-snow" />,
  },
};

const Card = ({
  oficio,
  onClickFn,
}: {
  oficio: NotionPage;
  onClickFn: () => void;
}) => {
  const fetchOficioDataFromWallet = async () => {
    const response = await api.post("/api/extrato/wallet/", {
      oficio,
      from_today: true,
    });
    return response.data;
  };

  const { data } = useQuery({
    queryKey: ["notion_marketplace_item", { item_id: oficio.id }],
    staleTime: 5 * 1000,
    queryFn: fetchOficioDataFromWallet,
  });

  return (
    <li
      className="mb-4 h-65 max-w-full font-nexa xsm:min-w-95 xsm:px-2 md:min-w-[350px] md:px-3 lg:px-4"
      onClick={onClickFn}
    >
      <div className="group relative h-55">
        <div className="absolute inset-0 z-0 overflow-hidden rounded-md">
          <Image
            src={
              imgPaths[
                oficio.properties["Tribunal"].select
                  ?.name as keyof typeof imgPaths
              ]
            }
            alt="Card Image"
            width={380}
            height={220}
            className="transition-all duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9)_20%,rgba(0,0,0,0.2)_80%)]"></div>
        </div>
        <div className="group relative flex h-full cursor-pointer flex-col justify-between rounded-md bg-cover bg-center p-4">
          {/* badge */}
          <div className="absolute -top-1 right-1 z-3 flex items-center justify-center group-hover:opacity-0">
            <Image
              src="/images/badge-tribunal.svg"
              alt="badge onde mostra o tribunal referente"
              width={70}
              height={75}
            />
            <span className="absolute top-5 font-bold text-black-2">
              {oficio.properties["Tribunal"].select?.name}
            </span>
          </div>
          {/* end badge */}

          {/* icon */}
          <span
            style={{
              backgroundColor:
                iconsConfig[
                  oficio.properties["Tipo"].select
                    ?.name as keyof typeof iconsConfig
                ].bgColor,
            }}
            className="flex h-10 w-10 items-center justify-center rounded-lg p-3"
          >
            {
              iconsConfig[
                oficio.properties["Tipo"].select
                  ?.name as keyof typeof iconsConfig
              ].icon
            }
          </span>
          {/* end icon */}

          {/* info */}
          <div className="flex items-center justify-between group-hover:opacity-0">
            <div>
              <p className="mb-2 w-fit border-b border-snow pr-2 text-sm font-semibold uppercase text-snow">
                {oficio.properties["Estado do Ente Devedor"].select?.name}
                {" - "}
                {oficio.properties["Tipo"].select?.name || "Sem tipo"}
              </p>
              <h2 className="text-gray-300">
                {data?.result[data.result.length - 1][
                  "valor_liquido_disponivel"
                ] ? (
                  numberFormat(
                    data?.result[data.result.length - 1][
                      "valor_liquido_disponivel"
                    ] || 0,
                  )
                ) : (
                  <CustomSkeleton className="h-6" />
                )}
              </h2>
            </div>
            {oficio.properties["Destaque"]?.checkbox && (
              <div className="flex items-center gap-2">
                <Image
                  src={"/images/higher-investor.svg"}
                  alt="badge de ativo em destaque"
                  width={28}
                  height={28}
                />
              </div>
            )}
          </div>
          {/* end info */}
        </div>

        {/* hover info */}
        <div
          title="clique para acessar o ativo"
          className="absolute inset-0 z-2 flex h-55 cursor-pointer flex-col justify-between rounded-md bg-[linear-gradient(to_top,#000000_20%,rgba(17,17,17,0.5)_80%)] p-4 opacity-0 transition-all duration-300 ease-in-out group-hover:h-65 group-hover:opacity-100"
        >
          {/* hovered icon */}
          <span
            title={oficio.properties["Tipo"].select?.name || "sem tipo"}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1b1b1b] p-3"
          >
            {
              iconsConfig[
                oficio.properties["Tipo"].select
                  ?.name as keyof typeof iconsConfig
              ].icon
            }
          </span>
          {/* end hovered icon */}

          {/* hovered info */}
          <div>
            <div className="grid grid-cols-2">
              <div className="col-span-2 mb-1 border-b border-snow pb-[2px] uppercase">
                <p className="text-[10px] text-gray-400">ENTE DEVEDOR</p>
                <p
                  title={
                    oficio.properties["Ente Devedor"].select?.name ||
                    "Não informado"
                  }
                  className="max-w-[316px] overflow-hidden text-ellipsis whitespace-nowrap text-sm text-snow"
                >
                  {oficio.properties["Ente Devedor"].select?.name ||
                    "Não informado"}
                </p>
              </div>
              <div className="col-span-1 mb-1 border-b border-snow pb-[2px] uppercase">
                <p className="text-[10px] text-gray-400">esfera</p>
                <p className="text-sm text-snow">
                  {oficio.properties["Esfera"].select?.name || "Não informada"}
                </p>
              </div>
              <div className="col-span-1 mb-1 border-b border-snow pb-[2px] uppercase">
                <p className="text-[10px] text-gray-400">
                  valor líquido atualizado
                </p>
                <p className="text-sm text-snow">
                  {data?.result[data.result.length - 1][
                    "valor_liquido_disponivel"
                  ] ? (
                    numberFormat(
                      data?.result[data.result.length - 1][
                        "valor_liquido_disponivel"
                      ] || 0,
                    )
                  ) : (
                    <CustomSkeleton className="h-6" />
                  )}
                </p>
              </div>
              <div className="col-span-1 mb-1 border-b border-snow pb-[2px] uppercase">
                <p className="text-[10px] text-gray-400">rentabilidade A.A.</p>
                <p className="text-sm text-snow">
                  {(
                    handleRentabilideAA(
                      handleRentabilidadeTotal(data),
                      handleMesesAteOPagamento(data),
                    ) * 100
                  )
                    .toFixed(2)
                    .replace(".", ",") + "%"}
                </p>
              </div>
              <div className="col-span-1 mb-1 border-b border-snow pb-[2px] uppercase">
                <p className="text-[10px] text-gray-400">
                  data de previsão pgto
                </p>
                <p className="text-sm text-snow">
                  {dateFormater(
                    oficio.properties["Previsão de pagamento"].date?.start,
                  ) || "não informada"}
                </p>
              </div>
              <div className="col-span-1 mb-1 border-b border-snow pb-[2px] uppercase">
                <p className="text-[10px] text-gray-400">valor da aquisição</p>
                <p className="text-sm text-snow">
                  {numberFormat(
                    oficio.properties["Valor de Aquisição (Wallet)"]?.number ||
                      0,
                  )}
                </p>
              </div>
              <div className="col-span-1 mb-1 border-b border-snow pb-[2px] uppercase">
                <p className="text-[10px] text-gray-400">valor projetado</p>
                <p className="text-sm text-snow">
                  {numberFormat(
                    oficio.properties["Valor Projetado"].number || 0,
                  )}
                </p>
              </div>
            </div>
          </div>
          {/* end hovered info */}
        </div>
        {/* end hover info */}
      </div>
    </li>
  );
};

export default Card;
