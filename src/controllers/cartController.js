const CartItem = require('../models/CartItem');
const Product = require('../models/Products');


const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY'); // Thay 'SECRET_KEY' bằng key thực tế
    req.user = decoded; // Gắn thông tin người dùng vào req
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).send("Unauthorized");
  }
};


exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).send("Unauthorized access");

    const { productId } = req.body;
    if(!productId) return res.status(400).send("No productId provided");

    let item = await CartItem.findOne({ userId, productId });
    if(item) {
      item.quantity += 1;
      await item.save();
    } else {
      item = new CartItem({ userId, productId, quantity: 1 });
      await item.save();
    }

    // Bạn có 2 lựa chọn:
    // 1) Chuyển hướng sang cart.html để xem giỏ hàng:
    // res.redirect('/cart.html');
    //
    // 2) Trả JSON để front-end JS hiển thị thông báo mà không chuyển trang:
    // res.json({message: "Product added to cart successfully!"});

    res.redirect('/cart.html');
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).send("Server error");
  }
};



exports.apiGetCart = async (req, res) => {
  const userId = req.user.userId;
  try {
    const cartItems = await CartItem.find({ userId }).populate('productId');
    if (cartItems.length === 0) {
      return res.status(200).json({ message: "Your cart is empty", cartItems: [] });
    }
    res.status(200).json(cartItems);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.checkout = async (req, res) => {
  const userId = req.user.userId;
  try {
    const cartItems = await CartItem.find({ userId });
    if (cartItems.length > 0) {
      // Có sản phẩm
      await CartItem.deleteMany({ userId });
      res.redirect('/cart.html?checkout=success');
    } else {
      // Không có sản phẩm
      res.redirect('/cart.html?checkout=empty');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Hàm cập nhật số lượng
exports.updateQuantity = async (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;
  try {
    let item = await CartItem.findOne({ userId, productId });
    if(!item) return res.status(400).send("Item not found in cart");
    const qty = parseInt(quantity);
    if(qty <= 0) {
      // Nếu số lượng <= 0, xóa luôn
      await CartItem.deleteOne({ userId, productId });
    } else {
      item.quantity = qty;
      await item.save();
    }
    res.redirect('/cart.html');
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Hàm xoá sản phẩm khỏi giỏ
exports.removeFromCart = async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.body;
  try {
    await CartItem.deleteOne({ userId, productId });
    res.redirect('/cart.html');
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
exports.getCart = async (req, res) => {
  const userId = req.user.userId;
  try {
    const cartItems = await CartItem.find({ userId }).populate('productId');
    res.status(200).json(cartItems);
  } catch (err) {
    console.error("Error getting cart:", err);
    res.status(500).send("Server error");
  }
};

