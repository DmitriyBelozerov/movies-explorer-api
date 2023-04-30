require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const app = express();

const { dataBaseDev } = require('./constants/constants');
const router = require('./routes/index');
const { checkCorsVerification } = require('./utils/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const checkErrors = require('./middlewares/checkErrors');
const limiter = require('./middlewares/limiter');

const { PORT = 3000, BD = dataBaseDev } = process.env;

mongoose.set('strictQuery', false);
mongoose.connect(BD);

app.use(requestLogger);
app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(cookieParser());

app.use(checkCorsVerification);

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(checkErrors);

app.listen(PORT);
console.log(PORT);