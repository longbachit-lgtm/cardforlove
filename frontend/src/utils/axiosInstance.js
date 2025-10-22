// src/utils/axiosInstance.js
import axios from "axios";
import { VARIABLE } from "../Data/variable";

const axiosInstance = axios.create({
  baseURL: VARIABLE.url,
});

// Interceptor: thêm access token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["x_authorization"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: xử lý lỗi 401 và refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const accessToken = localStorage.getItem("accessToken");

        const res = await axios.post(
          `${VARIABLE.url}/auth/refresh`,
          {
            refreshToken: refreshToken,
          },
          {
            headers: { x_authorization: accessToken },
          }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Gửi lại request cũ với token mới
        originalRequest.headers["x_authorization"] = newAccessToken;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Refresh token failed", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
