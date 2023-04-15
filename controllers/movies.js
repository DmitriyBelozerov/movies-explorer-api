const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const UserAccessError = require('../errors/user-access-err');
const ValidationError = require('../errors/validation-err');
const {
  messageIncorrectDataCreateMovie, messageMovieNotFound, messageAccessСonflict,
  messageIncorrectDataDeleteMovie,
} = require('../constants/constants');

const NO_ERRORS = 200;
const NO_ERRORS_CREATED = 201;

const getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner'])
    .then((movies) => {
      res.status(NO_ERRORS).send({
        data: movies.filter((movie) => movie.owner.equals(req.user._id)),
      });
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(NO_ERRORS_CREATED).send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(messageIncorrectDataCreateMovie));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(messageMovieNotFound);
      } else if (!movie.owner.equals(req.user._id)) {
        throw new UserAccessError(messageAccessСonflict);
      } else {
        movie.remove()
          .then(() => {
            res.status(NO_ERRORS).send({ data: movie });
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(messageIncorrectDataDeleteMovie));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
