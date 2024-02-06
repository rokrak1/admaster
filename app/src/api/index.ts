import axios from "axios";
import { me } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
});

api.interceptors.response.use(undefined, async (error) => {
  const originalRequest = error.config;

  // Check if we should attempt a token refresh
  if (error.response.data.detail.code === "reauthenticate") {
    originalRequest._retry = true; // Mark this request as retried

    try {
      const [_, err] = await me(); // Attempt to refresh the token
      if (err) {
        return Promise.reject(err);
      }
      return api(originalRequest); // Retry the original request
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
});

export default api;
