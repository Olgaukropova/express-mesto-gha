const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:id', getUserById);

// router.post('/users', createUser);

router.patch('/users/me/', updateUser); // обновляет профиль

router.patch('/users/me/avatar/', updateAvatar); // обновляет аватар

router.post('/signin', login); // аутентификация

router.post('/signup', createUser);

module.exports = router;
