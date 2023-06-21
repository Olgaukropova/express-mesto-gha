// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error');
const auth = require('./middlewares/auth');

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const loginRoutes = require('./routes/login');

const app = express();

const { celebrate, Joi, errors} = require('celebrate');

// console.log(process.env.JWT_SECRET);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => console.log('Connected!'));

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// роуты, не требующие авторизации
app.use(loginRoutes);

app.use(auth);

// роуты, которым авторизация нужна
app.use(userRoutes);
app.use(cardRoutes);

app.use((req, res) => {
  // console.log('error')
  res
    .status(404)
    .send({
      message: 'page not found',
    });
});

app.use(errors());

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Слушаю порт 3000');
});
