from db_utils.db_utils import connect_to_db, is_database_empty, delete_data_from_table
from db_utils.data_insertion import insert_data_dim_table, insert_data_fact_table
from db_utils.api_data import get_weather_data, get_elec_archive
from db_utils.generate_date_dataframe import generate_date_dataframe
import logging
from datetime import date, timedelta
import pandas as pd
import numpy as np


def populate_initial_data():
    """
    Populate initial data into the database including weather codes, subscription types, calendar dates,
    historical electricity and weather data.
    """
    # Connection parameters
    try:
        conn_mw, cursor_mw = connect_to_db()
        table_to_check = ['HistoricalElectricityWeather',
                          'WeatherCode', 'SubscriptionType', 'CalendarDate']
        
        numb_rows_tables = is_database_empty(cursor_mw, table_to_check)
        for table_name, numb_rows in numb_rows_tables.items():
            if numb_rows != 0:
                logging.info(
                    f'The table {table_name} is not empty.')
        # populate weather_code table
        if numb_rows_tables['WeatherCode'] == 0:
            insert_data_dim_table(
                conn_mw,
                cursor_mw,
                'WeatherCode',
                'id, "descriptionCode", "createdDate", "modifiedDate"',
                './source_data/weather_code.csv'
            )
        # populate subscription_type table
        if numb_rows_tables['SubscriptionType'] == 0:
            insert_data_dim_table(
                conn_mw,
                cursor_mw,
                'SubscriptionType',
                'id, "descriptionSubscription", "createdDate", "modifiedDate"',
                './source_data/subscription_types.csv'
            )
        if numb_rows_tables['CalendarDate'] == 0:
            # create date dataframe
            date_df = generate_date_dataframe('2022-01-01', '2024-12-31', 'h')
            insert_data_dim_table(
                conn_mw,
                cursor_mw,
                'CalendarDate',
                '"dateValue", year, quarter, month, day, hour, "dayOfWeek", "dayName", "monthName", "yearMonth", "createdDate", "modifiedDate"',
                date_df
            )
        if numb_rows_tables['HistoricalElectricityWeather'] != 0:
            delete_data_from_table(conn_mw, cursor_mw, ['HistoricalElectricityWeather'])
        # get historical weather data
        weather_archive = get_weather_data(
            expire_after=-1,
            retries=5,
            backoff_factor=0.2,
            timezone="auto",
            url="https://archive-api.open-meteo.com/v1/archive",
            latitude=64,
            longitude=26,
            start_date="2022-01-01",
            end_date=(date.today() - timedelta(days=5)).strftime("%Y-%m-%d")
        )
        # get current and forecast weather data for the nex 14 days
        weather_forecast = get_weather_data(
            expire_after=3600,
            retries=5,
            backoff_factor=0.2,
            timezone="auto",
            url="https://api.open-meteo.com/v1/forecast",
            latitude=64,
            longitude=26,
            past_days=4,
            forecast_days=14
        )
        elec_archive = get_elec_archive(
            "https://porssisahko.net/api/internal/excel-export", "2022-01-01 00:00:00")
        elec_archive.set_index('startDate', inplace=True)
        archive_electricity_weather = (
            pd.concat([weather_archive, weather_forecast],
                      axis=0, ignore_index=True)
        )
        archive_electricity_weather['price'] = (
            archive_electricity_weather['date_value'].map(
                elec_archive['price'])
            .replace(np.nan, None)
        )
        insert_data_fact_table(conn_mw, cursor_mw, 'HistoricalElectricityWeather',
                               'dateId, temperature, precipitation, weatherCodeId, cloudCover, windSpeed10m, shortwaveRadiation, price, createdDate, modifiedDate', archive_electricity_weather)
        logging.info('Database has been populated succesfully')
        cursor_mw.close()
        conn_mw.close()
    except Exception as e:
        logging.error(f'Exception occured - {e}')
