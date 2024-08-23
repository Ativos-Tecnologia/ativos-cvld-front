const dateFormater = (date: string | null | undefined): string => {
    if (!date) return 'Sem data';
    const parsedDate = new Date(date + "T00:00:00");

    if (isNaN(parsedDate.getTime())) {
        throw new RangeError('A data fornecida é inválida.');
    }
    return new Intl.DateTimeFormat("pt-BR").format(parsedDate);
}

export default dateFormater;