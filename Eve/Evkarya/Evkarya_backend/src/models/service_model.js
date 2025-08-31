// const mongoose = require("mongoose");

// const serviceSchema = new mongoose.Schema(
//   {
//     vendorId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Vendor",
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     description: String,
//     image: String,
//     price: {
//       type: Number,
//       required: true,
//     },
//     isAvailable: {
//       type: Boolean,
//       default: true,
//     },
//     notAvailableDates: {
//       type: [Date],
//       default: [],
//     },
//     averageRating: {
//       type: Number,
//       default: 0,
//     },
//     totalReviews: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Service", serviceSchema);
