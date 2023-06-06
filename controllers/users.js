const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');
const { JWT_SECRET, NODE_ENV } = require('../config');

const NotFoundError = require('../middlewares/errors/not-found-err');
const BadRequestError = require('../middlewares/errors/bad-request-err');
const ConflictError = require('../middlewares/errors/conflict-err');
const UnauthorizedError = require('../middlewares/errors/unauthorized-err');

// GET /users/me - возвращает информацию о текущем пользователе
const getCurrentUser = (req, res, next) => {
  User
    .findById(req.user._id)
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => res.send(user))
    .catch(next);
};

// PATCH /users/me — обновляет профиль
const updateUserProfile = (req, res, next) => {
  // const { name, about } = req.body;
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    // { name, about },
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        // res.send(user);
        res.send({ name, email });
      } else {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

// POST /signup — создаёт пользователя
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((userObj) => {
      const user = userObj.toObject();
      delete user.password;
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('пользователь с таким Email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } else {
        next(err);
      }
    });
};

// POST /signin — логинет профиль
const login = (req, res, next) => {
  const { email, password } = req.body;

  User
    .findOne({ email }).select('+password')
    .orFail(() => next(new UnauthorizedError('Неправильные почта или пароль')))
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return user;
    }))
    .then((user) => {
      // создадим jwt
      const token = jsonwebtoken.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // вернём jwt
      res.send({
        name: user.name,
        email: user.email,
        _id: user._id,
        token,
      });
    })
    .catch(next);
};

module.exports = {
  getCurrentUser,
  updateUserProfile,
  createUser,
  login,
};
