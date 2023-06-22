const { default: validator } = require('Validator');
const { celebrate, Joi } = require('celebrate');
const { BadRequestError } = require('../errors/BadRequestError');
// const Validator = require('Validator');

// аутентификация
// логин
const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(30),
  }),
});

// регистрация
const validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(30),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }),
});

// пользователь
// getUserById
const validateUserById = celebrate({
  body: Joi.object().keys({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
});

// обновление данных пользователя
const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

// обновление аватара
const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }),
});

// карточки
// создание карточки
const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string(),
  }),
});

// для удаленияб лайка и дизлайка карточки
const validateCardId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
});

// валидация url
const validateUrl = (url) => {
  const result = validator.isURL(url);
  if (result) {
    return url;
  }
  throw new BadRequestError('Проблема с url');
};

module.exports = {
  validateSignIn,
  validateSignUp,
  validateUserById,
  validateUpdateUser,
  validateUpdateAvatar,
  validateCreateCard,
  validateCardId,
  validateUrl,
};
