import Redis from 'ioredis'
import config from '@utils/config';
import { v4 as uuidv4 } from 'uuid';

const redis = new Redis(parseInt(config.SEARCH_REDIS_URI.port), config.SEARCH_REDIS_URI.hostname)

/**
 */

export default {
  ttl: 600,

  create: async function(b64: string) {
    let uuid = uuidv4();
    await redis.setex(`${config.CELERY_REDIS_URI.username}:${uuid}`, this.ttl, b64)
    return uuid
  },

  load: async function(uuid: string) {
    return await redis.get(`${config.CELERY_REDIS_URI.username}:${uuid}`)
  },

  extend: async function(uuid: string) {
    return await redis.expire(`${config.CELERY_REDIS_URI.username}:${uuid}`, this.ttl)
  }

}
