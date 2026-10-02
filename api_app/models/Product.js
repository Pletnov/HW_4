const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    categoryId: {
        ref: 'categories',
        type: Schema.Types.ObjectId
    },
    userId: {
        ref: 'users',
        type: Schema.Types.ObjectId
    }
});
module.exports = mongoose.model('products', productSchema);