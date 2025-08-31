const express = require("express");
const { createPost, editPost, deletePost,getPostsByCategory, getVendorPosts,getCategories,getSinglePostById } = require("../controllers/postController"); // Import getPosts from controller
const router = express.Router();

// =======================
// 🛠️ GET POST (VENDOR)
// =======================
router.get("/vendor/:vendorId", getVendorPosts);
// Using the controller function to fetch posts

// =======================
// 🆕 CREATE A NEW POST
// =======================
router.post("/", createPost);

// =======================
// ✏️ EDIT A POST
// =======================
router.put("/:postId", editPost);

// =======================
// 🗑️ DELETE A POST
// =======================
router.delete("/:postId", deletePost);

// =======================
// 📄 GET SINGLE POST BY ID
// =======================
router.get("/:postId", getSinglePostById);

router.get("/categories", getCategories); 

router.get("/", getPostsByCategory); 

module.exports = router;
