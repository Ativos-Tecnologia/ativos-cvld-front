import { NextResponse } from 'next/server';
import { extractPrecatorioData } from '@/lib/claude/client';
import { ExtractionResponse } from '@/types/precatorio';

export async function POST(request: Request) {
    try {
        const { pdfBase64 } = await request.json();

        if (!pdfBase64) {
            return NextResponse.json(
                { success: false, error: 'Nenhum arquivo PDF fornecido' },
                { status: 400 },
            );
        }

        const data = await extractPrecatorioData(pdfBase64);

        const response: ExtractionResponse = {
            success: true,
            data,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Erro de extração:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Erro ao extrair dados',
            },
            { status: 500 },
        );
    }
}
