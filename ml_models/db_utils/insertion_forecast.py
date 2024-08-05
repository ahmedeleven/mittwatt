import logging
from datetime import datetime
from psycopg2 import sql


def insert_forecast_to_table(conn, cursor, table_name, table_columns, insertable_dataframe):
    """
    Inserts forecast data from a DataFrame into PostgreSQL fact table
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
        cursor.executemany(query, insertable_dataframe.values.tolist())
        logging.info(f'Table {table_name} has been populated')
        conn.commit()
    except Exception as e:
        print(f"Error inserting data into {table_name}: {e}")
