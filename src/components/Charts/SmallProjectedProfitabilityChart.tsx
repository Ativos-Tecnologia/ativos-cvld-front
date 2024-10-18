import { calculateProjectedValue, CDIProjection } from "@/functions/marketplace/cdiProjection";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

interface SmallProjectedProfitabilityChartState {
  series: {
    name: string;
    data: number[];
  }[];
}

interface SmallProjectedProfitabilityChartProps {
  updateValue: number;
  projectedValue: number;
  updateDate: string;
  projectedDate: string;
  monthsToPayment: number;
  investedValue: number;
  rentabilityPerYer: number;
}

const SmallProjectedProfitabilityChart: React.FC<SmallProjectedProfitabilityChartProps> = ({
  updateValue = 0,
  projectedValue = 0,
  updateDate = "",
  projectedDate = "",
  monthsToPayment = 0,
  investedValue = 0,
  rentabilityPerYer = 0,
}) => {
  const projection: CDIProjection = {
    currentValue: Number(investedValue),
    cdiRate: 11.75,
    timePeriodInMonths: monthsToPayment,
  };

  const cdiProjectedValueArray = [investedValue, calculateProjectedValue(projection)];

  const [chart] = Array<SmallProjectedProfitabilityChartState>({
    series: [
      {
        name: "Projeção de Lucro",
        data: [updateValue, projectedValue]
      },
      {
        name: "Projeção CDI",
        data: cdiProjectedValueArray,
      },
    ],
  });

  const dateArray = [new Date(updateDate).getTime(), new Date(projectedDate).getTime()];

  const options: ApexOptions = {
    colors: [rentabilityPerYer > 20 ? "#10B981" : "#FFDE59", "#3056D3"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 70,
      type: "area",
      parentHeightOffset: 0,

      toolbar: {
        show: false,
      },
    },
    grid: {
      show: false,
    },
    fill: {
      gradient: {
        stops: [50, 100],
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    xaxis: {
      type: "datetime",
      categories: dateArray,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
  };

  return (
    <div className="relative h-7.5 w-full max-w-25">
      <div className="chartEleven chartEleven-01 absolute right-0 top-1/2 -ml-5 -translate-y-1/2">
        <ReactApexChart
          options={options}
          series={chart.series}
          type="area"
          height={70}
        />
      </div>
    </div>
  );
};

export default SmallProjectedProfitabilityChart;
