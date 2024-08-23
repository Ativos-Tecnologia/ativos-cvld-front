const percentageFormater = (value: number | string) => {

    console.log(value);


    if (value === "0%") {
        value = "0";
    }

    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumSignificantDigits: 5,
      style: "percent",
    }).format(Number(value));
};

export default percentageFormater;