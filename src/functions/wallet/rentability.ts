import { IWalletResponse } from "@/interfaces/IWallet";

export function handleRentabilidadeTotal(data: IWalletResponse) {
  const result =
    (data?.valor_projetado - data?.valor_investido) / data?.valor_investido;
  return Number.isNaN(result) ? 0 : result;
}

export function handleMesesAteOPagamento(data: IWalletResponse) {
  const data_aquisicao = new Date(data?.result[0].data_atualizacao);
  const previsao_de_pgto = new Date(data?.previsao_de_pgto);

  const diffMonths =
    Math.abs(previsao_de_pgto.getTime() - data_aquisicao.getTime()) /
    (1000 * 60 * 60 * 24 * 30);
  return Number.isNaN(diffMonths) ? 0 : diffMonths;
}

export function handleRentabilideAA(rentabilidadeTotal: number, mesesAtePagamento: number,) {
  const rentabilidade =
    Math.pow(1 + rentabilidadeTotal, 12 / mesesAtePagamento) - 1;
  return Number.isNaN(rentabilidade) ? 0 : rentabilidade;
}

export function handleRentabilidadeAM(rentabilidadeAnual: number) {
  return Math.pow(1 + rentabilidadeAnual, 1 / 12) - 1;
}
