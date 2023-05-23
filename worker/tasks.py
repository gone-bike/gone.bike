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
            if 'photos' in payload and len(payload['photos']['create']) > 0:
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
def new_report(self, *args, **kwargs):
    ret = []
    for e in ['q42_main_photo', 'q44_photos_1','q45_photos_2', 'q46_photos_3']:

        if kwargs[e] is not None and kwargs[e] != "":
            photo = json.loads(kwargs[e])
            photo = photo['widget_metadata']['value'][0]
            photo =  f'https://eu.jotform.com/{photo["url"]}'

            photo_data = requests.get(photo)

            print(photo_data.headers)
            # def upload_engagement_file(filepath):

            #     url = API_ENDPOINT + "/api/files"  # add any URL parameters if needed
            #     hdr = {"Authorization": "Bearer %s" % access_token}
            #     with open(filepath, "rb") as fobj:
            #         file_obj = fobj.read()
            #         file_basename = os.path.basename(filepath)
            #         file_to_upload = {"file": (str(file_basename), file_obj)}
            #         finfo = {"fullPath": filepath}
            #         upload_response = requests.post(url, headers=hdr, files=file_to_upload, data=finfo)
            #         fobj.close()
            #     # print("Status Code ", upload_response.status_code)
            #     # print("JSON Response ", upload_response.json())
            #     return upload_response


            # print(f"Importing {photo}")


            # url = f'{os.environ["WORKER_DIRECTUS_URI"]}/files/import?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'
            # data = requests.post(url, json={
            #     "url": photo,
            #     "data": {
            #         "folder": "fa2b1d0e-2e58-4897-af16-eab29f26117d" if e == 'q42_main_photo' else "21f79529-85a1-4797-b4a1-7ddefdef654f",
            #         "tags": [ kwargs['slug'] ]
            #     }
            # })
            # print(data.content)

            # ret.append(data.status_code)
            # {'widget_metadata': {'type': 'imagelinks', 'value': [{'name': '15a28d52-0028-4551-85ad-c1e19ec67876.jpeg', 'url': '/widget-uploads/imagepreview/231414376042044/5f562e515a28d52-0028-4551-85ad-c1e19ec67876646ba65f5f019.jpeg'}]}}


    return 'ok'


#     // POST /files/import


#     print(kwargs)