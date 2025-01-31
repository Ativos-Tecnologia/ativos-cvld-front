export function FindCoordinator(username: string): string {
    const groupBeatrizRodolfo = [
        'JosiasLopes',
        'matheussd',
        'CamilaTinoco',
        'RENATAVASCONSELOS',
        'JULIANAALBUQUERQUE',
        'RicardoPerri',
        'LotusPrecatorios',
        'MARCIOVALLE',
        'BeatrizRodolfo',
        'ANACAROLINEMENEZESPEQUENO',
        'LaisFerraz',
        'Kenia',
        'JoseAmbrosio',
        'Alexander',
        'DaviBarbosa',
        'Joiozo',
        'MUTUAL',
        'AnaKaroline',
        'Douglas',
        'TatianaMatos',
        'ocimarviero',
        'cassia',
        'rosilaineribeiro',
        'Cabral',
        'AdrianaAvila',
        'AndersonMelo',
        'DaniloIsab',
        'Evaristo',
        'RaphaelMonteiro',
        'Calvino',
        'JoaoPedroRF',
        'VictoriaSouza',
        'OeMPrecatorios',
        'ANDREZAMIRLANIA',
        'Danielle',
        'JoaoPauloMurca',
        'MutualCoordenador',
        'fernandovictorbm',
        'NatanaelCaetano',
        'Wing',
        'niltonoliveira',
        'Samueldepaula',
        'Prosperidadeinvestimentos',
        'Gabriela',
        'Aristoteles',
        'TeiveCompany',
        'lucas',
        'Edgarcia',
        'Naslausky',
        'Alessandra',
        'viniciusoliveira',
    ];

    const groupVivianeMatos = [
        'renatonitatori',
        'Beatriz',
        'MundialCred',
        'LeonardoOrsi',
        'GeovanaRutzats',
        'WilliamVieira',
        'PaulaHaraguchi',
        'VivianeMatos',
        'Alvaro',
        'BrunoRodrigues',
        'CLAUDIOROSARIO',
        'BritoPimentel',
        'ArthurMonteiro',
        'JuniorDuarte',
        'PauloPcg',
        'Ulisses',
        'bsbprecatorios',
        'Prime',
        'Investpre',
        'CAPFI',
        'EduardoRodrigues',
        'Dhvyd',
        'LindembergLima',
        'RodolfoCavalcanti',
        'VinniciusCase',
        'EdivaldoB',
        'Thobias',
        'Rosi',
        'ElaineVieira',
        'lfnadm',
        'jgrandini',
        'DrFabiano',
        'manoel',
        'Rmrcorp',
        'EmanueleVilanova',
        'anacarolinameijon',
        'DavidFernandes',
        'gabriela',
        'Robsonfs',
        'Cprecatorio',
        'AnaBarros',
        'Paulo',
    ];

    const groupThais = ['Premium'];

    const groupAtivos = [
        'Marcela Vasconcelos',
        'jarbas',
        'VictorHugo',
        'Thais',
        'Ulysses',
        'henrique',
        'Ativos',
        'rafael',
        'Judit',
        'Juspago',
    ];

    const groupMarcela = ['marcela', 'ErickaDax'];

    if (groupBeatrizRodolfo.includes(username)) {
        return 'BeatrizRodolfo';
    }
    if (groupVivianeMatos.includes(username)) {
        return 'VivianeMatos';
    }
    if (groupThais.includes(username)) {
        return 'Thais';
    }
    if (groupAtivos.includes(username)) {
        return 'Ativos';
    }
    if (groupMarcela.includes(username)) {
        return 'marcela';
    }

    return 'Designar Coordenador';
}
