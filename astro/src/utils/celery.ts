import Redis from 'ioredis'
import config from '@utils/config';

const redis = new Redis(parseInt(config.CELERY_REDIS_URI.port), config.CELERY_REDIS_URI.hostname)

/**
 * Small wrapper to perform a LPUSH on redis on the key passed as `username` in redis connection URI
 *
 * @param object
 * @returns
 */

export default async function(id: string, task: string, args: Array<any> , kwargs : object) {
    let body = [
        args,
        kwargs,
        {
            chord: null,
            callbacks: null,
            errbacks: null,
            chain: null,
        }
    ];
    let ts = new Date().getTime()

    let job = {
        body: Buffer.from(JSON.stringify(body)).toString('base64'),
        "content-encoding": 'utf-8',
        "content-type": 'application/json',
        headers: {
            lang: 'py',
            "task": task,
            "id": id,
            root_id: null,
            parent_id: null,
            argsrepr: JSON.stringify(body[0]),
            kwargsrepr: JSON.stringify(body[1]),
            ignore_result: false
        },
        properties: {
            priority: 0,
            body_encoding: 'base64',
            correlation_id: null,
            delivery_info: {
                routing_key: config.CELERY_REDIS_URI.username,
                exchange: config.CELERY_REDIS_URI.username
            },
            delivery_mode: 2,
            delivery_tag: `${id}.${ts}`,
        }
    };

    // ioredis supports the node.js callback style
    return await redis.lpush(config.CELERY_REDIS_URI.username, JSON.stringify(job))
};
