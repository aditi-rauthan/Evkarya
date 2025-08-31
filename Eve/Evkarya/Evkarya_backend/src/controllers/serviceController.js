// const Service = require("../models/service_model");

// // ============================
// // ✅ Create a New Service
// // ============================
// const createService = async (req, res) => {
//   try {
//     const {
//       vendorId,          // passed in the request body
//       name,
//       description,
//       price,
//       image,
//       isAvailable,
//       notAvailableDates,
//     } = req.body;

//     // 🔍 Basic validation
//     if (!vendorId || !name || !price) {
//       return res.status(400).json({
//         success: false,
//         message: "Vendor ID, name and price are required.",
//       });
//     }

//     const service = await Service.create({
//       vendorId,
//       name,
//       description,
//       price,
//       image,
//       isAvailable,
//       notAvailableDates,
//     });

//     res.status(201).json({ success: true, service });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create service",
//       error,
//     });
//   }
// };

// // ============================
// // 📦 Get All Services of a Vendor
// // ============================
// const getVendorServices = async (req, res) => {
//   try {
//     const vendorId = req.params.vendorId;

//     const services = await Service.find({ vendorId });

//     res.status(200).json({ success: true, services });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch services",
//       error,
//     });
//   }
// };

// // ============================
// // ✏️ Update a Service by ID
// // ============================
// const updateService = async (req, res) => {
//   try {
//     const serviceId = req.params.serviceId;
//     const updates = req.body;

//     const updatedService = await Service.findByIdAndUpdate(
//       serviceId,
//       updates,
//       { new: true }
//     );

//     if (!updatedService) {
//       return res.status(404).json({
//         success: false,
//         message: "Service not found",
//       });
//     }

//     res.status(200).json({ success: true, updatedService });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update service",
//       error,
//     });
//   }
// };

// module.exports = {
//   createService,
//   getVendorServices,
//   updateService,
// };
