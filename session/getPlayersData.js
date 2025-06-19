const { redisClient: client } = require('../create-redis-client');

const getPlayersData = async (sessionId) => {
    const players = {};
    const members = await client.sMembers(`players:${sessionId}`);
    for (const member of members) {
        const playerName = `player:${sessionId}:${member}`;
        const player = await client.hGetAll(playerName);
        players[member] = player;
    }
    return players;
};

module.exports = { getPlayersData };
