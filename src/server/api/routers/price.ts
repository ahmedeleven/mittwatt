import { z } from "zod";
import type { PrismaClient } from "@prisma/client";
import {
  createTRPCRouter,
  publicProcedure,
  TRPCError,
} from "~/server/api/trpc";



interface Context {
  db: PrismaClient;
}

interface HistoryItem {
  dateId: number | null;
  price: number | null;
  dateData: {
    dateValue: Date;
  }
}

type CalendarDate = {
  id: number;
};

interface AveragePriceResult {
  _avg: {
    price: number | null;
  };
}

// function to get the IDs for a given day
async function dateIdsForDay(ctx: Context, year: number, month: number, day: number): Promise<number[]> {
  const dateRecords: CalendarDate[] = await ctx.db.calendarDate.findMany({
    select: {
      id: true,
    },
    where: {
      day: day,
      month: month,
      year: year,
    }
  });

  return dateRecords.map((record: CalendarDate) => record.id);
}


// function to get hourly prices for a specific day
async function HistoryDayResults(ctx: Context, year: number, month: number, day: number) {
  const dateIds = await dateIdsForDay(ctx, year, month, day);
  const historicalData = await ctx.db.historicalElectricityWeather.findMany({
      where: {
      dateId: {
          in: dateIds,
      }
      },
      select: {
      dateId: true,
      price: true,
      dateData: {
          select: {
          dateValue: true,
          }
      }
      }
  });
  return historicalData;
}

async function ForecastDayResults(ctx: Context, year: number, month: number, day: number) {
  const dateIds = await dateIdsForDay(ctx, year, month, day);
  const forecastData = await ctx.db.forecastElectricityPrice.findMany({
    where: {
      dateId: {
        in: dateIds,
      }
    },
    select: {
      dateId: true,
      price: true,
      dateData: {
        select: {
          dateValue: true,
        }
      }
    }
  });
  return forecastData;
}

  // function to group the data by date and calculate the average price

  function groupByDateAndAveragePrice(resultData: HistoryItem[]) {
    const groupedByDate: Record<string, { date: string, sum: number, count: number, price: number | null }> = {};
  
    for (const item of resultData) {
      // Check for undefined dateString before processing
      const dateString = item?.dateData?.dateValue?.toISOString().split('T')[0];
      if (!dateString) {
        continue;
      }
  
      // Type guard to ensure existence of entry in groupedByDate
      const entry = groupedByDate[dateString];
      if (entry) {
        entry.sum += item.price ?? 0;
        entry.count += 1;
      } else {
        // Create a new entry if it doesn't exist
        groupedByDate[dateString] = {
          date: dateString,
          sum: item.price ?? 0,
          count: 1,
          price: null,
        };
      }
    }
  
    // Optional chaining for safety in average calculation
    for (const date in groupedByDate) {
      if (groupedByDate[date]) {
        groupedByDate[date].price = groupedByDate[date]?.sum / groupedByDate[date]?.count;
      }
    }
  
    return Object.values(groupedByDate);
  }
  





// get daily average price for a given period for both history and forecast data

async function getDailyAverage(ctx: Context, startDate: Date, endDate: Date, type: string) {
  const startDateString = startDate.toISOString();
  const endDateString = endDate.toISOString();

  let resultData: HistoryItem[] = [];

  if (type === 'history') {
    resultData = await ctx.db.historicalElectricityWeather.findMany({
      where: {
        dateData: {
          dateValue: {
            gte: startDateString,
            lte: endDateString,
          },
        },
      },
      orderBy: {
        dateData: {
          dateValue: 'asc'
        }
      },
      select: {
        dateId: true,
        dateData: {
          select: {
            dateValue: true,
          },
        },
        price: true,
      },
    });
  } else if (type === 'forecast') {
    resultData = await ctx.db.forecastElectricityPrice.findMany({
      where: {
        dateData: {
          dateValue: {
            gte: startDateString,
            lte: endDateString,
          },
        },
      },
      orderBy: {
        dateData: {
          dateValue: 'asc'
        }
      },
      select: {
        dateId: true,
        dateData: {
          select: {
            dateValue: true,
          },
        },
        price: true,
      },
    });
  } else {
    throw new Error("Invalid type");
  }


  const averagePricesWitSumAndCount = groupByDateAndAveragePrice(resultData);

  const averagePrices = averagePricesWitSumAndCount.map((item) => ({
    date: new Date(item.date).getDate()+ '.' + (new Date(item.date).getMonth()+1) + '.' + new Date(item.date).getFullYear(),
    price: item.price,
  }));

  return averagePrices;
}






export const priceRouter = createTRPCRouter({    

    // get history data for a given day
    getHistoryDay: publicProcedure
        .input(z.object({ date: z.object({ day: z.number(), month: z.number(), year: z.number() }) }))
        .query(async ({ input, ctx }) => {
          try {
            const historicalData = await HistoryDayResults(ctx, input.date.year, input.date.month, input.date.day);

            return historicalData;
          } catch (error) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Something went wrong" });
          }
            
        }),

    getForecastDay: publicProcedure
        .input(z.object({ date: z.object({ day: z.number(), month: z.number(), year: z.number() }) }))
        .query(async ({ input, ctx }) => {
          try {
            const forecastData = await ForecastDayResults(ctx, input.date.year, input.date.month, input.date.day);

            return forecastData;
          } catch (error) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Something went wrong" });
          }
        }),

    getHistoryPeriodDailyAverage: publicProcedure
        .input(z.object({ startDate: z.date(), endDate: z.date() }))
        .query(async ({ input, ctx }) => {
          try {
            const averagePrices = await getDailyAverage(ctx, input.startDate, input.endDate, 'history');
            return averagePrices;
          } catch (error) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Something went wrong" });
          }
          
        }),


    getForecastPeriodDailyAverage: publicProcedure
        .input(z.object({ startDate: z.date(), endDate: z.date() }))
        .query(async ({ input, ctx }) => {
          try {
            const averagePrices = await getDailyAverage(ctx, input.startDate, input.endDate, 'forecast');
            return averagePrices;
          } catch (error) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Something went wrong" });
          }
          
        }),


    getHistoryPeriodTotalAverage: publicProcedure
        .input(z.object({ startDate: z.date(), endDate: z.date() }))
        .query(async ({ input, ctx }) => {

          try {
          
            const startDate = input.startDate.toISOString();
            const endDate = input.endDate.toISOString();

                const averagePriceResult: AveragePriceResult = await ctx.db.historicalElectricityWeather.aggregate({
                  _avg: {
                    price: true, // Average the 'price' field
                  },
                  where: {
                    dateId: {
                      in: await ctx.db.calendarDate.findMany({
                        where: {
                          dateValue: {
                            gte: startDate,
                            lte: endDate,
                          },
                        },
                        select: {
                          id: true, // Select only the 'id' field
                        },
                      }).then((data) => data.map((d) => d.id)), // Extract 'id' from each object
                    },
                  },
                });
                
            const averagePrice: number | null = averagePriceResult._avg.price ?? null;

            return { averagePrice };
          
          } catch (error) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Something went wrong" });
          }

          
        }),




    

    
    



});
