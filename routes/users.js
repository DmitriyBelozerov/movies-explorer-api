const router = require('express').Router();

const { validationUpdateUser } = require('../utils/validation');
const { getСurrentUser, updateUser } = require('../controllers/users');

router.get(
  '/me',
  getСurrentUser,
);

router.patch(
  '/me',
  validationUpdateUser,
  updateUser,
);

module.exports = router;
