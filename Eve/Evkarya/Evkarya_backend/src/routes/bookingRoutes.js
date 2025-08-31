const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking"); // Mongoose model banana padega

// Get bookings of a particular user
router.get("/user/:userId", async (req, res) => {
    try {
      const bookings = await Booking.find({ userId: req.params.userId }).populate("productId");
      res.json({ bookings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch user bookings" });
    }
  });
router.post("/", async (req, res) => {
  try {
    const { productId, userId, userName, userEmail } = req.body;

    const booking = new Booking({
      productId,
      userId,
      userName,
      userEmail,
    });

    await booking.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
});

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const Booking = require("../models/Booking");

// // Create a new booking (Pending Status)
// router.post("/", async (req, res) => {
//   try {
//     const { productId, userId, userName, userEmail } = req.body;

//     const newBooking = new Booking({
//       productId,
//       userId,
//       userName,
//       userEmail,
//       status: "Pending", // Always pending initially
//     });

//     await newBooking.save();

//     res.status(201).json({ message: "Booking created successfully, pending vendor confirmation." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to create booking" });
//   }
// });

// // Vendor Approve Booking
// router.put("/:id/approve", async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }
//     booking.status = "Confirmed";
//     await booking.save();
//     res.json({ message: "Booking approved" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to approve booking" });
//   }
// });

// // Vendor Reject Booking
// router.put("/:id/reject", async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }
//     booking.status = "Rejected";
//     await booking.save();
//     res.json({ message: "Booking rejected" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to reject booking" });
//   }
// });

// module.exports = router;
