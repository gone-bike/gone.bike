import config from "@utils/config.js";
import directus from "@utils/directus.js";
import type { BikeModel } from "@app-types/bike_model";

export default async function ({
  id = "",
  showBrand = false
}: BikeModel.BikeModelProps) {
  try {
    const fields = showBrand
      ? ["bike_brand.name", "key", "name"]
      : ["key", "name"];

    const filter = id
      ? {
          bike_brand: {
            _eq: id
          }
        }
      : {};

    let query = await directus.items("bike_brand_model").readByQuery({
      filter,
      fields,
      alias: {
        key: "id"
      }
    });
    return query && query.data ? query.data : [];
  } catch (e) {
    throw e;
  }
}
