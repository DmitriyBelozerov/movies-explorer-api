const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const regEx = /(https?:\/\/)(w{3}\.)?([a-zA-Z0-9-]{0,100}\.)([a-zA-Z]{2,6})(\/[\w\-._~:/?#[\]@!$&'()*+,;=]#?)?/;

const {
  getMovies, createMovie, deleteMovie
  } = require('../controllers/movies.js');

router.get('/', getMovies);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required().max(4),
      description: Joi.number().required(),
      image: Joi.string().required().pattern(regEx),
      trailerLink:  Joi.string().required().pattern(regEx),
      thumbnail:  Joi.string().required().pattern(regEx),
      movieId: Joi.string().hex().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);

router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string()
      // .length(24)
      .hex().required(),
    }),
  }),
  deleteMovie,
);

module.exports = router;