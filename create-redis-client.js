const { createClient } = require('redis');

const createRedisClient = () => {
    const client = createClient({
        url: 'rediss://red-d191rt7fte5s73bthkp0:j9XbiexiBXDaqvC7KdAFUKOfsD8R0Cae@oregon-keyvalue.render.com:6379',
    });
    client.on('error', (err) => console.log('Redis Client Error', err));
    client.connect();
    return client;
};

module.exports = { redisClient: createRedisClient() };
