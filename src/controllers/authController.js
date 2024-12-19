const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Đăng ký
exports.register = async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (!username || !password || !confirmPassword) return res.status(400).send("Missing fields");
  if (password !== confirmPassword) return res.status(400).send("Passwords do not match");

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).send("User already exists");

  // Lưu plaintext
  await User.create({ username, password });
  res.redirect('/login.html');
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || password !== user.password) {
    return res.status(400).send("Invalid credentials");
  }


  const token = jwt.sign({ userId: user._id, role: user.role }, 'SECRET_KEY', { expiresIn: '1d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'Strict' });
  if (user.role === 'admin') {
    return res.redirect('/index_admin.html'); // Điều hướng tới giao diện admin
  } else if (user.role === 'customer') {
    return res.redirect('/index.html'); // Điều hướng tới giao diện customer
  }
};


// Đăng xuất
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/index.html');
};

exports.me = (req, res) => {
  const token = req.cookies.token; // Đọc token từ cookie
  if (!token) {
    return res.json({ loggedIn: false });
  }

  try {
    const user = jwt.verify(token, 'SECRET_KEY'); // Giải mã token
    res.json({ loggedIn: true, username: user.username, role: user.role });
  } catch (err) {
    res.json({ loggedIn: false }); // Token không hợp lệ
  }
};



