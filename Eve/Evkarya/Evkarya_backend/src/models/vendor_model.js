const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["vendor", "user"], required: true },
    phone: { type: Number, required: true },
    acceptedTerms: { type: Boolean, required: true },

    // ✅ UPI ID (New field)
    upiId: { type: String, required: true },

    bio: { type: String, default: "" },
    availability: { type: Boolean, default: true },
    notAvailableDates: { type: [Date], default: [] },
    review: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },

    // Categories
    categories: {
      type: [String],
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
      ],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);
