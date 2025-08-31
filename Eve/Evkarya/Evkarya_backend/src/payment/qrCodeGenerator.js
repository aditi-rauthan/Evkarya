const QRCode = require('qrcode');

/**
 * Generates a QR code for partial payment using order ID and amount.
 * 
 * @param {string} orderId - The unique identifier for the order.
 * @param {number} amount - The fixed partial payment amount.
 * @returns {Promise<string>} - A promise that resolves with the QR code data URL.
 */
const generateQRCode = (orderId, amount) => {
  return new Promise((resolve, reject) => {
    // Format the data to be encoded in the QR code
    const qrData = `order:${orderId},amount:${amount}`; // Example data: order ID and payment amount
    QRCode.toDataURL(qrData, (err, url) => {
      if (err) {
        reject('Error generating QR code');
      } else {
        resolve(url); // Returns the base64 image URL (data URI) for the QR code
      }
    });
  });
};

module.exports = { generateQRCode };
