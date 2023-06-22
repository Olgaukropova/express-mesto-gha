const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/users');
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require('../errors/errors');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res
      .status(200)
      .send(users))
    .catch(next);
  // () => res
  // .status(DefaultError)
  // .send({
  //   message: 'Ошибка сервера',
  // }));
};

const login = (req, res, next) => {
  // console.log('login', req.body);
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => new NotFoundError('Пользователь не найден'))
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
            next(new ForbiddenError('Неправильный пароль'));
            // res
            //   .status(ForbiddenError)
            //   .send({ message: 'Неправильный пароль' });
          }
        });
    })
    // eslint-disable-next-line no-undef
    .catch(next);
};

const getInfoUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      // console.log(err.name);
      if (err.message === 'Not found') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
        // res
        //   .status(NotFoundError)
        //   .send({
        //     message: 'Пользователь по указанному _id не найден.',
        //   });
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
        // res
        //   .status(BadRequestError)
        //   .send({
        //     message: 'Переданы некорректные данные при создании пользователя.',
        //   });
      } else {
        next(err);
        // res
        //   .status(DefaultError)
        //   .send({
        //     message: 'Ошибка сервера',
        //   });
      }
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => new NotFoundError('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      // console.log(err.name);
      if (err.message === 'Not found') {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
        // res
        //   .status(NotFoundError)
        //   .send({
        //     message: 'Пользователь по указанному _id не найден.',
        //   });
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
        // res
        //   .status(BadRequestError)
        //   .send({
        //     message: 'Переданы некорректные данные при создании пользователя.',
        //   });
      } else {
        next(err);
        // res
        //   .status(DefaultError)
        //   .send({
        //     message: 'Ошибка сервера',
        //   });
      }
    });
};

const createUser = (req, res, next) => {
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
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
        // res
        //   .status(BadRequestError)
        //   .send({
        //     message: 'Переданы некорректные данные при создании пользователя.',
        //   });
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован.'));
      } else {
        next(err);
        // res
        //   .status(DefaultError)
        //   .send({
        //     message: 'Ошибка сервера',
        //   });
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    // console.log(req.params.id)
    .orFail(new Error('user not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      // console.log(err.name);
      // console.log(err.message);
      if (err.name === 'user not found') {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
        // res
        //   .status(NotFoundError)
        //   .send({
        //     message: 'Пользователь с указанным _id не найден.',
        //   });
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
        // res
        //   .status(BadRequestError)
        //   .send({
        //     message: 'Переданы некорректные данные при обновлении профиля.',
        //   });
      } else {
        next(err);
        // res
        //   .status(DefaultError)
        //   .send({
        //     message: 'Ошибка сервера',
        //   });
      }
    });
};

const updateAvatar = (req, res, next) => {
  // console.log('req.body', req.body);
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('user not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      // console.log(err.name);
      if (err.message === 'user not found') {
        next(new NotFoundError('Пользователь с указанным _id не найден.'));
        // res
        //   .status(NotFoundError)
        //   .send({
        //     message: 'Пользователь с указанным _id не найден.',
        //   });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
        // res
        //   .status(BadRequestError)
        //   .send({
        //     message: 'Переданы некорректные данные при обновлении аватара.',
        //   });
      } else {
        next(err);
        // res
        //   .status(DefaultError)
        //   .send({
        //     message: 'Ошибка сервера',
        //   });
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
