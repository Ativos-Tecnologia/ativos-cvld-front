import backendNumberFormat from "./backendNumberFormat";

export const formatCurrency = (value: string) => {
  const cleanValue = parseFloat(value.replace(/R\$\s*/g, "").replaceAll(".", "").replaceAll(",", "."));
  const formattedValue = cleanValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return formattedValue;
};
