// const User = require("./userModel");
// const Vendor = require("./vendorModel");
// const jwt = require("jsonwebtoken");

// Register Controller
// const register = async (req, res) => {
//   try {
//     const { name, email, password, role, serviceType, priceRange, acceptedTerms } = req.body;

//     // Check if user or vendor already exists
//     const existingUser = await User.findOne({ email });
//     const existingVendor = await Vendor.findOne({ email });

//     if (existingUser || existingVendor) {
//       return res.status(400).json({ success: false, message: "Email already registered" });
//     }

//     if (role === "user") {
//       const user = await User.create({ name, email, password });
//       return res.status(201).json({ success: true, message: "User registered", user });
//     }

//     if (role === "vendor") {
//       if (!serviceType || !priceRange || !acceptedTerms) {
//         return res.status(400).json({ success: false, message: "Missing vendor fields" });
//       }

//       if (priceRange.min >= priceRange.max) {
//         return res.status(400).json({ success: false, message: "Invalid price range" });
//       }

//       const vendor = await Vendor.create({
//         name,
//         email,
//         password,
//         serviceType,
//         priceRange,
//         acceptedTerms,
//       });

//       return res.status(201).json({ success: true, message: "Vendor registered", vendor });
//     }

//     res.status(400).json({ success: false, message: "Invalid role" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // Login Controller
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check in User
//     const user = await User.findOne({ email });
//     if (user && user.password === password) {
//       return res.status(200).json({ success: true, message: "User login successful", user });
//     }

//     // Check in Vendor
//     const vendor = await Vendor.findOne({ email });
//     if (vendor && vendor.password === password) {
//       return res.status(200).json({ success: true, message: "Vendor login successful", vendor });
//     }

//     res.status(401).json({ success: false, message: "Invalid email or password" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// module.exports = { register, login };
