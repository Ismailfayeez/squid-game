const { GAME_TIME, ROW_COUNT } = require('../constants');
const { redisClient: client } = require('../create-redis-client');
const { getPlayersData } = require('./getPlayersData');

const getSessionData = async (sessionId) => {
    const startTime = (await client.get(`startTime:${sessionId}`)) || 0;
    const members = await client.sMembers(`players:${sessionId}`);
    const status = await client.get(`status:${sessionId}`);
    const dollWatching = (await client.get(`doll:${sessionId}`)) || false;
    const players = getPlayersData(sessionId);

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
