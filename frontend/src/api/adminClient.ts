import axios from "axios";
import { clearAuthSession, getAccessToken } from "../features/auth/authStorage";

export const adminClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

adminClient.interceptors.request.use((config) => {
    const token = getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

adminClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            clearAuthSession();

            const currentPath = `${window.location.pathname}${window.location.search}`;

            if (window.location.pathname !== "/login") {
                window.location.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
            }
        }
        return Promise.reject(error);
    }
);
