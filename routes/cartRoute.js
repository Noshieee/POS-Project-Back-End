const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { getProduct } = require('../middleware/finders');
const User = require('../models/userModels')

router.get('/', auth, (req, res) => {
    return res.send(req.user.cart)
});

router.put('/:id', { auth, getProduct }, async (req, res) => {
    const user = await user.findById(req.user._id);
    const inCart = user.cart.some(product => product._id == req.params.id)

    let updatedUser;

    if (inCart) {
        const product = user.cart.find((prod) => prod._id == req.params.id);
        product.qty += req.body.qty
            updatedUser = await user.save()
    } else {
        user.cart.push({ ...res.product, qty: req.body.qty })
            updatedUser = await user.save();
    }

    try {
        const access_token = jwt.sign(
            JSON.stringify(updatedUser),
            process.env.JWT_TOKEN_SECRET
        );
        res.status(201).json({ jwt: access_token, cart: updatedUser.cart });
    } catch(err) {
        res.status(500).json({ msg: err.message });
    }
})


module.exports = router;