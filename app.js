require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const app = express();

const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const checkErrors = require('./middlewares/checkErrors');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000, BD } = process.env;

const allowedCors = [
  // 'https://dmbelozerov.nomoredomainsclub.ru',
  // 'http://dmbelozerov.nomoredomainsclub.ru',
  'http://localhost:3000',
  'http://localhost:3001',
];

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose.set('strictQuery', false);
mongoose.connect(BD);

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

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
app.use('*', (req, res, next) => next(new NotFoundError('Страница не существует')));

app.use(errorLogger);
app.use(errors());
app.use(checkErrors);

app.listen(PORT);
