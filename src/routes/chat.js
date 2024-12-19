const express = require('express');
const router = express.Router();
const { getChatHistory, saveMessage } = require('../controllers/chatController');
const { requireAuth } = require('../middleware/authMiddleware'); // Middleware xác thực

router.get('/history/:userId', requireAuth, requireAdmin, getChatHistoryByUser);


// Gửi tin nhắn mới
router.post('/send', requireAuth, saveMessage);

module.exports = router;
