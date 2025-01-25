import { UserVsStatusChartProps } from "@/types/userVsStatusChart";

export interface InputData {
    user: string;
    counter: {
        [key: string]: {
            counter: number;
            total: number;
        };
    };
}

export function transformChartData(inputData: InputData[]) {
    return inputData.map((item) => {
        const result: UserVsStatusChartProps = { user: item.user };
        Object.entries(item.counter).forEach(([status, data]) => {
            result[`${status}_counter`] = data.counter;
            result[status] = Number(data.total.toFixed(2));
        });
        return result as UserVsStatusChartProps;
    });
}
