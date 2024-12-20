const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String, // Lưu đường dẫn hình ảnh
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Products', productSchema);
