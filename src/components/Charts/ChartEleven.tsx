import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

interface ChartElevenState {
  series: {
    name: string;
    data: number[];
  }[];
}

interface ChartElevenProps {
  returnRate: number;
}

const ChartEleven: React.FC<ChartElevenProps> = ({
  returnRate: returnRateValue,
}) => {
  const [state, setState] = useState<ChartElevenState>({
    series: [
      {
        name: "New Sales",
        data:
          returnRateValue >= 0
            ? [151, 252]
            : [300, 350],
      },
    ],
  });

  // Update the state
  const updateState = () => {
    setState((prevState) => ({
      ...prevState,
      // Update the desired properties
    }));
  };
  updateState;

  const options: ApexOptions = {
    colors: [returnRateValue >= 0 ? "#10B981" : "#FB5454"],
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
        stops: [0, 100],
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
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-12-25T01:30:00.000Z",

      ],
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
          series={state.series}
          type="area"
          height={70}
        />
      </div>
    </div>
  );
};

export default ChartEleven;
