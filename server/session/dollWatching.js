const { STARTED } = require('../constants');
const { redisClient: client } = require('../create-redis-client');
const { publishData } = require('../utils/publishData');

const MIN_TIME = 2;
const MAX_TIME = 6;

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
                    const newTimer =
                        Math.floor(Math.random() * (MAX_TIME - MIN_TIME + 1)) +
                        MIN_TIME;
                    updateDollWatching(sessionId, newTimer);
                },
                !isDollWatching ? 250 : 0
            );
        }
    }, ms * 1000);
};

module.exports = { getDollWatching, updateDollWatching };
