const { createClient } = require('redis');

const createRedisClient = () => {
    const client = createClient({
        url: process.env.REDIS_URL,
    });
    client.on('error', (err) => console.log('Redis Client Error', err));
    client.connect();
    return client;
};

module.exports = { redisClient: createRedisClient() };
