const User = require('../models/users');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res
      .status(200)
      .send(users))
    .catch((err) => res
      .status(500)
      .send({
        message: 'Interval Server Error',
        err: err.message,
        stack: err.stack,
      }));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200)
      .send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(404)
          .send({
            message: 'User not found',
          });
      } else {
        res
          .status(500)
          .send({
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => res
      .status(500)
      .send({
        message: 'Interval Server Error',
        err: err.message,
        stack: err.stack,
      }));
};

const updateUser = (req, res) => {
  // console.log('req.body', req.body);
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.params.id, { name, about })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.message === 'Not Found') {
        res
          .status(404)//не работает
          .send({
            message: 'User not found',
          });
      } else {
        res
          .status(500)
          .send({
            message: 'Internal Server Error',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const updateAvatar = (req, res) => {
  // console.log('req.body', req.body);
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.params.id, { avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Not Found') {
        res
          .status(404)//не работает
          .send({
            message: 'User not found',
          });
      } else {
        res
          .status(500)
          .send({
            message: 'Internal Server Error',
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
