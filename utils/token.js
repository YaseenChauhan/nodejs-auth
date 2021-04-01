const jwt = require('jsonwebtoken');
const config = require('../config/environments');

const generateAccessToken = async (user) => {
    return await jwt.sign({ userId: user._id, iat: Date.now() }, config.JWT_SECRET, {
        expiresIn: 60 * 5
    });
}

const verifyAccessToken = async (accessToken) => {
    const { userId, exp } = await jwt.verify(accessToken, config.JWT_SECRET);
        if (exp < Date.now().valueOf()) return { userId: null }
        return { userId }
}

module.exports = {
    generateAccessToken,
    verifyAccessToken
}