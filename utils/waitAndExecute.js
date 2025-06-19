const { statusList } = require('../events/handleSession');

let state = {
    timeoutId: '',
    resolver: '',
    status: '',
};

function waitAndExecute(cb, ms) {
    return new Promise((resolve) => {
        state.resolver = resolve;
        state.timeoutId = setTimeout(async () => {
            if (state.timeoutId) {
                await cb();
            }
            resolve();
        }, ms);
    });
}
const cancelSession = () => {
    state.timeoutId && clearTimeout(state.timeoutId);
    state.status = '';
    state.resolver?.();
};

const startSession = async (currentStatus, ...args) => {
    const status = currentStatus || state?.status;
    const i = statusList.findIndex((item) => item.status === status);
    const index = i !== -1 ? i : 0;
    const currentSession = statusList[index];
    await waitAndExecute(
        async () => {
            await currentSession.fn(...args);
            state.status = statusList[index + 1]?.status;
        },
        currentStatus ? 0 : currentSession.timer
    );
    state?.status && startSession(undefined, ...args);
};

module.exports = { startSession, cancelSession };
