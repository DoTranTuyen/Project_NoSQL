// seedAdmin.js (hoặc seedDB.js)
const User = require('./models/User');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/dbShopWatch')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

async function seedAdmin() {
  await User.deleteOne({ username: 'admin' });
  await User.create({ username: 'admin', password: 'admin123', role: 'admin' }); // Plaintext
  console.log('Admin user created');
  mongoose.connection.close();
}

seedAdmin();
