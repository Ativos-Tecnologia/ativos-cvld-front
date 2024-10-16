import React from "react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import SmallProjectedProfitabilityChart from "../Charts/SmallProjectedProfitabilityChart";
import { useRouter } from "next/navigation";
import { iconsConfig } from "../Cards/marketplaceCard";
import numberFormat from "@/functions/formaters/numberFormat";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/api";
import { Tooltip } from "flowbite-react";


interface Stats {
  tribunal: string;
  valorAtualizado: number;
  rentabilidadeAA: number;
  tipo: string;
}

type MarketplaceRecommendationsProps = {
  id: string;
};

export interface Investment {
  id: string;
  tribunal: string;
  tipo: string;
  previsao_de_pagamento: string;
  valor_investido: number;
  valor_projetado: number;
  data_atualizacao: string;
  valor_principal: number;
  valor_juros: number;
  valor_inscrito: number;
  valor_bruto_atualizado_final: number;
  valor_liquido_disponivel: number;
}

const MarketplaceRecommendations: React.FC<MarketplaceRecommendationsProps> = ({ id }) => {

  const { push } = useRouter();

  const fetchOficioMktplaceItem = async () => {
    const response = await api.get(`/api/notion-api/marketplace/recomendations/${id}/`);

    return response.data.response
}

function handleRedirect(id: string) {
  push(`/dashboard/marketplace/${id}`);
}

  const { data } = useQuery<Investment[]>(
    {
        queryKey: ['smart_recomendation', id],
        staleTime: 1000,
        queryFn: fetchOficioMktplaceItem
    },
  );

 function handleRentabilidadeTotal(valor_projetado: number, valor_investido: number) {
    const result =
      (valor_projetado - valor_investido) / valor_investido;
    return Number.isNaN(result) ? 0 : result;
  }

function handleMesesAteOPagamento(data_atualizacao: string, data_previsao: string) {

    const data_aquisicao = new Date(data_atualizacao);
    const previsao_de_pgto = new Date(data_previsao);

    const diffMonths =
      Math.abs(previsao_de_pgto.getTime() - data_aquisicao.getTime()) /
      (1000 * 60 * 60 * 24 * 30);
    return Number.isNaN(diffMonths) ? 0 : diffMonths;
  }

  function handleRentabilideAA(rentabilidadeTotal: number, mesesAtePagamento: number,) {

    const rentabilidade =
      Math.pow(1 + rentabilidadeTotal, 12 / mesesAtePagamento) - 1;
    return Number.isNaN(rentabilidade) ? 0 : rentabilidade;
  }

  function handleRentabilidadeAM(rentabilidadeAnual: number) {
    return Math.pow(1 + rentabilidadeAnual, 1 / 12) - 1;
  }

  return (
    <>
    <h3 className="text-center text-black dark:text-snow my-4 tracking-wider uppercase">
      Outras oportunidades de investimento
    </h3>
      <div className="data-stats-slider-outer relative col-span-12 rounded-sm border border-stroke bg-white py-4 shadow-default dark:border-strokedark dark:bg-boxdark min-h-47.5">
        <Swiper
          className="dataStatsSlider swiper !-mx-px"
          modules={[Navigation]}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          slidesPerView={1}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1280: {
              slidesPerView: 3,
            },
            1536: {
              slidesPerView: 4,
            },
          }}
        >
          {data?.map((item, index) => (
            <SwiperSlide
            onClick={() => handleRedirect(item.id)}
              key={index}
              className="border-r border-stroke px-10 py-4 last:border-r-0 dark:border-strokedark cursor-pointer ease-in-out hover:bg-gray-100 dark:hover:bg-boxdark-2/35 group:hover:bg-boxdark-2/35"
            >
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-2.5">
                  <Tooltip
                      content={item.tipo}
                      placement='right'
                      className="flex items-center justify-center"
                  >
                  <div className="h-12 w-12 overflow-hidden">

                  <span 
                        style={{ backgroundColor: iconsConfig[data[index]?.tipo as keyof typeof iconsConfig].bgColor }}
                        className='flex items-center justify-center rounded-lg p-3 w-10 h-10'
                    >
                        {iconsConfig[data[index]?.tipo as keyof typeof iconsConfig].icon}
                    </span>
                  </div>
                </Tooltip>
                  <h4 className="text-xl font-bold text-black dark:text-white">
                    {item.tribunal}
                  </h4>
                </div>

                <SmallProjectedProfitabilityChart updateValue={item.valor_liquido_disponivel} projectedValue={item.valor_projetado} updateDate={item.data_atualizacao} projectedDate={item.previsao_de_pagamento} monthsToPayment={Math.floor(handleMesesAteOPagamento(item.data_atualizacao, item.previsao_de_pagamento))} investedValue={item.valor_investido} rentabilityPerYer={handleRentabilideAA(handleRentabilidadeTotal(item.valor_projetado, item.valor_investido), handleMesesAteOPagamento(item.data_atualizacao, item.previsao_de_pagamento)) * 100} />
              </div>
              <div className="mt-5.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm font-medium">Total Atualizado</p>

                  <p className="font-medium text-black dark:text-white">
                    {numberFormat(item.valor_liquido_disponivel)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm font-medium">Rentabilidade Ao Ano</p>

                  <p
                    className={`flex items-center gap-1 font-medium ${
                      handleRentabilideAA(handleRentabilidadeTotal(item.valor_projetado, item.valor_investido), handleMesesAteOPagamento(item.data_atualizacao, item.previsao_de_pagamento)) >= 0 ? "text-meta-3" : "text-red"
                    }`}
                  >
                    {(handleRentabilideAA(handleRentabilidadeTotal(item.valor_projetado, item.valor_investido), handleMesesAteOPagamento(item.data_atualizacao, item.previsao_de_pagamento)) * 100).toFixed(2).replace('.', ',') }%
                    {handleRentabilideAA(handleRentabilidadeTotal(item.valor_projetado, item.valor_investido), handleMesesAteOPagamento(item.data_atualizacao, item.previsao_de_pagamento)) >= 0 ? (
                      <svg
                        className="fill-current"
                        width="11"
                        height="8"
                        viewBox="0 0 11 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.83258 0.417479L10.8364 7.91748L0.828779 7.91748L5.83258 0.417479Z"
                          fill=""
                        />
                      </svg>
                    ) : (
                      <svg
                        className="fill-current"
                        width="11"
                        height="9"
                        viewBox="0 0 11 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.83246 8.41748L0.828662 0.91748L10.8363 0.91748L5.83246 8.41748Z"
                          fill=""
                        />
                      </svg>
                    )}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-button-prev">
          <svg
            className="fill-current"
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.8562 2.80185C16.0624 2.80185 16.2343 2.8706 16.4062 3.0081C16.7155 3.31748 16.7155 3.79873 16.4062 4.1081L9.1874 11.4987L16.4062 18.855C16.7155 19.1644 16.7155 19.6456 16.4062 19.955C16.0968 20.2644 15.6155 20.2644 15.3062 19.955L7.5374 12.0487C7.22803 11.7394 7.22803 11.2581 7.5374 10.9487L15.3062 3.04248C15.4437 2.90498 15.6499 2.80185 15.8562 2.80185Z"
              fill=""
            />
          </svg>
        </div>
        <div className="swiper-button-next">
          <svg
            className="fill-current"
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.08721 20.1957C7.88096 20.1957 7.70908 20.127 7.53721 19.9895C7.22783 19.6801 7.22783 19.1988 7.53721 18.8895L14.756 11.4988L7.53721 4.14258C7.22783 3.8332 7.22783 3.35195 7.53721 3.04258C7.84658 2.7332 8.32783 2.7332 8.63721 3.04258L16.406 10.9488C16.7153 11.2582 16.7153 11.7395 16.406 12.0488L8.63721 19.9551C8.49971 20.0926 8.29346 20.1957 8.08721 20.1957Z"
              fill=""
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default MarketplaceRecommendations;
