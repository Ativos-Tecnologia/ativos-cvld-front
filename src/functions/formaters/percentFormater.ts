const percentageFormater = (value: number | string) => {

    if (value === "0%") {
        value = "0";
    }

    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumSignificantDigits: 4,
      style: "percent",
    }).format(Number(value));
};

export default percentageFormater;