const User = require('../models/users');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res
      .status(200)
      .send(users))
    .catch((err) => res
      .status(500)
      .send({
        message: 'Ошибка по умолчанию',
        err: err.message,
        stack: err.stack,
      }));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('CastError'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      // console.log(err.name);
      if (err.message === 'CastError') {
        res
          .status(404)
          .send({
            message: 'User not found',
          });
      } else if (err.message === 'Not found') {
        res
          .status(400)
          .send({
            message: 'Пользователь по указанному _id не найден.',
          });
      } else {
        res
          .status(500)
          .send({
            message: 'Ошибка по умолчанию',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      // console.log(err.name);
      // console.log(err.message);
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при создании пользователя.',
          });
      } else {
        res
          .status(500)
          .send({
            message: 'Ошибка по умолчанию',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.params.id, { name, about }, { new: true, runValidators: true })
    // console.log(req.params.id)
    .orFail(new Error('user not found'))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.log(err.name);
      console.log(err.message);
      if (err.name === 'user not found') {
        res
          .status(404)
          .send({
            message: 'Пользователь с указанным _id не найден.',
          });
      } else if (err.name === 'ValidationError' || err.name === 'Bad Request') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля.',
            err: err.message,
            stack: err.stack,
          });
      } else {
        res
          .status(500)
          .send({
            message: 'Ошибка по умолчанию',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const updateAvatar = (req, res) => {
  // console.log('req.body', req.body);
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.params.id, { avatar }, { runValidators: true })
    .orFail(new Error('user not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      // console.log(err.name);
      if (err.message === 'user not found') {
        res
          .status(404)
          .send({
            message: 'Пользователь с указанным _id не найден.',
          });
      } else if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при обновлении аватара.',
          });
      } else {
        res
          .status(500)
          .send({
            message: 'Ошибка по умолчанию',
            err: err.message,
            stack: err.stack,
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
};
