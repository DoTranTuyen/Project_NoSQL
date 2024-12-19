const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const { requireAuth, requireAdmin } = require('./middleware/authMiddleware'); // Lấy ra hàm cần dùng
const connectDB = require('./config/db');

connectDB();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// Không app.use(authMiddleware) ở đây vì nó không còn là 1 function mặc định

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// Không app.use(authMiddleware) thêm lần nào nữa.
// Chỉ trong '/cart' route mới dùng requireAuth
app.use('/cart', require('./routes/cart'));

app.use('/admin', require('./routes/admin'));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
  });
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
