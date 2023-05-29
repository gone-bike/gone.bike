import config from "@utils/config.js";
import directus from "@utils/directus.js";

export default async function(id: string | null) {
  try {
    let query = await directus.items('bike_brand_model').readByQuery({
      "filter": {
        "bike_brand": {
          "_eq": id
        }
      },
      "fields": [
        "key",
        // "id",
        "name"
      ],
      "alias": {
        "key": "id"
      }
    });
    return query && query.data ? query.data : []

  } catch (e) {
    throw e
  }


}