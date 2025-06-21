const { wss } = require('../create-ws-server');

const publishData = (sessionId, data) => {
    wss.clients.forEach((wsClient) => {
        if (wsClient.session === sessionId) {
            wsClient.send(JSON.stringify(data));
        }
    });
};
const publishDataExceptMe = (ws, sessionId, data) => {
    wss.clients.forEach((wsClient) => {
        if (wsClient !== ws && wsClient.session === sessionId) {
            wsClient.send(JSON.stringify(data));
        }
    });
};

const closeConnection = (sessionId) => {
    wss.clients.forEach((wsClient) => {
        if (wsClient.session === sessionId) {
            wsClient.close();
        }
    });
};

module.exports = { publishData, publishDataExceptMe, closeConnection };
