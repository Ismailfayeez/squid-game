const { redisClient: client } = require('../create-redis-client');

const clearSession = async (sessionId) => {
    await client.del(`status:${sessionId}`);
    await client.del(`startTime:${sessionId}`);
    await client.del(`doll:${sessionId}`);
    const members = await client.sMembers(`players:${sessionId}`);
    await Promise.all(
        members.map((member) => client.del(`player:${sessionId}:${member}`))
    );
    await client.del(`players:${sessionId}`);
};

module.exports = { clearSession };
