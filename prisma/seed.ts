// prisma/seed.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { addHours, format, startOfDay } from 'date-fns';
import { db } from '../src/server/db'; // Adjust the path as necessary

async function main() {
  // Before the createMany operation
  await db.$executeRaw`PRAGMA foreign_keys = OFF;`;
  const startDate = new Date('2024-01-01T00:00:00Z'); // Replace with your start date
  const endDate = new Date('2024-12-31T00:00:00Z'); // Replace with your end date

  const data: Omit<Prisma.CalendarDateCreateManyInput, 'id'>[] = [];
  let currentDate = startOfDay(startDate);

  while (currentDate <= endDate) {
    for (let hour = 0; hour < 24; hour++) {
      const dateValue = addHours(currentDate, hour);
      const year = dateValue.getFullYear();
      const month = dateValue.getMonth() + 1;
      const day = dateValue.getDate();
      const hourValue = dateValue.getHours();
      const dayOfWeek = dateValue.getDay();
      const dayName = format(dateValue, 'EEEE');
      const monthName = format(dateValue, 'MMMM');
      const yearMonth = `${year}-${String(month).padStart(2, '0')}`;

      data.push({
        dateValue: dateValue,
        year,
        quarter: Math.ceil(month / 3),
        month,
        day,
        hour: hourValue,
        dayOfWeek: dayOfWeek,
        dayName: dayName,
        monthName: monthName,
        yearMonth: yearMonth,
      });
    }
    currentDate = addHours(currentDate, 24);
  }

  await db.calendarDate.createMany({
    data,
    //skipDuplicates: true as unknown as never, // Type assertion to handle the error
  });

  const calendarDateRecords = await db.calendarDate.findMany();

  const historicalElectricityWeatherData: Omit<Prisma.HistoricalElectricityWeatherCreateManyInput, 'id'>[] = calendarDateRecords.map((record) => ({
    dateId: record.id,
    price: Math.random() * 100,
    temperature: Math.random() * 35,
    precipitation: Math.random() * 10,
    cloudCover: Math.floor(Math.random() * 100),
    windSpeed10m: Math.floor(Math.random() * 15),
    shortwaveRadiation: Math.floor(Math.random() * 1000),
    weatherCodeId: 1, // Assuming you have a WeatherCodeDimension with ID 1
    createdDate: new Date(),
    modifiedDate: new Date(),
  }));

  const forecastElectricityPriceData: Omit<Prisma.ForecastElectricityPriceCreateManyInput, 'forecast_id'>[] = calendarDateRecords.map((record) => ({
    dateId: record.id,
    price: Math.random() * 100,
    createdDate: new Date(),
    modifiedDate: new Date(),
  }));

  await db.historicalElectricityWeather.createMany({
    data: historicalElectricityWeatherData,
    //skipDuplicates: true as unknown as never, // Type assertion to handle the error
  });

  await db.forecastElectricityPrice.createMany({
    data: forecastElectricityPriceData,
    //skipDuplicates: true as unknown as never, // Type assertion to handle the error
  });
  await db.$executeRaw`PRAGMA foreign_keys = ON;`;

}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
