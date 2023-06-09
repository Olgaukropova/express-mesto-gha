const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', createCard);

router.delete('/cards/:id', deleteCard);

router.put('/cards/:id/likes', likeCard); // поставить лайк карточке

router.delete('/cards/:id/likes', dislikeCard); // убрать лайк с карточки

module.exports = router;
