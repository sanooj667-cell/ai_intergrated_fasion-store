import axios from "axios";

const baseURL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace(
  /\/+$/,
  "",
);

const api = axios.create({
  baseURL,
  timeout: 15000,
});

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
      return;
    }
    promise.resolve(token);
  });
  failedQueue = [];
};

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setAuthTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const refreshToken = getRefreshToken();

    if (
      status === 401 &&
      refreshToken &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes("/auth/token/refresh/")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${baseURL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        const newAccess = data?.access;
        const newRefresh = data?.refresh;

        if (!newAccess) {
          throw new Error("Failed to refresh access token.");
        }

        setAuthTokens({ access: newAccess, refresh: newRefresh || refreshToken });
        processQueue(null, newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        window.dispatchEvent(new Event("auth:token-refreshed"));

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthTokens();
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
