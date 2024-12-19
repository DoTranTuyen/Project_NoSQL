const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', requireAuth, cartController.apiGetCart);
router.post('/add', requireAuth, cartController.addToCart);
router.post('/checkout', requireAuth, cartController.checkout);
router.post('/update', requireAuth, cartController.updateQuantity);
router.post('/remove', requireAuth, cartController.removeFromCart);

module.exports = router;
