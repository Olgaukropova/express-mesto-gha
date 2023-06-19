const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/users');
const { BadRequestError, NotFoundError, DefaultError } = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res
      .status(200)
      .send(users))
    .catch(() => res
      .status(DefaultError)
      .send({
        message: 'Ошибка по умолчанию',
      }));
};

const login = (req, res, next) => {
  // console.log('login', req.body);
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => new Error('Пользователь не найден'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            // создать jwt
            const jwt = jsonWebToken.sign({
              _id: user._id,
            }, process.env.JWT_SECRET);
            // прикрепить его к куке
            // console.log(jwt);
            res.cookie('jwt', jwt, {
              maxAge: 360000,
              httpOnly: true,
              sameSite: true,
            });
            res.send({ data: user.toJSON() });
          } else {
            res.status(403).send({ message: 'Неправильный пароль' });
          }
        });
    })
    // eslint-disable-next-line no-undef
    .catch(next);
};

const getInfoUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      // console.log(err.name);
      if (err.message === 'Not found') {
        res
          .status(NotFoundError)
          .send({
            message: 'Пользователь по указанному _id не найден.',
          });
      } else if (err.name === 'CastError') {
        res
          .status(BadRequestError)
          .send({
            message: 'Переданы некорректные данные при создании пользователя.',
          });
      } else {
        res
          .status(DefaultError)
          .send({
            message: 'Ошибка по умолчанию',
          });
      }
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      // console.log(err.name);
      if (err.message === 'Not found') {
        res
          .status(NotFoundError)
          .send({
            message: 'Пользователь по указанному _id не найден.',
          });
      } else if (err.name === 'CastError') {
        res
          .status(BadRequestError)
          .send({
            message: 'Переданы некорректные данные при создании пользователя.',
          });
      } else {
        res
          .status(DefaultError)
          .send({
            message: 'Ошибка по умолчанию',
          });
      }
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      // console.log(err.name);
      // console.log(err.message);
      if (err.name === 'ValidationError') {
        res
          .status(BadRequestError)
          .send({
            message: 'Переданы некорректные данные при создании пользователя.',
          });
      } else {
        res
          .status(DefaultError)
          .send({
            message: 'Ошибка по умолчанию',
          });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    // console.log(req.params.id)
    .orFail(new Error('user not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      // console.log(err.name);
      // console.log(err.message);
      if (err.name === 'user not found') {
        res
          .status(NotFoundError)
          .send({
            message: 'Пользователь с указанным _id не найден.',
          });
      } else if (err.name === 'ValidationError') {
        res
          .status(BadRequestError)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля.',
          });
      } else {
        res
          .status(DefaultError)
          .send({
            message: 'Ошибка по умолчанию',
          });
      }
    });
};

const updateAvatar = (req, res) => {
  // console.log('req.body', req.body);
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('user not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      // console.log(err.name);
      if (err.message === 'user not found') {
        res
          .status(NotFoundError)
          .send({
            message: 'Пользователь с указанным _id не найден.',
          });
      } else if (err.name === 'ValidationError') {
        res
          .status(BadRequestError)
          .send({
            message: 'Переданы некорректные данные при обновлении аватара.',
          });
      } else {
        res
          .status(DefaultError)
          .send({
            message: 'Ошибка по умолчанию',
          });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getInfoUser,
};
