const mongoose = require('mongoose');
const User = require('./models/User'); // Import model User
const Product = require('./models/Products'); // Import model Product

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/dbShopWatch')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Danh sách sản phẩm
const products = [
  { name: "Rolex Submariner", price: 10000, description: "Luxury dive watch", image: "images/img-3.png" },
  { name: "Omega Speedmaster", price: 7500, description: "Moonwatch chronograph", image: "images/img-4.png" },
  { name: "Tag Heuer Carrera", price: 5000, description: "Elegant sports chronograph", image: "images/img-5.png" },
  { name: "Seiko Prospex", price: 1000, description: "Affordable dive watch", image: "images/img-3.png" },
  { name: "Patek Philippe Nautilus", price: 30000, description: "Prestigious luxury sports watch", image: "images/img-4.png" },
  { name: "Audemars Piguet Royal Oak", price: 40000, description: "Iconic octagonal design", image: "images/img-5.png" },
  { name: "Casio G-Shock", price: 300, description: "Durable and rugged digital watch", image: "images/img-3.png" },
  { name: "Cartier Tank", price: 8000, description: "Classic rectangular dress watch", image: "images/img-4.png" },
  { name: "Tissot Le Locle", price: 700, description: "Swiss-made dress watch", image: "images/img-5.png" },
  { name: "Hublot Big Bang", price: 15000, description: "Bold luxury chronograph", image: "images/img-3.png" }
];

// Seed Admin User
async function seedAdmin() {
  const adminUser = {
    username: "admin123",
    password: "admin", // Mật khẩu plain text
    role: "admin"
  };

  try {
    await User.deleteOne({ username: "admin" }); // Xóa admin cũ
    await User.deleteOne({ username: "admin123" });
    await User.create(adminUser); // Tạo admin mới
    console.log("Admin user created successfully!");
  } catch (err) {
    console.error("Error seeding admin user:", err);
  }
}

// Seed Products và Admin User
async function seedDB() {
  try {
    // Xóa dữ liệu cũ
    await Product.deleteMany({});
    await User.deleteMany({});

    // Chèn sản phẩm
    await Product.insertMany(products);
    console.log("Inserted products successfully");

    // Tạo tài khoản admin
    await seedAdmin();

    console.log("Database seeding completed successfully!");
  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    // Đóng kết nối MongoDB
    mongoose.connection.close();
  }
}

seedDB();
