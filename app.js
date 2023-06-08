const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errors/errorHandler');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
// app.use(cors({ origin: ['http://localhost:3001', 'https://projects.nomoredomains.monster'] }));

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {});

app.use(requestLogger); // подключаем логгер запросов
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // GET /crash-test — тест сервера на востановление
// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

app.use(routes);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
