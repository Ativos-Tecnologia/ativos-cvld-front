"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import RentabilityChart from "@/components/Charts/RentabilityChart";
import ProfitChart from "@/components/Charts/ProfitBarChart";
import DistributionChart from "@/components/Charts/ChartThree";

const BasicChart: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Basic Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <RentabilityChart />
        <ProfitChart />
        <DistributionChart title="Chart Three" />
      </div>
    </>
  );
};

export default BasicChart;
