const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getInfoUser,
} = require('../controllers/users');

const {
  validateUserById,
  validateUpdateUser,
  validateUpdateAvatar,
} = require('../middlewares/validations');

router.get('/users', getUsers); // информация о всех пользователях

router.get('/users/me', getInfoUser); // информация о текущем пользователе

router.get('/users/:id', validateUserById, getUserById); // поиск пользователя по id

router.patch('/users/me/', validateUpdateUser, updateUser); // обновляет профиль

router.patch('/users/me/avatar/', validateUpdateAvatar, updateAvatar); // обновляет аватар

module.exports = router;
