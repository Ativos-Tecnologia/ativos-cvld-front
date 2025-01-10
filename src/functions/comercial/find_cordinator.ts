export function FindCoordinator(username: string): string {
    const group1 = [
        "JosiasLopes", "matheussd", "CamilaTinoco", "RENATAVASCONSELOS", "JULIANAALBUQUERQUE",
        "RicardoPerri", "LotusPrecatorios", "MARCIOVALLE", "BeatrizRodolfo", 
        "ANACAROLINEMENEZESPEQUENO", "LaisFerraz", "Kenia", "JoseAmbrosio", 
        "Alexander", "DaviBarbosa", "Joiozo", "MUTUAL", "AnaKaroline", 
        "Douglas", "TatianaMatos", "ocimarviero", "cassia", "rosilaineribeiro", 
        "Cabral", "AdrianaAvila", "AndersonMelo", "DaniloIsab", "Evaristo", 
        "RaphaelMonteiro", "Calvino", "JoaoPedroRF", "VictoriaSouza", "OeMPrecatorios"
    ];

    const group2 = [
        "renatonitatori", "MundialCred", "LeonardoOrsi", 
        "GeovanaRutzats", "WilliamVieira", "PaulaHaraguchi", "VivianeMatos", 
        "Alvaro", "BrunoRodrigues", "CLAUDIOROSARIO", "BritoPimentel", 
        "ArthurMonteiro", "JuniorDuarte", "PauloPcg", "Ulisses", "bsbprecatorios", 
        "Prime", "Investpre", "CAPFI", "EduardoRodrigues", "Dhvyd", 
        "LindembergLima", "RodolfoCavalcanti", "VinniciusCase", "EdivaldoB", 
        "Thobias", "Rosi", "ElaineVieira", "lfnadm"
    ];

    const group3 = ["Premium"];
    const group4 = [
        "Marcela Vasconcelos", "jarbas", "VictorHugo", "Thais", 
        "Ulysses", "henrique", "Ativos", "rafael", "Judit", "Juspago"
    ];
    const group5 = ["marcela"];

    if (group1.includes(username)) {
        return "Beatriz";
    }
    if (group2.includes(username)) {
        return "Viviane";
    }
    if (group3.includes(username)) {
        return "Thais";
    }
    if (group4.includes(username)) {
        return "Ativos";
    }
    if (group5.includes(username)) {
        return "marcela";
    }
    return "Designar Coordenador";
}
