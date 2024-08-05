from datetime import datetime, timedelta
import pandas as pd


def get_next_hour(dt: datetime) -> datetime:
    dt = dt + timedelta(hours=1)
    return dt.replace(minute=0, second=0, microsecond=0)


def convert_timestamp(obj):
    if isinstance(obj, pd.Timestamp):
        return obj.isoformat()
    raise TypeError("Object of type %s is not JSON serializable" % type(obj))
