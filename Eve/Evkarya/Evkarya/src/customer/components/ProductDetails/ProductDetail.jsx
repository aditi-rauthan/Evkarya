import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {jwtDecode }from "jwt-decode";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("");

  const [formData, setFormData] = useState({
    phoneNumber: "",
    eventDate: "",
    eventLocation: "",
    requirements: ""
  });

  // Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5002/api/posts/${id}`);
        setPost(res.data.post);
      } catch (err) {
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // Decode user token and set user info
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo(decoded);
      } catch (err) {
        console.error("Token decode failed:", err);
      }
    } else {
      console.log("No token found in localStorage");
    }
  }, []);
  
  const handleBookNow = () => {
    if (!userInfo) {
      alert("Please login first!");
      navigate("/login");
      return;
    }
    setBookingStatus("");
    setShowModal(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    const { phoneNumber, eventDate, eventLocation, requirements } = formData;
    
    if (!phoneNumber || !eventDate || !eventLocation) {
      alert("Please fill all required fields.");
      return;
    }
  
    if (!userInfo) {
      alert("Please login to book!");
      return; // Prevent submitting without user info
    }
    console.log("userInfo:", userInfo);
    const payload = {
      userId: userInfo.id, // Ensure userId is available
      postId: post._id,
      phoneNumber,
      eventDate,
      eventLocation,
      requirements,
      totalAmount: post.discountedPrice || post.price,
    };
  
    console.log("Submitting booking payload:", payload);
    
    try {
      setBookingLoading(true);
      const response = await axios.post(
        "http://localhost:5002/api/orders/create",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Booking response:", response.data);
      setBookingStatus("pending");
      alert("Booking request sent successfully!");
      setShowModal(false);
      setFormData({ phoneNumber: "", eventDate: "", eventLocation: "", requirements: "" });
    } catch (err) {
      console.error("Booking failed status:", err.response?.status);
      console.error("Booking failed data:", err.response?.data);
      console.error("Booking error message:", err.message);
      alert("Failed to send booking request: " + (err.response?.data?.message || err.message));
      setBookingStatus("error");
    } finally {
      setBookingLoading(false);
    }
  };
  
  if (loading)
    return <div className="text-center pt-20 text-purple-600">Loading product details...</div>;
  if (error) return <div className="text-center pt-20 text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <div className="min-h-screen pt-24 px-6 md:px-20 bg-gray-50 mt-20">
      <div className="grid md:grid-cols-2 gap-10 bg-white rounded-xl shadow-lg p-6 md:p-10">
        <div className="flex items-center justify-center">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="rounded-xl max-h-[500px] object-cover"
          />
        </div>

        <div className="flex flex-col justify-between space-y-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">{post.title}</h1>
            <p className="text-gray-600 mt-2">{post.description}</p>

            <div className="mt-4 space-x-3">
              <span className="text-2xl font-bold text-purple-700">
                ₹{post.discountedPrice}
              </span>
              <span className="line-through text-gray-400 text-lg">₹{post.price}</span>
              <span className="text-green-600 font-medium text-md">({post.discountPercent}% OFF)</span>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Color:</span> {post.color}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Available Size:</span> {post.size.join(", ")}
            </p>

            <p
              className={`text-sm mt-2 font-medium ${
                post.availability ? "text-green-600" : "text-red-600"
              }`}
            >
              {post.availability ? "In Stock" : "Out of Stock"}
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">Vendor Details:</h2>
            {post.vendorId ? (
              <div>
                <Link to={`/vendor/${post.vendorId._id}`} className="text-purple-700 font-semibold hover:underline">
                  {post.vendorId.name}
                </Link>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-800">Email:</span> {post.vendorId.email || "N/A"}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Vendor information not available.</p>
            )}
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handleBookNow}
              disabled={!post.availability}
              className="border border-purple-700 text-purple-700 py-2 px-6 rounded-lg font-medium hover:bg-purple-100 transition"
            >
              {bookingStatus === "pending" ? "Pending..." : "Book Now"}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-xl shadow-xl space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Booking Information</h2>
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full border px-4 py-2 rounded"
                required
              />
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full border px-4 py-2 rounded"
                required
              />
              <textarea
                placeholder="Event Location (Full Address)"
                value={formData.eventLocation}
                onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                className="w-full border px-4 py-2 rounded"
                rows="4"
                required
              />
              <textarea
                placeholder="Anything else?"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full border px-4 py-2 rounded"
              />
              <button
                type="submit"
                disabled={bookingLoading}
                className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
              >
                {bookingLoading ? "Submitting..." : "Submit Booking"}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="ml-4 text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
