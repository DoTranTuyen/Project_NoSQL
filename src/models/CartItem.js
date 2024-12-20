const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CartItem', cartItemSchema);
