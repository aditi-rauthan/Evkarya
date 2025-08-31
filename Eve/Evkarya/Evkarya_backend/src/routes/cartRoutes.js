// const express = require('express');
// const router = express.Router();
// const {
//   addItemToCart,
//   getCartByUser,
//   removeItemFromCart,
//   updateItemQuantity
// } = require("../controllers/cartController");

// const { authenticate } = require('../middleware/authenticate');

// // ✅ Add item to cart
// router.post('/add-item', authenticate, addItemToCart);

// // ✅ Get user's cart
// router.get('/cart', authenticate, getCartByUser);

// // ✅ Update item quantity in cart (itemId = productId)
// router.put('/update-item/:itemId', authenticate, updateItemQuantity);

// // ✅ Remove item from cart (itemId = productId)
// router.delete('/remove-item/:itemId', authenticate, removeItemFromCart);

// module.exports = router;
