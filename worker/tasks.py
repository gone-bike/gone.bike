import sys, os, json, logging, time, requests, psycopg2, base64, dotmap, re

import utils

from slugify import slugify
from time import time as tm
from urllib.parse import urlparse

from celery import Celery
from celery.signals import celeryd_after_setup
from celery.signals import task_failure
from celery.exceptions import SoftTimeLimitExceeded

from weaviate.util import generate_uuid5

from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter

# take environment variables from .env.
#
from dotenv import load_dotenv
#load_dotenv()

geolocator = Nominatim(user_agent="gone.bike")
geocode = RateLimiter(geolocator.geocode, min_delay_seconds=10, error_wait_seconds=20)

app = Celery('tasks')
app.config_from_object({
    # 'task_default_queue': 'test',
    # 'task_default_exchange': 'test',
    # 'task_default_routing_key': 'test',
    'worker_prefetch_multiplier': os.environ["WORKER_PREFETCH_MULTIPLIER"],
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
    print(args)
    return True



@app.task(bind=True, acks_late=False)
def report_create(self, *args, **kwargs):
    # print(args)
    for i in args:
        item = utils.fetch_item(i)
        if item.get('status') == 'published':
            x = utils.index_directus_report_item_to_weaviate(item)
            print(x)

    return True

@app.task(bind=True, acks_late=False)
def report_update(self, *args, **kwargs):
    for i in args:
        item = utils.fetch_item(i)
        print(json.dumps(item,indent=2))

        # When an update occurs, it could be happening that an entry gets different associated photos
        for e in utils.fetch_unlinked_files():
            try:
                utils.remove_directus_file_by_id(e[0])
                utils.remove_weaviate_entry_by_id(e[0])
            except Exception as e:
                print(e)
                pass

        if item.get('status') == 'published':
            x = utils.index_directus_report_item_to_weaviate(item)
            print(x)
        else:
            utils.deindex_directus_report_item_from_weaviate(i)



    return True


@app.task(bind=True, acks_late=False)
def report_delete(self, *args):
    for i in args:
        utils.deindex_directus_report_item_from_weaviate(i)
    return True



### When a new report entry is submitted to the website, it enters a queue that is then processed by this function
@app.task(bind=True, acks_late=False)
def report_submit(self, *args, **kwargs):
    print(kwargs)


    # Bike brand / model normalization: if existing at db level, use it, otherwise create a new entry

    bike_brand = None
    bike_model = None

    if "bike_brand_id" in kwargs and kwargs.get('bike_brand_id') != "":
        bike_brand = int(kwargs.get('bike_brand_id'))

    elif "bike_brand" in kwargs and kwargs.get('bike_brand') != "":
        url = f'{os.environ["WORKER_DIRECTUS_URI"]}/items/bike_brand?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'
        bike_brand_slug = slugify(kwargs['bike_brand'])
        bike_brand = requests.get(f'{url}&filter[key][_eq]={ bike_brand_slug }')
        if bike_brand.status_code != 200:
            return {"status": "fail", "output": bike_brand.content }
        bike_brand = bike_brand.json()

        if len(bike_brand["data"]) == 0:
            bike_brand = requests.post(url, json={ "key": bike_brand_slug, "name": kwargs["bike_brand"] }).json()
            bike_brand = bike_brand["data"]["id"]

        else:
            bike_brand = bike_brand["data"][0]["id"]

    # if "bike_model_id" in kwargs and kwargs.get('bike_model_id') != "":
    #     bike_model = int(kwargs.get('bike_model_id'))

    if "bike_model" in kwargs:
        url = f'{os.environ["WORKER_DIRECTUS_URI"]}/items/bike_brand_model?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'

        bike_model_slug = slugify(kwargs['bike_model'])

        bike_model = requests.get(f'{url}&filter[key][_eq]={ bike_model_slug }')
        if bike_model.status_code != 200:
            return {"status": "fail", "output": bike_model.content  }
        bike_model = bike_model.json()
        if len(bike_model["data"]) == 0:
            bike_model = requests.post(url, json={ "bike_brand": bike_brand, "key": bike_model_slug, "name": kwargs["bike_model"] }).json()
            bike_model = bike_model["data"]["id"]
        else:
            bike_model = bike_model["data"][0]["id"]


    language= None
    if "language" in kwargs:
        url = f'{os.environ["WORKER_DIRECTUS_URI"]}/items/language?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'

        language = requests.get(f'{url}&filter[locale_code][_eq]={ kwargs.get("language") }')
        if language.status_code == 200:
            language = language.json()
            if len(language["data"]) == 1:
                language = language["data"][0]["id"]


    # @TODO colors will be submitted in different languages, normalization function here is due
    try:
        colors = kwargs.get("colors","").replace('/',',').replace( 'and ', ',').split(',') if 'colors' in kwargs else []
        colors = list(map(lambda c : slugify(c) , colors))
    except Exception as e:
        colors = []



    entry = {
        "bike_brand_model": bike_model,

        "bike_details": kwargs.get("bike_details"),

        "approximate_value": kwargs.get("approximate_value"),
        "approximate_value_currency": kwargs.get("approximate_value_currency"),
        "colors": colors,
        "is_electric": bool(kwargs.get("is_electric")) if kwargs.get('is_electric') else None,
        "serial_number" : kwargs.get("serial_number"),
        "theft_status": kwargs.get('theft_status', 'stolen'),
        "theft_date": kwargs.get("theft_date"),
        "theft_timeframe": kwargs.get("theft_timeframe"),
        "theft_location_type": kwargs.get("theft_location_type"),
        "language" : language,
        "bike_type": kwargs.get('bike_type'),
        "lock_type": kwargs.get("lock_type"),
        "lock_anchor": kwargs.get("lock_anchor"),
        "location_address": kwargs.get("location_address"),

        "location_details": kwargs.get("location_details"),
        "description": kwargs.get("description"),
        "email": kwargs.get("email"),
        "ref_url": kwargs.get("ref_url"),
        "tags": kwargs.get('tags')
    }

    print("Entry...")
    print(json.dumps(entry))

    # Location can be either explicit coordinates or an address that is then geocoded using Nominatim. Best effort approach
    if kwargs.get('location_coords'):
        entry['location'] = { "coordinates": [ kwargs.get("location_coords",{}).get('lng'), kwargs.get("location_coords",{}).get('lat') ], "type": "Point"}

    elif kwargs.get('location_address_raw'):
        location = geocode(kwargs.get('location_address_raw'))
        try:
            entry['location_address'] = location.address
            entry['location_details'] = location.raw
            entry['location_details']['_input'] = kwargs.get('location_address_raw')
            entry['location'] = { "coordinates": [ location.longitude, location.latitude ], "type": "Point"}
        except Exception as e:
            entry['location_details'] = {
                "_input": kwargs.get('location_address_raw')
            }



    # Files are sent as either full URLs or <upload,name> tuples. They are imported in Directus using directus API
    uploads = {}
    for pid in range(0,9):
        e = 'main_photo' if pid == 0 else f'photos_{pid}'

        if e in kwargs and kwargs[e] is not None and kwargs[e] != "":

            if type(kwargs[e]) is dict:
                photo_url = f'{os.environ["WORKER_PUBLIC_TMP_URL"]}/{kwargs[e]["upload"]}.{kwargs[e]["name"]}'
                photo_name = kwargs[e]["name"]
            if type(kwargs[e]) is str:
                photo_url = kwargs[e]
                photo_name = print(os.path.basename( urlparse(photo_url).path))

            print(f"Importing {photo_url}")


            # @TODO - env-based folder ids
            url = f'{os.environ["WORKER_DIRECTUS_URI"]}/files/import?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'
            data = requests.post(url, json={
                "url": photo_url,
                "data": {
                    "folder": "fa2b1d0e-2e58-4897-af16-eab29f26117d" if e == 'main_photo' else "21f79529-85a1-4797-b4a1-7ddefdef654f",
                    "tags": [ photo_url ],
                    "description": photo_url,
                    "title": photo_name
                }
            })
            response = data.json()
            uploads[e] = response["data"]["id"]


    entry["main_photo"] = uploads.get('main_photo')

    entry["photos"] = { "create": [ ] }

    for x in uploads:
      if x != 'main_photo':
        entry["photos"]["create"].append({
          "report_id": "+",
          "directus_files_id": {
            "id": uploads.get(x)
          }
        })

    print(json.dumps(entry))


    url = f'{os.environ["WORKER_DIRECTUS_URI"]}/items/report?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'
    data = requests.post(url, json=entry)

    # @TODO - some error control
    print(data.status_code)
    if data.status_code == 200:
        data = data.json()
        print(data)
        if kwargs.get('email'):
            send = utils.send_activation_email(kwargs.get('language'), kwargs.get('email'), data['data']['id'], data['data']['activation_code'])
            print(send)

        return 'ok'



