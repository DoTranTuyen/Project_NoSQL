const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.get('/me', authController.me); // Endpoint kiểm tra trạng thái đăng nhập

module.exports = router;
