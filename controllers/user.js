const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const responseUtil = require('../utils/response');
const debug = require('debug')('node-passport:express-app');

const signUp = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await hashPassword(password, salt);
        const user = {email, password: hash, role};
        if (!await userExist(email)) {
            const savedData = await new User(user).save();
            if (savedData) {
                delete user.password;
                responseUtil(res, true, "successfully registered", false, {...user, role: savedData.role}); 
            }
        } else {
            responseUtil(res, false, "user already exist", true);
        }
    } catch (err) {
        debug(`error while signup ${err}`)
        responseUtil(res, false, "error while signup", true, {error: err.message});
    }

}

const userExist = async (email) => {
    return User.findOne({email});
}

const login = async (req, res) => {

}

const hashPassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
}

const validatePassword = async (userPassword, hashPassword) => {
    return await bcrypt.compare(userPassword, hashPassword);
}

module.exports = {
    signUp,
    login
}