const Chat = require('../models/Chat');

// Lấy lịch sử tin nhắn
exports.getChatHistory = async (req, res) => {
  const userId = req.user.userId; // Lấy userId từ middleware
  try {
    const chat = await Chat.findOne({ userId });
    if (!chat) {
      return res.json([]);
    }
    res.json(chat.messages);
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).send("Server error");
  }
};
exports.getChatHistoryByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const chat = await Chat.findOne({ userId }).populate('messages');
    if (!chat) {
      return res.json([]); // Trả về mảng rỗng nếu chưa có chat
    }
    res.json(chat.messages); // Trả về lịch sử tin nhắn
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).send("Server error");
  }
};
// Lưu tin nhắn mới
exports.saveMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.userId; // Lấy userId từ middleware

  try {
    let chat = await Chat.findOne({ userId });
    if (!chat) {
      chat = await Chat.create({ userId, messages: [] });
    }
    const newMessage = { sender: 'user', message };
    chat.messages.push(newMessage);
    await chat.save();
    res.status(201).json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).send("Server error");
  }
};
