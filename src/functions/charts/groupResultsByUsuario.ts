import { Result } from '@/components/Features/Comercial/GoalChartCard';

export type GroupedResults = {
    [usuario: string]: Result[];
};

export function groupResultsByUsuario(results: Result[]) {
    return results.reduce((acc, result) => {
        const { usuario } = result;
        if (!acc[usuario]) {
            acc[usuario] = [];
        }
        acc[usuario].push(result);
        return acc;
    }, {} as GroupedResults);
}
