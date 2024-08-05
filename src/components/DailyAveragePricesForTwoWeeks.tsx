import DailyAverageLineChart from "./DailyAverageLineChart";
import { useMemo } from "react";

interface DailyAveragePricesForTwoWeeksProps {
  startDate: Date;
  endDate: Date;
  data:
    | ({ date: string; price: number } | { date: string; price: null })[]
    | undefined;
}

interface dataItem {
  date: string;
  price: number | null;
}

const DailyAveragePricesForTwoWeeks: React.FC<
  DailyAveragePricesForTwoWeeksProps
> = ({ startDate, endDate, data }) => {
  const maxPrice: number | undefined = useMemo(() => {
    return data?.reduce(
      (maxValue: number, item: dataItem) => Math.max(maxValue, item.price ?? 0),
      0,
    );
  }, [data]);

  const minPrice: number | undefined = useMemo(() => {
    return data?.reduce(
      (minValue: number, item: dataItem) =>
        Math.min(minValue, item.price ?? Infinity),
      Infinity,
    );
  }, [data]);

  return (
    <>
      <div className="flex w-full items-center justify-center pt-20 text-center text-2xl  text-black">
        Average price from{" "}
        <span className="mx-2 text-green-800">
          {" "}
          {startDate.toDateString()}{" "}
        </span>{" "}
        to{" "}
        <span className="mx-2 text-green-800"> {endDate.toDateString()} </span>
      </div>
      <DailyAverageLineChart data={data} formatterType={"day"} />
      <div className="flex w-full items-center justify-center pl-32 pr-32 pt-10 text-black">
        <table className="min-w-full table-auto border-collapse border border-gray-500 px-10">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="border border-gray-500 px-4 py-2 ">Date</th>
              <th className="border border-gray-500 px-4 py-2 ">
                Average Price
              </th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item: dataItem, index: number) => (
                <tr
                  key={index}
                  className={` ${item.price?.toFixed(2) === maxPrice?.toFixed(2) ? "bg-green-50 text-red-600" : ""} ${item.price?.toFixed(2) === minPrice?.toFixed(2) ? "bg-green-50 text-green-600" : ""} bg-green-50 text-black`}
                >
                  <td className="border border-gray-500 px-4 py-2 text-center">
                    {item.date}
                  </td>
                  <td className="border border-gray-500 px-4 py-2 text-center">
                    {item.price?.toFixed(2) + " c/kWh"}
                  </td>
                </tr>
              ))
            ) : (
              <td colSpan={3} className="border border-gray-500 px-4 py-2">
                No data available
              </td>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DailyAveragePricesForTwoWeeks;
