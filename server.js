const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const debug = require('debug')('node-passport:express-app');
const config = require('./config/environments');
const authRoutes = require('./routes/auth');

const app = express();

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

app.use('/api/v1/users', authRoutes);

module.exports = () => {
    app.listen(config.defaults.port || 3000, () => {
        debug(`server listening on ${config.defaults.port}`)
    })
}