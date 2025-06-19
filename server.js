const express = require('express');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const { wss } = require('./create-ws-server');
const { redisClient: client } = require('./create-redis-client');
const { parseJWTData } = require('./utils/parseJWT');
const { getSessionData } = require('./session/sessionData');
const { handleStart } = require('./events/handleStart');
const { updateSession, createSession } = require('./session/session');
const { publishDataExceptMe } = require('./utils/publishData');
const { PLAYER_JOINED, NOT_STARTED } = require('./constants');
const { getPlayerData } = require('./session/getPlayerData');
const { handleMessage } = require('./events/handleMessage');

dotenv.config();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: 'https://squid-game-spa-a4j2.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
};

const app = express();
const appServer = http.createServer(app);

app.use(cors(corsOptions));

wss.on('connection', async (ws, request) => {
    const { sessionId, name, code } = parseJWTData(request.headers.cookie);
    ws.session = sessionId;

    ws.on('message', async (data = {}) => {
        handleMessage(data, { sessionId, name });
    });
    ws.on('error', console.error);

    const sessionData = await getSessionData(sessionId);
    const stat = await getPlayerData(sessionId, name);

    ws.send(JSON.stringify({ ...sessionData, code, me: { name } }));

    publishDataExceptMe(ws, sessionId, {
        action: PLAYER_JOINED,
        name,
        stat,
    });

    handleStart(sessionId, true);
});

app.use(express.json());

app.post('/join', async (req, res) => {
    const { name } = req.body;

    if (!name)
        return res.status(400).json({ error: 'name should not be empty' });

    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    const { token } = await createSession(name);

    res.cookie(tokenHeaderKey, token, {
        httpOnly: false,
        sameSite: 'strict',
    });

    res.status(200).send('success');
});

app.patch('/join', async (req, res) => {
    const { name, code } = req.body;
    if (!(name && code))
        return res
            .status(400)
            .json({ error: 'name & code should not be empty' });

    const sessionId = await client.get(code);
    const status = await client.get(`status:${sessionId}`);

    if (status !== NOT_STARTED)
        return res.status(400).json({ error: 'invalid or expired code' });

    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    const { token } = await updateSession(name, code);

    res.cookie(tokenHeaderKey, token, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
    });

    res.status(200).send('success');
});

appServer.on('upgrade', (request, socket, head) => {
    console.log();
    const { pathname } = new URL(
        `http://${process.env.HOST ?? 'localhost'}${request.url}`
    );
    const { err } = parseJWTData(request.headers.cookie || '');

    if (pathname === '/game' && !err) {
        wss.handleUpgrade(request, socket, head, (ws, request) => {
            wss.emit('connection', ws, request);
        });
    } else {
        console.log('else called');
        socket.write('HTTP/1.1 400 Bad request\r\n\r\n');
        socket.destroy();
    }
});

appServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
