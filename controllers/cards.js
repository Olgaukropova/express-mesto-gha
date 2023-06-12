const Card = require('../models/cards');
const { BadRequestError, NotFoundError, DefaultError } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res
      .status(200)
      .send(card))
    .catch(() => res
      .status(DefaultError)
      .send({
        message: 'Ошибка по умолчанию',
      }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(BadRequestError).send({ message: 'Вы ввели некорректные данные' });
      } else {
        res
          .status(DefaultError)
          .send({
            message: 'Ошибка по умолчанию',
          });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id, { runValidators: true })
    .orFail(new Error('Указанный _id не найден'))
    .then(() => res.status(200).send({ message: 'Карточка успешно удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BadRequestError)
          .send({
            message: 'Переданы некорректные данные. ',
          });
      } else if (err.message === 'Указанный _id не найден') {
        res
          .status(NotFoundError)
          .send({
            message: 'Карточка с указанным _id не найдена.',
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => new Error('Указанный _id не найден'))
    .then((card) => res.status(200).send({ card, message: 'Лайк успешно поставлен' }))
    .catch((err) => {
      // console.log(err.name);
      // console.log(err.message);
      if (err.message === 'Указанный _id не найден') {
        res
          .status(NotFoundError)
          .send({
            message: 'Карточка с указанным _id не найдена.',
          });
      } else if (err.name === 'CastError') {
        res
          .status(BadRequestError)
          .send({
            message: 'Переданы некорректные данные для постановки лайка. ',
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => new Error('Указанный _id не найден'))
    .then((card) => res.status(200).send({ card, message: 'Лайк удален' }))
    .catch((err) => {
      // console.log(err.name);
      // console.log(err.message);
      if (err.message === 'Указанный _id не найден') {
        res
          .status(NotFoundError)
          .send({
            message: 'Карточка с указанным _id не найдена.',
          });
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        res
          .status(BadRequestError)
          .send({
            message: 'Переданы некорректные данные для снятия лайка. ',
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
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
