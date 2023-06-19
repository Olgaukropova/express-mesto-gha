const router = require('express').Router();

const { login, createUser } = require('../controllers/users');

router.post('/signin', login); // аутентификация

router.post('/signup', createUser);

module.exports = router;
