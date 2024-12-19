const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Routes cho khách hàng
router.post('/checkout', requireAuth, orderController.checkout);
router.get('/my-orders', requireAuth, orderController.getUserOrders);

// Routes cho admin
router.get('/', requireAuth, requireAdmin, orderController.getAllOrders);
router.post('/update-status/:id', requireAuth, requireAdmin, orderController.updateOrderStatus);

module.exports = router;
