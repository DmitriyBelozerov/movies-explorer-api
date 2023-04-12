require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const app = express();

const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const checkErrors = require('./middlewares/checkErrors');
const limiter = require('./middlewares/limiter');

const { PORT = 3000, BD = 'mongodb://localhost:27017/myfilmsdb' } = process.env;

const allowedCors = [
  'https://belozerov.nomoredomains.monster',
  'http://belozerov.nomoredomains.monster',
  'http://localhost:3000',
  'http://localhost:3001',
];

mongoose.set('strictQuery', false);
mongoose.connect(BD);

app.use(requestLogger);
app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
});

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(checkErrors);

app.listen(PORT);
