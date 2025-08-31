const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
    },
    discountPercent: {
      type: Number,
    },
    color: {
      type: String,
    },
    size: {
      type: [String],
    },

    // ✅ Refined category list
    category: {
      type: String,
      required: true,
      enum: [
        // Attire & Accessories
        "Bridal Wear", "Jewelry", "Makeup & Styling",

        // Venue & Decor
        "Decor & Venues", "Theme Parties", "Cake & Decorations",

        // Entertainment & Photography
        "Photography", "Entertainment", "Wedding Bands", "Choreographers", "Mehendi Artists",

        // Food & Desserts
        "Wedding Cakes", "Menu - Vegetarian", "Menu - Non-Vegetarian", "Menu - Buffet", "Menu - Custom",
        "Live Counters", "Desserts & Beverages",

        // Special Features
        "Themes & Decor",

        // Entertainment & Planning (for parties)
        "Party Entertainment", "Party Planners", "Return Gifts", "Magicians & Clowns",

        // DJ & Services
        "Wedding DJs", "Party DJs", "Corporate Events",

        // Setup & Equipment
        "Live Bands", "Sound & Lighting", "Dance Floors"
      ]
    },

    // ✅ New field added here
    availability: { type: Boolean, default: true },
    notAvailableDates: { type: [Date], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
