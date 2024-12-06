import { imgPaths } from "@/constants/tribunais";
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
import HoverCard from "../CrmUi/Wrappers/HoverCard";

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
  disabled = false,
}: {
  oficio: NotionPage;
  onClickFn: () => void;
  disabled?: boolean;
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

  // Função para desativar a função quando o disable estiver ativado.
  const handleClick = (e: any) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClickFn();
  };

  return (
    <HoverCard onClick={handleClick} disabled={disabled}>
      <HoverCard.Container
        disabled={disabled}
        backgroundImg={imgPaths[oficio.properties["Tribunal"].select?.name as keyof typeof imgPaths]}
      >
        <>
          <HoverCard.Content>
            <HoverCard.TribunalBadge tribunal={oficio.properties["Tribunal"].select?.name} />
            <HoverCard.Icon
              bgColor={iconsConfig[oficio.properties["Tipo"].select?.name as keyof typeof iconsConfig].bgColor}
              icon={iconsConfig[oficio.properties["Tipo"].select?.name as keyof typeof iconsConfig].icon}
            />

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
                    <CustomSkeleton
                      type="title"
                      className="h-6"
                    />
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
          </HoverCard.Content>

          {/* Conteúdo mostrado com o mouse em cima */}
          <HoverCard.HiddenContent title="Clique para acessar o ativo">

            <HoverCard.Icon
              title={oficio.properties["Tipo"].select?.name || "sem tipo"}
              bgColor="#1b1b1b"
              icon={iconsConfig[oficio.properties["Tipo"].select?.name as keyof typeof iconsConfig].icon}
            />

            <HoverCard.InfoList>
              <HoverCard.ListItem className="col-span-2">
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
              </HoverCard.ListItem>
              <HoverCard.ListItem>
                <p className="text-[10px] text-gray-400">esfera</p>
                <p className="text-sm text-snow">
                  {oficio.properties["Esfera"].select?.name || "Não informada"}
                </p>
              </HoverCard.ListItem>
              <HoverCard.ListItem>
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
                    <CustomSkeleton
                      type="title"
                      className="h-6"
                    />
                  )}
                </p>
              </HoverCard.ListItem>
              <HoverCard.ListItem>
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
              </HoverCard.ListItem>
              <HoverCard.ListItem>
                <p className="text-[10px] text-gray-400">
                  data de previsão pgto
                </p>
                <p className="text-sm text-snow">
                  {dateFormater(
                    oficio.properties["Previsão de pagamento"].date?.start,
                  ) || "não informada"}
                </p>
              </HoverCard.ListItem>
              <HoverCard.ListItem>
                <p className="text-[10px] text-gray-400">valor da aquisição</p>
                <p className="text-sm text-snow">
                  {numberFormat(
                    oficio.properties["Desembolso All-In"]?.formula?.number ||
                    0,
                  )}
                </p>
              </HoverCard.ListItem>
              <HoverCard.ListItem>
                <p className="text-[10px] text-gray-400">valor projetado</p>
                <p className="text-sm text-snow">
                  {numberFormat(
                    oficio.properties["Valor Projetado"].number || 0,
                  )}
                </p>
              </HoverCard.ListItem>
            </HoverCard.InfoList>
          </HoverCard.HiddenContent>
        </>
      </HoverCard.Container>
    </HoverCard>
  );
};

export default Card;
