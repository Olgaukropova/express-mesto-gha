const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateCreateCard,
  validateCardId,
} = require('../middlewares/validations');

router.get('/cards', getCards);

router.post('/cards', validateCreateCard, createCard);

router.delete('/cards/:id', validateCardId, deleteCard);

router.put('/cards/:id/likes', validateCardId, likeCard); // поставить лайк карточке

router.delete('/cards/:id/likes', validateCardId, dislikeCard); // убрать лайк с карточки

module.exports = router;
