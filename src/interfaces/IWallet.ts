export interface IWalletResults {
    data_atualizacao: string;
    valor_principal: number;
    valor_juros: number;
    valor_inscrito: number;
    valor_bruto_atualizado_final: number;
    valor_liquido_disponivel: number;
  }

export interface IWalletResponse {
    id: string;
    valor_investido: number;
    valor_projetado: number;
    previsao_de_pgto: string;
    rentabilidade_anual: number;
    data_de_aquisicao: string;
    result: IWalletResults[];
    valor_liquido_a_ser_cedido?: number;
  }

