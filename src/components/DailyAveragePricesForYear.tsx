import DailyAverageLineChart from "./DailyAverageLineChart";

interface DailyAveragePricesForYearProps {
  startDate: Date;
  endDate: Date;
  data:
    | ({ date: string; price: number } | { date: string; price: null })[]
    | undefined;
}

const DailyAveragePricesForYear: React.FC<DailyAveragePricesForYearProps> = ({
  startDate,
  endDate,
  data,
}) => {
  return (
    <>
      <div className="flex w-full items-center justify-center pt-20 text-center text-2xl text-black">
        Average price from
        <span className="mx-2 text-green-800">
          {" "}
          {startDate.toDateString()}{" "}
        </span>
        to
        <span className="mx-2 text-green-800"> {endDate.toDateString()} </span>
      </div>
      <DailyAverageLineChart data={data} formatterType={"year"} />
    </>
  );
};

export default DailyAveragePricesForYear;
