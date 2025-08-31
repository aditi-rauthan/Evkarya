const Post = require("../models/post_model");

// GET /api/posts?category=Bridal Wear&minPrice=1000&maxPrice=5000&color=Red&size=M&sort=price_asc&page=1&limit=10
const getPostsByCategory = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      color,
      size,
      availability,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Filter by category
    if (category) filter.category = decodeURIComponent(category);

    // Filter by availability
    if (availability !== undefined) {
      filter.availability = availability === "true";
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Filter by color
    if (color) filter.color = color;

    // Filter by size
    if (size) {
      const sizeArray = Array.isArray(size) ? size : [size];
      filter.size = { $in: sizeArray };
    }

    // Sorting logic
    let sortOption = {};
    if (sort) {
      if (sort === "price_asc") sortOption.price = 1;
      else if (sort === "price_desc") sortOption.price = -1;
      else if (sort === "latest") sortOption.createdAt = -1;
    }

    // Pagination calculation
    const skip = (page - 1) * limit;

    // Fetch posts
    const posts = await Post.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // Total count (for frontend pagination UI)
    const total = await Post.countDocuments(filter);

    res.status(200).json({
      posts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts by category", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  getPostsByCategory,
};
