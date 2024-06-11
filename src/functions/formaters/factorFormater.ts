const factorFormater = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumSignificantDigits: 5,
      style: "decimal",
    }).format(value);
};

export default factorFormater;