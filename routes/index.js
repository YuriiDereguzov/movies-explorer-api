const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../middlewares/errors/not-found-err');
const { validationSignup, validationSignin } = require('../middlewares/validation');

router.post('/signup', validationSignup, createUser);

router.post('/signin', validationSignin, login);

router.use('/users', auth, userRouter);

router.use('/movies', auth, movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Стараница по указанному маршруту не найдена'));
});

module.exports = router;
