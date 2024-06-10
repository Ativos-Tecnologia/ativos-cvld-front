const dateFormater = (date: string) => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
}

export default dateFormater;