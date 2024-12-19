const Product = require('../models/Products');

exports.apiGetProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products); // Trả về JSON để front-end fetch
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.apiGetProductDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if(!product) return res.status(404).json({error:"Not found"});
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:"Server error" });
  }
};
