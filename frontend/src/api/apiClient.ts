import axios from "axios";
import { clearAuthSession, getAccessToken, getRefreshToken, setAuthSession } from "../features/auth/authStorage";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axios(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getRefreshToken();

            if (refreshToken) {
                try {
                    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/refresh`, {
                        refreshToken,
                    });

                    if (response.status === 200) {
                        const newAccessToken = response.data.data.accessToken;
                        const newRefreshToken = response.data.data.refreshToken;
                        
                        setAuthSession(newAccessToken, newRefreshToken);
                        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        
                        processQueue(null, newAccessToken);
                        return axios(originalRequest);
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    clearAuthSession();
                } finally {
                    isRefreshing = false;
                }
            } else {
                processQueue(new Error("No refresh token"), null);
                isRefreshing = false;
                clearAuthSession();
            }

            const currentPath = `${window.location.pathname}${window.location.search}`;
            const isApi = window.location.pathname.startsWith('/admin');
            const loginPath = isApi ? '/admin/login' : '/login';

            if (window.location.pathname !== loginPath) {
                window.location.replace(`${loginPath}?redirect=${encodeURIComponent(currentPath)}`);
            }
        }
        return Promise.reject(error);
    }
);
