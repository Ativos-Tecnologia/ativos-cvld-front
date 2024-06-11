const dateFormater = (date: string) => {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        throw new RangeError('A data fornecida é inválida.');
    }
    return new Intl.DateTimeFormat("pt-BR").format(parsedDate);
}

export default dateFormater;