import { useState } from "react";
import Historical from "~/components/Historical";

export default function Current() {
  const [dayValue, setDayValue] = useState(new Date());

  return (
    <div className="container text-black">
      {" "}
      <div className="w-full pb-6 pt-6 text-center text-4xl font-bold">
        Current Prices
      </div>
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-center">
          <div className="flex items-center space-x-4">
            <a
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors ease-in-out hover:bg-green-100 hover:text-green-800"
              href="#"
              onClick={() =>
                setDayValue(
                  new Date(new Date().setDate(new Date().getDate() - 1)),
                )
              }
            >
              Yesterday
            </a>
            <a
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors ease-in-out hover:bg-green-100 hover:text-green-800"
              href="#"
              onClick={() => setDayValue(new Date())}
            >
              Today
            </a>
            <a
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors ease-in-out hover:bg-green-100 hover:text-green-800"
              href="#"
              onClick={() =>
                setDayValue(
                  new Date(new Date().setDate(new Date().getDate() + 1)),
                )
              }
            >
              Tomorrow
            </a>
          </div>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center gap-4">
        <Historical dayProp={dayValue} />
      </div>
    </div>
  );
}
