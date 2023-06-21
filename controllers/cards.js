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
  // () => res
  // .status(DefaultError)
  // .send({
  //   message: 'Ошибка сервера',
  // }));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        return next(new BadRequestError('Вы ввели некорректные данные'));
        // res.status(BadRequestError).send({ message: 'Вы ввели некорректные данные' });
      }
      return next(err);
      // else {
      //   res
      //     .status(DefaultError)
      //     .send({
      //       message: 'Ошибка сервера',
      //     });
      // }
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id, { runValidators: true })
    .exec()
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным _id не найдена.'));
        // return res
        //   .status(NotFoundError)
        //   .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      if (card.owner !== req.user._id) {
        return next(new ForbiddenError('Попытка удалить чужую карточку.'));
        // return res.status(ForbiddenError)
        //   .send({ message: 'Попытка удалить чужую карточку' });
      }
      return res.status(200)
        .send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
        // return res.status(BadRequestError)
        //   .send({ message: 'Переданы некорректные данные.' });
      } else {
        next(err);
      }
      // return res
      //   .status(DefaultError)
      //   .send({ message: 'Ошибка сервера' });
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
      // console.log(err.name);
      // console.log(err.message);
      if (err.message === 'Указанный _id не найден') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
        // res
        //   .status(NotFoundError)
        //   .send({
        //     message: 'Карточка с указанным _id не найдена.',
        //   });
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
        // res
        //   .status(BadRequestError)
        //   .send({
        //     message: 'Переданы некорректные данные для постановки лайка. ',
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

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => new NotFoundError('Указанный _id не найден'))
    .then((card) => res.status(200).send({ card, message: 'Лайк удален' }))
    .catch((err) => {
      // console.log(err.name);
      // console.log(err.message);
      if (err.message === 'Указанный _id не найден') {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
        // res
        //   .status(NotFoundError)
        //   .send({
        //     message: 'Карточка с указанным _id не найдена.',
        //   });
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка.'));
        // res
        //   .status(BadRequestError)
        //   .send({
        //     message: 'Переданы некорректные данные для снятия лайка. ',
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
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
