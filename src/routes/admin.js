const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { getAllUsers } = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../public/images'));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });
router.get('/users', requireAuth, requireAdmin, getAllUsers);
router.get('/', requireAuth, requireAdmin, adminController.apiGetAdminProducts);
router.post('/create', requireAuth, requireAdmin, upload.single('productImage'), adminController.createProduct);
router.post('/update/:id', requireAuth, requireAdmin, upload.single('productImage'), adminController.updateProduct);
router.post('/delete/:id', requireAuth, requireAdmin, adminController.deleteProduct);

module.exports = router;