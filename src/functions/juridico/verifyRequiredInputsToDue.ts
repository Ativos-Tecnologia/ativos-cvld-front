import { NotionPage } from "@/interfaces/INotion";

/**
 * Verifica se todos os inputs necessários para gerar um extrato de
 * prazo estão preenchidos.
 *
 * @param {NotionPage} mainData
 * @param {NotionPage} secondaryData
 * @returns {boolean}
 */
const verifyRequiredInputsToDue = (mainData: NotionPage | undefined, secondaryData: NotionPage | undefined): boolean => {

    if (!mainData || !secondaryData) return false;

    const t = secondaryData.properties["Estado Civil"].select?.name &&
    mainData.properties["Cálculo Revisado"].checkbox &&
    mainData.properties["Espelho do ofício"].checkbox &&
    mainData.properties["Esfera"].select?.name === "FEDERAL" ? true : mainData.properties["Estoque de Precatórios Baixado"].checkbox

    return Boolean(t)

    // if (
    //     mainData.properties["Certidões emitidas"].checkbox &&
    //     mainData.properties["Possui processos?"].checkbox &&
    //     secondaryData.properties["Estado Civil"].select?.name &&
    //     mainData.properties["Cálculo Revisado"].checkbox &&
    //     mainData.properties["Espelho do ofício"].checkbox &&
    //     mainData.properties["Estoque de Precatórios Baixado"].checkbox
    // ) {
    //     return true;
    // } else {
    //     return false;
    // }
}

export default verifyRequiredInputsToDue;
