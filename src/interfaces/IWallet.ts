export interface IWalletResults {
    data_atualizacao: string;
    valor_principal: number;
    valor_juros: number;
    valor_inscrito: number;
    valor_bruto_atualizado_final: number;
    valor_liquido_disponivel: number;
  }[]

export interface IWalletResponse {
    id: string;
    valor_investido: number;
    valor_projetado: number;
    previsao_de_pgto: string;
    rentabilidade_anual: number;
    result: IWalletResults[];
  }

