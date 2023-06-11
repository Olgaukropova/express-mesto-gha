const Card = require('../models/cards');

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res
      .status(200)
      .send(card))
    .catch((err) => res
      .status(500)
      .send({
        message: 'Ошибка по умолчанию',
        err: err.message,
        stack: err.stack,
      }));
};

const createCard = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'Вы ввели некорректные данные' });
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
// eslint-disable-next-line no-unused-vars
// module.exports.createCard = (req, res) => {
//   console.log(req.user._id); // _id станет доступен
// };
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id, { runValidators: true })
    .orFail(new Error('Указанный _id не найден'))
    .then(() => res.status(200).send({ message: 'Карточка успешно удалена' }))
    .catch((err) => {
      if (err.message === 'Указанный _id не найден') {
        res
          .status(404)
          .send({
            message: 'Карточка с указанным _id не найдена.',
          });
      } else if (err.name === 'Error') {
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные. ',
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
          .status(404)
          .send({
            message: 'Карточка с указанным _id не найдена.',
          });
      } else if (err.name === 'CastError') { // ошибка400 выходит, мессадж нет
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные для постановки лайка. ',
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => new Error('Указанный _id не найден'))
    .then((card) => res.status(200).send({ card, message: 'Лайк удален' }))
    .catch((err) => {
      console.log(err.name);
      console.log(err.message);
      if (err.message === 'Указанный _id не найден') {
        res
          .status(404)
          .send({
            message: 'Карточка с указанным _id не найдена.',
          });
      } else if (err.name === 'CastError' || err.name === 'ValidationError') { // ошибка400 выходит, мессадж нет
        res
          .status(400)
          .send({
            message: 'Переданы некорректные данные для снятия лайка. ',
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
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
