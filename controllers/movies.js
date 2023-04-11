const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const UserAccessError = require('../errors/user-access-err');
const ValidationError = require('../errors/validation-err');

const NO_ERRORS = 200;
const NO_ERRORS_CREATED = 201;

const getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner'])
    .then((movies) => {
      res.status(NO_ERRORS).send({ data: movies });
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
        next(new ValidationError('Переданы некорректные данные при сохранении фильма'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Карточка не найдена');
      } else if (!movie.owner.equals(req.user._id)) {
        throw new UserAccessError('Нельзя удалять фильмы других пользователей');
      } else {
        Movie.deleteOne(movie)
          .then(() => {
            res.status(NO_ERRORS).send({ data: movie });
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные при удалении'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
