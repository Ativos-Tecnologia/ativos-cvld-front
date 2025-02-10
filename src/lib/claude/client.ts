import { IClaudeRequest } from '@/interfaces/IClaudeRequest';
import { PrecatorioData } from '@/types/precatorio';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-3-5-sonnet-20241022';

const EXTRACTION_PROMPT = `You are a specialized data extraction assistant focused on analyzing Brazilian Precatórios (court payment orders) documents, including both Federal and State courts. You will be provided with a PDF document, and your task is to extract specific information and return it in a structured JSON format.

IMPORTANT GUIDELINES:

1. Document Type Identification:
   - For Federal courts: Look for "TRIBUNAL REGIONAL FEDERAL" or "TRF" followed by region number
   - For State courts: Look for "Tribunal de Justiça" or "TJ" followed by state abbreviations (SP, PE, RJ, ES, MG, GO, etc.)
   - Identify sphere (FEDERAL/ESTADUAL) based on these patterns
   - If present

2. Base Date Standardization Rule:
   - For State courts: Always set the day to "01" while preserving the actual month and year
   - For Federal courts: Use the exact date as shown
   - All dates must be in ISO format (YYYY-MM-DD)

3. Handle Special Value Cases:
   - For documents with "Honorários Contratuais" (lawyer fees):
     - Only consider "Principal" and "Juros" for the beneficiary
     - Ignore "Total deste Requerente" when lawyer fees are present
   - For Labor Court (TRT) documents:
     - Sum "INSS" and "FGTS" values to create the PSS value
   - For Federal courts:
     - Extract PSS value directly when present

4. Request Date Extraction:
   - For TJPE (Pernambuco): Look for "Data de Requisição" in document footnotes
   - For Federal courts: Look for "Data de Expedição" or "Data-Base"
   - For other state courts: Extract from the standard location in document header

5. Process Information:
    - Sometimes the nature of the process is available. For example, "Tributário:Sim" or "O valor solicitado é tributário e deverá ser atualizado pelo índice SELIC? Sim". In these cases, extract the nature of the process as "TRIBUTÁRIA". Otherwise, set it to "NÃO TRIBUTÁRIA". Only these two values are allowed. If the nature found is not one of the two allowed values or if it's not found, set it "NÃO TRIBUTÁRIA".

DOCUMENT TYPE IDENTIFICATION:

Federal Documents:
Type 1 (TRF1):
- Has "TRIBUNAL REGIONAL FEDERAL DA 1ª REGIÃO" identifier
- Information spread across multiple pages
- Data de Expedição and Data Base in separate sections

Type 2 (TRF2/TRF4):
- Check for "Rio de Janeiro" to distinguish between TRF2 and TRF4
- More compact layout
- Data-Base and Data de Expedição usually close together

Type 3 (TRF3):
- Has "TRIBUNAL REGIONAL FEDERAL DA 3ª REGIÃO" identifier
- Data de Requisição appears twice
- Distinct layout for financial information
- When "Tipo de Requerente" is present and "sem referência a honorários contratuais" is mentioned, the type_of_requester is "Principal"
- When "Tipo de Procedimento" is present, extract to proceding_type. Only the type should be extracted. For example, "Precatório... whatever" should be extracted as "PRECATÓRIO".

State Documents:
Type 4 (TJSP - São Paulo):
- Contains "Tribunal de Justiça do Estado de São Paulo"
- Watch for "Honorários Contratuais" section
- "Total deste Requerente" should be ignored when calculating total_value
- Look for clear Principal and Juros sections

Type 5 (TJPE - Pernambuco):
- Contains "Tribunal de Justiça do Estado de Pernambuco"
- Request date is in document footnotes
- Look for lawsuit number near the top
- Ente Devedor clearly marked

Type 6 (Labor Courts - TRT):
- Contains "Tribunal Regional do Trabalho"
- Special PSS calculation: PSS = INSS + FGTS
- Look for specialized labor court divisions

EXTRACTION RULES:

1. Court Information:
   - For Federal courts: Extract sphere, TRF region, and division
   - For State courts: Extract full court name, including state specification
   - Always include complete court division name
   - For State courts: Include "ente_devedor" when present
   - When the nature of the process is available, it will be referenced. For example, "Tributário:Sim" or "O valor solicitado é tributário e deverá ser atualizado pelo índice SELIC? Sim". In these cases, extract the nature of the process as "TRIBUTÁRIA". Otherwise, set it to "NÃO TRIBUTÁRIA". Only these two values are allowed. If the nature is not present, set it to null. Or if the nature found is not one of the two allowed values, set it "NÃO TRIBUTÁRIA".

2. Financial Values:
   - Remove currency symbols (R$)
   - Convert comma-separated decimals to periods
   - Remove thousand separators
   - For lawyer fee cases:
     * Only include beneficiary's principal and interest
     * Exclude "Total deste Requerente" when lawyer fees present
   - Convert all values to numbers

3. Dates:
   - State courts: Set base_date to first day of the month
   - Federal courts: Use exact dates as shown
   - Convert all dates to ISO format (YYYY-MM-DD)
   - Prioritize Data-Base for Federal courts

4. Document Numbers (CPF/CNPJ):
   - Keep all digits
   - Remove separators and special characters
   - Validate format (11 digits for CPF, 14 for CNPJ)

5. RRA Information:
   - If RRA is mentioned, set "present": true
   - Extract number of months when available
   - If not found, set "present": false and "number_of_months": null

    


Analyze the provided PDF and return ONLY a JSON object with the extracted data following this exact schema:

{
    "court_info": {
        "sphere": "FEDERAL" | "ESTADUAL",
        "trf_region": string | null,     // "TRF1", "TRF2", "TRF3", "TRF4" or null for state courts
        "court_division": string,        // e.g., "7ª VARA FEDERAL" or "2ª VARA CÍVEL"
        "tribunal": string | null,       // Full state court name, null for federal courts
        "ente_devedor": string | null    // Debtor entity, null for federal courts
    },
    "financial_data": {
        "principal_value": number,
        "interest_value": number,
        "pss_value": number | null,
        "total_value": number
    },
    "dates": {
        "base_date": string,            // ISO format
        "request_date": string          // ISO format
    },
    "beneficiary": {
        "name": string,
        "document_number": string       // CPF/CNPJ
    },
    "process": {
        "lawsuit_number": string,
        "nature": string | null,
        "type_of_requester": string | null,
        "proceding_type": string | null
    },
    "rra_data": {
        "present": boolean,
        "number_of_months": number | null
    }
}

Return ONLY the JSON object, no additional text or explanations.`;

interface ClaudeResponse {
    id: string;
    type: string;
    role: string;
    content: Array<{
        type: string;
        text: string;
    }>;
    model: string;
    stop_reason: string;
    stop_sequence?: string | null;
    usage: {
        input_tokens: number;
        output_tokens: number;
    };
}

interface ValidationStep {
    name: string;
    validate: () => boolean;
}

const TASK_PREC_EXTRACTION = 'Precatório Extraction';

function logStep(task: string, step: string, details?: Record<string, unknown>): void {
    console.log(`[${task}] ${step}`, details ? details : '');
}

function logError(step: string, error: Error | null, details?: Record<string, unknown>): void {
    console.error(`[Precatório Extraction Error] ${step}:`, error, details ? { details } : '');
}

export async function extractPrecatorioData(pdfBase64: string): Promise<PrecatorioData> {
    try {
        const startTime = Date.now();
        logStep(TASK_PREC_EXTRACTION, 'Starting extraction process');

        if (!process.env.ANTHROPIC_API_KEY) {
            throw new Error('ANTHROPIC_API_KEY is not set');
        }

        const requestBody: IClaudeRequest = {
            model: MODEL,
            max_tokens: 1024,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'document',
                            source: {
                                type: 'base64',
                                media_type: 'application/pdf',
                                data: pdfBase64,
                            },
                        },
                        {
                            type: 'text',
                            text: EXTRACTION_PROMPT,
                        },
                    ],
                },
            ],
        };

        logStep(TASK_PREC_EXTRACTION, 'Making API request to Claude');
        const response = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            logError('API Response Error', new Error(`${response.status} ${response.statusText}`), {
                error: errorText,
            });
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        logStep(TASK_PREC_EXTRACTION, 'Parsing API response');
        const result = (await response.json()) as ClaudeResponse;
        logStep(TASK_PREC_EXTRACTION, 'API Response received', {
            status: 'success',
            messageId: result.id,
            model: result.model,
            stopReason: result.stop_reason,
            usage: result.usage,
        });

        // Validate response structure
        if (!result.content?.[0]?.text) {
            logError('Invalid Response Structure', null, {
                response: JSON.stringify(result, null, 2),
            });
            throw new Error('Invalid response structure from Claude');
        }

        // Extract content based on response structure
        const content = result.content[0].text;

        logStep(TASK_PREC_EXTRACTION, 'Content extracted', {
            contentLength: content.length,
            preview: content.substring(0, 100) + '...',
        });

        // Try to clean the response if it contains any markdown or extra text
        logStep(TASK_PREC_EXTRACTION, 'Cleaning JSON response');
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;

        // Remove escaped quotes and newlines that Claude might add
        const cleanedJsonString = jsonString
            .replace(/\\"/g, '"')
            .replace(/\\n/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        logStep(TASK_PREC_EXTRACTION, 'JSON cleaned', {
            originalLength: content.length,
            cleanedLength: cleanedJsonString.length,
            matched: !!jsonMatch,
            sample: cleanedJsonString.substring(0, 100) + '...',
        });

        try {
            logStep(TASK_PREC_EXTRACTION, 'Parsing JSON');
            const parsedData = JSON.parse(cleanedJsonString) as unknown;
            logStep(TASK_PREC_EXTRACTION, 'JSON parsed successfully', {
                hasCourtInfo: !!(parsedData as PrecatorioData).court_info,
                hasFinancialData: !!(parsedData as PrecatorioData).financial_data,
                hasDates: !!(parsedData as PrecatorioData).dates,
                hasBeneficiary: !!(parsedData as PrecatorioData).beneficiary,
                hasProcess: !!(parsedData as PrecatorioData).process,
                hasRraData: !!(parsedData as PrecatorioData).rra_data,
            });

            logStep(TASK_PREC_EXTRACTION, 'Validating data structure');
            if (!validatePrecatorioData(parsedData)) {
                logError('Data Validation Failed', null, { parsedData });
                throw new Error('Invalid data structure in response');
            }
            logStep(TASK_PREC_EXTRACTION, 'Data validation successful');

            const endTime = Date.now();
            logStep(TASK_PREC_EXTRACTION, 'Extraction completed', {
                processingTimeMs: endTime - startTime,
                messageId: result.id,
            });

            return parsedData;
        } catch (parseError) {
            const error = parseError instanceof Error ? parseError : new Error(String(parseError));
            logError('JSON Parse Error', error, {
                content,
                cleanedJsonString,
            });
            throw new Error("Failed to parse JSON from Claude's response");
        }
    } catch (error) {
        const typedError = error instanceof Error ? error : new Error(String(error));
        logError('Extraction Process Error', typedError);
        throw typedError;
    }
}

function validatePrecatorioData(data: unknown): data is PrecatorioData {
    const validationSteps: ValidationStep[] = [
        {
            name: 'Basic structure',
            validate: () => data !== null && typeof data === 'object',
        },
        {
            name: 'Court info',
            validate: () => {
                const typedData = data as Partial<PrecatorioData>;
                if (!typedData.court_info?.sphere || !typedData.court_info?.court_division)
                    return false;
                return ['FEDERAL', 'ESTADUAL', 'MUNICIPAL'].includes(typedData.court_info.sphere);
            },
        },
        {
            name: 'Financial data',
            validate: () => {
                const typedData = data as Partial<PrecatorioData>;
                return !!(
                    typedData.financial_data &&
                    typeof typedData.financial_data.principal_value === 'number' &&
                    typeof typedData.financial_data.interest_value === 'number' &&
                    typeof typedData.financial_data.total_value === 'number'
                );
            },
        },
        {
            name: 'Dates',
            validate: () => {
                const typedData = data as Partial<PrecatorioData>;
                if (!typedData.dates?.base_date || !typedData.dates?.request_date) return false;
                try {
                    new Date(typedData.dates.base_date);
                    new Date(typedData.dates.request_date);
                    return true;
                } catch {
                    return false;
                }
            },
        },
        {
            name: 'Beneficiary',
            validate: () => {
                const typedData = data as Partial<PrecatorioData>;
                return !!(typedData.beneficiary?.name && typedData.beneficiary?.document_number);
            },
        },
        {
            name: 'Process',
            validate: () => {
                const typedData = data as Partial<PrecatorioData>;
                return !!typedData.process?.lawsuit_number;
            },
        },
        {
            name: 'RRA data',
            validate: () => {
                const typedData = data as Partial<PrecatorioData>;
                if (typeof typedData.rra_data?.present !== 'boolean') return false;
                if (
                    typedData.rra_data.present &&
                    typedData.rra_data.number_of_months !== null &&
                    typeof typedData.rra_data.number_of_months !== 'number'
                )
                    return false;
                return true;
            },
        },
    ];

    try {
        for (const step of validationSteps) {
            logStep(TASK_PREC_EXTRACTION, `Validating ${step.name}`);
            if (!step.validate()) {
                const typedData = data as Partial<PrecatorioData>;
                const relevantData =
                    typedData[step.name.toLowerCase().replace(' ', '_') as keyof PrecatorioData];
                logError(`Validation Failed: ${step.name}`, null, {
                    relevantData: JSON.stringify(relevantData, null, 2),
                });
                return false;
            }
            logStep(TASK_PREC_EXTRACTION, `${step.name} validation passed`);
        }

        logStep(TASK_PREC_EXTRACTION, 'All validations passed');
        return true;
    } catch (error) {
        const typedError = error instanceof Error ? error : new Error(String(error));
        logError('Validation Error', typedError);
        return false;
    }
}
