import { useMemo } from "react";
import { api } from "~/utils/api";
import DailyAveragePricesForTwoWeeks from "~/components/DailyAveragePricesForTwoWeeks";

export default function Future() {
  const startDate = useMemo(() => new Date(), []);
  const endDate = useMemo(
    () => new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
    [],
  );
  const { data, error, isLoading } =
    api.price.getForecastPeriodDailyAverage.useQuery({
      startDate: startDate,
      endDate: endDate,
    });

  if (isLoading) {
    return (
      <>
        <div className=" inline h-8 w-8 text-gray-200">
          <span className="loader inline h-8 w-8 text-gray-200"></span>
        </div>
      </>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container flex flex-col items-center justify-center gap-4 text-black">
      <div className="w-full pb-6 pt-6 text-center text-4xl font-bold">
        Future Prices
      </div>

      <DailyAveragePricesForTwoWeeks
        startDate={startDate}
        endDate={endDate}
        data={data}
      />
    </div>
  );
}
