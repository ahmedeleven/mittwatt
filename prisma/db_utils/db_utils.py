import psycopg2
import logging
from psycopg2 import sql
import os
from dotenv import load_dotenv


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


def is_database_empty(cur, table_list):
    try:
        logging.info('Checking whether there is data in the database...')
        numb_rows_tables = {}
        for table in table_list:
            cur.execute(sql.SQL(f'SELECT count(1) FROM "{table}";'))
            result = cur.fetchone()[0]
            numb_rows_tables[table] = result
        return numb_rows_tables
    except Exception as e:
        logging.error(f'Failed to check if the database is empty: {e}')


def delete_data_from_table(conn, cur, table_list):
    for table in table_list:
        cur.execute(sql.SQL(f'DELETE FROM "{table}";'))
        logging.info(f'The data has been deleted from {table}')
        conn.commit()
