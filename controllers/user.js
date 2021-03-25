const User = require('../models/user.model');
const { roles } = require('../roles');
const responseUtil = require('../utils/response');

const getUsers = async (req, res) => {
    let users = await User.find({});
    users = users.map(user => {
        user = user.toObject();
        delete user.password;
        return user;
    })
    return responseUtil(res, true, "successfully fetched", false, users);
}

const getUser = async (req, res) => {
    const userId = req.params.userId;
    let user = await User.findById(userId);
    if (!user) responseUtil(res, false, "user not found", false);
    user = user.toObject();
    delete user.password;
    return responseUtil(res, true, "successfully fetched", false, user);
}

const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const dataToUpdate = req.body;
    const userExist = await User.findById(userId);
    if (!userExist) responseUtil(res, false, "user not found", false);
    const upadtedData = await User.findByIdAndUpdate(userId, dataToUpdate);
    const dataToSend = {};
    if (!upadtedData) {
        dataToSend = {...dataToSend, userExist};
        delete dataToSend.password;
    } else {
        dataToSend = {...dataToSend, dataToUpdate};
        delete dataToSend.password;
    }
    return responseUtil(res, true, "successfully upadted", false, dataToSend);
}

const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    const userDeleted = await User.findByIdAndDelete(userId);
    if (!userDeleted) return responseUtil(res, false, "user not found", false);
    delete userDeleted.password
    return responseUtil(res, true, "successfully deleted", false, userDeleted);

}

const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            const permission = roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return responseUtil(res, false, "You dont have enough permission to perform this action", true, { error: "You don't have enough permission to perform this action"})
            }
            next();
        } catch(err) {
            return responseUtil(res, false, "error while granting permission", true, {error: err.message});
        }
    }
}

const allowIfLoggedIn = async (req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        if (!user) return responseUtil(res, false, "You need to be logged in to access this route", true, { error: "You need to be logged in to access this route" });
        req.user = user;
        next();
    } catch (error) {
        return responseUtil(res, false, "error while login", true, {error: err.message});
    }
}



module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    grantAccess,
    allowIfLoggedIn
}