export const applyMaskCpfCnpj = (str: string) => {

    if (!str) return;

    if (/^(?=.*\.)(?=.*-).+$/.test(str)) return str;

    let maskedStr;

    if (str.length > 0 && str.length <= 11) {
      maskedStr = `${str.slice(0, 3)}.${str.slice(3, 6)}.${str.slice(6, 9)}-${str.slice(9, 11)}`
    } else {
      maskedStr = `${str.slice(0, 2)}.${str.slice(2, 5)}.${str.slice(5, 8)}-${str.slice(8, 12)}/${str.slice(12, 14)}`
    }

    return maskedStr
  }