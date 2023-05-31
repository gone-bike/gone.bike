const Redis = require('ioredis')
const uuid = require('uuid');

const redis = new Redis(6379,"redis")
const routing = 'test';
const exchange = 'test';
const queue = 'test';

module.exports = async function(data) {
	let id = uuid.v4();
	let ts = new Date().getTime();
    let body = [
        [],
        {},
        {
            chord: null,
            callbacks: null,
            errbacks: null,
            chain: null,
        }
    ];
    let task;
    if (data['$trigger']['event'] == 'report.items.create') {
        task = 'tasks.report_create';
        body[0] = [ data['$trigger']['key'] ];
    }

    if (data['$trigger']['event'] == 'report.items.delete') {
        task = 'tasks.report_delete';
        body[0] = data['$trigger']['keys'];
    }
    if (data['$trigger']['event'] == 'report.items.update') {
        task = 'tasks.report_update';
        body[0] = data['$trigger']['keys'];
    }

    let job = {
        body: Buffer.from(JSON.stringify(body)).toString('base64'),
        "content-encoding": 'utf-8',
        "content-type": 'application/json',
        headers: {
            lang: 'py',
            task: task,
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
                routing_key: routing,
                exchange: exchange
            },
            delivery_mode: 2,
            delivery_tag: `${id}.${ts}`,
        }
    };

    // ioredis supports the node.js callback style
    let result = await redis.lpush(queue, JSON.stringify(job))



    return {
        result: result,
        job: job
    }
}