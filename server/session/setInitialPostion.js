const { redisClient: client } = require('../create-redis-client');
const { getInitialPosition } = require('../utils/getInitialPosition');

const setInitialPath = async (sessionId) => {
    const members = await client.sMembers(`players:${sessionId}`);
    const players = getInitialPosition(members);

    for (const { name, y, posX, posY } of players) {
        await client.hSet(`player:${sessionId}:${name}`, 'posX', posX);
        await client.hSet(`player:${sessionId}:${name}`, 'posY', posY);
        await client.hSet(`player:${sessionId}:${name}`, 'y', y);
        await client.hSet(`player:${sessionId}:${name}`, 'x', 0);
        await client.hSet(`player:${sessionId}:${name}`, 'status', 'ALIVE');
    }
};
module.exports = { setInitialPath };
