const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:id', getUserById);

router.post('/users', createUser);

router.patch('/users/me/', updateUser); // обновляет профиль

router.patch('/users/me/avatar/:id', updateAvatar); // обновляет аватар

module.exports = router;
