
let db = new URL(process.env.DB_URI || import.meta.env.DB_URI || 'postgresql://127.0.0.1:5432/postgres')
let weaviate = new URL(process.env.WEAVIATE_URI || import.meta.env.WEAVIATE_URI ||  'http://localhost:8080')
let celery_redis = new URL(process.env.CELERY_REDIS_URI || import.meta.env.CELERY_REDIS_URI || 'redis://127.0.0.1:6379/0')

/**
 * Helper class to retrive config from env var or local file
 */

const config = {

    IMG_MAX_H: process.env.IMG_MAX_H || import.meta.env.IMG_MAX_H || 2048,
    IMG_MAX_W: process.env.IMG_MAX_W || import.meta.env.IMG_MAX_W || 2048,


    WEAVIATE_URI: weaviate,

    CELERY_REDIS_URI: celery_redis,

    REDIS_URI: process.env.REDIS_URI || import.meta.env.REDIS_URI || 'redis://127.0.0.1:6379/0',

    REPORT_OBJECT_CACHE_TTL: parseInt(process.env.REDIS_URI || import.meta.env.REDIS_URI) || 1,

    DIRECTUS_URI: process.env.DIRECTUS_URI || import.meta.env.DIRECTUS_URI,
    DIRECTUS_TOKEN: process.env.DIRECTUS_TOKEN || import.meta.env.DIRECTUS_TOKEN,

    DB: {
        host: db.hostname,
        port: db.port,
        user: db.username,
        password: db.password,
        database: db.pathname.slice(1)
    },


    /**
     * Runs a 404 page. Shortcut to return a not-found page by fetching internal 404 page and return it
     *
     * @returns Response
     */
    http404: async function () {
        let html, status, url = process.env.NOT_FOUND_INTERNAL_URL || import.meta.env.NOT_FOUND_INTERNAL_URL || "http://localhost:3000/404"
        try {
            const response = await fetch(url);
            html = await response.body;
            status = 404
        } catch (e) {
            console.error(e)
            html = 'internal error'
            status = 400
        }
        return new Response(html, {
            status: status,
        });

    }
};
export default config;