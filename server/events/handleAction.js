const {
    STARTED,
    ALIVE,
    DEAD,
    FINISHED,
    ENDED,
} = require('../constants');
const { redisClient: client } = require('../create-redis-client');
const { getDollWatching } = require('../session/dollWatching');
const { getPlayerData } = require('../session/getPlayerData');
const { getPlayersData } = require('../session/getPlayersData');
const { publishData } = require('../utils/publishData');
const { cancelSession, startSession } = require('../utils/waitAndExecute');

const handleAction = async (action, { sessionId, name }) => {
    const gameStatus = await client.get(`status:${sessionId}`);
    const playerStatus = await client.hGet(
        `player:${sessionId}:${name}`,
        'status'
    );

    const setPlayer = async (value, key = 'status') =>
        await client.hSet(`player:${sessionId}:${name}`, key, value);

    if (gameStatus === STARTED && playerStatus !== DEAD) {
        if (action === 'MOVE') {
            const isDollWatching = await getDollWatching(sessionId);
            if (isDollWatching && playerStatus == ALIVE) {
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

        const players = await getPlayersData(sessionId);
        const isAnyOneAlive = Object.values(players).find(
            (player) => player.status === ALIVE
        );
        if (!isAnyOneAlive) {
            await cancelSession();
            startSession(ENDED, sessionId);
        }
    }
};

module.exports = { handleAction };
