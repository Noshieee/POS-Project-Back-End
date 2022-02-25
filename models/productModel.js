const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: {
        type: Object,
        required: true,
        default: Date.now,
    },
    creator: {
        type: String,
        required: true,
    }

});

module.exports = mongoose.model("Product", productSchema);
