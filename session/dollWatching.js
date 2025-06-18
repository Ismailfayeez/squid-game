const { STARTED } = require('../constants');
const { redisClient: client } = require('../create-redis-client');
const { publishData } = require('../utils/publishData');

const getDollWatching = async (sessionId) =>
    (await client.get(`doll:${sessionId}`)) === '1';

const updateDollWatching = (sessionId, ms) => {
    setTimeout(async () => {
        const gameStatus = await client.get(`status:${sessionId}`);

        if (gameStatus === STARTED) {
            const isDollWatching = await getDollWatching(sessionId);

            await client.set(`doll:${sessionId}`, isDollWatching ? 0 : 1);

            publishData(sessionId, {
                action: 'DOLLWATCHING',
                value: isDollWatching ? false : true,
            });

            const randomNumber = Math.floor(Math.random() * 7) + 1;
            updateDollWatching(sessionId, randomNumber);
        }
    }, ms * 1000);
};

module.exports = { getDollWatching, updateDollWatching };
