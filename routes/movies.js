const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    movieId: Joi.number().integer().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().required().pattern(/(https?:\/\/)(w{3}\.)?(([a-zA-Z0-9]+).)+/),
    trailerLink: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(([a-zA-Z0-9]+).)+/),
    thumbnail: Joi.string().uri().required().pattern(/(https?:\/\/)(w{3}\.)?(([a-zA-Z0-9]+).)+/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
