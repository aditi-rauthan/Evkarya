const express = require("express");
const {
  createVendor,
  editVendorProfile,
  getVendorWithPosts,
  getVendorWithServices,
} = require("../controllers/vendorController");

const router = express.Router();

// ✅ Create a new vendor
router.post("/", createVendor);

// ✏️ Edit vendor profile
router.put("/:vendorId", editVendorProfile);

// 📦 Get vendor profile + their posts
router.get("/:vendorId/posts", getVendorWithPosts);

router.get("/:vendorId/bio", getVendorWithServices);

module.exports = router;
