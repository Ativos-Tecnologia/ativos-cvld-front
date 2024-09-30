export default function backendNumberFormat(value: string) {
    if (!value?.replace) {
      return "0.00";
    }

    return (
      value.replace("R$ ", "").replaceAll(".", "").replaceAll(",", ".") ||
      "0.00"
    );
  }