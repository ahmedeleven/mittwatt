from db_utils import env_os
from db_utils.db_utils import connect_to_db, load_data
from db_utils.insertion_forecast import insert_forecast_to_table
import pandas as pd
import joblib
from tensorflow.keras.models import load_model
import logging
from psycopg2 import sql


def get_prediction():
    try:
        conn_mw, cursor_mw = connect_to_db()
        cursor_mw.execute(sql.SQL(f'SELECT "createdDate" FROM "HistoricalElectricityWeather" ORDER BY "createdDate" DESC LIMIT 1;'))
        last_update_date = cursor_mw.fetchone()[0].date()
        query = f'SELECT * FROM "HistoricalElectricityWeather"  WHERE price IS NULL AND "dateId" > (SELECT id FROM "CalendarDate" WHERE "dateValue" > \'{last_update_date}\' LIMIT 1);'
        df = load_data(cursor_mw, query)
        # Select specific columns using .filter
        X = df.filter(['temperature', 'precipitation', 'cloudCover',
                    'windSpeed10m', 'shortwaveRadiation', 'weatherCodeId'])
        # Load the scalers from disk
        scaler_X = joblib.load('scaler_X.pkl')
        scaler_y = joblib.load('scaler_y.pkl')
        # Load the model
        model = load_model('electricity_price_model.h5')
        # Normalize the features
        X_normalized = scaler_X.transform(X)
        # Predict using the trained model
        y_pred_scaled = model.predict(X_normalized, verbose=0)
        # Inverse transform the predicted values to get them back to the original scale
        y_pred = scaler_y.inverse_transform(y_pred_scaled)
        y_pred_flatten = y_pred.flatten()
        y_pred_one_d = y_pred_flatten.astype(float).round(2)
        # Create the new DataFrame
        prediction_dataframe_new = pd.DataFrame({
            'dateId': df['dateId'],
            'price': y_pred_flatten
        })
        insert_forecast_to_table(conn_mw, cursor_mw, 'ForecastElectricityPrice',
                                'dateId, price, createdDate, modifiedDate', prediction_dataframe_new)
        cursor_mw.close()
        conn_mw.close()
    except Exception as e:
        logging.error(f'Exception occured - {e}')
        return
