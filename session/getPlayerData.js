const { redisClient: client } = require('../create-redis-client');

const getPlayerData = async (sessionId, name) => {
    const x = await client.hGet(`player:${sessionId}:${name}`, 'x');
    const y = await client.hGet(`player:${sessionId}:${name}`, 'y');
    const status = await client.hGet(`player:${sessionId}:${name}`, 'status');
    return { x, y, status };
};
module.exports = { getPlayerData };
