const { getSessionData } = require('../session/sessionData');
const { startSession } = require('../utils/waitAndExecute');
const {
    NOT_STARTED,

    MAX_ALLOW_PLAYERS,
    MIN_REQD_PLAYERS,
    PREPARING,
} = require('../constants');

const handleStart = async (sessionId, autoStart) => {
    const { members, status } = await getSessionData(sessionId);
    if (autoStart && members.length !== MAX_ALLOW_PLAYERS) return;
    if (status === NOT_STARTED && members.length >= MIN_REQD_PLAYERS)
        startSession({ status: PREPARING, timer: 0 }, sessionId);
};

module.exports = { handleStart };
