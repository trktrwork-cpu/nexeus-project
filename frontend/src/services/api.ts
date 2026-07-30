import axios from "axios";

const api = axios.create({
  baseURL: "https://nexeus-project.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");

      if (window.location.hash !== "#/login") {
        window.location.hash = "#/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;