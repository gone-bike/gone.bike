import requests, json, dotmap, os, re, weaviate, base64

from mailer import send_email

# Converts placeholders into python string.format() friendly.
# From "Hello {{ var }}" to "Hello {var}"
def placeholders_to_py(str):
    return re.sub(r'\{\{\s*([a-zA-Z0-9_]+)\s*\}\}', r'{\1}', str)

# Give its id, downloads a file from Directus and returns it as base64_string
def fetch_picture(id):
    url = f'{os.environ["WORKER_DIRECTUS_URI"]}/assets/{id}?access_token={os.environ["WORKER_DIRECTUS_TOKEN"]}'
    print(url)
    data = requests.get(url)
    if 200 == data.status_code:
        return base64.b64encode(data.content)
    raise Exception(f"HTTP code: {data.status_code} for file id: {id}")

# Guess what? Sends an activation email
def send_activation_email(language, recipient, activation_code ):
     # @TODO temporary strings
    locale_file = f'/locales/{language}/translation.json'

    if not os.path.exists(locale_file):
        locale_file = '/locales/en/translation.json'

    with open(locale_file) as i18n_file:
        json_load = json.loads(i18n_file.read())
        i18n = dotmap.DotMap(json_load)


    activation_url = os.environ['WORKER_MAIN_PUBLIC_ACTIVATION_URL_PATTERN'].format(code=activation_code)
    x = send_email(
        recipient,
        os.environ["WORKER_MAIL_FROM"],
        placeholders_to_py(i18n.mailer.report_activation.subject),
        placeholders_to_py(i18n.mailer.report_actiovation.body.txt).format(activation_url=activation_url),
        placeholders_to_py(i18n.mailer.report_actiovation.body.html).format(activation_url=activation_url),
        relay=os.environ["WORKER_MAIL_RELAY"],
        dkim_private_key_path=os.environ["WORKER_MAIL_DKIM_PEM_PATH"],
        dkim_selector=os.environ["WORKER_MAIL_DKIM_SELECTOR"]
    );

    return x




def index_directus_report_item_to_weaviate(payload):
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
                    'report_id': None, # int(key), -- @TODO
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
                        'report_id': None, # int(key), -- @TODO
                        'image': b64.decode("ascii")
                    },
                    uuid=phid,
                )

        return batch.create_objects()
