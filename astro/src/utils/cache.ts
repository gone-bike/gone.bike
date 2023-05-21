import url from 'url';
import config from "@utils/config.js";
import cacheManager from 'cache-manager';
import { redisStore } from 'cache-manager-redis-store';


/**
 * Hand redis cache wrapper with grace period implementation
 */

const cache = {
    cache: null,
    wrapped: {},

    /**
     * Cache setter
     *
     * @param key
     * @param value
     * @param opts
     * @returns
     */
    set: async function(key : string, value : string, opts : object) {
        return await this.cache.set(key, value, opts)
    },

    /**
     * Cache getter
     *
     * @param key
     * @returns
     */
    get: async function(key : string) {
        return await this.cache.get(key);
    },

    /**
     * Cache wrapper: uses the return value of passed function as cache value
     * Implements grace period
     *
     * @param key
     * @param fn
     * @param opts Object with ttl and grace expressed as seconds
     * @returns
     */
    wrap: async function(key : string, fn : CallableFunction, opts : object) {
        let retval = await this.cache.get(key);

        let currentTs = (new Date()).getTime()
        let wrapped = this.wrapped[key];
        if (!! wrapped) {
            let hit = wrapped.ts + wrapped.ttl + wrapped.grace - currentTs;
            if (hit < wrapped.grace) {
                if (hit >= 0) {
                    this.wrapped[key].ts = (new Date()).getTime()
                    process.nextTick( (async function() {
                        await new Promise(r => setTimeout(r, 2000));
                        try {
                            let ttl = opts.ttl + opts.grace;
                            await this.cache.set(key, await fn(), { ttl: ttl })
                            clearTimeout(wrapped.t);
                            this.wrapped[key].t = setTimeout( (function() {
                                this[key] = null;
                                delete this[key];
                            }).bind(this.wrapped), ttl * 1000);
                        } catch (e) {
                            console.error(e)
                        }
                    }).bind(this));
                } else {
                    this.wrapped[key] = null;
                    delete this.wrapped[key];
                }
            }

        } else if (!retval && !!opts.ttl && !!opts.grace) {
            this.wrapped[key] = {
                ts: (new Date()).getTime(),
                ttl:  opts.ttl * 1000,
                grace: opts.grace * 1000,
                t: setTimeout( (function() {
                    this[key] = null;
                    delete this[key];
                }).bind(this.wrapped), ( opts.grace + opts.ttl) * 1000)
            }
        }

        if (!retval) {
            retval = await fn();
            if (typeof(reval) !== 'undefined') {
                await this.cache.set(key, retval, { ttl: (opts?.ttl||0) + (opts?.grace||0) } )
            }
        }

        return retval
    },

    /**
     * Creates a cache instance
     * @param opts
     * @returns
     */
    init: async function(opts : object = {} ) {
        let redis = new URL(config.REDIS_URI);

        this.cache = await cacheManager.caching( await redisStore({
          socket: {
            host: redis.hostname || '127.0.0.1',
            port: redis.port || 6379,
          },
          db: redis.pathname ? redis.pathname.replace('/','') :  0
        }) )

        return this
    }
};


cache.init();
export default cache;