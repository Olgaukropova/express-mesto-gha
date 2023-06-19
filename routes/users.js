const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getInfoUser,
} = require('../controllers/users');

router.get('/users', getUsers); // информация о всех пользователях

router.get('/users/me', getInfoUser); // информация о текущем пользователе

router.get('/users/:id', getUserById); // поиск пользователя по id

// router.post('/users', createUser);

router.patch('/users/me/', updateUser); // обновляет профиль

router.patch('/users/me/avatar/', updateAvatar); // обновляет аватар

module.exports = router;
