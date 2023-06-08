const Movie = require('../models/movie');

const NotFoundError = require('../middlewares/errors/not-found-err');
const BadRequestError = require('../middlewares/errors/bad-request-err');
const ForbiddenError = require('../middlewares/errors/forbidden-err');

// GET /movies — возвращает все сохранённые текущим пользователем фильмы
const getMovies = (req, res, next) => {
  Movie.find({})
    .populate(['owner'])
    .then((movies) => res.send(movies))
    .catch(next);
};

// POST /movies — создаёт карточку
const createMovie = (req, res, next) => {
  const {
    movieId,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    movieId,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки фильма'));
      } else {
        next(err);
      }
    });
};

// DELETE /movies/:cardId — удаляет сохранённый фильм по id
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => next(new NotFoundError(`Карточка с _id ${req.params.movieId} не найдена`)))
    .populate('owner')
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id) {
        return Movie.deleteOne(movie)
          .then(() => res.send({ data: movie, message: 'Фильм успешно удален' }));
      }
      // пользователь не может удалить карточку, которую он не создавал
      return next(new ForbiddenError('Нельзя удалить чужой сохранённый фильм'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
