const { celebrate, Joi } = require('celebrate');

const regEx = /(https?:\/\/)(w{3}\.)?([a-zA-Z0-9-]{0,100}\.)([a-zA-Z]{2,6})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]#?)?/;

const validationSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validationSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regEx),
    trailerLink: Joi.string().required().pattern(regEx),
    thumbnail: Joi.string().required().pattern(regEx),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validationDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required(),
  }),
});

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});

module.exports = {
  validationSignup,
  validationSignin,
  validationCreateMovie,
  validationDeleteMovie,
  validationUpdateUser,
};