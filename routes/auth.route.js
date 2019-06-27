const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const isAuth = require('../middlewares/isAuth');
const {registerValidator} = require('../middlewares/validators');

const router = Router();

router.get('/', isAuth, authController.getUser);
router.post('/login', authController.loginUser);
router.post('/register', registerValidator, authController.registerUser);

module.exports = router;