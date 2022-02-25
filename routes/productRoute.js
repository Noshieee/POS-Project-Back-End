const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// Getting All
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One
router.get('/:id', getProduct, (req, res) => {
  res.send(res.product);
});

//Creating One
router.post('/', async (req, res) => {
    const {title ,price ,category, img} = req.body
    const product = new Product({
        title,
        price,
        category,
        img
    });
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Updating One
router.put('/:id', getProduct, async (req, res) => {
    const {title, price, category, img} = req.body;
  if (title) { res.product.title = title };
  if (price) { res.product.price = price };
  if (category) { res.product.category = category };
  if (img) { res.product.img = img };
  try {
    const updatedProduct = await res.product.save();
    res.status(201).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Deleting One
router.delete('/:id', getProduct, async (req, res) => {
    try {
    await res.product.remove();
    res.json({ message: "Product Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//Get Product Function
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: "Cannot find Product" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.product = product;
  next();
}

module.exports = router;