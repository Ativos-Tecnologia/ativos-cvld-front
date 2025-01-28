const estados = [
    { id: "AC", nome: "Acre" },
    { id: "AL", nome: "Alagoas" },
    { id: "AP", nome: "Amapá" },
    { id: "AM", nome: "Amazonas" },
    { id: "BA", nome: "Bahia" },
    { id: "CE", nome: "Ceará" },
    { id: "DF", nome: "Distrito Federal" },
    { id: "ES", nome: "Espírito Santo" },
    { id: "GO", nome: "Goiás" },
    { id: "MA", nome: "Maranhão" },
    { id: "MT", nome: "Mato Grosso" },
    { id: "MS", nome: "Mato Grosso do Sul" },
    { id: "MG", nome: "Minas Gerais" },
    { id: "PA", nome: "Pará" },
    { id: "PB", nome: "Paraíba" },
    { id: "PR", nome: "Paraná" },
    { id: "PE", nome: "Pernambuco" },
    { id: "PI", nome: "Piauí" },
    { id: "RJ", nome: "Rio de Janeiro" },
    { id: "RN", nome: "Rio Grande do Norte" },
    { id: "RS", nome: "Rio Grande do Sul" },
    { id: "RO", nome: "Rondônia" },
    { id: "RR", nome: "Roraima" },
    { id: "SC", nome: "Santa Catarina" },
    { id: "SP", nome: "São Paulo" },
    { id: "SE", nome: "Sergipe" },
    { id: "TO", nome: "Tocantins" },
  ];

  type estado = Array<{ id: string; nome: string }>
  type regime = "COMUM" | "ESPECIAL";
  type ente_devedor = string

const EstadoRegimeEnteDevedor = {
    "AC": {
        "COMUM": ["MUNICÍPIO DE CASSILÂNDIA", "MUNICÍPIO DE CHAPADÃO DO SUL"],
        "ESPECIAL": ["AUTARQUIA MUNICIPAL DE TRÂNSITO E CIDADANIA - AMC"]
    },
    "AL": {
        "COMUM": ["MUNICÍPIO DE CASSILÂNDIA", "MUNICÍPIO DE CHAPADÃO DO SUL"],
        "ESPECIAL": ["AUTARQUIA MUNICIPAL DE TRÂNSITO E CIDADANIA - AMC"]
    },
}

interface IEstadoRegimeEnteDevedor {
    [key: string]: {
        [key in regime]: ente_devedor[]
    }
}
