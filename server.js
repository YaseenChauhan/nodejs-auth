const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const debug = require('debug')('node-passport:express-app');
const config = require('./config/environments');
const authRoutes = require('./routes/auth');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');


const app = express();

const passport = require('passport');

// Logger for HTTP Requests
const env = process.env.NODE_ENV || 'local';
if (env !== 'production') {
  const logger = require('morgan'); // eslint-disable-line global-require
  app.use(logger('dev'));
}


// Enable Cross-origin resource sharing
app.use(cors());

// Enable gzip compression
app.use(compression());

// Enable helmet middleware
app.use(helmet());

// Disable x-powered-by header
app.disable('x-powered-by');

app.use(express.json());
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection, collection: 'sessions' })
app.use(session({
  //secret: process.env.SECRET,
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
      maxAge: 1000 * 30
  }
}));

require('./passport');

app.use(passport.initialize());
app.use(passport.session());


app.use('/api/v1/users', authRoutes);

module.exports = () => {
    app.listen(config.defaults.port || 3000, () => {
        debug(`server listening on ${config.defaults.port}`)
    })
}