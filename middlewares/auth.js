const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-err');
const { messageNoAccess, secretKey } = require('../constants/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new AuthError(messageNoAccess));
    return;
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : secretKey);
  } catch (err) {
    next(new AuthError(messageNoAccess));
    return;
  }
  req.user = payload;
  next();
};
