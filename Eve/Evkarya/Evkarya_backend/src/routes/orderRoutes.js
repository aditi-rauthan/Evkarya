const express = require("express");
const router = express.Router();
const { 
  createOrder,  
  getOrdersForVendor,
  confirmOrder,
  // handlePartialPayment,
  discardOrder,
  handleFullPayment,
} = require("../controllers/order");

// Book a service (this automatically creates an order)
router.post("/create", createOrder);

// Get all orders for a vendor
router.get("/:vendorId", getOrdersForVendor);


router.delete('/cancel/:orderId', discardOrder);

// Confirm an order (change status to 'waiting for partial payment')
router.put('/confirm/:orderId', confirmOrder);

// Handle partial payment
// router.put('/partial-payment/:orderId', handlePartialPayment);

// Handle full payment (update status to 'completed')
router.put('/full-payment/:orderId', handleFullPayment);

module.exports = router;
