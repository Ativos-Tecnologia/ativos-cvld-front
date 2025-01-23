import { GoalChart } from '@/components/Charts/GoalChart';
import GoalChartSkeleton from '@/components/Skeletons/GoalChartSkeleton';

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
    if (!results || results.length === 0) {
        return <GoalChartSkeleton />;
    }

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

    function generateColor(color: 'red' | 'yellow' | 'green', index: number, steps: number) {
        const baseHues = {
            red: 0,
            yellow: 60,
            green: 120,
        };

        const baseHue = baseHues[color];
        const saturation = 70;

        const minLightness = 25;
        const maxLightness = 55;
        const stepSize = (maxLightness - minLightness) / (steps - 1);

        const lightness = maxLightness - index * stepSize;

        return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    }

    function groupChartDataByGoal(
        groupedResults: GroupedResults,
        goal: 'meta_1' | 'meta_2' | 'meta_3',
        color: 'red' | 'yellow' | 'green',
    ) {
        const chartData = Object.entries(groupedResults).map(([usuario, results]) => {
            const total = Number(results.reduce((sum, item) => sum + item[goal], 0).toFixed(2));
            return { usuario, total };
        });

        chartData.sort((a, b) => b.total - a.total);

        return chartData.map((data, index) => ({
            ...data,
            fill: generateColor(color, index, chartData.length),
        }));
    }

    const groupedResults = groupByUsuario(results);

    const meta1Data = groupChartDataByGoal(groupedResults, 'meta_1', 'red');
    const meta2Data = groupChartDataByGoal(groupedResults, 'meta_2', 'yellow');
    const meta3Data = groupChartDataByGoal(groupedResults, 'meta_3', 'green');

    return (
        <section className="flex min-h-fit w-full flex-col justify-between gap-2 rounded-md bg-white py-2 pl-4 dark:bg-boxdark lg:flex-row">
            {meta1Data && meta2Data && meta3Data && (
                <>
                    <GoalChart footerText={'META ATÉ 2.5MM'} chartData={meta1Data} />
                    <GoalChart footerText={'META 2.5MM ATÉ 3.75MM'} chartData={meta2Data} />
                    <GoalChart footerText={'META ACIMA DE 3.75MM'} chartData={meta3Data} />
                </>
            )}
        </section>
    );
}
