import { ICelerResponse } from './ICelerResponse';

export interface IDocTable {
    'Tipo de Conta': {
        id: string;
        type: string;
        select: null;
    };
    Identidade: {
        id: string;
        type: string;
        rich_text: [
            {
                type: string;
                text: {
                    content: string;
                    link: null;
                };
                annotations: {
                    bold: boolean;
                    italic: boolean;
                    strikethrough: boolean;
                    underline: boolean;
                    code: boolean;
                    color: string;
                };
                plain_text: string;
                href: null;
            },
        ];
    };
    Contacts: {
        id: string;
        type: 'relation';
        relation: [];
        has_more: boolean;
    };
    'Nome da Mãe': {
        id: string;
        type: string;
        rich_text: [
            {
                type: string;
                text: {
                    content: string;
                    link: null;
                };
                annotations: {
                    bold: boolean;
                    italic: boolean;
                    strikethrough: boolean;
                    underline: boolean;
                    code: boolean;
                    color: string;
                };
                plain_text: string;
                href: null;
            },
        ];
    };
    Opportunities: {
        id: string;
        type: 'relation';
        relation: [];
        has_more: boolean;
    };
    'Doc. Certidão Nascimento/Casamento Status': {
        id: string;
        type: string;
        select: {
            id: string;
            name: string;
            color: string;
        };
    };
    'Status Diligência': {
        id: string;
        type: 'rollup';
        rollup: {
            type: 'array';
            array: [
                {
                    type: string;
                    select: {
                        id: string;
                        name: string;
                        color: string;
                    };
                },
            ];
            function: string;
        };
    };
    Bairro: {
        id: string;
        type: 'rich_text';
        rich_text: [
            {
                type: string;
                text: {
                    content: string;
                    link: null;
                };
                annotations: {
                    bold: boolean;
                    italic: boolean;
                    strikethrough: boolean;
                    underline: boolean;
                    code: boolean;
                    color: string;
                };
                plain_text: string;
                href: null;
            },
        ];
    };
    Tarefas: {
        id: string;
        type: 'relation';
        relation: [];
        has_more: boolean;
    };
    'Estado Civil': {
        id: string;
        type: string;
        select: {
            id: string;
            name: string;
            color: string;
        };
    };
    'Doc. Comprovante de Residência': {
        id: string;
        type: 'url';
        url: string;
    };
    'Tipo de Pix': {
        id: string;
        type: string;
        select: null;
    };
    'Doc. RG Status': {
        id: string;
        type: 'select';
        select: {
            id: string;
            name: string;
            color: string;
        };
    };
    Status: {
        id: string;
        type: 'rollup';
        rollup: {
            type: 'array';
            array: [
                {
                    type: 'status';
                    status: {
                        id: string;
                        name: string;
                        color: string;
                    };
                },
            ];
            function: string;
        };
    };
    'CENTRAL DE PRECATÓRIOS': {
        id: string;
        type: 'relation';
        relation: [
            {
                id: string;
            },
        ];
        has_more: boolean;
    };
    Usuário: {
        id: string;
        type: 'select';
        select: {
            id: string;
            name: string;
            color: string;
        };
    };
    Agência: {
        id: string;
        type: 'rich_text';
        rich_text: [
            {
                type: 'text';
                text: {
                    content: string;
                    link: null;
                };
                annotations: {
                    bold: boolean;
                    italic: boolean;
                    strikethrough: boolean;
                    underline: boolean;
                    code: boolean;
                    color: string;
                };
                plain_text: string;
                href: null;
            },
        ];
    };
    'Doc. Certidão Nascimento/Casamento': {
        id: string;
        type: string;
        url: string;
    };
    Conta: {
        id: string;
        type: 'rich_text';
        rich_text: [
            {
                type: 'text';
                text: {
                    content: string;
                    link: null;
                };
                annotations: {
                    bold: boolean;
                    italic: boolean;
                    strikethrough: boolean;
                    underline: boolean;
                    code: boolean;
                    color: string;
                };
                plain_text: string;
                href: null;
            },
        ];
    };
    Complemento: {
        id: string;
        type: 'rich_text';
        rich_text: [];
    };
    Notes: {
        id: string;
        type: 'relation';
        relation: [];
        has_more: boolean;
    };
    'Estado (UF)': {
        id: string;
        type: 'select';
        select: {
            id: string;
            name: string;
            color: string;
        };
    };
    Profissão: {
        id: string;
        type: 'rich_text';
        rich_text: [
            {
                type: 'text';
                text: {
                    content: string;
                    link: null;
                };
                annotations: {
                    bold: boolean;
                    italic: boolean;
                    strikethrough: boolean;
                    underline: boolean;
                    code: boolean;
                    color: string;
                };
                plain_text: string;
                href: null;
            },
        ];
    };
    'Doc. Ofício Requisitório': {
        id: string;
        type: 'url';
        url: string;
    };
    Município: {
        id: string;
        type: string;
        select: {
            id: string;
            name: string;
            color: string;
        };
    };
    'Doc. Comprovante de Residência Status': {
        id: string;
        type: 'select';
        select: {
            id: string;
            name: string;
            color: string;
        };
    };
    'Doc. RG': {
        id: string;
        type: 'url';
        url: string;
    };
    Número: {
        id: string;
        type: 'number';
        number: number;
    };
    Banco: {
        id: string;
        type: 'rich_text';
        rich_text: [
            {
                type: 'text';
                text: {
                    content: string;
                    link: null;
                };
                annotations: {
                    bold: boolean;
                    italic: boolean;
                    strikethrough: boolean;
                    underline: boolean;
                    code: boolean;
                    color: string;
                };
                plain_text: string;
                href: null;
            },
        ];
    };
    CEP: {
        id: string;
        type: 'rich_text';
        rich_text: [
            {
                type: 'text';
                text: {
                    content: string;
                    link: null;
                };
                annotations: {
                    bold: boolean;
                    italic: boolean;
                    strikethrough: boolean;
                    underline: boolean;
                    code: boolean;
                    color: string;
                };
                plain_text: string;
                href: null;
            },
        ];
    };
    Nascimento: {
        id: string;
        type: 'date';
        date: {
            start: string;
            end: null;
            time_zone: null;
        };
    };
    'É cessionário?': {
        id: string;
        type: 'checkbox';
        checkbox: boolean;
    };
    'Doc. Ofício Requisitório Status': {
        id: string;
        type: 'select';
        select: {
            id: string;
            name: string;
            color: string;
        };
    };
    Pix: {
        id: string;
        type: 'rich_text';
        rich_text: [
            {
                type: 'text';
                text: {
                    content: string;
                    link: null;
                };
                annotations: {
                    bold: boolean;
                    italic: boolean;
                    strikethrough: boolean;
                    underline: boolean;
                    code: boolean;
                    color: string;
                };
                plain_text: string;
                href: null;
            },
        ];
    };
    'Órgão Expedidor': {
        id: string;
        type: 'rich_text';
        rich_text: [
            {
                type: 'text';
                text: {
                    content: string;
                    link: null;
                };
                annotations: {
                    bold: boolean;
                    italic: boolean;
                    strikethrough: boolean;
                    underline: boolean;
                    code: boolean;
                    color: string;
                };
                plain_text: string;
                href: null;
            },
        ];
    };
    CPF: {
        id: string;
        type: 'rich_text';
        rich_text: [
            {
                type: 'text';
                text: {
                    content: string;
                    link: null;
                };
                annotations: {
                    bold: boolean;
                    italic: boolean;
                    strikethrough: boolean;
                    underline: boolean;
                    code: boolean;
                    color: string;
                };
                plain_text: string;
                href: null;
            },
        ];
    };
    'Rua/Av/Logradouro': {
        id: string;
        type: 'rich_text';
        rich_text: [
            {
                type: 'text';
                text: {
                    content: string;
                    link: null;
                };
                annotations: {
                    bold: boolean;
                    italic: boolean;
                    strikethrough: boolean;
                    underline: boolean;
                    code: boolean;
                    color: string;
                };
                plain_text: string;
                href: null;
            },
        ];
    };
    Email: {
        id: string;
        type: 'email';
        email: string;
    };
    'Nome do Pai': {
        id: string;
        type: 'rich_text';
        rich_text: [
            {
                type: 'text';
                text: {
                    content: string;
                    link: null;
                };
                annotations: {
                    bold: boolean;
                    italic: boolean;
                    strikethrough: boolean;
                    underline: boolean;
                    code: boolean;
                    color: string;
                };
                plain_text: string;
                href: null;
            },
        ];
    };
    Celular: {
        id: string;
        type: 'phone_number';
        phone_number: string;
    };
    Nacionalidade: {
        id: string;
        type: 'select';
        select: {
            id: string;
            name: string;
            color: string;
        };
    };
    'Nome Completo': {
        id: string;
        type: 'title';
        title: [
            {
                type: 'text';
                text: {
                    content: string;
                    link: null;
                };
                annotations: {
                    bold: boolean;
                    italic: boolean;
                    strikethrough: boolean;
                    underline: boolean;
                    code: boolean;
                    color: string;
                };
                plain_text: string;
                href: null;
            },
        ];
    };
    Coordenador: {
        id: string;
        type: 'rollup';
        rollup: {
            type: 'array';
            array: [
                {
                    type: string;
                    formula: {
                        type: 'string';
                        string: string;
                    };
                },
            ];
            function: string;
        };
    };
}
export interface IDocTableResponse {
    results: ICelerResponse<IDocTable>[];
}
