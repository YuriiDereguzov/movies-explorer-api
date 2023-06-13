const router = require('express').Router();
const { validationUpdateUserProfile } = require('../middlewares/validation');
const { updateUserProfile, getCurrentUser } = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', validationUpdateUserProfile, updateUserProfile);

module.exports = router;
