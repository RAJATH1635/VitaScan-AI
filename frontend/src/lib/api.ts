import axios from 'axios';
import { handleMockRequest } from './mockApi';

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1",
  timeout: 7000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Detect network failures (e.g. Mixed-Content block on Vercel, offline backend, DNS error, timeout)
    const isNetworkError =
      !error.response ||
      error.code === "ERR_NETWORK" ||
      error.code === "ECONNABORTED" ||
      (error.message && error.message.toLowerCase().includes("network error"));

    if (isNetworkError && typeof window !== "undefined") {
      const mockResult = await handleMockRequest(error.config);
      if (mockResult) {
        if (mockResult.status && mockResult.status >= 400) {
          const detailMsg =
            typeof mockResult.data?.detail === "object"
              ? mockResult.data?.detail?.message
              : mockResult.data?.detail;
          const mockErr: any = new Error(detailMsg || "Validation Error");
          mockErr.response = {
            status: mockResult.status,
            statusText: "Unprocessable Entity",
            data: mockResult.data,
            headers: {},
            config: error.config,
          };
          return Promise.reject(mockErr);
        }

        return Promise.resolve({
          data: mockResult.data,
          status: mockResult.status || 200,
          statusText: "OK",
          headers: {},
          config: error.config,
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;