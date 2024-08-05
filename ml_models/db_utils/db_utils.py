import psycopg2
import logging
from psycopg2 import sql
import os
from dotenv import load_dotenv
import pandas as pd


def connect_to_db():
    try:
        load_dotenv()
        database_url = os.getenv('DATABASE_URL')
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        logging.info('Database connection established')
        return conn, cur
    except psycopg2.Error as error:
        logging.error(f'Error occured - {error}')
        return None, None


def load_data(cur, query):
    try:
        cur.execute(sql.SQL(query))
        results = cur.fetchall()
        column_names = [desc[0] for desc in cur.description]
        df = pd.DataFrame(results, columns=column_names)
        logging.info('Data was loaded')
        return df
    except Exception as e:
        logging.error(f'Exception occured - {e}')
