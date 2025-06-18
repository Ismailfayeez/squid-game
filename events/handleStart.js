const { redisClient: client } = require('../create-redis-client');
const { updateDollWatching } = require('../session/dollWatching');
const { getSessionData } = require('../session/sessionData');
const { publishData, closeConnection } = require('../utils/publishData');
const { waitAndExecute } = require('../utils/waitAndExecute');
const {
    NOT_STARTED,
    PREPARING,
    READY,
    STARTED,
    ENDED,
    ALIVE,
    DEAD,
    SCORE_BOARD,
    MAX_ALLOW_PLAYERS,
    MIN_REQD_PLAYERS,
    GAME_TIME,
    INSTRUCT,
} = require('../constants');
const { setInitialPath } = require('../session/setInitialPostion');
const { clearSession } = require('../session/clearSession');

const handleStart = async (sessionId, autoStart) => {
    const { members, status } = await getSessionData(sessionId);
    if (autoStart && members.length !== MAX_ALLOW_PLAYERS) return;
    if (status === NOT_STARTED && members.length >= MIN_REQD_PLAYERS) {
        await client.set(`status:${sessionId}`, PREPARING);

        publishData(sessionId, {
            status: PREPARING,
        });

        await setInitialPath(sessionId);
        const { status, gameStat, code } = await getSessionData(sessionId);
        publishData(sessionId, { status, gameStat, code });

        await waitAndExecute(async () => {
            await client.set(`status:${sessionId}`, INSTRUCT);
            publishData(sessionId, {
                status: INSTRUCT,
            });
        }, 10000);

        await waitAndExecute(async () => {
            await client.set(`status:${sessionId}`, READY);
            publishData(sessionId, {
                status: READY,
            });
        }, 7000);

        await waitAndExecute(async () => {
            const startTime = Date.now();
            await client.set(`startTime:${sessionId}`, startTime);
            await client.set(`status:${sessionId}`, STARTED);
            publishData(sessionId, {
                status: STARTED,
                startTime,
            });
            updateDollWatching(sessionId, 1);
        }, 3000);

        await waitAndExecute(async () => {
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
        }, GAME_TIME);
        await waitAndExecute(async () => {
            await client.set(`status:${sessionId}`, SCORE_BOARD);
            publishData(sessionId, {
                status: SCORE_BOARD,
            });
            closeConnection(sessionId);
            clearSession(sessionId);
        }, 2000);
    }
};

module.exports = { handleStart };
