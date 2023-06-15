import requests, json, dotmap, os, re, weaviate, base64, copy, psycopg2
from urllib.parse import urlparse, urlencode

from mailer import send_email

# Converts placeholders into python string.format() friendly.
# From "Hello {{ var }}" to "Hello {var}"
def placeholders_to_py(str):
    return re.sub(r'\{\{\s*([a-zA-Z0-9_]+)\s*\}\}', r'{\1}', str)

def fetch_unlinked_files():
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
    data = cur.fetchall()
    dbconn.close()
    return data


# Gets report id data from directus
def fetch_item(id):
    fields = ','.join([
        'id',
        'status',
        'bike_brand_model.bike_brand.name',
        'bike_brand_model.name',
        'location',
        'theft_date',
        'colors',
        'serial_number',
        'bike_type',
        'main_photo.id',
        'main_photo.filename_download',
        'photos.directus_files_id.id',
        'photos.directus_files_id.filename_download'
        'is_electric',
        'bike_details'

    ])
    url = f'{os.environ["WORKER_DIRECTUS_URI"]}/items/report/{id}?fields={fields}&access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'

    data = requests.get(url)

    if data.status_code == 200:
        return data.json().get('data')


# Given its id, downloads a file from Directus and returns it as base64_string
def fetch_picture(id):
    url = f'{os.environ["WORKER_DIRECTUS_URI"]}/assets/{id}?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'
    print(url)
    data = requests.get(url)
    if 200 == data.status_code:
        return base64.b64encode(data.content)
    raise Exception(f"HTTP code: {data.status_code} for file id: {id}")

#
def fetch_rembg_picture(id):
    url = f'{os.environ["WORKER_DIRECTUS_URI"]}/assets/{id}?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'
    url = f'http://rembg:5000/api/remove?{urlencode({"url": url})}'
    print(url)
    data = requests.get(url)
    if 200 == data.status_code:
        return base64.b64encode(data.content)
    raise Exception(f"HTTP code: {data.status_code} for file id: {id}")




# Guess what? Sends an activation email
def send_activation_email(language, recipient, id, activation_code ):
     # @TODO temporary strings
    locale_file = f'/locales/{language}/translation.json'

    if not os.path.exists(locale_file):
        locale_file = '/locales/en/translation.json'

    with open(locale_file) as i18n_file:
        json_load = json.loads(i18n_file.read())
        i18n = dotmap.DotMap(json_load)


    activation_url = os.environ['WORKER_MAIN_PUBLIC_ACTIVATION_URL_PATTERN'].format(code=activation_code,id=id)
    x = send_email(
        recipient,
        os.environ["WORKER_MAIL_FROM"],
        placeholders_to_py(i18n.mailer.report_activation.subject),
        placeholders_to_py(i18n.mailer.report_activation.body.txt).format(activation_url=activation_url),
        placeholders_to_py(i18n.mailer.report_activation.body.html).format(activation_url=activation_url),
        relay=os.environ["WORKER_MAIL_RELAY"],
        dkim_private_key_path=os.environ["WORKER_MAIL_DKIM_PEM_PATH"],
        dkim_selector=os.environ["WORKER_MAIL_DKIM_SELECTOR"]
    );

    return x


def deindex_directus_report_item_from_weaviate(id):
    print(f"Deindexing {id}...")
    client = weaviate.Client(os.environ['WORKER_WEAVIATE_URI'])
    query_result = client.query\
        .get("Bike", ["report_id"])\
        .with_where({
            "path": ["report_id"],
            "operator": "Equal",
            "valueInt": id
        })\
        .with_additional("id")\
        .with_limit(50)\
        .do()

    for e in query_result.get('data',{}).get('Get',{}).get('Bike',[]):
        entry_id = e.get('_additional',{}).get('id')
        try:
            remove_weaviate_entry_by_id(entry_id)
        except Exception as e:
            print(e)
            pass

    return True


# As name suggests, removes a single entry from weaviate, given its id
def remove_weaviate_entry_by_id(entry_id):
    print(f"Removing {entry_id} from weaviate...")
    client = weaviate.Client(os.environ['WORKER_WEAVIATE_URI'])
    return client.data_object.delete(
        uuid=entry_id,
        class_name='Bike'
    )

def remove_directus_file_by_id(entry_id):
    print(f"Removing {entry_id} from directus...")
    url = f'{os.environ["WORKER_DIRECTUS_URI"]}/files/{entry_id}?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'
    data = requests.delete(url)
    print(data.status_code)
    return data.status_code



def index_directus_report_item_to_weaviate(payload):
    client = weaviate.Client(os.environ['WORKER_WEAVIATE_URI'])
    client.batch.configure(
        batch_size=None
    )

    # Data cleanup for better getters
    for e in ['location','bike_brand','bike_model','main_photo']:
        if payload.get(e) == None or payload.get(e) == "":
            payload[e] = {}

    try:
        bike_brand = payload.get('bike_brand_model',{}).get('bike_brand',{}).get('name')
    except:
        bike_brand = None

    try:
        bike_model = payload.get('bike_brand_model',{}).get('name')
    except:
        bike_model = None

    theft_date = None
    if payload.get('theft_date') and payload.get('theft_date') != "":
        theft_date = f"{payload.get('theft_date')}T00:00:00.0Z"

    metadata = {
        'report_id': payload['id'],
        'bike_brand': bike_brand,
        'bike_model': bike_model,
        "location": {
            "latitude": payload.get('location',{}).get('coordinates', [0,0])[1],
            "longitude": payload.get('location',{}).get('coordinates', [0,0])[0],
        },
        'theft_date': theft_date,
        'colors': payload.get('colors'),
        'tags': payload.get('tags'),
        'serial_number': payload.get('serial_number'),
        'bike_type': payload.get('bike_type'),
        'is_electric': payload.get('is_electric'),
        'bike_details': payload.get('bike_details')
    }
    print(metadata)

    with client.batch as batch:
        if 'main_photo' in payload and payload['main_photo'] is not None:
            main_photo_id = payload.get('main_photo',{}).get('id')
            if main_photo_id:
                b64 = fetch_picture(main_photo_id)

                data_object = copy.copy(metadata)
                data_object['image'] = b64.decode("ascii")
                data_object['filename_download'] = payload['main_photo']['filename_download']
                batch.add_data_object(
                    class_name="Bike",
                    data_object=data_object,
                    uuid=main_photo_id,
                )

                b64 = fetch_rembg_picture(payload['main_photo']['id'])

                data_object = copy.copy(metadata)
                data_object['image'] = b64.decode("ascii")
                data_object['filename_download'] = payload['main_photo']['filename_download']
                batch.add_data_object(
                    class_name="Bike",
                    data_object=data_object,
                )


        if 'photos' in payload and len(payload['photos']) > 0:
            for e in payload['photos']:
                phid = e['directus_files_id']['id']
                b64 = fetch_picture(phid)

                data_object = copy.copy(metadata)
                data_object['image'] = b64.decode("ascii")
                data_object['filename_download'] = e['directus_files_id']['filename_download']

                batch.add_data_object(
                    class_name="Bike",
                    data_object=data_object,
                    uuid=phid,
                )

        result = batch.create_objects()

        # More manageable result
        for idx, e in enumerate(result):
            result[idx]['properties']['image'] = None
            result[idx]['vector'] = None

        return result
