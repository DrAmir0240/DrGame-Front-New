import { deleteCookie, getCookie, setAccess, setRefresh } from "@/utils/cookie";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getCookie("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes("/users/refresh-token/")) {
      console.error("Refresh token request failed");
      redirectToLogin();
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = getCookie("refresh_token");
      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}users/refresh-token/`,
          { refresh_token: refresh },
          {
            withCredentials: true,
            headers: {
              "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        const newAccessToken = refreshResponse.data?.access_token;

        if (!newAccessToken) {
          throw new Error("No access token in response");
        }

        setAccess(newAccessToken);
        if (refreshResponse.data?.refresh_token) {
          setRefresh(refreshResponse.data.refresh_token);
        }
        await new Promise((r) => setTimeout(r, 50));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError: unknown) {
        const err = refreshError as {
          response?: { status?: number; data?: unknown };
        };
        console.error("Refresh token error:", {
          status: err.response?.status,
          data: err.response?.data,
        });

        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

function redirectToLogin() {
  if (typeof window === "undefined") return;
  if (window.location.pathname === "/login") return;
  if (localStorage.getItem("auth_redirect")) return;

  deleteCookie("access_token");

  localStorage.setItem("auth_redirect", "true");
  window.location.href = "/login";
  setTimeout(() => {
    localStorage.removeItem("auth_redirect");
  }, 2000);
}

export default api;
