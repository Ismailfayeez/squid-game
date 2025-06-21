const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { redisClient: client } = require('../create-redis-client');
const { NOT_STARTED, ALIVE } = require('../constants');

const createSession = async (name) => {
    const sessionId = uuidv4();
    const code = Math.random().toString(32).substring(7);

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ name, code, sessionId }, jwtSecretKey);

    await client.set(code, sessionId);
    await client.set(`status:${sessionId}`, NOT_STARTED);
    await client.sAdd(`players:${sessionId}`, name);
    await client.hSet(`player:${sessionId}:${name}`, {
        x: 0,
        y: 0,
        status: ALIVE,
    });
    return { token };
};

const updateSession = async (name, code) => {
    const sessionId = await client.get(code);

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ name, code, sessionId }, jwtSecretKey);

    await client.sAdd(`players:${sessionId}`, name);
    await client.hSet(`player:${sessionId}:${name}`, {
        x: 0,
        y: 0,
        status: ALIVE,
    });
    return { token };
};

module.exports = { createSession, updateSession };
