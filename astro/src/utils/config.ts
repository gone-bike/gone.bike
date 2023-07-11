/**
 * Helper class to retrive config from env var (when running with docker) or local file (when running in dev)
 *
 * File is getting verbose. @TODO - find a smarter way to handle it
 */

let getv = function (name: string, def: any) {
  return process.env[name] || import.meta.env[name] || def;
};

const config = {
  CELERY_REDIS_URI: new URL(
    getv("CELERY_REDIS_URI", "redis://celery:@127.0.0.1:6379/0")
  ),
  CLOUDFLARE_CAPTCHA_KEY: getv(
    "CLOUDFLARE_CAPTCHA_KEY",
    "3x00000000000000000000FF"
  ),
  CLOUDFLARE_CAPTCHA_SECRET: getv(
    "CLOUDFLARE_CAPTCHA_SECRET",
    "2x0000000000000000000000000000000AA"
  ),
  DEV_DATA_MODE: getv("DEV_DATA_MODE", 0),
  DIRECTUS_TOKEN: getv("DIRECTUS_TOKEN", "dev"),
  DIRECTUS_URI: getv("DIRECTUS_URI", "http://localhost:8055"),
  GB_SUBMIT_KEY: getv("GB_SUBMIT_KEY", "dev"),
  GMAP_API_KEY: getv("GMAP_API_KEY", ""),
  IMG_MAX_H: getv("IMG_MAX_H", 2048),
  IMG_MAX_W: getv("IMG_MAX_W", 2048),
  IMG_QUALITY: getv("IMG_QUALITY", 90),
  INTERNAL_URI: getv("INTERNAL_URI", "http://localhost:3000"),
  MAX_PHOTOS_UPLOAD: getv("MAX_PHOTOS_UPLOAD", 4),
  PAGE_SIZE: getv("PAGE_SIZE", 8),
  POSTGRES_URI: new URL(getv("DB_URI", "postgresql://127.0.0.1:5432/postgres")),
  REDIS_URI: getv("REDIS_URI", "redis://127.0.0.1:6379/0"),
  REPORT_OBJECT_CACHE_TTL: parseInt(getv("REDIS_URI", 1)),
  SEARCH_REDIS_URI: new URL(
    getv("SEARCH_REDIS_URI", "redis://search:@127.0.0.1:6379/0")
  ),
  WEAVIATE_URI: new URL(getv("WEAVIATE_URI", "http://127.0.0.1:8080")),
  TMP_FOLDER_IMAGE: getv("TMP_FOLDER_IMAGE", ""),

  RELATIVE_TIME_WEEK_IN_DAYS: getv("RELATIVE_TIME_WEEK_IN_DAYS", 7),
  RELATIVE_TIME_MONTH_IN_DAYS: getv("RELATIVE_TIME_WEEK_IN_DAYS", 30),
  RELATIVE_TIME_YEAR_IN_DAYS: getv("RELATIVE_TIME_WEEK_IN_DAYS", 365),

  DAYS_IN_YEAR: getv("DAYS_IN_YEAR", 365),
  DAYS_IN_MONTH: getv("DAYS_IN_YEAR", 30),
  DAYS_IN_WEEK: getv("DAYS_IN_YEAR", 7),

  /**
   * Runs a 404 page. Shortcut to return a not-found page by fetching internal 404 page and return it
   * This is a hackish way to return custom 404 page on server-side conditions
   *
   * @returns Response
   */
  http404: async function () {
    let html,
      status,
      url =
        process.env.NOT_FOUND_INTERNAL_URL ||
        import.meta.env.NOT_FOUND_INTERNAL_URL ||
        "/404";
    try {
      const response = await fetch(`${this.INTERNAL_URI}${url}`);
      html = await response.body;
      status = 404;
    } catch (e) {
      console.error(e);
      html = "internal error";
      status = 400;
    }
    return new Response(html, {
      status: status
    });
  }
};
export default config;
