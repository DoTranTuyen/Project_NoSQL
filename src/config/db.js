const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Kết nối tới MongoDB tại localhost:27017, database tên "mydatabase"
    await mongoose.connect('mongodb://localhost:27017/dbShopWatch');
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = connectDB;

