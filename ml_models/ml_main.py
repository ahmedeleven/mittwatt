import logging
from db_utils.get_prediction import get_prediction
import schedule
import time


#  setup logging
# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("ml_model.log"),
    ]
)


# first start
def update_forecast():
    logging.info("Start...")

    get_prediction()


update_forecast()

# Schedule the job every weekday at 18:00 (6 PM)
schedule.every().monday.at("18:00").do(update_forecast)
schedule.every().tuesday.at("18:00").do(update_forecast)
schedule.every().wednesday.at("18:00").do(update_forecast)
schedule.every().thursday.at("18:00").do(update_forecast)
schedule.every().friday.at("18:00").do(update_forecast)

while True:
    schedule.run_pending()
    time.sleep(1)
