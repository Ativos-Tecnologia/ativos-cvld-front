import { GoalChart } from '@/components/Charts/GoalChart';
import GoalChartSkeleton from '@/components/Skeletons/GoalChartSkeleton';
import { generateColor } from '@/functions/charts/generateColor';
import { GroupedResults, groupResultsByUsuario } from '@/functions/charts/groupResultsByUsuario';

export type Result = {
    id: string;
    credor: string;
    usuario: string;
    meta_1: number;
    meta_2: number;
    meta_3: number;
    valor_liquido_disponivel: number;
    precatorio_fechado_em: string;
};

interface GoalChartCardProps {
    results: Result[];
}

export function GoalChartCard({ results }: GoalChartCardProps) {
    if (!results || results.length === 0) {
        return <GoalChartSkeleton />;
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

    const groupedResults = groupResultsByUsuario(results);

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
