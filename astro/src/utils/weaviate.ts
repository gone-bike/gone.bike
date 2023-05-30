import weaviate from 'weaviate-ts-client';
import config from '@utils/config';

console.log(config)

const client = weaviate.client({
    scheme: config.WEAVIATE_URI.protocol.replace(':',''),
    host: config.WEAVIATE_URI.host
});

export default client