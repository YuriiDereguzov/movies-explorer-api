const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const { validationUpdateUserProfile } = require('../middlewares/validation');
const { updateUserProfile, getCurrentUser } = require('../controllers/users');

router.get('/me', getCurrentUser);
// router.patch('/me', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30).required(),
//     email: Joi.string().email().required(),
//   }),
// }), updateUserProfile);
router.patch('/me', validationUpdateUserProfile, updateUserProfile);

module.exports = router;
