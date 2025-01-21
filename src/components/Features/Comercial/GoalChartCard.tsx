import { GoalChart } from '@/components/Charts/GoalChart';

type Result = {
    id: string;
    credor: string;
    usuario: string;
    meta_1: number;
    meta_2: number;
    meta_3: number;
    precatorio_fechado_em: string;
};

type GroupedResults = {
    [usuario: string]: Result[];
};

interface GoalChartCardProps {
    results: Result[];
}

export function GoalChartCard({ results }: GoalChartCardProps) {
    function groupByUsuario(results: Result[]) {
        return results.reduce((acc, result) => {
            const { usuario } = result;
            if (!acc[usuario]) {
                acc[usuario] = [];
            }
            acc[usuario].push(result);
            return acc;
        }, {} as GroupedResults);
    }

    const generateColor = (index: number) => {
        const hue = (index * 137) % 360;
        return `hsl(${hue}, 70%, 45%)`;
    };

    function groupChartDataByGoal(
        groupedResults: GroupedResults,
        goal: 'meta_1' | 'meta_2' | 'meta_3',
    ) {
        return Object.entries(groupedResults).map(([usuario, results], index) => {
            const total = Number(results.reduce((sum, item) => sum + item[goal], 0).toFixed(2));
            return {
                usuario,
                total,
                fill: generateColor(index),
            };
        });
    }

    const groupedResults = groupByUsuario(results);

    const meta1Data = groupChartDataByGoal(groupedResults, 'meta_1');
    const meta2Data = groupChartDataByGoal(groupedResults, 'meta_2');
    const meta3Data = groupChartDataByGoal(groupedResults, 'meta_3');

    return (
        <section className="flex w-full flex-col justify-between gap-2 rounded-md bg-white py-2 pl-4 dark:bg-boxdark lg:flex-row">
            <GoalChart footerText={'Cenário 1'} chartData={meta1Data} />
            <GoalChart footerText={'Cenário 2'} chartData={meta2Data} />
            <GoalChart footerText={'Cenário 3'} chartData={meta3Data} />
        </section>
    );
}
