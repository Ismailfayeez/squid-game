const { START_GAME } = require('../constants');
const { handleAction } = require('./handleAction');
const { handleStart } = require('./handleStart');

const handleMessage = (data, user) => {
    const { action } = JSON.parse(data.toString());
    if (action === START_GAME) handleStart(user.sessionId);
    else handleAction(action, user);
};

module.exports = { handleMessage };
