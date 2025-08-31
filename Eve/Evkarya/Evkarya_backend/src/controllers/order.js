const Order = require("../models/order_model");
const User = require("../login/userModel");
const Post = require("../models/post_model");
const Vendor=require("../models/vendor_model")
const { sendMail } = require('../mailer');
const { generateOrderUpdateMail } = require('../orderUpdateMail');
const { generateQRCode } = require('../payment/qrCodeGenerator');  // Assumed QR code generation helper

// ✅ Create a new order when a user books a service
const createOrder = async (req, res) => {
  try {
    const { userId, postId, totalAmount, eventDate, eventLocation, phoneNumber, requirements } = req.body;

    // Basic validation
    if (!eventLocation || !phoneNumber || !postId || !userId || !totalAmount || !eventDate) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Fetch post details
    const postDoc = await Post.findById(postId);
    if (!postDoc) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Create order
    const order = new Order({
      vendorId: postDoc.vendorId,
      postId: postDoc.id,
      category: postDoc.category,
      userId,
      userName: user.name,
      email: user.email,
      phoneNumber,
      eventDate,
      eventLocation,
      requirements: requirements || '',
      totalAmount,
      paidAmount: 0,
      remainingAmount: totalAmount,
      status: "pending",
    });

    await order.save();

    // Send confirmation email
    const mailContent = generateOrderUpdateMail('pending', user.name, order._id, order.eventDate.toDateString());
    await sendMail(user.email, 'Your EvKarya Order Has Been Created, wait till confirmation of vendor', mailContent);

    res.status(201).json({
      success: true,
      message: "Order created successfully. Waiting for vendor approval.",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Confirm order after vendor approval
const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch the order to confirm
    const confirmedOrder = await Order.findById(orderId).populate('userId', 'email name');
    if (!confirmedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update status of the confirmed order
    confirmedOrder.status = 'confirmed';
    await confirmedOrder.save();

    // ✅ Update post: set availability false + add eventDate to notAvailableDates
    await Post.findByIdAndUpdate(
      confirmedOrder.postId,
      {
        $set: { availability: false },
        $addToSet: { notAvailableDates: confirmedOrder.eventDate },
      },
      { new: true }
    );

    // Get the vendor's UPI ID
    const vendor = await Vendor.findById(confirmedOrder.vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    // ✅ Send confirmation email to confirmed user
    const confirmMail = generateOrderUpdateMail(
      'waiting for partial payment',
      confirmedOrder.userId.name,
      confirmedOrder._id,
      confirmedOrder.eventDate.toDateString(),
      vendor.upiId  // Use vendor.upiId directly
    );
    await sendMail(
      confirmedOrder.userId.email,
      'Your EvKarya Order Has Been Confirmed, Please Make Partial Payment',
      confirmMail
    );


    // ❌ Discard other pending orders for the same post
    const discardedOrders = await Order.find({
      postId: confirmedOrder.postId,
      _id: { $ne: confirmedOrder._id },
      status: 'pending',
    }).populate('userId', 'email name');

    for (const order of discardedOrders) {
      order.status = 'discarded';
      await order.save();

      const cancelMail = generateOrderUpdateMail(
        'discarded',
        order.userId.name,
        order._id,
        order.eventDate.toDateString(),
        vendor.upiId  // Pass the vendor's UPI ID here too
      );
      await sendMail(
        order.userId.email,
        'Your EvKarya Booking Request Has Been Declined',
        cancelMail
      );
    }

    res.status(200).json({
      success: true,
      message: 'Order confirmed. Other pending requests have been discarded. Post marked as unavailable.',
    });
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



// ✅ Handle partial payment
const handlePartialPayment = async (req, res) => {
  try {
    const { orderId, paymentAmount } = req.body;

    // Fetch the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update the paidAmount and remainingAmount
    order.paidAmount += paymentAmount;
    order.remainingAmount = order.totalAmount - order.paidAmount;

    // If full payment is made, update to 'completed', otherwise 'partially paid'
    if (order.paidAmount === order.totalAmount) {
      order.status = 'completed';
    } else if (order.paidAmount > 0) {
      order.status = 'partially paid';
    }

    await order.save();

    // Send email to user confirming the payment status update
    const paymentMailContent = generateOrderUpdateMail(order.status, order.userId.name, order._id, order.eventDate.toDateString());
    await sendMail(order.userId.email, `Your EvKarya Order Payment Status: ${order.status}`, paymentMailContent);

    res.status(200).json({
      success: true,
      message: `Payment received. Order status is now '${order.status}'`,
      order,
    });
  } catch (error) {
    console.error("Error processing partial payment:", error);
    res.status(500).json({ success: false, message: "Error processing partial payment" });
  }
};

// ✅ Handle full payment and mark order as completed
const handleFullPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Fetch the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update to 'completed' after full payment
    order.status = 'completed';
    await order.save();

    // Send email to user confirming the order completion
    const completedMailContent = generateOrderUpdateMail('completed', order.userId.name, order._id, order.eventDate.toDateString());
    await sendMail(order.userId.email, 'Your EvKarya Order is Completed', completedMailContent);

    res.status(200).json({
      success: true,
      message: `Order ID: ${orderId} has been completed.`,
    });
  } catch (error) {
    console.error("Error processing full payment:", error);
    res.status(500).json({ success: false, message: "Error processing full payment" });
  }
};


// ✅ Get orders for a specific vendor
const getOrdersForVendor = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;

    const orders = await Order.find({ vendorId })
      .populate('userId', 'name email')
      .populate('postId', 'title') // Ensure post title is available
      .lean();

    // Filter out orders with missing post (post deleted)
    const safeOrders = orders.filter(order => order.postId);

    if (!safeOrders.length) {
      return res.status(404).json({ success: false, message: 'No orders found for this vendor.' });
    }

    res.status(200).json({
      success: true,
      data: safeOrders,
    });
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const discardOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('userId', 'email name');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update order status to discarded
    order.status = 'discarded';
    await order.save();

    // ✅ Check if there are any other confirmed or pending orders for the same post
    const otherActiveOrders = await Order.find({
      postId: order.postId,
      _id: { $ne: order._id },
      status: { $in: ['pending', 'waiting for partial payment'] },
    });

    // If no other active orders, mark post as available again
    if (otherActiveOrders.length === 0) {
      await Post.findByIdAndUpdate(order.postId, { availability: true });
    }

    // Send discard email
    const discardMail = generateOrderUpdateMail(
      'discarded',
      order.userId.name,
      order._id,
      order.eventDate.toDateString()
    );
    await sendMail(
      order.userId.email,
      'Your EvKarya Booking Request Has Been Declined',
      discardMail
    );

    res.status(200).json({
      success: true,
      message: 'Order has been discarded and user notified.',
    });
  } catch (error) {
    console.error("Error discarding order:", error);
    res.status(500).json({ success: false, message: 'Error discarding order' });
  }
};



module.exports = {
  createOrder,
  confirmOrder,
  handlePartialPayment,
  handleFullPayment,
  getOrdersForVendor,
  discardOrder
};
