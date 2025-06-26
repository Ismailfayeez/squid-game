const { redisClient: client } = require('../create-redis-client');

const getPlayerData = async (sessionId, name) => {
    const x = await client.hGet(`player:${sessionId}:${name}`, 'x');
    const y = await client.hGet(`player:${sessionId}:${name}`, 'y');
    const posX = await client.hGet(`player:${sessionId}:${name}`, 'posX');
    const posY = await client.hGet(`player:${sessionId}:${name}`, 'posY');
    const status = await client.hGet(`player:${sessionId}:${name}`, 'status');
    const timeStamp = await client.hGet(
        `player:${sessionId}:${name}`,
        'timestamp'
    );
    return { x, y, posX, posY, status, timeStamp };
};
module.exports = { getPlayerData };
