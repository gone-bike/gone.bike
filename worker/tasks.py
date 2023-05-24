import sys, os, json, logging, time, requests, psycopg2, base64
from time import time as tm
from urllib.parse import urlparse

from celery import Celery
from celery.signals import celeryd_after_setup
from celery.signals import task_failure
from celery.exceptions import SoftTimeLimitExceeded

import weaviate
from weaviate.util import generate_uuid5


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

def fetch_picture(id):
    url = f'{os.environ["WORKER_DIRECTUS_URI"]}/assets/{id}?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'
    print(url)
    data = requests.get(url)
    if 200 == data.status_code:
        return base64.b64encode(data.content)
    raise Exception(f"HTTP code: {data.status_code} for file id: {id}")

@celeryd_after_setup.connect
def capture_worker_name(sender, instance, **kwargs):
    os.environ["WORKER_NAME"] = '{0}'.format(sender)


@app.task(bind=True, acks_late=False)
def test(self, *args, **kwargs):
    if kwargs['$trigger']['event'] == 'report.items.update':
        print(kwargs)


    if kwargs['$trigger']['event'] == 'report.items.create' or kwargs['$trigger']['event'] == 'report.items.update':
        print(kwargs)
        payload = kwargs['$trigger']['payload']
        if kwargs['$trigger']['event'] == 'report.items.create':
            key = kwargs['$trigger']['key']
        if kwargs['$trigger']['event'] == 'report.items.update':
            key = kwargs['$trigger']['keys'][0]
        print(payload)
        client = weaviate.Client(os.environ['WORKER_WEAVIATE_URI'])
        client.batch.configure(
            batch_size=None
        )
        with client.batch as batch:
            if 'main_photo' in payload and payload['main_photo'] is not None:
                b64 = fetch_picture(payload['main_photo'])
                batch.add_data_object(
                    class_name="Bike",
                    data_object={
                        'report_id': int(key),
                        'image': b64.decode("ascii")
                    },
                    uuid=payload['main_photo'],
                )
                pass
            if 'photos' in payload and 'create' in payload['photos'] and len(payload['photos']['create']) > 0:
                for e in payload['photos']['create']:
                    phid = e['directus_files_id']['id']
                    b64 = fetch_picture(phid)
                    batch.add_data_object(
                        class_name="Bike",
                        data_object={
                            'report_id': int(key),
                            'image': b64.decode("ascii")
                        },
                        uuid=phid,
                    )

            result = batch.create_objects()
            return 'oks'

    if kwargs['$trigger']['event'] == 'report.items.delete' or kwargs['$trigger']['event'] == 'report.items.update':
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

        wclient = weaviate.Client(os.environ['WORKER_WEAVIATE_URI'])

        while True:
            rows = cur.fetchmany(5000)
            print(rows)
            if not rows:
                break

            for row in rows:
                url = f'{os.environ["WORKER_DIRECTUS_URI"]}/files/{row[0]}?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'
                print(f"Deleting from Directus {url}...")
                result = requests.delete(url)
                print(result)

                print('Deleting from weaviate...')

                try:
                    result = wclient.data_object.delete(
                        uuid=row[0],
                        class_name='Bike'
                    )
                    print(result)
                except Exception as e:
                    print(e)
                    pass

        dbconn.close()





    return "OK"



@app.task(bind=True, acks_late=False)
def report_submit(self, *args, **kwargs):


    uploads = {}
    for pid in range(0,9):
        e = 'main_photo' if pid == 0 else f'photo_{pid}'

        if e in kwargs and kwargs[e] is not None and kwargs[e] != "":
            photo = f'{os.environ["WORKER_PUBLIC_TMP_URL"]}/{kwargs[e]["upload"]}.{kwargs[e]["name"]}'

            print(f"Importing {photo}")


            url = f'{os.environ["WORKER_DIRECTUS_URI"]}/files/import?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'
            data = requests.post(url, json={
                "url": photo,
                "data": {
                    "folder": "fa2b1d0e-2e58-4897-af16-eab29f26117d" if e == 'main_photo' else "21f79529-85a1-4797-b4a1-7ddefdef654f",
                    "tags": [ 'test' ],
                    "title": kwargs[e]["name"]
                }
            })
            response = data.json()
            uploads[e] = response["data"]["id"]
        # "bike_brand_model":{
        #     "bike_brand": {
        #         "key":"aa",
        #         "name":"bb"
        #     },
        #     "name":"xcccc"
        # }

    bike_brand = None
    bike_model = None
    if "bike_brand" in kwargs:
        url = f'{os.environ["WORKER_DIRECTUS_URI"]}/items/bike_brand?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'
        if kwargs["bike_brand"]["status"] == "new":
            bike_brand = requests.post(url, json={ "name": kwargs["bike_brand"]["value"] }).json()
            bike_brand = bike_brand["data"]["id"]
        else:
            bike_brand = requests.get(f'{url}&filter[id][_eq]={ kwargs["bike_brand"]["value"]}')
            if bike_brand.status_code != 200:
                return {"status": "fail", "input": kwargs }
            bike_brand = bike_brand.json()
            if len(bike_brand["data"]) == 0:
                return {"status": "fail", "input": kwargs }

            bike_brand = bike_brand["data"][0]["id"]
            # bike_brand = kwargs["bike_brand"]["value"]

    if "bike_model" in kwargs:
        url = f'{os.environ["WORKER_DIRECTUS_URI"]}/items/bike_brand_model?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'
        bike_model = requests.get(f'{url}&filter[name][_eq]={ kwargs["bike_model"]["value"]}')
        if bike_model.status_code != 200:
            return {"status": "fail", "input": kwargs }
        bike_model = bike_model.json()
        if len(bike_model["data"]) == 0 and kwargs["bike_model"]["status"] == "new":
            bike_model = requests.post(url, json={ "bike_brand": bike_brand, "name": kwargs["bike_model"]["value"] }).json()
            print(bike_model)
            bike_model = bike_model["data"]["id"]
        else:
            bike_model = bike_model["data"][0]["id"]


    entry = {
        "bike_brand_model": bike_model,

        "bike_details": kwargs["bike_details"],

        "approximate_value": kwargs["approximate_value"],
        "approximate_value_currency": kwargs["approximate_value_currency"],
        "colors": kwargs["colors"].split(','),
        "is_electric": bool(kwargs["is_electric"]),
        "theft_date": kwargs["theft_date"],
        "theft_timeframe": kwargs["theft_timeframe"],
        "theft_location_type": kwargs["theft_location_type"],
        "lock_type": kwargs["lock_type"],
        "lock_anchor": kwargs["lock_anchor"],
        "location_address": kwargs["location_address"],

        "location_details": kwargs["location_details"],
        "location": { "coordinates": [ kwargs["location_coords"]['lat'], kwargs["location_coords"]['lng'] ], "type": "Point"},
        "main_photo": uploads['main_photo'] if 'main_photo' in uploads else None,

        "photos": [ uploads[x] for x in uploads if x != 'main_photo' ],

        "description": kwargs["description"],
        "mail": kwargs["mail"],
    }
    print(entry)

    url = f'{os.environ["WORKER_DIRECTUS_URI"]}/items/report?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'
    data = requests.post(url, json=entry)

    print(data.status_code)
    print(data.json())


    return 'ok'


#     // POST /files/import


#     print(kwargs)