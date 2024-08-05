-- CreateTable
CREATE TABLE "HistoricalElectricityWeather" (
    "id" SERIAL NOT NULL,
    "dateId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION NOT NULL,
    "precipitation" DOUBLE PRECISION NOT NULL,
    "cloudCover" INTEGER NOT NULL,
    "windSpeed10m" INTEGER NOT NULL,
    "shortwaveRadiation" INTEGER NOT NULL,
    "weatherCodeId" INTEGER NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "modifiedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoricalElectricityWeather_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForecastElectricityPrice" (
    "id" SERIAL NOT NULL,
    "dateId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "modifiedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForecastElectricityPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarDate" (
    "id" SERIAL NOT NULL,
    "dateValue" TIMESTAMP(3) NOT NULL,
    "year" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "hour" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "dayName" TEXT NOT NULL,
    "monthName" TEXT NOT NULL,
    "yearMonth" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalendarDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherCode" (
    "id" INTEGER NOT NULL,
    "descriptionCode" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeatherCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionUser" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subscriptionTypeId" INTEGER NOT NULL,
    "activeSubscription" BOOLEAN NOT NULL DEFAULT true,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionType" (
    "id" SERIAL NOT NULL,
    "descriptionSubscription" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubscriptionType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalElectricityWeather_dateId_key" ON "HistoricalElectricityWeather"("dateId");

-- CreateIndex
CREATE UNIQUE INDEX "ForecastElectricityPrice_dateId_key" ON "ForecastElectricityPrice"("dateId");

-- CreateIndex
CREATE UNIQUE INDEX "CalendarDate_dateValue_key" ON "CalendarDate"("dateValue");

-- AddForeignKey
ALTER TABLE "HistoricalElectricityWeather" ADD CONSTRAINT "HistoricalElectricityWeather_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "CalendarDate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalElectricityWeather" ADD CONSTRAINT "HistoricalElectricityWeather_weatherCodeId_fkey" FOREIGN KEY ("weatherCodeId") REFERENCES "WeatherCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForecastElectricityPrice" ADD CONSTRAINT "ForecastElectricityPrice_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "CalendarDate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionUser" ADD CONSTRAINT "SubscriptionUser_subscriptionTypeId_fkey" FOREIGN KEY ("subscriptionTypeId") REFERENCES "SubscriptionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
