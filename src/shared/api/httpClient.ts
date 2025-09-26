import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import type { AuthenticationResponse } from "@/entities/auth/model/types";
import { useAuthStore } from "@/entities/auth/model/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

interface FailedRequest {
  resolve: (value: AxiosResponse) => void;
  reject: (error: AxiosError) => void;
}

let isRefreshing = false;
const failedQueue: FailedRequest[] = [];

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

const processQueue = (error: AxiosError | null) => {
  while (failedQueue.length > 0) {
    const { resolve, reject } = failedQueue.shift()!;
    if (error) {
      reject(error);
    } else {
      resolve({} as AxiosResponse);
    }
  }
};

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken && config.headers && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config ?? {};

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken, user } = useAuthStore.getState();
      if (!refreshToken || !user) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post<AuthenticationResponse>(
          `${API_BASE_URL}/api/auth/refresh`,
          {
            userId: user.id,
            refreshToken,
            device: "web",
          }
        );

        useAuthStore.getState().setCredentials(refreshResponse.data);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
        }

        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { api };
