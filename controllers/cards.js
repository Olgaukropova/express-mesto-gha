const Card = require('../models/cards');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../errors/errors');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res
      .status(200)
      .send(card))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        return next(new BadRequestError('Вы ввели некорректные данные'));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id, { runValidators: true })
    .exec()
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным _id не найдена.'));
      }
      if (card.owner !== req.user._id) {
        return next(new ForbiddenError('Попытка удалить чужую карточку.'));
      }
      return res.status(200)
        .send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => new NotFoundError('Указанный _id не найден'))
    .then((card) => res.status(200).send({ card, message: 'Лайк успешно поставлен' }))
    .catch((err) => {
      if (err.message === 'Указанный _id не найден') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => new NotFoundError('Указанный _id не найден'))
    .then((card) => res.status(200).send({ card, message: 'Лайк удален' }))
    .catch((err) => {
      if (err.message === 'Указанный _id не найден') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
      } else {
        next(err);
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
