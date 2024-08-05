import pandas as pd
import logging
from datetime import datetime
from psycopg2 import sql


def insert_data_dim_table(conn, cursor, table_name, table_columns, insertable_data):
    """
    Inserts data from a DataFrame or .csv into PostgreSQL table
    """
    if isinstance(insertable_data, str):
        insertable_data = pd.read_csv(insertable_data, sep=';', header=None)
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    insertable_data['created'] = now
    insertable_data['modified'] = now
    placeholders = ", ".join(
        ["%s" for _ in range(len(table_columns.split(",")))])
    query = f'INSERT INTO "{table_name}" ({table_columns}) VALUES ({placeholders});'
    try:
        cursor.executemany(query, insertable_data.values.tolist())
        conn.commit()
        logging.info(f'Table {table_name} has been populated')
    except Exception as e:
        logging.error(f"Error inserting data into {table_name}: {e}")


def insert_data_fact_table(conn, cursor, table_name, table_columns, insertable_dataframe):
    """
    Inserts data from a DataFrame into PostgreSQL fact table
    """
    now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    insertable_dataframe['created'] = now
    insertable_dataframe['modified'] = now
    columns_list = table_columns.split(", ")
    placeholders = ", ".join(["%s" for _ in range(len(columns_list))])
    update_columns = ", ".join(
        [f'"{col}"=excluded."{col}"' for col in columns_list if col not in ("dateId", "createdDate")])
    query = sql.SQL('''
    INSERT INTO {table_name} ({table_columns})
    VALUES ({placeholders})
    ON CONFLICT ("dateId") DO UPDATE SET {update_columns};
    ''').format(
        table_name=sql.Identifier(table_name),
        table_columns=sql.SQL(', ').join(map(sql.Identifier, columns_list)),
        placeholders=sql.SQL(placeholders),
        update_columns=sql.SQL(update_columns)
    )
    try:
        for _, row in insertable_dataframe.iterrows():
            cursor.execute(
                'SELECT id FROM "CalendarDate" WHERE "dateValue" = %s;', (str(row['date_value']),))
            date_id = cursor.fetchone()[0]
            row = list(row)[1:]
            row.insert(0, date_id)
            cursor.execute(query, tuple(row))
        logging.info(f'Table {table_name} has been populated')
        conn.commit()
    except Exception as e:
        logging.error(f"Error inserting data into {table_name}: {e}")
