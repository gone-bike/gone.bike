import config from "@utils/config.js";
import directus from "@utils/directus.js";

export default async function() {
  try {
    let query = await directus.items('report').readByQuery({
      "limit": 10,
      "filter": { },
      "fields": [
        "id",
        "status",
        "location",
        "theft_date",
        "colors",
        "approximate_value",
        "approximate_value_currency",
        "bike_brand_model.name",
        "bike_brand_model.bike_brand.name",
        "bike_brand_model.bike_brand.key",
        "main_photo.id",
        "main_photo.filename_disk",
        "main_photo.type",
        "main_photo.width",
        "main_photo.height"
      ]
    });
    let data = query && query.data ? query.data : []
    return (!data || data.length == 0) ? false : data;

  } catch (e) {
    throw e
  }

}