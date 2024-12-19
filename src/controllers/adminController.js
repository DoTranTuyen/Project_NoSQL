const Product = require('../models/Products');

exports.apiGetAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products); // Trả JSON để admin.html fetch hiển thị sản phẩm hiện có
  } catch (err) {
    console.error(err);
    res.status(500).json({error:"Server error"});
  }
};

exports.createProduct = async (req, res) => {
  const { name, price, description } = req.body;
  let image = req.body.image; // nếu không upload file, nhưng ở đây ta upload
  if (req.file) {
    image = 'images/' + req.file.filename; 
  }

  try {
    const product = new Product({ name, price, description, image });
    await product.save();
    res.redirect('/admin.html');
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.updateProduct = async (req, res) => {
  const { name, price, description } = req.body;
  let image = req.body.oldImage; // Lấy đường dẫn cũ
  if (req.file) {
    // nếu có upload file mới
    image = 'images/' + req.file.filename;
  }

  try {
    await Product.findByIdAndUpdate(req.params.id, { name, price, description, image });
    res.redirect('/admin.html');
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.redirect('/admin.html');
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const multer = require('multer');
const path = require('path');

// Cấu hình storage cho multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../public/images')); 
    // Lưu file vào public/images
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });
