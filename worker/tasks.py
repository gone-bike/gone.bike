import sys, os, json, logging, time, requests, psycopg2
from time import time as tm
from urllib.parse import urlparse

from celery import Celery
from celery.signals import celeryd_after_setup
from celery.signals import task_failure
from celery.exceptions import SoftTimeLimitExceeded


# take environment variables from .env.
#
from dotenv import load_dotenv
#load_dotenv()

app = Celery('tasks')
app.config_from_object({
    'broker_transport_options': {
        'visibility_timeout': 30, # BROKER_TRANSPORT_OPTTION_VISIBILITY_TIMEOUT
        'max_retries': 1
    }
})


@celeryd_after_setup.connect
def capture_worker_name(sender, instance, **kwargs):
    os.environ["WORKER_NAME"] = '{0}'.format(sender)


@app.task(bind=True, acks_late=False)
def test(self, *args, **kwargs):
    if kwargs['$trigger']['event'] == 'report.items.create':
        print(kwargs)


    if kwargs['$trigger']['event'] == 'report.items.delete':
        dburi = urlparse(os.environ["WORKER_DB_URI"])
        dbconn = psycopg2.connect(host=dburi.hostname,
                            user=dburi.username,
                            dbname=dburi.path[1:],
                            port=dburi.port)

        dbconn.set_session(autocommit=True)
        cur = dbconn.cursor()

        cur.execute("""
                SELECT DF.id
                FROM directus_files AS DF
                LEFT JOIN report_files AS RF ON (DF.id = RF.directus_files_id)
                WHERE DF.folder = (SELECT id FROM directus_folders WHERE name = 'bike')
                AND RF.id IS NULL
                UNION ALL
                SELECT DF.id
                FROM directus_files AS DF
                LEFT JOIN report AS R ON (DF.id = R.main_photo)
                WHERE DF.folder = (SELECT id FROM directus_folders WHERE name = 'main_bike_photo')
                AND R.id IS NULL;
            """,
                [ ])

        while True:
            rows = cur.fetchmany(5000)
            print(rows)
            if not rows:
                break

            for row in rows:
                url = f"{os.environ["WORKER_DIRECTUS_URI"]}/files/{row[0]}?access_token={os.environm["WORKER_DIRECTUS_TOKEN"]}"
                print(f"Deleting {url}...")
                result = requests.delete(url)
                print(result)

        dbconn.close()





    return "OK"