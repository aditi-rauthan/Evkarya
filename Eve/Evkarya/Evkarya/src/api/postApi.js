import axios from "axios";

// ✅ Base URL tu apne hisaab se change kar lena
const API = axios.create({ baseURL: "http://localhost:5002" });

export const fetchCategories = () => API.get("/api/post/categories");
export const fetchPostsByCategory = (category) =>
  API.get(`/api/post/by-category?category=${category}`);
