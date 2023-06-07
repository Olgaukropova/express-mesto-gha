const Card = require('../models/cards');

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res
      .status(200)
      .send(card))
    .catch((err) => res
      .status(500)
      .send({
        message: 'Interval Server Error',
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
    .catch((err) => res
      .status(500)
      .send({
        message: 'Interval Server Error',
        err: err.message,
        stack: err.stack,
      }));
};

module.exports = {
  getCards,
  createCard,
};
