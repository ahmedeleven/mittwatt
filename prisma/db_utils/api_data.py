import openmeteo_requests
import requests_cache
from retry_requests import retry
import pandas as pd
import logging
from datetime import datetime
import requests
from db_utils.date_utils import get_next_hour
import time


def get_weather_data(expire_after,
                     retries,
                     backoff_factor,
                     url,
                     latitude,
                     longitude,
                     timezone="auto",
                     start_date=None,
                     end_date=None,
                     past_days=None,
                     forecast_days=None
                     ):
    """
    Retrieves weather data from an API and returns it as a pandas DataFrame.
    """
    try:
        cache_session = requests_cache.CachedSession(
            '.cache', expire_after=expire_after)
        retry_session = retry(cache_session, retries=retries,
                              backoff_factor=backoff_factor)
        openmeteo = openmeteo_requests.Client(session=retry_session)
        if 'archive' in url:
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "start_date": start_date,
                timezone: timezone,
                "end_date": end_date,
                "hourly": ["temperature_2m", "precipitation", "weather_code", "cloud_cover", "wind_speed_10m", "shortwave_radiation"]
            }
        else:
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "hourly": ["temperature_2m", "precipitation", "weather_code", "cloud_cover", "wind_speed_10m", "shortwave_radiation"],
                timezone: timezone,
                "past_days": past_days,
                "forecast_days": forecast_days
            }
        responses = openmeteo.weather_api(url, params=params)
        response = responses[0]
        hourly = response.Hourly()
        hourly_data = {"date_value": pd.date_range(
            start=pd.to_datetime(hourly.Time(), unit='s',
                                 utc=True).strftime("%Y-%m-%d %H:%M:%S"),
            end=pd.to_datetime(hourly.TimeEnd(),  unit='s',
                               utc=True).strftime("%Y-%m-%d %H:%M:%S"),
            freq=pd.Timedelta(seconds=hourly.Interval(), unit='h'),
            inclusive="left"
        )}
        hourly_data["temperature_2m"] = hourly.Variables(0).ValuesAsNumpy()
        hourly_data["precipitation"] = hourly.Variables(1).ValuesAsNumpy()
        hourly_data["weather_code"] = hourly.Variables(2).ValuesAsNumpy()
        hourly_data["cloud_cover"] = hourly.Variables(3).ValuesAsNumpy()
        hourly_data["wind_speed_10m"] = hourly.Variables(4).ValuesAsNumpy()
        hourly_data["shortwave_radiation"] = hourly.Variables(
            5).ValuesAsNumpy()
        hourly_dataframe = pd.DataFrame(data=hourly_data)
        if 'archive' in url:
            logging.info(f'Archive weather data has been received')
        else:
            logging.info(
                f'Current and forecast weather data has been received')
        return hourly_dataframe
    except Exception as e:
        logging.error(f"Error fetching data from {url}: {e}")
        return None


def get_elec_archive(url_source, start_date, retry_interval=3600, max_retries=6):
    """
    Downloads data from API and saves it to a file.
    """
    if isinstance(start_date, str):
        start_date = datetime.strptime(start_date, "%Y-%m-%d %H:%M:%S")
    retries = 0
    while retries < max_retries:
        try:
            response = requests.get(url_source)
            with open('./source_data/electricity_archive.xlsx', 'wb') as file:
                file.write(response.content)
            electricity_archive = (
                pd.read_excel('./source_data/electricity_archive.xlsx', skiprows=4,
                              parse_dates=['startDate'], names=['startDate', 'price'])
                .drop_duplicates(keep='first', subset=['startDate'], ignore_index=True)
                .assign(startDate=lambda df: df['startDate'].apply(get_next_hour))
                .loc[lambda df: df['startDate'] >= start_date]
                .reset_index(drop=True)
            )
            logging.info('Archive electricity data has been received')
            return electricity_archive
        except requests.exceptions.HTTPError as http_err:
            retries += 1
            logging.error(f"HTTP error occurred: {http_err}")
            logging.info(
                f"Retry {retries}/{max_retries} in {retry_interval / 3600} hour(s)...")
            if retries == max_retries:
                logging.warning(f"Max retries reached.")
                return None
            time.sleep(retry_interval)
        except Exception as e:
            logging.error(f"Failed to fetch data from this {url_source}: {e}")
            return None


def get_tomorrow_electricity_prices(url, start_date, retry_interval=3600, max_retries=6):
    """
    Get tomorrow electricity prices from API
    """
    retries = 0
    while retries < max_retries:
        try:
            tomorrow_elec_prices = (
                pd.DataFrame.from_records(requests.get(url).json()[
                                          'prices'], columns=['price', 'startDate'])
                .assign(startDate=lambda df: pd.to_datetime(df['startDate']).dt.tz_convert(None) + pd.Timedelta(hours=3))
                .loc[lambda df: df['startDate'] > start_date]
                .sort_values(by='startDate', ignore_index=True)
            )
            logging.info('Tomorrow electricity data has been received')
            return tomorrow_elec_prices
        except requests.exceptions.HTTPError as http_err:
            retries += 1
            logging.error(f"HTTP error occurred: {http_err}")
            logging.info(
                f"Retry {retries}/{max_retries} in {retry_interval / 3600} hour(s)...")
            if retries == max_retries:
                logging.warning(f"Max retries reached.API might be down.")
                return None
            time.sleep(retry_interval)
        except Exception as e:
            logging.error(f"Error fetching tomorrow electricity prices: {e}")
            return None
