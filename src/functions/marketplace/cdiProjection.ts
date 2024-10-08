export interface CDIProjection {
    currentValue: number;
    cdiRate: number;
    timePeriodInMonths: number;
  }

  export function calculateProjectedValue(projection: CDIProjection): number {

    const { currentValue, cdiRate, timePeriodInMonths } = projection;

    const monthsPerYear = 12;
    const projectedValue = currentValue * Math.pow((1 + (cdiRate / 100) / monthsPerYear), timePeriodInMonths);
    return projectedValue;
  }
