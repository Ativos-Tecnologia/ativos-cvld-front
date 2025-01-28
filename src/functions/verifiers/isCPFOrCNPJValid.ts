/**
 * Verifica se o valor fornecido possui o tamanho esperado para um CPF ou CNPJ formatado.
 *
 * - CPF formatado: "XXX.XXX.XXX-XX" (14 caracteres).
 * - CNPJ formatado: "XX.XXX.XXX/XXXX-XX" (18 caracteres).
 *
 * @param {string} value - O valor a ser verificado (geralmente um CPF ou CNPJ formatado).
 * @returns {boolean} - Retorna `true` se o valor tiver 14 ou 18 caracteres, caso contrário, `false`.
 *
 * @example
 * isCPFOrCNPJValid("123.456.789-09"); // true (CPF formatado)
 * isCPFOrCNPJValid("12.345.678/9012-34"); // true (CNPJ formatado)
 * isCPFOrCNPJValid("12345678909"); // false (CPF sem formatação)
 * isCPFOrCNPJValid("12.345.678/9012"); // false (CNPJ incompleto)
 * isCPFOrCNPJValid("abcde"); // false (não é um CPF ou CNPJ válido)
 */

export function isCPFOrCNPJValid(value: string): boolean {
    if (value.length === 14 || value.length === 18) {
        return true;
    }

    return false;
}
