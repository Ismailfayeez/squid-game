const { GAME_TIME, ROW_COUNT } = require('../constants');
const { redisClient: client } = require('../create-redis-client');

const getSessionData = async (sessionId) => {
    const startTime = (await client.get(`startTime:${sessionId}`)) || 0;
    const members = await client.sMembers(`players:${sessionId}`);
    const status = await client.get(`status:${sessionId}`);
    const dollWatching = (await client.get(`doll:${sessionId}`)) || false;
    const players = {};

    for (const member of members) {
        const playerName = `player:${sessionId}:${member}`;
        const player = await client.hGetAll(playerName);
        players[member] = player;
    }

    return {
        status,
        startTime,
        gameTime: GAME_TIME,
        rowCount: ROW_COUNT,
        members,
        gameStat: { dollWatching, players },
    };
};

module.exports = { getSessionData };
