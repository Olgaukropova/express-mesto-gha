const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {

  const token = req.cookies.jwt;
  console.log(token);
  if (!token) {
    throw new UnauthorizedError('Требуется авторизация');
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
  }

  let payload;
  // jwt.verify вернёт пейлоуд токена, если тот прошёл проверку
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(payload);
  } catch (err) {
    next(err);
  }

  req.user = payload;

  next();
};

module.exports = auth;
