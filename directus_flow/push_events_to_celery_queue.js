const Redis = require('ioredis')
const uuid = require('uuid');

const redis = new Redis(6379,"redis")

module.exports = async function(data) {
	let id = uuid.v4();
	let ts = new Date().getTime();
    let body = [
        [],
        data,
        {
            chord: null,
            callbacks: null,
            errbacks: null,
            chain: null,
        }
    ];


    let job = {
        body: Buffer.from(JSON.stringify(body)).toString('base64'),
        "content-encoding": 'utf-8',
        "content-type": 'application/json',
        headers: {
            lang: 'py',
            task: 'tasks.test',
            id: id,
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
                routing_key: "celery",
                exchange: 'celery'
            },
            delivery_mode: 2,
            delivery_tag: `${id}.${ts}`,
        }
    };

    let result = await redis.lpush("celery", JSON.stringify(job))

    return {
        result: result,
        job: job
    }
}
