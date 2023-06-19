const router = require('express').Router();
const { createUser, login } = require('../controllers/users');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.post('/signup', createUser);
router.post('signin', login);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

module.exports = router;
