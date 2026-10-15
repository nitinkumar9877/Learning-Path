import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to protected API requests
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const accessToken = sessionStorage.getItem("accessToken");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
