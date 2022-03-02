require('dotenv').config

const express = require('express');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/userModels')
const { getProduct, getUser } = require('../middleware/finders');
const Product = require('../models/productModel')
//Get cart
router.get('/', auth, (req, res) => {
    return res.send(req.user.cart)
});
//Post product
router.post('/:id', [auth, getProduct], async (req, res, next) => {
    let product = await Product.findById(req.params.id).lean();
    const user = await User.findById(req.user._id)
    let qty = req.body.qty;
    let {cart} = user;
    let added = false;

    cart.forEach((item) => {
        if (item._id.valueOf() == product._id.valueOf()) {
            item.qty += qty;
            added = true;
        }
    });
    if (!added) {
        cart.push({ ...product, qty });
    }
    try {

        let token = jwt.sign(
           { _id: user._id, cart: cart },
           process.env.JWT_TOKEN_SECRET,
           {
               expiresIn: 86400, //24 hours
           }
        );
        user.markModified("cart")
        const updatedUser = await user.save();
        res.status(200).json({ updatedUser, token });
    }   catch(err) {
        console.log(err)
    } next();
});
//Quantity change
router.put('/:id', [auth, getProduct], async (req, res) => {
    let product = await Product.findById(req.params.id).lean();
    const user = await User.findById(req.user._id)
    let qty = req.body.qty;
    console.log(user)
    let {cart} = user;
    let added = false;
    cart.forEach((item) => {
        if (item._id.valueOf() == product._id.valueOf()) {
            item.qty += qty;
            added = true;
        }
    });
    if (!added) {
        cart.push({ ...product, qty });
    }
    try {

        let token = jwt.sign(
           { _id: user._id, cart: cart },
           process.env.JWT_TOKEN_SECRET,
           {
               expiresIn: 86400, //24 hours
           }
        );
        const updatedUser = await user.save();
        res.status(200).json({ updatedUser, token });
    }   catch(err) {
        console.log(err)
    }
});

//Clear Cart
router.delete("/", [auth], async (req, res) => {
    let {cart} = req.updatedUser.cart ;
    try {
        cart = [];
        await user.save();
        res.json({ message: "cleared cart" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });

//Remove Product
router.delete("/:id", [auth, getUser], async (req, res) => {
    let {cart} = req.user.cart;
    console.log(cart)
    cart.forEach((inCart) => {
        if (inCart._id == req.params.id) {
        cart = cart.filter((inCartItems) => inCartItems._id != req.params.id);
        }
    }); console.log(inCart)
    try {
        req.user.cart = cart;

        const updated = res.user.save();
        let access_token = jwt.sign({ _id: req.user, cart }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: 86400, // 24 hours
        });
        res.json({ message: "Deleted product", updated, access_token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });

module.exports = router;