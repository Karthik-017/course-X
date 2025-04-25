import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

// Add token to requests (if needed)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (req.url.startsWith("/admin") && token) {
    req.headers.Authorization = token;
  } else if (req.url.startsWith("/user") || req.url.startsWith("/course")) {
    if (token) {
      req.headers.Authorization = token;
    }
  }

  return req;
});

export default API;
