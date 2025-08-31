// const Cart = require("../models/cart_model");
// const Post = require("../models/post_model");
// const User =require("../login/userModel")
// const { RESPONSE_MESSAGES } = require("./constant");

// // =======================
// // ✅ CREATE CART
// // =======================
// // const createCart = async (req, res) => {
// //   try {
// //     const { email} = req.body;
// //      const userId =await User.findOne({ email });
// //     if (!userId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "User ID is required",
// //       });
// //     }

// //     const cart = await Cart.create({ userId });
// //     res.status(201).json({
// //       success: true,
// //       message: "Cart created successfully",
// //       cart,
// //     });
// //   } catch (error) {
// //     console.error("Error creating cart:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error creating cart",
// //       error: error.message,
// //     });
// //   }
// // };

// // =======================
// // ✅ ADD ITEM TO CART
// // =======================
// const addItemToCart = async (req, res) => {
//   const { userId, productId, quantity } = req.body;

//   try {
//     if (!userId || !productId || !quantity) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields: userId, productId, and quantity",
//       });
//     }

//     const cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found, creating a new one",
//       });
//     }

//     const product = await Post.findById(productId);
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     const priceToUse = product.discountedPrice || product.price;

//     const existingItemIndex = cart.items.findIndex(
//       item => item.productId.toString() === productId
//     );

//     if (existingItemIndex >= 0) {
//       // Product exists, update quantity only
//       cart.items[existingItemIndex].quantity += quantity;
//     } else {
//       // New product entry with price
//       cart.items.push({
//         productId,
//         quantity,
//         price: priceToUse,
//       });
//     }

//     await cart.save();

//     res.status(200).json({
//       success: true,
//       message: "Item added to cart successfully",
//       cart,
//     });
//   } catch (error) {
//     console.error("Error adding item to cart:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error adding item to cart",
//       error: error.message,
//     });
//   }
// };



// // =======================
// // ✅ GET USER CART
// // =======================
// const getCartByUser = async (req, res) => {
//   const userId = req.user._id;

//   try {
//     const cart = await Cart.findOne({ user: userId }).populate("items.productId");
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Cart fetched successfully",
//       cart,
//     });
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching cart",
//       error: error.message,
//     });
//   }
// };

// // =======================
// // ✅ REMOVE ITEM FROM CART
// // =======================
// const removeItemFromCart = async (req, res) => {
//   const userId = req.user._id;
//   const productId = req.params.itemId;

//   try {
//     const cart = await Cart.findOne({ user: userId });
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found",
//       });
//     }

//     const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
//     if (itemIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: "Item not found in the cart",
//       });
//     }

//     cart.items.splice(itemIndex, 1);
//     await cart.save();

//     res.status(200).json({
//       success: true,
//       message: "Item removed from cart successfully",
//       cart,
//     });
//   } catch (error) {
//     console.error("Error removing item from cart:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error removing item from cart",
//       error: error.message,
//     });
//   }
// };


// // =======================
// // ✅ UPDATE ITEM QUANTITY
// // =======================
// const updateItemQuantity = async (req, res) => {
//   const userId = req.user._id;
//   const productId = req.params.itemId;
//   const { quantity } = req.body;

//   try {
//     if (!quantity) {
//       return res.status(400).json({
//         success: false,
//         message: "Quantity is required",
//       });
//     }

//     const cart = await Cart.findOne({ user: userId });
//     if (!cart) {
//       return res.status(404).json({
//         success: false,
//         message: "Cart not found",
//       });
//     }

//     const item = cart.items.find(item => item.productId.toString() === productId);
//     if (!item) {
//       return res.status(404).json({
//         success: false,
//         message: "Item not found in the cart",
//       });
//     }

//     item.quantity = quantity;
//     await cart.save();

//     res.status(200).json({
//       success: true,
//       message: "Item quantity updated successfully",
//       cart,
//     });
//   } catch (error) {
//     console.error("Error updating item quantity:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error updating item quantity",
//       error: error.message,
//     });
//   }
// };
// // =======================
// // ✅ CLEAR CART (Optional)
// // =======================
// // const clearCart = async (req, res) => {
// //   const { userId } = req.body;

// //   try {
// //     if (!userId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "User ID is required",
// //       });
// //     }

// //     const cart = await Cart.findOne({ userId });
// //     if (!cart) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Cart not found",
// //       });
// //     }

// //     cart.items = [];
// //     await cart.save();

// //     res.status(200).json({
// //       success: true,
// //       message: "Cart cleared successfully",
// //       cart,
// //     });
// //   } catch (error) {
// //     console.error("Error clearing cart:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Error clearing cart",
// //       error: error.message,
// //     });
// //   }
// // };

// // cartController.js
// module.exports = {
//     addItemToCart,
//     getCartByUser,
//     removeItemFromCart,
//     updateItemQuantity,
//     // clearCart,
//   };
  
