const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');

const auth = require('../middlewares/auth');
const { validationSignup, validationSignin } = require('../utils/validation');

const NotFoundError = require('../errors/not-found-err');
const { message404 } = require('../constants/constants');

const { createUser, login, unLogin } = require('../controllers/users');

router.post(
  '/signup',
  validationSignup,
  createUser,
);

router.post(
  '/signin',
  validationSignin,
  login,
);

router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.post('/signout', unLogin);

router.use('*', (req, res, next) => next(new NotFoundError(message404)));

module.exports = router;
