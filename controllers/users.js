const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const NO_ERRORS = 200;
const NotFoundError = require('../errors/not-found-err');
const UniqueEmailError = require('../errors/unique-email-err');
const ValidationError = require('../errors/validation-err');

const createUser = (req, res, next) => {
  const { name, email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email: email.toLowerCase(), password: hash,
    })
      .then((user) => {
        res.status(NO_ERRORS).send({
          name: user.name,
          email: user.email,
        });
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === 11000) {
        next(new UniqueEmailError('Пользователь с таким Email уже существует'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email.toLowerCase(), password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
        { expiresIn: '7d' },
      );
      res.cookie(
        'jwt',
        token,
        { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true },
      )
        .send({ message: 'Вы успешно авторизированы!' });
    })
    .catch(next);
};

const unLogin = (req, res, next) => {
  try {
    res.clearCookie('jwt');
    res.status(NO_ERRORS).send({ message: 'Вы успешно вышли из системы' });
    res.end();
  } catch (err) {
    next(err);
  }
};

const getСurrentUser = (req, res, next) => {
  findUser(req, res, next, req.user._id);
};


const findUserForUpdated = (req, res, next, info) => {
  User.findByIdAndUpdate(req.user._id, info, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.status(NO_ERRORS).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля пользователя'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  findUserForUpdated(req, res, next, { name, email });
};

module.exports = {
  // getUsers,
  getСurrentUser,
  // getUserById,
  createUser,
  updateUser,
  // updateAvatar,
  login,
  unLogin,
};