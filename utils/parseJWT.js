const cookie = require('cookie');
const jwt = require('jsonwebtoken');

const parseJWTData = (cookieHeader) => {
    const cookies = cookie.parse(cookieHeader || '');
    let payload = {};
    try {
        const data = jwt.verify(
            cookies[process.env.TOKEN_HEADER_KEY],
            process.env.JWT_SECRET_KEY
        );
        payload = { ...data };
    } catch (err) {
        console.log(err);
        payload = { err };
    }

    return payload;
};

module.exports = { parseJWTData };
