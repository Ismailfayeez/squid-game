function waitAndExecute(cb, ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            cb();
            resolve();
        }, ms);
    });
}

module.exports = { waitAndExecute };
