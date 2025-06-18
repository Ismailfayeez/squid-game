const { STARTED, ALIVE, DEAD, FINISHED } = require('../constants');
const { redisClient: client } = require('../create-redis-client');
const { getDollWatching } = require('../session/dollWatching');
const { getPlayerData } = require('../session/getPlayerData');
const { publishData } = require('../utils/publishData');

const handleAction = async (action, { sessionId, name }) => {
    const gameStatus = await client.get(`status:${sessionId}`);
    const playerStatus = await client.hGet(
        `player:${sessionId}:${name}`,
        'status'
    );

    const setPlayer = async (key = 'status', value) =>
        await client.hSet(`player:${sessionId}:${name}`, key, value);

    if (gameStatus === STARTED && playerStatus === ALIVE) {
        if (action === 'MOVE') {
            const isDollWatching = await getDollWatching(sessionId);
            if (isDollWatching) {
                await setPlayer(DEAD);
                await setPlayer(Date.now(), 'timestamp');
            } else await client.hIncrBy(`player:${sessionId}:${name}`, 'x', 1);
        }
        if (action === 'FINISHED') {
            await setPlayer(FINISHED);
            await setPlayer(Date.now(), 'timestamp');
        }

        const playerData = await getPlayerData(sessionId, name);
        const data = {
            action,
            player: {
                [name]: playerData,
            },
        };

        publishData(sessionId, data);
    }
};

module.exports = { handleAction };
