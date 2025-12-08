const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    brand: {
        type: String
    },
    category: {
        type: String
    },
    tags: {
        type: [String]
    }
}, { timestamps: true });


ProductSchema.index({ tags: 1 });
ProductSchema.index({ category: 1 });

module.exports = mongoose.model('product', ProductSchema);