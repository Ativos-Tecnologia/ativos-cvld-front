export const validationSelectPix = (pix: string) => {
	const validationPix = (pix: string) => {
		
    if (/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(pix)) return 1; // cpf
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(pix)) return 2; // email
    if (/^\d{2}\s\d{5}-\d{4}$/.test(pix)) return 3; // celular
    if (/^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/.test(pix)) return 4; // chave aleatória
    if (/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(pix)) return 5; // cnpj
  };

  switch (validationPix(pix)) {
    case 1:
      return "cpf";
    case 2:
      return "email";
    case 3:
      return "celular";
    case 4:
      return "chave";
    case 5:
      return "cnpj";
    default:
      return "celular";
  }
};
