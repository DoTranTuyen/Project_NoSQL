const express = require('express');
const router = express.Router();
const Product = require('../models/Products'); // Đảm bảo đường dẫn đúng

// API phân trang (6 sản phẩm/trang)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  try {
     const products = await Product.find().skip(skip).limit(limit);
     const totalProducts = await Product.countDocuments();
     const totalPages = Math.ceil(totalProducts / limit);

     res.json({
        products,
        currentPage: page,
        totalPages
     });
  } catch (error) {
     res.status(500).json({ message: 'Failed to fetch products', error });
  }
});


router.get('/all', async (req, res) => {
  try {
     const products = await Product.find();
     res.json({ products });
  } catch (error) {
     res.status(500).json({ message: 'Failed to fetch products', error });
  }
});

module.exports = router;