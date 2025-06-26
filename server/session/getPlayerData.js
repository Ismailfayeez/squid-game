const { redisClient: client } = require('../create-redis-client');

const getPlayerData = async (sessionId, name) =>
    await client.hGetAll(`player:${sessionId}:${name}`);

module.exports = { getPlayerData };
