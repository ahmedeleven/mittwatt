import { useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";

const PastAveragePrices = () => {
  const today = useMemo(() => new Date(), []);

  const weekAgo = useMemo(
    () => new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
    [today],
  );

  const monthAgo = useMemo(
    () => new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
    [today],
  );

  const yearAgo = useMemo(
    () => new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000),
    [today],
  );

  const [weekAveragePrice, setWeekAveragePrice] = useState<number | null>(null);
  const [monthAveragePrice, setMonthAveragePrice] = useState<number | null>(
    null,
  );
  const [yearAveragePrice, setYearAveragePrice] = useState<number | null>(null);

  const {
    data: weekAverageData,
    error: weekAveragePriceError,
    isLoading: weekAveragePriceIsLoading,
  } = api.price.getHistoryPeriodTotalAverage.useQuery({
    startDate: weekAgo,
    endDate: today,
  });

  const {
    data: monthAverageData,
    error: monthAveragePriceError,
    isLoading: monthAveragePriceIsLoading,
  } = api.price.getHistoryPeriodTotalAverage.useQuery({
    startDate: monthAgo,
    endDate: today,
  });

  const {
    data: yearAverageData,
    error: yearAveragePriceError,
    isLoading: yearAveragePriceIsLoading,
  } = api.price.getHistoryPeriodTotalAverage.useQuery({
    startDate: yearAgo,
    endDate: today,
  });

  useEffect(() => {
    if (weekAverageData) {
      setWeekAveragePrice(weekAverageData.averagePrice);
      //console.log(weekAverageData.averagePrice);
    }
    if (monthAverageData) {
      setMonthAveragePrice(monthAverageData.averagePrice);
      //console.log(monthAverageData);
    }
    if (yearAverageData) {
      setYearAveragePrice(yearAverageData.averagePrice);
      //console.log(yearAverageData);
    }
  }, [weekAverageData, monthAverageData, yearAverageData]);

  if (
    weekAveragePriceIsLoading ||
    monthAveragePriceIsLoading ||
    yearAveragePriceIsLoading
  ) {
    return (
      <>
        <div className=" inline h-8 w-8 text-gray-200">
          <span className="loader inline h-8 w-8 text-gray-200"></span>
        </div>
      </>
    );
  }

  const errorMessage =
    weekAveragePriceError?.message ??
    monthAveragePriceError?.message ??
    yearAveragePriceError?.message;

  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  return (
    <div className="flex w-full items-center justify-center pl-32 pr-32 pt-10 text-black">
      <table className="min-w-full table-auto border-collapse border border-gray-500 px-10">
        <thead>
          <tr className="bg-green-600 text-white">
            <th className="border border-gray-500 px-4 py-2">7 Days Average</th>
            <th className="border border-gray-500 px-4 py-2">
              30 Days Average
            </th>
            <th className="border border-gray-500 px-4 py-2">
              12 Months Average
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="border border-gray-500 px-4 py-2">
              {weekAveragePrice
                ? weekAveragePrice?.toFixed(2) + " c/kWh"
                : "undefined"}
            </td>
            <td className="border border-gray-500 px-4 py-2">
              {monthAveragePrice
                ? monthAveragePrice?.toFixed(2) + " c/kWh"
                : "undefined"}
            </td>
            <td className="border border-gray-500 px-4 py-2">
              {yearAveragePrice
                ? yearAveragePrice?.toFixed(2) + " c/kWh"
                : "undefined"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PastAveragePrices;
