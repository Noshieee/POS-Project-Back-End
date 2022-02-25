const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const auth = require('../middleware/auth')

// Getting All
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(201).send(products);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Getting One
router.get('/:id', auth, getProduct, (req, res, next) => {
  res.send(res.product);
});

//Creating A Product
router.post('/', auth, async (req, res, next) => {
    const {title ,price ,category, img} = req.body
    const product = new Product({
        title,
        price,
        category,
        creator: req.user._id,
        img
    });
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

//Updating A Product
router.put('/:id', auth, getProduct, async (req, res, next) => {
    if (req.user._id !== res.product.creator)
        res.status(400).json({ msg: "You are not that guy pal" })
    const {title, price, category, img} = req.body;
    if (title) { res.product.title = title };
    if (price) { res.product.price = price };
    if (category) { res.product.category = category };
    if (img) { res.product.img = img };
    try {
        const updatedProduct = await res.product.save();
        res.status(201).json(updatedProduct);
    } catch (err) {
        res.status(400).json({ msg: err.message });
  }
});

//Deleting One
router.delete('/:id', getProduct, async (req, res, next) => {
    if (req.user._id !== res.product.creator)
        res.status(400).json({ msg: "You are not that guy pal." })
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
    if (!product) {
    res.status(404).json({ message: "Cannot find the Product You are looking for" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  res.product = product;
  next();
}

module.exports = router;