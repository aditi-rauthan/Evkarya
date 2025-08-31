const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const connectDB = require('./config/db');
const bookingRoutes = require("./routes/bookingRoutes");
// Import routes
const postRoutes = require("./routes/postRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const authRoutes = require("./login/authRoutes");
//const serviceRoutes = require("./routes/serviceRoutes");
const orderRoutes = require("./routes/orderRoutes");
const getPostRoute = require("./routes/getPostRoute");
//const cartRoutes=require("./routes/cartRoutes");
// Import authentication middleware
const {authenticate} = require("./middleware/authenticate");
const {authorizeRoles} = require("./middleware/authorizeRoles");

dotenv.config(); // Loads .env file (PORT, MONGODB URI, etc.)

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Enable CORS

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/posts", postRoutes);
// app.use("/api/vendors", authenticate, authorizeRoles('vendor'), vendorRoutes); // Vendor route with authorization
app.use("/api/vendors",  vendorRoutes); // Vendor route with authorization
app.use("/api/auth", authRoutes);
//app.use("/api/services", serviceRoutes);
app.use("/api/orders", orderRoutes); // Order route with authentication
//app.use("/api/orders", authenticate, orderRoutes); // Order route with authentication
app.use("/api", getPostRoute);
// app.use('/api/cart', cartRoutes);
// Default route
app.use("/api", require("./routes/vendorOrder.routes"));

app.use("/api/bookings", bookingRoutes);
app.get('/', (req, res) => {
    console.log("I'M inside home page route handler");
    res.send("Welcome to EvKarya post database");
});



// app.get("/api/test-auth", authenticate, (req, res) => {
//   res.json({
//     message: "You are authenticated!",
//     user: req.user,
//   });
// });
// app.get("/api/admin-data", authenticate, authorizeRoles("admin"), (req, res) => {
//   res.json({ message: "Admin data only" });
// });

// Catch-all error handler (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: err.message || "Server Error" });
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`✅ Server is running on port ${process.env.PORT}`);
});
