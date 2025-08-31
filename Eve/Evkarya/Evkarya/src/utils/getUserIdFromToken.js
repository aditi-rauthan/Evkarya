import { jwtDecode } from "jwt-decode"; // Correct import for named export

export const getUserIdFromToken = (token) => {
  try {
    const decoded = jwtDecode(token); // Decode the JWT token
    console.log(decoded); // Log the decoded token to see its content
    return decoded._id; // or decoded.id, check what's stored in your token
  } catch (err) {
    console.error("Token decoding failed:", err);
    return null;
  }
};
