import { IWalletResponse } from "@/interfaces/IWallet";

// export function handleRentabilidadeTotal(data: IWalletResponse) {
//   const result =
//     (data?.valor_projetado - data?.valor_investido) / data?.valor_investido;
//   return Number.isNaN(result) ? 0 : result;
// }

export function handleMesesAteOPagamento(data: IWalletResponse): number {

  const data_aquisicao = new Date(data?.result[data?.result.length - 1].data_atualizacao);
  const previsao_de_pgto = new Date(data?.previsao_de_pgto);

  const diffMonths =
    Math.abs(previsao_de_pgto.getTime() - data_aquisicao.getTime()) /
    (1000 * 60 * 60 * 24 * 30);

    console.log(diffMonths);

  return Number.isNaN(diffMonths) ? 0 : diffMonths;
}

// export function handleRentabilideAA(data: IWalletResponse, mesesAtePagamento: number,) {

//   const rentabilidade =
//     Math.pow(1 + data.rentabilidade_anual, 12 / mesesAtePagamento) - 1;
//   return Number.isNaN(rentabilidade) ? 0 : rentabilidade;
// }

export function handleRentabilidadeAM(rentabilidadeAnual: number) {
  return Number((Math.pow(1 + rentabilidadeAnual, 1 / 12) - 1).toFixed(4));
}
