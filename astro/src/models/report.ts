import config from "@utils/config.js";
import directus from "@utils/directus.js";

console.log(config.DEV_DATA_MODE)
export default async function(id: bigint) {
  try {
    let query = await directus.items('report').readByQuery({
      "filter": {
        "id": {
          "_eq": id
        }
      },
      "fields": [
        "id",
        "status",
        "description",
        "location",
        "theft_date",
        "theft_timeframe",
        "theft_location_type",
        "colors",
        "serial_number",
        "approximate_value",
        "approximate_value_currency",
        "lock_type",
        "lock_anchor",
        "photos.directus_files_id.id",
        "photos.directus_files_id.filename_disk",
        "photos.directus_files_id.type",
        "photos.directus_files_id.width",
        "photos.directus_files_id.height",
        "bike_brand_model.name",
        "bike_brand_model.bike_brand.name",
        "bike_brand_model.bike_brand.key",
        "language.locale_code",
        "main_photo.id",
        "main_photo.filename_disk",
        "main_photo.type",
        "main_photo.width",
        "main_photo.height"
      ]
    });
    let data = query && query.data && query.data.length == 1 ? query.data[0] : []


    if (!data || data.length == 0) {
      return false;
    }

    data.getPhotos = function() {
      if (config.DEV_DATA_MODE ) {
        return [
          'https://placehold.co/600x400/orange/white',
          'https://placehold.co/600x400/orange/white'

        ];
      } else {
        return []
      }
    };

    return data;

  } catch (e) {
    throw e
  }


}