const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', (req, res) => {
    return res.send(req.user.cart)
});

router.put('/:id', async (req, res) => {
    const user = await user.findById(req.user._id);
    const inCart = user.cart.some(product => product._id == req.params.id)

    let updatedUser //stopped here
})

module.exports = router;