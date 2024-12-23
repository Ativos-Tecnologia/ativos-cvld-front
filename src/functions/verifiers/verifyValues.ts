const OBSERVABLE_FIELDS = [
  "valor_principal",
  "valor_juros",
  "natureza",
  "tipo_do_oficio",
  "esfera",
  "regime",
  "tribunal",
  "data_base",
  "data_requisicao",
  "valor_aquisicao_total",
  "ja_possui_destacamento",
  "incidencia_juros_moratorios",
  "nao_incide_selic_no_periodo_db_ate_abril",
  "incidencia_rra_ir",
  "ir_incidente_rra",
  "incidencia_pss",
  "data_limite_de_atualizacao_check",
  "regime",
  "percentual_a_ser_adquirido",
  "percentual_de_honorarios",
  "valor_pss",
  "numero_de_meses",
];

/**
 *  Retorna os valores recebidos como string para normalizar uma comparação
 *
 * @param {any} value - valor a ser normalizado
 * @returns {string} valor normalizado
 */

function normalizeValue(value: any): string {

  if (typeof value === "number") {
    return value.toString(); // Converte números para string
  }

  if (typeof value === "string") {
    // Se o valor contiver dígitos e formatação de moeda, normaliza
    if (/[\d,.]/.test(value)) {
      return value
        .replace(/[\sR$]/g, "") // Remove símbolos de moeda e espaços
        .replace(/\./g, "") // Remove pontos (separadores de milhar)
        .replace(",", "."); // Converte vírgula decimal para ponto
    }
    return value.trim(); // Mantém o texto original (ex: natureza)
  }

  return ""; // Trata valores nulos ou indefinidos
}

/**
 * Retorna um booleano indicando se algum valor do objeto
 * foi modificado (baseado na constante OBSERVABLE_FIELDS)
 *
 * @param {Record<string, any>} data - Objeto com valores default do form
 * @param {Record<string, any>} modData - Objeto com os valores modificados (que serão enviados para o back)
 * @returns {boolean} - retorno da função (default: false)
 */

export function verifyUpdateFields(
  data: Record<string, any>,
  modData: Record<string, any>,
): boolean {
  let wasUpdated = false;
  const oldValues = Object.entries(data);

  oldValues.forEach((prop) => {
    if (OBSERVABLE_FIELDS.includes(prop[0])) {
      if (normalizeValue(prop[1]) !== normalizeValue(modData[prop[0]])) {
        wasUpdated = true;
        return;
      }
    }
  });

  return wasUpdated;
}
