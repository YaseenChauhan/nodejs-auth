const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const responseUtil = require('../utils/response');
const debug = require('debug')('node-passport:express-app');
const passwordUtil = require('../utils/password');
const tokenUtil = require('../utils/token');

const signUp = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await passwordUtil.hashPassword(password, salt);
        const user = {email, password: hashedPassword, role: role || "user"};
        if (!await userExist(email)) {
            const savedData = await new User(user).save();
            if (savedData) {
                delete user.password;
                return responseUtil(res, true, "successfully registered", false, {...user, role: savedData.role}); 
            }
        } else {
            return responseUtil(res, false, "user already exist", true);
        }
    } catch (err) {
        debug(`error while signup ${err}`)
        return responseUtil(res, false, "error while signup", true, {error: err.message});
    }

}

const userExist = async (email) => {
    return User.findOne({email});
}

const login = async (req, res) => {
    const { email , password } = req.body;
    const user = await userExist(email);
    console.log("user", user);
    if (!user) return responseUtil(res, false, "user does not exist", false);
    const validPassword = await passwordUtil.validatePassword(password, user.password);
    if (!validPassword) return responseUtil(res, false, "password is not correct", false);

    const access_token = await tokenUtil.generateAccessToken(user);
    return responseUtil(res, true, "login successfully", false, {email, role: user.role, access_token});
}



const authenticate = async (req, res, next) => {
    const accessToken = req.headers['access_token'];
    if (accessToken) {
        const { userId } = await tokenUtil.verifyAccessToken(accessToken);
        if (!userId) {
            return responseUtil(res, false, "access token expired!", true, {}); 
        }
        res.locals.loggedInUser = await User.findById(userId);
        return next();
    }
    return responseUtil(res, false, "access token not found", true, {});

}

module.exports = {
    signUp,
    login,
    authenticate
}