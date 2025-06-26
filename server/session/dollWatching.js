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

            publishData(sessionId, {
                action: 'DOLLWATCHING',
                value: isDollWatching ? false : true,
            });

            setTimeout(
                async () => {
                    await client.set(
                        `doll:${sessionId}`,
                        isDollWatching ? 0 : 1
                    );
                    const randomNumber = Math.floor(Math.random() * 7) + 2;
                    updateDollWatching(sessionId, randomNumber);
                },
                !isDollWatching ? 300 : 0
            );
        }
    }, ms * 1000);
};

module.exports = { getDollWatching, updateDollWatching };
