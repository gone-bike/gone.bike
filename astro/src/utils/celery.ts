import Redis from 'ioredis'
import config from '@utils/config';

const redis = new Redis(parseInt(config.CELERY_REDIS_URI.port), config.CELERY_REDIS_URI.hostname)



export default redis