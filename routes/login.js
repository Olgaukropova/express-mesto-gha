const router = require('express').Router();

const { login, createUser } = require('../controllers/users');

const {
  validateSignIn,
  validateSignUp,
} = require('../middlewares/validations');

router.post('/signin', validateSignIn, login); // аутентификация

router.post('/signup', validateSignUp, createUser);

module.exports = router;
