import pandas as pd


def generate_date_dataframe(start_date, end_date, freq):
    """
    Initialize date dataFrame
    """
    date_range = pd.date_range(start=start_date, end=end_date, freq=freq)
    dates_df = pd.DataFrame({
        'date_value': date_range.strftime('%Y-%m-%d %H:%M:%S'),
        'year': date_range.year,
        'quarter': date_range.quarter,
        'month': date_range.month,
        'day': date_range.day,
        'hour': date_range.hour,
        'day_of_week': date_range.dayofweek,
        'day_name': date_range.strftime('%A'),
        'month_name': date_range.strftime('%B'),
        'year_month': date_range.strftime('%Y-%m')
    })
    return dates_df
