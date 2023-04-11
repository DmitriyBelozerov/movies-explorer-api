const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getСurrentUser, updateUser } = require('../controllers/users');

router.get(
  '/me',
  getСurrentUser,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email(),
    }),
  }),
  updateUser,
);

module.exports = router;
