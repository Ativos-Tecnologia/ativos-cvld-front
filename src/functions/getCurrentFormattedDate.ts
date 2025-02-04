/**
 * Retorna a data atual no formato "dd/mm/yyyy" na timezone de São Paulo.
 *
 * @returns string - Data atual formatada no padr o brasileiro.
 */
export function getCurrentFormattedDate (): string {
    const dateInSaoPaulo = new Date().toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    return dateInSaoPaulo;
}