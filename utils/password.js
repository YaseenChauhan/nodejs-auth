const bcrypt = require('bcrypt');
const crypto = require('crypto');

const hashPassword = async (password, salt) => {
    // const salt = crypto.randomBytes(32).toString('hex');
    // return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512');
    return await bcrypt.hash(password, salt);
}

const validatePassword = async (userPassword, hashPassword) => {
    // const hashVerify = crypto.pbkdf2Sync(userPassword, salt, 10000, 64, 'sha512').toString();
    // return hashPassword == hashVerify
    return await bcrypt.compare(userPassword, hashPassword);
}

module.exports = {
    hashPassword,
    validatePassword
}