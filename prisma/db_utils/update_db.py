from db_utils.db_utils import connect_to_db
from db_utils.api_data import get_elec_archive, get_tomorrow_electricity_prices, get_weather_data
from db_utils.data_insertion import insert_data_fact_table
from datetime import datetime, timedelta
import logging
import numpy as np


def update_database():
    """
    Update historical electricity and weather data in the database.

    This function retrieves electricity price data for tomorrow and current/forecast weather data,
    combines them, and inserts into the database table 'HistoricalElectricityWeather'.
    """
    try:
        conn_mw, cursor_mw = connect_to_db()
        today = datetime.today()
        if today.weekday() == 0:  # Monday
            date_to_fetch = (today - timedelta(days=2)
                             ).replace(hour=0, minute=0, second=0, microsecond=0)
            days = 2
            electricity_price_tomorrow = get_elec_archive(
                "https://porssisahko.net/api/internal/excel-export", date_to_fetch)
        else:
            date_to_fetch = today.replace(
                hour=0, minute=0, second=0, microsecond=0)
            days = 0
            electricity_price_tomorrow = get_tomorrow_electricity_prices(
                "https://api.porssisahko.net/v1/latest-prices.json", date_to_fetch)
        if electricity_price_tomorrow is None:
            logging.warning(
                f'Failed to retrieve electricity data from {date_to_fetch}')
            return
        electricity_price_tomorrow.set_index('startDate', inplace=True)
        # get current and forecast weather data for the nex 14 days
        weather_forecast = get_weather_data(
            expire_after=3600,
            retries=5,
            backoff_factor=0.2,
            url="https://api.open-meteo.com/v1/forecast",
            latitude=64,
            longitude=26,
            past_days=days,
            forecast_days=14,
            timezone="auto",
        )
        if weather_forecast is None:
            logging.warning(
                f'Failed to retrieve weather data from {date_to_fetch}')
            return
        current_weather_electricity = (
            weather_forecast
            .loc[weather_forecast['date_value'] > date_to_fetch]
            .reset_index(drop=True)
            .assign(price=lambda df: df['date_value'].map(electricity_price_tomorrow['price']))
            .replace(np.nan, None)
        )
        insert_data_fact_table(conn_mw, cursor_mw, 'HistoricalElectricityWeather',
                               'dateId, temperature, precipitation, weatherCodeId, cloudCover, windSpeed10m, shortwaveRadiation, price, createdDate, modifiedDate', current_weather_electricity)
        logging.info(
            f'Database has been updated succesfully from {date_to_fetch}')
    except Exception as e:
        logging.error(f'Exception occured - {e}')
