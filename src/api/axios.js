import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env.VITE_BASE_URL || "http://localhost:4000") + "/api",
  withCredentials: true, // Include cookies in requests
});

//Attach auth token to every request if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }             
    return config;  
}, (error) => {
    return Promise.reject(error);
}
);  

export default api;