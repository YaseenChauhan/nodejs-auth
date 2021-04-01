const mongoose = require('mongoose');
const { join } = require('path');
// const requireConfig = require('./require-config');
// global.appRequire = alias => require(join(__dirname, requireConfig[alias]));
// const config = global.appRequire('config');
// const server = global.appRequire('server');
const debug = require('debug')('node-passport:server');
const { series } = require('async');
const config = require('./config/environments');
// const models = require('./models');
const server = require('./server');
const fs = require('fs');

const terminate = (err) => {
    mongoose.disconnect();
    if (err) {
        throw err;
    }
    process.exit(0);
}

const connectMongo = (callback) => {
    mongoose.Promise = global.Promise;
    mongoose.connect(config.mongo.uri, {
        dbName: config.mongo.database,
        // user: config.mongo.username, // if auth is enabled
        // pass: config.mongo.password, // if auth is enabled
        dbName: config.mongo.database,
        useNewUrlParser: true,
        useCreateIndex: true,
        autoIndex: false, // Read documentation before modifying this option
        useFindAndModify: false,
        socketTimeoutMS: 60000, // Close sockets after 60 seconds of inactivity
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        family: 4, // Use IPv4, skip trying IPv6
        // poolSize: 25, // Read documentation before modifying this option
    }, (err) => {
        if (err) return callback(err)
        debug(`Connected mongo ${config.mongo.uri}`);
        // Object.keys(requireConfig).forEach(module => {
        //     if (/model/.test(module)) {
        //         global.appRequire(module)
        //     }
        // })
        fs.readdirSync(join(__dirname, '/models')).forEach(model => {
            // debug(join(__dirname, '/models', model))
            require(join(__dirname, '/models', model))
        })
        debug('All mongoose models loaded');
        return callback();
    })
}

series([
    connectMongo
], async (err) => {
    if (err) return terminate(err)
    debug('MongoDB initial tests completed successfully!');

    //   global.appRequire('passport');
        // require('./passport');
      debug('All passport strategies loaded successfully!');

    server();
    return null;
})

process.on('SIGINT', terminate);
process.on('SIGTERM', terminate);