const express = require("express");
const router = express.Router();
const { updatePendingOrderByVendor } = require("../controllers/vendorOrder.controller");

// Vendor approve/decline kare
router.put("/vendor/order/:orderId", updatePendingOrderByVendor);

module.exports = router;
