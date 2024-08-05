import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
} from "recharts";

interface DailyAverageLineChartProps {
  data:
    | ({ date: string; price: number } | { date: string; price: null })[]
    | undefined;
  formatterType: string | null;
}

interface ChartProps {
  payload?: { price?: number };
}

const DailyAverageLineChart: React.FC<DailyAverageLineChartProps> = ({
  data,
  formatterType,
}) => {
  const tickFormatter = (value: string) => {
    const [day, month, year] = value.split(".");

    return `${day}.${month}.${year}`;
  };

  const tickFormatterYear = (value: string) => {
    const [day, month, year] = value.split(".");
    if (day === "1") {
      return `${day}.${month}.${year}`;
    }
    return "";
  };

  return (
    <>
      <div className="h-full w-full px-10">
        <ResponsiveContainer height={500}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, bottom: 100, left: 10 }}
          >
            <Line type="monotone" dataKey="price" stroke="#16A34A" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis
              dataKey="date"
              tickFormatter={
                formatterType == "year" ? tickFormatterYear : tickFormatter
              }
              angle={-90}
              textAnchor="end"
              interval={0}
            >
              <Label value="Date" offset={60} position="bottom" />
            </XAxis>
            <YAxis tickCount={10}>
              <Label
                value="Price c/kWh"
                offset={5}
                position="left"
                angle={-90}
              />
            </YAxis>
            <Tooltip
              formatter={(value, name, props: ChartProps) => [
                `Price: ${value !== null ? props.payload?.price?.toFixed(2) + " c/kWh" : "N/A"}`,
              ]}
              labelFormatter={(label) => `Date: ${label}`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default DailyAverageLineChart;
