const express = require('express');
const app = express();
const http = require('http').createServer(app);
const cookieParser = require('cookie-parser');
const path = require('path');
const { requireAuth, requireAdmin } = require('./middleware/authMiddleware'); // Lấy ra hàm cần dùng
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const io = new Server(http);


connectDB();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));
app.use('/orders', require('./routes/order'));
app.use('/admin', require('./routes/admin'));
app.use('/chat', require('./routes/chat'));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
  });
  
const Chat = require('./models/Chat');

io.on('connection', (socket) => {
  console.log('A user connected');

  // Xác thực người dùng
  socket.on('authenticate', async (token) => {
    try {
      const decoded = jwt.verify(token, 'SECRET_KEY');
      socket.user = decoded;
      // Tìm hoặc tạo chat document cho người dùng này
      let chat = await Chat.findOne({ userId: decoded.userId });
      if (!chat) {
        chat = await Chat.create({ userId: decoded.userId, messages: [] });
      }
      socket.chatId = chat._id;
      // Gửi lịch sử tin nhắn cho người dùng
      socket.emit('chatHistory', chat.messages);
    } catch (err) {
      console.error("Authentication error:", err);
      socket.emit('unauthorized');
    }
  });

  // Nhận tin nhắn từ người dùng
  socket.on('message', async (msg) => {
    if (!socket.user) return; // Chưa xác thực
    try {
      let chat = await Chat.findOne({ userId: socket.user.userId });
      if (!chat) {
        chat = await Chat.create({ userId: socket.user.userId, messages: [] });
      }
      const message = { sender: 'user', message: msg };
      chat.messages.push(message);
      await chat.save();
  
      // Gửi tin nhắn tới admin
      io.emit('newMessage', { sender: 'user', message: msg });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  // Nhận tin nhắn từ admin
  socket.on('adminMessage', async (msg, userId) => {
    try {
      const chat = await Chat.findOne({ userId });
      if (!chat) return;
      const message = { sender: 'admin', message: msg };
      chat.messages.push(message);
      await chat.save();
  
      // Gửi tin nhắn tới user
      io.emit('newMessage', { sender: 'admin', message: msg });
    } catch (err) {
      console.error("Error saving admin message:", err);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
