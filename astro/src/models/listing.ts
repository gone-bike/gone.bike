import config from "@utils/config.js";
import directus from "@utils/directus.js";

export default async function (queryOptions = {}) {
  try {
    let query = await directus.items("report").readByQuery({
      /* filter: {
        status: "published"
      }, */
      fields: [
        "id",

        "theft_date",

        "location_address",

        "bike_brand_model.name",
        "bike_brand_model.bike_brand.name",
        "bike_brand_model.bike_brand.key",
        "main_photo.id",
        "main_photo.filename_download",
        "main_photo.type",
        "main_photo.width",
        "main_photo.height",
        "photos.*.filename_download",
        "photos.*.id",
        "photos.*.type",
        "photos.*.width",
        "photos.*.height"
      ],

      limit: 10,
      meta: ["total_count", "filter_count"],
      ...queryOptions
    });

    const data = query && query.data && query.data.length > 0 ? query.data : [];
    return data;
  } catch (e: any) {
    // console.log(e);
    throw e;
  }
}
