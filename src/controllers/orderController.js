const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const Product = require('../models/Products');

exports.checkout = async (req, res) => {
  const userId = req.user.userId;
  const { fullName, addressLine1, addressLine2, city, state, postalCode, country, paymentMethod } = req.body;

  try {
    // Lấy các sản phẩm trong giỏ hàng
    const cartItems = await CartItem.find({ userId }).populate('productId');
    if (cartItems.length === 0) {
      return res.status(400).send("Your cart is empty");
    }

    // Tạo đơn hàng
    const orderItems = cartItems.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price
    }));

    const order = new Order({
      userId,
      items: orderItems,
      shippingAddress: {
        fullName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country
      },
      paymentMethod,
      status: 'Pending'
    });

    await order.save();

    // Xóa giỏ hàng sau khi đặt hàng thành công
    await CartItem.deleteMany({ userId });

    res.redirect('/my-orders.html'); // Chuyển hướng tới trang danh sách đơn hàng của người dùng
  } catch (err) {
    console.error("Error during checkout:", err);
    res.status(500).send("Server error");
  }
};

exports.getUserOrders = async (req, res) => {
  const userId = req.user.userId;

  try {
    const orders = await Order.find({ userId }).populate('items.productId').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).send("Server error");
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId').populate('userId', 'username').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).send("Server error");
  }
};

exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Shipping', 'Delivered'];

  if (!validStatuses.includes(status)) {
    return res.status(400).send("Invalid status");
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).send("Order not found");

    order.status = status;
    await order.save();

    res.redirect('/admin-orders.html'); // Chuyển hướng tới trang quản lý đơn hàng của admin
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).send("Server error");
  }
};
