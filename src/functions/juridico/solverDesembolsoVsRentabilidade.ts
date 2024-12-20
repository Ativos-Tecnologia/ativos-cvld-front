/**
 * Handles the calculation of desembolso (disbursement) versus rentabilidade (profitability).
 *
 * @param {number} rentabilidade_ao_ano - The annual profitability rate.
 * @param {NotionPage} data - The data object containing properties from a Notion page.
 */
export function handleDesembolsoVsRentabilidade(rentabilidade_ao_ano: number, data: any) {
  const meses_ate_pgto = data.properties["Meses entre aquisição e pagamento"]?.formula?.number ?? 0;
  const valor_projetado = data.properties["Valor Projetado"]?.number ?? 0;
  const valor_liquido_com_reservas = data.properties["Valor Líquido (Com Reserva dos Honorários)"]?.formula?.number ?? 0;

  const percentual_de_ganho = Math.pow(1 + rentabilidade_ao_ano, meses_ate_pgto / 12) - 1;
  const desembolso = valor_projetado  / (percentual_de_ganho + 1);
  const percentual_de_desembolso = desembolso / valor_liquido_com_reservas

  return {
    rentabilidade_ao_ano,
    desembolso,
    percentual_de_desembolso,
    percentual_de_ganho,
	meses_ate_pgto,
  }
}

export function handlePercentualDeGanhoVsRentabilidadeAnual(percentual_de_ganho: number, data: any) {
	const meses_ate_pgto = data.properties["Meses entre aquisição e pagamento"]?.formula?.number ?? 0;
  	return Math.pow(1 + percentual_de_ganho, 12 / meses_ate_pgto) - 1;
}