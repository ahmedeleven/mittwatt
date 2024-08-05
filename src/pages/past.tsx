import { useMemo } from "react";
import { api } from "~/utils/api";
import DailyAveragePricesForTwoWeeks from "~/components/DailyAveragePricesForTwoWeeks";
import DailyAveragePricesForYear from "~/components/DailyAveragePricesForYear";
import PastAveragePrices from "~/components/PastAveragePrices";

export default function Past() {
  // The date two weeks ago
  const startDate = useMemo(
    () => new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    [],
  );

  // The date two days ago
  const endDate = useMemo(
    () => new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    [],
  );

  // The first day of the same current month but for last year
  const startYearDate = useMemo(() => {
    const prevYear = new Date().getFullYear() - 1;
    return new Date(prevYear, new Date().getMonth(), 1);
  }, []);

  // The last day of the previous month
  const endYearDate = useMemo(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    [],
  );

  const { data, error, isLoading } =
    api.price.getHistoryPeriodDailyAverage.useQuery({
      startDate: startDate,
      endDate: endDate,
    });

  const {
    data: yearData,
    error: yearError,
    isLoading: yearIsLoading,
  } = api.price.getHistoryPeriodDailyAverage.useQuery({
    startDate: startYearDate,
    endDate: endYearDate,
  });

  if (isLoading ?? yearIsLoading) {
    return (
      <>
        <div className=" inline h-8 w-8 text-gray-200">
          <span className="loader inline h-8 w-8 text-gray-200"></span>
        </div>
      </>
    );
  }

  if (error ?? yearError) {
    return <div>Error: {error ?? yearError}</div>;
  }

  return (
    <div className="container flex flex-col items-center justify-center gap-4 text-black">
      <div className="w-full pb-6 pt-6 text-center text-4xl font-bold">
        Past Prices
      </div>
      <PastAveragePrices />
      <DailyAveragePricesForTwoWeeks
        startDate={startDate}
        endDate={endDate}
        data={data}
      />
      <DailyAveragePricesForYear
        startDate={startYearDate}
        endDate={endYearDate}
        data={yearData}
      />
    </div>
  );
}
