const { redisClient: client } = require('../create-redis-client');
const { updateDollWatching } = require('../session/dollWatching');
const { getSessionData } = require('../session/sessionData');
const { publishData, closeConnection } = require('../utils/publishData');
const {
    PREPARING,
    READY,
    STARTED,
    ENDED,
    ALIVE,
    DEAD,
    SCORE_BOARD,
    GAME_TIME,
    INSTRUCT,
} = require('../constants');
const { setInitialPath } = require('../session/setInitialPostion');
const { clearSession } = require('../session/clearSession');

const statusList = [
    {
        status: PREPARING,
        timer: 0,
        fn: async (sessionId) => {
            await client.set(`status:${sessionId}`, PREPARING);

            publishData(sessionId, {
                status: PREPARING,
            });

            await setInitialPath(sessionId);
            const { status, gameStat, code } = await getSessionData(sessionId);
            publishData(sessionId, { status, gameStat, code });
        },
    },
    {
        status: INSTRUCT,
        timer: 5000,
        fn: async (sessionId) => {
            await client.set(`status:${sessionId}`, INSTRUCT);
            publishData(sessionId, {
                status: INSTRUCT,
            });
        },
    },
    {
        status: READY,
        timer: 7000,
        fn: async (sessionId) => {
            await client.set(`status:${sessionId}`, READY);
            publishData(sessionId, {
                status: READY,
            });
        },
    },
    {
        status: STARTED,
        timer: 3000,
        fn: async (sessionId) => {
            const startTime = Date.now();
            await client.set(`startTime:${sessionId}`, startTime);
            await client.set(`status:${sessionId}`, STARTED);
            publishData(sessionId, {
                status: STARTED,
                startTime,
            });
            updateDollWatching(sessionId, 1);
        },
    },
    {
        status: ENDED,
        timer: GAME_TIME,
        fn: async (sessionId) => {
            await client.set(`status:${sessionId}`, ENDED);
            publishData(sessionId, {
                status: ENDED,
            });

            const members = await client.sMembers(`players:${sessionId}`);
            for (const member of members) {
                const player = await client.hGetAll(
                    `player:${sessionId}:${member}`,
                    'status'
                );
                if (player.status === ALIVE) {
                    await client.hSet(
                        `player:${sessionId}:${member}`,
                        'status',
                        DEAD
                    );
                    player.status = DEAD;
                    publishData(sessionId, {
                        action: 'MOVE',
                        player: {
                            [member]: player,
                        },
                    });
                }
            }
        },
    },
    {
        status: SCORE_BOARD,
        timer: 3000,
        fn: async (sessionId) => {
            await client.set(`status:${sessionId}`, SCORE_BOARD);
            publishData(sessionId, {
                status: SCORE_BOARD,
            });
            closeConnection(sessionId);
            clearSession(sessionId);
        },
    },
];

module.exports = { statusList };
