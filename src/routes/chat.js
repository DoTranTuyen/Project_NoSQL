const express = require('express');
const router = express.Router();
const { getChatHistory, saveMessage, getChatHistoryByUser } = require('../controllers/chatController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware'); // Import middleware

// Lấy lịch sử chat của user
router.get('/history/:userId', requireAuth, requireAdmin, getChatHistoryByUser);

// Gửi tin nhắn mới
router.post('/send', requireAuth, saveMessage);

module.exports = router;
