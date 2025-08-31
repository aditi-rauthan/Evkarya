// // src/models/cart.model.js
// const mongoose = require('mongoose');

// const cartItemSchema = new mongoose.Schema({
//     productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Post', // Assuming products are stored in the 'Post' collection
//         required: true
//     },
//     quantity: {
//         type: Number,
//         required: true,
//         default: 1
//     },
//     price: {
//         type: Number,
//         required: true
//     }
// }, { timestamps: true });

// const cartSchema = new mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     items: [cartItemSchema]
// }, { timestamps: true });

// module.exports = mongoose.model('Cart', cartSchema);
