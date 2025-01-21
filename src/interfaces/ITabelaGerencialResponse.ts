export interface ITabelaGerencial {
    id: string;
    credor: string;
    status: string;
    status_diligencia: string;
    valor_liquido_disponivel: number;
    tribunal: string;
    tipo: string;
    rentabilidade_aa: number | null;
    loa: number;
    regime: string;
    esfera: string;
    proposta_escolhida: number;
    comissao: number;
    criado_em: string;
    usuario: string;
    custo_do_precatorio: number;
    proposta_maxima: number | null;
    proposta_minima: number | null;
    cpf_cnpj: string;
    observacoes: string;
    meta_1: number;
    meta_2: number;
    meta_3: number;
    precatorio_fechado_em: string | null;
}

export interface ITabelaGerencialResponse {
    results: ITabelaGerencial[];
}